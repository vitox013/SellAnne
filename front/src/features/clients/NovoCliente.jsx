import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Back from "../../components/Back";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddNewClientMutation, useGetClientsQuery } from "./clientsApiSlice";
import { useSelector } from "react-redux/es/exports";
import { selectClientsData } from "./clientsDataSlice";

const USER_REGEX = /^[A-z\ ]{3,20}$/;

const NovoCliente = () => {
    const [addNewClient, { isLoading, isSuccess }] = useAddNewClientMutation();

    const navigate = useNavigate();
    const { userId } = useAuth();
    const vendedorId = userId;
    const errRef = useRef();
    const [nome, setNome] = useState("");
    const [validNome, setValidNome] = useState(false);
    const [telefone, setTelefone] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [duplicatedName, setDuplicatedName] = useState(false);

    const clients = useSelector(selectClientsData);


    useEffect(() => {
        setValidNome(USER_REGEX.test(nome));
        setDuplicatedName(clients.some((client) => client.nome === nome));
    }, [nome]);

    useEffect(() => {
        if (isSuccess) {
            setNome("");
            setTelefone("");
            navigate("/clientes");
        }
    }, [isSuccess, navigate]);

    const onNomeChange = (e) => setNome(e.target.value);
    const onTelefoneChange = (e) => setTelefone(e.target.value);

    const canSave = validNome && !isLoading && !duplicatedName;
    const alertClass = !duplicatedName ? "" : "is-invalid"

    const onSaveUserClicked = async (e) => {
        e.preventDefault();

        if (canSave) {
            try {
                await addNewClient({ vendedorId, nome, telefone });
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
        }
    };

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    return (
        <>
            <Back icon="bx bx-arrow-back fs-1" path="/dashboard" />
            <Container>
                <Row className="px-2 mt-md-5">
                    <Col className="mt-2 col-12 text-center">
                        <h2 className="fw-bold">Cadastre seu novo cliente</h2>
                    </Col>
                    <Col className="mt-5 col-md-5 mx-md-auto ">
                        <Form onSubmit={onSaveUserClicked}>
                            <p
                                ref={errRef}
                                className={errClass}
                                aria-live="assertive"
                            >
                                {errMsg}
                            </p>
                            <Form.Group className="mb-3" controlId="vendedorId">
                                <Form.Control
                                    type="hidden"
                                    value={vendedorId}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="nome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={onNomeChange}
                                    className={alertClass}
                                />

                                {duplicatedName && (
                                    <Form.Text className="invalid-feedback">
                                        Já existe um cliente com esse nome
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="telefone">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control
                                    type="tel"
                                    pattern="[0-9]{11}"
                                    onChange={onTelefoneChange}
                                />
                                <Form.Text className="text-muted">
                                    Ex: (11) 9 9999-9999
                                </Form.Text>
                            </Form.Group>

                            <Button variant="success" type="submit">
                                Cadastrar
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default NovoCliente;
