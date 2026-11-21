import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    chatLink, cleanChatAction, cleanChatConfig, parseChatMarkdown, parseChatMessage, quotePrefill, readChatEvents,
} from '../utils/chat.mjs';

const id = '0f8fad5b-d9cb-469f-a165-70867728950e';
const valid = { conversationId: id, requestId: id, message: 'Wat kost een website?', locale: 'nl', page: { path: '/nl/prijzen?offerte#x', title: 'Prijzen' }, actions: ['quote_request', 'other'] };

test('config and actions keep only what the chat can show', () => {
    assert.deepEqual(cleanChatConfig({ available: false, name: 'x' }), { available: false });
    assert.deepEqual(cleanChatConfig({ available: true, name: 'Bot' }), { available: false });
    const config = cleanChatConfig({ available: true, name: ' Webdevamin ', placeholder: 'Vraag', welcome: 'Hallo', suggestions: ['a', '', 'b', 'c', 'd', 'e'], actions: ['quote_request', 'hack'] });
    assert.deepEqual(config, { available: true, name: 'Webdevamin', placeholder: 'Vraag', welcome: 'Hallo', suggestions: ['a', 'b', 'c', 'd'], actions: ['quote_request'] });
    assert.equal(cleanChatAction({ kind: 'delete_everything' }), null);
    assert.deepEqual(cleanChatAction({ kind: 'quote_request', fields: { name: 'Ann', email: null, extra: 5 } }).fields, { name: 'Ann', email: null, extra: null });
});

test('a question from the browser is checked and trimmed', () => {
    assert.deepEqual(parseChatMessage(valid), { ...valid, page: { path: '/nl/prijzen', title: 'Prijzen' }, actions: ['quote_request'] });
    for (const changes of [{ conversationId: 'x' }, { message: ' ' }, { message: 'x'.repeat(1001) }, { message: 'a\u0000b' },
        { locale: 'fr' }, { page: { path: 'https://evil.test' } }, { actions: 'all' }]) {
        assert.equal(parseChatMessage({ ...valid, ...changes }), null);
    }
});

test('a prepared request fills the quote window', () => {
    const prefill = quotePrefill({ kind: 'quote_request', fields: { name: 'Ann', email: 'ann@example.com', phone: null, service: 'Kapsalon website', details: 'Met online afspraken' } });
    assert.deepEqual(prefill, { name: 'Ann', email: 'ann@example.com', phone: '', message: 'Kapsalon website\n\nMet online afspraken' });
});

test('answers become safe blocks and links stay on this site', () => {
    assert.deepEqual(parseChatMarkdown('**Prijs**: zie [prijzen](/nl/prijzen)\n\n- een\n- twee'), [
        { type: 'p', lines: [[{ type: 'strong', text: 'Prijs' }, { type: 'text', text: ': zie ' }, { type: 'link', text: 'prijzen', href: '/nl/prijzen' }]] },
        { type: 'ul', items: [[{ type: 'text', text: 'een' }], [{ type: 'text', text: 'twee' }]] },
    ]);
    const origin = 'http://localhost:3000';
    assert.deepEqual(chatLink('https://webdevamin.com/nl/prijzen#faq', origin), { kind: 'page', path: '/nl/prijzen#faq' });
    assert.deepEqual(chatLink('/nl/contact', origin), { kind: 'page', path: '/nl/contact' });
    assert.deepEqual(chatLink('tel:+32470930916', origin), { kind: 'direct', href: 'tel:+32470930916' });
    assert.equal(chatLink('https://evil.test/x', origin), null);
    assert.equal(chatLink('javascript:alert(1)', origin), null);
});

test('streamed events are read across chunks', async () => {
    const encoder = new TextEncoder();
    const chunks = ['data: {"type":"delta","te', 'xt":"Hoi"}\n\n', 'data: {"type":"completed"}\n\n'];
    const body = new ReadableStream({ start(controller) { chunks.forEach(chunk => controller.enqueue(encoder.encode(chunk))); controller.close(); } });
    const events = [];
    await readChatEvents(body, event => events.push(event));
    assert.deepEqual(events, [{ type: 'delta', text: 'Hoi' }, { type: 'completed' }]);
});
