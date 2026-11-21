import { getCloudflareContext } from '@opennextjs/cloudflare';
import { CHAT_LIMITS, cleanChatConfig, isChatLocale, parseChatMessage } from '../../../../utils/chat.mjs';

// The AI chat (components/Chat). The browser only talks to this route; it asks the website chatbot of webdevamin.app
// with this site's tenant key, which never reaches the browser, and passes the streamed answer on. The visitor's IP
// stays here and is only used for the rate limit.

const noStore = { 'Cache-Control': 'private, no-store' };

// Null until ADMIN_URL, ADMIN_TENANT_ID and ADMIN_PUBLIC_API_KEY are set (see .env.example).
function connection() {
    const url = process.env.ADMIN_URL?.trim().replace(/\/+$/, '');
    const key = process.env.ADMIN_PUBLIC_API_KEY?.trim();
    const tenantId = process.env.ADMIN_TENANT_ID?.trim();
    return url && key && tenantId ? { url, key, tenantId } : null;
}

const failure = (error, status) => Response.json({ error }, { status, headers: noStore });

// webdevamin.app's error codes, in the few kinds the chat tells apart.
function platformError(code, status) {
    if (code === 'conversation_full') return ['full', 409];
    if (code === 'reply_running' || code === 'request_exists' || code === 'rate_limit') return ['busy', 429];
    if (status === 400 || code === 'invalid_request' || code === 'invalid_conversation') return ['invalid', 400];
    if (status === 403 || status === 429 || status === 503) return ['unavailable', 503];
    return ['error', 502];
}

// Each question costs part of the monthly AI budget at webdevamin.app, which stores no IP addresses, so the limit per
// visitor lives here: CHAT_RATE_LIMITER in wrangler.toml. It is not there during `next dev`, so nothing is limited then.
async function withinRateLimit(ip) {
    if (!ip) return true;
    try {
        const limiter = getCloudflareContext().env.CHAT_RATE_LIMITER;
        return limiter ? (await limiter.limit({ key: `chat:${ip}` })).success : true;
    } catch {
        return true;
    }
}

// One answer per language for a minute, per Worker instance, so a busy page does not ask webdevamin.app every time.
const configs = new Map();

export async function GET(request) {
    const locale = new URL(request.url).searchParams.get('locale');
    if (!isChatLocale(locale)) return Response.json({ available: false }, { status: 400, headers: noStore });
    const cached = configs.get(locale);
    let config = cached && Date.now() - cached.at < 60_000 ? cached.config : null;
    if (!config) {
        const admin = connection();
        config = { available: false };
        if (admin) {
            try {
                const response = await fetch(`${admin.url}/api/public/website-chat/config`, {
                    method: 'POST',
                    headers: { 'x-api-key': admin.key, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tenantId: admin.tenantId, locale }),
                    cache: 'no-store',
                    signal: AbortSignal.timeout(8000),
                });
                if (response.ok) config = cleanChatConfig(await response.json());
            } catch {}
        }
        configs.set(locale, { at: Date.now(), config });
    }
    // The browser keeps it a few minutes too, so going to another page does not ask again.
    return Response.json(config, { headers: { 'Cache-Control': `private, max-age=${config.available ? 300 : 60}` } });
}

// Cheap checks first, so a question that would be refused never reaches webdevamin.app or costs anything.
export async function POST(request) {
    // Against cross-site requests: browsers always send the page's origin with a POST, so it must be this site.
    if (request.headers.get('origin') !== new URL(request.url).origin) return failure('blocked', 403);
    if (Number(request.headers.get('content-length') ?? 0) > CHAT_LIMITS.body) return failure('invalid', 413);
    const input = parseChatMessage(await request.json().catch(() => null));
    if (!input) return failure('invalid', 400);
    if (!(await withinRateLimit(request.headers.get('CF-Connecting-IP')))) return failure('limited', 429);
    const admin = connection();
    if (!admin) return failure('unavailable', 503);

    let upstream;
    try {
        upstream = await fetch(`${admin.url}/api/public/website-chat/messages`, {
            method: 'POST',
            headers: { 'x-api-key': admin.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenantId: admin.tenantId, ...input }),
            cache: 'no-store',
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(130_000)]),
        });
    } catch {
        return failure('unavailable', 503);
    }
    if (!upstream.ok || !upstream.body || !(upstream.headers.get('content-type') ?? '').includes('text/event-stream')) {
        const code = await upstream.json().then(data => data?.error).catch(() => null);
        return failure(...platformError(code, upstream.status));
    }
    return new Response(upstream.body, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'private, no-store, no-transform', 'X-Accel-Buffering': 'no' },
    });
}
