import { spawn } from 'child_process';

interface RunZodProps {
  input: string;
  output: string;
}

export const runZod = ({ input, output }: RunZodProps) => {
  const command = 'ts-to-zod';
  const args = [`${input}/data-contracts.ts`, `${output}/schema.ts`];

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
    } else {
      console.log('Command finished successfully');
    }
  });

  childProcess.on('error', (error) => {
    console.error(`Execution error: ${error}`);
  });
};
