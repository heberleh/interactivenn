
import React from 'react';
import './RegionModal.css';

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  regionId: string;
  elements: string[];
  setNamesMapping: Record<string, string>;
}

const RegionModal: React.FC<RegionModalProps> = ({ isOpen, onClose, regionId, elements, setNamesMapping }) => {
  if (!isOpen) {
    return null;
  }

  const getRegionName = () => {
    if (!regionId) return '';
    const regionParts = regionId.split('_');
    const regionName = regionParts[0].split('').map(char => setNamesMapping[char] || char.toUpperCase()).join(' ∩ ');
    if (regionParts.length > 1 && regionParts[1] === 'only') {
        return `Elements only in ${regionName}`;
    }
    return `Elements in ${regionName}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getRegionName()}</h3>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          {elements.length > 0 ? (
            <ul>
              {elements.map((el, index) => (
                <li key={index}>{el}</li>
              ))}
            </ul>
          ) : (
            <p>No elements in this region.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
