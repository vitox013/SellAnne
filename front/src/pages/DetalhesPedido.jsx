import React from "react";
import Back from "../components/Back";
import { useState } from "react";
import { Container } from "react-bootstrap";
import CardPedido from "../components/CardPedido";

const DetalhesPedido = () => {
    const [posicao, setPosicao] = useState("");

    function scroll() {
        window.addEventListener("scroll", function () {
            this.scrollY > 150 ? setPosicao("top") : setPosicao("");
        });
    }
    scroll();

    return (
        <>
            <Back
                fixed={posicao}
                icon="bx bx-arrow-back fs-1"
                path="/dashboard"
            />
            <Container>
                <CardPedido path={`./detalhes`}/>
            </Container>
        </>
    );
};

export default DetalhesPedido;
