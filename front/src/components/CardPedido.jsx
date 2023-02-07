import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const CardPedido = ({ path, produto, quantidade, valor }) => {
    return (
        <Link to={path} className="text-decoration-none px-0 ">
            <Card className="px-2 py-2 mt-3 text-black shadow-sm hover-card bg-light">
                <Row>
                    <Col xs={6}>{produto}</Col>
                    <Col>{quantidade}</Col>
                    <Col>{valor}</Col>
                </Row>
            </Card>
        </Link>
    );
};

export default CardPedido;
