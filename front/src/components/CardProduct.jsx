import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, React } from "react";
import {
    useGetUserDataQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "../features/users/userApiSlice";
import useAuth from "../hooks/useAuth";

const CardProduct = ({
    cod,
    nomeProduto,
    metodo,
    formaLucro,
    preco,
    produtoId,
}) => {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const { userId } = useAuth();
    const { id: fornecedorId } = useParams();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [showExcluir, setShowExcluir] = useState(false);
    const [code, setCode] = useState(cod);
    const [productName, setProductName] = useState(nomeProduto);
    const [precoBase, setPrecoBase] = useState(preco);
    const [precoVenda, setPrecoVenda] = useState(
        metodo == "Revenda" ? formaLucro : ""
    );
    const [porcentagemVenda, setPorcentagemVenda] = useState(
        metodo == "Porcentagem" ? formaLucro : ""
    );

    const [updateProduct, { isSuccess: isUpdateSuccess, error: errorUpdate }] =
        useUpdateUserMutation();

    const [deleteProduct, { isSuccess: isDeleteSuccess, error: errorDelete }] =
        useDeleteUserMutation();

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleShowExcluir = () => setShowExcluir(true);
    const handleCloseExcluir = () => setShowExcluir(false);

    const onClickDelete = async (e) => {
        await deleteProduct({
            userId,
            fornecedor: {
                _id: fornecedorId,
                produto: {
                    _id: produtoId,
                },
            },
        });
    };

    useEffect(() => {
        if (isDeleteSuccess) {
            navigate(`/fornecedores/${fornecedorId}`, {
                state: { message: "Produto excluído com sucesso" },
            });
        }
    }, [isUpdateSuccess, isDeleteSuccess, errorUpdate, errorDelete]);

    return (
        <>
            <Card
                className="px-2 py-2 mt-3 text-black shadow-sm hover-card bg-light"
                onClick={handleShow}
            >
                <Row className="text-center">
                    <Col xs={2} className="pe-0">
                        {cod}
                    </Col>
                    <Col xs={4} className="px-0">
                        {nomeProduto}
                    </Col>
                    <Col xs={3} md={3} className="px-0">
                        {formatter.format(preco)}
                    </Col>
                    <Col xs={3} md={3} className="ps-0">
                        {metodo == "Revenda"
                            ? formatter.format(formaLucro)
                            : `${formaLucro} %`}
                    </Col>
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
                                <span>Detalhes {nomeProduto} </span>
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
                                {nomeProduto} | {formatter.format(preco)}
                            </h5>
                            <small>cod: {cod}</small>
                        </Col>
                    </Row>
                    {showExcluir && (
                        <Row className="mb-4 bg-danger bg-opacity-50 p-2">
                            <Col xs={12}>
                                <h5>Tem certeza?</h5>
                            </Col>
                            <Col xs={12}>
                                <p>Ao confirmar, o produto será excluído.</p>
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
                    <Row className="mb-3 fw-bold">
                        <Col>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Codigo</Form.Label>
                                    <Form.Control
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                    ></Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col>
                            <Form className="fw-bold">
                                <Form.Group>
                                    <Form.Label>Nome Produto</Form.Label>
                                    <Form.Control
                                        value={productName}
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                    ></Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    {metodo == "Revenda" ? (
                        <>
                            <Row className="mb-3 fw-bold">
                                <Col>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Preço</Form.Label>
                                            <Form.Control
                                                value={precoBase}
                                                onChange={(e) =>
                                                    setPrecoBase(e.target.value)
                                                }
                                            ></Form.Control>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>
                                                Preço revenda
                                            </Form.Label>
                                            <Form.Control
                                                value={precoVenda}
                                                onChange={(e) =>
                                                    setPrecoVenda(
                                                        e.target.value
                                                    )
                                                }
                                            ></Form.Control>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Card className="text-center bg-success bg-opacity-50">
                                <Row>
                                    <Col className="fw-bold">
                                        Lucro com a venda:{" "}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="fw-bold">
                                        {formatter.format(
                                            (precoVenda - precoBase).toFixed(2)
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Row className="mb-4 fw-bold">
                                <Col xs={6}>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>
                                                Porcentagem %
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={porcentagemVenda}
                                                onChange={(e) =>
                                                    setPorcentagemVenda(
                                                        e.target.value
                                                    )
                                                }
                                            ></Form.Control>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Card className="text-center bg-success bg-opacity-50">
                                <Row>
                                    <Col className="fw-bold">
                                        Lucro com a venda:{" "}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="fw-bold">
                                        {formatter.format(
                                            (
                                                (precoBase * porcentagemVenda) /
                                                100
                                            ).toFixed(2)
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CardProduct;
