import { useMemo, useCallback, useEffect } from 'react';
import type { NavigateOptions } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchParams = {
  [key: string | number | symbol]: unknown | SearchParams;
};

export type ParamStateAction<T extends SearchParams> = T | ((prevState: T) => T);
export type ParamStateSetter<T extends SearchParams> = (action: ParamStateAction<T>) => void;

export const useParamState = <T extends SearchParams>(initialValue?: T, options?: NavigateOptions) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 URL의 쿼리 파라미터를 파싱하여 객체로 변환
  const searchParams: T = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return Array.from(params.entries()).reduce((acc, [key, value]) => {
      try {
        // JSON으로 파싱 가능한 경우 중첩 객체로 복원
        acc[key as keyof T] = JSON.parse(value) as T[keyof T];
      } catch {
        // JSON 파싱 실패 시 기본 값 사용
        acc[key as keyof T] = value as T[keyof T];
      }
      return acc;
    }, {} as T);
  }, [location.search]);

  // 초기값을 쿼리 파라미터에 반영
  useEffect(() => {
    if (!initialValue) return;
    const params = new URLSearchParams(location.search);

    // initialValue의 키와 값을 쿼리 파라미터에 설정
    Object.entries(initialValue).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      options,
    );
  }, []);

  // 쿼리 파라미터를 업데이트하는 함수
  const setSearchParams: ParamStateSetter<T> = useCallback(
    (newParams: ParamStateAction<T>) => {
      const resolvedNewParams: T = typeof newParams === 'function' ? newParams(searchParams) : newParams;

      const updatedParams = new URLSearchParams();

      Object.entries(resolvedNewParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          updatedParams.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      navigate(
        {
          pathname: location.pathname,
          search: updatedParams.toString(),
        },
        options,
      );
    },
    [navigate, location.pathname, searchParams, options, location.search],
  );

  return [searchParams, setSearchParams] as const;
};

export default useParamState;
