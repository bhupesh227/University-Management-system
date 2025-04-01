export const emailTemplate = (fullName: string, subject: string, messageBody: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
          }
          .container {
            min-height: 100vh;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background-color: #222222;
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
            color: #555555;
            line-height: 1.6;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #999999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome ${fullName}!</h1>
          </div>
          <div class="content">
            ${messageBody}
          </div>
          <div class="content">
            <p>If you have any questions, feel free to reach out.</p>
            <p>Best Regards,<br>Bhupesh Bora</p>
          </div>
          <div class="footer">
            &copy; 2025, Bhupesh Bora. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  };