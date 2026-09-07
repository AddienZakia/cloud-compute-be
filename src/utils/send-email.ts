import { readFileSync } from "fs";
import nodemailer from "nodemailer";
import { sendEmailType } from "../types/send-email";
import { logger } from "./logger";

export const sendEmail = async (
  to: string,
  subject: string,
  data: sendEmailType,
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const file =
    data.type === "reset"
      ? "reset-mail-template.html"
      : "verify-mail-template.html";
  const dataFile = await readFileSync(
    process.cwd() + `\\src\\constants\\${file}`,
    {
      encoding: "utf-8",
    },
  );

  const finalData = dataFile
    .replace("{{title}}", data.title)
    .replace("{{name}}", data.name)
    .replace("{{link}}", data.link);
  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html: finalData,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      logger.error(error);
    }
  });
};
