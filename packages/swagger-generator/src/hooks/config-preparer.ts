/**
 * onPrepareConfig 훅에서 사용할 설정 전처리 로직
 */

import * as procedureUtils from '../utils/procedure';
import * as templateUtils from '../utils/template';

/**
 * API 템플릿에서 사용할 헬퍼 함수들
 */
const apiHelpers = {
  getSchemaNames: templateUtils.getSchemaNames,
};

/**
 * Procedure 템플릿에서 사용할 헬퍼 함수들
 */
const procedureHelpers = {
  buildWrapperArgs: procedureUtils.buildWrapperArgs,
  buildQueryKeyProps: procedureUtils.buildQueryKeyProps,
  buildContentTypeVariables: procedureUtils.buildContentTypeVariables,
  buildReturnType: procedureUtils.buildReturnType,
  buildRequestConfigParam: procedureUtils.buildRequestConfigParam,
};

/**
 * 공통 헬퍼 함수들 (필요시 사용)
 */
const commonHelpers = {
  toCamelCase: templateUtils.toCamelCase,
  toPascalCase: templateUtils.toPascalCase,
  buildQueryKey: templateUtils.buildQueryKey,
  isGetMethod: templateUtils.isGetMethod,
  isPrimitiveType: templateUtils.isPrimitiveType,
  getSchemaName: templateUtils.getSchemaName,
};

/**
 * Configuration에 헬퍼 함수들을 추가
 */
export const prepareConfig = (currentConfiguration: any): any => {
  // applyZodSchemaInAPI 옵션을 config에 추가하여 템플릿에서 사용 가능하도록 함
  const applyZodSchemaInAPI = currentConfiguration.applyZodSchemaInAPI ?? true;

  return {
    ...currentConfiguration,
    applyZodSchemaInAPI,
    apiHelpers,
    procedureHelpers,
    commonHelpers,
  };
};
