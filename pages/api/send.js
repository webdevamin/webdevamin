const SibApiV3Sdk = require("sib-api-v3-sdk");

const { MAIL_API_KEY, MAIL_TO } = process.env;

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];

apiKey.apiKey = MAIL_API_KEY;

export default async function handler(req, res) {
  try {
    const { body, method } = req;
    const { name, email, message } = body;

    if (method !== `POST`) {
      return res.status(400).json({ code: 400 });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ code: 400 });
    }

    const cleanMessage = message.replace(/(<([^>]+)>)/gi, "");

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const content = `<html><body><p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${cleanMessage}</p></body></html>`;

    sendSmtpEmail.subject = `New portfolio message from ${name}`;
    sendSmtpEmail.htmlContent = content;
    sendSmtpEmail.sender = { name: name, email: email };
    sendSmtpEmail.to = [{ email: MAIL_TO, name: "Amin" }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({ code: 200 });
  } catch (err) {
    res.status(500).json({ code: 500 });
  }
}
