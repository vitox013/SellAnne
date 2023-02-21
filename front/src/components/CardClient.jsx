import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const CardClient = ({ clientId, userId, clientName, qtdPedido }) => {
    const [content, setContent] = useState(null);



    useEffect(() => {
        qtdPedido != 1
            ? setContent(<span className="">{qtdPedido} pedidos</span>)
            : setContent(<span className="">{qtdPedido} pedido</span>);
    }, [clientName]);

    if (clientName) {
        return (
            <Card className="px-0 mt-3">
                <Link to={`${clientId}`} className="text-decoration-none px-0 ">
                    <Card.Body className="d-flex text-black shadow-sm justify-content-between hover-card btn bg-light">
                        <span className="">{clientName}</span>

                        {content}
                        {/* <i className="bx bxs-edit-alt col-1"></i> */}
                    </Card.Body>
                </Link>
            </Card>
        );
    } else return null;
};

export default CardClient;
