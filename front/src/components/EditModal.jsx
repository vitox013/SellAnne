import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useUpdateUserMutation } from "../features/users/userApiSlice";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setMsg } from "../features/infoMsg/msgSlice";

const EditModal = ({
    showEdit,
    nomeForn,
    method,
    porcentagemPadrao,
    handleClose,
}) => {
    const [errMsg, setErrMsg] = useState("");
    const [opcao, setOpcao] = useState("");
    const [nomeFornecedor, setNomeFornecedor] = useState("");
    const [porcentagem, setPorcentagem] = useState("");
    const [metodo, setMetodo] = useState("");
    const [show, setShow] = useState();
    const [alterado, setAlterado] = useState(false);

    const navigate = useNavigate();
    const { userId } = useAuth();

    const { id: fornecedorId } = useParams();
    const dispatch = useDispatch();

    const [updateFornecedor, { isSuccess, error }] = useUpdateUserMutation();

    useEffect(() => {
        setNomeFornecedor(nomeForn);
        setMetodo(method);
        setPorcentagem(porcentagemPadrao);
        setOpcao("");
    }, [method, nomeForn, porcentagemPadrao, handleClose]);

    useEffect(() => {
        setAlterado(
            nomeForn != nomeFornecedor ||
                porcentagem != porcentagemPadrao ||
                metodo != method
        );
    }, [nomeFornecedor, metodo, porcentagem]);

    const onNomeChange = (e) => setNomeFornecedor(e.target.value);
    const onSelectOption = (e) => {
        setOpcao(e.target.value);
        setMetodo(e.target.value);
    };

    const canSave = nomeFornecedor && metodo;

    const onEditClick = async () => {
        if (canSave) {
            await updateFornecedor({
                userId,
                fornecedor: {
                    _id: fornecedorId,
                    nomeFornecedor,
                    // metodo,
                    // porcentagemPadrao: porcentagem,
                },
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            handleClose();
            dispatch(setMsg("Fornecedor editado com sucesso"));
        }
        if (error) {
            setErrMsg(error.data.message);
        }
    }, [isSuccess, error]);

    return (
        <Modal show={showEdit} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edite seu fornecedor!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="nome">
                                <Form.Label>
                                    <strong>Nome</strong>
                                </Form.Label>
                                <Form.Control
                                    value={nomeFornecedor}
                                    onChange={onNomeChange}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <strong>Método</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col>{method}</Col>
                    </Row>
                    {method == "Porcentagem" && (
                        <>
                            <Row className="mt-3">
                                <Col>
                                    <strong>Sua porcentagem na venda</strong>
                                </Col>
                            </Row>
                            <Row>
                                <Col>{porcentagemPadrao} %</Col>
                            </Row>
                        </>
                    )}
                    {/* <Form.Group className="mb-3" controlId="metodo">
                        <Form.Label>
                            <strong>Método</strong>
                        </Form.Label>
                        <Form.Select value={metodo} onChange={onSelectOption}>
                            <option value="Revenda">Revenda</option>
                            <option value="Porcentagem">
                                Porcentagem total
                            </option>
                        </Form.Select>
                    </Form.Group> */}
                </Form>
                {/* {(opcao == "Porcentagem" || metodo == "Porcentagem") && (
                    <Form.Group className="mb-3" controlId="metodo">
                        <Form.Label>
                            <strong>Defina a porcentagem padrão</strong>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            max="100"
                            className="w-75"
                            value={porcentagem}
                            onChange={(e) => setPorcentagem(e.target.value)}
                            required
                        />
                    </Form.Group>
                )} */}
                {errMsg && <p className="alert alert-danger">{errMsg}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="success"
                    disabled={!alterado || !canSave}
                    onClick={onEditClick}
                >
                    Salvar edição
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
