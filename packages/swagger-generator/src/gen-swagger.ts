import { btoa } from 'buffer';
import * as path from 'path';
import process from 'process';

import prettier from 'prettier';
import type { GenerateApiParams } from 'swagger-typescript-api';
import { generateApi } from 'swagger-typescript-api';

const loadPrettierConfig = async () => {
  const config = await prettier.resolveConfig(process.cwd());
  return config;
};
interface RunSwaggerOptions {
  id?: string;
  password?: string;
  output: string;
  url: string;
  applyZodSchemaInAPI: boolean;
  extractEnums: boolean;
}
export const runSwagger = async ({
  id,
  password,
  output,
  url,
  applyZodSchemaInAPI,
  extractEnums,
}: RunSwaggerOptions) => {
  const prettierConfig = await loadPrettierConfig();
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
    extractEnums: extractEnums,
    prettier: prettierConfig,
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
