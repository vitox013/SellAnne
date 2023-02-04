import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectClientById } from "../features/clients/clientsApiSlice";

const CardClient = ({ path, clientId }) => {
    const client = useSelector((state) => selectClientById(state, clientId));

    const navigate = useNavigate();
    if (client) {
        return (
            <Link to={path} className="text-decoration-none px-0">
                <Card className="px-0 mt-3">
                    <Card.Body className="d-flex text-black shadow-sm justify-content-between btn bg-light">
                        <span className="">{client.nome}</span>
                        <span className="">
                            {client.pedidos.length} pedidos
                        </span>
                        <i className="bx bxs-edit-alt col-1"></i>
                    </Card.Body>
                </Card>
            </Link>
        );
    } else return null;
};

export default CardClient;
