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

  await transporter.sendMail(mailOptions);

};


  module.exports = sendEmail;