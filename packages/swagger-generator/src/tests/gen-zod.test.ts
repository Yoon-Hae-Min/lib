import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { runSwagger } from '../gen-swagger';
import { runZod } from '../gen-zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('runZod', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  const outputDir = path.resolve(__dirname, 'output-zod');

  beforeEach(async () => {
    // output 디렉토리 초기화
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // 먼저 runSwagger로 data-contracts.ts 생성
    const yamlPath = path.join(fixturesDir, 'petstore.yaml');
    await runSwagger({
      input: yamlPath,
      output: outputDir,
      applyZodSchemaInAPI: false,
    });
  });

  afterAll(() => {
    // 테스트 후 정리
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
  });

  describe('skipValidation: false', () => {
    beforeEach(async () => {
      await runZod({
        input: outputDir,
        output: outputDir,
        skipValidation: false,
      });
    });

    it('schema.ts 파일이 생성되어야 한다', () => {
      const schemaPath = path.join(outputDir, 'schema.ts');
      expect(fs.existsSync(schemaPath)).toBe(true);
    });

    it('생성된 schema.ts에는 zod import가 포함되어야 한다', () => {
      const schemaContent = fs.readFileSync(path.join(outputDir, 'schema.ts'), 'utf-8');
      expect(schemaContent).toContain("import { z } from 'zod'");
    });

    it('생성된 schema.ts에는 Pet 스키마가 포함되어야 한다', () => {
      const schemaContent = fs.readFileSync(path.join(outputDir, 'schema.ts'), 'utf-8');
      expect(schemaContent).toContain('petSchema');
    });

    it('생성된 schema.ts에는 CreatePetPayload 스키마가 포함되어야 한다', () => {
      const schemaContent = fs.readFileSync(path.join(outputDir, 'schema.ts'), 'utf-8');
      expect(schemaContent).toContain('createPetPayloadSchema');
    });

    it('생성된 schema.ts에는 UpdatePetPayload 스키마가 포함되어야 한다', () => {
      const schemaContent = fs.readFileSync(path.join(outputDir, 'schema.ts'), 'utf-8');
      expect(schemaContent).toContain('updatePetPayloadSchema');
    });

    it('생성된 schema.ts 파일은 스냅샷과 일치해야 한다', () => {
      const schemaContent = fs.readFileSync(path.join(outputDir, 'schema.ts'), 'utf-8');
      expect(schemaContent).toMatchSnapshot();
    });
  });

  describe('skipValidation: true', () => {
    beforeEach(async () => {
      await runZod({
        input: outputDir,
        output: outputDir,
        skipValidation: true,
      });
    });

    it('schema.ts 파일이 생성되어야 한다', () => {
      const schemaPath = path.join(outputDir, 'schema.ts');
      expect(fs.existsSync(schemaPath)).toBe(true);
    });

    it('생성된 schema.ts에는 zod import가 포함되어야 한다', () => {
      const schemaContent = fs.readFileSync(path.join(outputDir, 'schema.ts'), 'utf-8');
      expect(schemaContent).toContain("import { z } from 'zod'");
    });

    it('생성된 schema.ts 파일은 스냅샷과 일치해야 한다', () => {
      const schemaContent = fs.readFileSync(path.join(outputDir, 'schema.ts'), 'utf-8');
      expect(schemaContent).toMatchSnapshot();
    });
  });

  describe('에러 처리', () => {
    it('존재하지 않는 파일을 입력하면 에러를 던져야 한다', async () => {
      await expect(
        runZod({
          input: '/non/existent/path',
          output: outputDir,
          skipValidation: false,
        }),
      ).rejects.toThrow();
    });
  });
});
