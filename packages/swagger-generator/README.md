# @yoonhaemin-lib/swagger-generator

> Swagger/OpenAPI 스키마에서 TypeScript API 클라이언트와 Zod 스키마를 자동 생성

## Features

- ✅ **자동 코드 생성** - Swagger/OpenAPI 스키마에서 TypeScript 코드 자동 생성
- ✅ **Axios 기반** - 타입 안전한 Axios API 클라이언트 생성
- ✅ **Zod 스키마** - 런타임 검증을 위한 Zod 스키마 자동 생성
- ✅ **TanStack Query 친화적** - queryKey 자동 생성으로 React Query와 완벽한 통합
- ✅ **인증 지원** - ID/Password로 보호된 Swagger 문서 접근 가능

## Installation

```bash
npm install @yoonhaemin-lib/swagger-generator
```

```bash
yarn add @yoonhaemin-lib/swagger-generator
```

```bash
pnpm add @yoonhaemin-lib/swagger-generator
```

### Peer Dependencies

`@yoonhaemin-lib/swagger-generator`는 API 클라이언트 코드를 생성하는 CLI 도구입니다. 생성된 코드가 다음 패키지들을 사용하므로, **코드를 사용할 프로젝트에** 이 패키지들이 설치되어 있어야 합니다:

```bash
npm install axios zod
```

## Quick Start

### 1. API 클라이언트 생성

```bash
npx swagger-generator --url https://api.example.com/swagger.json --output ./src/api
```

### 2. 생성된 파일 구조

```
📦 src/api
 ┣ 📜 User.ts          # User 도메인 API 클래스
 ┣ 📜 Post.ts          # Post 도메인 API 클래스
 ┣ 📜 data-contracts.ts # TypeScript 타입 정의
 ┣ 📜 http-client.ts    # Axios HttpClient 래퍼
 ┗ 📜 schema.ts         # Zod 스키마
```

### 3. API 클라이언트 설정

```typescript
// src/api/index.ts
import { User } from './User';
import { Post } from './Post';
import { HttpClient } from './http-client';

const httpClient = new HttpClient({
  baseURL: process.env.REACT_APP_API_URL,
});

// Axios 인터셉터 추가 가능
httpClient.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  user: new User(httpClient),
  post: new Post(httpClient),
};
```

### 4. API 사용

```typescript
// 기본 사용
const users = await api.user.getUsers();
const user = await api.user.getUserById({ id: 1 });
const newUser = await api.user.createUser({ data: { name: 'John' } });
```

## Usage

### TanStack Query와 함께 사용

생성된 API 클래스는 각 메서드에 대한 `queryKey` 생성 함수를 제공합니다.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

// Query
function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: api.user.getUsersKey(),
    queryFn: () => api.user.getUsers(),
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.map((user) => <div key={user.id}>{user.name}</div>)}</div>;
}

// Mutation
function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => api.user.createUser({ data }),
    onSuccess: () => {
      // 사용자 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: api.user.getUsersKey() });
    },
  });

  const handleSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// 파라미터가 있는 Query
function UserDetail({ userId }: { userId: number }) {
  const { data } = useQuery({
    queryKey: api.user.getUserByIdKey({ id: userId }),
    queryFn: () => api.user.getUserById({ id: userId }),
  });

  return <div>{data?.name}</div>;
}
```

### Zod 스키마 검증

생성된 Zod 스키마를 사용하여 런타임 검증을 수행할 수 있습니다.

```typescript
import { UserSchema } from './api/schema';

// API 응답 검증
const response = await fetch('/api/user/1');
const data = await response.json();

const validatedUser = UserSchema.parse(data); // 검증 실패 시 에러 발생
```

### 인증이 필요한 Swagger 문서

```bash
npx swagger-generator \
  --url https://api.example.com/swagger.json \
  --output ./src/api \
  --id username \
  --password password123
```

### Zod 스키마 생성 건너뛰기

```bash
npx swagger-generator \
  --url https://api.example.com/swagger.json \
  --output ./src/api \
  --skipZodGeneration
```

### API에 Zod 스키마 검증 적용

생성된 API 메서드에 자동으로 Zod 검증을 적용합니다.

```bash
npx swagger-generator \
  --url https://api.example.com/swagger.json \
  --output ./src/api \
  --applyAPIZodSchema
```

## CLI Options

| 옵션                  | 타입      | 필수 | 설명                                           |
| --------------------- | --------- | ---- | ---------------------------------------------- |
| `--url`               | `string`  | ✅   | Swagger/OpenAPI 스키마 URL 또는 로컬 파일 경로 |
| `--output`            | `string`  | ✅   | 생성된 TypeScript 파일을 저장할 경로           |
| `--id`                | `string`  | ❌   | Swagger 문서 접근을 위한 사용자 ID             |
| `--password`          | `string`  | ❌   | Swagger 문서 접근을 위한 비밀번호              |
| `--skipZodGeneration` | `boolean` | ❌   | Zod 스키마 생성 건너뛰기                       |
| `--applyAPIZodSchema` | `boolean` | ❌   | 생성된 API 메서드에 Zod 스키마 검증 적용       |
| `--skipValidation`    | `boolean` | ❌   | ts-to-zod 라이브러리의 타입 검증 건너뛰기      |

## Examples

### 기본 예제

```bash
npx swagger-generator \
  --url https://petstore.swagger.io/v2/swagger.json \
  --output ./src/api
```

### 환경변수 사용

```bash
# .env
SWAGGER_URL=https://api.example.com/swagger.json
SWAGGER_ID=admin
SWAGGER_PASSWORD=secret123
```

```json
// package.json
{
  "scripts": {
    "generate:api": "swagger-generator --url $SWAGGER_URL --output ./src/api --id $SWAGGER_ID --password $SWAGGER_PASSWORD"
  }
}
```

### 로컬 파일 사용

```bash
npx swagger-generator \
  --url ./swagger.json \
  --output ./src/api
```

## Swagger 작성 권장사항

생성된 코드의 품질을 높이기 위해 다음 사항을 권장합니다:

### 1. Tag는 영어로 작성

Swagger의 `tags`는 생성되는 클래스명과 파일명에 사용됩니다.

```yaml
# ✅ 좋은 예
tags:
  - name: User
  - name: Post

# ❌ 나쁜 예
tags:
  - name: 사용자
  - name: 게시물
```

### 2. Enum에는 Description 필수

Enum 값의 의미를 명확히 하기 위해 description을 작성하세요.

```yaml
# ✅ 좋은 예
UserStatus:
  type: string
  enum: [active, inactive, pending]
  description: |
    - active: 활성 사용자
    - inactive: 비활성 사용자
    - pending: 대기 중인 사용자

# ❌ 나쁜 예
UserStatus:
  type: string
  enum: [active, inactive, pending]
```

### 3. Enum은 문자열이 아닌 Enum 타입으로

```yaml
# ✅ 좋은 예
status:
  $ref: '#/components/schemas/UserStatus'

# ❌ 나쁜 예
status:
  type: string
```

### 4. Required 필드 명시

모든 필수 필드는 `required` 배열에 명시하세요.

```yaml
# ✅ 좋은 예
User:
  type: object
  required:
    - id
    - name
    - email
  properties:
    id:
      type: number
    name:
      type: string
    email:
      type: string
    phone:
      type: string # optional
```

## FAQ

### 생성된 파일에 타입 에러가 있어요

Swagger 스키마를 검토하고, 모든 필드에 올바른 타입이 지정되어 있는지 확인하세요.

### Zod 스키마 생성 시 에러가 발생해요

`--skipValidation` 옵션을 사용하여 ts-to-zod 검증을 건너뛸 수 있습니다.

### 인증된 Swagger 문서에 접근할 수 없어요

`--id`와 `--password` 옵션을 사용하여 인증 정보를 제공하세요.

## License

MIT © [Yoon Hae Min](https://github.com/Yoon-Hae-Min)
