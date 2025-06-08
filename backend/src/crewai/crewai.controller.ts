import { Controller, Delete, Get, Query } from '@nestjs/common';
import { CrewAIService } from './crewai.service';

@Controller('crewai')
export class CrewAIController {
  constructor(private readonly crewAIService: CrewAIService) {}

  @Get('generate-prompt')
  async generatePrompt(@Query('category') category?: string): Promise<{ prompt: string; error?: string; isNew?: boolean }> {
    try {
      const prompt = await this.crewAIService.runPythonScript(category);
      return { prompt, isNew: true };
    } catch (error) {
      return { prompt: '', error: error.message, isNew: false };
    }
  }

  @Get('latest-prompt')
  async getLatestPrompt(): Promise<{ prompt: string; error?: string }> {
    try {
      const latestPrompt = await this.crewAIService.getLatestPrompt();
      return { prompt: latestPrompt || 'No prompts available' };
    } catch (error) {
      return { prompt: '', error: error.message };
    }
  }

  @Delete('clear-prompts')
  async clearPrompts(): Promise<{ message: string; error?: string }> {
    try {
      await this.crewAIService.clearPrompts();
      return { message: 'Prompts cleared successfully' };
    } catch (error) {
      return { message: '', error: error.message };
    }
  }
}