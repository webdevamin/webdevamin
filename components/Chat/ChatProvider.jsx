'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cleanChatConfig } from '../../utils/chat.mjs';

// The AI chat's entry points on every page: an ask bar at the bottom centre (desktop), an ask button at the bottom
// right (phones) and a link in the quote window. Nothing shows until webdevamin.app says the chatbot is on for this
// site. The conversation itself (ChatPanel) only loads when a visitor opens it.

const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

// The quote page shows only its wizard; the chat opens there from the link in the wizard.
const BARE_PAGES = ['/nl/offerte'];

const ChatContext = createContext(null);

export const useChat = () => useContext(ChatContext);

// Example questions take turns in an empty field, once, so visitors see what they can ask. Nothing moves while the
// field is used or when the visitor prefers less motion.
function useRotatingText(base, examples, paused) {
    const [index, setIndex] = useState(0);
    const count = examples.length;
    useEffect(() => {
        if (paused || !count || index > count) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = window.setTimeout(() => setIndex(current => current + 1), index === 0 ? 4000 : 3000);
        return () => window.clearTimeout(timer);
    }, [index, count, paused]);
    return index > 0 && index <= count ? examples[index - 1] : base;
}

export default function ChatProvider({ children, locale, texts }) {
    const [config, setConfig] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [request, setRequest] = useState(null);
    const loading = useRef(null);

    const load = useCallback(() => {
        if (loading.current === locale) return;
        loading.current = locale;
        fetch(`/api/chat?locale=${locale}`)
            .then(response => response.json())
            .then(value => setConfig(cleanChatConfig(value)))
            .catch(() => setConfig({ available: false }));
    }, [locale]);

    // The texts load when the browser has time, so the page itself comes first.
    useEffect(() => {
        const idle = 'requestIdleCallback' in window ? window.requestIdleCallback(load, { timeout: 2500 }) : null;
        const timer = idle === null ? window.setTimeout(load, 1200) : null;
        return () => {
            if (idle !== null) window.cancelIdleCallback(idle);
            if (timer !== null) window.clearTimeout(timer);
        };
    }, [load]);

    const open = useCallback((question, send = false) => {
        load();
        setMounted(true);
        setOpen(true);
        if (question?.trim()) setRequest({ question: question.trim(), send, id: Date.now() });
    }, [load]);

    const shown = config?.available === true;
    const bare = BARE_PAGES.includes(usePathname());
    const value = useMemo(() => ({ shown, open }), [shown, open]);

    return (
        <ChatContext.Provider value={value}>
            {children}
            {shown && !bare && (
                <>
                    {/* Keeps the end of the footer readable above the ask bar and the ask button. */}
                    <div className="h-24 bg-dark" aria-hidden="true" />
                    <ChatDock config={config} texts={texts} hidden={isOpen} onOpen={open} />
                    <button type="button" onClick={() => open()} aria-haspopup="dialog"
                        className={`${isOpen ? 'hidden' : 'flex md:hidden'} fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 min-h-12 items-center gap-2 rounded-full border-2 border-dark bg-light px-5 font-semibold text-dark shadow-bold_r_sm`}>
                        <Sparkles aria-hidden="true" className="h-5 w-5 text-theme_darker" />
                        {texts.launcher}
                    </button>
                </>
            )}
            {mounted && config && (
                <ChatPanel config={config} texts={texts} locale={locale} open={isOpen} onClose={() => setOpen(false)} request={request} />
            )}
        </ChatContext.Provider>
    );
}

// From 768 px: a field at the bottom centre of every page. Clicking it opens the chat; typing and Enter asks right away.
function ChatDock({ config, texts, hidden, onOpen }) {
    const [draft, setDraft] = useState('');
    const [active, setActive] = useState(false);
    const placeholder = useRotatingText(config.placeholder, config.suggestions, active || Boolean(draft));

    return (
        <form
            onSubmit={event => {
                event.preventDefault();
                onOpen(draft, true);
                setDraft('');
            }}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            className={`${hidden ? 'hidden' : 'hidden md:flex'} fixed bottom-5 left-1/2 z-40 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-full border-2 border-dark bg-light py-1.5 pl-5 pr-1.5 shadow-bold_r_sm focus-within:border-theme_darker`}
        >
            <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-theme_darker" />
            <label htmlFor="chat-dock-input" className="sr-only">{texts.inputLabel.replace('{name}', config.name)}</label>
            <input
                id="chat-dock-input"
                value={draft}
                onChange={event => setDraft(event.target.value)}
                // A click opens the whole chat. Keyboard users can type here first and press Enter.
                onPointerDown={event => {
                    event.preventDefault();
                    onOpen(draft);
                    setDraft('');
                }}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                placeholder={placeholder}
                maxLength={1000}
                autoComplete="off"
                enterKeyHint="send"
                className="min-h-11 min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-dark outline-none placeholder:text-dark/60 focus:ring-0"
            />
            <button type="submit" aria-label={texts.send} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-dark text-light hover:bg-theme_darker">
                <Send aria-hidden="true" className="h-5 w-5" />
            </button>
        </form>
    );
}
