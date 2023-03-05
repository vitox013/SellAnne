import React, { useState, useEffect } from "react";
import { Modal, Form, InputGroup, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useUpdateUserMutation } from "./userApiSlice";
import { setMsg } from "../infoMsg/msgSlice";

const ModalChangePwd = ({ show, handleClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId, email, currentUser: userName } = useAuth();

    const [atualPassword, setAtualPassword] = useState("");
    const [errPwd, setErrPwd] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [equal, setEqual] = useState(false);
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState("bx bxs-show");

    const [updatePassword, { isSuccess, error, isLoading }] =
        useUpdateUserMutation();

    useEffect(() => {
        setErrMsg("");
        setEqual(newPassword === confirmPassword);
        setValidPassword(newPassword.length >= 8 && newPassword.length <= 16);
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        setErrPwd(false);
        setErrMsg("");
    }, [atualPassword]);

    useEffect(() => {
        setAtualPassword("");
        setConfirmPassword("");
        setNewPassword("");
    }, [handleClose]);

    const onNewPasswordChanged = (e) => setNewPassword(e.target.value);
    const onAtualPasswordChanged = (e) => setAtualPassword(e.target.value);
    const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value);
    const handleShow = () => {
        type === "password"
            ? (setType("text"), setIcon("bx bxs-low-vision"))
            : (setType("password"), setIcon("bx bxs-show"));
    };

    const canSave = equal && validPassword && !isLoading;

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await updatePassword({
                userId,
                username: userName,
                email,
                password: atualPassword.trim(),
                newPassword: newPassword.trim(),
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            handleClose();
            setAtualPassword("");
            setConfirmPassword("");
            setNewPassword("");
            dispatch(setMsg("Senha atualizada com sucesso!"));
        } else if (error) {
            setErrMsg(error?.data?.message);
            error?.data?.message == "Senha inválida" && setErrPwd(true);
        }
    }, [isSuccess, error]);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Altere sua senha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errMsg && (
                        <p className="alert text-center alert-danger">
                            {errMsg}
                        </p>
                    )}
                    <Form className="fs-5" onSubmit={onSaveUserClicked}>
                        <Form.Group className="mb-3" controlId="atualPassword">
                            <Form.Label>Senha Atual</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    maxLength="16"
                                    type={type}
                                    value={atualPassword}
                                    onChange={onAtualPasswordChanged}
                                    className={
                                        errPwd || (errMsg && "is-invalid")
                                    }
                                />

                                <InputGroup.Text onClick={handleShow}>
                                    <i className={`${icon} fs-3 pointer`}></i>
                                </InputGroup.Text>
                            </InputGroup>
                            {errPwd && (
                                <Form.Text className="text-danger">
                                    {error?.data?.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Senha</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    maxLength="16"
                                    type={type}
                                    value={newPassword}
                                    onChange={onNewPasswordChanged}
                                    className={
                                        equal && validPassword && "is-valid"
                                    }
                                />
                                <InputGroup.Text onClick={handleShow}>
                                    <i className={`${icon} fs-3 pointer`}></i>
                                </InputGroup.Text>
                            </InputGroup>
                            <Form.Text>
                                Mínimo de 8 e máximo de 16 caracteres!
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmPwd">
                            <Form.Label>Confirme sua senha</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    maxLength="16"
                                    type={type}
                                    value={confirmPassword}
                                    onChange={onConfirmPasswordChanged}
                                    className={
                                        confirmPassword &&
                                        validPassword &&
                                        (equal ? "is-valid" : "is-invalid")
                                    }
                                />
                                <InputGroup.Text onClick={handleShow}>
                                    <i className={`${icon} fs-3 pointer`}></i>
                                </InputGroup.Text>
                            </InputGroup>
                            {confirmPassword && !equal && (
                                <Form.Text className="danger alert-danger">
                                    Senhas não coincidem!
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Button
                            className="fs-5 w-100"
                            variant="primary"
                            type="submit"
                            disabled={!canSave}
                            onClick={onSaveUserClicked}
                        >
                            Resetar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalChangePwd;
