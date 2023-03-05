import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import NavBar from "../../components/NavBar";
import useAuth from "../../hooks/useAuth";
import ModalChangePwd from "./ModalChangePwd";
import Message from "../../utils/Message";
import { useGetUserDataQuery, useUpdateUserMutation } from "./userApiSlice";

const EditPerfil = () => {
    const { userId, currentUser, email } = useAuth();

    const { userName } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data }) => ({
            userName: data?.username,
        }),
    });

    const [name, setName] = useState("");
    const [show, setShow] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [classStatus, setClassStatus] = useState("");
    const [nameChanged, setNameChanged] = useState(false);

    const message = useSelector((state) => state.infoMsg.msg);

    const [updateUser, { isSuccess, error, data }] = useUpdateUserMutation();

    useEffect(() => {
        setNameChanged(name !== userName);
    }, [name]);

    useEffect(() => {
        if (userName) {
            setName(userName);
            setNameChanged(name !== userName);
        }
    }, [userName]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleCancel = () => setName(userName);

    const onSaveUserClicked = async (e) => {
        if (name) {
            await updateUser({
                userId,
                email,
                username: name.trim(),
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setFeedback(data?.message);
            setClassStatus("alert alert-success");
        } else if (error) {
            setFeedback(error?.data?.message);
            setClassStatus("alert alert-danger");
        }
    }, [isSuccess, error]);

    return (
        <>
            <NavBar
                icon="bx bx-user-circle fs-1 expand"
                fixed=""
                page="profile"
            />
            <Container>
                <Row className="mt-2 text-center">
                    <Col>
                        <h2>Olá, {userName}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="mx-auto">
                        <Card>
                            <Card.Body>
                                {feedback && (
                                    <Message
                                        msg={feedback}
                                        type={classStatus}
                                    />
                                )}
                                <Form className="d-flex flex-column gap-4 mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            <strong>Nome</strong>
                                        </Form.Label>
                                        <Form.Control
                                            maxLength="16"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>
                                            <strong>Email</strong>
                                        </Form.Label>
                                        <Form.Control
                                            value={email}
                                            disabled={true}
                                        />
                                    </Form.Group>
                                </Form>
                                {message && (
                                    <Message
                                        type="alert alert-success"
                                        msg={message}
                                    />
                                )}
                                <Row>
                                    <a
                                        className="a_decoration"
                                        onClick={handleShow}
                                    >
                                        Alterar senha
                                    </a>
                                </Row>
                                <ModalChangePwd
                                    show={show}
                                    handleClose={handleClose}
                                />
                                {nameChanged && (
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="success"
                                            className="mt-2"
                                            onClick={onSaveUserClicked}
                                        >
                                            Salvar
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="mt-2"
                                            onClick={handleCancel}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default EditPerfil;
