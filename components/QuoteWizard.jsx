'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, CheckCircle2, Phone, Sparkles } from 'lucide-react';
import posthog from 'posthog-js';
import { Link } from '../src/i18n/navigation';
import Alert from './Alert';
import ButtonOne from './Buttons/ButtonOne';
import Turnstile from './Turnstile';
import { useChat } from './Chat/ChatProvider';
import { STEPS, emptyAnswers, nextStep, prefill, priceLine, recommend } from '../utils/quote-wizard.mjs';

// The quote page (/nl/offerte): five short questions, a proposal with the matching package and price, then the contact
// details. A link can answer questions ahead with ?pakket=, for example /nl/offerte?pakket=kapper (see utils/quote-wizard.mjs).

const PROPOSAL = STEPS.length;
const CONTACT = STEPS.length + 1;
const DONE = STEPS.length + 2;
// `website` is the honeypot, like on the other forms. The visitor's current website is `site`.
const emptyForm = { name: '', email: '', phone: '', company: '', site: '', message: '', website: '' };

const optionClass = selected => `flex min-h-11 w-full items-start gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker ${selected ? 'border-dark bg-theme shadow-bold_r_xs' : 'border-dark/20 bg-white hover:border-dark'}`;
const inputClass = 'w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50 focus:border-theme_darker focus:ring-theme_darker';
const linkClass = 'inline-flex min-h-11 items-center gap-2 font-semibold text-theme_darker underline underline-offset-4';
// Keeps the router's own data in the history entry: on the first render Next.js has not taken over history calls yet.
const saveStep = (method, quoteStep, quoteDepth) => window.history[method]({ ...window.history.state, quoteStep, quoteDepth }, '');
const backClass = 'min-h-11 rounded-lg border-2 border-dark/20 bg-white px-5 font-semibold hover:border-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker';

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
            setStep(current => current === DONE ? DONE : event.state.quoteStep);
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
        if (element.getBoundingClientRect().top < 96) {
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

    // "Gewoon een sterke website" excludes the other features.
    const toggleFeature = value => setAnswers(current => {
        const others = current.features.filter(feature => feature !== 'none');
        const features = value === 'none'
            ? (current.features.includes('none') ? [] : ['none'])
            : others.includes(value) ? others.filter(feature => feature !== value) : [...others, value];
        return { ...current, features };
    });

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
    const progressLabel = step < PROPOSAL
        ? texts.progress.replace('{current}', step + 1).replace('{total}', STEPS.length)
        : step === PROPOSAL ? texts.proposal.eyebrow : step === CONTACT ? texts.lastStep : texts.summary.title;
    const headingClass = '!m-0 scroll-mt-28 !text-3xl sm:!text-4xl font_mohave focus:outline-none';

    const priceBlock = (
        <div>
            <span className="block !text-sm font-semibold uppercase tracking-wide text-theme_darker">{texts.proposal.packagePrefix} {item.name}</span>
            <span className="mt-1 block !text-2xl font-bold">{price}</span>
            {item.monthly && <span className="block !text-sm text-dark/70">{texts.prices.vat}</span>}
        </div>
    );

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12">
            <section aria-labelledby={`${id}-heading`} className="ph-no-capture ph-mask min-w-0 rounded-xl border-2 border-dark bg-white shadow-bold_r_sm">
                <div className="border-b border-dark/15 px-5 pb-4 pt-5 sm:px-8">
                    <span aria-live="polite" className="block !text-sm font-semibold uppercase tracking-wide text-theme_darker">{progressLabel}</span>
                    <div aria-hidden="true" className="mt-3 h-2 overflow-hidden rounded-full bg-dark/10">
                        <div className="h-full rounded-full bg-theme transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${Math.round((step / DONE) * 100)}%` }} />
                    </div>
                    {priced && step < DONE && (
                        <p className="!mb-0 mt-3 !text-sm !opacity-100 lg:hidden">
                            {texts.summary.priceTitle}: <strong>{item.name}, {price}</strong>
                        </p>
                    )}
                </div>

                <div className="p-5 sm:p-8">
                    {question && (
                        <>
                            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={headingClass}>{question.question}</h2>
                            <p className="!mb-0 mt-2 !opacity-90">{question.hint}</p>
                            {question.key === 'features' && sector && (
                                <p className="!mb-0 mt-5 rounded-lg border-l-4 border-theme bg-theme/10 px-4 py-3 !text-base !opacity-100">{sector.line}</p>
                            )}
                            <div role="group" aria-labelledby={`${id}-heading`} className="mt-6 grid gap-3 sm:grid-cols-2">
                                {question.options.map(option => {
                                    const selected = question.multiple ? answers.features.includes(option.value) : answers[question.key] === option.value;
                                    return (
                                        <button key={option.value} type="button" aria-pressed={selected}
                                            onClick={() => question.multiple ? toggleFeature(option.value) : choose(question.key, option.value)}
                                            className={optionClass(selected)}>
                                            <span aria-hidden="true" className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-dark ${question.multiple ? 'rounded' : 'rounded-full'} ${selected ? 'bg-dark text-light' : 'bg-white'}`}>
                                                {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                            </span>
                                            <span className="block min-w-0">
                                                <span className="block !text-base font-semibold leading-snug">{option.label}</span>
                                                {option.text && <span className="mt-1 block !text-sm leading-snug">{option.text}</span>}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {(step > 0 || question.multiple) && (
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    {step > 0 && <button type="button" onClick={back} className={backClass}>{texts.back}</button>}
                                    {question.multiple && (
                                        <button type="button" disabled={!answers.features.length} onClick={() => goTo(nextStep(answers, step))}
                                            className="min-h-11 rounded-lg border-2 border-dark bg-theme px-6 font-semibold uppercase tracking-wider shadow-bold_r_xs transition-shadow hover:shadow-zero disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker">
                                            {texts.next}
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {step === PROPOSAL && (
                        <>
                            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={headingClass}>{texts.proposal.title}</h2>
                            <div className="mt-6 rounded-xl border-2 border-dark bg-light p-5 sm:p-6">
                                {priceBlock}
                                {monthlyOnly && <p className="!mb-0 mt-4 !text-base">{texts.prices.monthlyOnly}</p>}
                                {oneTime && <p className="!mb-0 mt-4 !text-base">{texts.prices.oneTime}</p>}
                                <h3 className="!mb-3 mt-6 !text-lg !normal-case font_quicksand">{texts.proposal.includedTitle}</h3>
                                <ul className="space-y-2">
                                    {item.includes.map(line => (
                                        <li key={line} className="flex gap-2">
                                            <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-theme_darker" strokeWidth={3} />{line}
                                        </li>
                                    ))}
                                </ul>
                                {sector?.link && (
                                    <Link href={sector.link.href} target="_blank" className={`mt-4 ${linkClass}`}>{sector.link.text}</Link>
                                )}
                            </div>
                            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                                {[...texts.proposal.trust, ...(answers.payment === 'monthly' ? [texts.proposal.guarantee] : [])].map(line => (
                                    <li key={line} className="flex gap-2 text-sm sm:text-base">
                                        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#00865b]" />{line}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <button type="button" onClick={back} className={backClass}>{texts.back}</button>
                                <ButtonOne onClick={() => goTo(CONTACT)} text={texts.proposal.button} noMargin />
                            </div>
                            <p className="!mb-0 mt-4 !text-sm">{texts.proposal.note}</p>
                        </>
                    )}

                    {step === CONTACT && (
                        <>
                            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={headingClass}>{texts.contact.title}</h2>
                            <p className="!mb-0 mt-2 !opacity-90">{texts.contact.intro}</p>
                            <form onSubmit={handleSubmit} aria-busy={sending} className="mt-6">
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
                                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                                        <button type="button" onClick={back} className={backClass}>{texts.back}</button>
                                        <ButtonOne input={{ value: sending ? texts.contact.sending : texts.contact.send }}
                                            classes="w-full sm:w-auto disabled:opacity-60 disabled:cursor-wait" noMargin />
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
                        <div role="status">
                            <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-[#00865b]" />
                            <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className={`mt-4 ${headingClass}`}>{texts.done.title}</h2>
                            <p className="!mb-0 mt-2 !opacity-90">{texts.done.text}</p>
                            <div className="mt-6 rounded-xl border-2 border-dark bg-light p-5 sm:p-6">{priceBlock}</div>
                            <h3 className="!mb-3 mt-8 !text-lg !normal-case font_quicksand">{texts.done.nextTitle}</h3>
                            <ol className="list-decimal space-y-2 pl-5">
                                {texts.done.next.map(line => <li key={line}>{line}</li>)}
                            </ol>
                        </div>
                    )}
                </div>

                {(chat?.shown || texts.help.callLink) && (
                    <div className="flex flex-col gap-3 border-t border-dark/15 px-5 py-4 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:px-8">
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

            <aside aria-label={texts.summary.title} className="hidden rounded-xl border-2 border-dark bg-white p-6 shadow-bold_r_xs lg:sticky lg:top-28 lg:block">
                <h2 className="!m-0 !text-xl !normal-case font_quicksand">{texts.summary.title}</h2>
                <dl className="mt-4 space-y-3">
                    {STEPS.map(key => (
                        <div key={key}>
                            <dt className="text-sm text-dark/70">{texts.summary.labels[key]}</dt>
                            <dd className={valueOf(key) ? 'font-semibold' : 'text-dark/60'}>{valueOf(key) || texts.summary.empty}</dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-6 border-t border-dark/15 pt-5">
                    <span className="block !text-sm text-dark/70">{texts.summary.priceTitle}</span>
                    {priced ? <div className="mt-2">{priceBlock}</div> : <p className="!mb-0 mt-2 !text-base">{texts.summary.pricePending}</p>}
                </div>
            </aside>
        </div>
    );
}
