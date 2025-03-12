import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { PaymentStatus } from '@prisma/client';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class OrganizerService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async findAll() {
    try {
      const Organizer = await this.prisma.organizer.findMany();
      return {
        success: true,
        data: Organizer,
        message: 'Organizers fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const Organizer = await this.prisma.organizer.findUnique({
        where: { id },
      });
      if (!Organizer) {
        throw new NotFoundException(`Organizer with id ${id} not found`);
      }
      return {
        success: true,
        data: Organizer,
        message: 'Organizer fetched successfully',
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  // async create(data: CreateOrganizerDto) {
  //   try {
  //     const Organizer = await this.prisma.organizer.create({ data });
  //     return {
  //       success: true,
  //       data: null,
  //       message: "Organizer created successfully",
  //     };
  //   } catch (error) {
  //     throw new BadRequestException('Error creating record.');
  //   }
  // }

  async update(id: string, data: UpdateOrganizerDto) {
    try {
      const Organizer = await this.prisma.organizer.update({
        where: { id },
        data,
      });
      return {
        success: true,
        data: null,
        message: 'Organizer updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Organizer with id: ${id} not found for update`,
        );
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async disapproveTicketsPayment(id: string) {
    const payment = await this.prisma.ticketsPayment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    const paymentStatus = await this.prisma.ticketsPayment.update({
      where: { id },
      data: { status: PaymentStatus.REJECTED },
    });

    const event = await this.prisma.event.update({
      where: { id: payment.eventId },
      data: { capacity: { increment: payment.quantity } },
    });

    return {
      success: true,
      data: { paymentStatus, event },
      message: 'Payment disapproved successfully',
    };
  }

  async approveTicketsPayment(id: string) {
    console.log('EventRegistrationPaymentModule', id);

    const payment = await this.prisma.ticketsPayment.findUnique({
      where: { id },
      include: { User: true, Event: true }, // Ensure related data is included
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    // Update payment status
    const paymentStatus = await this.prisma.ticketsPayment.update({
      where: { id },
      data: { status: PaymentStatus.APPROVED },
    });

    // Generate QR Code for the ticket
    const qrCodeBase64 = await this.generateQRCode({
      event: payment.Event.title,
      user: payment.User.name,
      ticketId: payment.id,
      date: payment.Event.date,
    });

    // Generate PDF ticket
    const pdfPath = await this.generateTicketPDF(payment, qrCodeBase64);

    console.log('pdfPath', pdfPath);

    // Send email with the new mail service
    await this.mailerService.sendTicketEmail(
      payment.User.email,
      '🎫 Your Electronic Ticket - Event Confirmation',
      {
        eventName: payment.Event.title,
        eventDate: payment.Event.date,
        venue: payment.Event.location,
        qrCodeBase64,
      },
      pdfPath,
    );

    return {
      success: true,
      data: { paymentStatus },
      message: 'Payment approved & Ticket Booked successfully',
    };
  }

  private async generateQRCode(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(JSON.stringify(data), (err, url) => {
        if (err) reject(err);
        resolve(url); // Returns a Base64 string of the QR code
      });
    });
  }

  private async generateTicketPDF(
    payment: any,
    qrCodeBase64: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      if (!fs.existsSync('./tmp')) {
        fs.mkdirSync('./tmp', { recursive: true });
      }

      const pdfPath = `./tmp/ticket-${payment.id}.pdf`;
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 30, left: 30, right: 30, bottom: 30 },
        info: {
          Title: `Ticket for ${payment.Event.title}`,
          Author: 'Ticket System',
        },
      });
      const writeStream = fs.createWriteStream(pdfPath);

      doc.pipe(writeStream);

      // Modern color scheme
      const primaryColor = '#3B82F6'; // Blue
      const accentColor = '#10B981'; // Green
      const darkColor = '#1F2937'; // Dark Gray
      const lightColor = '#F9FAFB'; // Light Gray
      const highlightColor = '#EF4444'; // Red

      // Create a gradient background
      const gradient = doc.linearGradient(20, 20, 770, 520);
      gradient.stop(0, '#FFFFFF').stop(1, '#F3F4F6');

      // Ticket container with rounded corners
      doc
        .roundedRect(20, 20, 750, 570, 10)
        .fillAndStroke(gradient, primaryColor);

      // Inner border for design
      doc.roundedRect(30, 30, 730, 550, 8).stroke(primaryColor);

      // Header with logo/icon
      doc
        .fillColor(darkColor)
        .fontSize(32)
        .font('Helvetica-Bold')
        .text('ELECTRONIC TICKET', 40, 50, { align: 'center' });

      // Decorative elements
      doc.circle(60, 60, 15).fillAndStroke(accentColor, primaryColor);
      doc.circle(730, 60, 15).fillAndStroke(accentColor, primaryColor);

      // Horizontal divider
      doc.moveTo(60, 100).lineTo(730, 100).lineWidth(2).stroke(primaryColor);

      // Event Details Section with icons
      doc
        .fillColor(darkColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('EVENT DETAILS', 50, 120);
      const formattedDate = new Date(payment.Event.date).toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      );

      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor(darkColor)
        .text(`Event: ${payment.Event.title}`, 70, 150);
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor(darkColor)
        .text(`Date: ${formattedDate}`, 70, 180);
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor(darkColor)
        .text(`Venue: ${payment.Event.location}`, 70, 210);

      // Attendee Information
      doc
        .fillColor(darkColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('ATTENDEE INFORMATION', 50, 260);
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor(darkColor)
        .text(`Name: ${payment.User.name}`, 70, 290);
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor(darkColor)
        .text(`Email: ${payment.User.email}`, 70, 320);

      // Ticket ID with highlight
      doc.roundedRect(50, 350, 300, 40, 5).fill(primaryColor);
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(lightColor)
        .text(`Ticket ID: ${payment.id}`, 70, 360);

      // QR Code Section with border
      doc.roundedRect(450, 150, 280, 280, 10).stroke(accentColor);
      doc
        .fillColor(darkColor)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('SCAN FOR ENTRY', 350, 170, { align: 'center' });
      doc.image(qrCodeBase64, 490, 200, { width: 200, height: 200 });

      // Important information
      doc.roundedRect(50, 475, 680, 60, 5).fill('#FEF2F2');
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor(highlightColor)
        .text('IMPORTANT:', 70, 500);
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor(darkColor)
        .text(
          'Please bring this ticket and a valid photo ID for entry. This ticket is non-transferable.',
          170,
          500,
        );

      // Footer with barcode-like design
      const barcodeY = 550;
      for (let i = 0; i < 40; i++) {
        const x = 50 + i * 18;
        const height = Math.random() * 10 + 5;
        doc.rect(x, barcodeY, 3, height).fill('#000000');
      }

      doc.end();

      writeStream.on('finish', () => resolve(pdfPath));
      writeStream.on('error', reject);
    });
  }

  async delete(id: string) {
    try {
      const Organizer = await this.prisma.organizer.delete({ where: { id } });
      return {
        success: true,
        data: Organizer,
        message: 'Organizer deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Organizer with id ${id} not found for deletion`,
        );
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
