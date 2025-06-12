import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
