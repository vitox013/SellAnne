import React from "react";
import { Modal, Button } from "react-bootstrap";
import Loading from "../utils/Loading";

const DeleteModal = ({ showExcluir, handleClose, onDeleteClick, errMsg, isLoading }) => {
    return (
        <Modal show={showExcluir} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tem certeza?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading && <Loading/>}
                Ao confirmar, o fornecedor será excluído.
                {errMsg && <p className="alert alert-danger">{errMsg}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onDeleteClick} disabled={isLoading}>
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
