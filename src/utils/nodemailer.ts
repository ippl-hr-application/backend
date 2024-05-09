import nodemailer, { SendMailOptions } from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dimpram15@gmail.com",
    pass: "hvsk wkpx hrni fesj",
  },
});

export const sendEmail = (mailOptions: SendMailOptions) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

