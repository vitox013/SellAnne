import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

const DeleteComp = ({errMsg, deletar, option}) => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            <Button variant="" onClick={handleShow}>
                <i className="bx bx-trash fs-2 text-dark"></i>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tem certeza?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ao confirmar, {option} será excluído do sistema.
                    {errMsg && <p className="alert alert-danger">{errMsg}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deletar}>
                        Excluir
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteComp;
