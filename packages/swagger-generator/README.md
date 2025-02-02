# Swagger-generator

swagger를 기반으로 axios api class와 queryKey, zod schema를 자동으로 생성해 줍니다.

### 설치 방법

```bash
npm install @yoonhaemin-lib/swagger-generator ts-to-zod zod axios
```

### 사용 방법

```bash
swagger-generator --url https://api.example.com/swagger.json --output ./src/api
```

#### 생성 결과

```bash

📦api
 ┣ 📜Domain1.ts // swagger의 tag를 따라서 폴더 이름이 결정이 됨
 ┣ 📜Domain2.ts
 ┣ 📜Domain3.ts
 ┣ 📜Domain4.ts
 ┣ 📜data-contracts.ts // API의 타입이 정의되어 있음
 ┣ 📜http-client.ts
 ┣ 📜schema.ts // API타입을 바탕으로 zod 스키마 생성
 ┗ 📜Domain4.ts.ts

```

#### 엔트리 포인트 작성

```typescript
// api/index.ts 생성 권장
// 아래와 같이 index 파일에서 export 후 사용하시는걸 권장합니다.

import { Domain1 } from './Domain1';
import { Domain2 } from './Domain2';
import { HttpClient } from './http-client';

const instance = new HttpClient({
  baseURL: process.env.NODE_ENV === 'development' ? 'https://admin address' : 'https://prod address',
});
// instance is axios instance so you can use axios instance method (ex. interceptors)

const api = {
  A: new Domain1(instance),
  B: new Domain2(instance),
};

export default api;
```

```typescript
// with tanstack query
const useDomain1Query = (options: GetAParams) => {
  return useQuery({
    queryKey: api.A.getAListKey(options),
    queryFn: () => api.A.getAList(options),
  });
};

const useDomain1Mutation = () => {
  return useMutation({
    mutationFn: (data) => api.A.updateA(data),
  });
};
```

### options

```bash
    --url                   (required) path/url to swagger scheme
    --output                (required) output path of typescript api file
    --id                    (optional) use swagger scheme id
    --password              (optional) use swagger scheme password
    --skipZodGeneration     (optional) skip zod schema generation
    --applyAPIZodSchema     (optional) apply zod schema to api class
```

### 기타 swagger 사용 주의사항

- swagger의 tag는 영어로 작성되어야 코드 생성시 폴더명이 영어로 정의됩니다.
- 자동 생성이 된다 하더라도 enum의 값은 어떤 값인지 모르니 enum은 꼭 description을 작성한 상태여야 합니다.
- enum은 string이 아닌 enum으로 타입을 지정해 주시기 바랍니다.
- 기본적으로 API 필드에 required이 지정이 되어 있지 않으면 optional로 처리되니 API response 및 request의 required 여부를 확인해 주세요.
