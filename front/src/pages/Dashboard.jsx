import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavDash from "../components/NavBar";
import { useState } from "react";
import { useGetClientsQuery } from "../features/clients/clientsApiSlice";
import useAuth from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setClientsData } from "../features/clients/clientsDataSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { currentUser, userId, username } = useAuth();
    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [clientes, setClientes] = useState([]);

    const dispatch = useDispatch();

    // const {
    //     clients,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error,
    // } = useGetClientsQuery(userId, {

    // });

    const { client } = useGetClientsQuery(userId, {
        selectFromResult: ({ data }) => ({
            client: data?.entities,
        }),
    });
    let content;

    // if (isLoading) content = <p>Loading...</p>;

    // if (isError) {
    //     content = <p className="errmsg">{error?.data?.message}</p>;
    // }
    // useEffect(() => {
    //     if (isSuccess) {
    //         const { entities } = clients;
    //         var userClients = Object.keys(entities).map((key) => {
    //             return entities[key];
    //         });

    //         userClients.sort((a, b) => a.nome.localeCompare(b.nome));
    //         setClientes(userClients);
    //     }
    // }, [isSuccess, clients]);

    useEffect(() => {
        console.log(client);
    }, [client]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    const onSearch = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <NavDash
                info=""
                icon="bx bx-user-circle fs-1 expand"
                fixed="top"
                path="dash"
                page="dashboard"
            />
            <Container>
                <h1 className="mt-2 pt-10 text-center">Olá, {currentUser}!</h1>
                <Row>
                    <Col>
                        <Link to="/clientes">
                            <Card className="text-center text-dark hover-card bg-light shadow-sm fw-bold fs-5 py-3 ">
                                Ver clientes
                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/produtos">
                            <Card className="text-center text-dark hover-card bg-light shadow-sm fw-bold fs-5 py-3 ">
                                Ver produtos
                            </Card>
                        </Link>
                    </Col>
                </Row>
                <Row className="px-2">{conteudo}</Row>
                {/* <Row>
                    <NavFooter
                        path="/dashboard/novocliente"
                        info="Novo cliente"
                        icon="bx bx-plus me-1"
                    />
                </Row> */}
                <Card className="mt-4">
                    <Row>
                        <Col className="">
                            <h3>Resumo de suas vendas</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col></Col>
                    </Row>
                    <Link to="/teste" className="btn text-bg-dark">
                        TESTE
                    </Link>
                </Card>
            </Container>
        </>
    );
};

export default Dashboard;
