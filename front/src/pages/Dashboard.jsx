import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavDash from "../components/NavBar";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";


const Dashboard = () => {
    const { currentUser } = useAuth();
    const [conteudo, setConteudo] = useState([]);



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
