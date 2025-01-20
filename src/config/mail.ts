import nodeMailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "./"; // Adjust the path as necessary

const transport = nodeMailer.createTransport(
    new SMTPTransport({
        host: config.MAIL_HOST,
        port: config.MAIL_PORT, 
        auth: {
          user: config.MAIL_USER, 
          pass: config.MAIL_PASS,
        },
      })
);

export default transport;