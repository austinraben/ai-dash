import { Module } from '@nestjs/common';
import { CrewAIService } from './crewai.service';
import { CrewAIController } from './crewai.controller';

@Module({
  providers: [CrewAIService],
  controllers: [CrewAIController]
})
export class CrewAIModule {}
