import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card } from "react-bootstrap";

const CardFornecedor = ({ nome, metodo, path }) => {
    return (
        <Link to={path} className="text-decoration-none px-0 ">
            <Card className="px-2 py-2 mt-3 text-black shadow-sm hover-card bg-light">
                <Row className="text-center">
                    <Col>{nome}</Col>
                    <Col>{metodo}</Col>
                </Row>
            </Card>
        </Link>
    );
};

export default CardFornecedor;
