import { useMemo, useCallback, useEffect } from 'react';
import type { NavigateOptions } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchParams = {
  [key: string]: string | undefined | null;
};

export type ParamStateAction<T extends SearchParams> = T | ((prevState: T) => T);
export type ParamStateSetter<T extends SearchParams> = (action: ParamStateAction<T>) => void;

export const useParamState = <T extends SearchParams>(initialValue: T, options?: NavigateOptions) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 URL의 쿼리 파라미터를 파싱하여 객체로 변환
  const searchParams: T = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return Array.from(params.entries()).reduce((acc, [key, value]) => {
      acc[key as keyof T] = value as T[keyof T];
      return acc;
    }, {} as T);
  }, [location.search]);

  // 초기값을 쿼리 파라미터에 반영
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // initialValue의 키와 값을 쿼리 파라미터에 설정
    Object.entries(initialValue).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, value);
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
          updatedParams.set(key, value);
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
