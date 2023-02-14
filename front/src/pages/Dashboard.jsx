import React, { useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import NavDash from "../components/NavBar";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useGetUserDataQuery } from "../features/users/userApiSlice";

const Dashboard = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const { userId, currentUser } = useAuth();
    const [conteudo, setConteudo] = useState([]);
    const [todosPedidos, setTodosPedidos] = useState([]);
    const [totalPedidos, setTotalPedidos] = useState("");
    const [totalPago, setTotalPago] = useState("");
    const [totalReceber, setTotalReceber] = useState("");

    const { clients } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            clients: data?.clients,
        }),
    });

    useEffect(() => {
        if (clients) {
            let pedidos = [];
            clients.map((client) =>
                client.pedidos.map((pedido) => pedidos.push(pedido))
            );
            setTodosPedidos(pedidos);
        }
    }, [clients]);

    useEffect(() => {
        if (todosPedidos) {
            console.log(todosPedidos);
            setTotalPedidos(todosPedidos.length);
            setTotalPago(
                todosPedidos.reduce((acc, pedido) => acc + pedido.qtdPaga, 0)
            );
            setTotalReceber(
                todosPedidos
                    .reduce(
                        (acc, ped) =>
                            acc + (ped.quantidade * ped.valor - ped.qtdPaga),
                        0
                    )
                    .toFixed(2)
            );
        }
    }, [todosPedidos]);

    return (
        <>
            <NavDash
                info=""
                icon="bx bx-user-circle fs-1 expand"
                fixed="top"
                path="dash"
                page="dashboard"
            />
            <Container>
                <h1 className="mt-2 pt-10 text-center">Olá, {currentUser}!</h1>
                <Row>
                    <Col>
                        <Link to="/clientes">
                            <Card className="text-center text-dark hover-card bg-light shadow-sm fw-bold fs-5 py-3 ">
                                Ver clientes
                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/produtos">
                            <Card className="text-center text-dark hover-card bg-light shadow-sm fw-bold fs-5 py-3 ">
                                Ver produtos
                            </Card>
                        </Link>
                    </Col>
                </Row>
                <Row className="px-2">{conteudo}</Row>
                <Card className="mt-4">
                    <Card.Body>
                        <Row>
                            <Col className="mx-2">
                                <h3 className="fw-bold ">
                                    Resumo de suas vendas
                                </h3>
                            </Col>
                        </Row>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Total vendido</th>
                                    <th>Total Pago</th>
                                    <th>A receber</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{totalPedidos}</td>
                                    <td>{formatter.format(totalPago)}</td>
                                    <td>{formatter.format(totalReceber)}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Dashboard;
