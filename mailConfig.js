const nodemailer = require("nodemailer");
const uuid = require("uuid");
require('dotenv').config();

const emailLogin = process.env.EMAIL_LOGIN;
const emailPassword = process.env.EMAIL_PASSWORD;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailLogin,
    pass: emailPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


function generateVerificationToken() {
  return uuid.v4();
}


function sendVerificationEmail(email, verificationToken) {
  const mailOptions = {
    from: emailLogin,
    to: email,
    subject: "Potwierdzenie rejestracji",
    text: `Kliknij poniższy link, aby potwierdzić rejestrację: http://localhost:3000/api/users/verify/${verificationToken}`,
  };

  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Błąd podczas wysyłania e-maila weryfikacyjnego:", error);
    } else {
      console.log("E-mail weryfikacyjny został wysłany:", info.response);
    }
  });
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
};
