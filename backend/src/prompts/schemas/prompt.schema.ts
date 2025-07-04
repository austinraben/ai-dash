import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromptDocument = Prompt & Document;

@Schema({ timestamps: true })
export class Prompt {
  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  isAIGenerated: boolean;

  @Prop({ type: [String], default: [] })
  answers: string[]; 
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);