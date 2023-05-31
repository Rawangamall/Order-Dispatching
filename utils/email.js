const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email, 
      pass: process.env.Email_password,
    },
  });

  const mailOptions = {
    from: "orderdispatching4@gmail.com", 
    to: options.to, 
    subject: options.subject, 
    html: options.message, 
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
};


  module.exports = sendEmail;