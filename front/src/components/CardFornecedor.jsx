import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card } from "react-bootstrap";

const CardFornecedor = ({ nome, metodo, path }) => {
    return (
        <Card className="px-2 py-2 mt-3  shadow-sm hover-card bg-light text-decoration-none px-0">
            <Link to={path} className="text-black">
                <Row className="text-center">
                    <Col>{nome}</Col>
                    <Col>{metodo}</Col>
                </Row>
            </Link>
        </Card>
    );
};

export default CardFornecedor;
