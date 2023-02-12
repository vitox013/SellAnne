import React, { useEffect } from "react";
import {
    Button,
    Container,
    Row,
    Form,
    NavDropdown,
    Card,
    Col,
} from "react-bootstrap";
import CardClient from "../../components/CardClient";
import NavDash from "../../components/NavBar";
import NavFooter from "../../components/NavFooter";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import CardProduct from "../../components/CardProduct";
import { useGetUserDataQuery } from "../users/userApiSlice";

const Produtos = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const { currentUser, userId } = useAuth();
    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [produtos, setProdutos] = useState([]);

    const { products } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.produtos,
        }),
    });

    useEffect(() => {
        if (products) {
            // const prodSorted = products.sort((a, b) => a.code - b.code);
            setProdutos(products);
        }
    }, [products]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term == "") {
            setConteudo(
                produtos?.length ? (
                    produtos.map((produto) => (
                        <CardProduct
                            key={produto._id}
                            path={produto._id}
                            nomeProduto={produto.productName}
                            cod={produto.code}
                            vendedor={produto.vendedor}
                            estoque={produto.estoque}
                            preco={formatter.format(produto.preco)}
                        />
                    ))
                ) : (
                    <p className="alert alert-danger text-center">
                        Nenhum produto cadastrado!
                    </p>
                )
            );
        }
        if (term) {
            const filteredProducts = produtos.filter((prod) =>
                prod.productName.toLowerCase().includes(term.toLowerCase())
            );

            if (filteredProducts) {
                setConteudo(
                    filteredProducts?.length ? (
                        filteredProducts.map((produto) => (
                            <CardProduct
                                key={produto.id}
                                nomeProduto={produto.productName}
                                cod={produto.code}
                                estoque={produto.estoque}
                                preco={formatter.format(produto.preco)}
                                path={produto._id}
                            />
                        ))
                    ) : (
                        <p className="alert alert-danger text-center">
                            Nenhum produto {term} encontrado!
                        </p>
                    )
                );
            }
        }
    }, [produtos, term]);

    const onSearch = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <NavDash
                info="Produtos"
                icon="bx bx-user-circle fs-1 expand"
                fixed="top"
                path="dash"
                page="produtos"
            />
            <Container>
                <h1 className="mt-2 pt-10">Olá, {currentUser}!</h1>
                <Row>
                    <Form className="d-flex mt-4 align-items-center">
                        <h2 className="col-5 col-md-7">Produtos</h2>
                        <Form.Control
                            size="sm"
                            type="search"
                            placeholder="Procurar produto"
                            className="me-2 h-75 w-50"
                            aria-label="Search"
                            value={debouncedTerm}
                            onChange={(e) => setDebouncedTerm(e.target.value)}
                            onSubmit={onSearch}
                        />
                        <Button
                            variant="outline-success"
                            className="h-75 col-1 px-0 py-0"
                        >
                            <i className="bx bx-search"></i>
                        </Button>
                    </Form>
                </Row>
                <Card className=" py-2 mt-3 text-black shadow-sm fw-bold">
                    <Row className="text-center">
                        <Col xs={2}>Cod</Col>
                        <Col xs={4}>Item</Col>
                        <Col xs={3}>Estoque</Col>
                        <Col xs={3}>Valor</Col>
                    </Row>
                </Card>
                <Row className="px-2">{conteudo}</Row>
                <Row>
                    <NavFooter
                        path="novoproduto"
                        info="Cadastrar novo produto"
                        icon="bx bx-plus me-1"
                    />
                </Row>
            </Container>
        </>
    );
};

export default Produtos;
