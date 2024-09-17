import configs from "@/config";
import { env } from "@/env";
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: env.MAILGUN_API_KEY || "dummy",
});

if (!env.MAILGUN_API_KEY && process.env.NODE_ENV === "development") {
  console.group("⚠️ MAILGUN_API_KEY missing from .env");
  console.error("It's not mandatory but it's required to send emails.");
  console.error("If you don't need it, remove the code from /libs/mailgun.js");
  console.groupEnd();
}

/**
 * Sends an email using the provided parameters.
 *
 * @async
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The HTML content of the email.
 * @param {string} replyTo - The email address to set as the "Reply-To" address.
 * @returns {Promise} A Promise that resolves when the email is sent.
 */

interface IMailgunParams {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: IMailgunParams) => {
  const data = {
    from: configs.mailgun.fromAdmin,
    to: [to],
    subject,
    text,
    html,
    ...(replyTo && { "h:Reply-To": replyTo }),
  };

  await mg.messages.create(
    (configs.mailgun.subdomain ? `${configs.mailgun.subdomain}.` : "") +
      configs.domain,
    data
  );
};
