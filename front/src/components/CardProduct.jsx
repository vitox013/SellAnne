import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card } from "react-bootstrap";

const CardProduct = ({ vendedor, cod, nomeProduto, estoque, preco, path }) => {
    return (
        <Link to={path} className="text-decoration-none px-0 ">
            <Card className="px-2 py-2 mt-3 text-black shadow-sm hover-card bg-light">
                <Row className="text-center">
                    <Col xs={2} className="pe-0">{cod}</Col>
                    <Col xs={4} className="pe-0">{nomeProduto}</Col>
                    <Col xs={2} md={3} className="pe-0">{estoque}</Col>
                    <Col xs={4} md={3} className="pe-0">{preco}</Col>
                </Row>
            </Card>
        </Link>
    );
};

export default CardProduct;
