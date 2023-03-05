import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSendEmailForgotPwdMutation } from "./authApiSlice";
import { setMsg } from "../infoMsg/msgSlice";

const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const ModalReset = ({ handleClose, show }) => {
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState();
    const [errMsg, setErrMsg] = useState("");

    const dispatch = useDispatch();

    const [sendEmailResetPwd, { isSuccess, error }] =
        useSendEmailForgotPwdMutation();

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
        setErrMsg("")
    }, [email]);

    useEffect(() => {
        setEmail("");
        setValidEmail(false);
        setErrMsg("");
    }, [handleClose]);

    const onSendEmail = async () => {
        if (validEmail) {
            await sendEmailResetPwd({ email });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setEmail("");
            setValidEmail(false);
            dispatch(setMsg("Email enviado com sucesso!"));
            handleClose();
        } else if (error) {
            setErrMsg(error?.data?.message);
            // dispatch(setMsg(error?.data?.message));
        }
    }, [isSuccess, error]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Resete sua senha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Entre com seu email cadastrado</p>
                {errMsg && (
                    <p className="alert text-danger alert-danger text-center">
                        {errMsg}
                    </p>
                )}
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
                    onClick={onSendEmail}
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
