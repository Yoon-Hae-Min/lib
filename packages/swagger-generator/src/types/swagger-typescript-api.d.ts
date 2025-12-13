/**
 * swagger-typescript-api의 타입 확장
 */

import type { ParsedRouteRequest, ParsedRouteResponse } from 'swagger-typescript-api';

declare module 'swagger-typescript-api' {
  interface ParsedRoute {
    request: ParsedRouteRequest;
    response: ParsedRouteResponse;
    preprocessed?: {
      // Common fields (used across templates)
      isGetMethod: boolean;
      queryKey: string[];
      payloadSchemaName: string | null;
      responseSchemaName: string | null;
      isPrimitiveResponseType: boolean;

      // procedure-call.ejs specific data
      procedure: {
        queryName: string;
        pathParams: Array<any>;
        payloadName: string | null;
        queryExists: boolean;
        securityExists: boolean;
      };

      // api.ejs specific data (reserved for future)
      api: Record<string, never>;
    };
  }
}
