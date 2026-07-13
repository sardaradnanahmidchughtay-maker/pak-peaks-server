import nodemailer from "nodemailer";

// Single reusable SMTP transporter, built from environment variables.
// No database involved — this is purely a mail relay.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default transporter;