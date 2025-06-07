import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class CrewAIService {
  async runPythonScript(): Promise<string> {
    const crewaiDir = process.env.CREWAI_DIR;
    const pythonPath = `${crewaiDir}/venv/bin/python`;
    const scriptPath = process.env.CREWAI_SCRIPT_PATH;
    const command = `${pythonPath} ${scriptPath}`;

    console.log(`Executing: ${command}`); // Debug log

    try {
      const { stdout, stderr } = await execAsync(command, { cwd: crewaiDir });
      if (stderr) {
        console.error(`Python stderr: ${stderr}`);
        throw new Error(`Python script failed: ${stderr}`);
      }
      console.log(`Python stdout: ${stdout}`);
      const promptLine = stdout.split('\n').find(line => line.startsWith('PROMPT: '));
      if (promptLine) {
        return promptLine.replace('PROMPT: ', '').trim();
      }
      throw new Error('No prompt found in output');
    } catch (error) {
      console.error(`Execution error: ${error.message}`);
      throw error;
    }
  }
}