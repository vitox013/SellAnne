import React from "react";
import { Card, Container } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavDash from "../../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useAuth from "../../hooks/useAuth";
import ModalReset from "./ModalReset";
import { setMsg } from "../infoMsg/msgSlice";

const Login = () => {
    const navigate = useNavigate();
    const { userId } = useAuth();

    useEffect(() => {
        if (userId) navigate("/dashboard");
    }, []);

    const emailRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [persist, setPersist] = usePersist();
    const [show, setShow] = useState(false);
    
    const dispatch = useDispatch();

    const [login, { isLoading, isSuccess, error }] = useLoginMutation();
    let message = useSelector((state) => state.infoMsg.msg);

    useEffect(() => {
        setErrMsg("");
    }, [email, password]);

    useEffect(() => {
        if (isSuccess) {
            setEmail("");
            setPassword("");
        } else if (error) {
            setErrMsg(error?.data?.message);
        }
    }, [isSuccess, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { accessToken } = await login({
                email: email.trim(),
                password: password.trim(),
            }).unwrap();
            dispatch(setCredentials({ accessToken }));
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    const handleEmailInput = (e) => setEmail(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist((prev) => !prev);

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const onEditClick = async () => {
        e.preventDefault;
    };

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
                            {message && (
                                <p className="alert alert-success text-center">{message}</p>
                            )}

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
                        <hr />
                        <p
                            className="mt-3 text-center pointer"
                            onClick={handleShow}
                        >
                            <Link to="">Esqueci minha senha</Link>
                        </p>
                        <ModalReset show={show} handleClose={handleClose} />
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Login;
