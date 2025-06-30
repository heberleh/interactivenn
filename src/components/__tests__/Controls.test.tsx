import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Controls from '../Controls';

describe('Controls Component', () => {
  const defaultProps = {
    onAddSet: jest.fn(),
    onRemoveSet: jest.fn(),
    onReset: jest.fn(),
    colors: { A: '#ff0000', B: '#00ff00' },
    onColorChange: jest.fn(),
    onFileLoaded: jest.fn(),
    sets: { A: ['1', '2'], B: ['2', '3'] },
    onSetChange: jest.fn(),
    onExportSVG: jest.fn(),
    onExportPNG: jest.fn(),
    onExportIVenn: jest.fn(),
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    canUndo: true,
    canRedo: false,
    opacity: 0.7,
    onOpacityChange: jest.fn(),
    fontSize: 20,
    onFontSizeChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all control sections', () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByText('Diagramm-Steuerung')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Darstellung')).toBeInTheDocument();
    expect(screen.getByText('Sets')).toBeInTheDocument();
    expect(screen.getByText('Farben')).toBeInTheDocument();
    expect(screen.getByText('Datei')).toBeInTheDocument();
  });

  it('should call onAddSet when Add Set button is clicked', () => {
    render(<Controls {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Set hinzufügen'));
    expect(defaultProps.onAddSet).toHaveBeenCalledTimes(1);
  });

  it('should call onRemoveSet when Remove Set button is clicked', () => {
    render(<Controls {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Set entfernen'));
    expect(defaultProps.onRemoveSet).toHaveBeenCalledTimes(1);
  });

  it('should call onReset when Reset button is clicked', () => {
    render(<Controls {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Zurücksetzen'));
    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('should handle undo/redo button states correctly', () => {
    render(<Controls {...defaultProps} />);
    
    const undoButton = screen.getByText('Undo');
    const redoButton = screen.getByText('Redo');
    
    expect(undoButton).not.toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  it('should call export functions when export buttons are clicked', () => {
    render(<Controls {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Export SVG'));
    expect(defaultProps.onExportSVG).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Export PNG'));
    expect(defaultProps.onExportPNG).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Export .ivenn'));
    expect(defaultProps.onExportIVenn).toHaveBeenCalledTimes(1);
  });

  it('should handle opacity slider changes', () => {
    render(<Controls {...defaultProps} />);
    
    const opacitySlider = screen.getByDisplayValue('0.7');
    fireEvent.change(opacitySlider, { target: { value: '0.9' } });
    
    expect(defaultProps.onOpacityChange).toHaveBeenCalledWith(0.9);
  });

  it('should handle font size slider changes', () => {
    render(<Controls {...defaultProps} />);
    
    const fontSizeSlider = screen.getByDisplayValue('20');
    fireEvent.change(fontSizeSlider, { target: { value: '24' } });
    
    expect(defaultProps.onFontSizeChange).toHaveBeenCalledWith(24);
  });

  it('should display current opacity and font size values', () => {
    render(<Controls {...defaultProps} />);
    
    expect(screen.getByText('0.7')).toBeInTheDocument();
    expect(screen.getByText('20px')).toBeInTheDocument();
  });

  it('should render SetInput for each set', () => {
    render(<Controls {...defaultProps} />);
    
    // Should render SetInput components for sets A and B
    expect(screen.getByDisplayValue('1,2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2,3')).toBeInTheDocument();
  });

  it('should render ColorPicker for each set', () => {
    render(<Controls {...defaultProps} />);
    
    // Should render color inputs for sets A and B
    const colorInputs = screen.getAllByDisplayValue(/#[0-9a-f]{6}/i);
    expect(colorInputs).toHaveLength(2);
  });
});
