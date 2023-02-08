import React from "react";
import logo from "../img/DASH_ANNE_LOGO.png";

const Error404 = () => {
    return (
        <>
            <div className="d-flex align-items-center justify-content-center mt-5">
                <div className="text-center">
                    <div className=" col">
                        <img src={logo} alt="" />
                    </div>
                    <div className="mt-5">
                        <p className="h1">404</p>
                        <span className="text-danger fs-3">Ops!</span>
                        <p className="fs-3"> Página não encontrada.</p>
                        <p className="lead">
                            A página que você está procurando não existe.
                        </p>
                        <a href="/" className="btn btn-primary">
                            Página inicial
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Error404;
