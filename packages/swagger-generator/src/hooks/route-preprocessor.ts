/**
 * onCreateRoute 훅에서 사용할 route 전처리 로직
 */

import type { ParsedRoute } from 'swagger-typescript-api';

import { buildQueryKey, getSchemaName, isGetMethod, isPrimitiveType } from '../helpers/template-helpers';

interface RouteRequest {
  method?: string;
  path?: string;
  payload?: {
    type: string;
    name?: string;
  };
  parameters?: any;
  query?: {
    name?: string;
  };
  security?: any;
}

interface RouteResponse {
  type?: string;
}

interface RouteData {
  request: RouteRequest;
  response: RouteResponse;
  preprocessed?: {
    isGetMethod: boolean;
    queryKey: string[];
    payloadSchemaName: string | null;
    responseSchemaName: string | null;
    isPrimitiveResponseType: boolean;
    procedure: {
      queryName: string;
      pathParams: Array<any>;
      payloadName: string | null;
      queryExists: boolean;
      securityExists: boolean;
    };
    api: Record<string, never>;
  };
}

/**
 * Route 데이터를 전처리하여 preprocessed 속성 추가
 */
export const preprocessRoute = (routeData: ParsedRoute): ParsedRoute => {
  const { request, response } = routeData as RouteData;
  const method = request?.method || '';
  const path = request?.path || '';
  const payload = request?.payload;
  const type = response?.type || '';
  const parameters = request?.parameters;
  const query = request?.query;

  // 각 route에 전처리된 데이터 추가
  routeData.preprocessed = {
    // Common fields (used across templates)
    isGetMethod: isGetMethod(method),
    queryKey: buildQueryKey(path),
    payloadSchemaName: payload ? getSchemaName(payload.type) : null,
    responseSchemaName: type ? getSchemaName(type) : null,
    isPrimitiveResponseType: isPrimitiveType(type),

    // procedure-call.ejs specific data
    procedure: {
      queryName: (query && query.name) || 'query',
      pathParams: parameters ? Object.values(parameters) : [],
      payloadName: payload?.name || null,
      queryExists: query != null,
      securityExists: !!request?.security,
    },

    // api.ejs specific data (reserved for future use)
    api: {},
  };

  return routeData;
};
