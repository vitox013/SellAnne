import React, { useState, useEffect } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Back from "../../components/Back";
import NavBar from "../../components/NavBar";
import useAuth from "../../hooks/useAuth";

const EditPerfil = () => {
    const { userId, currentUser, email: eMail } = useAuth();
    const [name, setName] = useState(currentUser);
    const [email, setEmail] = useState(eMail);

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
                        <h2>Olá, {currentUser}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Form className="d-flex flex-column gap-4">
                                    <Form.Group>
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default EditPerfil;
