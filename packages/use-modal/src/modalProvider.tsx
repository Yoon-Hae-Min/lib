import React, { createContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { isArrEmpty } from './utils';

interface ModalElement {
  id: string;
  element: React.FC;
}

export const ModalContext = createContext<{
  modalElements: ModalElement[];
  setModalElements: React.Dispatch<React.SetStateAction<ModalElement[]>>;
}>({
  modalElements: [],
  setModalElements: () => {},
});

interface ModalProvider {
  children: React.ReactNode;
  Overlay?: React.FC;
}

const ModalProvider = ({ children, Overlay }: ModalProvider) => {
  const [modalElements, setModalElements] = useState<ModalElement[]>([]);

  const popModal = () =>
    setModalElements((pre) => {
      return pre.slice(0, pre.length - 1);
    });

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalElements.length > 0) {
        popModal();
        if (isArrEmpty(modalElements)) document.body.style.overflow = 'unset';
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [modalElements]);

  return (
    <>
      <ModalContext.Provider value={{ modalElements, setModalElements }}>
        {children}
        {createPortal(
          <div id="modals">
            {modalElements.length > 0 && Overlay && (
              <div id="modal-overlay" onClick={popModal}>
                <Overlay />
              </div>
            )}
            {modalElements.map(({ id, element }) => {
              return <Component key={id} component={element} />;
            })}
          </div>,
          document.body,
        )}
      </ModalContext.Provider>
    </>
  );
};

const Component = ({ component, ...rest }: { component: React.FC }) => {
  return component({ ...rest });
};

export default ModalProvider;
