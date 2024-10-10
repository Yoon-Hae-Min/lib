import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

interface FileUploadProps {
  types: string[];
  size?: number;
  maxFileCount?: number;
  limitNameLength?: number;
  onChange?: (files: File[]) => void;
  initialFiles?: File[];
}

/**
 * @description 파일 업로드 커스텀 훅
 * @param types - 허용할 파일 타입
 * @param size - 허용할 파일 사이즈 (MB)
 * @param maxFileCount - 허용할 파일 갯수
 * @param limitNameLength - 파일 이름 길이 제한
 * @param onChange - 파일 변경 시 호출할 콜백
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
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[] | null | undefined>(initialFiles);
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxFileSize = size * 1024 * 1024;

  const validateFileType = (type: string) => {
    return types.includes(type);
  };

  const validateFileSize = (size: number) => {
    return size <= maxFileSize;
  };

  const validateFileCount = (count: number) => {
    return count <= maxFileCount;
  };

  const validateFileNameLength = (name: string) => {
    return !limitNameLength || name.length <= limitNameLength;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (!validateFileCount(selectedFiles.length)) {
      setIsError(true);
      return;
    }

    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      if (validateFileType(file.type) && validateFileSize(file.size) && validateFileNameLength(file.name)) {
        validFiles.push(file);
      } else {
        setIsError(true);
        return;
      }
    }

    setFiles(validFiles);
    onChange && onChange(validFiles);
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
