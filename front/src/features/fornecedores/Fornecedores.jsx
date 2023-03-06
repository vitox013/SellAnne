import React, { useEffect } from "react";
import { Button, Container, Row, Form, Col, Card } from "react-bootstrap";

import NavBar from "../../components/NavBar";
import NavFooter from "../../components/NavFooter";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
    useDeleteUserMutation,
    useGetUserDataQuery,
} from "../users/userApiSlice";
import CardFornecedor from "../../components/CardFornecedor";
import { useParams, useLocation } from "react-router-dom";
import Message from "../../utils/Message";
import { useSelector } from "react-redux";
import { setMsg } from "../infoMsg/msgSlice";

const Fornecedores = () => {
    const { currentUser, userId, username } = useAuth();
    const { id: fornecedorId } = useParams();

    let message = useSelector((state) => state.infoMsg.msg);

    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);

    const { arrayFornecedores } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            arrayFornecedores: data?.fornecedores,
        }),
    });

    useEffect(() => {
        if (arrayFornecedores) {
            setFornecedores(
                arrayFornecedores
                    .slice()
                    .sort((a, b) =>
                        a.nomeFornecedor > b.nomeFornecedor ? 1 : -1
                    )
            );
        }
    }, [arrayFornecedores]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term == "") {
            setConteudo(
                fornecedores?.length ? (
                    fornecedores.map((forn) => (
                        <CardFornecedor
                            key={forn._id}
                            nome={forn.nomeFornecedor}
                            metodo={forn.metodo}
                            path={forn._id}
                        />
                    ))
                ) : (
                    <p className="alert alert-danger text-center">
                        Nenhum fornecedor cadastrado!
                    </p>
                )
            );
        }
        if (term) {
            const filteredFornecedores = fornecedores.filter((forn) =>
                forn.nomeFornecedor.toLowerCase().includes(term.toLowerCase())
            );

            if (filteredFornecedores) {
                setConteudo(
                    filteredFornecedores?.length ? (
                        filteredFornecedores.map((forn) => (
                            <CardFornecedor
                                key={forn._id}
                                nome={forn.nomeFornecedor}
                                metodo={forn.metodo}
                                path={forn._id}
                            />
                        ))
                    ) : (
                        <p className="alert alert-danger">
                            Nenhum fornecedor {term} encontrado!
                        </p>
                    )
                );
            }
        }
    }, [fornecedores, term]);

    const onSearch = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <NavBar
                info="Fornecedores"
                icon="bx bx-user-circle fs-1 expand"
                fixed="top"
                path="dash"
                page="fornecedores"
            />
            <Container>
                <Row>
                    <Form className="d-flex  align-items-center mt-4 pt-10">
                        <Col xs={7}>
                            <h2 className="col-5 fw-bold">Fornecedores</h2>
                        </Col>
                        <Col xs={4}>
                            <Form.Control
                                type="search"
                                placeholder="Procurar"
                                className="me-2 h-75"
                                aria-label="Search"
                                value={debouncedTerm}
                                onChange={(e) =>
                                    setDebouncedTerm(e.target.value)
                                }
                                onSubmit={onSearch}
                            />
                        </Col>
                        <Col>
                            <Button
                                variant="outline-success"
                                className="px-0 py-1 w-100"
                            >
                                <i className="bx bx-search"></i>
                            </Button>
                        </Col>
                    </Form>
                </Row>
                <Row className="px-2">
                    <Card className="py-2 mt-3 text-black shadow-sm fw-bold">
                        <Row className="text-center">
                            <Col>Nome</Col>
                            <Col>Método</Col>
                        </Row>
                    </Card>
                </Row>
                {message && (
                    <Message type="alert alert-success" msg={message} />
                )}
                <Row className="px-2">{conteudo}</Row>
                <Row>
                    <NavFooter
                        path="/fornecedores/novofornecedor"
                        info="Novo fornecedor"
                        icon="bx bx-plus me-1"
                    />
                </Row>
            </Container>
        </>
    );
};

export default Fornecedores;
