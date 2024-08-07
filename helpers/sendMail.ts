import nodemailer from "nodemailer";

export const sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        // text: 'Email content'
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
        } else {
            console.log("Email send: " + info.response);
        }
    });
}