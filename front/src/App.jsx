import { Container } from "react-bootstrap";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Public from "./pages/Public";
import Login from "./features/auth/Login";
import Cadastro from "./features/users/Cadastro";
import Dashboard from "./features/users/Dashboard";
import DashLayout from "./components/DashLayout";
import NovoCliente from "./features/clients/NovoCliente";
import DetalhesCliente from "./features/clients/DetalhesCliente";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import useAuth from "./hooks/useAuth";

function App() {
    const { userId } = useAuth();
    return (
        <>
            <Container className="App mx-0 px-0" fluid>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Public />} />

                        <Route path="/signup" element={<Cadastro />} />
                        <Route path="/login" element={<Login />} />
                        <Route element={<PersistLogin />}>
                            <Route element={<RequireAuth />}>
                                <Route element={<Prefetch />}>
                                    <Route
                                        path="dashboard"
                                        element={<DashLayout />}
                                    >
                                        <Route index element={<Dashboard />} />
                                        <Route
                                            path="novocliente"
                                            element={<NovoCliente />}
                                        />
                                        <Route
                                            path="cliente/:id"
                                            element={<DetalhesCliente />}
                                        />
                                    </Route>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </Container>
        </>
    );
}

export default App;
