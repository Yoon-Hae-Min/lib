import { useCallback, useContext, useId } from 'react';

import { ModalContext } from './modalProvider';
import { isArrEmpty } from './utils';

const disableBackground = () => {
  document.body.style.overflow = 'hidden';
  document.body.setAttribute('aria-hidden', 'true');
};

const useModal = (component: React.FC) => {
  const { modalElements, setModalElements } = useContext(ModalContext);
  const id = useId();
  const isOpen = modalElements.some((c) => c.id === id);

  const openModal = useCallback(() => {
    if (isOpen) return;
    setModalElements((pre) => [...pre, { id: id, element: component }]);
    disableBackground();
  }, [component, id, isOpen, setModalElements]);

  const closeModal = useCallback(() => {
    setModalElements((pre) => pre.filter((c) => c.id !== id));
    if (isArrEmpty(modalElements)) document.body.style.overflow = 'unset';
  }, [id, modalElements, setModalElements]);

  return { isOpen, openModal, closeModal };
};

export default useModal;
