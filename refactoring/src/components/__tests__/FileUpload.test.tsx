import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  it('calls onFileLoaded with file content', async () => {
    const onFileLoaded = jest.fn();
    const { getByLabelText } = render(<FileUpload onFileLoaded={onFileLoaded} />);
    const file = new File(['A:1,2;B:2,3;'], 'test.ivenn', { type: 'text/plain' });
    const input = getByLabelText('.ivenn laden:') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);
    // FileReader ist asynchron, daher muss gewartet werden
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(onFileLoaded).toHaveBeenCalledWith('A:1,2;B:2,3;');
  });
});
