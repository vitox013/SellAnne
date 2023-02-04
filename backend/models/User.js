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
    // clientes: [
    //     {
    //         clienteNome: {
    //             type: String,
    //             required: true,
    //         },
    //         telefone: {
    //             type: Number,
    //         },
    //         clientePedidos: [
    //             {
    //                 codProduto: {
    //                     type: Number,
    //                     required: true,
    //                 },
    //                 quantidade: {
    //                     type: Number,
    //                     required: true,
    //                     default: 1,
    //                 },
    //                 situacao: {
    //                     type: String,
    //                     required: true,
    //                     default: "Em andamento",
    //                 },
    //                 qtdPaga: {
    //                     type: Number,
    //                     required: true,
    //                     default: 0,
    //                 },
    //             },
    //         ],
    //     },
    // ],
    // produtos: [
    //     {
    //         codigo: {
    //             type: Number,
    //             required: true,
    //         },
    //         nomeProduto: {
    //             type: String,
    //             required: true,
    //         },
    //         estoqueProduto: {
    //             type: Number,
    //             required: true,
    //             default: 0,
    //         },
    //         preco: {
    //             type: Number,
    //             required: true,
    //             default: 0,
    //         },
    //     },
    // ],
});

module.exports = mongoose.model("User", userSchema);
