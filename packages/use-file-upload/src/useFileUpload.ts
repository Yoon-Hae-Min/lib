import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

type FilesState = File[] | null | undefined;

export type FileErrorType = {
  size: boolean;
  count: boolean;
  type: boolean;
  nameLength: boolean;
  [key: string]: boolean;
};
interface FileUploadProps {
  types: string[];
  size?: number;
  maxFileCount?: number;
  limitNameLength?: number;
  onChange?: (files: File[]) => void;
  initialFiles?: File[];
  customValidations?: ((file: File) => { [key: string]: boolean })[];
}

/**
 * @description 파일 업로드 커스텀 훅
 * @param types - 허용할 파일 타입
 * @param size - 허용할 파일 사이즈 (MB)
 * @param maxFileCount - 허용할 파일 갯수
 * @param limitNameLength - 파일 이름 길이 제한
 * @param onChange - 파일 변경 시 호출할 콜백
 * @param initialFiles - 초기 파일 목록
 * @param customValidations - 커스텀 검증 함수
 *
 * @returns files - 업로드된 파일 목록
 * @returns fileInputProps - input에 바인딩
 * @returns inputFor - input을 대체할 엘리먼트에 바인딩
 *
 */
const useFileUpload = ({
  types,
  size = 10,
  maxFileCount = 1,
  limitNameLength,
  onChange,
  initialFiles,
  customValidations,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FilesState>(initialFiles);
  const [isError, setIsError] = useState<FileErrorType>({
    size: false,
    count: false,
    type: false,
    nameLength: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxFileSize = size * 1024 * 1024;

  const setError = (errorKey: string, condition: boolean) => {
    setIsError((pre) => ({ ...pre, [errorKey]: condition }));
    return condition;
  };

  const validateFileType = (type: string) => !setError('type', !types.includes(type));

  const validateFileSize = (fileSize: number) => !setError('size', fileSize > maxFileSize);

  const validateFileCount = (count: number) => !setError('count', count > maxFileCount);

  const validateFileNameLength = (name: string) =>
    !setError('nameLength', !!limitNameLength && name.length > limitNameLength);

  const validateCustom = (file: File) => {
    return customValidations?.every((validate) => {
      return Object.entries(validate(file)).every(([key, value]) => {
        return !setError(key, value);
      });
    });
  };

  const validateFiles = (file: File) => {
    return (
      validateFileType(file.type) &&
      validateFileSize(file.size) &&
      validateFileNameLength(file.name) &&
      validateCustom(file)
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !validateFileCount(selectedFiles.length)) return;

    const filesArray = Array.from(selectedFiles);

    const isValid = filesArray.every((file) => validateFiles(file));
    if (isValid) {
      setFiles(filesArray);
      onChange && onChange(filesArray);
    }
  };

  const removeFile = (index: number) => {
    setFiles((pre) => {
      if (!pre) return null;
      return pre.filter((_, i) => i !== index);
    });
  };

  const targetClick = () => {
    fileInputRef.current?.click();
  };

  return {
    files,
    fileInputProps: {
      onChange: handleFileChange,
      accept: types.join(','),
      multiple: maxFileCount > 1,
      ref: fileInputRef,
    },
    inputFor: {
      onClick: targetClick,
    },
    removeFile,
    isError,
  };
};

export default useFileUpload;
