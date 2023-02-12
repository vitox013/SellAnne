import { store } from "../../app/store";
import { clientsApiSlice } from "../clients/clientsApiSlice";
import { productsApiSlice } from "../products/productsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { pedidosApiSlice } from "../pedidos/pedidosApiSlice";
import { userApiSlice } from "../users/userApiSlice";

const Prefetch = () => {
    const dispatch = useDispatch();
    const { userId } = useAuth();

    useEffect(() => {
        store.dispatch(
            userApiSlice.util.prefetch("getUserData", userId, {
                force: true,
            })
        );
    }, []);

    return <Outlet />;
};
export default Prefetch;
