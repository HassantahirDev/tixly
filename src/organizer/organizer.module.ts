
import { Module } from "@nestjs/common";
import { OrganizerService } from "./organizer.service";
import { OrganizerController } from "./organizer.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { MailerModule } from "src/mailer/mailer.module";

@Module({
  imports: [PrismaModule, MailerModule],
  controllers: [OrganizerController],
  providers: [OrganizerService]
})
export class OrganizerModule {}
