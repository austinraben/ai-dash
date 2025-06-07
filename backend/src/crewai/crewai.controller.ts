import { Controller, Get } from '@nestjs/common';
import { CrewAIService } from './crewai.service';

@Controller('crewai')
export class CrewAIController {
  constructor(private readonly crewAIService: CrewAIService) {}

  @Get('test-python')
  async testPython(): Promise<string> {
    try {
      const prompt = await this.crewAIService.runPythonScript();
      return `Generated Prompt: ${prompt}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
}