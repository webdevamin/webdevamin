'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import {
    Banknote, Briefcase, CalendarCheck, CalendarDays, CarTaxiFront, Check, ChevronRight, CircleHelp, HardHat, House, LayoutTemplate,
    LockKeyhole, MailCheck, Megaphone, MonitorSmartphone, Phone, RefreshCw, Repeat, Scissors, Search, ShoppingBag, ShoppingCart,
    RotateCcw, Sparkles, UtensilsCrossed, Zap,
} from 'lucide-react';
import posthog from 'posthog-js';
import { Link } from '../src/i18n/navigation';
import Alert from './Alert';
import Turnstile from './Turnstile';
import { useChat } from './Chat/ChatProvider';
import { STEPS, emptyAnswers, nextStep, prefill, priceLine, recommend } from '../utils/quote-wizard.mjs';

// The quote page (/nl/offerte): five short questions, a proposal with the matching package and price, then the contact
// details. A link can answer questions ahead with ?pakket=, for example /nl/offerte?pakket=kapper (see utils/quote-wizard.mjs).

const PROPOSAL = STEPS.length;
const CONTACT = STEPS.length + 1;
const DONE = STEPS.length + 2;
// `website` is the honeypot, like on the other forms. The visitor's current website is `site`.
// The icon on each answer card, by answer value (the values are unique across the questions).
const OPTION_ICONS = {
    new: MonitorSmartphone, redesign: RefreshCw, custom: ShoppingCart, unsure: CircleHelp,
    kapper: Scissors, restaurant: UtensilsCrossed, taxi: CarTaxiFront, aannemer: HardHat, isolatiebedrijf: House, other: Briefcase,
    booking: CalendarCheck, emails: MailCheck, marketing: Megaphone, selling: ShoppingBag, portal: LockKeyhole, none: LayoutTemplate,
    monthly: Repeat, onetime: Banknote,
    asap: Zap, soon: CalendarDays, exploring: Search,
};
const emptyForm = { name: '', email: '', phone: '', company: '', site: '', message: '', website: '' };

const cardClass = selected => `relative flex min-h-[7rem] w-full flex-col items-center justify-center gap-2 rounded-md border-2 bg-white px-3 py-4 sm:min-h-[9rem] sm:py-5 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker ${selected ? 'border-theme_dark text-theme_dark' : 'border-dark/40 text-dark hover:border-dark'}`;
const inputClass = 'w-full rounded-md border-2 border-dark/25 bg-white sm:py-3 focus:border-theme_dark focus:ring-theme_dark';
const primaryClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-theme_dark px-8 !text-base font-semibold text-white transition-colors hover:bg-theme_darker disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker';
const backClass = 'min-h-12 px-2 !text-base font-semibold text-dark/70 hover:text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker';
const linkClass = 'inline-flex min-h-11 items-center gap-2 font-semibold text-theme_darker underline underline-offset-4';
// Keeps the router's own data in the history entry: on the first render Next.js has not taken over history calls yet.
const saveStep = (method, quoteStep, quoteDepth) => window.history[method]({ ...window.history.state, quoteStep, quoteDepth }, '');
// The furthest step the visitor may open: the first unanswered question, or the contact step once all are answered.
const lastOpen = answers => {
    const first = nextStep(answers);
    return first === PROPOSAL ? CONTACT : first;
};

export default function QuoteWizard({ texts }) {
    const chat = useChat();
    const id = useId();
    const [answers, setAnswers] = useState(emptyAnswers);
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(emptyForm);
    const [status, setStatus] = useState(null);
    const link = useRef('');
    const depth = useRef(0);
    const moved = useRef(false);
    const timer = useRef(null);
    const inFlight = useRef(false);
    const heading = useRef(null);
    const errorBox = useRef(null);
    const turnstile = useRef(null);
    const answersRef = useRef(answers);
    answersRef.current = answers;

    // Starts at the first question a ?pakket= link did not answer. Every step gets its own browser history entry, so
    // the back button goes to the previous question instead of leaving the page and losing the answers.
    useEffect(() => {
        link.current = new URL(window.location.href).searchParams.get('pakket') || '';
        const start = prefill(texts, link.current);
        const first = nextStep(start);
        setAnswers(start);
        setStep(first);
        saveStep('replaceState', first, 0);
        const onPopState = event => {
            if (typeof event.state?.quoteStep !== 'number') return;
            depth.current = event.state.quoteDepth;
            moved.current = true;
            // Never past a question that is unanswered again, for example after starting over.
            setStep(current => current === DONE ? DONE : Math.min(event.state.quoteStep, lastOpen(answersRef.current)));
        };
        window.addEventListener('popstate', onPopState);
        return () => {
            window.removeEventListener('popstate', onPopState);
            clearTimeout(timer.current);
        };
    }, [texts]);

    // Moves focus to the new question, and back into view when the visitor scrolled down to answer.
    useEffect(() => {
        const element = heading.current;
        if (!moved.current || !element) return;
        element.focus({ preventScroll: true });
        if (element.getBoundingClientRect().top < 0) {
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            element.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
        }
    }, [step]);

    useEffect(() => {
        if (status === 'clienterror' || status === 'servererror') errorBox.current?.scrollIntoView({ block: 'nearest' });
    }, [status]);

    const goTo = target => {
        clearTimeout(timer.current);
        moved.current = true;
        depth.current += 1;
        setStep(target);
        saveStep('pushState', target, depth.current);
        if (posthog.__loaded) posthog.capture('quote_wizard_step', { step: STEPS[target] || ['proposal', 'contact', 'done'][target - PROPOSAL], link: link.current || null });
    };

    const back = () => {
        if (depth.current > 0) return window.history.back();
        // The first step shown after a ?pakket= link: the questions before it were answered by the link.
        moved.current = true;
        setStep(step - 1);
        saveStep('replaceState', step - 1, 0);
    };

    const reset = () => {
        link.current = '';
        setAnswers(emptyAnswers());
        setForm(emptyForm);
        setStatus(null);
        goTo(0);
    };

    const steps = Object.fromEntries(texts.steps.map(item => [item.key, item]));
    const label = (key, value) => steps[key].options.find(option => option.value === value)?.label || '';
    const valueOf = key => key === 'features'
        ? answers.features.map(feature => label('features', feature)).join(', ')
        : label(key, answers[key]);

    // A short pause, so the visitor sees the choice before the next question appears.
    const choose = (key, value) => {
        const updated = { ...answers, [key]: value };
        setAnswers(updated);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => goTo(nextStep(updated, step)), 250);
    };

    const toggleFeature = value => setAnswers(current => ({
        ...current,
        features: current.features.includes(value) ? current.features.filter(feature => feature !== value) : [...current.features, value],
    }));

    const item = recommend(texts, answers);
    const price = priceLine(texts, item, answers.payment);
    const priced = answers.need === 'custom' || (Boolean(answers.sector) && answers.features.length > 0);
    const sector = texts.sectors[answers.sector];
    const monthlyOnly = answers.payment === 'onetime' && item.monthlyOnly;
    const oneTime = answers.payment === 'onetime' && !item.monthlyOnly;

    const handleChange = event => {
        const { name, value } = event.target;
        setForm(previous => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (inFlight.current) return;
        inFlight.current = true;
        setStatus('sending');
        const { company, site, ...contact } = form;
        const quote = {
            need: label('need', answers.need),
            budget: '',
            package: item.name,
            price,
            sector: label('sector', answers.sector),
            features: valueOf('features'),
            payment: label('payment', answers.payment),
            timing: label('timing', answers.timing),
            company,
            website: site,
            page: window.location.pathname,
            source: link.current ? `quote page, link ${link.current}`.slice(0, 120) : 'quote page',
        };
        try {
            const turnstileToken = await turnstile.current?.token();
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...contact, quote, turnstileToken }),
            });
            if (response.ok) {
                setStatus('success');
                goTo(DONE);
                if (posthog.__loaded) posthog.capture('quote_request_sent', { package: item.key, sector: answers.sector || null, need: answers.need || null, features: answers.features, payment: answers.payment || null, timing: answers.timing || null, source: 'wizard' });
            } else {
                // 403: the bot check failed. Sending again usually works, so it is not shown as a mistake in the details.
                setStatus(response.status >= 400 && response.status < 500 && response.status !== 403 ? 'clienterror' : 'servererror');
            }
        } catch {
            setStatus('servererror');
        } finally {
            inFlight.current = false;
        }
    };

    const sending = status === 'sending';
    const failed = status === 'clienterror' || status === 'servererror';
    const question = texts.steps[step];
    const progressLabel = step < DONE
        ? texts.progress.replace('{current}', step + 1).replace('{total}', DONE + 1)
        : texts.stepLabels[DONE];
    const headingClass = '!m-0 scroll-mt-6 !text-2xl sm:!text-3xl lg:!text-4xl font-bold !normal-case tracking-tight font_quicksand focus:outline-none';
    const answered = question && (question.multiple ? answers.features.length > 0 : Boolean(answers[question.key]));

    const priceBlock = (
        <div>
            <span className="block !text-sm font-semibold uppercase tracking-wide text-theme_darker">{texts.proposal.packagePrefix} {item.name}</span>
            <span className="mt-1 block !text-2xl font-bold">{price}</span>
            {item.monthly && <span className="block !text-sm text-dark/70">{texts.prices.vat}</span>}
        </div>
    );

    return (
        <div className="ph-no-capture ph-mask mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-10 lg:gap-20">
            <ol aria-label={texts.stepsLabel} className="flex items-center md:sticky md:top-10 md:flex-col md:self-start">
                {texts.stepLabels.map((stepLabel, index) => {
                    const circle = `flex h-7 w-7 shrink-0 items-center justify-center rounded-full !text-xs font-bold text-white sm:h-8 sm:w-8 md:h-10 md:w-10 md:!text-sm lg:h-12 lg:w-12 ${index <= step ? 'bg-theme_dark' : 'bg-dark/60'} ${index === step ? 'ring-4 ring-theme/30' : ''}`;
                    const content = (
                        <>
                            {index === DONE && step === DONE ? <Check aria-hidden="true" className="h-4 w-4 md:h-5 md:w-5" strokeWidth={3} /> : <span aria-hidden="true">{index + 1}</span>}
                            <span className="sr-only">{stepLabel}</span>
                        </>
                    );
                    // Answered steps can be opened again by clicking their circle; the larger invisible area makes them easy to tap.
                    const clickable = step < DONE && index !== step && index <= lastOpen(answers);
                    return (
                        <li key={stepLabel} aria-current={index === step ? 'step' : undefined} className={`flex items-center md:flex-col ${index ? 'flex-1 md:flex-none' : ''}`}>
                            {index > 0 && <span aria-hidden="true" className={`h-1 flex-1 md:h-6 md:w-1 md:flex-none lg:h-8 ${index <= step ? 'bg-theme_dark' : 'bg-dark/40'}`} />}
                            {clickable ? (
                                <button type="button" title={stepLabel} onClick={() => goTo(index)}
                                    className={`${circle} relative before:absolute before:-inset-2 before:content-[''] hover:ring-4 hover:ring-theme/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme_darker`}>
                                    {content}
                                </button>
                            ) : (
                                <span title={stepLabel} className={circle}>{content}</span>
                            )}
                        </li>
                    );
                })}
            </ol>

            <section aria-labelledby={`${id}-heading`} className="min-w-0 max-w-4xl">
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <span aria-live="polite" className="block !text-base font-bold text-dark/50">{progressLabel}</span>
                    {step < DONE && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            {priced && (
                                <span className="block rounded-full bg-theme/10 px-3 py-1 !text-sm">{texts.summary.priceTitle}: <strong>{item.name}, {price}</strong></span>
                            )}
                            {(step > 0 || answers.need || answers.sector || answers.features.length > 0) && (
                                <button type="button" onClick={reset}
                                    className="inline-flex min-h-11 items-center gap-1.5 !text-sm font-semibold text-dark/60 hover:text-theme_dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker">
                                    <RotateCcw aria-hidden="true" className="h-4 w-4" />{texts.reset}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 sm:mt-10">
                    {question && (
                        <>
                            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={headingClass}>{question.question}</h2>
                            <p className="!mb-0 mt-4 max-w-3xl !opacity-90">{question.hint}</p>
                            {question.key === 'features' && sector && (
                                <p className="!mb-0 mt-5 max-w-3xl border-l-4 border-theme_dark pl-4 !text-base !opacity-100">{sector.line}</p>
                            )}
                            <div role="group" aria-labelledby={`${id}-heading`} className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3">
                                {question.options.map(option => {
                                    const selected = question.multiple ? answers.features.includes(option.value) : answers[question.key] === option.value;
                                    const Icon = OPTION_ICONS[option.value] || Sparkles;
                                    return (
                                        <button key={option.value} type="button" aria-pressed={selected}
                                            onClick={() => question.multiple ? toggleFeature(option.value) : choose(question.key, option.value)}
                                            className={cardClass(selected)}>
                                            {question.multiple && selected && (
                                                <span aria-hidden="true" className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-theme_dark text-white">
                                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                                </span>
                                            )}
                                            <Icon aria-hidden="true" className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.5} />
                                            <span className="block !text-sm font-semibold leading-snug sm:!text-base">{option.label}</span>
                                            {option.text && <span className="block !text-xs leading-snug text-dark/70 sm:!text-sm">{option.text}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-8 flex flex-col gap-2 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
                                <button type="button" disabled={!answered} onClick={() => goTo(nextStep(answers, step))} className={`${primaryClass} w-full sm:w-auto`}>
                                    {texts.next}
                                </button>
                                {step > 0 && <button type="button" onClick={back} className={backClass}>{texts.back}</button>}
                            </div>
                        </>
                    )}

                    {step === PROPOSAL && (
                        <>
                            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={headingClass}>{texts.proposal.title}</h2>
                            <div className="mt-8 max-w-3xl rounded-md border-2 border-theme_dark p-5 sm:p-6">
                                {priceBlock}
                                {monthlyOnly && <p className="!mb-0 mt-4 !text-base">{texts.prices.monthlyOnly}</p>}
                                {oneTime && <p className="!mb-0 mt-4 !text-base">{texts.prices.oneTime}</p>}
                                <h3 className="!mb-3 mt-6 !text-lg !normal-case font_quicksand">{texts.proposal.includedTitle}</h3>
                                <ul className="space-y-2">
                                    {item.includes.map(line => (
                                        <li key={line} className="flex gap-2">
                                            <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-theme_dark" strokeWidth={3} />{line}
                                        </li>
                                    ))}
                                </ul>
                                {sector?.link && (
                                    <Link href={sector.link.href} target="_blank" className={`mt-4 ${linkClass}`}>{sector.link.text}</Link>
                                )}
                            </div>
                            <ul className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-2">
                                {[...texts.proposal.trust, ...(answers.payment === 'monthly' ? [texts.proposal.guarantee] : [])].map(line => (
                                    <li key={line} className="flex gap-2 text-sm sm:text-base">
                                        <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-theme_dark" strokeWidth={3} />{line}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <button type="button" onClick={() => goTo(CONTACT)} className={`${primaryClass} w-full sm:w-auto`}>{texts.proposal.button}</button>
                                <button type="button" onClick={back} className={backClass}>{texts.back}</button>
                            </div>
                            <p className="!mb-0 mt-4 !text-sm">{texts.proposal.note}</p>
                        </>
                    )}

                    {step === CONTACT && (
                        <>
                            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={headingClass}>{texts.contact.title}</h2>
                            <p className="!mb-0 mt-4 !opacity-90">{texts.contact.intro}</p>
                            <form onSubmit={handleSubmit} aria-busy={sending} className="mt-8 max-w-3xl">
                                <fieldset disabled={sending} className="min-w-0">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label>
                                            <span className="mb-2 block font-semibold">{texts.contact.name}</span>
                                            <input type="text" name="name" required maxLength={30} autoComplete="name"
                                                value={form.name} onChange={handleChange} className={inputClass} />
                                        </label>
                                        <label>
                                            <span className="mb-2 block font-semibold">{texts.contact.email}</span>
                                            <input type="email" name="email" required maxLength={90} autoComplete="email"
                                                value={form.email} onChange={handleChange} className={inputClass} />
                                        </label>
                                        <label>
                                            <span className="mb-2 block font-semibold">
                                                {texts.contact.phone} <span className="font-normal text-dark/70">({texts.contact.optional})</span>
                                            </span>
                                            <input type="tel" name="phone" maxLength={40} autoComplete="tel" aria-describedby={`${id}-phone`}
                                                pattern={String.raw`(?=.*[0-9])[+0-9\(\). \/\-]{5,40}`}
                                                value={form.phone} onChange={handleChange} className={inputClass} />
                                            <span id={`${id}-phone`} className="mt-1 block !text-sm text-dark/70">{texts.contact.phoneHint}</span>
                                        </label>
                                        <label>
                                            <span className="mb-2 block font-semibold">
                                                {texts.contact.company} <span className="font-normal text-dark/70">({texts.contact.optional})</span>
                                            </span>
                                            <input type="text" name="company" maxLength={100} autoComplete="organization"
                                                value={form.company} onChange={handleChange} className={inputClass} />
                                        </label>
                                    </div>
                                    <label className="mt-4 block">
                                        <span className="mb-2 block font-semibold">
                                            {texts.contact.site} <span className="font-normal text-dark/70">({texts.contact.optional})</span>
                                        </span>
                                        <input type="text" name="site" maxLength={120} inputMode="url" autoComplete="url"
                                            placeholder={texts.contact.sitePlaceholder}
                                            value={form.site} onChange={handleChange} className={inputClass} />
                                    </label>
                                    <label className="mt-4 block">
                                        <span className="mb-2 block font-semibold">
                                            {texts.contact.message} <span className="font-normal text-dark/70">({texts.contact.optional})</span>
                                        </span>
                                        <textarea name="message" rows={4} maxLength={2000} placeholder={texts.contact.messagePlaceholder}
                                            value={form.message} onChange={handleChange} className={inputClass} />
                                    </label>
                                    {/* Honeypot field - hidden from humans, bots will fill it */}
                                    <input type="text" name="website" value={form.website} onChange={handleChange}
                                        autoComplete="off" tabIndex={-1} aria-hidden="true" aria-label="Website"
                                        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} />
                                    <Turnstile ref={turnstile} className="mt-7" />

                                    {/* Right above the button, where the visitor is looking after sending, so a failed send is never missed. */}
                                    <div ref={errorBox} role="alert" className="scroll-mb-5">
                                        {failed && <Alert text={texts.contact[status]} classes="mt-7" bgColor="#b42332" />}
                                    </div>
                                    <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                        <button type="submit" className={`${primaryClass} w-full sm:w-auto disabled:cursor-wait`}>
                                            {sending ? texts.contact.sending : texts.contact.send}
                                        </button>
                                        <button type="button" onClick={back} className={backClass}>{texts.back}</button>
                                    </div>
                                    <p className="!mb-0 mt-4 !text-sm">
                                        {texts.contact.privacy}{' '}
                                        <Link href="/policy" target="_blank" className="!text-sm font-semibold underline underline-offset-4">{texts.contact.privacyLink}</Link>
                                    </p>
                                </fieldset>
                            </form>
                        </>
                    )}

                    {step === DONE && (
                        <div role="status" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                            <Image src="/images/launch.svg" alt="" width={855} height={582} className="mx-auto h-auto w-full max-w-[16rem] sm:max-w-sm" />
                            <div>
                                <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={headingClass}>
                                    {texts.done.titleStart}<span className="!text-[length:inherit] text-theme_dark">{texts.done.titleHighlight}</span>{texts.done.titleEnd}
                                </h2>
                                <p className="!mb-0 mt-3 !opacity-90">{texts.done.text}</p>
                                <div className="mt-5 rounded-md border-2 border-theme_dark p-4">{priceBlock}</div>
                                <ol className="mt-5 list-decimal space-y-2 pl-5">
                                    {texts.done.next.map(line => <li key={line}>{line}</li>)}
                                </ol>
                                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                                    <a href="tel:+32470930916" className={primaryClass}>
                                        <Phone aria-hidden="true" className="h-4 w-4" />{texts.help.callLink}
                                    </a>
                                    <Link href="/" className="inline-flex min-h-11 items-center gap-1 !text-base font-semibold text-theme_darker hover:underline">
                                        {texts.done.homeLink}<ChevronRight aria-hidden="true" className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {step < DONE && (
                    <div className="mt-14 flex flex-col gap-3 border-t border-dark/10 pt-5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
                        {chat?.shown && (
                            <div>
                                <span className="!text-sm">{texts.help.askText} </span>
                                <button type="button" onClick={() => chat.open()} className={linkClass}>
                                    <Sparkles aria-hidden="true" className="h-4 w-4" />{texts.help.askButton}
                                </button>
                            </div>
                        )}
                        <div>
                            <span className="!text-sm">{texts.help.callText} </span>
                            <a href="tel:+32470930916" className={`!text-sm ${linkClass}`}>
                                <Phone aria-hidden="true" className="h-4 w-4" />{texts.help.callLink}
                            </a>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
