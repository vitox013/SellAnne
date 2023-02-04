import React from "react";
import { Card, Container } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavDash from "../../components/NavDash";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { selectCurrentToken } from "./authSlice";
import { useSelector } from "react-redux/es/exports";
import useAuth from "../../hooks/useAuth";

const Login = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate("/dashboard");
        }
    }, []);

    const emailRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [persist, setPersist] = usePersist();

    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ email, password }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setEmail("");
            setPassword("");
            navigate("/dashboard");
        } catch (err) {
            if (!err.status) {
                setErrMsg("Sem resposta do servidor");
            } else if (err.status === 400) {
                setErrMsg("Email ou senha incorretos");
            } else if (err.status === 401) {
                setErrMsg("Email não cadastrado");
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    };

    const handleEmailInput = (e) => setEmail(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist((prev) => !prev);

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    if (isLoading) return <p>Loading</p>;

    return (
        <>
            <NavDash info="" />
            <Container className="d-flex flex-column col-md-6 col-lg-5 col-xxl-3 mt-5">
                <Card className="shadow mt-5">
                    <Card.Body>
                        <p
                            ref={errRef}
                            className={errClass}
                            aria-live="assertive"
                        >
                            {errMsg}
                        </p>
                        <Form className="fs-5" onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <h3 className="mb-4 fw-bold">
                                    Entre em sua conta
                                </h3>
                                <Form.Text className="text-muted"></Form.Text>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    className="fs-5"
                                    type="email"
                                    placeholder="Insira o email"
                                    ref={emailRef}
                                    value={email}
                                    onChange={handleEmailInput}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    className="fs-5"
                                    type="password"
                                    placeholder="Digite a senha"
                                    onChange={handlePwdInput}
                                    value={password}
                                    required
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicCheckbox"
                            >
                                <Form.Check
                                    type="checkbox"
                                    label="Manter login"
                                    id="persist"
                                    onChange={handleToggle}
                                    checked={persist}
                                />
                            </Form.Group>

                            <Button
                                className="fs-5 w-100"
                                variant="primary"
                                type="submit"
                            >
                                Entrar
                            </Button>
                        </Form>
                        <p className="mt-3 text-center">
                            Novo aqui? <Link to="/signup">Crie uma conta</Link>
                        </p>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Login;
