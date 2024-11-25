import React from "react";

interface DeleteConfirmationModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    onClose,
    onConfirm,
}) => (
    <div className="modal-overlay">
        <div className="modal-container">
            <div className="modal-header">
                <h4>Confirmar Exclusão</h4>
                <button onClick={onClose} className="close-button">
                    &times;
                </button>
            </div>
            <div className="modal-content">
                <p>Tem certeza de que deseja excluir esta conta?</p>
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                </button>
                <button className="btn btn-danger" onClick={onConfirm}>
                    Confirmar
                </button>
            </div>
        </div>
    </div>
);

export default DeleteConfirmationModal;
