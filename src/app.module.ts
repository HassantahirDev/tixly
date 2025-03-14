import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { EventInteractionModule } from './event-interaction/event-interaction.module';
import { OrganizerModule } from './organizer/organizer.module';
import { AdminModule } from './admin/admin.module';
import { EventRegistrationPaymentModule } from './event-registration-payment/event-registration-payment.module';
import { UserModule } from './user/user.module';
import { BankDetailsModule } from './organizer-bank-details/bank-details.module';
import { AdminBankDetailsModule } from './admin-bank-details/admin-bank-details.module';
import { ImageModule } from './image/image.module';
import { TicketsPaymentModule } from './tickets-payment/tickets-payment.module';
import { EventCategoryModule } from './event-category/event-category.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MailerModule,
    EventModule,
    TicketsPaymentModule,
    OrganizerModule,
    AdminModule,
    EventRegistrationPaymentModule,
    UserModule,
    BankDetailsModule,
    AdminBankDetailsModule,
    ImageModule,
    EventCategoryModule,
    EventInteractionModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
