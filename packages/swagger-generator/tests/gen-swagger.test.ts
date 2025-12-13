import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // [1] url 모듈 가져오기

// [2] Jest 환경에서도 무조건 동작하는 '찐' 표준 방식
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { runSwagger } from '../src/gen-swagger';

describe('runSwagger - applyZodSchemaInAPI', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  const outputDir = path.resolve(__dirname, 'output');

  beforeEach(() => {
    // output 디렉토리 초기화
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });
  });

  afterAll(() => {
    // 테스트 후 정리
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
  });

  describe('applyZodSchemaInAPI: true', () => {
    const yamlPath = path.join(fixturesDir, 'petstore.yaml');

    beforeEach(async () => {
      await runSwagger({
        input: yamlPath,
        output: outputDir,
        applyZodSchemaInAPI: true,
      });
    });

    it('필수 파일들이 생성되어야 한다', () => {
      const generatedFiles = fs.readdirSync(outputDir);

      expect(generatedFiles).toContain('Pets.ts');
      expect(generatedFiles).toContain('data-contracts.ts');
      expect(generatedFiles).toContain('http-client.ts');
    });

    it('helpers.getSchemaNames를 사용하여 schema import 구문을 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toContain('import {');
      expect(petsContent).toContain("from './schema'");
    });

    it('preprocessed.payloadSchemaName을 사용하여 요청 데이터 검증 코드를 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      // CreatePetPayload -> createPetPayloadSchema
      expect(petsContent).toContain('createPetPayloadSchema');
      expect(petsContent).toContain('createPetPayloadSchema.parse(data)');
    });

    it('preprocessed.responseSchemaName을 사용하여 응답 데이터 검증 코드를 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      // Pet -> petSchema
      expect(petsContent).toContain('petSchema');
      expect(petsContent).toContain('petSchema.parse(response.data)');
    });

    it('preprocessed.isGetMethod를 사용하여 GET 메서드에 대한 queryKey 함수를 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toContain('listPetsKey =');
      expect(petsContent).toContain('getPetByIdKey =');
    });

    it('preprocessed.queryKey를 사용하여 올바른 queryKey 배열을 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      // GET /pets => ['pets', query]
      expect(petsContent).toContain("['pets'");

      // GET /pets/{petId} => ['pets', petId]
      expect(petsContent).toContain("['pets', petId]");
    });

    it('생성된 Pets.ts 파일은 스냅샷과 일치해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toMatchSnapshot();
    });

    it('생성된 data-contracts.ts 파일은 스냅샷과 일치해야 한다', () => {
      const dataContractsContent = fs.readFileSync(path.join(outputDir, 'data-contracts.ts'), 'utf-8');

      expect(dataContractsContent).toMatchSnapshot();
    });

    it('생성된 http-client.ts 파일은 스냅샷과 일치해야 한다', () => {
      const httpClientContent = fs.readFileSync(path.join(outputDir, 'http-client.ts'), 'utf-8');

      expect(httpClientContent).toMatchSnapshot();
    });
  });
});
