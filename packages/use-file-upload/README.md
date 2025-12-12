# @yoonhaemin-lib/use-file-upload

> 파일 업로드를 쉽게 관리할 수 있는 React Hook

## Features

- ✅ **간단한 API** - `useState`와 유사한 직관적인 인터페이스
- ✅ **유효성 검사** - 파일 타입, 크기, 개수, 파일명 길이 자동 검증
- ✅ **커스텀 검증** - 프로젝트별 요구사항에 맞는 사용자 정의 검증 로직 추가
- ✅ **에러 핸들링** - 각 검증 실패 시 세분화된 에러 상태 제공

## Installation

```bash
npm install @yoonhaemin-lib/use-file-upload
```

```bash
yarn add @yoonhaemin-lib/use-file-upload
```

```bash
pnpm add @yoonhaemin-lib/use-file-upload
```

## Quick Start

```tsx
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

function FileUploader() {
  const { files, fileInputProps, inputFor, removeFile } = useFileUpload({
    maxFileCount: 1,
  });

  return (
    <div>
      <button {...inputFor}>파일 선택</button>
      <input {...fileInputProps} style={{ display: 'none' }} />

      {files?.map((file, index) => (
        <div key={index}>
          {file.name}
          <button onClick={() => removeFile(index)}>삭제</button>
        </div>
      ))}
    </div>
  );
}
```

## Usage

### 기본 사용법

```tsx
import React from 'react';
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

const BasicExample = () => {
  const { files, fileInputProps, inputFor, removeFile } = useFileUpload({
    maxFileCount: 3,
    size: 5, // MB
    types: ['image/png', 'image/jpeg'],
  });

  return (
    <div>
      <button {...inputFor}>파일 선택</button>
      <input {...fileInputProps} style={{ display: 'none' }} />

      <ul>
        {files?.map((file, index) => (
          <li key={index}>
            {file.name}
            <button onClick={() => removeFile(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### 에러 핸들링

```tsx
import React from 'react';
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

const ErrorHandlingExample = () => {
  const { files, fileInputProps, inputFor, removeFile, isError } = useFileUpload({
    types: ['image/png', 'image/jpeg'],
    size: 5,
    maxFileCount: 3,
    limitNameLength: 20,
  });

  return (
    <div>
      <button {...inputFor}>파일 선택</button>
      <input {...fileInputProps} style={{ display: 'none' }} />

      {/* 에러 메시지 표시 */}
      {isError.type && <p style={{ color: 'red' }}>허용되지 않은 파일 형식입니다.</p>}
      {isError.size && <p style={{ color: 'red' }}>파일 크기가 5MB를 초과합니다.</p>}
      {isError.count && <p style={{ color: 'red' }}>최대 3개까지만 업로드 가능합니다.</p>}
      {isError.nameLength && <p style={{ color: 'red' }}>파일 이름이 너무 깁니다. (최대 20자)</p>}

      <ul>
        {files?.map((file, index) => (
          <li key={index}>
            {file.name}
            <button onClick={() => removeFile(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### onChange 콜백 사용

```tsx
import React from 'react';
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

const OnChangeExample = () => {
  const { files, fileInputProps, inputFor } = useFileUpload({
    onChange: (uploadedFiles) => {
      console.log('업로드된 파일:', uploadedFiles);
      // API 호출이나 다른 로직 실행
      // 참고: 유효성 검사를 통과한 파일만 onChange가 호출됩니다.
    },
  });

  return (
    <div>
      <button {...inputFor}>파일 선택</button>
      <input {...fileInputProps} style={{ display: 'none' }} />
    </div>
  );
};
```

### 커스텀 검증

```tsx
import React from 'react';
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

const CustomValidationExample = () => {
  const { files, fileInputProps, inputFor, isError } = useFileUpload({
    customValidations: [
      // 파일 크기가 1KB 미만인지 검증
      (file) => ({ tooSmall: file.size < 1024 }),
      // 파일 이름에 특수문자가 있는지 검증
      (file) => ({ hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(file.name) }),
    ],
  });

  return (
    <div>
      <button {...inputFor}>파일 선택</button>
      <input {...fileInputProps} style={{ display: 'none' }} />

      {isError.tooSmall && <p>파일 크기가 너무 작습니다. (최소 1KB)</p>}
      {isError.hasSpecialChar && <p>파일 이름에 특수문자를 사용할 수 없습니다.</p>}
    </div>
  );
};
```

### 초기 파일 설정

```tsx
import React from 'react';
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

const InitialFilesExample = () => {
  // 기존에 업로드된 파일이 있는 경우
  const existingFiles = [
    /* File 객체 배열 */
  ];

  const { files, fileInputProps, inputFor, removeFile } = useFileUpload({
    initialFiles: existingFiles,
  });

  return (
    <div>
      <button {...inputFor}>파일 추가</button>
      <input {...fileInputProps} style={{ display: 'none' }} />

      <ul>
        {files?.map((file, index) => (
          <li key={index}>
            {file.name}
            <button onClick={() => removeFile(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## API Reference

### `useFileUpload` 매개변수

| 매개변수            | 타입                      | 기본값 | 설명                                                                                      |
| ------------------- | ------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `types`             | `string[]`                | -      | 허용할 파일 타입 ([MIME 타입](https://developer.mozilla.org/ko/docs/Web/HTTP/MIME_types)) |
| `size`              | `number`                  | `10`   | 허용할 최대 파일 크기 (단위: MB)                                                          |
| `maxFileCount`      | `number`                  | `1`    | 허용할 최대 파일 개수                                                                     |
| `limitNameLength`   | `number`                  | -      | 파일 이름의 최대 길이                                                                     |
| `onChange`          | `(files: File[]) => void` | -      | 파일이 변경되었을 때 호출될 콜백 함수 (유효성 검사 통과 시에만 호출됨)                    |
| `initialFiles`      | `File[]`                  | -      | 초기 파일 목록                                                                            |
| `customValidations` | `((file: File) => T)[]`   | -      | 커스텀 검증 함수 배열. 각 함수는 `{ [key: string]: boolean }` 형태의 객체를 반환          |

### `useFileUpload` 반환값

| 반환값           | 타입                                          | 설명                                                                            |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| `files`          | `File[] \| null \| undefined`                 | 현재 선택된 파일 목록                                                           |
| `fileInputProps` | `React.InputHTMLAttributes<HTMLInputElement>` | `<input type="file">` 엘리먼트에 전달할 props (onChange, accept, multiple, ref) |
| `inputFor`       | `React.HTMLAttributes<HTMLElement>`           | 파일 선택을 트리거할 커스텀 버튼에 전달할 props (onClick)                       |
| `removeFile`     | `(index: number) => void`                     | 특정 인덱스의 파일을 제거하는 함수                                              |
| `isError`        | `FileErrorType & T`                           | 각 검증 규칙에 대한 에러 상태 객체                                              |

#### `FileErrorType`

```typescript
type FileErrorType = {
  size: boolean; // 파일 크기 초과 여부
  count: boolean; // 파일 개수 초과 여부
  type: boolean; // 파일 타입 불일치 여부
  nameLength: boolean; // 파일 이름 길이 초과 여부
};
```

## Examples

### 이미지 미리보기와 함께 사용

```tsx
import React, { useState } from 'react';
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

const ImagePreviewExample = () => {
  const [previews, setPreviews] = useState<string[]>([]);

  const { files, fileInputProps, inputFor, removeFile } = useFileUpload({
    types: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileCount: 5,
    onChange: (uploadedFiles) => {
      // 미리보기 URL 생성
      const urls = uploadedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    },
  });

  return (
    <div>
      <button {...inputFor}>이미지 선택</button>
      <input {...fileInputProps} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {previews.map((url, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img src={url} alt={`preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <button
              onClick={() => {
                removeFile(index);
                setPreviews((prev) => prev.filter((_, i) => i !== index));
              }}
              style={{ position: 'absolute', top: 0, right: 0 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## TypeScript

이 패키지는 TypeScript로 작성되었으며 완전한 타입 정의를 제공합니다.

```typescript
import useFileUpload from '@yoonhaemin-lib/use-file-upload';

// 커스텀 검증의 타입 정의
type CustomValidation = {
  tooSmall: boolean;
  hasSpecialChar: boolean;
};

const { isError } = useFileUpload<CustomValidation>({
  customValidations: [
    (file) => ({ tooSmall: file.size < 1024 }),
    (file) => ({ hasSpecialChar: /[!@#$%^&*()]/.test(file.name) }),
  ],
});

// isError는 FileErrorType & CustomValidation 타입을 가집니다
if (isError.tooSmall) {
  // 타입 안전하게 접근 가능
}
```

## License

MIT © [Yoon Hae Min](https://github.com/Yoon-Hae-Min)
