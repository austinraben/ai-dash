import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromptDocument = Prompt & Document;

@Schema()
export class Prompt {
  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  isAIGenerated: boolean;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);