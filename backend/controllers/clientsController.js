const Client = require("../models/Client");
const Products = require("../models/Products");
const asyncHandler = require("express-async-handler");

// @desc    Get all client
// @route   GET /client
// @acess Private
const getAllClients = asyncHandler(async (req, res) => {
    const vendedorId = req.params.id;

    if (vendedorId !== "undefined") {
        const clients = await Client.find({ vendedorId: vendedorId }).lean();

        if (!clients?.length) {
            return res
                .status(400)
                .json({ message: "Nenhum cliente encontrado" });
        }

        res.json(clients);
    } else {
        return [];
    }
});

// @desc    Create new client
// @route   Post /client
// @acess Private
const createNewClient = asyncHandler(async (req, res) => {
    const { vendedorId, nome, telefone } = req.body;

    // Confirmando data
    if (!nome || !vendedorId) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    console.log(req.body);

    // Checando se cliente já existe
    const duplicate = await Client.findOne({ vendedorId, nome }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "Esse nome já existe" });
    }

    const clientObject = { vendedorId, nome, telefone };

    const client = await Client.create(clientObject);

    if (client) {
        res.status(201).json({
            message: `Cliente ${client.nome} criado com sucesso`,
        });
    } else {
        res.status(400).json({ message: "Erro ao criar cliente" });
    }
});

// @desc    Update a client
// @route   PATCH /client
// @acess Private

const updateClient = asyncHandler(async (req, res) => {
    const { id, nome, telefone, pedidos } = req.body;

    if (!pedidos) {
        if (!id || !nome) {
            return res
                .status(400)
                .json({ message: "Preencha todos os campos" });
        }
    }

    const client = await Client.findById(id).exec();

    if (!client) {
        return res.status(400).json({ message: "Cliente não encontrado" });
    }

    // Checando se cliente já existe
    const duplicate = await Client.findOne({ nome }).lean().exec();

    if (duplicate && duplicate?._id.toString() !== id) {
        return res
            .status(409)
            .json({ message: "Existe um outro cliente com esse nome" });
    }

    if (!pedidos) {
        client.nome = nome;
        client.telefone = telefone;
    }

    client.pedidos = pedidos;
    const updateClient = await client.save();

    res.json({ message: `${updateClient.nome} atualizado!` });
});

// @desc    Delete a client
// @route   DELETE /client
// @acess Private
const deleteClient = asyncHandler(async (req, res) => {
    const { id } = req.body;
    console.log(req.body);

    if (!id) {
        return res.status(400).json({ message: "Necessário informar o id" });
    }

    const client = await Client.findById(id).exec();

    if (!client) {
        return res.status(400).json({ message: "Cliente não encontrado" });
    }

    const result = await client.deleteOne();

    const reply = `Cliente: ${result.nome} foi deletado com sucesso`;

    res.json(reply);
});

module.exports = {
    getAllClients,
    createNewClient,
    updateClient,
    deleteClient,
};
