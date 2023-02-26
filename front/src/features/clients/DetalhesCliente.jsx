import { useState, useEffect, React } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
    Container,
    Navbar,
    Button,
    Modal,
    Card,
    Row,
    Col,
    Form,
    InputGroup,
} from "react-bootstrap";
import Message from "../../components/Message";
import useAuth from "../../hooks/useAuth";
import CardPedido from "../../components/CardPedido";
import { v4 as uuidv4 } from "uuid";
import {
    useGetUserDataQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from "../users/userApiSlice";
import { OnlyNumber } from "../../components/OnlyNumber";

const DetalhesPedido = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const [show, setShow] = useState(false);
    const [showPedido, setShowPedido] = useState(false);
    const [msg, setMsg] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [content, setContent] = useState([]);
    const [clienteNome, setClienteNome] = useState("");
    const [pedidos, setPedidos] = useState([]);
    const [cliente, setCliente] = useState({});
    const [fornecedor, setFornecedor] = useState({});
    const [produtosFornecedor, setProdutosFornecedor] = useState([]);
    const [prodFound, setProdFound] = useState({});
    const [list, setList] = useState([]);
    const [produtoId, setProdutoId] = useState("");
    const [code, setCode] = useState("");
    const [debouncedCode, setDebouncedCode] = useState("");
    const [productName, setProductName] = useState("");
    const [preco, setPreco] = useState("");
    const [precoVenda, setPrecoVenda] = useState("");
    const [porcentagem, setPorcentagem] = useState("");
    const [qtdPaga, setQtdPaga] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [totalPago, setTotalPago] = useState("");
    const [aPagar, setAPagar] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [optionSelected, setOptionSelected] = useState("");
    const [options, setOptions] = useState([]);

    const { id: clientId } = useParams();

    const { userId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    let message = "";
    if (location.state) {
        message = location.state.message;
    }

    const { clients, fornecedores } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            clients: data?.clients,
            fornecedores: data?.fornecedores,
        }),
    });

    const [deleteClient, { isSuccess: deleteIsSuccess, error: errorDelete }] =
        useDeleteUserMutation(clientId);

    const [addNewPedido, { isSuccess: addIsSuccess, error: errorNewPedido }] =
        useUpdateUserMutation();

    const [updateProduct, { isSuccess: updateIsSuccess, error: errorUpdate }] =
        useUpdateUserMutation();

    const [createProduct, { isSuccess: createIsSuccess, error: errorCreate }] =
        useUpdateUserMutation();

    useEffect(() => {
        if (clients) {
            setCliente(clients.find((client) => client._id === clientId));
        }

        if (cliente) {
            setPedidos(cliente.pedidos);

            if (pedidos) {
                setContent(
                    pedidos.map((ped) => (
                        <CardPedido
                            key={ped._id}
                            produtoId={ped.produtoId}
                            fornecedor={ped.fornecedor}
                            fornecedorId={ped.fornecedorId}
                            pedidoId={ped._id}
                            nomeProduto={ped.nomeProduto}
                            codigo={ped.codigoProduto}
                            quantidade={ped.quantidade}
                            valor={ped.valor}
                            qtdPaga={ped.qtdPaga}
                            clientNome={cliente.clientName}
                        />
                    ))
                );
                setTotalPago(
                    pedidos.reduce((acc, ped) => acc + ped.qtdPaga, 0)
                );
                setAPagar(
                    pedidos
                        .reduce(
                            (acc, ped) =>
                                acc +
                                (ped.quantidade * ped.valor - ped.qtdPaga),
                            0
                        )
                        .toFixed(2)
                );
            }
        }
        if (cliente) {
            setClienteNome(cliente.clientName);
        }
    }, [clients, cliente, pedidos]);

    useEffect(() => {
        if (optionSelected != "Selecione fornecedor" && fornecedores) {
            let forn = fornecedores.filter(
                (forn) => forn.nomeFornecedor == optionSelected
            );
            forn && forn.length > 0 && setProdutosFornecedor(forn[0].produtos);

            setFornecedor(
                fornecedores.find(
                    (forn) => forn.nomeFornecedor === optionSelected
                )
            );
            clearFields();
        }
    }, [optionSelected]);

    useEffect(() => {
        if (code && produtosFornecedor) {
            setProdFound(produtosFornecedor.find((prod) => prod.code == code));
        }
        if (produtosFornecedor) {
            setList(
                produtosFornecedor.map((prod) => (
                    <option value={prod.code} key={prod.code}>
                        {`${prod.productName} | ${formatter.format(
                            prod.preco
                        )}`}
                    </option>
                ))
            );
        }
        setMsg(
            <h2 key={uuidv4()} className="mt-5 text-center">
                Nenhum pedido cadastrado
            </h2>
        );
    }, [code, fornecedores, quantidade, optionSelected, produtosFornecedor]);

    useEffect(() => {
        if (fornecedores) {
            setOptions(
                fornecedores.map((forn) => (
                    <option value={forn.nomeFornecedor} key={forn._id}>
                        {forn.nomeFornecedor}
                    </option>
                ))
            );
        }
    }, [fornecedores]);

    useEffect(() => {
        const timer = setTimeout(() => setCode(debouncedCode), 1000);
        debouncedCode == "" && clearFields();
        return () => clearTimeout(timer);
    }, [debouncedCode]);

    const clearFields = () => {
        setPreco("");
        setPrecoVenda("");
        setProductName("");
        setQtdPaga("");
        setQuantidade("");
        setCode("");
        setProdFound({});
        setPorcentagem("");
        setDebouncedCode("")
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleShowPedido = () => setShowPedido(true);
    const handleClosePedido = () => {
        setShowPedido(false);
        setOptionSelected("");
        clearFields();
    };
    const handleShowStats = () => setShowStats(true);
    const handleCloseStats = () => setShowStats(false);
    const handleCode = (e) => setDebouncedCode(e.target.value);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        await deleteClient({
            cliente: {
                _id: clientId,
            },
        });
    };

    const canSave =
        code &&
        preco &&
        quantidade &&
        productName &&
        (precoVenda || porcentagem) &&
        qtdPaga &&
        optionSelected != "Selecione fornecedor" &&
        qtdPaga >= 0 &&
        qtdPaga <= (quantidade * precoVenda).toFixed(2);

    const handleAddNewPedido = async (e) => {
        e.preventDefault();

        if (canSave) {
            if (prodFound) {
                await addNewPedido({
                    cliente: {
                        _id: clientId,
                        pedido: {
                            fornecedor: fornecedor.nomeFornecedor,
                            fornecedorId: fornecedor._id,
                            produtoId: prodFound._id,
                            codigoProduto: prodFound.code,
                            nomeProduto: prodFound.productName,
                            quantidade,
                            qtdPaga,
                            valor: prodFound.preco,
                        },
                    },
                });
            } else {
                await createProduct({
                    userId,
                    fornecedor: {
                        _id: fornecedor._id,
                        produto: {
                            code,
                            productName,
                            preco,
                            precoVenda,
                            porcentagem,
                        },
                    },
                });
                await addNewPedido({
                    cliente: {
                        _id: clientId,
                        pedido: {
                            fornecedor: fornecedor.nomeFornecedor,
                            fornecedorId: fornecedor._id,
                            produtoId: code.toString(),
                            codigoProduto: code,
                            nomeProduto: productName,
                            quantidade,
                            qtdPaga,
                            valor: preco,
                        },
                    },
                });
            }
        }
    };

    useEffect(() => {
        if (prodFound) {
            setPreco(prodFound.preco);
            setPrecoVenda(prodFound.precoVenda);
            setProductName(prodFound.productName);
            setPorcentagem(prodFound.porcentagemVenda);
        }
    }, [prodFound]);

    useEffect(() => {
        if (deleteIsSuccess) {
            navigate("/clientes");
        }
        if (errorDelete) {
            setErrMsg("Erro ao deletar cliente");
        }
        if (addIsSuccess) {
            setProdutoId("");
            clearFields();
            setShowPedido(false);
            setProdFound({});
        } else if (errorNewPedido) {
            setErrMsg("Erro ao adicionar pedido");
        }
        if (createIsSuccess) {
            setProdutoId("");
            clearFields();
            setShowPedido(false);
            setProdFound({});
        } else if (errorCreate) {
            setErrMsg("Erro ao adicionar produto");
        }
    }, [
        navigate,
        addIsSuccess,
        updateIsSuccess,
        addIsSuccess,
        createIsSuccess,
        errorDelete,
        errorNewPedido,
        errorUpdate,
        errorCreate,
        deleteIsSuccess,
    ]);

    return (
        <>
            <Navbar className="text-black mx-0 py-2 fluid bg-light shadow-sm">
                <Container className="d-flex align-items-center">
                    <Link
                        to="/clientes"
                        className=" d-flex align-items-center text-dark"
                    >
                        <i className="bx bx-left-arrow-alt fs-1"></i>
                        <span className="fw-bold fs-5 mb-0 ">Voltar</span>
                    </Link>

                    <Button variant="" onClick={handleShow}>
                        <i className="bx bx-trash fs-2 text-dark"></i>
                    </Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Tem certeza?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Ao confirmar, o cliente será excluído do sistema.
                            {errMsg && (
                                <p className="alert alert-danger">{errMsg}</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="danger"
                                onClick={onSaveUserClicked}
                            >
                                Excluir
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </Navbar>

            <Container className="pt-2">
                <Row>
                    <Col className="h2 gap-2 d-flex align-items-end">
                        {clienteNome}
                        {showStats ? (
                            <i
                                className="bx bxs-low-vision pointer"
                                onClick={handleCloseStats}
                            ></i>
                        ) : (
                            <i
                                className="bx bxs-show pointer"
                                onClick={handleShowStats}
                            ></i>
                        )}
                    </Col>
                </Row>
                {showStats && (
                    <>
                        <Row>
                            <Col xs={6} md={2}>
                                <Card className="p-1 text-center bg-success bg-opacity-75">
                                    <p className="my-0">Total pago</p>
                                    <p className="my-0">
                                        {formatter.format(totalPago)}
                                    </p>
                                </Card>
                            </Col>
                            <Col xs={6} md={2}>
                                <Card className="p-1 text-center bg-danger bg-opacity-75">
                                    <p className="my-0">À pagar</p>
                                    <p className="my-0">
                                        {formatter.format(aPagar)}
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
                <Card className=" px-2 py-2 mt-3 text-black shadow-sm fw-bold">
                    <Row>
                        <Col xs={4}>Item</Col>
                        <Col className="ps-0">Qtd</Col>
                        <Col className="ps-0">Valor</Col>
                        <Col>Situação</Col>
                    </Row>
                </Card>
                {message && (
                    <Message msg={message} type="alert alert-success" />
                )}
                {pedidos ? (pedidos.length > 0 ? [content] : [msg]) : null}

                <Navbar
                    className="text-black mb-3 mx-0 py-0 fluid"
                    fixed="bottom"
                >
                    <Container className="d-flex justify-content-center">
                        <Button
                            variant="success"
                            onClick={handleShowPedido}
                            className="d-flex align-items-centerjustify-content-center"
                        >
                            <i className="bx bx-plus fs-4"></i>
                            <span>Criar novo pedido</span>
                        </Button>

                        <Modal
                            show={showPedido}
                            onHide={handleClosePedido}
                            backdrop="static"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Cadastre novo pedido</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        {options &&
                                            (options.length > 0 ? (
                                                <>
                                                    <Form.Label>
                                                        Fornecedor
                                                    </Form.Label>
                                                    <Form.Select
                                                        className="w-75"
                                                        onChange={(e) =>
                                                            setOptionSelected(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option>
                                                            Selecione fornecedor
                                                        </option>
                                                        {options}
                                                    </Form.Select>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <p className="alert alert-danger text-center">
                                                        Nenhum fornecedor
                                                        cadastrado
                                                    </p>
                                                    <Link to="/fornecedores/novofornecedor">
                                                        <Button variant="success">
                                                            Criar fornecedor
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ))}
                                    </Form.Group>

                                    {options &&
                                        options.length > 0 &&
                                        optionSelected !=
                                            "Selecione fornecedor" &&
                                        optionSelected && (
                                            <>
                                                <Row>
                                                    <Col>
                                                        <Form.Group
                                                            className="mb-3"
                                                            controlId="codigo"
                                                        >
                                                            <Form.Label>
                                                                Código
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                maxLength={18}
                                                                inputMode="numeric"
                                                                placeholder="Código"
                                                                autoFocus
                                                                value={
                                                                    debouncedCode
                                                                }
                                                                onChange={(e) =>
                                                                    handleCode(
                                                                        OnlyNumber(
                                                                            e
                                                                        )
                                                                    )
                                                                }
                                                                required
                                                                list="listaProdutos"
                                                            />
                                                            <datalist id="listaProdutos">
                                                                {list.length >
                                                                    0 && list}
                                                            </datalist>

                                                            <Form.Text>
                                                                {prodFound >
                                                                    0 &&
                                                                    "Produto encontrado!"}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group
                                                            className="mb-3"
                                                            controlId="nomeProduto"
                                                        >
                                                            <Form.Label>
                                                                Nome produto
                                                            </Form.Label>
                                                            <Form.Control
                                                                value={
                                                                    productName
                                                                }
                                                                maxLength={18}
                                                                disabled={
                                                                    prodFound
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) =>
                                                                    setProductName(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Form.Group
                                                            className="mb-3"
                                                            controlId="valor"
                                                        >
                                                            <Form.Label>
                                                                Preço
                                                            </Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text>
                                                                    R$
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    type="number"
                                                                    inputMode="numeric"
                                                                    value={Number(
                                                                        preco
                                                                    ).toString()}
                                                                    disabled={
                                                                        prodFound
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setPreco(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                    className="CurrencyInput"
                                                                />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>

                                                    {fornecedor &&
                                                        (fornecedor.metodo ==
                                                        "Revenda" ? (
                                                            <Col>
                                                                <Form.Group
                                                                    className="mb-3"
                                                                    controlId="precoVenda"
                                                                >
                                                                    <Form.Label>
                                                                        Preço
                                                                        venda
                                                                    </Form.Label>
                                                                    <InputGroup>
                                                                        <InputGroup.Text>
                                                                            R$
                                                                        </InputGroup.Text>
                                                                        <Form.Control
                                                                            type="number"
                                                                            inputMode="numeric"
                                                                            pattern="[0-9]*"
                                                                            required
                                                                            disabled={
                                                                                prodFound
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            value={Number(
                                                                                precoVenda
                                                                            ).toString()}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setPrecoVenda(
                                                                                    Number(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                )
                                                                            }
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Col>
                                                        ) : (
                                                            <Col xs={6}>
                                                                <Form.Group
                                                                    className="mb-3"
                                                                    controlId="porcentagem"
                                                                >
                                                                    <Form.Label>
                                                                        Porcentagem
                                                                        %
                                                                    </Form.Label>
                                                                    <InputGroup>
                                                                        <Form.Control
                                                                            type="text"
                                                                            inputMode="numeric"
                                                                            pattern="[0-9]*"
                                                                            max="100"
                                                                            required
                                                                            disabled={
                                                                                prodFound
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            value={
                                                                                porcentagem
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setPorcentagem(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                        <InputGroup.Text>
                                                                            %
                                                                        </InputGroup.Text>
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Col>
                                                        ))}
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Form.Group
                                                            className="mb-3"
                                                            controlId="quantidade"
                                                        >
                                                            <Form.Label>
                                                                Quantidade
                                                            </Form.Label>
                                                            <Form.Control
                                                                className="w-50"
                                                                type="number"
                                                                pattern="[0-9]*"
                                                                required
                                                                inputMode="numeric"
                                                                value={
                                                                    quantidade
                                                                }
                                                                onChange={(e) =>
                                                                    setQuantidade(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group
                                                            className="mb-3"
                                                            controlId="qtdPaga"
                                                        >
                                                            <Form.Label>
                                                                Valor já pago
                                                            </Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text>
                                                                    R$
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    type="number"
                                                                    inputMode="numeric"
                                                                    pattern="[0-9]*"
                                                                    required
                                                                    value={
                                                                        qtdPaga
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setQtdPaga(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={
                                                                        (precoVenda ||
                                                                            porcentagem) &&
                                                                        preco &&
                                                                        quantidade &&
                                                                        qtdPaga &&
                                                                        !(
                                                                            qtdPaga <=
                                                                            (precoVenda
                                                                                ? quantidade *
                                                                                  precoVenda
                                                                                : quantidade *
                                                                                  preco)
                                                                        ) &&
                                                                        "is-invalid"
                                                                    }
                                                                />
                                                            </InputGroup>

                                                            {(precoVenda ||
                                                                porcentagem) &&
                                                                quantidade && (
                                                                    <Form.Text>
                                                                        Total
                                                                        pedido:
                                                                        R${" "}
                                                                        {(porcentagem
                                                                            ? preco *
                                                                              quantidade
                                                                            : quantidade *
                                                                              precoVenda
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </Form.Text>
                                                                )}
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                {(precoVenda || porcentagem) &&
                                                    preco &&
                                                    quantidade && (
                                                        <Card className="text-center bg-success bg-opacity-50">
                                                            <Row>
                                                                <Col className="fw-bold">
                                                                    Lucro com a
                                                                    venda:{" "}
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                {porcentagem ? (
                                                                    <Col className="fw-bold">
                                                                        {formatter.format(
                                                                            (
                                                                                ((preco *
                                                                                    porcentagem) /
                                                                                    100) *
                                                                                quantidade
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </Col>
                                                                ) : (
                                                                    <Col className="fw-bold">
                                                                        {formatter.format(
                                                                            (
                                                                                (precoVenda -
                                                                                    preco) *
                                                                                quantidade
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </Col>
                                                                )}
                                                            </Row>
                                                        </Card>
                                                    )}
                                            </>
                                        )}
                                </Form>
                            </Modal.Body>
                            {options && options.length > 0 && (
                                <Modal.Footer>
                                    <Button
                                        variant="danger"
                                        onClick={handleClosePedido}
                                    >
                                        Fechar
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={handleAddNewPedido}
                                        disabled={!canSave}
                                    >
                                        Criar pedido
                                    </Button>
                                </Modal.Footer>
                            )}
                        </Modal>
                    </Container>
                </Navbar>
            </Container>
        </>
    );
};

export default DetalhesPedido;
