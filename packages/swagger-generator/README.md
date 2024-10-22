# Swagger-generator

swagger를 기반으로 axios api class와 queryKey, zod schema를 자동으로 생성해 줍니다.

### 설치 방법

```bash
    npm install @yoonhaemin/swagger-generator ts-to-zod zod axios
```

### 사용 방법

```bash
    swagger-generator --url https://api.example.com/swagger.json --output ./src/api
```

```typescript
// api/index.ts
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
```
