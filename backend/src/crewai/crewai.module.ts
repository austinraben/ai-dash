import { Module } from '@nestjs/common';
import { CrewAIService } from './crewai.service';
import { CrewAIController } from './crewai.controller';
import { PromptsModule } from '../prompts/prompts.module';

@Module({
  imports: [PromptsModule],
  providers: [CrewAIService],
  controllers: [CrewAIController]
})
export class CrewAIModule {}
