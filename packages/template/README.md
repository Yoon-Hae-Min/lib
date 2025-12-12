# @yoonhaemin-lib/template

> 새로운 패키지 생성을 위한 템플릿 패키지

이 패키지는 `@yoonhaemin-lib` monorepo에서 새로운 패키지를 생성할 때 사용하는 템플릿입니다. 모든 필요한 설정 파일과 빌드 구성이 포함되어 있어 일관된 구조로 패키지를 시작할 수 있습니다.

## 템플릿 구조

```
packages/template/
├── src/
│   └── index.ts              # 메인 엔트리 포인트
├── dist/                     # 빌드 결과물 (빌드 후 생성)
│   ├── bundle.js             # CommonJS 번들
│   ├── bundle.mjs            # ES Module 번들
│   └── index.d.ts            # TypeScript 타입 정의
├── package.json              # 패키지 메타데이터 및 의존성
├── tsconfig.json             # TypeScript 컴파일러 설정
├── tsconfig.lint.json        # ESLint용 TypeScript 설정
├── rollup.config.js          # Rollup 번들러 설정
├── jest.config.js            # Jest 테스트 설정
├── babel.config.js           # Babel 트랜스파일러 설정
└── .eslintrc.js              # ESLint 린트 규칙
```

## 새 패키지 만들기

### 1. package.json 수정

```json
{
  "name": "@yoonhaemin-lib/your-new-package",
  "version": "0.0.1",
  "description": "패키지 설명을 여기에 작성하세요",
  "keywords": ["keyword1", "keyword2"],
  "repository": {
    "type": "git",
    "url": "https://github.com/Yoon-Hae-Min/lib",
    "directory": "packages/your-new-package"
  }
}
```

**수정해야 할 필드:**

- `name` - 패키지 이름 (`@yoonhaemin-lib/` 접두사 유지)
- `version` - 초기 버전 (보통 `0.0.1`로 시작)
- `description` - 패키지에 대한 간단한 설명
- `keywords` - npm 검색을 위한 키워드
- `repository.directory` - 패키지 디렉토리 경로

### 2. 의존성 조정 (필요한 경우)

```json
{
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
    // React가 필요 없는 패키지라면 제거
  },
  "dependencies": {
    // 런타임에 필요한 외부 라이브러리 추가
  }
}
```

### 3. 코드 작성

`src/index.ts`에서 시작하여 패키지 구현:

```typescript
// src/index.ts
export { default as YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent';
```

## 빌드 프로세스

`pnpm build` 명령어는 다음 순서로 실행됩니다:

1. **Lint** (`pnpm lint`)

   - ESLint로 코드 품질 검사
   - 경고가 있으면 빌드 실패

2. **Test** (`pnpm test`)

   - Jest로 모든 테스트 실행
   - 테스트 실패 시 빌드 중단

3. **TypeScript 컴파일** (`tsc`)

   - src/ → types/ 로 타입 정의 생성
   - 타입 에러가 있으면 빌드 실패

4. **Rollup 번들링** (`rollup --config`)

   - JavaScript 번들 생성 (CJS, ESM)
   - 타입 정의 병합 (types/ → dist/index.d.ts)

5. **정리** (`rm -rf ./types`)
   - 임시 타입 디렉토리 삭제
   - 최종 결과물만 dist/에 남김

### 빌드 결과물

```
dist/
├── bundle.js         # CommonJS 번들 (Node.js, Webpack 등)
├── bundle.mjs        # ES Module 번들 (Vite, Rollup 등)
└── index.d.ts        # TypeScript 타입 정의 (모든 .d.ts 병합)
```

## 배포 가이드

### 1. 버전 업데이트

```bash
# package.json의 version 필드 수정
# Semantic Versioning 규칙 따르기:
# - MAJOR: 호환되지 않는 API 변경 (1.0.0)
# - MINOR: 하위 호환되는 기능 추가 (0.1.0)
# - PATCH: 하위 호환되는 버그 수정 (0.0.1)
```

### 2. CHANGELOG 작성

변경 사항을 `CHANGELOG.md`에 기록합니다.

### 3. 빌드 및 테스트

```bash
pnpm build
```

### 4. npm 배포

```bash
npm publish
# 또는
pnpm publish
```

## 체크리스트

새 패키지를 만들 때 확인할 사항:

- [ ] package.json의 name, version, description 수정
- [ ] package.json의 repository.directory 경로 수정
- [ ] peerDependencies 확인 (React 필요 여부)
- [ ] src/index.ts에 코드 작성
- [ ] 테스트 코드 작성
- [ ] README.md 작성
- [ ] pnpm build 성공 확인
- [ ] 모든 테스트 통과 확인
- [ ] 린트 오류 없음 확인

## License

MIT © [Yoon Hae Min](https://github.com/Yoon-Hae-Min)
