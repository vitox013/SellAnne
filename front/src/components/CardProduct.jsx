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
    nomeFornecedor,
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
        metodo == "Revenda" && formaLucro
    );
    const [porcentagemVenda, setPorcentagemVenda] = useState(
        metodo == "Porcentagem" && formaLucro
    );
    const [duplicatedCode, setDuplicatedCode] = useState(false);
    const [modificado, setModificado] = useState(false);

    const { produtos } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            produtos: data?.fornecedores.find(
                (forn) => forn._id == fornecedorId
            ).produtos,
        }),
    });

    // console.log(produtos);

    const [updateProduct, { isSuccess: isUpdateSuccess, error: errorUpdate }] =
        useUpdateUserMutation();

    const [deleteProduct, { isSuccess: isDeleteSuccess, error: errorDelete }] =
        useDeleteUserMutation();

    const defaultStates = () => {
        setProductName(nomeProduto);
        setCode(cod);
        setPrecoBase(preco);
        setPrecoVenda(metodo == "Revenda" && formaLucro);
        setPorcentagemVenda(metodo == "Porcentagem" && formaLucro);
    };
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        defaultStates();
    };
    const handleShowExcluir = () => setShowExcluir(true);
    const handleCloseExcluir = () => setShowExcluir(false);

    useEffect(() => {
        setModificado(
            precoBase != preco ||
                (metodo == "Revenda"
                    ? precoVenda != formaLucro
                    : porcentagemVenda != formaLucro) ||
                productName != nomeProduto ||
                code != cod
        );
    }, [precoBase, precoVenda, porcentagemVenda, productName, code]);

    useEffect(() => {
        if (produtos) {
            setDuplicatedCode(
                produtos.some((p) => p.code == code && p.code != cod)
            );
        }
    }, [produtos, code]);

    // console.log(duplicatedCode);

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

    const onClickUpdate = async (e) => {
        await updateProduct({
            userId,
            fornecedor: {
                _id: fornecedorId,
                produto: {
                    _id: produtoId,
                    code,
                    productName,
                    preco: precoBase,
                    precoVenda,
                    porcentagemVenda,
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
        if (isUpdateSuccess) {
            setShow(false);
            navigate(`/fornecedores/${fornecedorId}`, {
                state: { message: "Produto editado com sucesso" },
            });
        } else if (errorUpdate) {
            console.log("Erro ao editar produto");
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
                        {console.log(metodo)}
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
                                        type="number"
                                        inputMode="numeric"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        className={
                                            duplicatedCode && "is-invalid"
                                        }
                                    ></Form.Control>
                                    {duplicatedCode && (
                                        <Form.Text>
                                            Código já cadastrado
                                        </Form.Text>
                                    )}
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
                                                type="number"
                                                inputMode="numeric"
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
                                                type="number"
                                                inputMode="numeric"
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
                    {modificado && (
                        <Button
                            className="mt-2 d-flex align-items-center btn-success"
                            onClick={onClickUpdate}
                        >
                            Salvar edição <i className="bx bx-edit ms-1"></i>
                        </Button>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CardProduct;
