'use client';

import { useId, useRef, useState } from 'react';
import ButtonOne from './Buttons/ButtonOne';
import Alert from './Alert';

const getInitForm = (message = '') => {
    return {
        name: '',
        email: '',
        message,
        website: '',
        callback: false,
        phone: '',
    };
};

const ContactForm = ({ content, formText, initialMessage = '', businessEnquiry = false }) => {
    const [form, setForm] = useState(() => getInitForm(initialMessage));
    const [afterSubmit, setAfterSubmit] = useState(null);
    const [sending, setSending] = useState(false);
    const inFlight = useRef(false);
    const id = useId();

    const initAfterSubmit = (status, ok = false) => {
        const title = ok ? 'success' : status >= 400 && status < 500 ? 'clienterror' : 'servererror';
        setAfterSubmit(content.find(block => block.title === title));
    };

    const handleChange = (e) => {
        const { target } = e;
        const { name, value, type, checked } = target;
        setForm(previous => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    }

    /*
     * Stuurt het formulier naar de mail-API en zet het daarna terug naar de
     * beginstaat na een geslaagde verzending.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inFlight.current) return;
        inFlight.current = true;
        setSending(true);
        setAfterSubmit(null);

        const options = {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(businessEnquiry ? { ...form, phone: form.callback ? form.phone : '' } : { name: form.name, email: form.email, message: form.message, website: form.website })
        }

        try {
            const res = await fetch(`/api/send`, options);
            initAfterSubmit(res.status, res.ok);
            if (res.ok) setForm(getInitForm());
        } catch {
            initAfterSubmit(500);
        } finally {
            inFlight.current = false;
            setSending(false);
        }
    }

    const messageField = (
        <label htmlFor={`${id}-message`}>
            <span className={businessEnquiry ? 'mb-2 block font-semibold' : 'sr-only'}>{formText.message}</span>
            {businessEnquiry && <span id={`${id}-hint`} className="mb-3 block text-sm">{formText.hint}</span>}
            <textarea name="message" id={`${id}-message`}
                rows={businessEnquiry ? 5 : 8} value={form.message}
                maxLength={businessEnquiry ? 4000 : undefined}
                aria-describedby={businessEnquiry ? `${id}-hint` : undefined}
                placeholder={formText.placeholder || formText.message}
                onChange={handleChange} required
                onInput={e => e.currentTarget.setCustomValidity(e.currentTarget.value.trim() ? '' : formText.message)}
                className="w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50 focus:border-theme_darker focus:ring-theme_darker" />
        </label>
    );

    return (
        <div className="ph-no-capture ph-mask">
            <div role="status" aria-live="polite">
                {afterSubmit && (
                    <Alert text={afterSubmit.text} classes={businessEnquiry ? "mb-5" : "mt-7 md:mt-10"} bgColor={afterSubmit.backgroundColor} />
                )}
            </div>
            <form onSubmit={handleSubmit} className={businessEnquiry ? '' : 'mt-7 md:mt-10'} aria-busy={sending}>
                <fieldset disabled={sending} className="min-w-0">
                    <div className='flex flex-col gap-3 sm:gap-4'>
                        {businessEnquiry && messageField}
                        <label>
                            <span className={businessEnquiry ? "mb-2 block font-semibold" : "sr-only"}>{formText.name}</span>
                            <input type="text" maxLength="30" required
                                name='name' autoComplete='name' placeholder={formText.name}
                                value={form.name} onChange={handleChange}
                                className={`w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50`} />
                        </label>
                        <label>
                            <span className={businessEnquiry ? "mb-2 block font-semibold" : "sr-only"}>{formText.email}</span>
                            <input type="email" maxLength="90" required
                                name='email' autoComplete='email' placeholder={formText.email}
                                value={form.email} onChange={handleChange}
                                className={`w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50`} />
                        </label>
                        {!businessEnquiry && messageField}
                        {businessEnquiry && <>
                            <label className="flex items-center gap-3 rounded-lg border border-dark/15 p-3">
                                <input type="checkbox" name="callback" checked={form.callback} onChange={handleChange}
                                    className="h-5 w-5 rounded text-theme_darker focus:ring-theme_darker" />
                                <span>{formText.callback}</span>
                            </label>
                            {form.callback && <label>
                                <span className="mb-2 block font-semibold">{formText.phone}</span>
                                <input type="tel" name="phone" required autoComplete="tel" maxLength={40}
                                    pattern={String.raw`(?=.*[0-9])[+0-9\(\). \/\-]{5,40}`}
                                    value={form.phone} onChange={handleChange}
                                    className="w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50" />
                            </label>}
                        </>}
                        {/* Honeypot field - hidden from humans, bots will fill it */}
                        <input
                            type="text"
                            name="website"
                            value={form.website}
                            onChange={handleChange}
                            autoComplete="off"
                            tabIndex={-1}
                            aria-hidden="true"
                            aria-label="Website"
                            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                        />
                    </div>
                    <ButtonOne input={{ value: sending ? (formText.sending || formText.send) : formText.send }} classes={businessEnquiry ? 'w-full mt-6 disabled:opacity-60 disabled:cursor-wait' : 'w-full sm:w-1/3 md:w-1/4 mt-10 sm:mt-12 sm:flex sm:justify-center'} />
                </fieldset>
            </form>
        </div>
    );
}

export default ContactForm;
