# @yoonhaemin-lib/use-param-state

> react-router-dom을 사용하여 URL 쿼리 파라미터를 React state처럼 관리하는 Hook

## Features

- ✅ **useState와 동일한 API** - 기존 코드를 쉽게 마이그레이션
- ✅ **URL 동기화** - 상태가 URL에 자동으로 반영되어 공유 및 북마크 가능
- ✅ **중첩 객체 지원** - 복잡한 데이터 구조도 쿼리 파라미터로 관리

## Installation

```bash
npm install @yoonhaemin-lib/use-param-state react-router-dom
```

```bash
yarn add @yoonhaemin-lib/use-param-state react-router-dom
```

```bash
pnpm add @yoonhaemin-lib/use-param-state react-router-dom
```

> **Note**: 이 패키지는 `react-router-dom` v6 이상을 필요로 합니다.

## Quick Start

```tsx
import { useParamState } from '@yoonhaemin-lib/use-param-state';

function SearchPage() {
  const [params, setParams] = useParamState({ query: '', page: '1' });

  return (
    <div>
      <input value={params.query} onChange={(e) => setParams({ ...params, query: e.target.value })} />
      <p>현재 페이지: {params.page}</p>
    </div>
  );
}
```

## Usage

### 기본 사용법

```tsx
import { useParamState } from '@yoonhaemin-lib/use-param-state';

function ProductList() {
  const [params, setParams] = useParamState({
    category: 'all',
    sort: 'recent',
    page: '1',
  });

  return (
    <div>
      <select value={params.category} onChange={(e) => setParams({ ...params, category: e.target.value })}>
        <option value="all">전체</option>
        <option value="electronics">전자기기</option>
        <option value="fashion">패션</option>
      </select>

      <button onClick={() => setParams({ ...params, page: String(Number(params.page) + 1) })}>다음 페이지</button>
    </div>
  );
}
```

### 함수형 업데이트

`useState`처럼 함수형 업데이트를 지원합니다.

```tsx
import { useParamState } from '@yoonhaemin-lib/use-param-state';

function Counter() {
  const [params, setParams] = useParamState({ count: '0' });

  const increment = () => {
    setParams((prev) => ({
      ...prev,
      count: String(Number(prev.count) + 1),
    }));
  };

  return (
    <div>
      <p>Count: {params.count}</p>
      <button onClick={increment}>증가</button>
    </div>
  );
}
```

### NavigateOptions 사용

React Router의 `NavigateOptions`를 전달하여 네비게이션 동작을 제어할 수 있습니다.

```tsx
import { useParamState } from '@yoonhaemin-lib/use-param-state';

function SearchWithHistory() {
  // replace: true로 설정하면 브라우저 히스토리에 추가하지 않고 현재 항목을 대체합니다
  const [params, setParams] = useParamState(
    { query: '' },
    { replace: true }, // NavigateOptions
  );

  return (
    <input
      value={params.query}
      onChange={(e) => setParams({ ...params, query: e.target.value })}
      placeholder="검색..."
    />
  );
}
```

### 중첩 객체 처리

중첩된 객체도 자동으로 flatten/unflatten되어 URL에 저장됩니다.

```tsx
import { useParamState } from '@yoonhaemin-lib/use-param-state';

function AdvancedFilter() {
  const [params, setParams] = useParamState({
    filter: {
      price: { min: '0', max: '100000' },
      rating: '0',
    },
    sort: 'recent',
  });

  // URL: ?filter.price.min=0&filter.price.max=100000&filter.rating=0&sort=recent

  return (
    <div>
      <input
        type="number"
        value={params.filter.price.min}
        onChange={(e) =>
          setParams({
            ...params,
            filter: {
              ...params.filter,
              price: { ...params.filter.price, min: e.target.value },
            },
          })
        }
      />
    </div>
  );
}
```

### 페이지네이션 예제

```tsx
import { useParamState } from '@yoonhaemin-lib/use-param-state';

function PaginatedList() {
  const [params, setParams] = useParamState({
    page: '1',
    size: '10',
  });

  const currentPage = Number(params.page);
  const pageSize = Number(params.size);

  const goToPage = (page: number) => {
    setParams({ ...params, page: String(page) });
  };

  return (
    <div>
      <div>현재 페이지: {currentPage}</div>
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        이전
      </button>
      <button onClick={() => goToPage(currentPage + 1)}>다음</button>
    </div>
  );
}
```

### 필터와 검색 조합

```tsx
import { useParamState } from '@yoonhaemin-lib/use-param-state';

function SearchWithFilters() {
  const [params, setParams] = useParamState({
    query: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
  });

  const resetFilters = () => {
    setParams({
      query: params.query, // 검색어는 유지
      category: 'all',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div>
      <input
        placeholder="검색..."
        value={params.query}
        onChange={(e) => setParams({ ...params, query: e.target.value })}
      />

      <select value={params.category} onChange={(e) => setParams({ ...params, category: e.target.value })}>
        <option value="all">전체</option>
        <option value="books">책</option>
        <option value="electronics">전자기기</option>
      </select>

      <button onClick={resetFilters}>필터 초기화</button>
    </div>
  );
}
```

## API Reference

### `useParamState<T>(initialValue?, options?)`

#### 매개변수

| 매개변수       | 타입              | 기본값 | 설명                                                   |
| -------------- | ----------------- | ------ | ------------------------------------------------------ |
| `initialValue` | `T`               | -      | 초기 쿼리 파라미터 값 (객체 형태)                      |
| `options`      | `NavigateOptions` | -      | React Router의 NavigateOptions (`replace`, `state` 등) |

#### 반환값

`[searchParams, setSearchParams]` 튜플을 반환합니다.

| 반환값            | 타입                  | 설명                                                             |
| ----------------- | --------------------- | ---------------------------------------------------------------- |
| `searchParams`    | `T`                   | 현재 URL 쿼리 파라미터를 파싱한 객체                             |
| `setSearchParams` | `ParamStateSetter<T>` | 쿼리 파라미터를 업데이트하는 함수 (객체 또는 함수를 인자로 받음) |

## 주의사항

- URL 쿼리 파라미터는 문자열로 저장되므로, 숫자나 불린 값을 사용할 때는 타입 변환이 필요합니다.
- `null` 또는 `undefined` 값은 URL에서 제거됩니다.
- 중첩 객체는 dot notation으로 flatten됩니다 (예: `filter.price.min=0`).

## License

MIT © [Yoon Hae Min](https://github.com/Yoon-Hae-Min)
