import { store } from "../../app/store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { userApiSlice } from "../users/userApiSlice";

const Prefetch = () => {
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
