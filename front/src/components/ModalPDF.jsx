import React, { useEffect, useState } from "react";
import { Modal, Button, Card, InputGroup, Form } from "react-bootstrap";
import { generatePDF } from "../features/clients/generatePDF";

const ModalPDF = ({
    handleClosePDF,
    showPDF,
    fornecedores,
    pedidos,
    clienteNome,
}) => {
    const [fornsSelecionados, setFornsSelecionados] = useState([]);
    const [pedidosSelecionados, setPedidosSelecionados] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState([]);

    useEffect(() => {
        if (fornecedores?.length > 0) {
            setCheckboxStates(
                fornecedores?.reduce(
                    (acc, fornecedor) => ({ ...acc, [fornecedor?._id]: false }),
                    {}
                )
            );
        }
    }, [fornecedores]);

    function handleCheckboxChange(event) {
        const { id, checked } = event.target;
        setCheckboxStates((prevState) => ({
            ...prevState,
            [id]: checked,
        }));
    }

    useEffect(() => {
        const fornsSelecionados = [];
        for (const fornecedorId in checkboxStates) {
            if (checkboxStates[fornecedorId]) {
                fornsSelecionados.push(fornecedorId);
            }
        }
        setFornsSelecionados(fornsSelecionados);
    }, [checkboxStates]);

    useEffect(() => {
        const pedidosSelecionados = [];

        pedidos?.map((pedido) => {
            if (fornsSelecionados?.includes(pedido?.fornecedorId)) {
                pedidosSelecionados.push(pedido);
            }
        });
        setPedidosSelecionados(pedidosSelecionados);
    }, [fornsSelecionados]);

    const onClickGenerate = () => {
        generatePDF(clienteNome, pedidosSelecionados);
        handleClosePDF();
        setCheckboxStates(
            fornecedores?.reduce(
                (acc, fornecedor) => ({ ...acc, [fornecedor?._id]: false }),
                {}
            )
        );
    };

    return (
        <Modal show={showPDF} onHide={handleClosePDF}>
            <Modal.Header closeButton>
                <Modal.Title>Gere relatório</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {fornecedores?.length > 0 &&
                    fornecedores?.map((fornecedor) => (
                        <InputGroup key={fornecedor?._id} className="mb-3">
                            <InputGroup.Checkbox
                                id={fornecedor?._id}
                                checked={checkboxStates[fornecedor?._id]}
                                onChange={handleCheckboxChange}
                            />
                            <Form.Control
                                value={fornecedor?.nomeFornecedor}
                                readOnly
                            />
                        </InputGroup>
                    ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onClickGenerate}>
                    Gerar PDF
                </Button>

                <Button variant="secondary" onClick={handleClosePDF}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPDF;
