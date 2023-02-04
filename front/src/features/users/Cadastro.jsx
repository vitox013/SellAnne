import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavDash from "../../components/NavDash";
import { useAddNewUserMutation } from "./newUserApiSlice";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const Cadastro = () => {
    const [addNewUser, { isLoading, isSuccess }] = useAddNewUserMutation();

    const navigate = useNavigate();

    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUsername("");
            setPassword("");
            navigate("/login");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        setErrMsg("");
    }, [email, password, username]);

    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);
    const onEmailChanged = (e) => setEmail(e.target.value);

    const canSave =
        [validUsername, validPassword, email].every(Boolean) && !isLoading;

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        try {
            if (canSave) {
                await addNewUser({ username, password, email }).unwrap();
            }
        } catch (err) {
            if (!err.status) {
                setErrMsg("Sem resposta do servidor");
            } else if (err.status === 409) {
                setErrMsg("Já existe um usuário cadastrado com esse e-mail");
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    };

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    return (
        <>
            <NavDash info="" />
            <Container className="d-flex flex-column col-md-6 col-lg-5 col-xxl-3 mt-5">
                <Card className="shadow mt-5">
                    <Card.Body>
                        <p ref={errRef} className={errClass}>
                            {errMsg}
                        </p>
                        <Form className="fs-5" onSubmit={onSaveUserClicked}>
                            <Form.Group className="mb-3" controlId="username">
                                <h3 className="mb-4 fw-bold">Crie uma conta</h3>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    className="fs-5"
                                    type="text"
                                    autoComplete="off"
                                    value={username}
                                    onChange={onUsernameChanged}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    className="fs-5"
                                    type="email"
                                    value={email}
                                    onChange={onEmailChanged}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    className="fs-5"
                                    type="password"
                                    value={password}
                                    onChange={onPasswordChanged}
                                />
                            </Form.Group>
                            <Button
                                className="fs-5 w-100"
                                variant="primary"
                                type="submit"
                            >
                                Cadastre-se
                            </Button>
                        </Form>
                        <p className="mt-3 text-center">
                            Já tem uma conta? <Link to="/login">Login</Link>
                        </p>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Cadastro;
