import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const CardPedido = ({ path, produto, quantidade, valor, codigo, status }) => {
    const statusClass =
        status == "Não pago" ? "alert alert-danger" : "alert alert-success";

    return (
        <Link to={path} className="text-decoration-none px-0 ">
            <Card
                className={`px-2 py-2 mt-3 text-black shadow-sm hover-card ${statusClass}`}
            >
                <Row className="d-flex align-items-center">
                    <Col xs={4} className="d-flex flex-column fw">
                        <span className="fw-bold">{produto}</span>
                        <small>cod: {codigo}</small>
                    </Col>
                    <Col xs={1}>{quantidade}</Col>
                    <Col xs={4}>{valor}</Col>
                    <Col xs={3}>{status}</Col>
                </Row>
            </Card>
        </Link>
    );
};

export default CardPedido;
