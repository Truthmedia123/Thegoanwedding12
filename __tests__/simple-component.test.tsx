import React from 'react';
import { render, screen } from '@testing-library/react';

const TestComponent = () => {
  return React.createElement('div', null, 'Hello World');
};

describe('Simple Component Test', () => {
  it('should render correctly', () => {
    render(React.createElement(TestComponent));
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});