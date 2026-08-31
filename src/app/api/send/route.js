const { ADMINBOOK_URL, ADMINBOOK_API_KEY, MAIL_TO } = process.env;

/*
 * Verwijdert HTML uit formulierwaarden voordat ze in de e-mail belanden.
 */
const stripHtml = (value = '') => {
  return String(value).replace(/(<([^>]+)>)/gi, '').trim();
};

export async function POST(req) {
  try {
    const { name, email, message, website } = await req.json();

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

    const cleanName = stripHtml(name);
    const cleanEmail = stripHtml(email);
    const cleanMessage = stripHtml(message);

    if (!cleanName || !cleanEmail || !cleanMessage) {
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

    if (!ADMINBOOK_URL || !ADMINBOOK_API_KEY || !MAIL_TO) {
      throw new Error('Adminbook email delivery is not configured.');
    }

    const emailData = {
      from: 'hello@mail.webdevamin.com',
      to: [{ email: MAIL_TO }],
      subject: `New portfolio message from ${cleanName}`,
      replyTo: [{ email: cleanEmail, name: cleanName }],
      html: `<html><body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      </body></html>`,
    };

    const adminbookUrl = ADMINBOOK_URL.replace(/\/+$/, '');
    const res = await fetch(`${adminbookUrl}/api/saas/integrations/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMINBOOK_API_KEY}`
      },
      body: JSON.stringify(emailData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const providerError = data.error || `Request failed with status ${res.status}`;
      console.error('Adminbook email error:', {
        status: res.status,
        code: data.code || null,
        error: providerError,
      });
      throw new Error(providerError);
    }

    if (!data.messageId) {
      throw new Error('Adminbook did not return an email message ID.');
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
