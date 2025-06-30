import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => (
  <label style={{ marginRight: 8 }}>
    {label}
    <input
      type="color"
      value={color}
      onChange={e => onChange(e.target.value)}
      style={{ marginLeft: 4 }}
    />
  </label>
);

export default ColorPicker;
