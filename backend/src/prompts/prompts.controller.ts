import { Controller, Get } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { Prompt } from './prompt.schema';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get('predefined')
  async getPredefinedPrompts(): Promise<Prompt[]> {
    return this.promptsService.getPredefinedPrompts();
  }
}