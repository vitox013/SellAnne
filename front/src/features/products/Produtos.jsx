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
import { useGetProductsQuery } from "./productsApiSlice";
import useAuth from "../../hooks/useAuth";
import CardProduct from "../../components/CardProduct";

const Produtos = () => {
    const { currentUser, userId } = useAuth();
    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [produtos, setProdutos] = useState([]);

    const { products } = useGetProductsQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.entities,
        }),
    });

    let content;

    useEffect(() => {
        if (products) {
            var clientProducts = Object.keys(products).map((key) => {
                return products[key];
            });
            clientProducts.sort((a, b) => a.codigo - b.codigo);
            setProdutos(clientProducts);
        }
    }, [products]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term == "") {
            setConteudo(
                produtos?.length
                    ? produtos.map((produto) => (
                          <CardProduct
                              key={produto._id}
                              path={produto._id}
                              nomeProduto={produto.produto}
                              cod={produto.codigo}
                              vendedor={produto.vendedor}
                              estoque={produto.estoque}
                              preco={produto.preco}
                          />
                      ))
                    : null
            );
        }
        if (term) {
            const filteredProducts = produtos.filter((client) =>
                client.nome.toLowerCase().includes(term.toLowerCase())
            );

            if (filteredProducts) {
                setConteudo(
                    filteredProducts?.length ? (
                        filteredProducts.map((produto) => (
                            <CardClient
                                key={produto.id}
                                produto={produto.id}
                                userId={produto.vendedorId}
                                clientName={produto.nome}
                                qtdPedido={produto.pedidos.length}
                                path=""
                            />
                        ))
                    ) : (
                        <p className="alert alert-danger">
                            Nenhum cliente {term} encontrado!
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
                        <h2 className="col-5">Produtos</h2>
                        <Form.Control
                            size="sm"
                            type="search"
                            placeholder="Procurar"
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
