# @yoonhaemin-lib

> 재사용 가능한 React 라이브러리 모음

개발하면서 자주 접하는 중복된 코드를 라이브러리로 만들어서 사용할 수 있도록 만들었습니다.

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- pnpm 10.26.0 (Corepack으로 자동 관리)

### 설치

이 프로젝트는 [Corepack](https://nodejs.org/api/corepack.html)을 사용하여 pnpm 버전을 자동으로 관리합니다.

```bash
# Corepack 활성화 (한 번만 실행)
corepack enable

# 의존성 설치 (자동으로 pnpm@10.26.0 사용)
pnpm install

# 빌드
pnpm build

# 테스트
pnpm test
```

## 모노레포 구조

이 프로젝트는 **pnpm workspace**와 **Turborepo**를 사용하는 모노레포로 구성되어 있습니다.

### 새 패키지 만들기

템플릿을 사용하여 새 패키지를 쉽게 생성할 수 있습니다:

```bash
# 템플릿 기반 패키지 생성
pnpm gen-package

# 또는 수동으로 템플릿 복사
cd packages
cp -r template your-new-package
cd your-new-package
# package.json 수정 후 빌드
pnpm install
pnpm build
```

자세한 내용은 [packages/template/README.md](packages/template/README.md)를 참고하세요.

### 버전 관리 및 배포

이 프로젝트는 **Changesets**을 사용하여 버전 관리와 배포를 자동화합니다:

```bash
# 변경사항 기록
npx changeset

# 버전 업데이트
npx changeset version

# npm에 배포
pnpm ci:publish
```

## 패키지 목록

### general

- [eslint-config](https://github.com/Yoon-Hae-Min/lib/tree/main/packages/eslint-config)
- [swagger-generator](https://github.com/Yoon-Hae-Min/lib/tree/main/packages/swagger-generator)

### hooks

- [useFileUpload](https://github.com/Yoon-Hae-Min/lib/tree/main/packages/use-file-upload)
- [useModal](https://github.com/Yoon-Hae-Min/lib/tree/main/packages/use-modal)
- [useViewTracker](https://github.com/Yoon-Hae-Min/lib/tree/main/packages/view-tracker)
- [useParamState](https://github.com/Yoon-Hae-Min/lib/tree/main/packages/use-param-state)
