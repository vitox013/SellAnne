import React, { useEffect } from "react";
import {
    Button,
    Container,
    Row,
    Form,
    Col,
    Card,
    Modal,
    Navbar,
} from "react-bootstrap";

import NavBar from "../../components/NavBar";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
    useGetUserDataQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from "../users/userApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CardProduct from "../../components/CardProduct";
import Message from "../../components/Message";
import DeleteModal from "../../components/DeleteModal";
import EditModal from "../../components/EditModal";

const DetalhesFornecedor = () => {
    const { currentUser, userId, username } = useAuth();
    const { id: fornecedorId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    let message = "";

    if (location.state) {
        message = location.state.message;
    }

    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [conteudo, setConteudo] = useState([]);
    const [produtosFornecedor, setProdutosFornecedor] = useState([]);
    const [code, setCode] = useState("");
    const [duplicatedCode, setDuplicatedCode] = useState(false);
    const [productName, setProductName] = useState("");
    const [preco, setPreco] = useState("");
    const [precoVenda, setPrecoVenda] = useState("");
    const [porcentagemVenda, setPorcentagemVenda] = useState("");
    const [msg, setMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const [show, setShow] = useState(false);
    const [showExcluir, setShowExcluir] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const { fornecedor } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            fornecedor: data?.fornecedores.find(
                (forn) => forn._id == fornecedorId
            ),
        }),
    });

    const [addProduct, { isSuccess: isAddSuccess, error: errorAdd }] =
        useUpdateUserMutation();

    const [
        deleteFornecedor,
        { isSuccess: isDeleteSuccess, error: errorDelete },
    ] = useDeleteUserMutation();

    useEffect(() => {
        if (fornecedor) {
            setProdutosFornecedor(
                fornecedor.produtos
                    .slice()
                    .sort((a, b) => (a.productName > b.productName ? 1 : -1))
            );

            !porcentagemVenda &&
                setPorcentagemVenda(fornecedor.porcentagemPadrao);
        }
    }, [fornecedor]);

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {
        if (term == "") {
            setConteudo(
                produtosFornecedor?.length ? (
                    produtosFornecedor.map((prod) => (
                        <CardProduct
                            key={prod._id}
                            cod={prod.code}
                            nomeProduto={prod.productName}
                            formaLucro={
                                fornecedor.metodo == "Revenda"
                                    ? prod.precoVenda
                                    : prod.porcentagemVenda
                            }
                            metodo={fornecedor.metodo}
                            preco={prod.preco}
                            produtoId={prod._id}
                            nomeFornecedor={fornecedor.nomeFornecedor}
                        />
                    ))
                ) : (
                    <p className="alert alert-danger text-center">
                        Nenhum produto cadastrado!
                    </p>
                )
            );
        }
        if (term) {
            const filteredProdutosFornecedor = produtosFornecedor.filter(
                (prod) =>
                    prod.productName.toLowerCase().includes(term.toLowerCase())
            );

            if (filteredProdutosFornecedor) {
                setConteudo(
                    filteredProdutosFornecedor?.length ? (
                        filteredProdutosFornecedor.map((prod) => (
                            <CardProduct
                                key={prod._id}
                                nomeProduto={prod.productName}
                                formaLucro={
                                    fornecedor.metodo == "Revenda"
                                        ? prod.precoVenda
                                        : prod.porcentagemVenda
                                }
                                metodo={fornecedor.metodo}
                                cod={prod.code}
                                preco={prod.preco}
                                produtoId={prod._id}
                                fornecedorId={fornecedor._id}
                            />
                        ))
                    ) : (
                        <p className="alert alert-danger">
                            Nenhum fornecedor {term} encontrado!
                        </p>
                    )
                );
            }
        }
    }, [produtosFornecedor, term]);

    useEffect(() => {
        if (code) {
            setDuplicatedCode(
                produtosFornecedor.some((prod) => prod.code == code)
            );
        }
    }, [code]);

    const onSearch = (e) => {
        e.preventDefault();
    };

    const canSave =
        !duplicatedCode &&
        code &&
        productName &&
        preco &&
        ((precoVenda && preco < precoVenda) ||
            (fornecedor ? fornecedor.porcentagemPadrao : 0));

    const onSaveProduct = async (e) => {
        if (canSave) {
            await addProduct({
                userId,
                fornecedor: {
                    _id: fornecedorId,
                    produto: {
                        code,
                        productName,
                        preco,
                        precoVenda,
                        porcentagemVenda,
                    },
                },
            });
        }
    };

    const onDeleteClick = async () => {
        await deleteFornecedor({
            userId,
            fornecedor: {
                _id: fornecedorId,
            },
        });
    };

    const onEditClick = async () => {};

    useEffect(() => {
        if (isAddSuccess) {
            setShow(false);
            setMsg("Produto adicionado com sucesso!");
        } else if (errorAdd) {
            setErrMsg("Erro ao adicionar produto!");
        }
        if (isDeleteSuccess) {
            setShowExcluir(false);
            navigate("/fornecedores", {
                state: { message: "Fornecedor deletado com sucesso!" },
            });
        } else if (errorDelete) {
            setErrMsg("Erro ao excluir fornecedor!");
        }
    }, [isAddSuccess, errorAdd, isDeleteSuccess, errorDelete]);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setShowExcluir(false);
        setShowEdit(false);
        setCode("");
        setPorcentagemVenda("");
        setProductName("");
        setPreco("");
        setPrecoVenda("");
        setDuplicatedCode(false);
    };
    const handleShowExcluir = () => setShowExcluir(true);
    const handleShowEdit = () => setShowEdit(true);

    return (
        <>
            <NavBar
                info="Fornecedores"
                icon="bx bx-user-circle fs-1 expand"
                fixed="top"
                path="dash"
                page="detalhesFornecedor"
            />
            <Container>
                <Row>
                    <h1 className="mt-2 pt-10 d-flex align-items-center">
                        {fornecedor && fornecedor.nomeFornecedor}{" "}
                        <i
                            className="bx bxs-edit-alt ms-3 pointer fs-3"
                            onClick={handleShowEdit}
                        ></i>
                        <i
                            className="bx bx-trash ms-3 pointer fs-3"
                            onClick={handleShowExcluir}
                        ></i>
                    </h1>
                </Row>

                <DeleteModal
                    errMsg={errMsg}
                    handleClose={handleClose}
                    showExcluir={showExcluir}
                    onDeleteClick={onDeleteClick}
                />

                <EditModal
                    errMsg={errMsg}
                    handleClose={handleClose}
                    showEdit={showEdit}
                    onEditClick={onEditClick}
                />

                {/* ----------------CONTENT------------------ */}
                <Row>
                    <Form className="d-flex mt-4 align-items-center">
                        <Col xs={7}>
                            <h2 className="col-5 fw-bold">Produtos</h2>
                        </Col>
                        <Col xs={4}>
                            <Form.Control
                                type="search"
                                placeholder="Procurar"
                                className="me-2 h-75"
                                aria-label="Search"
                                value={debouncedTerm}
                                onChange={(e) =>
                                    setDebouncedTerm(e.target.value)
                                }
                                onSubmit={onSearch}
                            />
                        </Col>
                        <Col>
                            <Button
                                variant="outline-success"
                                className="px-0 py-1 w-100"
                            >
                                <i className="bx bx-search"></i>
                            </Button>
                        </Col>
                    </Form>
                </Row>
                <Row className="px-2">
                    <Card className="py-2 mt-3 text-black shadow-sm fw-bold">
                        <Row className="text-center">
                            <Col xs={2}>Cod</Col>
                            <Col xs={4}>Nome</Col>
                            <Col xs={3}>Valor</Col>
                            <Col xs={3} className="ps-0">
                                {fornecedor && fornecedor.metodo == "Revenda"
                                    ? "Revenda"
                                    : "%"}
                            </Col>
                        </Row>
                    </Card>
                </Row>
                {message && (
                    <Message type="alert alert-success" msg={message} />
                )}
                <Row className="px-2">{conteudo}</Row>
                <Row>
                    <Navbar fixed="bottom">
                        <Container>
                            <Button
                                variant="success"
                                className="mx-auto"
                                onClick={handleShow}
                            >
                                <i className="bx bx-plus"></i> Novo produto
                            </Button>
                        </Container>
                    </Navbar>
                </Row>
            </Container>

            {/* --------------- MODAL--------------- */}
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Cadastre novo produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3 fw-bold" controlId="code">
                            <Form.Label>Código produto</Form.Label>
                            <Form.Control
                                type="number"
                                pattern="[0-9]{20}"
                                inputMode="numeric"
                                placeholder="Código"
                                autoFocus
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={duplicatedCode && "is-invalid"}
                                required
                            />
                            {duplicatedCode && (
                                <Form.Text className="text-danger">
                                    Código já cadastrado!
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group
                            className="mb-3 fw-bold"
                            controlId="productName"
                        >
                            <Form.Label>Nome produto</Form.Label>
                            <Form.Control
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 fw-bold" controlId="preco">
                            <Form.Label>Preço base</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                inputMode="numeric"
                                value={Number(preco).toString()}
                                onChange={(e) =>
                                    setPreco(Number(e.target.value))
                                }
                            />
                        </Form.Group>

                        {fornecedor &&
                            (fornecedor.metodo == "Revenda" ? (
                                <Form.Group
                                    className="mb-3 fw-bold"
                                    controlId="precoVenda"
                                >
                                    <Form.Label>Preço venda</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={Number(precoVenda).toString()}
                                        inputMode="numeric"
                                        className={
                                            preco > precoVenda && "is-invalid"
                                        }
                                        onChange={(e) =>
                                            setPrecoVenda(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </Form.Group>
                            ) : (
                                <Form.Group
                                    className="mb-3 fw-bold"
                                    controlId="porcentagem"
                                >
                                    <Form.Label>
                                        Sua porcentagem na venda %
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        inputMode="numeric"
                                        value={porcentagemVenda}
                                        onChange={(e) =>
                                            setPorcentagemVenda(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            ))}

                        <Card className="text-center bg-success bg-opacity-50">
                            <Row>
                                <Col className="fw-bold">
                                    Lucro com a venda:{" "}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="fw-bold">
                                    {formatter.format(
                                        !porcentagemVenda
                                            ? precoVenda - preco
                                            : (preco * porcentagemVenda) / 100
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button
                        variant="success"
                        disabled={!canSave}
                        onClick={onSaveProduct}
                    >
                        Criar produto
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DetalhesFornecedor;
