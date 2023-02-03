import { Container } from "react-bootstrap";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Public from "./pages/Public";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import DashLayout from "./components/DashLayout";
import NovoCliente from "./pages/NovoCliente";
import DetalhesPedido from "./pages/DetalhesPedido";
function App() {
    return (
        <>
            <Container className="App mx-0 px-0" fluid>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Public />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Cadastro />} />

                        <Route path="dashboard" element={<DashLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route
                                path="novocliente"
                                element={<NovoCliente />}
                            />
                            <Route path="cliente/" element={<DetalhesPedido />} />
                        </Route>
                    </Route>
                </Routes>
            </Container>
        </>
    );
}

export default App;
