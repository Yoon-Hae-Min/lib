# @yoonhaemin-lib/view-tracker

> 스크롤에 따라 화면에 보이는 섹션을 추적하는 React 컴포넌트

## Features

- ✅ **자동 섹션 추적** - 스크롤 시 화면에 보이는 섹션 자동 감지
- ✅ **커스터마이징** - 상단/하단 인터섹션 옵션 설정 가능

## Installation

```bash
npm install @yoonhaemin-lib/view-tracker
```

```bash
yarn add @yoonhaemin-lib/view-tracker
```

```bash
pnpm add @yoonhaemin-lib/view-tracker
```

## Quick Start

```tsx
import { ViewTrackerProvider, ViewTracker, useViewTracker } from '@yoonhaemin-lib/view-tracker';

function App() {
  return (
    <ViewTrackerProvider>
      <Navigation />
      <Content />
    </ViewTrackerProvider>
  );
}

function Navigation() {
  const { viewSection } = useViewTracker();
  return <nav>현재 섹션: {viewSection}</nav>;
}

function Content() {
  return (
    <>
      <ViewTracker id="intro">
        <section>인트로 섹션</section>
      </ViewTracker>
      <ViewTracker id="features">
        <section>기능 섹션</section>
      </ViewTracker>
      <ViewTracker id="contact">
        <section>연락처 섹션</section>
      </ViewTracker>
    </>
  );
}
```

## Usage

### 기본 사용법

`ViewTrackerProvider`로 앱을 감싸고, `ViewTracker`로 추적할 섹션을 감싸면 됩니다.

```tsx
import { ViewTrackerProvider, ViewTracker } from '@yoonhaemin-lib/view-tracker';

function App() {
  return (
    <ViewTrackerProvider>
      <ViewTracker id="section-1">
        <div style={{ height: '100vh' }}>첫 번째 섹션</div>
      </ViewTracker>
      <ViewTracker id="section-2">
        <div style={{ height: '100vh' }}>두 번째 섹션</div>
      </ViewTracker>
      <ViewTracker id="section-3">
        <div style={{ height: '100vh' }}>세 번째 섹션</div>
      </ViewTracker>
    </ViewTrackerProvider>
  );
}
```

### 현재 섹션 읽기

`useViewTracker` 훅을 사용하여 현재 화면에 보이는 섹션 ID를 가져올 수 있습니다.

```tsx
import { useViewTracker } from '@yoonhaemin-lib/view-tracker';

function Navigation() {
  const { viewSection } = useViewTracker();

  return (
    <nav>
      <a href="#intro" className={viewSection === 'intro' ? 'active' : ''}>
        소개
      </a>
      <a href="#features" className={viewSection === 'features' ? 'active' : ''}>
        기능
      </a>
      <a href="#pricing" className={viewSection === 'pricing' ? 'active' : ''}>
        가격
      </a>
    </nav>
  );
}
```

### 인터섹션 옵션 커스터마이징

`top`과 `bottom` props를 사용하여 언제 섹션을 "보이는 것"으로 간주할지 설정할 수 있습니다.

```tsx
import { ViewTracker } from '@yoonhaemin-lib/view-tracker';

function CustomSection() {
  return (
    <ViewTracker
      id="custom"
      top={{
        root: null,
        rootMargin: '-100px 0px 0px 0px',
        threshold: 0,
      }}
      bottom={{
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 1,
      }}
    >
      <div style={{ height: '100vh' }}>커스텀 섹션</div>
    </ViewTracker>
  );
}
```

### 스크롤 진행률 표시

```tsx
import { ViewTrackerProvider, ViewTracker, useViewTracker } from '@yoonhaemin-lib/view-tracker';

function App() {
  return (
    <ViewTrackerProvider>
      <ScrollProgress />
      <Content />
    </ViewTrackerProvider>
  );
}

function ScrollProgress() {
  const { viewSection } = useViewTracker();
  const sections = ['intro', 'features', 'pricing', 'contact'];
  const currentIndex = sections.indexOf(viewSection);

  return (
    <div style={{ position: 'fixed', top: 0, width: '100%', background: '#333' }}>
      {sections.map((section, index) => (
        <div
          key={section}
          style={{
            display: 'inline-block',
            width: '25%',
            height: '4px',
            background: index <= currentIndex ? '#007bff' : '#ccc',
          }}
        />
      ))}
    </div>
  );
}

function Content() {
  return (
    <>
      <ViewTracker id="intro">
        <section style={{ height: '100vh' }}>인트로</section>
      </ViewTracker>
      <ViewTracker id="features">
        <section style={{ height: '100vh' }}>기능</section>
      </ViewTracker>
      <ViewTracker id="pricing">
        <section style={{ height: '100vh' }}>가격</section>
      </ViewTracker>
      <ViewTracker id="contact">
        <section style={{ height: '100vh' }}>연락처</section>
      </ViewTracker>
    </>
  );
}
```

### 네비게이션 하이라이팅

```tsx
import { ViewTrackerProvider, ViewTracker, useViewTracker } from '@yoonhaemin-lib/view-tracker';

function StickyNav() {
  const { viewSection } = useViewTracker();

  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'about', label: '소개' },
    { id: 'services', label: '서비스' },
    { id: 'portfolio', label: '포트폴리오' },
  ];

  return (
    <nav style={{ position: 'sticky', top: 0, background: 'white', padding: '1rem' }}>
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{
            marginRight: '1rem',
            fontWeight: viewSection === item.id ? 'bold' : 'normal',
            color: viewSection === item.id ? '#007bff' : '#333',
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

## API Reference

### `useViewTracker()`

현재 화면에 보이는 섹션 정보를 반환하는 훅입니다.

#### 반환값

| 반환값           | 타입                   | 설명                                         |
| ---------------- | ---------------------- | -------------------------------------------- |
| `viewSection`    | `string`               | 현재 뷰포트에 보이는 섹션의 ID               |
| `setViewSection` | `(id: string) => void` | 섹션 ID를 수동으로 설정하는 함수 (고급 사용) |

### `ViewTrackerProvider`

뷰 트래킹 기능을 제공하는 Context Provider입니다.

#### Props

| Props      | 타입              | 필수 | 설명                                 |
| ---------- | ----------------- | ---- | ------------------------------------ |
| `children` | `React.ReactNode` | ✅   | 트래킹할 섹션을 포함한 자식 컴포넌트 |

### `ViewTracker`

특정 섹션을 추적하는 컴포넌트입니다.

#### Props

| Props      | 타입                       | 필수 | 기본값 | 설명                      |
| ---------- | -------------------------- | ---- | ------ | ------------------------- |
| `id`       | `string`                   | ✅   | -      | 추적할 섹션의 고유 ID     |
| `children` | `React.ReactNode`          | ✅   | -      | 섹션의 콘텐츠             |
| `top`      | `IntersectionObserverInit` | ❌   | -      | 상단에 대한 인터섹션 옵션 |
| `bottom`   | `IntersectionObserverInit` | ❌   | -      | 하단에 대한 인터섹션 옵션 |

## License

MIT © [Yoon Hae Min](https://github.com/Yoon-Hae-Min)
