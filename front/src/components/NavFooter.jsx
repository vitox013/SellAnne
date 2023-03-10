import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavFooter({ path, info, icon }) {
    return (
        <Navbar className="text-black mx-0 py-0 fluid shadow-sm" fixed="bottom">
            <Container className="d-flex justify-content-center">
                <Link
                    to={path}
                    className="btn btn-success mb-2"
                >
                    <i className={`${icon}`}></i>
                    {info}
                </Link>
            </Container>
        </Navbar>
    );
}

export default NavFooter;
