const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    vendedorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    nome: {
        type: String,
        required: true,
    },
    telefone: {
        type: Number,
    },
    pedidos: [
        {
            produto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true,
            },
            quantidade: {
                type: Number,
                required: true,
                default: 0,
            },
            situacao: {
                type: String,
                required: true,
            },
            qtdPaga: {
                type: Number,
                required: true,
                default: 0,
            },
        },
    ],
});

module.exports = mongoose.model("Client", ClientSchema);
