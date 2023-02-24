import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useUpdateUserMutation } from "../features/users/userApiSlice";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setMsg } from "../features/infoMsg/msgSlice";
import { useGetUserDataQuery } from "../features/users/userApiSlice";

const EditModal = ({
    showEdit,
    nomeForn,
    method,
    porcentagemPadrao,
    handleClose,
}) => {
    const [errMsg, setErrMsg] = useState("");
    const [nomesForn, setNomesForn] = useState([]);
    const [nomeFornecedor, setNomeFornecedor] = useState("");
    const [metodo, setMetodo] = useState("");
    const [duplicated, setDuplicated] = useState(false);
    const [show, setShow] = useState();
    const [porcentagem, setPorcentagem] = useState(porcentagemPadrao);
    const [alterado, setAlterado] = useState(false);

    const navigate = useNavigate();
    const { userId } = useAuth();

    const { id: fornecedorId } = useParams();
    const dispatch = useDispatch();

    const { fornecedores } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            fornecedores: data?.fornecedores,
        }),
    });

    useEffect(() => {
        fornecedores &&
            fornecedores.map((forn) =>
                setNomesForn((nomesForn) => [...nomesForn, forn.nomeFornecedor])
            );
    }, [fornecedores]);

    const [updateFornecedor, { isSuccess, error }] = useUpdateUserMutation();

    useEffect(() => {
        setNomeFornecedor(nomeForn);
        setMetodo(method);
        setPorcentagem(porcentagemPadrao);
    }, [method, nomeForn, porcentagemPadrao, handleClose]);

    useEffect(() => {
        setAlterado(
            nomeForn != nomeFornecedor || porcentagem != porcentagemPadrao
        );

        if (nomesForn) {
            setDuplicated(
                nomesForn.some(
                    (forn) =>
                        forn.toLowerCase() === nomeFornecedor.toLowerCase()
                ) && nomeForn != nomeFornecedor
            );
        }
    }, [nomeFornecedor, nomesForn, porcentagem]);

    const onNomeChange = (e) => setNomeFornecedor(e.target.value);

    const canSave =
        nomeFornecedor && (metodo == "Porcentagem" ? porcentagem > 0 : true);

    const onEditClick = async () => {
        if (canSave) {
            await updateFornecedor({
                userId,
                fornecedor: {
                    _id: fornecedorId,
                    nomeFornecedor,
                    porcentagemPadrao: porcentagem,
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
                                    className={duplicated && "is-invalid"}
                                ></Form.Control>
                                {duplicated && (
                                    <Form.Text className="text-danger">
                                        Nome já cadastrado
                                    </Form.Text>
                                )}
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
                        <Row className="mt-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>
                                        <strong>
                                            Sua porcentagem na venda %
                                        </strong>
                                    </Form.Label>
                                    <Form.Control
                                        className="w-25"
                                        type="number"
                                        inputMode="numeric"
                                        value={porcentagem}
                                        onChange={(e) =>
                                            setPorcentagem(e.target.value)
                                        }
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
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
                    disabled={!alterado || !canSave || duplicated}
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
