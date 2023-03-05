import React from "react";
import { Button, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import NavDash from "../components/NavBar";

const Public = () => {
    return (
        <>
            <NavDash info="login" page="public" icon={"bx bx-log-in fs-3"} />
            <Container>
                <Row className="text text-center fw-semibold mt-5 h2 gerencie mx-3">
                    <p>Gerencie suas vendas online.</p>
                </Row>
                <Row className="text-center just fs-5 mt-3 mx-3">
                    <p>Tenha mais controle e eficiência no seu negócio.</p>
                </Row>
                <Row>
                    <Link
                        to="/signup"
                        className="mx-auto col-4 col-md-2 btn btn-primary"
                    >
                        Criar conta
                    </Link>
                </Row>
            </Container>
        </>
    );
};

export default Public;
