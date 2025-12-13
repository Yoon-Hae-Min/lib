/**
 * Procedure 템플릿에서 사용할 헬퍼 함수들
 * 템플릿 내 복잡한 계산 로직을 외부로 분리
 */

import type { GenerateApiConfiguration, ParsedRoute, SchemaComponent } from 'swagger-typescript-api';

interface RequestConfigParam {
  name: string;
  optional: boolean;
  type: string;
  defaultValue: string;
}

interface ContentTypeVariables {
  bodyTmpl: string | null;
  queryTmpl: string | null;
  bodyContentKindTmpl: string | null;
  responseFormatTmpl: string | null;
  securityTmpl: string | null;
}

/**
 * 함수 파라미터를 TypeScript 형식의 문자열로 변환
 */
const argToTmpl = ({ name, optional, type, defaultValue }: any): string => {
  return `${name}${!defaultValue && optional ? '?' : ''}: ${type}${defaultValue ? ` = ${defaultValue}` : ''}`;
};

/**
 * 함수의 wrapper arguments를 생성
 */
export const buildWrapperArgs = (
  route: ParsedRoute,
  config: GenerateApiConfiguration['config'],
  utils: GenerateApiConfiguration['utils'],
  requestConfigParam: RequestConfigParam,
): string => {
  const { _, getInlineParseContent } = utils;
  const { parameters, query, payload, requestParams } = route.request;

  const pathParams = _.values(parameters);
  const pathParamsNames = _.map(pathParams, 'name');
  const queryName = ((query && query.name) || 'query') as string;

  const rawWrapperArgs = config.extractRequestParams
    ? _.compact([
        requestParams && {
          name: pathParams.length ? `{ ${_.join(pathParamsNames, ', ')}, ...${queryName} }` : queryName,
          optional: false,
          type: getInlineParseContent(requestParams as SchemaComponent['rawTypeData']),
        },
        ...(!requestParams ? pathParams : []),
        payload,
        requestConfigParam,
      ])
    : _.compact([...pathParams, query, payload, requestConfigParam]);

  return _.sortBy(rawWrapperArgs, [(o: any) => o.optional])
    .map(argToTmpl)
    .join(', ');
};

/**
 * Query key 함수의 파라미터를 생성
 */
export const buildQueryKeyProps = (route: ParsedRoute, utils: GenerateApiConfiguration['utils']): string => {
  const { _, getInlineParseContent } = utils;
  const { parameters, requestParams } = route.request;
  const { query } = route.request;

  const pathParams = _.values(parameters);
  const pathParamsNames = _.map(pathParams, 'name');
  const queryName = ((query && query.name) || 'query') as string;

  const queryKeyProps = _.sortBy(
    _.compact([
      requestParams && {
        name: pathParams.length ? `{ ${_.join(pathParamsNames, ', ')}, ...${queryName} }` : queryName,
        optional: false,
        type: getInlineParseContent(requestParams as SchemaComponent['rawTypeData']),
      },
      ...(!requestParams ? pathParams : []),
    ]),
    [(o: any) => o.optional],
  )
    .map(argToTmpl)
    .join(', ');

  return queryKeyProps;
};

/**
 * Content type 관련 변수들을 생성
 */
export const buildContentTypeVariables = (
  route: ParsedRoute,
  config: GenerateApiConfiguration['config'],
): ContentTypeVariables => {
  const { requestBodyInfo, responseBodyInfo } = route;
  const { payload, query, security } = route.request;
  const { HTTP_CLIENT } = config.constants;

  const isFetchTemplate = config.httpClientType === HTTP_CLIENT.FETCH;

  const requestContentKind: Record<string, string> = {
    JSON: 'ContentType.Json',
    URL_ENCODED: 'ContentType.UrlEncoded',
    FORM_DATA: 'ContentType.FormData',
    TEXT: 'ContentType.Text',
  };

  const responseContentKind: Record<string, string> = {
    JSON: '"json"',
    IMAGE: '"blob"',
    FORM_DATA: isFetchTemplate ? '"formData"' : '"document"',
  };

  const queryName = ((query && query.name) || 'query') as string;

  return {
    bodyTmpl: payload?.name || null,
    queryTmpl: query != null ? queryName : null,
    bodyContentKindTmpl: requestBodyInfo?.contentKind ? requestContentKind[requestBodyInfo.contentKind] || null : null,
    responseFormatTmpl:
      responseBodyInfo?.success && responseBodyInfo.success.schema && responseBodyInfo.success.schema.contentKind
        ? responseContentKind[responseBodyInfo.success.schema.contentKind] || null
        : null,
    securityTmpl: security ? 'true' : null,
  };
};

/**
 * 함수의 return type을 생성
 */
export const buildReturnType = (route: ParsedRoute, config: GenerateApiConfiguration['config']): string => {
  const { type, errorType } = route.response;
  const { HTTP_CLIENT } = config.constants;

  if (!config.toJS) return '';

  switch (config.httpClientType) {
    case HTTP_CLIENT.AXIOS:
      return `Promise<AxiosResponse<${type}>>`;
    default:
      return `Promise<HttpResponse<${type}, ${errorType}>>`;
  }
};

/**
 * Request config 파라미터를 생성
 */
export const buildRequestConfigParam = (
  route: ParsedRoute,
  config: GenerateApiConfiguration['config'],
): RequestConfigParam => {
  const { specificArgNameResolver } = route;
  const { RESERVED_REQ_PARAMS_ARG_NAMES } = config.constants;

  return {
    name: specificArgNameResolver?.resolve(RESERVED_REQ_PARAMS_ARG_NAMES),
    optional: true,
    type: 'RequestParams',
    defaultValue: '{}',
  };
};
