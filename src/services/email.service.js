require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Bank" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome To Backend-Bank!";
  const text = `Dear ${name},

Welcome to Backend-Bank!

We’re excited to inform you that your account has been successfully registered with us.

Here are your registration details:

• Registered Email: ${userEmail}

You can now log in to your account and start managing your finances securely, including viewing transactions, checking balances, and transferring funds.

For security reasons, please do not share your login credentials or OTP with anyone. Our team will never ask for your password.

If you have any questions or need assistance, feel free to contact our support team.

Thank you for choosing Backend-Bank.
We look forward to serving you.

Warm regards,  
Backend-Bank
`;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Registration Successful</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f9;">
    
    <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <tr>
        <td style="background:#1e3a8a; padding:20px; text-align:center; color:#ffffff;">
          <h2 style="margin:0;">Backend-Bank</h2>
          <p style="margin:5px 0 0 0; font-size:14px;">Registration Successful</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; color:#333333;">
          <h3 style="margin-top:0;">Hello ${name},</h3>
          
          <p>
            Welcome to <strong>Backend-Bank</strong>! Your account has been successfully created.
          </p>

          <table width="100%" cellpadding="8" cellspacing="0" style="margin:20px 0; background:#f9fafb; border-radius:6px;">
            <tr>
              <td><strong>Registered Email:</strong></td>
              <td>${userEmail}</td>
            </tr>
          </table>

          <p>
            You can now log in and start managing your finances securely.
          </p>

          <p style="background:#fff3cd; padding:10px; border-radius:5px; font-size:14px;">
            ⚠️ For security reasons, never share your password or OTP with anyone.
          </p>

          <p>
            If you need any assistance, please contact our support team.
          </p>

          <p style="margin-top:30px;">
            Regards,<br>
            <strong>Backend-Bank</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#666;">
          © ${new Date().getFullYear()} Backend-Bank. All rights reserved.
        </td>
      </tr>

    </table>
  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = `Transaction Successful - ${amount}`;

  const text = `Dear ${name},

Your transaction has been successfully completed.

Transaction Details:

• Amount: ${amount}
• Transferred To Account: ${toAccount}

If you did not authorize this transaction, please contact our support team immediately.

For security reasons, never share your OTP or password with anyone.

Thank you for banking with Backend-Bank.

Regards,
Backend-Bank
`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Transaction Alert</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f9;">
    
    <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <tr>
        <td style="background:#1e3a8a; padding:20px; text-align:center; color:#ffffff;">
          <h2 style="margin:0;">Backend-Bank</h2>
          <p style="margin:5px 0 0 0; font-size:14px;">Transaction Alert</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; color:#333333;">
          <h3 style="margin-top:0;">Hello ${name},</h3>
          
          <p>
            Your transaction has been successfully completed.
          </p>

          <table width="100%" cellpadding="8" cellspacing="0" style="margin:20px 0; background:#f9fafb; border-radius:6px;">
            <tr>
              <td><strong>Amount:</strong></td>
              <td>${amount}</td>
            </tr>
            <tr>
              <td><strong>Transferred To Account:</strong></td>
              <td>${toAccount}</td>
            </tr>
          </table>

          <p style="background:#fff3cd; padding:10px; border-radius:5px; font-size:14px;">
            ⚠️ If you did not authorize this transaction, please contact support immediately.
          </p>

          <p style="margin-top:30px;">
            Regards,<br>
            <strong>Backend-Bank</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#666;">
          © ${new Date().getFullYear()} Backend-Bank. All rights reserved.
        </td>
      </tr>

    </table>
  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail, sendTransactionEmail };
