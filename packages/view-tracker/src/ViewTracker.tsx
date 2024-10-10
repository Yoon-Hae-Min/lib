import React, { useEffect } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import useViewTracker from './useViewTracker';

interface BoundaryInViewProps {
  children: React.ReactNode;
  id: string;
  top: IntersectionOptions;
  bottom: IntersectionOptions;
}

const ViewTracker = ({ children, id, top, bottom }: BoundaryInViewProps) => {
  const { setViewSection } = useViewTracker();

  const { ref: topRef, inView: isTopInView } = useInView(top);

  const { ref: bottomRef, inView: isBottomInView } = useInView(bottom);

  useEffect(() => {
    if (isTopInView) {
      setViewSection(id);
    }
  }, [id, , isTopInView, setViewSection]);

  useEffect(() => {
    if (isBottomInView) {
      setViewSection(id);
    }
  }, [id, isBottomInView, setViewSection]);

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        scrollMarginTop: '7rem',
      }}
      ref={topRef}
    >
      {children}
      <div
        ref={bottomRef}
        style={{
          position: 'absolute',
          bottom: 0,
          height: '1px',
          width: '100%',
        }}
      />
    </section>
  );
};

export default ViewTracker;
