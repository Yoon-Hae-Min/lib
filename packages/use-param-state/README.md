# useParamState

state관리를 useState가 아닌 param으로 관리합니다. useState와 인터페이스가 같아 기존에 있는 state를 url로 의존성을 옮기기 쉽습니다.

### 예시 코드

```tsx
import React from 'react';
import useParamState from './useParamState';

const ExampleComponent: React.FC = () => {
  // 'page'와 'filter'라는 두 개의 쿼리 파라미터를 관리하는 상태로 설정
  const [searchParams, setSearchParams] = useParamState<{ page: string | undefined; filter: string | undefined }>({
    page: '1',
    filter: undefined,
  });

  const handleNextPage = () => {
    setSearchParams((prevState) => ({
      ...prevState,
      page: (Number(prevState.page) + 1).toString(),
    }));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prevState) => ({
      ...prevState,
      filter: event.target.value,
    }));
  };

  return (
    <div>
      <h2>현재 페이지: {searchParams.page}</h2>
      <h2>현재 필터: {searchParams.filter ?? '없음'}</h2>

      <button onClick={handleNextPage}>다음 페이지로 이동</button>

      <input type="text" placeholder="필터 입력" value={searchParams.filter ?? ''} onChange={handleFilterChange} />
    </div>
  );
};

export default ExampleComponent;
```

## API Reference

### `useParamState` 매개변수

| 매개변수         | 타입                | 설명                                                  | 필수 여부 |
| ---------------- | ------------------- | ----------------------------------------------------- | --------- |
| \`initialValue\` | \`T\`               | 초기값 입니다. 객체 형태로 입력합니다.                | ✔️        |
| \`options\`      | \`NavigateOptions\` | 상태 변경시 url 변경을 어떻게 할지에 대한 옵션입니다. | X         |

### `useParamState` 반환값

| 반환값              | 타입                    | 설명                                                                                              |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| \`searchParams\`    | \`T\`                   | 현재 URL query parm의 상태를 나타내는 객체입니다.                                                 |
| \`setSearchParams\` | \`ParamStateSetter<T>\` | 검색 파라미터를 업데이트하는 함수입니다. 객체 또는 새로운 상태를 반환하는 함수를 인자로 받습니다. |

---
