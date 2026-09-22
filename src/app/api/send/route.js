const { ADMIN_URL, ADMIN_API_KEY, MAIL_TO } = process.env;

/*
 * Verwijdert HTML uit formulierwaarden voordat ze in de e-mail belanden.
 */
const stripHtml = (value = '') => {
  return String(value).replace(/(<([^>]+)>)/gi, '').trim();
};

const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export async function POST(req) {
  try {
    const text = await req.text();
    if (text.length > 16000) return Response.json({ error: 'Request too large.' }, { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
    if (!body || typeof body !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400 });
    const { name, email, message, website, callback = false, phone = '' } = body;

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
      || typeof callback !== 'boolean' || typeof phone !== 'string' || phone.length > 40) {
      return Response.json({ error: 'Please check your details.' }, { status: 400 });
    }
    const cleanPhone = callback ? phone.trim() : '';
    if (callback && (!/^[+0-9(). /-]{5,40}$/.test(cleanPhone) || !/\d/.test(cleanPhone))) {
      return Response.json({ error: 'Please enter your phone number.' }, { status: 400 });
    }

    const cleanName = stripHtml(name);
    const cleanEmail = stripHtml(email);
    const cleanMessage = stripHtml(message);

    if (!cleanName || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(cleanEmail) || !cleanMessage) {
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

    if (!ADMIN_URL || !ADMIN_API_KEY || !MAIL_TO) {
      throw new Error('Admin app email delivery is not configured.');
    }

    const emailData = {
      from: 'hello@mail.webdevamin.com',
      to: [{ email: MAIL_TO }],
      subject: `New portfolio message from ${cleanName}`,
      replyTo: [{ email: cleanEmail, name: cleanName }],
      html: `<html><body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
        ${callback ? `<p><strong>Callback requested:</strong> Yes</p><p><strong>Phone:</strong> ${escapeHtml(cleanPhone)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(cleanMessage).replace(/\n/g, '<br>')}</p>
      </body></html>`,
    };

    const adminUrl = ADMIN_URL.replace(/\/+$/, '');
    const res = await fetch(`${adminUrl}/api/saas/integrations/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      },
      body: JSON.stringify(emailData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const providerError = data.error || `Request failed with status ${res.status}`;
      console.error('Admin app email error:', {
        status: res.status,
        code: data.code || null,
        error: providerError,
      });
      throw new Error(providerError);
    }

    if (!data.messageId) {
      throw new Error('Admin app did not return an email message ID.');
    }

    return new Response(
      JSON.stringify({ message: `Bedankt! Uw bericht werd successvol verstuurd. Ik hou u zo snel mogelijk op hoogte!` }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
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
