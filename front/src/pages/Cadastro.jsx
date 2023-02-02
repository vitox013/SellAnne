import React from "react";
import { Card, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Login = () => {
  return (
    <Container className="min-vh-100 d-flex flex-column align-items-center justify-content-center login">
      <Card className="shadow">
        <Card.Body>
          <Form className="fs-5">
            <Form.Group className="mb-3" controlId="email">
              <h3 className="mb-4">Crie uma conta</h3>
              <Form.Text className="text-muted">
              </Form.Text>
              <Form.Label>Email</Form.Label>
              <Form.Control
                className="fs-5"
                type="email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                className="fs-5"
                type="password"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="password2">
              <Form.Label>Repita a senha</Form.Label>
              <Form.Control
                className="fs-5"
                type="password"
              />
            </Form.Group>
            <Button className="fs-5 w-100" variant="primary" type="submit">
              Cadastre-se
            </Button>
          </Form>
          <p className="mt-3 text-center">Já tem uma conta? <a href="./Cadastro.jsx">Login</a></p>
        </Card.Body>
      </Card>
      
    </Container>
  );
};

export default Login;
