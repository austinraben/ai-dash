import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prompt } from './schemas/prompt.schema';

@Injectable()
export class PromptsService {
  constructor(@InjectModel(Prompt.name) private promptModel: Model<Prompt>) {}

  async getPredefinedPrompts(): Promise<Prompt[]> {
    return this.promptModel.find({ isAIGenerated: false }).exec();
  }

  async create(createPromptDto: { text: string; category: string }): Promise<Prompt> {
    const createdPrompt = new this.promptModel({ ...createPromptDto, isAIGenerated: false });
    return createdPrompt.save();
  }
}