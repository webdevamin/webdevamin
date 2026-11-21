const { ADMIN_URL, ADMIN_TENANT_ID, ADMIN_PUBLIC_API_KEY } = process.env;

/*
 * Verwijdert HTML uit formulierwaarden voordat ze in de e-mail belanden.
 */
const stripHtml = (value = '') => {
  return String(value).replace(/(<([^>]+)>)/gi, '').trim();
};

// The answers of the quote window (components/QuoteModal.jsx), each a short text. Null when anything else was sent.
const QUOTE_FIELDS = ['need', 'budget', 'package', 'page', 'source'];
const parseQuote = quote => {
  if (!quote || typeof quote !== 'object' || Array.isArray(quote)) return null;
  const clean = {};
  for (const key of QUOTE_FIELDS) {
    const value = quote[key] ?? '';
    if (typeof value !== 'string' || value.length > 120) return null;
    clean[key] = stripHtml(value);
  }
  return clean;
};

// Dutch labels for the quote details in the email of the webdevamin.com tenant.
const QUOTE_LINES = { budget: 'Budget', package: 'Pakket', page: 'Pagina', source: 'Bron' };

/*
 * Sends the request through this site's own tenant ("Own website") in webdevamin.app: a quote request or a contact
 * message. Throws when the tenant did not accept it.
 */
async function sendViaTenant({ adminUrl, name, email, phone, message, callback, quote }) {
  const [path, body] = quote
    ? ['/api/public/quote-requests', {
      tenantId: ADMIN_TENANT_ID,
      channel: 'form',
      form: {
        name, email, phone: phone || null,
        service: (quote.need || quote.package || '').slice(0, 200) || null,
        message: ['Offerteaanvraag via webdevamin.com.',
          Object.entries(QUOTE_LINES).filter(([key]) => quote[key]).map(([key, label]) => `${label}: ${quote[key]}`).join('\n'),
          message].filter(Boolean).join('\n\n'),
      },
    }]
    : ['/api/public/email/send', {
      tenantId: ADMIN_TENANT_ID,
      type: 'contact',
      // A fixed subject keeps the visitor's name out of the platform's sending log.
      form: { name, email, ...(phone ? { phone } : {}), subject: callback ? 'Terugbelverzoek website' : 'Contactformulier website', message },
    }];
  const res = await fetch(`${adminUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ADMIN_PUBLIC_API_KEY },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(`Tenant did not accept the request (${res.status}${data.error ? `: ${data.error}` : ''}).`);
  }
}

export async function POST(req) {
  try {
    const text = await req.text();
    if (text.length > 16000) return Response.json({ error: 'Request too large.' }, { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
    if (!body || typeof body !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400 });
    const { name, email, message = '', website, callback = false, phone = '' } = body;
    const isQuote = body.quote !== undefined;
    const quote = isQuote ? parseQuote(body.quote) : null;

    // Honeypot check - if website field is filled, it's likely a bot
    if (website) {
      // Silently reject but return success to not alert the bot
      return new Response(
        JSON.stringify({ message: 'Message sent successfully.' }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string'
      || typeof callback !== 'boolean' || typeof phone !== 'string' || phone.length > 40 || (isQuote && !quote)) {
      return Response.json({ error: 'Please check your details.' }, { status: 400 });
    }
    // A quote request may leave its phone number empty; the callback form needs one.
    const cleanPhone = callback || isQuote ? phone.trim() : '';
    if ((callback || cleanPhone) && (!/^[+0-9(). /-]{5,40}$/.test(cleanPhone) || !/\d/.test(cleanPhone))) {
      return Response.json({ error: 'Please enter your phone number.' }, { status: 400 });
    }

    const cleanName = stripHtml(name);
    const cleanEmail = stripHtml(email);
    const cleanMessage = stripHtml(message);

    if (!cleanName || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(cleanEmail) || (!cleanMessage && !isQuote)) {
      return new Response(
        JSON.stringify({ error: 'Please fill in the form correctly.' }),
        {
          status: 400,
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    }

    const adminUrl = (ADMIN_URL || '').replace(/\/+$/, '');
    if (!adminUrl || !ADMIN_TENANT_ID || !ADMIN_PUBLIC_API_KEY) {
      throw new Error('Admin app email delivery is not configured.');
    }
    await sendViaTenant({ adminUrl, name: cleanName, email: cleanEmail, phone: cleanPhone, message: cleanMessage, callback, quote });

    return Response.json({ message: 'Bedankt! Uw bericht werd successvol verstuurd. Ik hou u zo snel mogelijk op hoogte!' });
  } catch (err) {
    console.error(
      'Contact email send failed:',
      err instanceof Error ? err.message : 'Unknown error'
    );

    return new Response(
      JSON.stringify({ error: 'Er ging iets mis met de website. Probeer het later opnieuw.' }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
  }
}
