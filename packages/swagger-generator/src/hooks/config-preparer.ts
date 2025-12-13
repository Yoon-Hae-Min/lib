/**
 * onPrepareConfig 훅에서 사용할 설정 전처리 로직
 */

import * as procedureHelpersModule from '../helpers/procedure-helpers';
import * as templateHelpers from '../helpers/template-helpers';

/**
 * API 템플릿에서 사용할 헬퍼 함수들
 */
const apiHelpers = {
  getSchemaNames: templateHelpers.getSchemaNames,
};

/**
 * Procedure 템플릿에서 사용할 헬퍼 함수들
 */
const procedureHelpers = {
  buildWrapperArgs: procedureHelpersModule.buildWrapperArgs,
  buildQueryKeyProps: procedureHelpersModule.buildQueryKeyProps,
  buildContentTypeVariables: procedureHelpersModule.buildContentTypeVariables,
  buildReturnType: procedureHelpersModule.buildReturnType,
  buildRequestConfigParam: procedureHelpersModule.buildRequestConfigParam,
};

/**
 * 공통 헬퍼 함수들 (필요시 사용)
 */
const commonHelpers = {
  toCamelCase: templateHelpers.toCamelCase,
  toPascalCase: templateHelpers.toPascalCase,
  buildQueryKey: templateHelpers.buildQueryKey,
  isGetMethod: templateHelpers.isGetMethod,
  isPrimitiveType: templateHelpers.isPrimitiveType,
  getSchemaName: templateHelpers.getSchemaName,
};

/**
 * Configuration에 헬퍼 함수들을 추가
 */
export const prepareConfig = (currentConfiguration: any): any => {
  return {
    ...currentConfiguration,
    apiHelpers,
    procedureHelpers,
    commonHelpers,
  };
};
