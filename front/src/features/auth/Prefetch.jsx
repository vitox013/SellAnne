import { store } from "../../app/store";
import { clientsApiSlice } from "../clients/clientsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { productsApiSlice } from "../products/clientsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
    useEffect(() => {
        console.log("subscribing");
        const clients = store.dispatch(
            clientsApiSlice.endpoints.getClients.initiate()
        );
        const users = store.dispatch(
            usersApiSlice.endpoints.getUsers.initiate()
        );
        const products = store.dispatch(
            productsApiSlice.endpoints.getProducts.initiate()
        );

        return () => {
            console.log("unsubscribing");
            clients.unsubscribe();
            users.unsubscribe();
            products.unsubscribe();
        };
    }, []);

   return <Outlet />
};
export default Prefetch
