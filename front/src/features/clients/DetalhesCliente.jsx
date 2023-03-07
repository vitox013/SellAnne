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
import Message from "../../utils/Message";
import useAuth from "../../hooks/useAuth";
import CardPedido from "../../components/CardPedido";
import { v4 as uuidv4 } from "uuid";
import {
    useGetUserDataQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from "../users/userApiSlice";
import { onlyNumber } from "../../utils/onlyNumber";
import { currency, toBRL, toNumber } from "../../utils/currency";
import { useDispatch, useSelector } from "react-redux";
import { setMsg } from "../infoMsg/msgSlice";
import EditClient from "./EditClient";
import Loading from "../../utils/Loading";

const DetalhesPedido = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const [show, setShow] = useState(false);
    const [showPedido, setShowPedido] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [empty, setEmpty] = useState("");
    const [content, setContent] = useState([]);
    const [clienteNome, setClienteNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [pedidos, setPedidos] = useState([]);
    const [cliente, setCliente] = useState({});
    const [nomesClientes, setNomesClientes] = useState([]);
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
    const dispatch = useDispatch();

    let message = useSelector((state) => state.infoMsg.msg);

    const { clients, fornecedores } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            clients: data?.clients,
            fornecedores: data?.fornecedores,
        }),
    });

    const [
        deleteClient,
        {
            isSuccess: deleteIsSuccess,
            error: errorDelete,
            isLoading: deleteLoading,
        },
    ] = useDeleteUserMutation(clientId);

    const [
        addNewPedido,
        {
            isSuccess: addIsSuccess,
            error: errorNewPedido,
            isLoading: addLoading,
        },
    ] = useUpdateUserMutation();

    const [createProduct, { isSuccess: createIsSuccess, error: errorCreate }] =
        useUpdateUserMutation();

    useEffect(() => {
        if (optionSelected != "Selecione fornecedor" && fornecedores) {
            let forn = fornecedores.filter(
                (forn) => forn.nomeFornecedor == optionSelected
            );
            forn?.length > 0 && setProdutosFornecedor(forn[0].produtos);

            setFornecedor(
                fornecedores.find(
                    (forn) => forn.nomeFornecedor === optionSelected
                )
            );
        }
    }, [optionSelected]);

    useEffect(() => {
        if (fornecedor?.porcentagemPadrao) {
            setPorcentagem(fornecedor?.porcentagemPadrao);
        }
        clearFields();
    }, [fornecedor]);

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
        if (clients) {
            setCliente(clients.find((client) => client._id === clientId));
            setNomesClientes(clients.map((client) => client.clientName));
        }
        setContent(<Loading />);

        if (Object.keys(cliente).length > 0) {
            setPedidos(cliente.pedidos);
            setClienteNome(cliente.clientName);
            setTelefone(cliente.telefone);

            if (pedidos?.length > 0) {
                setContent(
                    pedidos.map((ped) => (
                        <CardPedido
                            key={ped._id}
                            fornecedor={ped.fornecedor}
                            fornecedorId={ped.fornecedorId}
                            pedidoId={ped._id}
                            nomeProduto={ped.nomeProduto}
                            codigo={ped.codigoProduto}
                            quantidade={ped.quantidade}
                            valor={ped.valor}
                            valorVenda={ped.valorVenda}
                            porcentagem={ped.porcentagem}
                            qtdPaga={ped.qtdPaga}
                            metodo={ped.metodo}
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
                                ((ped.metodo == "Revenda"
                                    ? ped.quantidade * ped.valorVenda
                                    : ped.quantidade * ped.valor) -
                                    ped.qtdPaga),
                            0
                        )
                        .toFixed(2)
                );
            } else
                setContent(
                    <p className="alert alert-danger text-center mt-3">
                        Nenhum pedido cadastrado!
                    </p>
                );
        }
    }, [clients, cliente, pedidos]);

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
        setDebouncedCode("");
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
    const handleShowEdit = () => setShowEdit(true);
    const handleCloseEdit = () => setShowEdit(false);
    const handleCode = (e) => setDebouncedCode(e.target.value);
    const handlePrice = (e) => setPreco(e.target.value);
    const handlePriceVenda = (e) => setPrecoVenda(e.target.value);
    const handleQtdPaga = (e) => setQtdPaga(e.target.value);

    const canSave =
        code &&
        preco &&
        quantidade &&
        productName &&
        qtdPaga &&
        (precoVenda || porcentagem) &&
        optionSelected != "Selecione fornecedor" &&
        toNumber(qtdPaga) >= 0 &&
        (fornecedor?.metodo == "Porcentagem"
            ? toNumber(qtdPaga) <= quantidade * toNumber(preco)
            : toNumber(qtdPaga) <= quantidade * toNumber(precoVenda));

    const onDeleteClient = async (e) => {
        e.preventDefault();
        await deleteClient({
            cliente: {
                _id: clientId,
            },
        });
    };

    const handleAddNewPedido = async (e) => {
        e.preventDefault();

        if (canSave) {
            if (prodFound?.code) {
                await addNewPedido({
                    cliente: {
                        _id: clientId,
                        pedido: {
                            fornecedor: fornecedor.nomeFornecedor.trim(),
                            fornecedorId: fornecedor._id,
                            produtoId: prodFound._id,
                            codigoProduto: prodFound.code,
                            nomeProduto: prodFound.productName.trim(),
                            quantidade,
                            qtdPaga: toNumber(qtdPaga),
                            valor: prodFound.preco,
                            valorVenda: prodFound.precoVenda,
                            porcentagem: fornecedor.porcentagemPadrao,
                            metodo: fornecedor.metodo,
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
                            productName: productName.trim(),
                            preco: toNumber(preco),
                            precoVenda: toNumber(precoVenda),
                            porcentagemVenda: porcentagem,
                        },
                    },
                });
                await addNewPedido({
                    cliente: {
                        _id: clientId,
                        pedido: {
                            fornecedor: fornecedor.nomeFornecedor.trim(),
                            fornecedorId: fornecedor._id,
                            produtoId: code.toString(),
                            codigoProduto: code,
                            nomeProduto: productName.trim(),
                            quantidade,
                            qtdPaga: toNumber(qtdPaga),
                            valor: toNumber(preco),
                            valorVenda: toNumber(precoVenda),
                            porcentagem,
                            metodo: fornecedor.metodo,
                        },
                    },
                });
            }
        }
    };

    useEffect(() => {
        if (prodFound?.code) {
            setPreco(toBRL(prodFound.preco.toFixed(2)));
            fornecedor?.metodo == "Revenda" &&
                setPrecoVenda(toBRL(prodFound.precoVenda.toFixed(2)));
            setProductName(prodFound.productName);
            setPorcentagem(prodFound.porcentagemVenda);
        }
    }, [prodFound]);

    useEffect(() => {
        if (deleteIsSuccess) {
            navigate("/clientes");
            dispatch(setMsg("Cliente deletado com sucesso!"));
        }
        if (errorDelete) {
            setErrMsg("Erro ao deletar cliente");
        }
        if (addIsSuccess) {
            setProdutoId("");
            setOptionSelected("");
            clearFields();
            setShowPedido(false);
            setProdFound({});
            dispatch(setMsg("Novo pedido criado com sucesso!"));
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
        addIsSuccess,
        createIsSuccess,
        errorDelete,
        errorNewPedido,
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
                        {deleteLoading && <Loading />}
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
                                onClick={onDeleteClient}
                                disabled={deleteLoading}
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
                        <span className="fw-bold">{clienteNome}</span>
                        <i
                            className="bx bxs-edit-alt ms-3 pointer fs-3"
                            onClick={handleShowEdit}
                        ></i>
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
                {telefone && (
                    <Row>
                        <Col>
                            Telefone:{" "}
                            <span className="fw-bold">{telefone}</span>
                        </Col>
                    </Row>
                )}

                <EditClient
                    showEdit={showEdit}
                    handleClose={handleCloseEdit}
                    nome={clienteNome}
                    phone={cliente?.telefone ? cliente.telefone : ""}
                    nomesClientes={nomesClientes}
                />

                {showStats && (
                    <Row className="mt-2">
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
                {content}

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
                                        {options?.length > 0 ? (
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
                                                    Nenhum fornecedor cadastrado
                                                </p>
                                                <Link to="/fornecedores/novofornecedor">
                                                    <Button variant="success">
                                                        Criar fornecedor
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </Form.Group>

                                    {options?.length > 0 &&
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
                                                                        onlyNumber(
                                                                            e
                                                                        )
                                                                    )
                                                                }
                                                                required
                                                                list="listaProdutos"
                                                            />
                                                            <datalist id="listaProdutos">
                                                                {list?.length >
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
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    value={
                                                                        preco
                                                                    }
                                                                    disabled={
                                                                        prodFound
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handlePrice(
                                                                            currency(
                                                                                e
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>

                                                    {fornecedor?.metodo ==
                                                    "Revenda" ? (
                                                        <Col>
                                                            <Form.Group
                                                                className="mb-3"
                                                                controlId="precoVenda"
                                                            >
                                                                <Form.Label>
                                                                    Preço venda
                                                                </Form.Label>
                                                                <InputGroup>
                                                                    <InputGroup.Text>
                                                                        R$
                                                                    </InputGroup.Text>
                                                                    <Form.Control
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        required
                                                                        disabled={
                                                                            prodFound
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        value={
                                                                            precoVenda
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handlePriceVenda(
                                                                                currency(
                                                                                    e
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
                                                    )}
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
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    required
                                                                    value={
                                                                        qtdPaga
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQtdPaga(
                                                                            currency(
                                                                                e
                                                                            )
                                                                        )
                                                                    }
                                                                    className={
                                                                        (precoVenda ||
                                                                            porcentagem) &&
                                                                        preco &&
                                                                        quantidade &&
                                                                        qtdPaga &&
                                                                        !(
                                                                            toNumber(
                                                                                qtdPaga
                                                                            ) <=
                                                                            (precoVenda
                                                                                ? quantidade *
                                                                                  toNumber(
                                                                                      precoVenda
                                                                                  )
                                                                                : quantidade *
                                                                                  toNumber(
                                                                                      preco
                                                                                  ))
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
                                                                            ? toNumber(
                                                                                  preco
                                                                              ) *
                                                                              quantidade
                                                                            : quantidade *
                                                                              toNumber(
                                                                                  precoVenda
                                                                              )
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
                                                                                ((toNumber(
                                                                                    preco
                                                                                ) *
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
                                                                                (toNumber(
                                                                                    precoVenda
                                                                                ) -
                                                                                    toNumber(
                                                                                        preco
                                                                                    )) *
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
                                {addLoading && <Loading />}
                            </Modal.Body>
                            {options?.length > 0 && (
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
                                        disabled={!canSave || addLoading}
                                        autoFocus={canSave}
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
