import { merge } from 'es-toolkit';

type Primitive = string | number | boolean | null | undefined;
type NestedObject = { [key: string]: Primitive | NestedObject };

type UnFlattenObject<T> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: T[K] extends object ? UnFlattenObject<T[K]> : T[K];
      }
    : T;

export const unFlattenObject = <T extends Record<string, any>>(data: T): UnFlattenObject<T> => {
  let result: NestedObject = {};

  const setNestedValue = (keys: string[], value: any, currentIndex: number = 0): NestedObject => {
    const currentKey = keys[currentIndex] as string;
    const isArrayIndex = !isNaN(Number(currentKey));
    const key = isArrayIndex ? Number(currentKey) : currentKey;
    let returnValue = null;

    if (isArrayIndex) {
      returnValue = [] as any;
    } else {
      returnValue = {};
    }

    if (currentIndex === keys.length - 1) {
      returnValue[key] = value;
      return returnValue;
    }

    return { [key]: setNestedValue(keys, value, currentIndex + 1) };
  };

  Object.entries(data).forEach(([key, value]) => {
    const keys = key.split('.');
    result = merge(result, setNestedValue(keys, value));
  });

  return result as UnFlattenObject<T>;
};

const isObjEmpty = (obj: object) => Object.keys(obj).length === 0;

export const hasAnyMatchingElementDeep = (a: NestedObject, b: NestedObject): boolean => {
  return Object.entries(b).some(([key, value]) => {
    if (isObjEmpty(a) || isObjEmpty(b)) return false;

    if (typeof value === 'object' && value !== null) {
      return hasAnyMatchingElementDeep(a[key] as NestedObject, value);
    } else {
      return a[key] === value;
    }
  });
};
