// The AI chat: the website chatbot of webdevamin.app answers visitors from this site's own pages and can prepare a
// quote request, which opens the quote window (components/QuoteModal.jsx). Pure helpers, shared by the browser and
// the server, tested in plain Node (tests/chat.test.mjs). Ported from the Arvex site.

export const CHAT_LOCALES = ['en', 'nl'];
export const CHAT_ACTIONS = ['quote_request', 'contact_message'];
export const CHAT_LIMITS = { message: 1000, body: 4000, maxMessages: 30 };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Control characters, except tab and line breaks.
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export const isChatLocale = value => CHAT_LOCALES.includes(value);

const short = (value, max) => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';

// webdevamin.app's answer, kept to what the chat can show. Anything unexpected keeps the chat hidden.
export function cleanChatConfig(value) {
    const input = value && typeof value === 'object' ? value : {};
    if (input.available !== true) return { available: false };
    const name = short(input.name, 40);
    const placeholder = short(input.placeholder, 80);
    const welcome = typeof input.welcome === 'string' ? input.welcome.trim().slice(0, 300) : '';
    if (!name || !placeholder || !welcome) return { available: false };
    return {
        available: true,
        name,
        placeholder,
        welcome,
        suggestions: (Array.isArray(input.suggestions) ? input.suggestions : []).map(item => short(item, 80)).filter(Boolean).slice(0, 4),
        actions: CHAT_ACTIONS.filter(kind => Array.isArray(input.actions) && input.actions.includes(kind)),
    };
}

// A form the assistant prepared. Only known forms and text fields, each kept short; anything else is dropped.
export function cleanChatAction(value) {
    const input = value && typeof value === 'object' ? value : {};
    if (!CHAT_ACTIONS.includes(input.kind)) return null;
    const fields = input.fields && typeof input.fields === 'object' ? input.fields : {};
    return {
        kind: input.kind,
        fields: Object.fromEntries(Object.entries(fields).slice(0, 12)
            .map(([key, field]) => [key.slice(0, 40), typeof field === 'string' ? field.slice(0, 2000) : null])),
    };
}

// What the quote window gets from a prepared form: the visitor's details and their request in one message.
export function quotePrefill(action) {
    const value = name => (action?.fields?.[name] || '').trim();
    return {
        name: value('name').slice(0, 30),
        email: value('email').slice(0, 90),
        phone: value('phone').slice(0, 40),
        message: [value('service'), value('details'), value('message')].filter(Boolean).join('\n\n').slice(0, 2000),
    };
}

// One question from the browser. Null when anything does not look like what the chat itself sends.
export function parseChatMessage(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const message = typeof value.message === 'string' ? value.message.trim() : '';
    const page = value.page && typeof value.page === 'object' ? value.page : {};
    const path = typeof page.path === 'string' ? page.path : '';
    if (typeof value.conversationId !== 'string' || !UUID.test(value.conversationId)) return null;
    if (typeof value.requestId !== 'string' || !UUID.test(value.requestId)) return null;
    if (!message || message.length > CHAT_LIMITS.message || CONTROL.test(message) || !isChatLocale(value.locale)) return null;
    if (!path.startsWith('/') || path.length > 300 || CONTROL.test(path)) return null;
    if (value.actions !== undefined && !Array.isArray(value.actions)) return null;
    return {
        conversationId: value.conversationId.toLowerCase(),
        requestId: value.requestId.toLowerCase(),
        message,
        locale: value.locale,
        page: { path: path.split(/[?#]/)[0], title: short(page.title, 200) },
        actions: CHAT_ACTIONS.filter(kind => value.actions?.includes(kind)),
    };
}

// Reads server-sent events, also when one event is split over several network chunks. Stops at maxBytes.
export async function readChatEvents(body, onEvent, maxBytes = 2_000_000) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let bytes = 0;
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            bytes += value.byteLength;
            if (bytes > maxBytes) throw new Error('too_large');
            buffer += decoder.decode(value, { stream: true });
            let boundary;
            while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
                const frame = buffer.slice(0, boundary.index);
                buffer = buffer.slice(boundary.index + boundary[0].length);
                const data = frame.split(/\r?\n/).filter(line => line.startsWith('data:'))
                    .map(line => line.slice(5).trimStart()).join('\n');
                if (data) onEvent(JSON.parse(data));
            }
        }
    } finally {
        await reader.cancel().catch(() => {});
    }
}

// A small, safe subset of Markdown, as the assistant is told to write it: paragraphs, bold, lists and links. The
// chat shows it as React elements, never as HTML.
function inlines(line) {
    const parts = [];
    const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0;
    for (const match of line.matchAll(pattern)) {
        if (match.index > last) parts.push({ type: 'text', text: line.slice(last, match.index) });
        parts.push(match[1] !== undefined ? { type: 'strong', text: match[1] } : { type: 'link', text: match[2], href: match[3] });
        last = match.index + match[0].length;
    }
    if (last < line.length) parts.push({ type: 'text', text: line.slice(last) });
    return parts;
}

export function parseChatMarkdown(text) {
    const blocks = [];
    for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
        const line = raw.trim().replace(/^#{1,6}\s+/, '');
        const bullet = /^[-*•]\s+(.*)$/.exec(line);
        const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
        const last = blocks[blocks.length - 1];
        if (!line) {
            blocks.push({ type: 'p', lines: [] });
        } else if (bullet || numbered) {
            const type = bullet ? 'ul' : 'ol';
            const item = inlines((bullet ?? numbered)[1]);
            if (last?.type === type) last.items.push(item);
            else blocks.push({ type, items: [item] });
        } else if (last?.type === 'p') {
            last.lines.push(inlines(line));
        } else {
            blocks.push({ type: 'p', lines: [inlines(line)] });
        }
    }
    return blocks.filter(block => block.type !== 'p' || block.lines.length);
}

// What a link in an answer may do: pages of this site open inside the site, phone and mail links work, and
// everything else is shown as plain text, so an answer never sends a visitor to another website.
export function chatLink(href, origin) {
    if (/^tel:\+?[\d\s()./-]{6,30}$/i.test(href) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(href)) return { kind: 'direct', href };
    let url;
    try {
        url = new URL(href, origin);
    } catch {
        return null;
    }
    // The chatbot reads the live site, so its links name webdevamin.com; they open here on a preview too.
    const ours = url.origin === origin || url.hostname === 'webdevamin.com';
    if (!ours || !/^https?:$/.test(url.protocol)) return null;
    return { kind: 'page', path: `${url.pathname}${url.search}${url.hash}` };
}
