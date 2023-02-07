import React from "react";
import logo from "../img/DASH_ANNE_LOGO.png";
import { Helmet } from "react-helmet";


const Error404 = () => {
    return (
        <>
            <Helmet>
                <title>404 Not Found</title>
            </Helmet>
            <div class="d-flex align-items-center justify-content-center mt-5">
                <div class="text-center">
                    <div class=" col">
                        <img src={logo} alt="" />
                    </div>
                    <div class="mt-5">
                        <p class="h1">404</p>
                        <span class="text-danger fs-3">Ops!</span>
                        <p class="fs-3"> Página não encontrada.</p>
                        <p class="lead">
                            A página que você está procurando não existe.
                        </p>
                        <a href="/" class="btn btn-primary">
                            Página inicial
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Error404;
