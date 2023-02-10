import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../img/dashSell_LOGO_transparent.png";
import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

function Back({ fixed, path, element }) {
    return (
        <Navbar
            className="text-black mx-0 py-2 fluid bg-light shadow-sm"
            fixed={fixed}
        >
            <Container>
                <Link
                    to={path}
                    className="text-decoration-none text-dark d-flex align-items-center"
                >
                    <i className="bx bx-arrow-back fs-1"></i>
                    <span className="fw-bold fs-5 mb-0 ">Voltar</span>
                </Link>
                {element}
            </Container>
        </Navbar>
    );
}

export default Back;
