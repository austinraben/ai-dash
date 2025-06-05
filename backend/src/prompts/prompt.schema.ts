import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Prompt extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: false })
  isAIGenerated: boolean;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);