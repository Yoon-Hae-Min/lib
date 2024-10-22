# useFileUpload

파일 업로드를 도와주는 hook입니다. 실제 파일이 업로드 되는 input과 그 버튼을 대체할 input을 제공합니다.

### 예시 코드

```tsx
import React from 'react';
import useFileUpload from './useFileUpload';

const FileUploader = () => {
  const { files, fileInputProps, inputFor, removeFile, isError } = useFileUpload({
    types: ['image/png', 'image/jpeg'],
    size: 5, // MB
    maxFileCount: 3,
    limitNameLength: 20,
    customValidations: [(file) => ({ customValidation: file.size < 1024 })],
    onChange: (uploadedFiles) => {
      console.log('Uploaded files:', uploadedFiles);
      // validation이 만족하지 않으면 실행되지 않습니다.
    },
  });

  return (
    <div>
      <button {...inputFor}>파일 선택</button>
      <input {...fileInputProps} style={{ display: 'none' }} />

      {isError.size && <p>파일이 너무 큽니다.</p>}
      {isError.count && <p>파일 개수가 너무 많습니다.</p>}
      {isError.type && <p>허용되지 않은 파일 형식입니다.</p>}
      {isError.nameLength && <p>파일 이름이 너무 깁니다.</p>}
      {isError.customValidation && <p>사용자 정의 검증 실패</p>}

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

export default FileUploader;
```

---

## API Reference

### `useFileUpload` 매개변수

| 매개변수            | 타입                      | 설명                                                                                            | 필수 여부 |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------------------------- | --------- |
| `types`             | `string[]`                | 허용할 파일 타입 ([MIME](!https://developer.mozilla.org/ko/docs/Web/HTTP/MIME_types) 타입 형식) | X         |
| `size`              | `number`                  | 허용할 파일 크기 (단위: MB, 기본값: 10MB)                                                       | X         |
| `maxFileCount`      | `number`                  | 허용할 파일 개수 (기본값: 1)                                                                    | X         |
| `limitNameLength`   | `number`                  | 파일 이름의 최대 길이 (옵션)                                                                    | X         |
| `onChange`          | `(files: File[]) => void` | 파일이 변경되었을 때 호출될 콜백 함수                                                           | X         |
| `initialFiles`      | `File[]`                  | 초기 파일 목록                                                                                  | X         |
| `customValidations` | `((file: File) => T)[]`   | 파일에 대한 커스텀 검증 로직, 유효성 검사 결과는 키-값 쌍으로 전달됨                            | X         |

### `useFileUpload` 반환값

| 반환값           | 타입                                          | 설명                                                                |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| `files`          | `File[]`                                      | 업로드된 파일 목록                                                  |
| `fileInputProps` | `React.InputHTMLAttributes<HTMLInputElement>` | `input` 엘리먼트에 바인딩할 속성                                    |
| `inputFor`       | `React.HTMLAttributes<HTMLElement>`           | 파일 선택 버튼 등 다른 엘리먼트에 바인딩할 수 있는 클릭 이벤트 속성 |
| `removeFile`     | `(index: number) => void`                     | 선택한 파일을 목록에서 제거하는 함수                                |
| `isError`        | `FileErrorType & T`                           | 파일 업로드 시 발생한 에러 상태 (기본 에러 및 커스텀 에러 포함)     |

```

```
