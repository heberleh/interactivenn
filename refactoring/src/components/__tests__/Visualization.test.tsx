import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Visualization from '../Visualization';

describe('Visualization', () => {
  it('renders SVG and labels', () => {
    render(
      <Visualization
        sets={{ A: ['1', '2'], B: ['2', '3'] }}
        colors={{ A: '#ffcccc', B: '#ccccff' }}
        onRegionClick={() => {}}
      />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(document.querySelectorAll('ellipse').length).toBe(3);
  });

  it('calls onRegionClick when a region is clicked', () => {
    const onRegionClick = jest.fn();
    render(
      <Visualization
        sets={{ A: ['1', '2'], B: ['2', '3'] }}
        colors={{ A: '#ffcccc', B: '#ccccff' }}
        onRegionClick={onRegionClick}
      />
    );
    const ellipses = document.querySelectorAll('ellipse');
    fireEvent.click(ellipses[0]);
    expect(onRegionClick).toHaveBeenCalledWith('A');
  });
});
