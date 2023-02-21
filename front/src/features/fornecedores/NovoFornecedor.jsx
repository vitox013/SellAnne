import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Back from "../../components/Back";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    useUpdateUserMutation,
    useGetUserDataQuery,
} from "../users/userApiSlice";

const USER_REGEX = /^[a-zA-Z\ 0-9]{3,20}$/;

const NovoFornecedor = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const navigate = useNavigate();
    const { userId } = useAuth();

    const errRef = useRef();
    const [codigo, setCodigo] = useState("");
    const [nomeFornecedor, setNomeFornecedor] = useState("");
    const [estoque, setEstoque] = useState("");
    const [preco, setPreco] = useState("");
    const [porcentagem, setPorcentagem] = useState("");

    const [opcao, setOpcao] = useState("");

    const [errMsg, setErrMsg] = useState("");
    const [duplicated, setDuplicated] = useState("");

    const [addFornecedor, { isSuccess, isLoading, error }] =
        useUpdateUserMutation();

    const { products } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.produtos,
        }),
    });

    useEffect(() => {
        if (isSuccess) {
            setOpcao("");
            setNomeFornecedor("");
            navigate("/fornecedores");
        }
        if (error) {
            setErrMsg(error.data.message);
        }
    }, [isSuccess, navigate, error]);

    useEffect(() => {
        if (products) {
            setDuplicated(products.find((prod) => prod.code == codigo));
        }
    }, [codigo]);

    const onNomeChange = (e) => setNomeFornecedor(e.target.value);
    const onSelectOption = (e) => setOpcao(e.target.value);

    const canSave = opcao != "Selecione método" && nomeFornecedor;

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addFornecedor({
                userId,
                fornecedor: {
                    nomeFornecedor,
                    metodo: opcao,
                    porcentagemPadrao: porcentagem,
                },
            });
        }
    };

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    return (
        <>
            <Back path="/fornecedores" />
            <Container>
                <Row className="px-2 mt-md-5">
                    <Col className="mt-2 col-12 text-center">
                        <h2 className="fw-bold">
                            Cadastre seu novo Fornecedor
                        </h2>
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
                                    value={nomeFornecedor}
                                    onChange={onNomeChange}
                                    className="text-capitalize"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="metodo">
                                <Form.Label>Método</Form.Label>
                                <Form.Select
                                    className="w-75"
                                    onChange={onSelectOption}
                                >
                                    <option>Selecione método</option>
                                    <option value="Revenda">Revenda</option>
                                    <option value="Porcentagem">
                                        Porcentagem total
                                    </option>
                                </Form.Select>
                            </Form.Group>
                            {opcao == "Porcentagem" && (
                                <Form.Group className="mb-3" controlId="metodo">
                                    <Form.Label>
                                        Defina a porcentagem padrão
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        max="100"
                                        className="w-75"
                                        value={porcentagem}
                                        onChange={(e) =>
                                            setPorcentagem(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            )}

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

export default NovoFornecedor;
