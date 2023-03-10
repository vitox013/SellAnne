import React, { useEffect } from "react";
import { Button, Container, Row, Form, NavDropdown } from "react-bootstrap";
import CardClient from "../../components/CardClient";
import NavDash from "../../components/NavBar";
import NavFooter from "../../components/NavFooter";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDataQuery } from "../users/userApiSlice";
import { setMsg } from "../infoMsg/msgSlice";
import Message from "../../utils/Message";
import Loading from "../../utils/Loading";

const Clientes = () => {
    const { currentUser, userId, username } = useAuth();
    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [clientes, setClientes] = useState([]);

    let message = useSelector((state) => state.infoMsg.msg);

    const { clients, isLoading } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data, isLoading }) => ({
            clients: data?.clients,
            isLoading,
        }),
    });

    useEffect(() => {
        if (clients) {
            setClientes(
                clients
                    .slice()
                    .sort((a, b) => (a.clientName > b.clientName ? 1 : -1))
            );
        }
    }, [clients]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term == "" && !isLoading) {
            setConteudo(
                clientes?.length ? (
                    clientes.map((clientId) => (
                        <CardClient
                            key={clientId._id}
                            clientId={clientId._id}
                            clientName={clientId.clientName}
                            qtdPedido={clientId.pedidos.length}
                            path={clientId._id}
                        />
                    ))
                ) : (
                    <p className="alert alert-danger text-center">
                        Nenhum cliente cadastrado!
                    </p>
                )
            );
        }
        if (term) {
            const filteredClients = clientes.filter((client) =>
                client.clientName.toLowerCase().includes(term.toLowerCase())
            );

            if (filteredClients) {
                setConteudo(
                    filteredClients?.length ? (
                        filteredClients.map((clientId) => (
                            <CardClient
                                key={clientId.id}
                                clientId={clientId.id}
                                clientName={clientId.clientName}
                                qtdPedido={clientId.pedidos.length}
                                path={clientId._id}
                            />
                        ))
                    ) : (
                        <p className="alert alert-danger text-center mt-2">
                            Nenhum cliente {term} encontrado!
                        </p>
                    )
                );
            }
        }
    }, [clientes, term]);

    const onSearch = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <NavDash
                info="Produtos"
                icon="bx bx-user-circle fs-1 expand"
                fixed="top"
                path="dash"
                page="clientes"
            />
            <Container>
                <Row>
                    <Form className="d-flex mt-4 pt-10 align-items-center">
                        <h2 className="col-5 fw-bold">Clientes</h2>
                        <Form.Control
                            size="sm"
                            type="search"
                            placeholder="Procurar"
                            className="me-2 h-75 w-50"
                            aria-label="Search"
                            value={debouncedTerm}
                            onChange={(e) => setDebouncedTerm(e.target.value)}
                            onSubmit={onSearch}
                        />
                        <Button
                            variant="outline-success"
                            className="h-75 col-1 px-0 py-0"
                        >
                            <i className="bx bx-search"></i>
                        </Button>
                    </Form>
                </Row>
                <Row>
                    {message && (
                        <Message type="alert alert-success" msg={message} />
                    )}
                </Row>
                <Row className="px-2">{isLoading ? <Loading /> : conteudo}</Row>
                <Row>
                    <NavFooter
                        path="/clientes/novocliente"
                        info="Novo cliente"
                        icon="bx bx-plus me-1"
                    />
                </Row>
            </Container>
        </>
    );
};

export default Clientes;
