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
  };
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

  // 각 route에 전처리된 데이터 추가
  routeData.preprocessed = {
    isGetMethod: isGetMethod(method),
    queryKey: buildQueryKey(path),
    payloadSchemaName: payload ? getSchemaName(payload.type) : null,
    responseSchemaName: type ? getSchemaName(type) : null,
    isPrimitiveResponseType: isPrimitiveType(type),
  };

  return routeData;
};
