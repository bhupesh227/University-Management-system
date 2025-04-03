export const emailTemplateBorrow = (fullName: string, subject: string, messageBody: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Helvetica, Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #0a74da;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            color: #333333;
            font-size: 16px;
            line-height: 1.5;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777777;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #0a74da;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Hi ${fullName}</h1>
          </div>
          <div class="content">
            ${messageBody}
          </div>
          <div class="content" style="border-top:1px solid #eaeaea; margin-top:20px; padding-top:20px;">
            <p>If you have any questions or need assistance, please feel free to reply to this email.</p>
            <p>Best Regards,<br>Bhupesh Bora</p>
          </div>
          <div class="footer">
            &copy; 2025 Bhupesh Bora. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  };