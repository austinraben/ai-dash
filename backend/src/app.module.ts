import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptsModule } from './prompts/prompts.module';
import { CrewAIModule } from './crewai/crewai.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/aidash'),
    PromptsModule,
    CrewAIModule,
  ],
})
export class AppModule {}