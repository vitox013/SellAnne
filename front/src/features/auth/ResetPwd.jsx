import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Container, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavDash from "../../components/NavBar";
import { useResetPwdMutation } from "./authApiSlice";

const ResetPwd = () => {
    const [resetPwd, { isSuccess, isLoading, error }] = useResetPwdMutation();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [msg, setMsg] = useState("");
    const [equal, setEqual] = useState(false);
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState("bx bxs-show");

    const { id: userId, token } = useParams();

    useEffect(() => {
        setValidPassword(password.length >= 8 && password.length <= 16);
        if (password && confirmPassword)
            setEqual(password.trim() === confirmPassword.trim());
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrMsg("");
    }, [password]);

    const onPasswordChanged = (e) => setPassword(e.target.value);
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
            await resetPwd({
                userId,
                token,
                password: password.trim(),
            }).unwrap();
        }
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 5000);
            return () => clearTimeout(timer);
        } else if (error) {
            setErrMsg(error?.data?.message);
        }
    }, [isSuccess, error, navigate]);

    return (
        <>
            <NavDash info="cadastro" />
            <Container className="d-flex flex-column col-md-6 col-lg-5 col-xxl-3 mt-5">
                <Card className="shadow mt-5">
                    <Card.Body>
                        {errMsg && (
                            <p className="alert alert-danger text-center">
                                {errMsg}
                            </p>
                        )}
                        {!isSuccess ? (
                            <Form className="fs-5" onSubmit={onSaveUserClicked}>
                                <h3 className="mb-5">Resete sua senha</h3>
                                <Form.Group
                                    className="mb-3"
                                    controlId="password"
                                >
                                    <Form.Label>Senha</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            maxLength="16"
                                            type={type}
                                            value={password}
                                            onChange={onPasswordChanged}
                                            className={
                                                equal &&
                                                validPassword &&
                                                "is-valid"
                                            }
                                        />
                                        <InputGroup.Text onClick={handleShow}>
                                            <i
                                                className={`${icon} fs-3 pointer`}
                                            ></i>
                                        </InputGroup.Text>
                                    </InputGroup>
                                    <Form.Text>
                                        Mínimo de 8 e máximo de 16 caracteres!
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="confirmPwd"
                                >
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
                                                (equal
                                                    ? "is-valid"
                                                    : "is-invalid")
                                            }
                                        />
                                        <InputGroup.Text onClick={handleShow}>
                                            <i
                                                className={`${icon} fs-3 pointer`}
                                            ></i>
                                        </InputGroup.Text>
                                    </InputGroup>
                                    {confirmPassword && !equal && (
                                        <Form.Text className="danger alert-danger">
                                            Senhas não coincidem!
                                        </Form.Text>
                                    )}
                                </Form.Group>
                                {msg && (
                                    <p className="alert alert-success">{msg}</p>
                                )}
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
                        ) : (
                            <div className="text-center">
                                <h4>Senha alterada com sucesso!</h4>
                                <i className="bx bx-check fs-1 text-success "></i>
                                <p>
                                    Você será direcionado para a página de login
                                    em 5 segundos
                                </p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ResetPwd;
