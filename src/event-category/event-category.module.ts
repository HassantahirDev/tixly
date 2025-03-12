
import { Module } from "@nestjs/common";
import { EventCategoryService } from "./event-category.service";
import { EventCategoryController } from "./event-category.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [EventCategoryController],
  providers: [EventCategoryService]
})
export class EventCategoryModule {}
