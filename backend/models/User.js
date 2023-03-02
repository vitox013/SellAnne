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
    verified: {
        type: Boolean,
        default: false,
    },
    clients: [
        {
            clientName: {
                type: String,
                required: true,
            },
            telefone: {
                type: String,
            },
            pedidos: [
                {
                    fornecedor: {
                        type: String,
                        required: true,
                    },
                    fornecedorId: {
                        type: String,
                        required: true,
                    },
                    metodo: {
                        type: String,
                        required: true,
                    },
                    produtoId: {
                        type: String,
                        required: true,
                    },
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
                    valorVenda: {
                        type: Number,
                    },
                    porcentagem: {
                        type: Number,
                    },
                },
            ],
        },
    ],
    fornecedores: [
        {
            nomeFornecedor: {
                type: String,
                required: true,
            },
            metodo: {
                type: String,
                required: true,
            },
            porcentagemPadrao: {
                type: Number,
            },
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
                    preco: {
                        type: Number,
                        required: true,
                        default: 0,
                    },
                    precoVenda: {
                        type: Number,
                    },
                    porcentagemVenda: {
                        type: Number,
                    },
                },
            ],
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
