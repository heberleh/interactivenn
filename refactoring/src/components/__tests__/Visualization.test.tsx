import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Visualization from '../Visualization';
import { loadAndCustomizeSVGTemplate } from '../../utils/svgTemplateLoader';

// Mock the SVG template loader
jest.mock('../../utils/svgTemplateLoader');
const mockLoadAndCustomizeSVGTemplate = loadAndCustomizeSVGTemplate as jest.MockedFunction<typeof loadAndCustomizeSVGTemplate>;

describe('Visualization', () => {
  const mockOnRegionClick = jest.fn();

  beforeEach(() => {
    mockLoadAndCustomizeSVGTemplate.mockClear();
    mockOnRegionClick.mockClear();
  });

  it('should render loading state initially', () => {
    mockLoadAndCustomizeSVGTemplate.mockImplementation(() => new Promise(() => {}));
    
    render(
      <Visualization 
        sets={{ A: ['1'], B: ['2'] }} 
        colors={{}} 
        onRegionClick={mockOnRegionClick} 
      />
    );

    expect(screen.getByText('Lade Diagramm ...')).toBeInTheDocument();
  });

  it('should render error for invalid set count', async () => {
    render(
      <Visualization 
        sets={{ A: ['1'] }} 
        colors={{}} 
        onRegionClick={mockOnRegionClick} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Bitte 2–6 Mengen eingeben.')).toBeInTheDocument();
    });
  });

  it('should load and render SVG template successfully', async () => {
    const mockSVG = '<svg><text id="a">Set A</text></svg>';
    mockLoadAndCustomizeSVGTemplate.mockResolvedValue(mockSVG);

    render(
      <Visualization 
        sets={{ A: ['1'], B: ['2'] }} 
        colors={{ A: '#red', B: '#blue' }} 
        onRegionClick={mockOnRegionClick} 
      />
    );

    await waitFor(() => {
      expect(mockLoadAndCustomizeSVGTemplate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Set A')).toBeInTheDocument();
    });
  });

  it('calls onRegionClick when a region is clicked', async () => {
    const mockSVG = '<svg><text id="abc">ABC</text></svg>';
    mockLoadAndCustomizeSVGTemplate.mockResolvedValue(mockSVG);

    render(
      <Visualization
        sets={{ A: ['1', '2'], B: ['2', '3'] }}
        colors={{ A: '#ffcccc', B: '#ccccff' }}
        onRegionClick={mockOnRegionClick}
      />
    );

    await waitFor(() => {
      const textElement = screen.getByText('ABC');
      fireEvent.click(textElement);
    });

    expect(mockOnRegionClick).toHaveBeenCalledWith('abc');
  });
});
