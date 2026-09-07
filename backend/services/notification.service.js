import nodemailer from 'nodemailer';
import twilio from 'twilio';
import logger from '../config/logger.js';

// ============================================================
// NOTIFICATION DISPATCH SERVICE — WhatsApp (Twilio) & Gmail (Nodemailer)
// ============================================================

/**
 * Send direct incoming WhatsApp message using Twilio WhatsApp API.
 * 
 * In Twilio Sandbox mode:
 * 1. Twilio provides a free sandbox number: whatsapp:+14155238886
 * 2. User joins sandbox by sending "join <code-word>" from their WhatsApp once.
 * 3. Server can then send direct incoming WhatsApp messages to the user's phone!
 */
export const sendWhatsAppMessage = async ({ to, message }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  const cleanPhone = (to || '').replace(/\D/g, '');
  const targetNumber = cleanPhone.length === 10 ? `whatsapp:+91${cleanPhone}` : `whatsapp:+${cleanPhone}`;

  if (!accountSid || !authToken || accountSid.includes('your_') || authToken.includes('your_')) {
    logger.warn('[WhatsAppService] Twilio credentials not configured in .env. Message ready for dispatch.');
    return {
      success: false,
      channel: 'whatsapp',
      configured: false,
      recipient: targetNumber,
      message: 'Twilio credentials not configured in backend/.env yet.',
      fallbackDeepLink: `https://api.whatsapp.com/send?phone=${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}&text=${encodeURIComponent(message)}`
    };
  }

  try {
    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({
      from: fromNumber,
      to: targetNumber,
      body: message
    });

    logger.info(`[WhatsAppService] Incoming WhatsApp message sent successfully! SID: ${result.sid} to ${targetNumber}`);
    return {
      success: true,
      channel: 'whatsapp',
      configured: true,
      sid: result.sid,
      recipient: targetNumber,
      status: result.status
    };
  } catch (error) {
    logger.error(`[WhatsAppService] Twilio send failed: ${error.message}`);
    return {
      success: false,
      channel: 'whatsapp',
      configured: true,
      error: error.message,
      recipient: targetNumber,
      fallbackDeepLink: `https://api.whatsapp.com/send?phone=${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}&text=${encodeURIComponent(message)}`
    };
  }
};

/**
 * Send direct incoming HTML email notification using Nodemailer.
 */
export const sendEmailAlert = async ({ to, subject, htmlContent, textContent }) => {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

  if (!smtpUser || !smtpPass || smtpUser.includes('your_') || smtpPass.includes('your_')) {
    logger.warn('[EmailService] SMTP / Gmail credentials not configured in .env. Digest synthesized.');
    return {
      success: false,
      channel: 'email',
      configured: false,
      recipient: to,
      message: 'SMTP credentials not configured in backend/.env yet.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"SkillVerse Career Alerts" <${smtpUser}>`,
      to,
      subject: subject || '🎯 SkillVerse Daily Govt Recruitment Digest',
      text: textContent,
      html: htmlContent
    });

    logger.info(`[EmailService] Incoming alert email dispatched! MessageId: ${info.messageId} to ${to}`);
    return {
      success: true,
      channel: 'email',
      configured: true,
      messageId: info.messageId,
      recipient: to
    };
  } catch (error) {
    logger.error(`[EmailService] Email dispatch failed: ${error.message}`);
    return {
      success: false,
      channel: 'email',
      configured: true,
      error: error.message,
      recipient: to
    };
  }
};

/**
 * Generate a rich, modern HTML template for email delivery.
 */
export const generateRecruitmentEmailHtml = ({ candidateName = 'Subba Reddy', jobs = [] }) => {
  const jobRows = jobs.map((job, idx) => `
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 11px; font-weight: 700; color: #059669; background-color: #ecfdf5; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
          Notice #${idx + 1}
        </span>
        <span style="font-size: 12px; font-weight: 600; color: #dc2626;">
          📅 Last Date: ${job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Check Portal'}
        </span>
      </div>
      <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0f172a; line-height: 1.3;">
        ${job.title}
      </h3>
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">
        🏢 <strong>Dept:</strong> ${job.organization || 'Government of AP / India'} &nbsp;|&nbsp; 👥 <strong>Vacancies:</strong> ${job.vacancies || 'Multiple'}
      </p>
      <a href="${job.applyLink || 'https://psc.ap.gov.in'}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 8px;">
        Apply Online / View Gazette &rarr;
      </a>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 24px 12px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SkillVerse Career Hub</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">🎯 Daily Verified Government Recruitment Bulletin</p>
        </div>

        <!-- Body -->
        <div style="padding: 24px; background-color: #f8fafc;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            Hello <strong>${candidateName}</strong>,<br>
            Here are the latest active opportunities matched to your preferences:
          </p>

          ${jobRows}

          <!-- Footer Action -->
          <div style="text-align: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">
              Track all <strong>214+ live notifications</strong> & download syllabus PDFs:
            </p>
            <a href="https://skillverse-app.com/careers?type=govt" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 12px;">
              Explore Full Career Hub &rarr;
            </a>
          </div>
        </div>

        <!-- Footnote -->
        <div style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
          You received this email because you registered on SkillVerse. To update preferences, visit Career Hub.
        </div>
      </div>
    </body>
    </html>
  `;
};
