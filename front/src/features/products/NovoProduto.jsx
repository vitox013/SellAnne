import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Back from "../../components/Back";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    useUpdateUserMutation,
    useGetUserDataQuery,
} from "../users/userApiSlice";

const USER_REGEX = /^[a-zA-Z\ 0-9]{3,20}$/;

const NovoProduto = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const navigate = useNavigate();
    const { userId } = useAuth();
    const { id: fornecedorId } = useParams();

    const errRef = useRef();
    const [codigo, setCodigo] = useState("");
    const [produto, setProduto] = useState("");
    const [estoque, setEstoque] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [preco, setPreco] = useState("");
    const [precoVenda, setPrecoVenda] = useState("");
    const [porcentagemVenda, setPorcentagemVenda] = useState("");

    const [errMsg, setErrMsg] = useState("");
    const [duplicated, setDuplicated] = useState("");

    const [addProduct, { isSuccess, isLoading, error }] =
        useUpdateUserMutation();

    const { products } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.produtos,
        }),
    });

    const { fornecedores } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            fornecedores: data?.fornecedores,
        }),
    });

    useEffect(() => {
        if (products) {
            setDuplicated(products.find((prod) => prod.code == codigo));
        }
    }, [codigo]);

    useEffect(() => {
        if (fornecedores) {
            setFornecedor(
                fornecedores.find((fornecedor) => fornecedor_id == fornecedorId)
            );
        }
    }, [fornecedores]);

    const onCodigoChange = (e) => setCodigo(e.target.value);
    const onProdutoChange = (e) => setProduto(e.target.value);
    const onEstoqueChange = (e) => setEstoque(e.target.value);
    const onPrecoChange = (e) => setPreco(e.target.value);
    const onPrecoVendaChange = (e) => setPrecoVenda(e.target.value);
    const onPorcentagemVendaChange = (e) => setPorcentagemVenda(e.target.value);

    const canSave = codigo && produto && estoque && preco && !isLoading;

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addProduct({
                userId,
                produto: {
                    code: codigo,
                    productName: produto,
                    estoque: estoque,
                    preco: preco,
                    precoVenda: preco,
                    porcentagemVenda: 0,
                },
            });
        }
    };

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

    console.log(fornecedores)

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    return (
        <>
            <Back path="/produtos" />
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
                            <Form.Group className="mb-3" controlId="userId">
                                <Form.Control type="hidden" value={userId} />
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
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="codigo">
                                <Form.Label>Código</Form.Label>

                                <Form.Control
                                    type="number"
                                    pattern="[0-9]{11}"
                                    value={codigo}
                                    onChange={onCodigoChange}
                                    required
                                    className={
                                        (codigo <= 0 && codigo) || duplicated
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {duplicated && (
                                    <Form.Text>
                                        Já existe produto com esse código
                                    </Form.Text>
                                )}
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
                            <Form.Group className="mb-3" controlId="precoVenda">
                                <Form.Label>Preco de venda</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={precoVenda}
                                    onChange={onPrecoVendaChange}
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="porcentagem"
                            >
                                <Form.Label>
                                    Sua porcentagem na venda
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={
                                        fornecedor
                                            ? fornecedor.porcentagemPadrao
                                            : porcentagemVenda
                                    }
                                    onChange={onPorcentagemVendaChange}
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

export default NovoProduto;
