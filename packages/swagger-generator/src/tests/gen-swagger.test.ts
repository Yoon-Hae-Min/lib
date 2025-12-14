import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { runSwagger } from '../gen-swagger';

/**
 * runSwagger 함수 테스트
 *
 * 이 테스트는 runSwagger 함수의 applyZodSchemaInAPI 파라미터 동작을 검증합니다.
 */
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

    it('schema import 구문을 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toContain('import {');
      expect(petsContent).toContain("from './schema'");
    });

    it('요청 데이터 검증 코드를 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      // CreatePetPayload -> createPetPayloadSchema
      expect(petsContent).toContain('createPetPayloadSchema');
      expect(petsContent).toContain('createPetPayloadSchema.parse(data)');
    });

    it('응답 데이터 검증 코드를 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      // Response type aliases: ListPetsData -> listPetsDataSchema
      expect(petsContent).toContain('listPetsDataSchema');
      expect(petsContent).toContain('listPetsDataSchema.parse(response.data)');
      expect(petsContent).toContain('createPetDataSchema.parse(response.data)');
    });

    it('GET 메서드에 대한 queryKey 함수를 생성해야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toContain('listPetsKey =');
      expect(petsContent).toContain('getPetByIdKey =');
    });

    it('queryKey 배열을 올바르게 생성해야 한다', () => {
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

  describe('applyZodSchemaInAPI: false', () => {
    const yamlPath = path.join(fixturesDir, 'petstore.yaml');

    beforeEach(async () => {
      await runSwagger({
        input: yamlPath,
        output: outputDir,
        applyZodSchemaInAPI: false,
      });
    });

    it('필수 파일들이 생성되어야 한다', () => {
      const generatedFiles = fs.readdirSync(outputDir);

      expect(generatedFiles).toContain('Pets.ts');
      expect(generatedFiles).toContain('data-contracts.ts');
      expect(generatedFiles).toContain('http-client.ts');
    });

    it('schema import 구문이 생성되지 않아야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).not.toContain("from './schema'");
    });

    it('요청 데이터 검증 코드가 생성되지 않아야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).not.toContain('createPetPayloadSchema.parse(data)');
      expect(petsContent).not.toContain('.parse(data)');
    });

    it('응답 데이터 검증 코드가 생성되지 않아야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).not.toContain('listPetsDataSchema.parse(response.data)');
      expect(petsContent).not.toContain('createPetDataSchema.parse(response.data)');
      expect(petsContent).not.toContain('.parse(response.data)');
    });

    it('GET 메서드에 대한 queryKey 함수는 여전히 생성되어야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toContain('listPetsKey =');
      expect(petsContent).toContain('getPetByIdKey =');
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

  describe('applyZodSchemaInAPI: undefined (기본값 true)', () => {
    const yamlPath = path.join(fixturesDir, 'petstore.yaml');

    beforeEach(async () => {
      await runSwagger({
        input: yamlPath,
        output: outputDir,
        // applyZodSchemaInAPI를 전달하지 않음 (기본값 true)
      });
    });

    it('기본값으로 schema import가 포함되어야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toContain("from './schema'");
    });

    it('기본값으로 validation 코드가 포함되어야 한다', () => {
      const petsContent = fs.readFileSync(path.join(outputDir, 'Pets.ts'), 'utf-8');

      expect(petsContent).toContain('.parse(data)');
      expect(petsContent).toContain('.parse(response.data)');
    });
  });
});
