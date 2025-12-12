# @yoonhaemin-lib/use-modal

> React에서 모달을 쉽게 관리할 수 있는 Hook

## Features

- ✅ **간단한 API** - 선언적이고 직관적인 모달 관리
- ✅ **ESC 키 지원** - ESC 키로 모달 닫기
- ✅ **중첩 모달** - 여러 모달을 동시에 관리
- ✅ **스크롤 잠금** - 모달 열림 시 배경 스크롤 방지
- ✅ **커스텀 오버레이** - 오버레이 스타일 커스터마이징

## Installation

```bash
npm install @yoonhaemin-lib/use-modal
```

```bash
yarn add @yoonhaemin-lib/use-modal
```

```bash
pnpm add @yoonhaemin-lib/use-modal
```

## Quick Start

```tsx
import { ModalProvider, useModal } from '@yoonhaemin-lib/use-modal';

function App() {
  return (
    <ModalProvider>
      <MyComponent />
    </ModalProvider>
  );
}

function MyComponent() {
  const { openModal, closeModal } = useModal(() => (
    <div>
      <h2>모달 제목</h2>
      <p>모달 내용</p>
      <button onClick={closeModal}>닫기</button>
    </div>
  ));

  return <button onClick={openModal}>모달 열기</button>;
}
```

## Usage

### 기본 사용법

`ModalProvider`로 앱을 감싸고, `useModal` 훅을 사용하여 모달을 제어합니다.

```tsx
import { ModalProvider, useModal } from '@yoonhaemin-lib/use-modal';

function App() {
  return (
    <ModalProvider>
      <Example />
    </ModalProvider>
  );
}

function Example() {
  const { openModal, closeModal, isOpen } = useModal(() => {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>알림</h2>
        <p>모달이 열렸습니다!</p>
        <button onClick={closeModal}>닫기</button>
      </div>
    );
  });

  return (
    <div>
      <button onClick={openModal}>모달 열기</button>
      <p>모달 상태: {isOpen ? '열림' : '닫힘'}</p>
    </div>
  );
}
```

### 커스텀 오버레이

`ModalProvider`에 커스텀 `Overlay` 컴포넌트를 전달하여 오버레이를 커스터마이징할 수 있습니다.

```tsx
import { ModalProvider, useModal } from '@yoonhaemin-lib/use-modal';

function CustomOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

function App() {
  return (
    <ModalProvider Overlay={CustomOverlay}>
      <Example />
    </ModalProvider>
  );
}
```

### 중첩 모달

여러 모달을 순차적으로 열 수 있습니다.

```tsx
import { useModal } from '@yoonhaemin-lib/use-modal';

function NestedModalExample() {
  const { openModal: openFirst, closeModal: closeFirst } = useModal(() => <FirstModal />);

  const { openModal: openSecond, closeModal: closeSecond } = useModal(() => <SecondModal />);

  function FirstModal() {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>첫 번째 모달</h2>
        <button onClick={openSecond}>두 번째 모달 열기</button>
        <button onClick={closeFirst}>닫기</button>
      </div>
    );
  }

  function SecondModal() {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>두 번째 모달</h2>
        <p>첫 번째 모달 위에 열립니다</p>
        <button onClick={closeSecond}>닫기</button>
      </div>
    );
  }

  return <button onClick={openFirst}>모달 열기</button>;
}
```

## API Reference

### `useModal(component)`

#### 매개변수

| 매개변수    | 타입                    | 설명                              |
| ----------- | ----------------------- | --------------------------------- |
| `component` | `() => React.ReactNode` | 모달로 표시할 React 컴포넌트 함수 |

#### 반환값

| 반환값       | 타입         | 설명                    |
| ------------ | ------------ | ----------------------- |
| `isOpen`     | `boolean`    | 모달이 열려 있는지 여부 |
| `openModal`  | `() => void` | 모달을 여는 함수        |
| `closeModal` | `() => void` | 모달을 닫는 함수        |

### `ModalProvider`

#### Props

| Props      | 타입                                           | 필수 | 설명                                    |
| ---------- | ---------------------------------------------- | ---- | --------------------------------------- |
| `children` | `React.ReactNode`                              | ✅   | 모달 프로바이더 내부에 위치한 자식 노드 |
| `Overlay`  | `React.ComponentType<{ children: ReactNode }>` | ❌   | 커스텀 오버레이 컴포넌트                |

## 기능 상세

### ESC 키로 모달 닫기

모달이 열려 있을 때 ESC 키를 누르면 자동으로 가장 최근에 열린 모달이 닫힙니다.

### 배경 스크롤 방지

모달이 열리면 자동으로 배경 페이지의 스크롤이 방지됩니다. 모달이 모두 닫히면 스크롤이 다시 활성화됩니다.

### 중첩 모달 관리

여러 모달을 동시에 열 수 있으며, 각 모달은 독립적으로 관리됩니다. ESC 키를 누르면 가장 최근에 열린 모달부터 순서대로 닫힙니다.

## Examples

실제 동작하는 예제는 [CodeSandbox](https://codesandbox.io/p/sandbox/usemodal-ktv8ws)에서 확인할 수 있습니다.

## License

MIT © [Yoon Hae Min](https://github.com/Yoon-Hae-Min)
