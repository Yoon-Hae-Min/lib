import { btoa } from 'buffer';
import * as fs from 'fs';
import * as path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

import * as prettier from 'prettier';
import type { GenerateApiParams } from 'swagger-typescript-api';
import { generateApi } from 'swagger-typescript-api';

import { prepareConfig } from './hooks/config-preparer';

interface RunSwaggerOptions {
  id?: string;
  password?: string;
  output: string;
  url?: string;
  input?: string;
  applyZodSchemaInAPI?: boolean;
}

const prettierConfig = {
  arrowParens: 'avoid',
  bracketSpacing: false,
  endOfLine: 'auto',
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: true,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  parser: 'typescript',
} as const;

export const runSwagger = async ({
  id,
  input,
  password,
  output,
  url,
  applyZodSchemaInAPI = true,
}: RunSwaggerOptions) => {
  const outputPath = path.resolve(process.cwd(), output);

  // Generate API files
  await generateApi({
    ...(url ? { url } : {}),
    ...(input ? { input } : {}),
    templates: fileURLToPath(new URL('../templates', import.meta.url)),
    output: outputPath,
    ...(id && password ? { authorizationToken: `Basic ${btoa(`${id}:${password}`)}` } : {}),
    httpClientType: 'axios',
    generateClient: true,
    generateResponses: true,
    defaultResponseAsSuccess: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractResponseBody: true,
    extractEnums: false,
    modular: true,
    moduleNameFirstTag: true,
    moduleNameIndex: 1,
    defaultResponseType: 'void',
    singleHttpClient: true,
    extractingOptions: {
      requestBodySuffix: ['Payload', 'Body', 'Input'],
      requestParamsSuffix: ['Params'],
      responseBodySuffix: ['Data', 'Result', 'Output'],
      responseErrorSuffix: ['Error', 'Fail', 'Fails', 'ErrorData', 'HttpError', 'BadResponse'],
    },
    applyZodSchemaInAPI: applyZodSchemaInAPI,
    hooks: {
      onPrepareConfig: prepareConfig,
    },
  } as GenerateApiParams);

  // Format generated files with Prettier
  const files = fs.readdirSync(outputPath);
  for (const file of files) {
    if (file.endsWith('.ts')) {
      const filePath = path.join(outputPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const formatted = await prettier.format(content, prettierConfig);
      fs.writeFileSync(filePath, formatted, 'utf-8');
    }
  }
};
