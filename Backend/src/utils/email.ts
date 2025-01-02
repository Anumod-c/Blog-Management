import nodemailer from 'nodemailer';
import config from '../infrastructure/config/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASS
    }
});

export const sendEmailVerification = async (to: string): Promise<void> => {
    console.log('hyy')
    const mailOptions = {
        from: config.EMAIL,
        to,
        subject: "Email Verification",
        text:` click to verify : http://localhost:5173/email-verfication/${to}`,
        html: `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }

            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }

            .email-header {
                background-color: #4CAF50;
                padding: 20px;
                text-align: center;
                color: white;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }

            .email-body {
                background-color: white;
                padding: 20px;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            }

            h1 {
                color: #4CAF50;
                text-align: center;
            }

            p {
                font-size: 16px;
                line-height: 1.5;
            }

            .verify-button {
                display: block;
                width: 100%;
                max-width: 200px;
                margin: 20px auto;
                padding: 15px;
                background-color: #4CAF50;
                color: white;
                text-align: center;
                text-decoration: none;
                font-size: 16px;
                border-radius: 5px;
            }

            .verify-button:hover {
                background-color: #45a049;
            }

            .email-footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 20px;
            }

            .email-footer a {
                color: #4CAF50;
                text-decoration: none;
            }
        </style>
    </head>

    <body>

        <div class="container">
            <div class="email-header">
                <h2>Email Verification</h2>
            </div>

            <div class="email-body">
                <h1>Verify Your Email Address</h1>
                <p>Hello,</p>
                <p>Thank you for registering with us! To complete your registration and activate your account, please click the button below to verify your email address.</p>

                <a href="http://localhost:5173/email-verification/${to}" class="verify-button">Verify Email</a>

                <p>If the button above doesn't work, please copy and paste the following URL into your web browser:</p>
                <p><a href="http://localhost:5173/email-verification/${to}">http://localhost:5173/email-verification/${to}</a></p>
                <p style='color:red'> Note: The link will expire in 30 minutes.</p>
                <p>If you did not create an account, please ignore this email.</p>
            </div>

            <div class="email-footer">
                <p>Need help? Contact us at <a href="mailto:nextera.elearning@gmail.com">support@yourdomain.com</a></p>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>

    </body>
    </html>
    `,
    }
    console.log('hyy gtgt')

    try {
        console.log('hyy 111')

        await transporter.sendMail(mailOptions);
        console.log("Mail sent to ", to);
    } catch (error) {
        console.error("Error sending OTP", error);
        throw new Error("Failed to send OTP email");
    }
}

//----------------------------------------------------------------------------------------------------------------------------------