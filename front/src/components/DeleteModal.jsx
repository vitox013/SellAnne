import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ( {showExcluir, handleClose, onDeleteClick, errMsg}) => {

    
    return (
        <Modal show={showExcluir} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tem certeza?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Ao confirmar, o fornecedor será excluído.
                {errMsg && <p className="alert alert-danger">{errMsg}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onDeleteClick}>
                    Excluir
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
