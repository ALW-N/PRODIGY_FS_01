import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

interface SendEmailParams {
    email: string;
    emailType: 'VERIFY' | 'RESET';
    userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(),10)
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId,{verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }
       
       
        // Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a4f03ba508b07a",
    pass: "********9388"
  }
});

        const mailOptions = {
            from: 'alwintomy11@gmail.com', // sender address
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your Email" : "Reset your Password", // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token = ${hashedToken}"> here </a> to $ {emailType === "VERIFY" ? "verify your email" : "reset your password"}
             or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`, // html body
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};