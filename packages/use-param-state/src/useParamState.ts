import { useMemo, useCallback, useEffect, useRef } from 'react';
import type { NavigateOptions } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import { unFlattenObject } from './utils';
import { flattenObject } from 'es-toolkit';

type SearchParams = Record<string, any>;

export type ParamStateAction<T extends SearchParams> = T | ((prevState: T) => T);
export type ParamStateSetter<T extends SearchParams> = (action: ParamStateAction<T>) => void;

export const useParamState = <T extends SearchParams>(initialValue?: T, options?: NavigateOptions) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 URL의 쿼리 파라미터를 파싱하여 객체로 변환
  const searchParams = useMemo<T>(() => {
    const params = new URLSearchParams(location.search);
    const parsedParams = unFlattenObject(Object.fromEntries(params.entries()));

    if (initialValue && params.size <= 0) {
      return initialValue;
    } else {
      return parsedParams as T;
    }
  }, [initialValue, location.search]);

  // 쿼리 파라미터를 업데이트하는 함수
  const setSearchParams: ParamStateSetter<T> = useCallback(
    (newParams: ParamStateAction<T>) => {
      const resolvedNewParams: T = typeof newParams === 'function' ? newParams(searchParams) : newParams;
      const updatedParams = new URLSearchParams();

      Object.entries(flattenObject(resolvedNewParams)).forEach(([key, value]) => {
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
