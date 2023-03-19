import React, { useEffect } from "react";
import {
    Button,
    Container,
    Row,
    Form,
    NavDropdown,
    Col,
} from "react-bootstrap";
import CardClient from "../../components/CardClient";
import NavDash from "../../components/NavBar";
import NavFooter from "../../components/NavFooter";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDataQuery } from "../users/userApiSlice";
import { setMsg } from "../infoMsg/msgSlice";
import Message from "../../utils/Message";
import selectedOption, {
    setSelectedOption,
} from "../../reducers/selectedOption";

const Clientes = () => {
    const { currentUser, userId, username } = useAuth();
    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [opcoesForn, setOpcoesForn] = useState([]);
    const { selectedOption } = useSelector((state) => state.selectedOption);

    let message = useSelector((state) => state.infoMsg.msg);

    const dispatch = useDispatch();

    const { clients, forns } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            clients: data?.clients,
            forns: data?.fornecedores,
        }),
    });

    useEffect(() => {
        if (clients && selectedOption != "Todos") {
            setClientes(
                clients
                    .slice()
                    .filter((client) =>
                        client.pedidos.some(
                            (pedido) => pedido.fornecedor == selectedOption
                        )
                    )
                    .sort((a, b) => (a.clientName > b.clientName ? 1 : -1))
            );
        } else if (clients) {
            setClientes(
                clients
                    .slice()
                    .sort((a, b) => (a.clientName > b.clientName ? 1 : -1))
            );
        }

        // .sort((a, b) => (a.clientName > b.clientName ? 1 : -1)

        if (forns) {
            setOpcoesForn(
                forns.slice().map((forn) => (
                    <option key={forn._id} value={forn.nomeFornecedor}>
                        {forn.nomeFornecedor}
                    </option>
                ))
            );
        }
    }, [clients, forns, selectedOption]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term == "") {
            setConteudo(
                clientes?.length ? (
                    clientes.map((clientId) => (
                        <CardClient
                            key={clientId?._id}
                            clientId={clientId?._id}
                            clientName={clientId?.clientName}
                            qtdPedido={clientId?.pedidos?.length}
                            path={clientId?._id}
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
            dispatch(setSelectedOption("Todos"))
            const filteredClients = clientes.filter((client) =>
                client.clientName.toLowerCase().includes(term.toLowerCase())
            );

            if (filteredClients) {
                setConteudo(
                    filteredClients?.length ? (
                        filteredClients.map((clientId) => (
                            <CardClient
                                key={clientId.id}
                                clientId={clientId._id}
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
    }, [clientes, term, selectedOption]);

    const onSearch = (e) => {
        e.preventDefault();
    };

    const onHandleSetSelectedOption = (e) => {
        dispatch(setSelectedOption(e.target.value));
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
                    <Col xs={5}>
                        <Form>
                            <Form.Select
                                onChange={onHandleSetSelectedOption}
                                value={selectedOption}
                            >
                                <option>Todos</option>
                                {opcoesForn}
                            </Form.Select>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    {message && (
                        <Message type="alert alert-success" msg={message} />
                    )}
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
