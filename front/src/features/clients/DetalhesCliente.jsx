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

const DetalhesPedido = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const [show, setShow] = useState(false);
    const [showPedido, setShowPedido] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [content, setContent] = useState([]);
    const [clienteNome, setClienteNome] = useState("");
    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [pedidos, setPedidos] = useState([]);
    const [cliente, setCliente] = useState({});
    const [productFound, setProductFound] = useState([]);
    const [list, setList] = useState([]);
    const [produtoId, setProdutoId] = useState("");
    const [qtdPaga, setQtdPaga] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [msg, setMsg] = useState([]);
    const [totalPago, setTotalPago] = useState("");
    const [aPagar, setAPagar] = useState(false);
    const [showStats, setShowStats] = useState(false);

    const { id: clientId } = useParams();

    const { userId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    let message = "";
    if (location.state) {
        message = location.state.message;
    }

    const { clients, products } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            clients: data?.clients,
            products: data?.produtos,
        }),
    });

    const [deleteClient, { isSuccess: deleteIsSuccess, error: errorDelete }] =
        useDeleteUserMutation(clientId);

    const [addNewPedido, { isSuccess: addIsSuccess, error: errorNewPedido }] =
        useUpdateUserMutation();

    const [updateProduct, { isSuccess: updateIsSuccess, error: errorUpdate }] =
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
                console.log(pedidos);
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

    console.log(totalPago);
    console.log(aPagar);

    useEffect(() => {
        if (deleteIsSuccess) {
            navigate("/clientes");
        }
        if (errorDelete) {
            setErrMsg("Erro ao deletar cliente");
        }
    }, [
        navigate,
        addIsSuccess,
        updateIsSuccess,
        addIsSuccess,
        errorDelete,
        errorNewPedido,
        errorUpdate,
        deleteIsSuccess,
    ]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term && products) {
            setProductFound(products.filter((prod) => prod.code == term));
        }
        if (products) {
            setList(
                products.map((prod) => (
                    <option value={prod.code} key={prod.code}>
                        {`${prod.productName} | ${formatter.format(
                            prod.preco
                        )}`}
                    </option>
                ))
            );
        }
        if (productFound.length > 0) {
            setProdutoId(productFound[0]._id);
        }

        setMsg(
            <h2 key={uuidv4()} className="mt-5 text-center">
                Nenhum pedido cadastrado
            </h2>
        );
    }, [term, products, quantidade]);

    useEffect(() => {
        if (addIsSuccess) {
            setProdutoId("");
            setQtdPaga("");
            setQuantidade("");
            setDebouncedTerm("");
            setShowPedido(false);
            setProductFound([]);
        }
    }, [addIsSuccess]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleShowPedido = () => setShowPedido(true);
    const handleClosePedido = () => setShowPedido(false);
    const handleShowStats = () => setShowStats(true);
    const handleCloseStats = () => setShowStats(false);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        await deleteClient({
            cliente: {
                _id: clientId,
            },
        });
    };

    const handleAddNewPedido = async (e) => {
        e.preventDefault();

        if (productFound.length > 0 && produtoId) {
            const canSave =
                productFound[0].estoque >= quantidade &&
                qtdPaga <= (productFound[0].preco * quantidade).toFixed(2) &&
                qtdPaga >= 0;

            if (canSave) {
                await addNewPedido({
                    cliente: {
                        _id: clientId,
                        pedido: {
                            produtoId: productFound[0]._id,
                            codigoProduto: productFound[0].code,
                            nomeProduto: productFound[0].productName,
                            quantidade,
                            qtdPaga,
                            valor: productFound[0].preco,
                        },
                    },
                });
                await updateProduct({
                    userId,
                    produto: {
                        _id: produtoId,
                        code: productFound[0].code,
                        productName: productFound[0].productName,
                        estoque: productFound[0].estoque - quantidade,
                        preco: productFound[0].preco,
                    },
                });
            }
        }
    };

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
                {showStats ? (
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
                ) : (
                    ""
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
                                    <Form.Group
                                        className="mb-3"
                                        controlId="codigo"
                                    >
                                        <Form.Label>Código produto</Form.Label>
                                        <Form.Control
                                            type="number"
                                            pattern="[0-9]{20}"
                                            inputMode="numeric"
                                            placeholder="Código"
                                            autoFocus
                                            value={debouncedTerm}
                                            onChange={(e) =>
                                                setDebouncedTerm(e.target.value)
                                            }
                                            className={
                                                productFound.length > 0
                                                    ? "is-valid"
                                                    : "is-invalid"
                                            }
                                            required
                                            list="listaProdutos"
                                        />
                                        <datalist id="listaProdutos">
                                            {list.length > 0 && list}
                                        </datalist>

                                        <Form.Text>
                                            {productFound.length > 0
                                                ? "Produto encontrado!"
                                                : "Os dados serão preenchidos automaticamente"}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="nomeProduto"
                                    >
                                        <Form.Label>Nome produto</Form.Label>
                                        <Form.Control
                                            value={
                                                productFound.length > 0
                                                    ? productFound[0]
                                                          .productName
                                                    : ""
                                            }
                                            readOnly
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="produtoId"
                                    >
                                        <Form.Control
                                            type="hidden"
                                            value={
                                                productFound.length > 0
                                                    ? productFound[0]._id
                                                    : ""
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="quantidade"
                                    >
                                        <Form.Label>Quantidade</Form.Label>
                                        <Form.Control
                                            type="number"
                                            required
                                            inputMode="numeric"
                                            max={
                                                productFound.length > 0
                                                    ? productFound[0].estoque
                                                    : ""
                                            }
                                            value={quantidade}
                                            onChange={(e) =>
                                                setQuantidade(e.target.value)
                                            }
                                            className={
                                                productFound.length > 0
                                                    ? productFound[0].estoque >=
                                                          quantidade &&
                                                      quantidade > 0
                                                        ? "is-valid"
                                                        : "is-invalid"
                                                    : ""
                                            }
                                        />
                                        <Form.Text>
                                            {productFound.length > 0
                                                ? productFound[0].estoque > 0
                                                    ? productFound[0].estoque +
                                                      " restantes"
                                                    : "SEM ESTOQUE"
                                                : ""}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="valor"
                                    >
                                        <Form.Label>Valor unidade</Form.Label>
                                        <Form.Control
                                            readOnly
                                            value={
                                                productFound.length > 0
                                                    ? formatter.format(
                                                          productFound[0].preco
                                                      )
                                                    : ""
                                            }
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="valorTotal"
                                    >
                                        <Form.Label>
                                            Valor total pedido
                                        </Form.Label>
                                        <Form.Control
                                            readOnly
                                            value={
                                                productFound.length > 0
                                                    ? formatter.format(
                                                          productFound[0]
                                                              .preco *
                                                              quantidade
                                                      )
                                                    : ""
                                            }
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="qtdPaga"
                                    >
                                        <Form.Label>Valor já pago</Form.Label>
                                        <Form.Control
                                            type="number"
                                            inputMode="numeric"
                                            max={
                                                productFound.length > 0
                                                    ? productFound[0].preco *
                                                      quantidade
                                                    : ""
                                            }
                                            required
                                            value={qtdPaga}
                                            onChange={(e) =>
                                                setQtdPaga(e.target.value)
                                            }
                                            className={
                                                productFound.length > 0
                                                    ? qtdPaga <=
                                                          (
                                                              productFound[0]
                                                                  .preco *
                                                              quantidade
                                                          ).toFixed(2) &&
                                                      qtdPaga &&
                                                      qtdPaga >= 0
                                                        ? "is-valid"
                                                        : "is-invalid"
                                                    : ""
                                            }
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
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
                                >
                                    Criar pedido
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Container>
                </Navbar>
            </Container>
        </>
    );
};

export default DetalhesPedido;
