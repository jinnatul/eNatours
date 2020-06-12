let nodemailer = require('nodemailer');

let sendEmail = async options => {
  // create a transporter
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define the email options
  let mailOptions = {
    from: 'Morol <morolswediu@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  
  // Actually send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;