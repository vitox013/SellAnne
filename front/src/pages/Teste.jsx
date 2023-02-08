import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import Back from "../components/Back";
import { Link } from "react-router-dom";
import { selectAllClients } from "../features/clients/clientsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectClientsResult } from "../features/clients/clientsApiSlice";
import { selectClientsData } from "../features/clients/clientsDataSlice";

import { useGetClientsQuery } from "../features/clients/clientsApiSlice";
import useAuth from "../hooks/useAuth";

const Teste = () => {
    const id = "63dc93cc7b44c2fdc39ba3d8";
    const { userId } = useAuth();

    const { client } = useGetClientsQuery(userId, {
        selectFromResult: ({ data }) => ({
            client: data?.entities
        }),
    });

    // if (data.length === 0) {
    //     console.log("entrei");
    //     const { data: clients, isSuccess } = useGetClientsQuery(userId);

    //     useEffect(() => {
    //         if (isSuccess) {
    //             console.log(clients);
    //             // dispatch(setClientsData(userClients));
    //         }
    //     }, [isSuccess]);
    // }

    return (
        <Card>
            <Link
                to="/dashboard"
                className=" d-flex align-items-center text-dark"
            >
                <i className="bx bx-left-arrow-alt fs-1"></i>
                <span className="fw-bold fs-5 mb-0 ">Voltar</span>
            </Link>
            <h1 className="btn btn-dark">TESTE</h1>;
        </Card>
    );
};

export default Teste;
