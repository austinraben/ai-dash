import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PromptsService } from './src/prompts/prompts.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const promptsService = app.get(PromptsService);

  const predefinedPrompts = [
    { text: 'Name basketball players who have won an NBA championship', category: 'Sports' },
    { text: 'Name American football teams in the NFL', category: 'Sports' },
    { text: 'Name countries that start with the letter A', category: 'Geography' },
    { text: 'Name foods that are spicy', category: 'Food and Drink' },
    { text: 'Name objects found in a kitchen', category: 'Everyday Life & Objects' },
    { text: 'Name programming languages that are popular', category: 'Technology and Science' },
    { text: 'Name things that are hilariously weird', category: 'Fun and Silly' },
  ];

  for (const prompt of predefinedPrompts) {
    await promptsService.create(prompt);
  }

  console.log('Seeding complete');
  await app.close();
}

bootstrap();