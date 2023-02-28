import React from "react";
import { Col, Container, Row, Form, Button, InputGroup } from "react-bootstrap";
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

    const { fornecedores } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            fornecedores: data?.fornecedores,
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
        // if (fornecedores) {
        //     setDuplicated(fornecedores.find((forn) => forn.nome == codigo));
        // }
        if (fornecedores) {
            fornecedores.map((forn) =>
                forn.nomeFornecedor == nomeFornecedor
                    ? setDuplicated(true)
                    : setDuplicated(false)
            );
        }
    }, [nomeFornecedor]);

    const onNomeChange = (e) => setNomeFornecedor(e.target.value);
    const onSelectOption = (e) => setOpcao(e.target.value);

    const canSave =
        opcao != "Selecione método" &&
        opcao != "" &&
        nomeFornecedor &&
        (opcao == "Porcentagem" ? porcentagem > 0 : true);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave && !duplicated) {
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
                                    className={duplicated && "is-invalid"}
                                    maxLength="25"
                                    required
                                />
                                {duplicated && (
                                    <Form.Text className="text-danger">
                                        Nome já cadastrado!
                                    </Form.Text>
                                )}
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
                                <Row>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="metodo"
                                    >
                                        <Form.Label>
                                            Defina a porcentagem padrão
                                        </Form.Label>
                                        <Row>
                                            <Col xs={4}>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="number"
                                                        max="100"
                                                        value={porcentagem}
                                                        onChange={(e) =>
                                                            setPorcentagem(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <InputGroup.Text>
                                                        %
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Row>
                            )}
                            <Button
                                variant="success"
                                disabled={!canSave || duplicated}
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
