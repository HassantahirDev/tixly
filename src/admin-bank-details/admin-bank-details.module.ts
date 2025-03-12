
import { Module } from "@nestjs/common";
import { AdminBankDetailsService } from "./admin-bank-details.service";
import { AdminBankDetailsController } from "./admin-bank-details.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AdminBankDetailsController],
  providers: [AdminBankDetailsService]
})
export class AdminBankDetailsModule {}
