'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, Phone, Sparkles, X } from 'lucide-react';
import posthog from 'posthog-js';
import { Link } from '../src/i18n/navigation';
import Alert from './Alert';
import ButtonOne from './Buttons/ButtonOne';
import { useChat } from './Chat/ChatProvider';

// The quote window, on every page. It opens from any link with ?offerte in it (the quote buttons, also on other
// websites, for example https://webdevamin.com/nl?offerte), and from the AI chat. The value names the package
// (?offerte=premium), which picks the matching answer and is sent along with the request.

const PARAM = 'offerte';
const OPEN_EVENT = 'webdevamin:quote';
const NEEDS = ['website', 'booking', 'custom', 'onetime', 'unsure'];
const emptyForm = { name: '', email: '', phone: '', message: '', website: '' };

// Opens the window from code, for example from the chat with what the visitor already said: { prefill, source }.
export const openQuote = (detail = {}) => window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail }));

const needFor = (value = '') => {
    if (/eenmalig|one-time/.test(value)) return 'onetime';
    if (/op-maat|custom/.test(value)) return 'custom';
    if (/premium|-pro$/.test(value)) return 'booking';
    if (/standaard|^aannemer$|^isolatiebedrijf$/.test(value)) return 'website';
    return '';
};

const quoteParam = () => new URL(window.location.href).searchParams.get(PARAM);

export default function QuoteModal({ texts }) {
    const chat = useChat();
    const dialog = useRef(null);
    const opener = useRef(null);
    const previousOverflow = useRef(null);
    const inFlight = useRef(false);
    const id = useId();
    const [pkg, setPkg] = useState('');
    const [source, setSource] = useState('');
    const [need, setNeed] = useState('');
    const [budget, setBudget] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [status, setStatus] = useState(null);

    const budgets = need === 'onetime' || need === 'custom' ? texts.budgets.oneTime : texts.budgets.monthly;

    const show = useCallback((value = '', detail = {}) => {
        setPkg(value);
        setSource(detail.source || '');
        setNeed(needFor(value));
        setBudget('');
        setStatus(current => current === 'success' ? null : current);
        if (detail.prefill) setForm(current => ({ ...current, ...Object.fromEntries(Object.entries(detail.prefill).filter(([, field]) => field)) }));
        const element = dialog.current;
        if (!element || element.open) return;
        opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        element.showModal();
        previousOverflow.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }, []);

    // Puts ?offerte in the address, so the back button closes the window and the link can be shared.
    const openWithUrl = useCallback((value, detail) => {
        const url = new URL(window.location.href);
        url.searchParams.set(PARAM, value);
        if (url.href !== window.location.href) window.history.pushState({ quote: true }, '', url);
        show(value, detail);
    }, [show]);

    useEffect(() => {
        const value = quoteParam();
        if (value !== null) show(value);

        // In the capture phase, before Next.js handles the link, so the page stays where it is.
        const onClick = event => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
            if (!link || (link.target && link.target !== '_self')) return;
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin || !url.searchParams.has(PARAM)) return;
            event.preventDefault();
            openWithUrl(url.searchParams.get(PARAM));
        };
        const onOpen = event => openWithUrl('', event.detail);
        const onPopState = () => {
            const open = quoteParam();
            if (open === null) dialog.current?.open && dialog.current.close();
            else show(open);
        };
        window.addEventListener('click', onClick, true);
        window.addEventListener(OPEN_EVENT, onOpen);
        window.addEventListener('popstate', onPopState);
        return () => {
            window.removeEventListener('click', onClick, true);
            window.removeEventListener(OPEN_EVENT, onOpen);
            window.removeEventListener('popstate', onPopState);
            if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
        };
    }, [show, openWithUrl]);

    const onClose = () => {
        if (previousOverflow.current !== null) {
            document.body.style.overflow = previousOverflow.current;
            previousOverflow.current = null;
        }
        opener.current?.focus();
        if (status === 'success') {
            setForm(emptyForm);
            setStatus(null);
        }
        // Closed with the back button: the address is already right.
        if (quoteParam() === null) return;
        if (window.history.state?.quote) window.history.back();
        else {
            const url = new URL(window.location.href);
            url.searchParams.delete(PARAM);
            window.history.replaceState(null, '', url);
        }
    };

    const close = () => dialog.current?.close();

    const handleChange = event => {
        const { name, value } = event.target;
        setForm(previous => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (inFlight.current) return;
        inFlight.current = true;
        setStatus('sending');
        const quote = {
            need: need ? texts.needs[need] : '',
            budget,
            package: pkg,
            page: window.location.pathname,
            source,
        };
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, quote }),
            });
            if (response.ok) {
                setStatus('success');
                if (posthog.__loaded) posthog.capture('quote_request_sent', { package: pkg || null, need: need || null, budget: budget || null, source: source || 'form' });
            } else {
                setStatus(response.status >= 400 && response.status < 500 ? 'clienterror' : 'servererror');
            }
        } catch {
            setStatus('servererror');
        } finally {
            inFlight.current = false;
        }
    };

    const sending = status === 'sending';
    const chipClass = 'flex min-h-11 cursor-pointer items-center rounded-full border-2 border-dark/20 bg-white px-4 py-2 text-left text-[0.9375rem] font-medium leading-snug transition-colors hover:border-dark has-[:checked]:border-dark has-[:checked]:bg-theme has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-theme_darker';
    const inputClass = 'w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50 focus:border-theme_darker focus:ring-theme_darker';

    return (
        <dialog ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`} onClose={onClose}
            className="ph-no-capture ph-mask m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-xl border-2 border-dark bg-light p-0 text-left text-dark shadow-bold_r_sm backdrop:bg-dark/60 backdrop:backdrop-blur-sm">
            <div className="relative border-b border-dark/15 bg-theme/10 p-5 pr-16 sm:p-8 sm:pr-20">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-theme_darker">{texts.eyebrow}</span>
                <h2 id={`${id}-title`} className="!m-0 !text-3xl sm:!text-4xl font_mohave">{texts.title}</h2>
                <p id={`${id}-intro`} className="!mb-0 mt-3 text-base">{texts.intro}</p>
                <button type="button" onClick={close} aria-label={texts.close}
                    className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full hover:bg-dark/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme_darker">
                    <X aria-hidden="true" className="h-5 w-5" />
                </button>
            </div>

            <div className="p-5 sm:p-8">
                {status === 'success' ? (
                    <div role="status" className="py-4 text-center">
                        <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-[#00865b]" />
                        <h3 className="!mb-2 mt-4 !text-2xl !normal-case font_quicksand">{texts.successTitle}</h3>
                        <p className="!mb-0">{texts.successText}</p>
                        <button type="button" onClick={close}
                            className="mt-7 min-h-11 rounded-lg border-2 border-dark px-6 font-semibold uppercase tracking-wider hover:bg-dark hover:text-light">
                            {texts.successClose}
                        </button>
                    </div>
                ) : (
                    <>
                        <div role="status" aria-live="polite">
                            {(status === 'clienterror' || status === 'servererror') && (
                                <Alert text={texts[status]} classes="mb-5" bgColor="#b42332" />
                            )}
                        </div>
                        <form onSubmit={handleSubmit} aria-busy={sending}>
                            <fieldset disabled={sending} className="min-w-0">
                                <fieldset className="min-w-0">
                                    <legend className="mb-3 font-semibold lg:text-lg">{texts.needLabel}</legend>
                                    <div className="flex flex-wrap gap-2">
                                        {NEEDS.map(key => (
                                            <label key={key} className={chipClass}>
                                                <input type="radio" name="need" value={key} checked={need === key}
                                                    onChange={() => { setNeed(key); setBudget(''); }} className="sr-only" />
                                                {texts.needs[key]}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                <fieldset className="mt-7 min-w-0">
                                    <legend className="mb-3 font-semibold lg:text-lg">
                                        {texts.budgetLabel} <span className="font-normal text-dark/70">({texts.optional})</span>
                                    </legend>
                                    <div className="flex flex-wrap gap-2">
                                        {budgets.map(option => (
                                            <label key={option} className={chipClass}>
                                                <input type="radio" name="budget" value={option} checked={budget === option}
                                                    onChange={() => setBudget(option)} className="sr-only" />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    <label>
                                        <span className="mb-2 block font-semibold">{texts.name}</span>
                                        <input type="text" name="name" required maxLength={30} autoComplete="name"
                                            value={form.name} onChange={handleChange} className={inputClass} />
                                    </label>
                                    <label>
                                        <span className="mb-2 block font-semibold">{texts.email}</span>
                                        <input type="email" name="email" required maxLength={90} autoComplete="email"
                                            value={form.email} onChange={handleChange} className={inputClass} />
                                    </label>
                                </div>
                                <label className="mt-4 block">
                                    <span className="mb-2 block font-semibold">
                                        {texts.phone} <span className="font-normal text-dark/70">({texts.optional})</span>
                                    </span>
                                    <input type="tel" name="phone" maxLength={40} autoComplete="tel" aria-describedby={`${id}-phone`}
                                        pattern={String.raw`(?=.*[0-9])[+0-9\(\). \/\-]{5,40}`}
                                        value={form.phone} onChange={handleChange} className={inputClass} />
                                    <span id={`${id}-phone`} className="mt-1 block text-sm text-dark/70">{texts.phoneHint}</span>
                                </label>
                                <label className="mt-4 block">
                                    <span className="mb-2 block font-semibold">
                                        {texts.message} <span className="font-normal text-dark/70">({texts.optional})</span>
                                    </span>
                                    <textarea name="message" rows={3} maxLength={2000} placeholder={texts.messagePlaceholder}
                                        value={form.message} onChange={handleChange} className={inputClass} />
                                </label>
                                {/* Honeypot field - hidden from humans, bots will fill it */}
                                <input type="text" name="website" value={form.website} onChange={handleChange}
                                    autoComplete="off" tabIndex={-1} aria-hidden="true" aria-label="Website"
                                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} />

                                <ButtonOne input={{ value: sending ? texts.sending : texts.send }}
                                    classes="w-full mt-7 disabled:opacity-60 disabled:cursor-wait" />
                                <p className="!mb-0 mt-4 text-center text-sm">
                                    {texts.privacy}{' '}
                                    <Link href="/policy" target="_blank" className="text-sm font-semibold underline underline-offset-4">{texts.privacyLink}</Link>
                                </p>
                            </fieldset>
                        </form>
                    </>
                )}

                {(chat?.shown || texts.callLink) && (
                    <div className="mt-7 flex flex-col gap-3 border-t border-dark/15 pt-5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
                        {chat?.shown && (
                            <div>
                                <span>{texts.askText} </span>
                                <button type="button" onClick={() => { close(); chat.open(); }}
                                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-theme_darker underline underline-offset-4">
                                    <Sparkles aria-hidden="true" className="h-4 w-4" />{texts.askButton}
                                </button>
                            </div>
                        )}
                        {texts.callLink && (
                            <div>
                                <span>{texts.callText} </span>
                                <a href="tel:+32470930916" className="inline-flex min-h-11 items-center gap-2 font-semibold text-theme_darker underline underline-offset-4">
                                    <Phone aria-hidden="true" className="h-4 w-4" />{texts.callLink}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </dialog>
    );
}
