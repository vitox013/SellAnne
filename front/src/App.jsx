import { Container } from "react-bootstrap";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Public from "./pages/Public";
import Login from "./features/auth/Login";
import Cadastro from "./features/users/Cadastro";
import Dashboard from "./pages/Dashboard";
import DashLayout from "./components/DashLayout";
import NovoCliente from "./features/clients/NovoCliente";
import DetalhesCliente from "./features/clients/DetalhesCliente";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import useAuth from "./hooks/useAuth";
import Error404 from "./pages/Error404";
import ClientesLayout from "./features/clients/ClientesLayout";
import Clientes from "./features/clients/Clientes";
import ProductsLayout from "./features/products/ProductsLayout";
import Produtos from "./features/products/Produtos";
import NovoProduto from "./features/products/NovoProduto";
import DetalhesProduto from "./features/products/DetalhesProduto";
import FornecedoresLayout from "./features/fornecedores/FornecedoresLayout";
import Fornecedores from "./features/fornecedores/Fornecedores";
import DetalhesFornecedor from "./features/fornecedores/DetalhesFornecedor";
import NovoFornecedor from "./features/fornecedores/NovoFornecedor";

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
                                    </Route>
                                    <Route
                                        path="clientes"
                                        element={<ClientesLayout />}
                                    >
                                        <Route index element={<Clientes />} />
                                        <Route
                                            path="novocliente"
                                            element={<NovoCliente />}
                                        />
                                        <Route
                                            path=":id"
                                            element={<DetalhesCliente />}
                                        />
                                    </Route>

                                    <Route
                                        path="produtos"
                                        element={<ProductsLayout />}
                                    >
                                        <Route index element={<Produtos />} />
                                    </Route>

                                    <Route
                                        path="fornecedores"
                                        element={<FornecedoresLayout />}
                                    >
                                        <Route
                                            index
                                            element={<Fornecedores />}
                                        />
                                        <Route
                                            path=":id"
                                            element={<DetalhesFornecedor />}
                                        />
                                        <Route
                                            path="novofornecedor"
                                            element={<NovoFornecedor />}
                                        />
                                    </Route>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
