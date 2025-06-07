import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Prompt, PromptSchema } from './schemas/prompt.schema';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Prompt.name, schema: PromptSchema }])],
  providers: [PromptsService],
  controllers: [PromptsController],
  exports: [MongooseModule.forFeature([{ name: Prompt.name, schema: PromptSchema }])],
})
export class PromptsModule {}