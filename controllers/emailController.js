// controllers/emailController.js
import nodemailer from "nodemailer";
import Email from "../models/email.js"; // <-- import model

export const sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body
    });

    // Save email record
    const emailDoc = new Email({ to, subject, body, status: "sent" });
    await emailDoc.save();

    res.json({ success: true, email: emailDoc });
  } catch (err) {
    // Log failed attempt too
    await Email.create({ to, subject, body, status: "failed" });
    res.status(500).json({ error: err.message });
  }
};
