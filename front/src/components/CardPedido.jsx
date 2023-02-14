import React, { useEffect } from "react";
import { useState } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import {
    useDeleteUserMutation,
    useGetUserDataQuery,
    useUpdateUserMutation,
} from "../features/users/userApiSlice";
import useAuth from "../hooks/useAuth";

const CardPedido = ({
    pedidoId,
    produtoId,
    nomeProduto,
    quantidade,
    valor,
    codigo,
    qtdPaga,
    clientNome,
}) => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const { id: clientId } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [showExcluir, setShowExcluir] = useState(false);
    const [quantity, setQuantity] = useState(quantidade);
    const [quantPaga, setQuantPaga] = useState(qtdPaga);
    const [pago, setPago] = useState(false);
    const [produto, setProduto] = useState();
    const [alterado, setAlterado] = useState(false);
    const [canUpdateProduto, setCanUpdateProduto] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [
        updateProduct,
        { isSuccess: isUpdateProductSuccess, error: errorUpdateProduct },
    ] = useUpdateUserMutation();

    const [
        updatePedido,
        { isSuccess: isUpdatePedidoSuccess, error: errorUpdatePedido },
    ] = useUpdateUserMutation();

    const [deletePedido, { isSuccess: isDeleteSuccess, error: errorDelete }] =
        useDeleteUserMutation();

    const { products } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data.produtos,
        }),
    });

    useEffect(() => {
        setProduto(products.find((p) => p._id === produtoId));
    }, [products]);

    console.log(produto);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setQuantity(quantidade);
        setQuantPaga(qtdPaga);
        setShowExcluir(false);
    };

    const handleShowExcluir = () => setShowExcluir(true);
    const handleCloseExcluir = () => setShowExcluir(false);

    const onClickDelete = async () => {
        await deletePedido({
            userId,
            cliente: {
                _id: clientId,
                pedido: {
                    _id: pedidoId,
                },
            },
        });
    };

    useEffect(() => {
        if (produto) {
            setCanUpdateProduto(produto.estoque >= quantity - quantidade);
        } else {
            setCanUpdateProduto(false);
        }
    }, [produto, quantity]);

    const onClickUpdate = async () => {
        if (produto && canUpdateProduto) {
            let estoqueAtt =
                quantity >= quantidade
                    ? produto.estoque - (quantity - quantidade)
                    : produto.estoque + (quantidade - quantity);

            await updateProduct({
                userId,
                produto: {
                    _id: produtoId,
                    estoque: estoqueAtt,
                },
            });
            await updatePedido({
                userId,
                cliente: {
                    pedido: {
                        _id: pedidoId,
                        quantidade: quantity,
                        qtdPaga: quantPaga,
                    },
                },
            });
        } else if (!produto) {
            await updatePedido({
                userId,
                cliente: {
                    pedido: {
                        _id: pedidoId,
                        qtdPaga: quantPaga,
                    },
                },
            });
        }
    };

    useEffect(() => {
        if (isDeleteSuccess) {
            setShow(false);
            navigate(`/clientes/${clientId}`, {
                state: { message: "Pedido DELETADO com sucesso!" },
            });
        } else if (errorDelete) {
            setErrMsg("Erro ao excluir o pedido!");
        }
        if (isUpdatePedidoSuccess) {
            setShow(false);
            navigate(`/clientes/${clientId}`, {
                state: { message: "Pedido atualizado com sucesso!" },
            });
        } else if (errorUpdatePedido) {
            setErrMsg("Erro ao editar pedido!");
        }
    }, [
        isDeleteSuccess,
        errorDelete,
        isUpdatePedidoSuccess,
        isUpdateProductSuccess,
        errorUpdatePedido,
    ]);

    useEffect(() => {
        if (quantity && qtdPaga) {
            setPago(valor * quantidade == quantPaga);
            setAlterado(quantity != quantidade || quantPaga != qtdPaga);
        }
    }, [quantity, quantPaga]);

    const statusClass =
        qtdPaga < quantidade * valor
            ? "alert alert-danger"
            : "alert alert-success";

    const status = qtdPaga < quantidade * valor ? "Não pago" : "Pago";

    const canSave = quantPaga <= quantity * valor && quantPaga >= 0;

    return (
        <>
            <Card
                className={`px-2 py-2 mt-3 text-black shadow-sm hover-card text-decoration-none px-0 ${statusClass}`}
                onClick={handleShow}
            >
                <Row className="d-flex align-items-center">
                    <Col xs={4} className="d-flex flex-column fw">
                        <span className="fw-bold">{nomeProduto}</span>
                        <small>cod: {codigo}</small>
                    </Col>
                    <Col className="ps-3 pe-0">{quantidade}</Col>
                    <Col className="px-0">
                        {formatter.format(valor * quantidade)}
                    </Col>
                    <Col className="ps-4">{status}</Col>
                </Row>
            </Card>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Row>
                            <Col
                                xs={12}
                                className="d-flex align-items-center gap-4"
                            >
                                <span>Detalhes do pedido </span>
                                <i
                                    className="bx bx-trash fs-3 pointer"
                                    onClick={handleShowExcluir}
                                ></i>
                            </Col>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col className="mb-4">
                            <h5 className="mb-0">
                                {nomeProduto} | {formatter.format(valor)}
                            </h5>
                            <small>cod: {codigo}</small>
                        </Col>
                    </Row>
                    {showExcluir && (
                        <Row className="mb-4">
                            <Col xs={12}>
                                <h5>Tem certeza?</h5>
                            </Col>
                            <Col xs={12}>
                                <p>
                                    Ao confirmar, o pedido será excluído do
                                    sistema.
                                </p>
                            </Col>
                            <Col className="d-flex gap-2">
                                <Button
                                    variant="danger"
                                    onClick={onClickDelete}
                                >
                                    Excluir
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleCloseExcluir}
                                >
                                    Cancelar
                                </Button>{" "}
                            </Col>
                        </Row>
                    )}
                    <Row className="fw-bold">
                        <Col>Quantidade</Col>
                        <Col>Valor total</Col>
                    </Row>
                    <Row className="mt-1 d-flex">
                        <Col xs={6}>
                            <Form>
                                <Form.Group>
                                    <Form.Control
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                        className={
                                            produto
                                                ? produto.estoque >=
                                                  quantity - quantidade
                                                    ? ""
                                                    : "is-invalid"
                                                : ""
                                        }
                                        disabled={!produto}
                                    ></Form.Control>
                                    {produto ? (
                                        <Form.Text className="text-muted">
                                            {produto.estoque} em estoque
                                        </Form.Text>
                                    ) : (
                                        "Produto não cadastrado ou excluído"
                                    )}
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={6}>{formatter.format(quantity * valor)}</Col>
                    </Row>
                    <Row className="mt-3 fw-bold ">
                        <Col>Valor pago</Col>
                    </Row>
                    <Row className="mt-1 d-flex align-items-center">
                        <Col xs={6}>
                            <Form.Control
                                type="number"
                                value={quantPaga}
                                onChange={(e) => setQuantPaga(e.target.value)}
                                max={quantity * valor}
                                className={canSave ? "" : "is-invalid"}
                            ></Form.Control>
                        </Col>
                    </Row>
                    {pago ? (
                        <Row className="mt-3">
                            <Col className="alert alert-success text-center">
                                Tudo pago!
                            </Col>
                        </Row>
                    ) : (
                        <Row className="mt-3">
                            <Col className="alert alert-danger text-center">
                                <span>Valor restante a ser pago: </span>
                                <span className="fw-bold">
                                    {quantity * valor - quantPaga &&
                                    quantPaga >= 0
                                        ? formatter.format(
                                              quantity * valor - quantPaga
                                          )
                                        : "-----"}
                                </span>
                            </Col>
                        </Row>
                    )}
                    {alterado && (
                        <Row className="mt-1">
                            <Col>
                                <Button
                                    variant="success"
                                    onClick={onClickUpdate}
                                    className="me-2"
                                >
                                    Salvar edição
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleClose}
                                >
                                    Cancelar
                                </Button>{" "}
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CardPedido;
