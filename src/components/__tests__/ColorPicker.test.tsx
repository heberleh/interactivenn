import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColorPicker from '../ColorPicker';

describe('ColorPicker', () => {
  it('renders with label and color', () => {
    const { getByLabelText } = render(
      <ColorPicker color="#123456" label="A" onChange={() => {}} />
    );
    const input = getByLabelText('A') as HTMLInputElement;
    expect(input.value).toBe('#123456');
  });

  it('calls onChange when color changes', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <ColorPicker color="#abcdef" label="B" onChange={onChange} />
    );
    const input = getByLabelText('B') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '#000000' } });
    expect(onChange).toHaveBeenCalledWith('#000000');
  });
});
