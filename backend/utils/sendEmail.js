const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('Thiếu EMAIL_USER hoặc EMAIL_PASS trong file .env');
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"Thư Viện Online" <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
