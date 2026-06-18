import nodemailer from "nodemailer";
import ContactMessage from "../models/ContactMessage.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to DB
    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    // Send email notification to admin
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER || "admin@nexstore.com",
        pass: process.env.EMAIL_PASS || "your_app_password_here"
      }
    });

    const adminEmail = process.env.ADMIN_EMAIL || "admin@nexstore.com";

    const mailOptions = {
      from: `"${name} (NexStore Inquirer)" <${process.env.EMAIL_USER || "admin@nexstore.com"}>`,
      to: adminEmail,
      replyTo: email,
      subject: `New NexStore Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 8px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #d4af37;">
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #777; margin-top: 20px;">Submitted on ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error("Email notification failed to send:", mailErr);
      // We log the error but proceed with returning success, since the message was successfully stored in the database.
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: contact
    });
  } catch (error) {
    console.error("Contact controller error:", error);
    res.status(500).json({ message: "Server error, failed to send message" });
  }
};
