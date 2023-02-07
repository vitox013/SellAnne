import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavDash from "../components/NavDash";
import NavFooter from "../components/NavFooter";
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

    const {
        data: clients,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetClientsQuery(userId, {
        pollingInterval: 15000,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    let content;

    if (isLoading) content = <p>Loading...</p>;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    useEffect(() => {
        if (isSuccess) {
            const { entities } = clients;
            var userClients = Object.keys(entities).map((key) => {
                return entities[key];
            });

            userClients.sort((a, b) => a.nome.localeCompare(b.nome));

            dispatch(setClientsData(userClients));
            setClientes(userClients);
        }
    }, [isSuccess, clients]);

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
                        <Link to="">
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
                </Card>
            </Container>
        </>
    );
};

export default Dashboard;
