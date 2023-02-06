import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../img/dashSell_LOGO_transparent.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useState, useEffect } from "react";

import { NavDropdown } from "react-bootstrap";

function NavDash({ info, icon, fixed, path }) {
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

                {path == "dash" ? (
                    <NavDropdown
                        title={<i className={`${icon}`}></i>}
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
                            Sair <i class="bx bx-log-out fs-3"></i>
                        </NavDropdown.Item>
                    </NavDropdown>
                ) : (
                    <Link
                        className="text-decoration-none text-black fw-bold fs-5 text-capitalize d-flex align-items-center"
                        to={info}
                    >
                        {info} <i className={`${icon}`}></i>
                    </Link>
                )}
            </Container>
        </Navbar>
    );
}

export default NavDash;
