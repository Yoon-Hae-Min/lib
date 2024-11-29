import { btoa } from 'buffer';
import * as path from 'path';
import process from 'process';

import type { GenerateApiParams } from 'swagger-typescript-api';
import { generateApi } from 'swagger-typescript-api';

interface RunSwaggerOptions {
  id?: string;
  password?: string;
  output: string;
  url: string;
  applyZodSchemaInAPI: boolean;
}
export const runSwagger = async ({ id, password, output, url, applyZodSchemaInAPI }: RunSwaggerOptions) => {
  await generateApi({
    url: url,
    templates: path.resolve(__dirname, '../templates'),
    output: path.resolve(process.cwd(), output),
    ...(id && password ? { authorizationToken: `Basic ${btoa(`${id}:${password}`)}` } : {}),
    httpClientType: 'axios',
    generateClient: true,
    generateResponses: true,
    defaultResponseAsSuccess: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: true,
    prettier: {
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
    },
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
  } as GenerateApiParams);
};
