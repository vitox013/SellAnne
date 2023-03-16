import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Back from "../../components/Back";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    useUpdateUserMutation,
    useGetUserDataQuery,
} from "../users/userApiSlice";
import { telefoneMask } from "../../utils/telefone";
import Loading from "../../utils/Loading";

const USER_REGEX = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]{3,20}$/;

const NovoCliente = () => {
    const navigate = useNavigate();
    const { userId: vendedorId } = useAuth();
    const [clientes, setClientes] = useState([]);

    const [addNewClient, { isLoading, isSuccess, error }] =
        useUpdateUserMutation();

    const { clients } = useGetUserDataQuery(vendedorId, {
        selectFromResult: ({ data }) => ({
            clients: data?.clients,
        }),
    });

    useEffect(() => {
        if (clients) {
            setClientes(clients);
        }
    }, [clients]);

    const errRef = useRef();
    const [nome, setNome] = useState("");
    const [validNome, setValidNome] = useState(false);
    const [telefone, setTelefone] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [duplicatedName, setDuplicatedName] = useState(false);

    useEffect(() => {
        setValidNome(USER_REGEX.test(nome));

        setDuplicatedName(
            clientes
                .map((cliente) => cliente.clientName)
                .some(
                    (clientName) =>
                        clientName.toLowerCase() === nome.toLowerCase().trim()
                )
        );
    }, [nome]);

    useEffect(() => {
        if (isSuccess) {
            setNome("");
            setTelefone("");
            navigate("/clientes");
        } else if (error) {
            setErrMsg(error.data.message);
        }
    }, [isSuccess, navigate, error]);

    const onNomeChange = (e) => setNome(e.target.value);
    const onTelefoneChange = (e) => setTelefone(e.target.value);

    const canSave = validNome && !isLoading && !duplicatedName;
    const alertClass =
        !duplicatedName && (validNome || !nome) ? "" : "is-invalid";

    const onSaveUserClicked = async (e) => {
        e.preventDefault();

        if (canSave) {
            await addNewClient({
                userId: vendedorId,
                cliente: { clientName: nome.trim(), telefone },
            });
        }
    };

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    return (
        <>
            {isLoading && <Loading />}
            <Back path="/clientes" />
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
                                    maxLength={18}
                                    onChange={onNomeChange}
                                    className={`${alertClass}`}
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
                                    maxLength={16}
                                    value={telefone}
                                    onChange={(e) =>
                                        onTelefoneChange(telefoneMask(e))
                                    }
                                />
                                <Form.Text className="text-muted">
                                    Ex: (11) 9 9999-9999
                                </Form.Text>
                            </Form.Group>

                            <Button
                                variant="success"
                                type="submit"
                                disabled={!canSave || isLoading}
                            >
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
