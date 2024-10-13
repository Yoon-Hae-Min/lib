# React ViewTracker 시스템 공식 문서

## 개요

이 문서는 `useViewTracker` 훅과 `ViewTrackerProvider`, `ViewTracker` 컴포넌트를 사용하여 특정 섹션이 화면에 들어왔을 때 해당 섹션을 추적하는 방법을 설명합니다. 이 시스템은 스크롤을 통해 사용자가 보고 있는 섹션을 동적으로 감지하고 이를 기록할 수 있습니다.

## 기본 사용법

### 예시 코드

```tsx
import React from 'react';
import ViewTrackerProvider from './ViewTrackerProvider';
import ViewTracker from './ViewTracker';

const Section = ({ id }: { id: string }) => (
  <ViewTracker id={id}>
    <div style={{ height: '300px' }}>This is section {id}</div>
  </ViewTracker>
);

const App = () => {
  return (
    <ViewTrackerProvider>
      <Section id="section-1" />
      <Section id="section-2" />
      <Section id="section-3" />
    </ViewTrackerProvider>
  );
};

export default App;
```

`ViewTrackerProvider`로 애플리케이션을 감싸고, `ViewTracker` 컴포넌트를 통해 각 섹션이 뷰포트에 들어올 때마다 섹션 ID가 기록됩니다.

## API Reference

### `useViewTracker` 훅

이 훅은 `ViewTrackerProvider` 내부에서 사용되어야 하며, 현재 화면에 보이는 섹션을 추적하는 기능을 제공합니다.

| 반환값           | 타입                   | 설명                                     |
| ---------------- | ---------------------- | ---------------------------------------- |
| `viewSection`    | `string`               | 현재 뷰포트에 보이는 섹션의 ID           |
| `setViewSection` | `(id: string) => void` | 섹션이 보일 때 호출되어 해당 섹션을 기록 |

### `ViewTrackerProvider` 컴포넌트

애플리케이션 내에서 뷰포트 트래킹을 사용할 수 있도록 하는 프로바이더입니다. `useViewTracker` 훅과 함께 사용됩니다.

| 매개변수   | 타입              | 설명                                 | 필수 여부 |
| ---------- | ----------------- | ------------------------------------ | --------- |
| `children` | `React.ReactNode` | 트래킹할 섹션을 포함한 자식 컴포넌트 | O         |

### `ViewTracker` 컴포넌트

해당 섹션이 뷰포트에 들어올 때 섹션 ID를 기록하고, 섹션의 끝까지 트래킹합니다.

| 매개변수   | 타입                  | 설명                      | 필수 여부 |
| ---------- | --------------------- | ------------------------- | --------- |
| `id`       | `string`              | 추적할 섹션의 고유 ID     | O         |
| `children` | `React.ReactNode`     | 섹션의 콘텐츠             | O         |
| `top`      | `IntersectionOptions` | 상단에 대한 인터섹션 옵션 | X         |
| `bottom`   | `IntersectionOptions` | 하단에 대한 인터섹션 옵션 | X         |

---
