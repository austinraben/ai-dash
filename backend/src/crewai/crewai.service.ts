import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prompt, PromptDocument } from '../prompts/schemas/prompt.schema';

const execAsync = promisify(exec);

@Injectable()
export class CrewAIService {
  constructor(@InjectModel(Prompt.name) private promptModel: Model<PromptDocument>) {}

async runPythonScript(category?: string): Promise<string> {
  const crewaiDir = process.env.CREWAI_DIR;
  const pythonPath = `${crewaiDir}/venv/bin/python`;
  const scriptPath = process.env.CREWAI_SCRIPT_PATH;
  const args = category ? [`--category`, category] : [];
  const command = [pythonPath, scriptPath, ...args].join(' ');

  console.log(`Executing: ${command}`);

  try {
    const { stdout, stderr } = await execAsync(command, { cwd: crewaiDir });
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
      throw new Error(`Python script failed: ${stderr}`);
    }
    console.log(`Python stdout: ${stdout}`);
    const promptLine = stdout.split('\n').find(line => line.startsWith('PROMPT: '));
    if (promptLine) {
      const promptText = promptLine.replace('PROMPT: ', '').trim();
      const newPrompt = new this.promptModel({
        text: promptText,
        isAIGenerated: true,
      });
      await newPrompt.save();
      console.log(`Saved prompt: ${promptText}`);
      return promptText;
    }
    throw new Error('No prompt found in output');
  } catch (error) {
    console.error(`Execution error: ${error.message}`);
    throw error;
  }
}

  async getLatestPrompt(): Promise<string | null> {
    const latest = await this.promptModel
      .findOne({ isAIGenerated: true })
      .sort({ createdAt: -1 })
      .exec();
    return latest ? latest.text : null;
  }

  async clearPrompts(): Promise<void> {
    await this.promptModel.deleteMany({ isAIGenerated: true });
  }
}