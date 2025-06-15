import React from 'react';
import '../styles/Modal.css'; // Assume you have or will create this CSS file for modal styles

const FAQModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Frequently Asked Questions</h2>
        <p>This is the FAQ modal content.</p>
        <button onClick={onClose} className="modal-close-button">Close</button>
      </div>
    </div>
  );
};

export default FAQModal;
