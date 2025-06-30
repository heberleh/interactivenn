import React from 'react';

interface SetInputProps {
  setName: string;
  values: string[];
  onChange: (setName: string, values: string[]) => void;
}

const SetInput: React.FC<SetInputProps> = ({ setName, values, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
    onChange(setName, lines);
  };
  return (
    <div style={{ marginBottom: 8 }}>
      <label>
        {setName}:<br />
        <textarea
          rows={2}
          style={{ width: 180 }}
          value={values.join('\n')}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default SetInput;
