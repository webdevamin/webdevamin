export const config = {
  runtime: "edge",
};

const { RESEND_API_KEY, MAIL_TO } = process.env;

export default async function handler(req) {
  try {
    const { method } = req;
    const { name, email, message } = await req.json();

    if (method !== `POST`) {
      return new Response(
        JSON.stringify('Method not allowed.'),
        {
          status: 400,
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    }

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify('Please fill in the form correctly.'),
        {
          status: 400,
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    }

    const cleanMessage = message.replace(/(<([^>]+)>)/gi, "");

    // Prepare email data for Resend
    const emailData = {
      from: `Contact Form <onboarding@resend.dev>`, // Must be a verified domain or Resend's default
      to: MAIL_TO,
      subject: `New portfolio message from ${name}`,
      reply_to: email, // Set reply-to as the visitor's email so you can reply directly
      html: `<html><body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      </body></html>`,
    };

    // Send email using Resend API
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
      JSON.stringify(`Bedankt! Uw bericht werd successvol verstuurd. Wij houden u zo snel mogelijk op hoogte!`),
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
      JSON.stringify('Er ging iets mis met de website. Probeer het later opnieuw.'),
      {
        status: 500,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
  }
}
