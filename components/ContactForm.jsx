'use client';

import { useState } from 'react';
import ButtonOne from './Buttons/ButtonOne';
import Alert from './Alert';

const initForm = {
    name: '', email: '', message: ''
};

const ContactForm = ({ content, formText }) => {
    const [form, setForm] = useState(initForm);
    const [afterSubmit, setAfterSubmit] = useState(null);

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

    const handleChange = (e) => {
        const { target } = e;
        const { name, value } = target;
        setForm({ ...form, [name]: value });
    }

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

        setForm(initForm);
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
                    <label>
                        <textarea name="message" id="message"
                            rows="8" value={form.message}
                            placeholder={formText.message}
                            onChange={handleChange} required
                            className={`w-full rounded border-dark border-opacity-25 sm:py-3 bg-slate-50`} />
                    </label>
                </div>
                <ButtonOne input={{ value: formText.send }} classes={`w-full sm:w-1/3 md:w-1/4 mt-10 sm:mt-12 sm:flex sm:justify-center`} />
            </form>
        </>
    );
}

export default ContactForm;
