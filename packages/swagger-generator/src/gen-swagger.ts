import { btoa } from 'buffer';
import * as path from 'path';
import process from 'process';

import type { GenerateApiParams } from 'swagger-typescript-api';
import { generateApi } from 'swagger-typescript-api';

interface RunSwaggerOptions {
  id?: string;
  password?: string;
  httpClientType?: 'axios' | 'fetch';
  output: string;
  input?: string;
  url: string;
  applyZodSchemaInAPI: boolean;
  extractEnums: boolean;
}
export const runSwagger = async ({
  id,
  password,
  httpClientType = 'fetch',
  output,
  input,
  url,
  applyZodSchemaInAPI,
  extractEnums,
}: RunSwaggerOptions) => {
  await generateApi({
    url: url,
    templates: path.resolve(__dirname, '../templates'),
    output: path.resolve(process.cwd(), output),
    input: input && path.resolve(process.cwd(), input),
    ...(id && password ? { authorizationToken: `Basic ${btoa(`${id}:${password}`)}` } : {}),
    httpClientType: httpClientType,
    generateClient: true,
    generateResponses: true,
    defaultResponseAsSuccess: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: extractEnums,
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
