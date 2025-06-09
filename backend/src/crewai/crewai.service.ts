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

  async runPythonScript(category?: string): Promise<{ prompt: string; answers: string[] }> {
    const crewaiDir = process.env.CREWAI_DIR;
    const pythonPath = `${crewaiDir}/venv/bin/python`;
    const scriptPath = process.env.CREWAI_SCRIPT_PATH;
    const args = category ? [`--category`, decodeURIComponent(category)] : [];
    const command = [pythonPath, scriptPath, ...args].join(' ');

    console.log(`Executing: ${command}`);

try {
        const { stdout, stderr } = await execAsync(command, { cwd: crewaiDir });
        if (stderr) {
            console.error(`Python stderr: ${stderr}`);
            throw new Error(`Python script failed: ${stderr}`);
        }
        console.log(`Python stdout: ${stdout}`);

        // Extract the JSON portion from stdout
        const jsonStart = stdout.indexOf('{');
        const jsonEnd = stdout.lastIndexOf('}') + 1;
        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error('No valid JSON found in Python output');
        }
        const jsonStr = stdout.substring(jsonStart, jsonEnd);

        // Parse the cleaned JSON
        const output = JSON.parse(jsonStr);
        if (!output.prompt || !Array.isArray(output.answers)) {
            throw new Error('Invalid output format: missing prompt or answers');
        }

        // Save the prompt and return the result
        const newPrompt = new this.promptModel({
            text: output.prompt,
            isAIGenerated: true,
            answers: output.answers,
        });
        await newPrompt.save();
        console.log(`Saved prompt: ${output.prompt}, answers count: ${output.answers.length}`);
        return { prompt: output.prompt, answers: output.answers };
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

  async getAllAIPrompts(): Promise<{ _id: string; text: string; answers: string[] }[]> {
    const prompts = await this.promptModel
      .find({ isAIGenerated: true })
      .sort({ createdAt: -1 })
      .exec();
    return prompts.map((p: PromptDocument) => ({ _id: (p._id as any).toString(), text: p.text, answers: p.answers }));
  }

  async clearPrompts(): Promise<void> {
    await this.promptModel.deleteMany({ isAIGenerated: true });
  }
}