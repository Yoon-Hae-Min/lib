import { spawn } from 'child_process';

interface RunZodProps {
  input: string;
  output: string;
}

export const runZod = ({ input, output }: RunZodProps) => {
  const command = 'ts-to-zod';
  const args = [`${input}/data-contracts.ts`, `${output}/schema.ts`, '--skipValidation'];
  /** WARNING: ts-to-zod 라이브러리 상의 문제 때문에 타입을 생성하고 재 검증하는 과정의 validation을 꺼두도록 설정 라이브러리 디버깅 개발시에만 켜두고 검증 필요*/

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
