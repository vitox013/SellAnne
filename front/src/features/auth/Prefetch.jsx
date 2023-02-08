import { store } from "../../app/store";
import { clientsApiSlice } from "../clients/clientsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { productsApiSlice } from "../products/clientsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import useAuth from "../../hooks/useAuth";
import { setClientsData } from "../clients/clientsDataSlice";
const Prefetch = () => {
    const dispatch = useDispatch();
    const { userId } = useAuth();

    useEffect(() => {
        console.log("subscribing");

        store.dispatch(
            clientsApiSlice.util.prefetch("getClients", userId, { force: true })
        );
        store.dispatch(
            usersApiSlice.util.prefetch("getUsers", userId, { force: true })
        );
        store.dispatch(
            productsApiSlice.util.prefetch("getProducts", userId, {
                force: true,
            })
        );
    }, []);

    return <Outlet />;
};
export default Prefetch;
