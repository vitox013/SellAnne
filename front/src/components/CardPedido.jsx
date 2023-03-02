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
    InputGroup,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
    useDeleteUserMutation,
    useGetUserDataQuery,
    useUpdateUserMutation,
} from "../features/users/userApiSlice";
import useAuth from "../hooks/useAuth";
import { onlyNumber } from "../utils/onlyNumber";
import { currency, toBRL, toNumber } from "../utils/currency";
import { useDispatch } from "react-redux";
import { setMsg } from "../features/infoMsg/msgSlice";

const CardPedido = ({
    pedidoId,
    nomeProduto,
    quantidade,
    valor,
    codigo,
    qtdPaga,
    metodo,
    valorVenda,
    porcentagem,
    fornecedor,
    fornecedorId,
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
    const [quantPaga, setQuantPaga] = useState(toBRL(qtdPaga.toFixed(2)));
    const [pago, setPago] = useState(false);
    const [produto, setProduto] = useState();
    const [alterado, setAlterado] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const dispatch = useDispatch();

    const [
        updatePedido,
        { isSuccess: isUpdatePedidoSuccess, error: errorUpdatePedido },
    ] = useUpdateUserMutation();

    const [deletePedido, { isSuccess: isDeleteSuccess, error: errorDelete }] =
        useDeleteUserMutation();

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setQuantity(quantidade);
        setQuantPaga(toBRL(qtdPaga.toFixed(2)));
        setShowExcluir(false);
    };

    const handleShowExcluir = () => setShowExcluir(true);
    const handleCloseExcluir = () => setShowExcluir(false);
    const handleQtdPaga = (e) => setQuantPaga(e.target.value);

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

    const canSave =
        toNumber(quantPaga) <=
            (quantity * (metodo == "Revenda" ? valorVenda : valor)).toFixed(
                2
            ) && toNumber(quantPaga) >= 0;

    const onClickUpdate = async () => {
        if (canSave) {
            let numberQtdPaga = toNumber(quantPaga);

            await updatePedido({
                userId,
                cliente: {
                    pedido: {
                        _id: pedidoId,
                        quantidade: quantity,
                        qtdPaga: numberQtdPaga,
                    },
                },
            });
        }
    };

    useEffect(() => {
        if (isDeleteSuccess) {
            setShow(false);
            dispatch(setMsg("Pedido excluído com sucesso!"));
            navigate(`/clientes/${clientId}`);
        } else if (errorDelete) {
            setErrMsg("Erro ao excluir o pedido!");
        }
        if (isUpdatePedidoSuccess) {
            setShow(false);
            dispatch(setMsg("Pedido atualizado com sucesso!"));
            navigate(`/clientes/${clientId}`);
        } else if (errorUpdatePedido) {
            setErrMsg("Erro ao editar pedido!");
        }
    }, [
        isDeleteSuccess,
        errorDelete,
        isUpdatePedidoSuccess,
        errorUpdatePedido,
    ]);

    useEffect(() => {
        if (quantity) {
            setPago(
                toBRL(
                    (
                        (metodo == "Revenda" ? valorVenda : valor) * quantity
                    ).toFixed(2)
                ) == quantPaga
            );
            setAlterado(
                quantity != quantidade || quantPaga != toBRL(qtdPaga.toFixed(2))
            );
        }
    }, [quantity, quantPaga]);

    const statusClass =
        qtdPaga <
        (quantidade * (metodo == "Revenda" ? valorVenda : valor)).toFixed(2)
            ? "alert alert-danger"
            : "alert alert-success";
    const status =
        qtdPaga <
        (quantidade * (metodo == "Revenda" ? valorVenda : valor)).toFixed(2)
            ? "Não pago"
            : "Pago";

    return (
        <>
            <Card
                className={`px-2 py-2 mt-3 text-black shadow-sm hover-card text-decoration-none px-0 ${statusClass}`}
                onClick={handleShow}
            >
                <Row className="d-flex align-items-center">
                    <Col xs={4} className="d-flex flex-column fw">
                        <span className="fw-bold">{nomeProduto}</span>
                        <small>
                            cod: {codigo} | {fornecedor}
                        </small>
                    </Col>
                    <Col className="ps-3 pe-0">{quantidade}</Col>
                    <Col className="px-0">
                        {formatter.format(
                            quantidade *
                                (metodo == "Revenda" ? valorVenda : valor)
                        )}
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
                            <br></br>
                            <small>
                                Metodo:{" "}
                                <span className="fw-bold">
                                    {metodo == "Revenda"
                                        ? `${metodo} por ${formatter.format(
                                              valorVenda
                                          )}`
                                        : metodo}
                                </span>
                            </small>
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
                                        type="number"
                                        inputMode="numeric"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                        className="w-50"
                                    ></Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={6}>
                            {formatter.format(
                                quantity *
                                    (metodo == "Revenda" ? valorVenda : valor)
                            )}
                        </Col>
                    </Row>
                    <Row className="mt-3 fw-bold ">
                        <Col>Valor pago</Col>
                    </Row>
                    <Row className="mt-1 d-flex align-items-center">
                        <Col xs={6} md={5}>
                            <InputGroup>
                                <InputGroup.Text>R$</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={quantPaga}
                                    onChange={(e) => handleQtdPaga(currency(e))}
                                    className={`${canSave ? "" : "is-invalid"}`}
                                ></Form.Control>
                            </InputGroup>
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
                                    {toNumber(quantPaga) >= 0
                                        ? formatter.format(
                                              metodo == "Revenda"
                                                  ? quantity * valorVenda -
                                                        toNumber(quantPaga)
                                                  : quantity * valor -
                                                        toNumber(quantPaga)
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
                                    disabled={!canSave}
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
