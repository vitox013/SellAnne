import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Back from "../../components/Back";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddNewProductMutation } from "./productsApiSlice";
import { useSelector } from "react-redux/es/exports";

const USER_REGEX = /^[a-zA-Z\ 0-9]{3,20}$/;

const NovoCliente = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const [addProduct, { isSuccess, isLoading, error }] =
        useAddNewProductMutation();
    const navigate = useNavigate();
    const { userId: vendedorId } = useAuth();

    const errRef = useRef();
    const [validNome, setValidNome] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [produto, setProduto] = useState("");

    const [estoque, setEstoque] = useState("");
    const [preco, setPreco] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        if (isSuccess) {
            setCodigo("");
            setProduto("");
            setEstoque("");
            setPreco("");
            navigate("/produtos");
        }
        if (error) {
            setErrMsg(error.data.message);
        }
    }, [isSuccess, navigate, error]);

    const onCodigoChange = (e) => setCodigo(e.target.value);
    const onProdutoChange = (e) => setProduto(e.target.value);
    const onEstoqueChange = (e) => setEstoque(e.target.value);
    const onPrecoChange = (e) => setPreco(e.target.value);

    const canSave = codigo && produto && estoque && preco && !isLoading;
    // const alertClass = !duplicatedName ? "" : "is-invalid";

    const onSaveUserClicked = async (e) => {
        e.preventDefault();

        if (canSave) {
            await addProduct({
                vendedorId,
                codigo,
                produto,
                estoque,
                preco,
            });
        }
    };

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    return (
        <>
            <Back path="/dashboard" />
            <Container>
                <Row className="px-2 mt-md-5">
                    <Col className="mt-2 col-12 text-center">
                        <h2 className="fw-bold">Cadastre seu novo Produto</h2>
                    </Col>
                    <Col className="mt-5 col-md-5 mx-md-auto ">
                        <Form onSubmit={onSaveUserClicked} className="fw-bold">
                            <p
                                ref={errRef}
                                className={errClass}
                                aria-live="assertive"
                            >
                                {errMsg}
                            </p>
                            <Form.Group className="mb-3" controlId="vendedorId">
                                <Form.Control
                                    type="hidden"
                                    value={vendedorId}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="nome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={produto}
                                    onChange={onProdutoChange}
                                    className="text-capitalize"
                                    required
                                />

                                {/* {duplicatedName && (
                                    <Form.Text className="invalid-feedback">
                                        Já existe um cliente com esse nome
                                    </Form.Text>
                                )} */}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="codigo">
                                <Form.Label>Código</Form.Label>

                                <Form.Control
                                    type="number"
                                    pattern="[0-9]{11}"
                                    value={codigo}
                                    onChange={onCodigoChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="estoque">
                                <Form.Label>Quantidade em estoque</Form.Label>
                                <Form.Control
                                    type="number"
                                    pattern="[0-9]{11}"
                                    value={estoque}
                                    onChange={onEstoqueChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="preco">
                                <Form.Label>Preço</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={preco}
                                    onChange={onPrecoChange}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="success"
                                type="submit"
                                onClick={onSaveUserClicked}
                            >
                                Cadastrar
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default NovoCliente;
