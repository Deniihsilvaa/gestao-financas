import React from 'react';
import './Modal.css'; // Adicione estilos para o modal

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="close-button">
                        &times;
                    </button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
                <div className="modal-footer">
                <i className="bi bi-database-fill"></i>
                </div>
            </div>
        </div>
    );
};

export default Modal;
