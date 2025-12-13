import { btoa } from 'buffer';
import * as path from 'path';
import process from 'process';

import type { GenerateApiParams } from 'swagger-typescript-api';
import { generateApi } from 'swagger-typescript-api';

import { prepareConfig } from './hooks/config-preparer';
import { preprocessRoute } from './hooks/route-preprocessor';

interface RunSwaggerOptions {
  id?: string;
  password?: string;
  output: string;
  url?: string;
  input?: string;
  applyZodSchemaInAPI: boolean;
}

export const runSwagger = async ({ id, input, password, output, url, applyZodSchemaInAPI }: RunSwaggerOptions) => {
  await generateApi({
    ...(url ? { url } : {}),
    ...(input ? { input } : {}),
    templates: path.resolve(__dirname, '../templates'),
    output: path.resolve(process.cwd(), output),
    ...(id && password ? { authorizationToken: `Basic ${btoa(`${id}:${password}`)}` } : {}),
    httpClientType: 'axios',
    generateClient: true,
    generateResponses: true,
    defaultResponseAsSuccess: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: false,
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
    hooks: {
      onCreateRoute: preprocessRoute,
      onPrepareConfig: prepareConfig,
    },
  } as GenerateApiParams);
};
