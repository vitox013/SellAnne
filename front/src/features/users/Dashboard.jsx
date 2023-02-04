import React from "react";
import { Button, Container, Row, Form } from "react-bootstrap";
import CardClient from "../../components/CardClient";
import NavDash from "../../components/NavDash";
import NavFooter from "../../components/NavFooter";
import { useState } from "react";
import { useGetClientsQuery } from "../clients/clientsApiSlice";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
    const { currentUser, userId, username } = useAuth();



    const [posicao, setPosicao] = useState("");
    function scroll() {
        window.addEventListener("scroll", function () {
            this.scrollY > 150 ? setPosicao("top") : setPosicao("");
        });
    }
    scroll();

    const {
        data: clients,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetClientsQuery(null, {
        pollingInterval: 15000,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });


    let content;

    if (isLoading) content = <p>Loading...</p>;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {
        const { ids } = clients;

        const tableContent = ids?.length
            ? ids.map((clientId) => (
                  <CardClient key={clientId} clientId={clientId} path="" />
              ))
            : null;

        return (
            <>
                <NavDash
                    info=""
                    icon="bx bx-user-circle fs-1"
                    fixed={posicao}
                />
                <Container>
                    <h1 className="mt-2 ">Olá, {currentUser}!</h1>
                    <Row>
                        <Form className="d-flex mt-4 align-items-center">
                            <h2 className="col-5">Clientes</h2>
                            <Form.Control
                                size="sm"
                                type="search"
                                placeholder="Procurar"
                                className="me-2 h-75 w-50"
                                aria-label="Search"
                            />
                            <Button
                                variant="outline-success"
                                className="h-75 col-1 px-0 py-0"
                            >
                                <i className="bx bx-search"></i>
                            </Button>
                        </Form>
                    </Row>
                    <Row className="px-2">{tableContent}</Row>
                    <Row>
                        <NavFooter
                            path="/dashboard/novocliente"
                            info="Novo cliente"
                            icon="bx bx-plus me-1"
                        />
                    </Row>
                </Container>
            </>
        );
    }
};

export default Dashboard;
