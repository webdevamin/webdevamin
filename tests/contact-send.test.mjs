import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('../src/app/api/send/route.js', import.meta.url), 'utf8');
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(source.replace(
    'const { ADMIN_URL, ADMIN_API_KEY, MAIL_TO } = process.env;',
    "const ADMIN_URL = 'https://mail.test', ADMIN_API_KEY = 'test', MAIL_TO = 'owner@example.com';"
)).toString('base64')}`);
const valid = { name: 'Visitor', email: 'visitor@example.com', message: 'Bookings & payments\nFollow-up' };
const request = body => new Request('https://example.com/api/send', { method: 'POST', body: JSON.stringify(body) });

test('existing enquiries and callback delivery, validation, and failures', async t => {
    const originalFetch = globalThis.fetch;
    const originalError = console.error;
    const deliveries = [];
    let reply = () => Response.json({ messageId: 'test-id' });
    globalThis.fetch = async (_url, options) => { deliveries.push(JSON.parse(options.body)); return reply(); };
    console.error = () => {};
    t.after(() => { globalThis.fetch = originalFetch; console.error = originalError; });

    assert.equal((await POST(request(valid))).status, 200);
    assert.match(deliveries[0].html, /Bookings &amp; payments<br>Follow-up/);
    assert.doesNotMatch(deliveries[0].html, /Callback requested/);
    assert.equal((await POST(request({ ...valid, callback: true, phone: '+32 470 93 09 16' }))).status, 200);
    assert.match(deliveries[1].html, /Callback requested.*Yes/);
    assert.match(deliveries[1].html, /\+32 470 93 09 16/);
    assert.equal(deliveries[1].replyTo[0].email, valid.email);
    assert.equal((await POST(request({ ...valid, callback: false, phone: '+32 470 93 09 16' }))).status, 200);
    assert.doesNotMatch(deliveries[2].html, /Phone:/);

    for (const changes of [{ name: ' ' }, { email: 'invalid' }, { message: ' ' }, { callback: true },
        { callback: true, phone: '-----' }, { callback: true, phone: 'abcde' }, { callback: 'yes' }, { phone: {} }]) {
        assert.equal((await POST(request({ ...valid, ...changes }))).status, 400);
    }
    assert.equal((await POST(request({ website: 'spam' }))).status, 200);
    assert.equal((await POST(request({ ...valid, message: 'x'.repeat(16001) }))).status, 413);
    assert.equal(deliveries.length, 3);

    for (const failure of [() => Response.json({}, { status: 503 }), () => Response.json({}),
        () => { throw new Error('Network unavailable'); }]) {
        reply = failure;
        assert.equal((await POST(request(valid))).status, 500);
    }
});
