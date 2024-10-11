import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { MockComponent, mockInViewSequence, ResultComponent, useInViewImplementation } from './test-utils';
import ViewTracker from './ViewTracker';
import ViewTrackerProvider from './ViewTrackerProvider';
jest.mock('react-intersection-observer');

describe('ViewTracker and ViewTrackerProvider', () => {
  useInViewImplementation();
  // 함수 모킹

  it('첫번째 섹션의 부분이 화면에 보였을때', () => {
    mockInViewSequence([
      {
        top: true,
        bottom: false,
      },
      {
        top: false,
        bottom: false,
      },
    ]);

    render(
      <ViewTrackerProvider>
        <ViewTracker id="section1">
          <MockComponent />
        </ViewTracker>
        <ViewTracker id="section2">
          <MockComponent />
        </ViewTracker>
        <ResultComponent />
      </ViewTrackerProvider>,
    );

    expect(screen.getByTestId('viewSection')).toHaveTextContent('section1');
  });

  it('첫번째 섹션의 부분 하단이 화면에 보였을때', () => {
    mockInViewSequence([
      {
        top: false,
        bottom: true,
      },
      {
        top: false,
        bottom: false,
      },
    ]);

    render(
      <ViewTrackerProvider>
        <ViewTracker id="section1">
          <MockComponent />
        </ViewTracker>
        <ViewTracker id="section2">
          <MockComponent />
        </ViewTracker>
        <ResultComponent />
      </ViewTrackerProvider>,
    );

    expect(screen.getByTestId('viewSection')).toHaveTextContent('section1');
  });
  it('두번쨰 섹션의 부분 상단이 화면에 보였을때', () => {
    mockInViewSequence([
      {
        top: false,
        bottom: false,
      },
      {
        top: true,
        bottom: false,
      },
    ]);

    render(
      <ViewTrackerProvider>
        <ViewTracker id="section1">
          <MockComponent />
        </ViewTracker>
        <ViewTracker id="section2">
          <MockComponent />
        </ViewTracker>
        <ResultComponent />
      </ViewTrackerProvider>,
    );

    expect(screen.getByTestId('viewSection')).toHaveTextContent('section2');
  });
  it('두번쨰 섹션의 부분 하단이 화면에 보였을때', () => {
    mockInViewSequence([
      {
        top: false,
        bottom: false,
      },
      {
        top: false,
        bottom: true,
      },
    ]);

    render(
      <ViewTrackerProvider>
        <ViewTracker id="section1">
          <MockComponent />
        </ViewTracker>
        <ViewTracker id="section2">
          <MockComponent />
        </ViewTracker>
        <ResultComponent />
      </ViewTrackerProvider>,
    );

    expect(screen.getByTestId('viewSection')).toHaveTextContent('section2');
  });
});
