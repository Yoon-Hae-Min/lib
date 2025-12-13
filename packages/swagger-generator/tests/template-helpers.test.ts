import {
  buildQueryKey,
  getSchemaName,
  toCamelCase,
  toPascalCase,
  isGetMethod,
  isPrimitiveType,
  getSchemaNames,
} from '../src/helpers/template-helpers';

describe('template-helpers', () => {
  describe('buildQueryKey', () => {
    it('경로를 queryKey 배열로 변환해야 한다', () => {
      expect(buildQueryKey('/api/posts')).toEqual(["'api'", "'posts'"]);
    });

    it('경로 파라미터는 그대로 문자열로 처리해야 한다 (OpenAPI {param} 형식)', () => {
      expect(buildQueryKey('/api/posts/{postId}')).toEqual(["'api'", "'posts'", "'{postId}'"]);
    });

    it('템플릿 리터럴 형식의 파라미터를 변수로 변환해야 한다', () => {
      expect(buildQueryKey('/api/posts/${postId}')).toEqual(["'api'", "'posts'", 'postId']);
    });

    it('여러 템플릿 리터럴 파라미터를 처리해야 한다', () => {
      expect(buildQueryKey('/api/users/${userId}/posts/${postId}')).toEqual([
        "'api'",
        "'users'",
        'userId',
        "'posts'",
        'postId',
      ]);
    });

    it('빈 경로 세그먼트를 제거해야 한다', () => {
      expect(buildQueryKey('/api//posts/')).toEqual(["'api'", "'posts'"]);
    });
  });

  describe('toCamelCase', () => {
    it('하이픈으로 구분된 문자열을 camelCase로 변환해야 한다', () => {
      expect(toCamelCase('user-name')).toBe('userName');
    });

    it('언더스코어로 구분된 문자열을 camelCase로 변환해야 한다', () => {
      expect(toCamelCase('api_key')).toBe('apiKey');
    });

    it('템플릿 리터럴을 제거하고 camelCase로 변환해야 한다', () => {
      expect(toCamelCase('${userId}-detail')).toBe('userIdDetail');
    });

    it('이미 camelCase인 문자열을 그대로 반환해야 한다', () => {
      expect(toCamelCase('userName')).toBe('userName');
    });

    it('PascalCase를 camelCase로 변환해야 한다', () => {
      expect(toCamelCase('UserName')).toBe('userName');
    });

    it('특수문자가 없는 문자열을 소문자로 시작하게 해야 한다', () => {
      expect(toCamelCase('Foo')).toBe('foo');
    });
  });

  describe('toPascalCase', () => {
    it('하이픈으로 구분된 문자열을 PascalCase로 변환해야 한다', () => {
      expect(toPascalCase('user-name')).toBe('UserName');
    });

    it('언더스코어로 구분된 문자열을 PascalCase로 변환해야 한다', () => {
      expect(toPascalCase('api_key')).toBe('ApiKey');
    });

    it('템플릿 리터럴을 제거하고 PascalCase로 변환해야 한다', () => {
      expect(toPascalCase('${userId}-detail')).toBe('UserIdDetail');
    });

    it('이미 PascalCase인 문자열을 그대로 반환해야 한다', () => {
      expect(toPascalCase('UserName')).toBe('UserName');
    });

    it('camelCase를 PascalCase로 변환해야 한다', () => {
      expect(toPascalCase('userName')).toBe('UserName');
    });

    it('특수문자가 없는 문자열을 대문자로 시작하게 해야 한다', () => {
      expect(toPascalCase('foo')).toBe('Foo');
    });
  });

  describe('getSchemaName', () => {
    it('타입 이름을 camelCase schema 이름으로 변환해야 한다', () => {
      expect(getSchemaName('UserDto')).toBe('userDtoSchema');
    });

    it('하이픈으로 구분된 타입 이름을 처리해야 한다', () => {
      expect(getSchemaName('user-response')).toBe('userResponseSchema');
    });

    it('템플릿 리터럴을 제거해야 한다', () => {
      expect(getSchemaName('${User}Dto')).toBe('userDtoSchema');
    });

    it('단순한 타입 이름을 처리해야 한다', () => {
      expect(getSchemaName('User')).toBe('userSchema');
    });
  });

  describe('getSchemaNames', () => {
    it('타입 이름 배열을 schema 이름 배열로 변환해야 한다', () => {
      expect(getSchemaNames(['UserDto', 'PostDto', 'CommentDto'])).toEqual([
        'userDtoSchema',
        'postDtoSchema',
        'commentDtoSchema',
      ]);
    });

    it('빈 배열을 처리해야 한다', () => {
      expect(getSchemaNames([])).toEqual([]);
    });

    it('단일 타입을 처리해야 한다', () => {
      expect(getSchemaNames(['User'])).toEqual(['userSchema']);
    });
  });

  describe('isGetMethod', () => {
    it('get 메서드를 true로 반환해야 한다', () => {
      expect(isGetMethod('get')).toBe(true);
    });

    it('GET 대문자를 false로 반환해야 한다', () => {
      expect(isGetMethod('GET')).toBe(false);
    });

    it('다른 메서드를 false로 반환해야 한다', () => {
      expect(isGetMethod('post')).toBe(false);
      expect(isGetMethod('put')).toBe(false);
      expect(isGetMethod('delete')).toBe(false);
      expect(isGetMethod('patch')).toBe(false);
    });
  });

  describe('isPrimitiveType', () => {
    it('기본 타입들을 true로 반환해야 한다', () => {
      expect(isPrimitiveType('boolean')).toBe(true);
      expect(isPrimitiveType('number')).toBe(true);
      expect(isPrimitiveType('string')).toBe(true);
      expect(isPrimitiveType('symbol')).toBe(true);
      expect(isPrimitiveType('void')).toBe(true);
      expect(isPrimitiveType('undefined')).toBe(true);
      expect(isPrimitiveType('null')).toBe(true);
    });

    it('객체 타입을 false로 반환해야 한다', () => {
      expect(isPrimitiveType('User')).toBe(false);
      expect(isPrimitiveType('UserDto')).toBe(false);
      expect(isPrimitiveType('object')).toBe(false);
      expect(isPrimitiveType('Array')).toBe(false);
    });

    it('빈 문자열을 false로 반환해야 한다', () => {
      expect(isPrimitiveType('')).toBe(false);
    });
  });
});
