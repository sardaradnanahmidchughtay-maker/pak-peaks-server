import transporter from "../config/mailer.js";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function sendContactMessage(req, res) {
  try {
    const {
      name,
      email,
      phone,
      tour,
      travelDate,
      groupSize,
      message,
      company
    } = req.body || {};

    // Honeypot field — if a bot filled it in, silently accept but drop it.
    if (company) {
      return res.status(200).json({ success: true });
    }

    // Server-side validation (never trust the client alone)
    if (!name || name.trim().length < 2) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide your full name." });
    }
    if (!email || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email address." });
    }
    if (!phone || phone.trim().length < 7) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid phone number." });
    }
    if (!message || message.trim().length < 10) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a longer message." });
    }

    const toEmail = process.env.TO_EMAIL;

    await transporter.sendMail({
      from: `"Pak Peaks Website" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `New enquiry from ${name}${tour ? " — " + tour : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Interested in: ${tour || "N/A"}`,
        `Preferred travel date: ${travelDate || "N/A"}`,
        `Group size: ${groupSize || "N/A"}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <h2>New Website Enquiry — Pak Peaks Travels &amp; Tours</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Interested in:</strong> ${escapeHtml(tour || "N/A")}</p>
        <p><strong>Preferred travel date:</strong> ${escapeHtml(travelDate || "N/A")}</p>
        <p><strong>Group size:</strong> ${escapeHtml(groupSize || "N/A")}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `
    });

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact form error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send message. Please try again later." });
  }
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}