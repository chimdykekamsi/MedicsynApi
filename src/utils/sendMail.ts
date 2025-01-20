import transporter from "../config/mail";
const sendMail = async (to: string, subject: string, message: string, link: string | null) =>{
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Email Template</title>
            <style>
            /* Reset Styles */
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }
            img {
                border: none;
                outline: none;
                text-decoration: none;
                display: block;
                max-width: 100%;
                height: auto;
            }
            table {
                border-collapse: collapse;
            }
            a {
                text-decoration: none;
            }

            /* Custom Styles */
            .wrapper {
                width: 100%;
                background-color: #f4f4f4;
                padding: 20px 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #4b0082;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .content {
                padding: 20px;
                font-family: Arial, sans-serif;
                color: #333333;
                line-height: 1.5;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                background-color: #4b0082;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 5px;
                display: inline-block;
                font-weight: bold;
            }
            .footer {
                background-color: #f4f4f4;
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #777;
            }
            </style>
        </head>
        <body>
            <div class="wrapper">
            <table class="container">
                <tr>
                <td>
                    <div class="header">
                    <h1>${subject}</h1>
                    </div>
                    <div class="content">
                    <p>Hello,</p>
                    <p>
                        ${message}
                    </p>
                    <div class="button-container">
                        <a href="${link}" class="button" target="_blank"
                        >${subject}</a
                        >
                    </div>
                    <p>
                        If you didn’t request this email, you can safely ignore it.
                    </p>
                    <p>Regards,<br />MedicSyn Coperation</p>
                    </div>
                    <div class="footer">
                    <p>
                        © 2025 MedicSyn Coperation. All rights reserved.
                    </p>
                    </div>
                </td>
                </tr>
            </table>
            </div>
        </body>
        </html>

    `;

    const mailOption = {
        from: "MedicSyn",
        to,
        subject,
        html: htmlContent
    };

    return await transporter.sendMail(mailOption);
};

export default sendMail;