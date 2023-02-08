import React, { useEffect } from "react";
import { Button, Container, Row, Form, NavDropdown } from "react-bootstrap";
import CardClient from "../../components/CardClient";
import NavDash from "../../components/NavBar";
import NavFooter from "../../components/NavFooter";
import { useState } from "react";
import { useGetClientsQuery } from "./clientsApiSlice";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setClientsData } from "./clientsDataSlice";

const Clientes = () => {
    const { currentUser, userId, username } = useAuth();
    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [clientes, setClientes] = useState([]);

    const dispatch = useDispatch();

    // const {
    //     data: clients,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error,
    // } = useGetClientsQuery(userId, {
    //     pollingInterval: 15000,
    //     refetchOnMountOrArgChange: true,
    //     refetchOnFocus: true,
    //     refetchOnReconnect: true,
    // });
    const { client } = useGetClientsQuery(userId, {
        selectFromResult: ({ data }) => ({
            client: data?.entities,
        }),
    });

    let content;

    useEffect(() => {
        if (client) {
            var userClients = Object.keys(client).map((key) => {
                return client[key];
            });
            userClients.sort((a, b) => a.nome.localeCompare(b.nome));
            dispatch(setClientsData(userClients));
            setClientes(userClients);
        }
    }, [client]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term == "") {
            setConteudo(
                clientes?.length
                    ? clientes.map((clientId) => (
                          <CardClient
                              key={clientId.id}
                              clientId={clientId.id}
                              userId={clientId.vendedorId}
                              clientName={clientId.nome}
                              qtdPedido={clientId.pedidos.length}
                              path=""
                          />
                      ))
                    : null
            );
        }
        if (term) {
            const filteredClients = clientes.filter((client) =>
                client.nome.toLowerCase().includes(term.toLowerCase())
            );

            if (filteredClients) {
                setConteudo(
                    filteredClients?.length ? (
                        filteredClients.map((clientId) => (
                            <CardClient
                                key={clientId.id}
                                clientId={clientId.id}
                                userId={clientId.vendedorId}
                                clientName={clientId.nome}
                                qtdPedido={clientId.pedidos.length}
                                path=""
                            />
                        ))
                    ) : (
                        <p className="alert alert-danger">
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
                <h1 className="mt-2 pt-10">Olá, {currentUser}!</h1>
                <Row>
                    <Form className="d-flex mt-4 align-items-center">
                        <h2 className="col-5">Clientes</h2>
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
                <Row className="px-2">{conteudo}</Row>
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
