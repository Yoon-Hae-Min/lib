import { renderHook, act, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import useParamState from './useParamState';

const RouterElement = () => {
  const location = useLocation();
  return <div data-testid="search-params">{location.search}</div>;
};

// 래퍼 컴포넌트로 MemoryRouter 사용
const wrapper = ({ children }: PropsWithChildren) => {
  return (
    <MemoryRouter initialEntries={['/test-path']}>
      <Routes>
        <Route
          path="/test-path"
          element={
            <>
              <RouterElement />
              {children}
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('useParamState', () => {
  it('set을 하지 않으면 초기 값을 그대로 반영해야 한다.', () => {
    const initialValue = { param1: 'value1', param2: '2' };

    const { result } = renderHook(() => useParamState(initialValue), { wrapper });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual(initialValue);
  });

  it('setSearchParams로 빈 쿼리 파라미터를 업데이트 해야한다.', () => {
    const { result } = renderHook(
      () =>
        useParamState<{
          param2?: string;
          param3?: {
            params4?: string;
          };
        }>(),
      { wrapper },
    );

    act(() => {
      result.current[1]({
        param2: 'newValue',
        param3: {
          params4: 'value4',
        },
      });
    });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual({
      param2: 'newValue',
      param3: {
        params4: 'value4',
      },
    });

    // URL이 업데이트되었는지 확인
    expect(screen.getByTestId('search-params').textContent).toBe('?param2=newValue&param3.params4=value4');
  });

  it('setSearchParams는 setter함수로도 업데이트 되어야 한다.', () => {
    const initialValue = { param1: 'value1' };

    const { result } = renderHook(() => useParamState(initialValue), { wrapper });

    act(() => {
      result.current[1]((prevParams) => ({ ...prevParams, param2: 'newValue' }));
    });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual({ param1: 'value1', param2: 'newValue' });

    // URL이 업데이트되었는지 확인
    expect(screen.getByTestId('search-params').textContent).toBe('?param1=value1&param2=newValue');
  });

  it('setSearchParams에서 undefined나 null 값은 query param에 포함되지 않아야 한다.', () => {
    const initialValue = { param1: 'value1', param2: 'value2' };

    const { result } = renderHook(() => useParamState<Partial<typeof initialValue>>(initialValue), { wrapper });

    act(() => {
      result.current[1]({ param1: 'value1', param2: undefined });
    });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual({ param1: 'value1' });

    // URL이 업데이트되었는지 확인
    expect(screen.getByTestId('search-params').textContent).toBe('?param1=value1');
  });

  it('setSearchParams에서 중첩 객체와 배열도 처리할 수 있어야 한다.', () => {
    const initialValue = {
      param1: 'value1',
      param2: {
        param3: 'value3',
        param4: {
          param5: ['value5', 'value6'],
        },
      },
    };

    const { result } = renderHook(() => useParamState<Partial<typeof initialValue>>(initialValue), { wrapper });

    act(() => {
      result.current[1](initialValue);
    });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual(initialValue);

    // URL이 업데이트되었는지 확인
    expect(screen.getByTestId('search-params').textContent).toBe(
      '?param1=value1&param2.param3=value3&param2.param4.param5.0=value5&param2.param4.param5.1=value6',
    );
  });

  // 구현 및 생각 필요
  // it('여러개의 hook을 사용해도 하나의 Url에 모두 적용되어야 한다.', () => {
  //   const useCombinedParamState = () => {
  //     const state1 = useParamState<{ param1: string; param2?: string }>({ param1: 'value1' });
  //     const state2 = useParamState<{ param4: string; param3?: string }>({ param4: 'value3' });
  //     return [state1, state2] as const;
  //   };

  //   const { result } = renderHook(() => useCombinedParamState(), { wrapper });
  //   const [result1, result2] = result.current;

  //   act(() => {
  //     result1[1]({ param1: 'value1', param2: 'value2' });
  //   });
  //   act(() => {
  //     result2[1]({ param3: 'value3', param4: 'value4' });
  //   });

  //   // URL이 업데이트되었는지 확인
  //   expect(screen.getByTestId('search-params').textContent).toBe(
  //     '?param1=value1&param2=value2&param3=value3&param4=value4',
  //   );
  // });
});
