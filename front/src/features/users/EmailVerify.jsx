import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import useAuth from "../../hooks/useAuth";
import Loading from "../../utils/Loading";
import { useVerifyUserQuery } from "./newUserApiSlice";

const EmailVerify = () => {
    const [msg, setMsg] = useState([]);

    const param = useParams();
    const navigate = useNavigate();

    const url = `${param.id}/verify/${param.token}`;
    const { isSuccess, error, isLoading } = useVerifyUserQuery(url, {
        selectFromResult: ({ isSuccess, error, isLoading }) => ({
            isSuccess,
            error,
            isLoading,
        }),
    });

    useEffect(() => {
        if (isSuccess) {
            setMsg(
                <>
                    <h5>Email verificado com sucesso!</h5>
                    <small>
                        Você será redirecionado para a página de login.
                    </small>
                </>
            );
            const timer = setTimeout(() => {
                navigate("/login");
            }, 5000);
            return () => clearTimeout(timer);
        } else if (error) {
            setMsg(
                <>
                    <h5>{error?.data?.message}</h5>
                    <small>
                        Você será redirecionado para a página de login.
                    </small>
                </>
            );
            const timer = setTimeout(() => {
                navigate("/login");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, error]);

    return (
        <>
            <NavBar />
            {isLoading && <Loading/>}
            <Container className="text-center mt-5">{msg}</Container>
        </>
    );
};

export default EmailVerify;
