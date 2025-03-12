
import { Module } from "@nestjs/common";
import { EventRegistrationPaymentService } from "./event-registration-payment.service";
import { EventRegistrationPaymentController } from "./event-registration-payment.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [EventRegistrationPaymentController],
  providers: [EventRegistrationPaymentService]
})
export class EventRegistrationPaymentModule {}
