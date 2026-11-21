import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('../src/app/api/send/route.js', import.meta.url), 'utf8');
const ENV_LINE = 'const { ADMIN_URL, ADMIN_TENANT_ID, ADMIN_PUBLIC_API_KEY } = process.env;';
assert.ok(source.includes(ENV_LINE));
// The route with fixed settings: connected to this site's own tenant in webdevamin.app, or not set up.
const route = async configured => (await import(`data:text/javascript;base64,${Buffer.from(source.replace(ENV_LINE,
    configured
        ? "const ADMIN_URL = 'https://mail.test', ADMIN_TENANT_ID = 'tenant-1', ADMIN_PUBLIC_API_KEY = 'wdk_tenant_test';"
        : "const ADMIN_URL = 'https://mail.test', ADMIN_TENANT_ID = '', ADMIN_PUBLIC_API_KEY = '';"
)).toString('base64')}#${configured ? 'tenant' : 'none'}`)).POST;
const POST = await route(true);
const valid = { name: 'Visitor', email: 'visitor@example.com', message: 'Bookings & payments\nFollow-up' };
const request = body => new Request('https://example.com/api/send', { method: 'POST', body: JSON.stringify(body) });

function mockFetch(t) {
    const originalFetch = globalThis.fetch;
    const originalError = console.error;
    const state = { calls: [], reply: () => Response.json({ ok: true }) };
    globalThis.fetch = async (url, options) => {
        state.calls.push({ url, headers: options.headers, body: JSON.parse(options.body) });
        return state.reply();
    };
    console.error = () => {};
    t.after(() => { globalThis.fetch = originalFetch; console.error = originalError; });
    return state;
}

test('contact, callback and quote requests go through the tenant in webdevamin.app', async t => {
    const state = mockFetch(t);

    assert.equal((await POST(request(valid))).status, 200);
    assert.equal(state.calls[0].url, 'https://mail.test/api/public/email/send');
    assert.equal(state.calls[0].headers['x-api-key'], 'wdk_tenant_test');
    assert.deepEqual(state.calls[0].body, { tenantId: 'tenant-1', type: 'contact', form: { name: 'Visitor', email: 'visitor@example.com', subject: 'Contactformulier website', message: valid.message } });

    assert.equal((await POST(request({ ...valid, callback: true, phone: '+32 470 93 09 16' }))).status, 200);
    assert.equal(state.calls[1].body.form.subject, 'Terugbelverzoek website');
    assert.equal(state.calls[1].body.form.phone, '+32 470 93 09 16');
    // Without a callback, a phone number is not passed on.
    assert.equal((await POST(request({ ...valid, phone: '+32 470 93 09 16' }))).status, 200);
    assert.equal(state.calls[2].body.form.phone, undefined);

    const quote = { need: 'Een website', budget: 'Tot €75 per maand', package: 'standaard', page: '/nl/prijzen', source: '' };
    assert.equal((await POST(request({ name: 'Visitor', email: 'visitor@example.com', phone: '+32 470 93 09 16', quote }))).status, 200);
    const sent = state.calls[3];
    assert.equal(sent.url, 'https://mail.test/api/public/quote-requests');
    assert.equal(sent.body.tenantId, 'tenant-1');
    assert.equal(sent.body.form.service, 'Een website');
    assert.equal(sent.body.form.phone, '+32 470 93 09 16');
    assert.match(sent.body.form.message, /^Offerteaanvraag via webdevamin\.com\./);
    assert.match(sent.body.form.message, /Budget: Tot €75 per maand\nPakket: standaard\nPagina: \/nl\/prijzen/);
    assert.doesNotMatch(sent.body.form.message, /Bron/);
    assert.equal((await POST(request({ name: 'Visitor', email: 'visitor@example.com', quote }))).status, 200);
    assert.equal(state.calls[4].body.form.phone, null);

    // The quote page sends more answers; the visitor's current website is quote.website, not the honeypot.
    const wizard = { need: 'Een nieuwe website', package: 'Premium', price: '€90 per maand', sector: 'Kapper of schoonheidssalon',
        features: 'Klanten boeken online, Automatische e-mails', payment: 'Per maand, alles inbegrepen', timing: 'Zo snel mogelijk',
        company: 'Salon <b>Test</b>', website: 'salontest.be', page: '/nl/offerte', source: 'quote page' };
    assert.equal((await POST(request({ name: 'Visitor', email: 'visitor@example.com', message: 'Graag snel', quote: wizard }))).status, 200);
    const { form } = state.calls[5].body;
    assert.equal(form.service, 'Een nieuwe website');
    assert.match(form.message, /Pakket: Premium\nPrijs: €90 per maand\nSector: Kapper of schoonheidssalon\nWat de website moet kunnen: Klanten boeken online, Automatische e-mails\nBetaling: Per maand, alles inbegrepen\nOnline: Zo snel mogelijk\nBedrijf: Salon Test\nHuidige website: salontest\.be\nPagina: \/nl\/offerte\nBron: quote page\n\nGraag snel$/);
    assert.equal((await POST(request({ name: 'Visitor', email: 'visitor@example.com', quote: { ...wizard, features: 'x'.repeat(300) } }))).status, 200);
    assert.equal((await POST(request({ name: 'Visitor', email: 'visitor@example.com', quote: { ...wizard, features: 'x'.repeat(301) } }))).status, 400);
});

test('spam and invalid forms never reach webdevamin.app', async t => {
    const state = mockFetch(t);
    const quote = { need: 'Een website', budget: '', package: '', page: '/nl', source: '' };
    for (const changes of [{ name: ' ' }, { email: 'invalid' }, { message: ' ' }, { callback: true },
        { callback: true, phone: '-----' }, { callback: true, phone: 'abcde' }, { callback: 'yes' }, { phone: {} },
        { quote: 'yes' }, { quote: { ...quote, need: 'x'.repeat(121) } }, { quote: { ...quote, budget: 5 } }, { quote, phone: 'abcde' }]) {
        assert.equal((await POST(request({ ...valid, ...changes }))).status, 400);
    }
    assert.equal((await POST(request({ website: 'spam' }))).status, 200);
    assert.equal((await POST(request({ ...valid, message: 'x'.repeat(16001) }))).status, 413);
    assert.equal(state.calls.length, 0);
});

test('a refused, failed or unconfigured delivery returns an error instead of a success message', async t => {
    const state = mockFetch(t);
    for (const failure of [() => Response.json({ error: 'email_configuration_incomplete' }, { status: 503 }),
        () => { throw new Error('offline'); }]) {
        state.reply = failure;
        assert.equal((await POST(request(valid))).status, 500);
    }
    assert.equal(state.calls.length, 2);
    // There is no other route anymore: every attempt went to the tenant.
    assert.ok(state.calls.every(call => call.url.startsWith('https://mail.test/api/public/')));

    const unconfigured = await route(false);
    assert.equal((await unconfigured(request(valid))).status, 500);
    assert.equal(state.calls.length, 2);
});

test('with a Turnstile secret, only forms that Cloudflare confirms reach webdevamin.app', async t => {
    const SECRET_LINE = 'const { TURNSTILE_SECRET_KEY } = process.env;';
    assert.ok(source.includes(SECRET_LINE));
    const { POST: protectedPOST } = await import(`data:text/javascript;base64,${Buffer.from(source
        .replace(ENV_LINE, "const ADMIN_URL = 'https://mail.test', ADMIN_TENANT_ID = 'tenant-1', ADMIN_PUBLIC_API_KEY = 'wdk_tenant_test';")
        .replace(SECRET_LINE, "const TURNSTILE_SECRET_KEY = 'turnstile-secret';")).toString('base64')}#turnstile`);
    const state = mockFetch(t);
    state.reply = () => Response.json({ success: state.calls.at(-1).body.response === 'good-token' });
    const send = (body, ip) => protectedPOST(new Request('https://example.com/api/send', {
        method: 'POST', body: JSON.stringify(body), headers: ip ? { 'CF-Connecting-IP': ip } : {},
    }));

    assert.equal((await send(valid)).status, 403);
    assert.equal((await send({ ...valid, turnstileToken: 'bad-token' })).status, 403);
    assert.equal(state.calls.length, 1);
    assert.equal(state.calls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');

    state.reply = () => state.calls.at(-1).url.includes('siteverify')
        ? Response.json({ success: state.calls.at(-1).body.response === 'good-token' })
        : Response.json({ ok: true });
    assert.equal((await send({ ...valid, turnstileToken: 'good-token' }, '203.0.113.5')).status, 200);
    assert.deepEqual(state.calls[1].body, { secret: 'turnstile-secret', response: 'good-token', remoteip: '203.0.113.5' });
    assert.equal(state.calls[2].url, 'https://mail.test/api/public/email/send');

    // Invalid details are refused before Cloudflare is asked.
    assert.equal((await send({ ...valid, email: 'invalid', turnstileToken: 'good-token' })).status, 400);
    assert.equal(state.calls.length, 3);
});
