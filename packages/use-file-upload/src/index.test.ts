import { act, renderHook } from '@testing-library/react';

import { createFile } from './test-utils';
import useFileUpload from './useFileUpload';

describe('useFileUpload', () => {
  it('빈 파일을 초기화 할 수 있다.', () => {
    const { result } = renderHook(() =>
      useFileUpload({ types: ['image/png', 'image/jpeg'], size: 5, maxFileCount: 1 }),
    );
    expect(result.current.files).toBeUndefined();
    expect(Object.values(result.current.isError).every((v) => v)).toBe(false);
  });

  it('파일을 초기화 할 수 있다.', () => {
    const file = createFile('test.png', 4 * 1024 * 1024, 'image/png');
    const { result } = renderHook(() =>
      useFileUpload({ types: ['image/png', 'image/jpeg'], size: 5, maxFileCount: 1, initialFiles: [file] }),
    );

    expect(result.current.files).toHaveLength(1);
    expect(result.current.files).toStrictEqual([file]);
    expect(Object.values(result.current.isError).every((v) => v)).toBe(false);
  });

  it('지정하지 않는 타입의 파일은 업로드 할 수 없다.', () => {
    const { result } = renderHook(() =>
      useFileUpload({ types: ['image/png', 'image/jpeg'], size: 5, maxFileCount: 1 }),
    );

    const file = createFile('test.txt', 1 * 1024 * 1024, 'text/plain');

    act(() => {
      result.current.fileInputProps.onChange({
        target: { files: [file] },
      } as any);
    });

    expect(result.current.files).toBeUndefined();
    expect(result.current.isError.type).toBe(true);
  });

  it('지정한 파일 개수보다 많은 파일은 업로드 할 수 없다.', () => {
    const { result } = renderHook(() =>
      useFileUpload({ types: ['image/png', 'image/jpeg'], size: 5, maxFileCount: 1 }),
    );

    const file = createFile('test.png', 1 * 1024 * 1024, 'image/png');
    const file1 = createFile('test.png', 1 * 1024 * 1024, 'image/png');

    act(() => {
      result.current.fileInputProps.onChange({
        target: { files: [file, file1] },
      } as any);
    });

    expect(result.current.files).toBeUndefined();
    expect(result.current.isError.count).toBe(true);
  });

  it('지정한 파일 용량보다 큰 파일은 업로드 할 수 없다.', () => {
    const { result } = renderHook(() =>
      useFileUpload({ types: ['image/png', 'image/jpeg'], size: 5, maxFileCount: 1 }),
    );

    const file = createFile('test.png', 10 * 1024 * 1024, 'image/png');

    act(() => {
      result.current.fileInputProps.onChange({
        target: { files: [file] },
      } as any);
    });

    expect(result.current.files).toBeUndefined();
    expect(result.current.isError.size).toBe(true);
  });

  it('커스텀 검증을 추가할 수 있다.', () => {
    const customValidation = (file: File) => {
      return { validationError: file.name !== 'valid-file.png' };
    };

    const { result } = renderHook(() =>
      useFileUpload({
        types: ['image/png', 'image/jpeg'],
        size: 5,
        maxFileCount: 1,
        customValidations: [customValidation],
      }),
    );

    const invalidFile = createFile('invalid-file.png', 2 * 1024 * 1024, 'image/png'); // 'valid'를 포함하지 않는 파일
    const validFile = createFile('valid-file.png', 2 * 1024 * 1024, 'image/png'); // 'valid'를 포함하는 파일

    act(() => {
      result.current.fileInputProps.onChange({
        target: { files: [invalidFile] },
      } as any);
    });

    expect(result.current.files).toBeUndefined();
    expect(result.current.isError.validationError).toBe(true);

    act(() => {
      result.current.fileInputProps.onChange({
        target: { files: [validFile] },
      } as any);
    });

    expect(result.current.files).toStrictEqual([validFile]);
    expect(result.current.isError.validationError).toBe(false);
  });
});
