import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card } from "react-bootstrap";

const CardProduct = ({ vendedor, cod, nomeProduto, estoque, preco, path }) => {
    return (
        <Link to={path} className="text-decoration-none px-0 ">
            <Card className="px-2 py-2 mt-3 text-black shadow-sm hover-card bg-light">
                <Row className="text-center">
                    <Col xs={2}>{cod}</Col>
                    <Col xs={4}>{nomeProduto}</Col>
                    <Col xs={2}>{estoque}</Col>
                    <Col xs={4}>{preco}</Col>
                </Row>
            </Card>
        </Link>
    );
};

export default CardProduct;
