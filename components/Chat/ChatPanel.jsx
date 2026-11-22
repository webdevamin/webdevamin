'use client';

import NextLink from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Phone, Send, Sparkles, X } from 'lucide-react';
import { Link } from '../../src/i18n/navigation';
import { CHAT_LIMITS, chatLink, cleanChatAction, parseChatMarkdown, quotePrefill, readChatEvents } from '../../utils/chat.mjs';
import { openQuote } from '../QuoteModal';

// The conversation. Kept in the browser tab (session storage), so it survives a reload and a page change; "New chat"
// starts over. On phones it fills the screen as a dialog; from 768 px it opens above the ask bar. When the assistant
// prepares a request, one click opens the quote window with what the visitor already said.

const ERRORS = ['limited', 'busy', 'full', 'unavailable', 'invalid', 'error'];
const STORAGE_KEY = 'webdevamin-chat';
const PHONE = 'tel:+32470930916';

function stored() {
    try {
        const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
        if (value && typeof value.id === 'string' && Array.isArray(value.messages)) return value;
    } catch {}
    return null;
}

function store(conversation) {
    try {
        const messages = conversation.messages.filter(message => !message.pending).slice(-CHAT_LIMITS.maxMessages * 2);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id: conversation.id, messages }));
    } catch {}
}

const linkClass = 'text-base font-semibold text-theme_darker underline underline-offset-4';

// The answer's Markdown as React elements. Pages of this site open inside the site.
function Answer({ text, onNavigate }) {
    const inline = parts => parts.map((part, index) => {
        if (part.type === 'strong') return <strong key={index}>{part.text}</strong>;
        if (part.type === 'link') {
            const link = chatLink(part.href, window.location.origin);
            if (link?.kind === 'page') return <NextLink key={index} href={link.path} onClick={onNavigate} className={linkClass}>{part.text}</NextLink>;
            if (link?.kind === 'direct') return <a key={index} href={link.href} className={linkClass}>{part.text}</a>;
        }
        return <span key={index} className="text-base">{part.text}</span>;
    });
    return (
        <div className="space-y-2.5">
            {parseChatMarkdown(text).map((block, index) => block.type === 'p' ? (
                <div key={index}>
                    {block.lines.map((line, number) => (
                        <span key={number} className="text-base">{number > 0 && <br />}{inline(line)}</span>
                    ))}
                </div>
            ) : (
                block.type === 'ul' ? (
                    <ul key={index} className="list-disc space-y-1 pl-5">
                        {block.items.map((item, number) => <li key={number}>{inline(item)}</li>)}
                    </ul>
                ) : (
                    <ol key={index} className="list-decimal space-y-1 pl-5">
                        {block.items.map((item, number) => <li key={number}>{inline(item)}</li>)}
                    </ol>
                )
            ))}
        </div>
    );
}

export default function ChatPanel({ config, texts, locale, open, onClose, request }) {
    const titleId = useId();
    const noteId = useId();
    const inputId = useId();
    const dialog = useRef(null);
    const input = useRef(null);
    const scroller = useRef(null);
    const opener = useRef(null);
    const reply = useRef(null);
    const handled = useRef(0);
    const [conversation, setConversation] = useState(() => stored() ?? { id: crypto.randomUUID(), messages: [] });
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const ready = config.available ? config : null;
    const { messages } = conversation;

    const patch = (id, change) => setConversation(current => ({
        ...current, messages: current.messages.map(message => message.id === id ? change(message) : message),
    }));

    async function send(text) {
        const question = text.trim().slice(0, CHAT_LIMITS.message);
        if (!question || busy || !ready) return;
        const requestId = crypto.randomUUID();
        const answerId = `${requestId}-answer`;
        const outcome = { error: null, text: '', form: false };
        setDraft('');
        setBusy(true);
        setConversation(current => ({
            ...current,
            messages: [...current.messages, { id: requestId, role: 'user', text: question }, { id: answerId, role: 'assistant', text: '', pending: true }],
        }));
        const controller = new AbortController();
        reply.current = controller;
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    conversationId: conversation.id,
                    requestId,
                    message: question,
                    locale,
                    page: { path: window.location.pathname, title: document.title },
                    actions: ready.actions,
                }),
            });
            if (!response.ok || !response.body) {
                const data = await response.json().catch(() => ({}));
                outcome.error = ERRORS.includes(data.error) ? data.error : 'error';
            } else {
                await readChatEvents(response.body, event => {
                    if (event.type === 'delta' && typeof event.text === 'string') {
                        outcome.text += event.text;
                        patch(answerId, message => ({ ...message, text: message.text + event.text }));
                    }
                    if (event.type === 'action') {
                        const action = cleanChatAction(event.action);
                        outcome.form = outcome.form || Boolean(action);
                        if (action) patch(answerId, message => ({ ...message, action }));
                    }
                    if (event.type === 'completed') {
                        const answer = event.message?.answer;
                        if (typeof answer === 'string') outcome.text = answer;
                        patch(answerId, message => ({ ...message, text: typeof answer === 'string' ? answer : message.text, pending: false }));
                    }
                    if (event.type === 'error') outcome.error = event.error === 'monthly_limit' ? 'unavailable' : event.error === 'rate_limit' ? 'busy' : 'error';
                });
            }
        } catch {
            if (!controller.signal.aborted) outcome.error = 'error';
        }
        if (controller.signal.aborted) return;
        patch(answerId, message => ({ ...message, pending: false, error: outcome.error ?? undefined }));
        setBusy(false);
        reply.current = null;
        // Screen readers hear the finished answer once, not every word while it arrives.
        setAnnouncement(outcome.error ? texts.errors[outcome.error] : outcome.text || (outcome.form ? texts.formIntro : ''));
    }

    const sendRef = useRef(send);
    useEffect(() => {
        sendRef.current = send;
    });

    // A question from the ask bar: asked right away, or put in the field.
    useEffect(() => {
        if (!request || request.id === handled.current) return;
        handled.current = request.id;
        const timer = window.setTimeout(() => (request.send ? sendRef.current(request.question) : setDraft(request.question)), 0);
        return () => window.clearTimeout(timer);
    }, [request]);

    useEffect(() => store(conversation), [conversation]);

    useEffect(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
    }, [messages]);

    // Leaving the page stops a running answer and releases the page's scrolling.
    useEffect(() => () => {
        reply.current?.abort();
        document.documentElement.style.overflow = '';
    }, []);

    // Phones get a full-screen dialog that keeps focus inside; larger screens a panel above the page.
    useEffect(() => {
        const element = dialog.current;
        if (!element) return;
        if (open && !element.open) {
            opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            if (window.matchMedia('(min-width: 768px)').matches) element.show();
            else {
                element.showModal();
                document.documentElement.style.overflow = 'hidden';
            }
            requestAnimationFrame(() => input.current?.focus());
        } else if (!open && element.open) {
            element.close();
        }
    }, [open]);

    function closed() {
        document.documentElement.style.overflow = '';
        onClose();
        opener.current?.focus();
    }

    function newConversation() {
        reply.current?.abort();
        reply.current = null;
        setBusy(false);
        setConversation({ id: crypto.randomUUID(), messages: [] });
        input.current?.focus();
    }

    // On phones the chat covers the page, so it closes when a link opens a page of the site.
    function navigated() {
        if (!window.matchMedia('(min-width: 768px)').matches) dialog.current?.close();
    }

    // The quote window takes over with what the visitor already said in the chat.
    function completeRequest(action) {
        dialog.current?.close();
        openQuote({ prefill: quotePrefill(action), source: 'chat' });
    }

    const fallback = (
        <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => { dialog.current?.close(); openQuote({}); }}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-dark bg-theme px-4 font-semibold text-dark">
                {texts.quoteButton}
            </button>
            {texts.call && (
                <a href={PHONE} className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-dark px-4 text-base font-semibold text-dark">
                    <Phone aria-hidden="true" className="h-4 w-4" />{texts.call}
                </a>
            )}
        </div>
    );

    return (
        <dialog
            ref={dialog}
            aria-labelledby={titleId}
            aria-describedby={noteId}
            onClose={closed}
            onKeyDown={event => {
                if (event.key === 'Escape') {
                    event.preventDefault();
                    dialog.current?.close();
                }
            }}
            className="ph-no-capture ph-mask m-0 h-dvh max-h-none w-screen max-w-none bg-light p-0 text-left text-base text-dark backdrop:bg-dark/50 open:flex md:fixed md:inset-x-0 md:bottom-5 md:top-auto md:z-50 md:mx-auto md:h-auto md:max-h-[min(70dvh,44rem)] md:w-[min(40rem,calc(100vw-2rem))] md:rounded-xl md:border-2 md:border-dark md:shadow-bold_r_sm"
        >
            <div className="flex min-h-0 w-full flex-col pb-[env(safe-area-inset-bottom)] md:pb-0">
                <header className="flex items-center gap-3 border-b border-dark/15 bg-theme/10 px-4 py-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-dark text-light">
                        <Sparkles aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 id={titleId} className="!m-0 truncate !text-xl !normal-case font_quicksand">{ready?.name ?? 'Webdevamin'}</h2>
                        <div className="text-sm text-dark/70">{texts.aiLabel}</div>
                    </div>
                    {messages.length > 0 && (
                        <button type="button" onClick={newConversation} className="min-h-11 rounded px-3 text-sm font-semibold hover:bg-dark/10">
                            {texts.newChat}
                        </button>
                    )}
                    <button type="button" onClick={() => dialog.current?.close()} aria-label={texts.close}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-dark/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme_darker">
                        <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                </header>

                <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
                    {ready ? (
                        <ol aria-label={texts.conversation} className="space-y-4">
                            <li className="max-w-[90%] whitespace-pre-line rounded-lg rounded-tl-sm bg-white px-4 py-3 shadow-sm">{ready.welcome}</li>
                            {messages.map(message => message.role === 'user' ? (
                                <li key={message.id} className="ml-auto w-fit max-w-[85%] whitespace-pre-line rounded-lg rounded-br-sm bg-dark px-4 py-3 text-light [overflow-wrap:anywhere]">
                                    {message.text}
                                </li>
                            ) : (
                                <li key={message.id} className="max-w-[92%] [overflow-wrap:anywhere]">
                                    {(message.text || message.pending) && (
                                        <div className="rounded-lg rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                                            {message.text ? <Answer text={message.text} onNavigate={navigated} /> : <span className="text-base text-dark/60">{texts.thinking}</span>}
                                        </div>
                                    )}
                                    {message.action && (
                                        <div className="mt-2 rounded-lg border-2 border-theme bg-theme/5 px-4 py-4">
                                            <div>{texts.formIntro}</div>
                                            <button type="button" onClick={() => completeRequest(message.action)}
                                                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-dark bg-theme px-4 font-semibold uppercase tracking-wider text-dark shadow-bold_r_xs hover:shadow-zero">
                                                {texts.formButton}<ArrowRight aria-hidden="true" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    {message.error && (
                                        <div role="alert" className="mt-2">
                                            <div className="font-semibold text-theme_darker">{texts.errors[message.error]}</div>
                                            {message.error === 'full' && (
                                                <button type="button" onClick={newConversation} className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-dark px-4 font-semibold text-light">
                                                    {texts.newChat}
                                                </button>
                                            )}
                                            {message.error === 'unavailable' && fallback}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <div role="status">
                            <div>{texts.unavailable}</div>
                            {fallback}
                        </div>
                    )}
                    {ready && !messages.length && ready.suggestions.length > 0 && (
                        <div className="mt-5">
                            <div className="text-sm font-semibold text-dark/70">{texts.suggestions}</div>
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {ready.suggestions.map(suggestion => (
                                    <li key={suggestion}>
                                        <button type="button" onClick={() => void send(suggestion)}
                                            className="min-h-11 rounded-full border border-dark/30 bg-white px-4 py-2 text-left text-[0.9375rem] leading-snug hover:border-dark hover:bg-theme/10">
                                            {suggestion}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {ready && (
                    <form onSubmit={event => { event.preventDefault(); void send(draft); }} className="border-t border-dark/15 px-4 pb-3 pt-3">
                        <div className="flex items-center gap-2">
                            <label htmlFor={inputId} className="sr-only">{texts.inputLabel.replace('{name}', ready.name)}</label>
                            <input
                                ref={input}
                                id={inputId}
                                value={draft}
                                onChange={event => setDraft(event.target.value)}
                                placeholder={ready.placeholder}
                                maxLength={CHAT_LIMITS.message}
                                autoComplete="off"
                                enterKeyHint="send"
                                className="min-h-12 min-w-0 flex-1 rounded px-4 border-dark border-opacity-25 bg-slate-50 text-base focus:border-theme_darker focus:ring-theme_darker"
                            />
                            <button type="submit" disabled={busy || !draft.trim()} aria-label={texts.send}
                                className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-dark text-light hover:bg-theme_darker disabled:opacity-50">
                                <Send aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>
                        <div id={noteId} className="mt-2 text-sm leading-snug text-dark/70">
                            {texts.disclosure}{' '}
                            <Link href="/policy" onClick={navigated} className="text-sm font-semibold text-dark underline underline-offset-4">{texts.privacyLink}</Link>
                        </div>
                    </form>
                )}
                <div className="sr-only" aria-live="polite">{announcement}</div>
            </div>
        </dialog>
    );
}
