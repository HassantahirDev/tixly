import { Injectable } from '@nestjs/common';
require('dotenv').config();
const nodemailer = require('nodemailer');
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('APP_EMAIL'),
        pass: this.configService.get<string>('APP_EMAIL_PASSWORD'),
      },
    });
  }
  async sendEmail(
    recepient: string,
    subject: string,
    email_body: string,
  ): Promise<any> {
    const transporter = this.getTransporter();
    const mailOptions = this.getMailOptions(recepient, subject, email_body);

    transporter.sendMail(mailOptions, (error: { message: any }) => {
      if (error) {
        console.log('Error in sending mail(mailer service)', error.message);
      } else {
        console.log('Email Sent');
      }
    });
  }

  getTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use secure connection
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });
  }

  getMailOptions(recepient: string, subject: string, email_body: string) {
    const mailOptions = {
      from: `"Tixly" <${process.env.APP_EMAIL}>`, // Pretty sender name
      to: recepient,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background-color: #FBC02D;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
              text-align: center;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #FBC02D;
              margin: 20px 0;
            }
            .email-footer {
              text-align: center;
              font-size: 14px;
              color: #666666;
              padding: 20px;
              border-top: 1px solid #dddddd;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              color: #ffffff;
              background-color: #FBC02D;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin-top: 20px;
            }
            .button:hover {
              background-color: #e5a100;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Tixly</h1>
            </div>
            <div class="email-body">
             
                    <p>This is a one-time verification code.</p>
                    <p class="otp">Your OTP: <span>${email_body}</span></p>
                    <p style="margin-top: 20px;">Thank you for choosing Tixly. We’re here to help you stay connected!</p>
                  
              
            </div>
            <div class="email-footer">
              &copy; ${new Date().getFullYear()} Tixly. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return mailOptions;
  }

  async sendTicketEmail(to: string, subject: string, ticketDetails: any, attachmentPath?: string) {
    try {
      const { eventName, eventDate, venue, qrCodeBase64 } = ticketDetails;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="color: #333; text-align: center;">🎟️ Your Ticket for <strong>${eventName}</strong></h2>
            <p style="text-align: center; font-size: 16px; color: #555;">You're all set! Show this ticket at the event entrance.</p>

            <div style="border-top: 2px dashed #ddd; margin: 20px 0;"></div>

            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <tr>
                <th style="padding: 10px; font-size: 16px; color: #666;">Event:</th>
                <td style="padding: 10px; font-size: 16px;">${eventName}</td>
              </tr>
              <tr>
                <th style="padding: 10px; font-size: 16px; color: #666;">Date:</th>
                <td style="padding: 10px; font-size: 16px;">${eventDate}</td>
              </tr>
              <tr>
                <th style="padding: 10px; font-size: 16px; color: #666;">Venue:</th>
                <td style="padding: 10px; font-size: 16px;">${venue}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 20px;">
              <p style="font-size: 16px; color: #444;">Scan the QR Code below to check in:</p>
              <img src="cid:qrCode" style="width: 150px; height: 150px; border-radius: 5px;" />
            </div>

            <div style="border-top: 2px dashed #ddd; margin: 20px 0;"></div>

            <p style="text-align: center; font-size: 14px; color: #888;">
              Thank you for booking with us! 🎉  
              <br/>For any inquiries, contact <a href="mailto:support@example.com" style="color: #007BFF; text-decoration: none;">support@example.com</a>
            </p>
          </div>
        </div>
      `;

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        html: htmlContent,
        attachments: [
          {
            filename: 'Ticket.pdf',
            path: attachmentPath,
            contentType: 'application/pdf',
          },
          {
            filename: 'qr-code.png',
            content: Buffer.from(qrCodeBase64.split(',')[1], 'base64'),
            cid: 'qrCode',
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.response}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
