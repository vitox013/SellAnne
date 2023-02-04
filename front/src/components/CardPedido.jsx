import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const CardPedido = ({ path }) => {
    return (
        <Link to={path} className="text-decoration-none px-0">
            <Card className="px-0 mt-3">
                <Card.Body className="d-flex justify-content-between text-black shadow-sm btn bg-light">
                    <span>Nome</span>
                    <span>0 pedidos</span>
                    <i className="bx bxs-edit-alt"></i>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default CardPedido;
