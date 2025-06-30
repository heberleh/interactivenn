import React from 'react';

interface FileUploadProps {
  onFileLoaded: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (typeof ev.target?.result === 'string') {
        onFileLoaded(ev.target.result);
      }
    };
    reader.readAsText(file);
  };
  return (
    <label style={{ marginLeft: 16 }}>
      .ivenn laden:
      <input type="file" accept=".ivenn" onChange={handleChange} />
    </label>
  );
};

export default FileUpload;
