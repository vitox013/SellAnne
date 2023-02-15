import { Container, Navbar, Row, Col, NavDropdown, Nav } from "react-bootstrap";

import logo from "../img/dashSell_LOGO_transparent.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useState, useEffect } from "react";

function NavBar({ info, icon, fixed, path, page }) {
    const navigate = useNavigate();

    const [sendLogout, { isLoading, isSuccess, isError, error }] =
        useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate("/");
        } else if (error) {
            console.log(error);
        }
    }, [isSuccess, navigate, error]);

    useEffect(() => {
        document.addEventListener("keydown", enterPressed);
    }, []);

    const enterPressed = (e) => {
        if (e.keyCode === 13) e.preventDefault();
    };

    let conteudo = "";

    if (page == "public") {
        conteudo = (
            <Link
                className="text-decoration-none text-black fw-bold fs-5 text-capitalize d-flex align-items-center float-end"
                to="dashboard"
            >
                {info} <i className={`${icon}`}></i>
            </Link>
        );
    } else if (page == "dashboard") {
        conteudo = (
            <Nav className="d-flex align-items-center float-end">
                <NavDropdown
                    title={<i className={`${icon} text-black pe-0`}></i>}
                    id="basic-nav-dropdown"
                    drop="down"
                    align="end"
                    className="pe-0"
                >
                    <Link
                        to=""
                        className="text-dark btn w-100 d-flex hover-card"
                    >
                        Meu perfil
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                        className="d-flex align-items-center justify-content-between "
                        onClick={sendLogout}
                    >
                        Sair <i className="bx bx-log-out fs-3"></i>
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        );
    } else if (
        page == "clientes" ||
        page == "fornecedores" ||
        page == "detalhesFornecedor"
    ) {
        conteudo = (
            <Nav className="align-items-center float-end">
                {page == "clientes" || page == "detalhesFornecedor" ? (
                    <Link to="/fornecedores" className="text-black fs-5">
                        Fornecedores
                    </Link>
                ) : (
                    <Link to="/clientes" className="text-black ms-1 fs-5">
                        Clientes
                    </Link>
                )}
                <NavDropdown
                    title={<i className={`${icon} text-black`}></i>}
                    id="basic-nav-dropdown"
                    drop="down"
                    align="end"
                >
                    <Link
                        to=""
                        className="text-dark btn w-100 d-flex hover-card"
                    >
                        Meu perfil
                    </Link>

                    <Link
                        to="/dashboard"
                        className="text-dark btn w-100 d-flex hover-card"
                    >
                        Dashboard
                    </Link>

                    <NavDropdown.Divider />
                    <NavDropdown.Item
                        className="d-flex align-items-center justify-content-between "
                        onClick={sendLogout}
                    >
                        Sair <i className="bx bx-log-out fs-3"></i>
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        );
    }

    return (
        <Navbar
            className="text-black mx-0 py-0 fluid bg-light shadow-sm"
            fixed={fixed}
        >
            <Container>
                <Row className="d-flex align-items-center w-100">
                    <Col xs={6} md={2}>
                        <Link to="/">
                            <img
                                alt=""
                                src={logo}
                                className="d-inline-block w-75"
                            />
                        </Link>
                    </Col>
                    <Col xs={6} md={10} className="p-0 float-end">
                        {conteudo}
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default NavBar;
