import { spawn } from 'child_process';
import * as path from 'path';
import process from 'process';

interface RunZodProps {
  input: string;
  output: string;
  skipValidation: boolean;
}

export const runZod = ({ input, output, skipValidation }: RunZodProps): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 상대 경로로 변환 (ts-to-zod는 상대 경로를 선호함)
    const cwd = process.cwd();
    const inputPath = path.relative(cwd, path.join(input, 'data-contracts.ts'));
    const outputPath = path.relative(cwd, path.join(output, 'schema.ts'));

    const command = 'npx';
    const args = ['ts-to-zod', inputPath, outputPath, ...(skipValidation ? ['--skipValidation'] : [])];

    const childProcess = spawn(command, args);

    childProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    childProcess.stderr.on('data', (data) => {
      console.log(`${data}`);
    });

    childProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Command finished with code ${code}`);
        reject(new Error(`ts-to-zod exited with code ${code}`));
      } else {
        console.log('Command finished successfully');
        resolve();
      }
    });

    childProcess.on('error', (error) => {
      console.error(`Execution error: ${error}`);
      reject(error);
    });
  });
};
