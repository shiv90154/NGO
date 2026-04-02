// utils/sendEmail.js
const nodemailer = require("nodemailer");

/**
 * Send OTP email with HTML & plain text versions
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP
 * @param {number} expiryMinutes - OTP expiry in minutes (default 5)
 */
const sendEmail = async (email, otp, expiryMinutes = 5) => {
  // Create transporter (reuse if needed, but fine here)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Plain text version
  const textMessage = `Your OTP for Samraddh Bharat Foundation is: ${otp}\n\nThis OTP is valid for ${expiryMinutes} minutes.\n\nIf you did not request this, please ignore this email.`;

  // HTML version (more professional)
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4CAF50;">Samraddh Bharat Foundation</h2>
        <p style="color: #555;">Integrated Digital Management System</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px;">
        <h3 style="margin-top: 0;">Email Verification</h3>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; background: #fff; padding: 10px; border-radius: 4px; border: 1px dashed #4CAF50; margin: 15px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for <strong>${expiryMinutes} minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email or contact support.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="font-size: 12px; color: #888;">Samraddh Bharat Foundation - Empowering Rural India</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Samraddh Bharat Foundation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 OTP Verification - Samraddh Bharat Foundation",
      text: textMessage,
      html: htmlMessage,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error.message);
    throw new Error("Email sending failed. Please try again later.");
  }
};

module.exports = sendEmail;