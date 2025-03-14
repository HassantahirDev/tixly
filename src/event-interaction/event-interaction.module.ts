import { Module } from '@nestjs/common';
import { EventInteractionController } from './event-interaction.controller';
import { EventInteractionService } from './event-interaction.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventInteractionController],
  providers: [EventInteractionService],
  exports: [EventInteractionService]
})
export class EventInteractionModule {} 