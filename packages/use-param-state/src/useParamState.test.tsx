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
  it('초기값을 쿼리 파라미터에 반영 해야한다.', () => {
    const initialValue = { param1: 'value1', param2: 'value2' };

    const { result } = renderHook(() => useParamState(initialValue), { wrapper });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual(initialValue);

    // URL이 업데이트되었는지 확인
    expect(screen.getByTestId('search-params').textContent).toBe('?param1=value1&param2=value2');
  });

  it('초기값이 없으면 쿼리 파라미터에 반영되지 않아야 한다.', () => {
    const { result } = renderHook(() => useParamState<{ param1?: string }>(), { wrapper });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual({});

    // URL이 업데이트되었는지 확인
    expect(screen.getByTestId('search-params').textContent).toBe;
  });

  it('setSearchParams로 쿼리 파라미터를 업데이트해야한다.', () => {

    const { result } = renderHook(
      () =>
        useParamState<{
          param2?: string;
        }>(),
      { wrapper },
    );

    act(() => {
      result.current[1]({ param2: 'newValue' });
    });

    // 상태가 반영되었는지 확인
    expect(result.current[0]).toEqual({ param2: 'newValue' });

    // URL이 업데이트되었는지 확인
    expect(screen.getByTestId('search-params').textContent).toBe('?param2=newValue');
  });

  it('setSearchParams는 function으로도 업데이트 되어야 한다.', () => {
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
});
