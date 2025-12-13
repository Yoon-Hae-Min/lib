/**
 * EJS 템플릿에서 사용할 헬퍼 함수들
 */

const TemplateLiteralRegex = /\$\{([^}]+)\}/g;

/**
 * 템플릿 리터럴을 제거합니다.
 * @example "${userId}" => "userId"
 */
const removeTemplateLiteral = (str: string) => str.replace(TemplateLiteralRegex, '$1');

/**
 * 특수문자 뒤의 문자를 대문자로 변환 (첫 글자는 변경하지 않음)
 * @example "user-name" => "userName"
 * @example "api_key" => "apiKey"
 * @example "foo" => "foo"
 */
const capitalizeAfterDelimiter = (str: string) => str.replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase());

/**
 * 첫 글자를 소문자로 변환
 */
const lowercaseFirst = (str: string) => str.replace(/^[A-Z]/, firstLetter => firstLetter.toLowerCase());

/**
 * 첫 글자를 대문자로 변환
 */
const uppercaseFirst = (str: string) => str.replace(/^[a-z]/, firstLetter => firstLetter.toUpperCase());

/**
 * QueryKey를 생성합니다.
 * @example "/api/posts/{postId}" => ['api', 'posts', postId]
 */
export const buildQueryKey = (path: string) => {
  const pathArr = path.split('/');
  return pathArr
    .filter(v => v)
    .map(v => {
      if (v.match(TemplateLiteralRegex)) {
        return removeTemplateLiteral(v);
      } else {
        return `'${v}'`;
      }
    });
};

/**
 * Schema 이름을 camelCase로 생성
 * @example "UserDto" => "userDtoSchema"
 */
export const getSchemaName = (typeName: string) => {
  return toCamelCase(typeName) + 'Schema';
};

/**
 * 템플릿 리터럴을 제거하고 camelCase로 변환
 * @example "user-name" => "userName"
 * @example "${userId}-detail" => "userIdDetail"
 */
export const toCamelCase = (str: string) => {
  return lowercaseFirst(capitalizeAfterDelimiter(removeTemplateLiteral(str)));
};

/**
 * 템플릿 리터럴을 제거하고 PascalCase로 변환
 * @example "user-name" => "UserName"
 * @example "${userId}-detail" => "UserIdDetail"
 */
export const toPascalCase = (str: string) => {
  return uppercaseFirst(toCamelCase(str));
};

/**
 * GET 메서드인지 확인
 */
export const isGetMethod = (method: string) => method === 'get';

/**
 * 기본 타입(primitive type)인지 확인
 */
export const isPrimitiveType = (type: string) => {
  const primitiveTypes = ['boolean', 'number', 'string', 'symbol', 'void', 'undefined', 'null'];
  return primitiveTypes.includes(type);
};

/**
 * Schema 이름 배열 생성
 */
export const getSchemaNames = (dataContracts: string[]) => {
  return dataContracts.map(v => getSchemaName(v));
};
