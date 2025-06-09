import { Controller, Get, Query, Delete } from '@nestjs/common'; // Added Delete import
import { CrewAIService } from './crewai.service';

@Controller('crewai')
export class CrewAIController {
  constructor(private readonly crewAIService: CrewAIService) {}

  @Get('generate-prompt')
  async generatePrompt(@Query('category') category?: string): Promise<{ prompt: string; answers: string[]; error?: string; isNew?: boolean }> {
    try {
      const { prompt, answers } = await this.crewAIService.runPythonScript(category);
      return { prompt, answers, isNew: true };
    } catch (error) {
      return { prompt: '', answers: [], error: error.message, isNew: false };
    }
  }

  @Get('all-prompts')
  async getAllPrompts(): Promise<{ prompts: { _id: string; text: string; answers: string[] }[] }> {
    try {
      const prompts = await this.crewAIService.getAllAIPrompts();
      return { prompts };
    } catch (error) {
      console.error('Error fetching all prompts:', error);
      return { prompts: [] };
    }
  }

  @Delete('clear-prompts') // Added this route
  async clearPrompts(): Promise<{ message: string; error?: string }> {
    try {
      await this.crewAIService.clearPrompts();
      return { message: 'Prompts cleared successfully' };
    } catch (error) {
      return { message: '', error: error.message };
    }
  }
}