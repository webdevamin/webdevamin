export const config = {
  runtime: "edge",
};

const { MAIL_API_KEY, MAIL_TO } = process.env;

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
    const apiUrl = 'https://api.brevo.com/v3/smtp/email';

    const emailData = {
      sender: {
        name: name,
        email: email,
      },
      to: [
        {
          email: MAIL_TO,
          name: "Amin",
        },
      ],
      subject: `New portfolio message from ${name}`,
      htmlContent: `<html><body><p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${cleanMessage}</p></body></html>`,
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Api-Key': MAIL_API_KEY,
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(emailData),
    });

    if (!res.ok) throw new Error();
    else await res.json();

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
      console.error(err.message)
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
