const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    clients: [
        {
            clientName: {
                type: String,
                required: true,
            },
            telefone: {
                type: Number,
            },
            pedidos: [
                {
                    codigoProduto: {
                        type: Number,
                        required: true,
                    },
                    nomeProduto: {
                        type: String,
                        required: true,
                    },
                    quantidade: {
                        type: Number,
                        required: true,
                    },
                    qtdPaga: {
                        type: Number,
                        required: true,
                    },
                    valor: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
    ],
    produtos: [
        {
            code: {
                type: Number,
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            estoque: {
                type: Number,
                required: true,
                default: 0,
            },
            preco: {
                type: Number,
                required: true,
                default: 0,
            },
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
