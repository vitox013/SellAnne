import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const ModalReset = ({ handleClose, show }) => {
    const [email, setEmail] = useState("");

    const [validEmail, setValidEmail] = useState();

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setEmail("");
        setValidEmail(false);
    }, [handleClose]);

    const onEditClick = async () => {
        e.preventDefault;
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Resete sua senha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Entre com seu email cadastrado</p>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            <strong>Email</strong>
                        </Form.Label>

                        <Form.Control
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="success"
                    onClick={onEditClick}
                    disabled={!validEmail}
                >
                    Enviar email
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalReset;
