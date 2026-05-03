const { RESEND_API_KEY, MAIL_TO } = process.env;

/*
 * Verwijdert HTML uit formulierwaarden voordat ze in de e-mail belanden.
 */
const stripHtml = (value = '') => {
  return String(value).replace(/(<([^>]+)>)/gi, '').trim();
};

export async function POST(req) {
  try {
    const { name, email, message, packageChoice, website } = await req.json();

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
    const cleanPackageChoice = stripHtml(packageChoice);

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

    const emailData = {
      from: `Contact Form <contact@webdevamin.com>`,
      to: MAIL_TO,
      subject: cleanPackageChoice
        ? `New ${cleanPackageChoice} message from ${cleanName}`
        : `New portfolio message from ${cleanName}`,
      reply_to: cleanEmail,
      html: `<html><body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        ${cleanPackageChoice ? `<p><strong>Package:</strong> ${cleanPackageChoice}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      </body></html>`,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.message || 'Failed to send email');
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
    console.error(err);

    if (err.message) {
      console.error(err.message);
    }

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
