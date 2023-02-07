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
        if (isSuccess) navigate("/");
    }, [isSuccess, navigate]);

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
                className="text-decoration-none text-black fw-bold fs-5 text-capitalize d-flex align-items-center"
                to="dashboard"
            >
                {info} <i className={`${icon}`}></i>
            </Link>
        );
    } else if (page == "dashboard") {
        conteudo = (
            <Nav className="d-flex align-items-center">
                <NavDropdown
                    title={<i className={`${icon} text-black`}></i>}
                    id="basic-nav-dropdown"
                    drop="down"
                    align="end"
                >
                    <NavDropdown.Item>Meu perfil</NavDropdown.Item>
                    <NavDropdown.Item>Resumo vendas</NavDropdown.Item>
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
    } else if (page == "clientes") {
        conteudo = (
            <Nav className="d-flex align-items-center">
                <Link to="/dashboard" className="text-black fw-bold">
                    Dashboard
                </Link>
                <NavDropdown
                    title={<i className={`${icon} text-black`}></i>}
                    id="basic-nav-dropdown"
                    drop="down"
                    align="end"
                >
                    <NavDropdown.Item>Meu perfil</NavDropdown.Item>
                    <NavDropdown.Item>Resumo vendas</NavDropdown.Item>
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
            <Container className="d-flex align-items-center">
                <Link to="/">
                    <img
                        alt=""
                        src={logo}
                        className="d-inline-block col-7 col-md-12"
                    />
                </Link>
                {conteudo}
            </Container>
        </Navbar>
    );
}

export default NavBar;
