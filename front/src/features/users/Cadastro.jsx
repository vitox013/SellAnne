import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavDash from "../../components/NavBar";
import { useAddNewUserMutation } from "./newUserApiSlice";
import Loading from "../../utils/Loading";

const USER_REGEX = /^[A-z\ ]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const Cadastro = () => {
    const [addNewUser, { isLoading, isSuccess, data, error }] =
        useAddNewUserMutation();

    const navigate = useNavigate();

    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [msg, setMsg] = useState("");

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
            setEmail("");
            setMsg(data?.message);
        } else if (error) {
            setErrMsg(error?.data?.message);
        }
    }, [isSuccess, navigate, error]);

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

        if (canSave) {
            await addNewUser({
                username: username.trim(),
                password,
                email: email.trim(),
            }).unwrap();
        }
    };

    return (
        <>
            <NavDash info="cadastro" />
            <Container className="d-flex flex-column col-md-6 col-lg-5 col-xxl-3 mt-5">
                <Card className="shadow mt-5">
                    <Card.Body>
                        {isLoading && <Loading />}
                        {errMsg && (
                            <p className="alert alert-danger text-center">
                                {errMsg}
                            </p>
                        )}
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
                            {msg && (
                                <p className="alert alert-success">{msg}</p>
                            )}
                            <Button
                                className="fs-5 w-100"
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
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
