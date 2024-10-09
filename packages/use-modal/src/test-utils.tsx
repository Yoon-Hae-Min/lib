import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import React from 'react';

import ModalProvider from './modalProvider';
import useModal from './useModal';

const TestModalComponent = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div>
      Test Modal<button onClick={closeModal}>closeModal</button>
    </div>
  );
};

export const TestComponent = () => {
  const { closeModal, openModal } = useModal(() => <TestModalComponent closeModal={closeModal} />);

  return (
    <div>
      <button onClick={openModal}>open</button>
      <button onClick={closeModal}>close</button>
    </div>
  );
};

export const RecursiveModalComponent = ({
  limit,
  closeModal: closeCurrentModal,
}: {
  limit: number;
  closeModal?: () => void;
}) => {
  const { openModal, closeModal } = useModal(
    () => limit > 0 && <RecursiveModalComponent limit={limit - 1} closeModal={closeModal} />,
  );

  if (limit <= 0) return;
  return (
    <div>
      <h3>Modal Level {limit}</h3>
      {limit - 1 > 0 && <button onClick={openModal}>Open {limit - 1}</button>}
      {closeCurrentModal && <button onClick={closeCurrentModal}>Close {limit}</button>}
    </div>
  );
};

export const renderWithModalProvider = (children: React.ReactNode): RenderResult => {
  return render(<ModalProvider>{children}</ModalProvider>);
};

export const renderWithOverlayModalProvider = (children: React.ReactNode): RenderResult => {
  return render(<ModalProvider Overlay={() => <div data-testid="overlay"></div>}>{children}</ModalProvider>);
};
