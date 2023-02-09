import { useState, useEffect, React } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useDeleteClientMutation, useGetClientsQuery } from "./clientsApiSlice";
import { useGetProductsQuery } from "../products/productsApiSlice";
import useAuth from "../../hooks/useAuth";
import CardPedido from "../../components/CardPedido";
import { useGetPedidosQuery } from "../pedidos/pedidosApiSlice";
import { useAddNewPedidoMutation } from "../pedidos/pedidosApiSlice";

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
    const [products, setProducts] = useState([]);
    const [productFound, setProductFound] = useState([]);
    const [list, setList] = useState([]);
    const [produtoId, setProdutoId] = useState("");
    const [qtdPaga, setQtdPaga] = useState(0);
    const [quantidade, setQuantidade] = useState(0);
    const [msg, setMsg] = useState([]);

    const { id: clientId } = useParams();

    const { userId } = useAuth();
    const navigate = useNavigate();

    const { client: cliente } = useGetClientsQuery(userId, {
        selectFromResult: ({ data }) => ({
            client: data?.entities[clientId],
        }),
    });
    const { pedidos } = useGetPedidosQuery(clientId, {
        selectFromResult: ({ data }) => ({
            pedidos: data?.entities,
        }),
    });

    const { products: produtos } = useGetProductsQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.entities,
        }),
    });

    const [deleteClient, { isSuccess, error }] =
        useDeleteClientMutation(clientId);

    const [addNewPedido, { isSuccess: addIsSuccess }] =
        useAddNewPedidoMutation();

    useEffect(() => {
        if (cliente && produtos) {
            const products = Object.keys(produtos).map((key) => produtos[key]);
            setProducts(products);
            setContent([]);

            if (pedidos) {
                const orders = Object.keys(pedidos).map((key) => pedidos[key]);

                orders.map((ped) => {
                    products.map(function (prod) {
                        if (prod._id == ped.produtoId) {
                            setContent((oldArray) => [
                                ...oldArray,
                                <CardPedido
                                    key={ped._id}
                                    path={ped._id}
                                    produto={prod.produto}
                                    codigo={prod.codigo}
                                    quantidade={ped.quantidade}
                                    valor={formatter.format(prod.preco)}
                                    qtdPaga={ped.qtdPaga}
                                />,
                            ]);
                        }
                    });
                });
            }
        }
        if (cliente) {
            setClienteNome(cliente.nome);
        }
    }, [pedidos, cliente, produtos]);

    useEffect(() => {
        if (isSuccess) {
            navigate("/clientes");
        }
        if (error) {
            setErrMsg("Erro ao deletar cliente");
        }
    }, [isSuccess, navigate, error]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term && products) {
            setProductFound(products.filter((prod) => prod.codigo == term));
        }
        if (products) {
            setList(
                products.map((prod) => (
                    <option value={prod.codigo} key={prod.codigo}>
                        {`${prod.produto} | ${formatter.format(prod.preco)}`}
                    </option>
                ))
            );
        }
        if (productFound.length > 0) {
            setProdutoId(productFound[0].id);
        } else {
            setMsg(
                <h2 className="mt-5 text-center">Nenhum pedido cadastrado</h2>
            );
        }
    }, [term, products, quantidade]);

    useEffect(() => {
        if (addIsSuccess) {
            setCodigo("");
            setProdutoId("");
            setQtdPaga("");
            setQuantidade("");
            setShowPedido(false);
        }
    }, [addIsSuccess]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleShowPedido = () => setShowPedido(true);
    const handleClosePedido = () => setShowPedido(false);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        await deleteClient({ clientId });
    };

    const handleAddNewPedido = async (e) => {
        e.preventDefault();
        console.log(clientId, produtoId, qtdPaga, quantidade);

        await addNewPedido({ clientId, produtoId, quantidade, qtdPaga });
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
                            <Button variant="success" onClick={handleClose}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </Navbar>
            <Container className="pt-2">
                <h2>{clienteNome}</h2>
                <Card className=" px-2 py-2 mt-3 text-black shadow-sm fw-bold">
                    <Row className="text-center">
                        <Col xs={3}>Item</Col>
                        <Col xs={2}>Qtd</Col>
                        <Col xs={3}>Valor</Col>
                        <Col xs={4}>Situação</Col>
                    </Row>
                </Card>
                {pedidos ? [content] : [msg]}
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
                                                    ? productFound[0].produto
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
                                                    ? productFound[0].id
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
                                            value={quantidade}
                                            onChange={(e) =>
                                                setQuantidade(e.target.value)
                                            }
                                        />
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
                                        controlId="qtdPaga"
                                    >
                                        <Form.Label>
                                            Quantidade já paga
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            inputMode="numeric"
                                            required
                                            value={qtdPaga}
                                            onChange={(e) =>
                                                setQtdPaga(e.target.value)
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
