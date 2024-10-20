import { exec } from 'child_process';

interface runZodProps{
    input: string;
    output: string;
}

export const runZod = ({
    input,
    output
}:runZodProps) => {
  const command = `ts-to-zod ${input} ${output}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
  });
};
