
import { Module } from "@nestjs/common";
import { TicketsPaymentService } from "./tickets-payment.service";
import { TicketsPaymentController } from "./tickets-payment.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [TicketsPaymentController],
  providers: [TicketsPaymentService]
})
export class TicketsPaymentModule {}
