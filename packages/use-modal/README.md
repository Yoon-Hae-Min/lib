# useModal

## 개요

Modal관리를 쉽게 해주는 hook입니다.

- esc키를 누르면 모달이 닫힙니다.
- 중첩 모달에 대한 지원
- 단일 overlay 지원
- 모달이 열려있는 동안 스크롤 막기.

---

## 기본 사용법

`useModal` 훅과 `ModalProvider`를 사용하여 모달 컴포넌트를 열고 닫는 기능을 구현할 수 있습니다.

### 예시 코드

#### 기본 사용 방법

```tsx
import { ModalProvider } from '@gomterview/useModal';

function App() {
  return (
    // Provide the client to your App

    <ModalProvider>
      <Example />
    </ModalProvider>
  );
}

function Example() {
  const { openModal, closeModal } = useModal(() => {
    return (
      <div>
        <span>Modal Content</span>
        <button onClick={closeModal}>Close Modal</button>
      </div>
    );
  });

  return <button onClick={openModal}>Open Modal</button>;
}
```

버튼을 클릭하면 모달이 열리고, 모달 안에서 닫기 버튼을 클릭하면 모달이 닫힙니다.

#### 커스텀 오버레이 사용 방법

```tsx
import { ModalProvider } from '@gomterview/useModal';

function App() {
  return (
    // Provide the client to your App
    <ModalProvider Overlay={CustomOverlay}>
      <Example />
    </ModalProvider>
  );
}

function CustomOverlay({ children }) {
  return <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>{children}</div>;
}

function Example() {
  const { openModal, closeModal } = useModal(() => {
    return (
      <div>
        <span>Modal Content</span>
        <button onClick={closeModal}>Close Modal</button>
      </div>
    );
  });

  return <button onClick={openModal}>Open Modal</button>;
}
```

---

## API Reference

### `useModal` 매개변수

| 매개변수    | 타입       | 설명                         | 필수 여부 |
| ----------- | ---------- | ---------------------------- | --------- |
| `component` | `React.FC` | 모달로 표시할 React 컴포넌트 | O         |

### `useModal` 반환값

| 반환값       | 타입         | 설명                    |
| ------------ | ------------ | ----------------------- |
| `isOpen`     | `boolean`    | 모달이 열려 있는지 여부 |
| `openModal`  | `() => void` | 모달을 여는 함수        |
| `closeModal` | `() => void` | 모달을 닫는 함수        |

---

### `ModalProvider` 매개변수

| 매개변수   | 타입              | 설명                                    | 필수 여부 |
| ---------- | ----------------- | --------------------------------------- | --------- |
| `children` | `React.ReactNode` | 모달 프로바이더 내부에 위치한 자식 노드 | O         |
| `Overlay`  | `React.FC`        | 모달이 열릴 때 표시될 오버레이 컴포넌트 | X         |

## 실습하기

해당 기능을 실습할 수 있는 링크는 [여기](https://codesandbox.io/p/sandbox/usemodal-ktv8ws)를 클릭하여 확인할 수 있습니다.
