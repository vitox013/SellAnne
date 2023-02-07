import { useState, useEffect, React } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Navbar, Button, Modal, Table } from "react-bootstrap";
import { useDeleteClientMutation } from "./clientsApiSlice";
import CardPedido from "../../components/CardPedido";
import { selectClientsData } from "./clientsDataSlice";
import { useSelector } from "react-redux";

const DetalhesPedido = () => {
    const [show, setShow] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [currentClient, setCurrentClient] = useState({});

    const { id } = useParams();
    const [deleteClient, { isSuccess, error }] = useDeleteClientMutation(id);
    const navigate = useNavigate();
    const clientsData = useSelector(selectClientsData);

    useEffect(() => {
        setCurrentClient(clientsData.find((client) => client.id === id));
    }, []);

    useEffect(() => {
        if (isSuccess) {
            navigate("/dashboard");
        }
        if (error) {
            setErrMsg("Erro ao deletar cliente");
        }
    }, [isSuccess, navigate, error]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        await deleteClient({ id });
    };

   
    return (
        <>
            <Navbar className="text-black mx-0 py-2 fluid bg-light shadow-sm">
                <Container className="d-flex align-items-center">
                    <Link
                        to="/dashboard"
                        className=" d-flex align-items-center text-dark"
                    >
                        <i className="bx bx-left-arrow-alt fs-1"></i>
                        <span className="fw-bold fs-5 mb-0 ">Voltar</span>
                    </Link>

                    <Button variant="" onClick={handleShow}>
                        <i className="bx bx-trash fs-2 text-dark"></i>
                    </Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Tem certeza?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Ao confirmar, o cliente será excluído do sistema.
                            {errMsg && (
                                <p className="alert alert-danger">{errMsg}</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="danger"
                                onClick={onSaveUserClicked}
                            >
                                Excluir
                            </Button>
                            <Button variant="success" onClick={handleClose}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </Navbar>
            <Container className="pt-2">
                <h2>{currentClient.nome}</h2>
                <Table className="tableFixHead pointer-event" striped bordered hover >
                    <thead >
                        <tr className="bg-light ">
                            <th>Item</th>
                            <th>Quant</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="py-2">
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan={2}>Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default DetalhesPedido;
