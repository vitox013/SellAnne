import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavFooter({ path, info, icon, onClick }) {
    return (
        <Link to={path}>
            <Button
                onClick={onClick}
                className="d-flex btn-success align-items-center mb-3 fixed-button "
            >
                <i className={icon}></i>
                <span>{info}</span>
            </Button>
        </Link>
    );
}

export default NavFooter;
