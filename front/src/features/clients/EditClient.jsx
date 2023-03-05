import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useUpdateUserMutation } from "../users/userApiSlice";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setMsg } from "../infoMsg/msgSlice";
import Message from "../../utils/Message";
import { telefoneMask } from "../../utils/telefone";

const EditClient = ({ showEdit, handleClose, phone, nome, nomesClientes }) => {
    const [clientName, setClientName] = useState(nome);
    const [telefone, setTelefone] = useState(phone);
    const [duplicatedName, setDuplicatedName] = useState(false);
    const [alterado, setAlterado] = useState(false);

    const { id: clientId } = useParams();
    const { userId } = useAuth();
    const dispatch = useDispatch();
    const message = useSelector((state) => state.infoMsg.msg);

    const [clientUpdate, { isSuccess, error }] = useUpdateUserMutation();

    useEffect(() => {
        setClientName(nome);
        setTelefone(phone);
    }, [nome, phone, handleClose]);

    useEffect(() => {
        setAlterado(
            clientName?.toLowerCase() != nome?.toLowerCase() ||
                telefone != phone
        );
        setDuplicatedName(
            nomesClientes.some(
                (client) =>
                    client?.toLowerCase() == clientName?.toLowerCase().trim()
            ) && clientName?.toLowerCase() != nome?.toLowerCase()
        );
    }, [clientName, telefone]);

    const onTelefoneChange = (e) => setTelefone(e.target.value);
    const canEdit = clientName && !duplicatedName && alterado;

    const handleEditClient = async (e) => {
        e.preventDefault();

        if (canEdit) {
            await clientUpdate({
                userId,
                cliente: {
                    _id: clientId,
                    clientName: clientName.trim(),
                    telefone,
                },
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            handleClose();
            dispatch(setMsg("Cliente atualizado com sucesso!"));
        } else if (error) {
            dispatch(setMsg("Erro ao atualizar cliente!"));
        }
    }, [isSuccess, error]);

    return (
        <Modal show={showEdit} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edite seu cliente!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="d-flex gap-3 flex-column">
                    <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            maxLength={20}
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className={duplicatedName && "is-invalid"}
                        />
                        {duplicatedName && (
                            <Form.Text className="text-danger">
                                Nome já cadastrado
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                            type="tel"
                            maxLength={16}
                            value={telefone}
                            onChange={(e) => onTelefoneChange(telefoneMask(e))}
                        />
                    </Form.Group>
                </Form>
                {message && <Message type="text-danger" msg={message} />}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="success"
                    disabled={!canEdit}
                    onClick={handleEditClient}
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

export default EditClient;
