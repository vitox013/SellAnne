import React, { useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import NavDash from "../components/NavBar";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useGetUserDataQuery } from "../features/users/userApiSlice";
import Loading from "../utils/Loading";

const Dashboard = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const { userId, currentUser } = useAuth();
    const [conteudo, setConteudo] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [pedidosForn, setPedidosForn] = useState([]);

    const { userData, isLoading } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data, isLoading }) => ({
            userData: data,
            isLoading,
        }),
    });

    useEffect(() => {
        if (userData) {
            setPedidos([]);
            setFornecedores(
                userData?.fornecedores?.map(
                    (fornecedor) => fornecedor.nomeFornecedor
                )
            );

            userData?.clients?.map((cliente) =>
                cliente?.pedidos.map((pedido) =>
                    setPedidos((pedidos) => [...pedidos, pedido])
                )
            );
        }
    }, [userData]);

    useEffect(() => {
        if (fornecedores?.length > 0 && pedidos?.length > 0) {
            setPedidosForn(
                fornecedores.map(function (fornecedor) {
                    return {
                        fornecedor: fornecedor,
                        pedidos: pedidos.filter(
                            (pedido) => pedido.fornecedor == fornecedor
                        ),
                        totalPago: pedidos
                            .filter((pedido) => pedido.fornecedor == fornecedor)
                            .reduce((acc, pedido) => acc + pedido.qtdPaga, 0),
                        totalReceber: pedidos
                            .filter((pedido) => pedido.fornecedor == fornecedor)
                            .reduce(
                                (acc, ped) =>
                                    acc +
                                    (ped.quantidade *
                                        (ped?.valorVenda
                                            ? ped.valorVenda
                                            : ped.valor) -
                                        ped.qtdPaga),
                                0
                            ),
                        lucro: pedidos
                            .filter((pedido) => pedido.fornecedor == fornecedor)
                            .reduce(
                                (acc, ped) =>
                                    acc +
                                    ped.quantidade *
                                        (ped?.valorVenda
                                            ? ped.valorVenda - ped.valor
                                            : (ped.valor * ped.porcentagem) /
                                              100),
                                0
                            ),
                    };
                })
            );
        }
    }, [pedidos, fornecedores]);

    useEffect(() => {
        if (pedidosForn.length > 0) {
            setConteudo(
                pedidosForn.map((forn) => (
                    <Row key={forn?.fornecedor} className="m-1">
                        <p className="px-0 mb-2">
                            <span className="h4">{forn?.fornecedor}</span> |{" "}
                            <span>{forn?.pedidos?.length} pedidos </span>
                        </p>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Total Pago</th>
                                    <th>A receber</th>
                                    <th>Lucro:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{formatter.format(forn.totalPago)}</td>
                                    <td>
                                        {formatter.format(forn.totalReceber)}
                                    </td>
                                    <td className="fw-bold">
                                        {formatter.format(forn.lucro)}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                ))
            );
        } else if (!isLoading) {
            setConteudo(
                <Row className="mx-1">
                    <hr />
                    <p>
                        Nenhum pedido realizado <i className="bx bxs-sad"></i>
                    </p>
                </Row>
            );
        }
    }, [pedidosForn]);

    return (
        <>
            <NavDash
                info=""
                icon="bx bx-user-circle fs-1 expand"
                fixed=""
                path="dash"
                page="dashboard"
            />
            <Container>
                <h1 className="text-center">Olá, {currentUser}!</h1>
                <Row>
                    <Col>
                        <Link to="/clientes">
                            <Card className="text-center text-dark hover-card bg-light shadow-sm fw-bold fs-5 py-3 ">
                                Ver clientes
                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/fornecedores">
                            <Card className="text-center text-dark hover-card bg-light shadow-sm fw-bold fs-5 py-3 ">
                                Fornecedores
                            </Card>
                        </Link>
                    </Col>
                </Row>

                <Card className="mt-4">
                    <Card.Body>
                        <Row>
                            <Col>
                                <h3 className="fw-bold px-0 mx-1">
                                    Resumo de suas vendas
                                </h3>
                            </Col>
                        </Row>
                        {isLoading ? <Loading /> : conteudo}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Dashboard;
