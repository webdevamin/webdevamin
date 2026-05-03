'use client';

import { useEffect, useState } from 'react';
import ButtonOne from './Buttons/ButtonOne';
import Alert from './Alert';

/*
 * Maakt de beginstaat van het formulier, inclusief een pakketkeuze wanneer
 * bezoekers vanuit een pricing CTA komen.
 */
const getInitForm = (selectedPackage = '') => {
    return {
        name: '',
        email: '',
        packageChoice: selectedPackage,
        message: '',
        website: '',
    };
};

const ContactForm = ({ content, formText, selectedPackage = '' }) => {
    const [form, setForm] = useState(() => getInitForm(selectedPackage));
    const [afterSubmit, setAfterSubmit] = useState(null);

    useEffect(() => {
        setForm((currentForm) => ({
            ...currentForm,
            packageChoice: selectedPackage,
        }));
    }, [selectedPackage]);

    /*
     * Kiest de juiste feedbackmelding op basis van de API-status.
     */
    const initAfterSubmit = (code) => {
        switch (code) {
            case 400:
                setAfterSubmit(content.find(block => block.title === `clienterror`));
                break;
            case 500:
                setAfterSubmit(content.find(block => block.title === `servererror`));
                break;
            default:
                setAfterSubmit(content.find(block => block.title === `success`));
                break;
        }
    }

    /*
     * Houdt alle formuliervelden in dezelfde state, zodat query-prefill en
     * handmatige wijzigingen samen blijven werken.
     */
    const handleChange = (e) => {
        const { target } = e;
        const { name, value } = target;
        setForm({ ...form, [name]: value });
    }

    /*
     * Stuurt het formulier naar de mail-API en zet het daarna terug naar de
     * beginstaat met de gekozen pakketcontext behouden.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAfterSubmit(null);

        const options = {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        }

        try {
            const res = await fetch(`/api/send`, options);
            initAfterSubmit(res.status);
        } catch (error) {
            console.error(error);
            initAfterSubmit(500);
        }

        setForm(getInitForm(selectedPackage));
    }

    return (
        <>
            {
                afterSubmit && (
                    <Alert text={afterSubmit.text} classes={`mt-7 md:mt-10`} bgColor={afterSubmit.backgroundColor} />
                )
            }
            <form onSubmit={handleSubmit} className={`mt-7 md:mt-10`}>
                <div className='flex flex-col gap-3 sm:gap-4'>
                    <label>
                        <input type="text" maxLength="30" required
                            name='name' placeholder={formText.name}
                            value={form.name} onChange={handleChange}
                            className={`w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50`} />
                    </label>
                    <label>
                        <input type="email" maxLength="90" required
                            name='email' placeholder={formText.email}
                            value={form.email} onChange={handleChange}
                            className={`w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50`} />
                    </label>
                    {formText.packageOptions && (
                        <label>
                            <select
                                name="packageChoice"
                                value={form.packageChoice}
                                onChange={handleChange}
                                className={`w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50`}
                            >
                                <option value="">{formText.package}</option>
                                {formText.packageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                    <label>
                        <textarea name="message" id="message"
                            rows="8" value={form.message}
                            placeholder={formText.message}
                            onChange={handleChange} required
                            className={`w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50`} />
                    </label>
                    {/* Honeypot field - hidden from humans, bots will fill it */}
                    <input
                        type="text"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        autoComplete="off"
                        tabIndex={-1}
                        aria-hidden="true"
                        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                    />
                </div>
                <ButtonOne input={{ value: formText.send }} classes={`w-full sm:w-1/3 md:w-1/4 mt-10 sm:mt-12 sm:flex sm:justify-center`} />
            </form>
        </>
    );
}

export default ContactForm;
