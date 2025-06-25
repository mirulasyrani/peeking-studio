const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

exports.generateQuotationPDF = async (quotation, outputPath) => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          h1 { color: #102866; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
          .footer { margin-top: 2rem; font-size: 10px; }
        </style>
      </head>
      <body>
        <h1>Quotation - ${quotation.quotation_no}</h1>
        <p><strong>Client:</strong> ${quotation.client_name}</p>
        <p><strong>Email:</strong> ${quotation.client_email}</p>
        <p><strong>Address:</strong> ${quotation.client_address}</p>
        <p><strong>Date:</strong> ${quotation.date?.toISOString().split('T')[0]}</p>

        <table>
          <thead>
            <tr>
              <th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.unit_price}</td>
                <td>${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 style="text-align:right;">Total: RM ${quotation.total_amount}</h3>
        <p class="footer">* Quotation valid for 30 days</p>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
};
