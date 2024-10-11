import React from 'react';
import { useInView } from 'react-intersection-observer';

import useViewTracker from './useViewTracker';

export const MockComponent = () => <div>Mock Component</div>;

export const ResultComponent = () => {
  const { viewSection } = useViewTracker();
  return <p data-testid="viewSection">{viewSection}</p>;
};

export const useInViewImplementation = () => {
  (useInView as jest.Mock).mockImplementation(() => ({
    ref: jest.fn(),
    inView: false,
  }));
};

export const mockInViewSequence = (views: { top: boolean; bottom: boolean }[]) => {
  const mockFn = useInView as jest.Mock;

  views.forEach((view) => {
    (['top', 'bottom'] as const).forEach((position) => {
      mockFn.mockReturnValueOnce({
        ref: jest.fn(),
        inView: view[position],
      });
    });
  });
};
