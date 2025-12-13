/**
 * swagger-typescript-api의 타입 확장
 */

import type { ParsedRouteRequest, ParsedRouteResponse } from 'swagger-typescript-api';

declare module 'swagger-typescript-api' {
  interface ParsedRoute {
    request: ParsedRouteRequest;
    response: ParsedRouteResponse;
    preprocessed?: {
      isGetMethod: method;
      queryKey: string[];
      payloadSchemaName: string | null;
      responseSchemaName: string | null;
      isPrimitiveResponseType: boolean;
    };
  }
}
