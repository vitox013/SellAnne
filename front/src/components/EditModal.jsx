import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ errMsg, handleClose, showEdit, onEditClick }) => {
    return (
        <Modal show={showEdit} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edite seu fornecedor!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            <strong>Nome</strong>
                        </Form.Label>
                        <Form.Control className="w-50"></Form.Control>
                    </Form.Group>
                </Form>
                {errMsg && <p className="alert alert-danger">{errMsg}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onEditClick}>
                    Excluir
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
