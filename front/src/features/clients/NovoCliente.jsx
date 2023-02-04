import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Back from "../../components/Back";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddNewClientMutation } from "./clientsApiSlice";

const USER_REGEX = /^[A-z]{3,20}$/;

const NovoCliente = () => {
    const [addNewClient, { isLoading, isSuccess, isError, error }] =
        useAddNewClientMutation();

    const navigate = useNavigate();
    const { userId } = useAuth();

    const [nome, setNome] = useState("");
    const [validNome, setValidNome] = useState(false);
    const [telefone, setTelefone] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        setValidNome(USER_REGEX.test(nome));
    }, [nome]);

    useEffect(() => {
        if (isSuccess) {
            setNome("");
            setTelefone("");
            navigate("/dashboard");
        }
    }, [isSuccess, navigate]);

    const onNomeChange = (e) => setNome(e.target.value);
    const onTelefoneChange = (e) => setTelefone(e.target.value);

    const canSave = validNome && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewClient({ nome, telefone, userId });
        }
    }

    return (
        <>
            <Back icon="bx bx-arrow-back fs-1" path="/dashboard" />
            <Container>
                <Row className="px-2 mt-md-5">
                    <Col className="mt-2 col-12 text-center">
                        <h2 className="fw-bold">Cadastre seu novo cliente</h2>
                    </Col>
                    <Col className="mt-5 col-md-5 mx-md-auto ">
                        <Form>
                            <Form.Group className="mb-3" controlId="vendedorId">
                                <Form.Control type="hidden" value={userId} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="nome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="telefone">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control type="tel" pattern="[0-9]{11}" />
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
