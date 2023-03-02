import React, { useState, useEffect } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Back from "../../components/Back";
import NavBar from "../../components/NavBar";
import useAuth from "../../hooks/useAuth";

const EditPerfil = () => {
    const { userId, currentUser, email: eMail } = useAuth();
    const [name, setName] = useState(currentUser);
    const [email, setEmail] = useState(eMail);

    return (
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h5>
                Olá, <strong>VITOR</strong>!
            </h5>
            <p>Para acessar nosso serviço é necessário verificar seu email.</p>
            <p>É muito simples, clique no botão abaixo:</p>
            <button style="padding: 0.7em; background-color: #2b961f; border-radius: 10px; border:none ;">
                <a href="LINK" style="text-decoration: none; color: white">
                    Verifique seu email!
                </a>
            </button>
            <p>
                Caso não consiga clicando logo acima, é só copiar e colar o link
                abaixo em seu navegador:
            </p>
            <p>LINK</p>
            <p>
                <small>SellAnne &reg;</small>
            </p>
        </div>
    );
};

export default EditPerfil;
