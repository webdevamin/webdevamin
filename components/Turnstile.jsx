'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
let script = null;

// Loads Cloudflare's script once, the first time a visitor uses one of the forms.
const loadScript = () => script ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const element = document.createElement('script');
    element.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    element.async = true;
    element.onload = () => resolve(window.turnstile);
    element.onerror = () => {
        script = null;
        element.remove();
        reject(new Error('Turnstile did not load.'));
    };
    document.head.append(element);
});

/*
 * Cloudflare Turnstile inside a form that posts to /api/send. It checks in the background that a person sends the
 * form and only shows a box to tick when Cloudflare is unsure. It starts when the visitor first uses the form, so
 * pages do not load it for every visitor.
 * `await ref.current.token()` gives the answer to send along. It waits up to 30 seconds (for example while the box is
 * ticked) and then starts a new check, because each answer works once. Without NEXT_PUBLIC_TURNSTILE_SITE_KEY it
 * renders nothing and gives an empty answer.
 */
const Turnstile = forwardRef(function Turnstile({ className = '' }, ref) {
    const box = useRef(null);
    const widget = useRef(null);
    const started = useRef(null);
    const answer = useRef('');
    const waiting = useRef([]);
    const [shown, setShown] = useState(false);

    const start = useCallback(() => {
        if (!SITE_KEY || started.current) return;
        started.current = loadScript().then(turnstile => {
            if (!box.current) return;
            widget.current = turnstile.render(box.current, {
                sitekey: SITE_KEY,
                appearance: 'interaction-only',
                size: 'flexible',
                theme: 'light',
                language: document.documentElement.lang || 'auto',
                callback: value => {
                    answer.current = value;
                    waiting.current.splice(0).forEach(resolve => resolve(value));
                },
                'expired-callback': () => { answer.current = ''; },
                'before-interactive-callback': () => setShown(true),
                'error-callback': () => {
                    answer.current = '';
                    setShown(true);
                },
            });
        }).catch(() => { started.current = null; });
    }, []);

    useEffect(() => {
        const form = box.current?.closest('form');
        form?.addEventListener('focusin', start);
        form?.addEventListener('pointerdown', start);
        return () => {
            form?.removeEventListener('focusin', start);
            form?.removeEventListener('pointerdown', start);
            if (widget.current !== null) window.turnstile?.remove(widget.current);
            widget.current = null;
            started.current = null;
        };
    }, [start]);

    useImperativeHandle(ref, () => ({
        token: async () => {
            if (!SITE_KEY) return '';
            start();
            const value = answer.current || await new Promise(resolve => {
                waiting.current.push(resolve);
                setTimeout(() => resolve(''), 30000);
            });
            answer.current = '';
            if (widget.current !== null) window.turnstile.reset(widget.current);
            return value;
        },
    }));

    if (!SITE_KEY) return null;
    return <div ref={box} className={shown ? className : undefined} />;
});

export default Turnstile;
