import React, { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
    useDeleteProductMutation,
    useGetProductsQuery,
    useUpdateProductMutation,
} from "./productsApiSlice";
import { useState } from "react";
import {
    Navbar,
    Container,
    Button,
    Modal,
    Row,
    Col,
    Form,
} from "react-bootstrap";
import DeleteComp from "../../components/DeleteComp";
import Back from "../../components/Back";

const DetalhesProduto = () => {
    const errRef = useRef();
    const { id: productId } = useParams();
    const { userId } = useAuth();
    const [content, setContent] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [estoque, setEstoque] = useState("");
    const [produto, setProduto] = useState("");
    const [preco, setPreco] = useState("");
    const [changed, setChanged] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    const { products } = useGetProductsQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.entities[productId],
        }),
    });

    const [deleteProduto, { isSuccess: isDeleteSuccess, error: deleteError }] =
        useDeleteProductMutation();

    const [updateProduto, { isSuccess: isUpdateSuccess, error: updateError }] =
        useUpdateProductMutation();

    useEffect(() => {
        if (products) {
            setCodigo(products.codigo);
            setEstoque(products.estoque);
            setPreco(products.preco);
            setProduto(products.produto);
        }
    }, [products]);

    const onCodigoChange = (e) => {
        setCodigo(e.target.value);
        setChanged(true);
    };
    const onProdutoChange = (e) => {
        setProduto(e.target.value);
        setChanged(true);
    };
    const onEstoqueChange = (e) => {
        setEstoque(e.target.value);
        setChanged(true);
    };
    const onPrecoChange = (e) => {
        setPreco(e.target.value);
        setChanged(true);
    };

    const canSave = codigo > 0 && estoque >= 0 && preco >= 0;

    const onDeleteUserClicked = async (e) => {
        e.preventDefault();
        await deleteProduto({ productId });
    };

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await updateProduto({
                vendedor: userId,
                id: productId,
                codigo,
                produto,
                estoque,
                preco,
            });
        }
    };

    useEffect(() => {
        if (isDeleteSuccess || isUpdateSuccess) {
            navigate("/produtos");
        } else if (deleteError) {
            setErrMsg(deleteError.data.message);
        } else if (updateError) {
            setErrMsg(updateError.data.message);
        }
    }, [isDeleteSuccess, deleteError, isUpdateSuccess, updateError, navigate]);

    const errClass = errMsg ? "alert alert-danger" : "d-none";

    console.log(changed);
    return (
        <>
            <Back
                path="/produtos"
                element={
                    <DeleteComp
                        deletar={onDeleteUserClicked}
                        errMsg={errMsg}
                        option="produto"
                    />
                }
            />
            <Container>
                <Row className="px-2 mt-md-5">
                    <Col className="mt-2 col-12 text-center">
                        <h2 className="fw-bold">Edite seu produto</h2>
                    </Col>
                    <Col className="mt-5 col-md-5 mx-md-auto ">
                        <Form onSubmit={onSaveUserClicked} className="fw-bold">
                            <p
                                ref={errRef}
                                className={errClass}
                                aria-live="assertive"
                            >
                                {errMsg}
                            </p>

                            <Form.Group className="mb-3" controlId="nome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={produto}
                                    onChange={onProdutoChange}
                                    className="text-capitalize"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="codigo">
                                <Form.Label>Código</Form.Label>

                                <Form.Control
                                    type="number"
                                    pattern="[0-9]{11}"
                                    value={codigo}
                                    onChange={onCodigoChange}
                                    required
                                    className={codigo <= 0 ? "is-invalid" : ""}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="estoque">
                                <Form.Label>Quantidade em estoque</Form.Label>
                                <Form.Control
                                    type="number"
                                    pattern="[0-9]{11}"
                                    value={estoque}
                                    onChange={onEstoqueChange}
                                    required
                                    className={estoque < 0 ? "is-invalid" : ""}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="preco">
                                <Form.Label>Preço</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={preco}
                                    onChange={onPrecoChange}
                                    required
                                    className={preco < 0 ? "is-invalid" : ""}
                                />
                            </Form.Group>

                            <Button
                                variant="success"
                                type="submit"
                                onClick={onSaveUserClicked}
                                disabled={!changed}
                            >
                                Salvar edição
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DetalhesProduto;
