import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavFooter({ path, info, icon, onClick }) {
    return (
        <Link to={path}>
            <Button
                onClick={onClick}
                className="d-flex btn-success align-items-center mx-auto mb-3 fixed-bottom"
            >
                <i className={icon}></i>
                <span>{info}</span>
            </Button>
        </Link>
    );
}

export default NavFooter;
