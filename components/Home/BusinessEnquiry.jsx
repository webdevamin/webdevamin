'use client';

import { useEffect, useId, useRef } from 'react';
import { ArrowUpRight, Lightbulb, Phone, X } from 'lucide-react';
import ContactForm from '../ContactForm';

const BusinessEnquiry = ({ content }) => {
    const dialog = useRef(null);
    const trigger = useRef(null);
    const previousOverflow = useRef(null);
    const id = useId();

    const restoreScroll = () => {
        if (previousOverflow.current !== null) {
            document.body.style.overflow = previousOverflow.current;
            previousOverflow.current = null;
        }
    };

    useEffect(() => () => restoreScroll(), []);

    const open = () => {
        dialog.current.showModal();
        previousOverflow.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.current.querySelector('textarea')?.focus();
    };

    return (
        <>
            <button ref={trigger} type="button" onClick={open} aria-haspopup="dialog" aria-controls={id}
                className="group md:mt-3 mb-7 flex w-full items-center gap-3 rounded-lg border border-theme/40 bg-theme/5 p-4 text-left text-dark transition-colors hover:border-theme hover:bg-theme/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme_darker">
                <Lightbulb aria-hidden="true" className="h-6 w-6 shrink-0 text-theme_darker" />
                <span className="flex-1">
                    <span className="block font-semibold">{content.triggerTitle}</span>
                    <span className="mt-1 block text-sm text-theme_darker">{content.triggerText}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" />
            </button>
            <dialog ref={dialog} id={id} aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`}
                onClose={() => { restoreScroll(); trigger.current?.focus(); }}
                className="ph-no-capture ph-mask m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-xl border-2 border-dark bg-light p-0 text-left text-dark shadow-bold_r_sm backdrop:bg-dark/60 backdrop:backdrop-blur-sm">
                <div className="relative border-b border-dark/15 bg-theme/10 p-5 pr-16 sm:p-8 sm:pr-20">
                    <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-theme_darker">{content.eyebrow}</span>
                    <h2 id={`${id}-title`} className="!m-0 !text-3xl sm:!text-4xl font_mohave">{content.title}</h2>
                    <p id={`${id}-intro`} className="!mb-0 mt-3 text-base">{content.intro}</p>
                    <button type="button" onClick={() => dialog.current.close()} aria-label={content.close}
                        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full hover:bg-dark/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme_darker">
                        <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-5 sm:p-8">
                    <ContactForm content={content.feedback} formText={content.form} businessEnquiry />
                    <div className="mt-7 border-t border-dark/15 pt-5 text-sm">
                        <span>{content.callText} </span>
                        <a href="tel:+32470930916" className="inline-flex items-center gap-2 font-semibold text-theme_darker underline underline-offset-4">
                            <Phone aria-hidden="true" className="h-4 w-4" />{content.callLink}
                        </a>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default BusinessEnquiry;
