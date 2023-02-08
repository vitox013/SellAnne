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
} from "react-bootstrap";
import { useDeleteClientMutation, useGetClientsQuery } from "./clientsApiSlice";
import { useGetProductsQuery } from "../products/productsApiSlice";
import useAuth from "../../hooks/useAuth";
import CardPedido from "../../components/CardPedido";
import NavFooter from "../../components/NavFooter";

const DetalhesPedido = () => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const [show, setShow] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [content, setContent] = useState([]);
    const [clientPedidos, setClientPedidos] = useState([]);
    const [products, setProducts] = useState([]);

    const [clienteNome, setClienteNome] = useState("");

    const { id } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();

    const { client: pedidos, clientName } = useGetClientsQuery(userId, {
        selectFromResult: ({ data }) => ({
            client: data?.entities[id].pedidos,
            clientName: data?.entities[id].nome,
        }),
    });

    const { products: produtos } = useGetProductsQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.entities,
        }),
    });

    const [deleteClient, { isSuccess, error }] = useDeleteClientMutation(id);

    useEffect(() => {
        setClientPedidos(pedidos);
    }, [pedidos]);

    useEffect(() => {
        if (isSuccess) {
            navigate("/clientes");
        }
        if (error) {
            setErrMsg("Erro ao deletar cliente");
        }
    }, [isSuccess, navigate, error]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        await deleteClient({ id });
    };

    useEffect(() => {
        if (pedidos) {
            if (produtos) {
                const products = Object.keys(produtos).map(
                    (key) => produtos[key]
                );

                pedidos.map((item) => {
                    products.map(function (prod) {
                        if (prod._id == item.produto) {
                            return setContent(
                                <CardPedido
                                    key={item._id}
                                    path={item._id}
                                    produto={prod.produto}
                                    codigo={prod.codigo}
                                    quantidade={item.quantidade}
                                    valor={formatter.format(prod.preco)}
                                    status={item.situacao}
                                />
                            );
                        }
                    });
                });
            }
        }
        if (clientName) {
            setClienteNome(clientName);
        }
    }, [pedidos, clienteNome, produtos]);

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
                <Card className=" px-2 py-2 mt-3 text-black shadow-sm bg-cor-1 fw-bold">
                    <Row className="text-center">
                        <Col xs={3}>Item</Col>
                        <Col xs={2}>Qtd</Col>
                        <Col xs={3}>Valor</Col>
                        <Col xs={4}>Situação</Col>
                    </Row>
                </Card>
                {content}
                <NavFooter
                    path="/clientes/novopedido"
                    info="Novo pedido"
                    icon="bx bx-plus me-1"
                />
            </Container>
        </>
    );
};

export default DetalhesPedido;
