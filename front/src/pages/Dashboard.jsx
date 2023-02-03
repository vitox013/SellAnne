import React from "react";
import { Button, Container, Row, Form } from "react-bootstrap";
import CardClient from "../components/CardClient";
import NavDash from "../components/NavDash";
import NavFooter from "../components/NavFooter";
import { useState } from "react";

const Dashboard = () => {
    const [posicao, setPosicao] = useState("");

    function scroll() {
        window.addEventListener("scroll", function () {
            this.scrollY > 150 ? setPosicao("top") : setPosicao("");
        });
    }
    scroll();

    return (
        <>
            <NavDash info="" icon="bx bx-user-circle fs-1" fixed={posicao} />
            <Container>
                <h1 className="mt-2 ">Olá, Usuário!</h1>
                <Row>
                    <Form className="d-flex mt-4 align-items-center">
                        <h2 className="col-5">Clientes</h2>
                        <Form.Control
                            size="sm"
                            type="search"
                            placeholder="Procurar"
                            className="me-2 h-75 w-50"
                            aria-label="Search"
                        />
                        <Button
                            variant="outline-success"
                            className="h-75 col-1 px-0 py-0"
                        >
                            <i class="bx bx-search"></i>
                        </Button>
                    </Form>
                </Row>
                <Row className="px-2">
                    <CardClient path="/dashboard/cliente" />
                </Row>
                <Row>
                    <NavFooter
                        path="/dashboard/novocliente"
                        info="Novo cliente"
                        icon="bx bx-plus me-1"
                    />
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;
