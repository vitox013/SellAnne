import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../img/dashSell_LOGO_transparent.png";
import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

function NavDash({ info, icon, fixed }) {
    return (
        <Navbar className="text-black mx-0 py-0 fluid bg-light shadow-sm" fixed={fixed}>
            <Container className="d-flex align-items-center">
                <Link to="/">
                    <img
                        alt=""
                        src={logo}
                        className="d-inline-block col-7 col-md-12"
                    />
                </Link>
                <Link
                    className="text-decoration-none text-black fw-bold fs-5 text-capitalize d-flex align-items-center"
                    to={info}
                >
                    {info}
                    <i className={`${icon}`}></i>
                </Link>
            </Container>
        </Navbar>
    );
}

export default NavDash;
