import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Col,
    Row,
    Card,
    Modal,
    Button,
    Form,
    InputGroup,
    Alert
} from "react-bootstrap";
import { useState, useEffect, React } from "react";
import {
    useGetUserDataQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "../features/users/userApiSlice";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setMsg } from "../features/infoMsg/msgSlice";
import { toNumber, toBRL, currency } from "./Currency";

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

    const dispatch = useDispatch();

    const { userId } = useAuth();
    const { id: fornecedorId } = useParams();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [showExcluir, setShowExcluir] = useState(false);
    const [code, setCode] = useState(cod);
    const [productName, setProductName] = useState(nomeProduto);
    const [precoBase, setPrecoBase] = useState(toBRL(preco.toFixed(2)));
    const [precoVenda, setPrecoVenda] = useState(
        metodo == "Revenda" && toBRL(formaLucro.toFixed(2))
    );
    const [porcentagemVenda, setPorcentagemVenda] = useState(
        metodo == "Porcentagem" && formaLucro
    );
    const [duplicatedCode, setDuplicatedCode] = useState(false);
    const [modificado, setModificado] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const { produtos } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            produtos: data?.fornecedores.find(
                (forn) => forn._id == fornecedorId
            ).produtos,
        }),
    });

    const [updateProduct, { isSuccess: isUpdateSuccess, error: errorUpdate }] =
        useUpdateUserMutation();

    const [deleteProduct, { isSuccess: isDeleteSuccess, error: errorDelete }] =
        useDeleteUserMutation();

    const defaultStates = () => {
        setProductName(nomeProduto);
        setCode(cod);
        setPrecoBase(toBRL(preco.toFixed(2)));

        setPrecoVenda(metodo == "Revenda" && toBRL(formaLucro.toFixed(2)));

        setPorcentagemVenda(metodo == "Porcentagem" && formaLucro);
    };
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        defaultStates();
    };
    const handleShowExcluir = () => setShowExcluir(true);
    const handleCloseExcluir = () => setShowExcluir(false);

    const handlePrice = (e) => {
        setPrecoBase(e.target.value);
    };

    useEffect(() => {
        setModificado(
            toNumber(precoBase) != preco ||
                (metodo == "Revenda"
                    ? toNumber(precoVenda) != formaLucro
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

    const canSave =
        code &&
        precoBase &&
        (metodo == "Porcentagem"
            ? porcentagemVenda > 0
            : toNumber(precoVenda) > toNumber(precoBase)) &&
        productName;

    const onClickUpdate = async (e) => {
        let preco = toNumber(precoBase);
        let priceVenda = toNumber(precoVenda);

        canSave &&
            (await updateProduct({
                userId,
                fornecedor: {
                    _id: fornecedorId,
                    produto: {
                        _id: produtoId,
                        code,
                        productName,
                        preco,
                        precoVenda: priceVenda,
                        porcentagemVenda,
                    },
                },
            }));
    };
    useEffect(() => {
        if (isDeleteSuccess) {
            dispatch(setMsg("Produto excluído com sucesso"));
        }
        if (isUpdateSuccess) {
            setShow(false);
            dispatch(setMsg("Produto editado com sucesso"));
        } else if (errorUpdate) {
            setErrMsg("Erro ao editar produto");
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
                    {errMsg && <Alert variant="danger">{errMsg}</Alert>}

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
                                    />
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
                                        maxLength={30}
                                        value={productName}
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <Row className="mb-3 fw-bold">
                        <Col>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Preço</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>R$</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            value={precoBase}
                                            onChange={(e) =>
                                                handlePrice(currency(e))
                                            }
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        {metodo == "Revenda" ? (
                            <>
                                <Col>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>
                                                Preço revenda
                                            </Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    R$
                                                </InputGroup.Text>

                                                <Form.Control
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={precoVenda}
                                                    onChange={(e) =>
                                                        setPrecoVenda(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>

                                <Card className="text-center bg-success bg-opacity-50 mt-4">
                                    <Row>
                                        <Col className="fw-bold">
                                            Lucro com a venda:{" "}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="fw-bold">
                                            {formatter.format(
                                                toNumber(precoVenda) -
                                                    toNumber(precoBase)
                                            )}
                                        </Col>
                                    </Row>
                                </Card>
                            </>
                        ) : (
                            <>
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
                                            />
                                        </Form.Group>
                                    </Form>
                                </Col>

                                <Card className="text-center bg-success bg-opacity-50 mt-4">
                                    <Row>
                                        <Col className="fw-bold">
                                            Lucro com a venda:{" "}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="fw-bold">
                                            {formatter.format(
                                                (toNumber(precoBase) *
                                                    porcentagemVenda) /
                                                    100
                                            )}
                                        </Col>
                                    </Row>
                                </Card>
                            </>
                        )}
                    </Row>
                    {modificado && (
                        <Button
                            className="mt-2 d-flex align-items-center btn-success"
                            onClick={onClickUpdate}
                            disabled={!canSave || duplicatedCode}
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
