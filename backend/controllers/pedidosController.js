const Client = require("../models/Client");
const Products = require("../models/Products");
const asyncHandler = require("express-async-handler");
const Pedidos = require("../models/Pedidos");

// @desc    Get all client
// @route   GET /client
// @acess Private
const getAllPedidos = asyncHandler(async (req, res) => {
    const clientId = req.params.id;

    const pedidos = await Client.find({ clientId: clientId }).lean();

    if (!pedidos?.length) {
        return res.status(400).json({ message: "Nenhum pedido encontrado" });
    }

    res.json(pedidos);
});

// @desc    Create new client
// @route   Post /client
// @acess Private
const createNewPedido = asyncHandler(async (req, res) => {
    const { clientId, produtoId, quantidade, qtdPaga } = req.body;

    // Confirmando data
    if (!clientId || !produtoId || !quantidade || !qtdPaga) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    const pedidoObject = { clientId, produtoId, quantidade, qtdPaga };

    const pedido = await Pedidos.create(pedidoObject);

    if (pedido) {
        res.status(201).json({
            message: `Pedido criado com sucesso`,
        });
    } else {
        res.status(400).json({ message: "Erro ao criar pedido" });
    }
});

// @desc    Update a client
// @route   PATCH /client
// @acess Private

const updatePedido = asyncHandler(async (req, res) => {
    const { pedidoId, produtoId, quantidade, qtdPaga } = req.body;

    if (!pedidoId) {
        return res.status(400).json({ message: "Preencha o Id do pedido" });
    }

    const pedido = await Pedidos.findById(pedidoId).exec();

    if (!pedido) {
        return res.status(400).json({ message: "Pedido não encontrado" });
    }

    pedido.quantidade = quantidade;
    pedido.qtdPaga = qtdPaga;
    pedido.produtoId = produtoId;

    const updatedPedido = await pedido.save();

    res.json({ message: `${updatePedido} atualizado!` });
});

// @desc    Delete a client
// @route   DELETE /client
// @acess Private
const deletePedido = asyncHandler(async (req, res) => {
    const { pedidoId } = req.body;

    if (!pedidoId) {
        return res.status(400).json({ message: "Necessário informar o id" });
    }

    const pedido = await Pedidos.findById(pedidoId).exec();

    if (!pedido) {
        return res.status(400).json({ message: "Pedido não encontrado" });
    }

    const result = await pedido.deleteOne();

    const reply = `Pedido foi deletado com sucesso`;

    res.json(reply);
});

module.exports = {
    getAllPedidos,
    createNewPedido,
    updatePedido,
    deletePedido,
};
