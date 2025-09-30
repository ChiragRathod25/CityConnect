const websiteurl = process.env.VITE_BASE_URL;

const resetPasswordEmailTemplate = ({username, reseturl}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Your Password</title>
  <style>
    /* General Reset */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
    }
    
    /* Container */
    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    /* Main table */
    .main-table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      border-radius: 8px;
      overflow: hidden;
    }

    /* Content */
    .content {
      padding: 20px;
      text-align: center;
      background-color: white;
    }

    /* Logo */
    .logo {
      width: 100px;
      margin-bottom: 20px;
    }

    /* Button */
    .btn {
      display: inline-block;
      padding: 12px 16px;
      background-color: #C30E59;
      color: white !important;
      text-decoration: none !important;
      font-weight: bold;
      border-radius: 6px;
      margin-top: 20px;
      font-size: 14px;
      mso-padding-alt: 12px 16px;
    }

    /* Remove default link styling */
    a {
      text-decoration: none !important;
    }

    a.btn {
      color: white !important;
    }

    /* Footer */
    .footer {
      padding: 15px;
      background: #eee;
      text-align: center;
      font-size: 14px;
      color: #777;
    }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      body, html {
        background-color: #121212 !important;
        color: #ffffff !important;
      }
      .container {
        background-color: #1e1e1e !important;
      }
      .content {
        background-color: #1e1e1e !important;
        color: white !important;
      }
      .footer {
        background-color: #1b1b1b !important;
        color: #aaa !important;
      }
      .btn {
        background-color: #F2AE66 !important;
        color: #121212 !important;
      }
    }

    /* Mobile Styles */
    @media screen and (max-width: 600px) {
      .container {
        width: 95% !important;
        margin: 10px auto !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <table class="main-table" role="presentation">
      <tr>
        <td class="content">
          
          
          <h2>Password Reset Request</h2>
          
          <p>Hello, ${username}.</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          
          <!-- Button with inline styles for Gmail compatibility -->
          <table border="0" cellspacing="0" cellpadding="0" style="margin: 20px auto;">
            <tr>
              <td align="center" style="border-radius: 6px; background-color: #C30E59;" bgcolor="#C30E59">
                <a href="${reseturl}" target="_blank" style="border: 1px solid #C30E59; border-radius: 6px; color: white; display: inline-block; font-size: 14px; font-weight: bold; padding: 12px 16px; text-decoration: none; text-transform: none; background-color: #C30E59;">Reset Password</a>
              </td>
            </tr>
          </table>
          
          <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>&copy; 2025 CityConnect | All Rights Reserved</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};

export default resetPasswordEmailTemplate;