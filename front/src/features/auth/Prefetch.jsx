import { store } from "../../app/store";
import { clientsApiSlice } from "../clients/clientsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { productsApiSlice } from "../products/productsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { pedidosApiSlice } from "../pedidos/pedidosApiSlice";

const Prefetch = () => {
    const dispatch = useDispatch();
    const { userId } = useAuth();

    useEffect(() => {
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
        store.dispatch(
            pedidosApiSlice.util.prefetch("getPedidos", userId, {
                force: true,
            })
        );
    }, []);

    return <Outlet />;
};
export default Prefetch;
