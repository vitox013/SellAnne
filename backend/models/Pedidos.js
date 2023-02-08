const mongoose = require("mongoose");

const PedidosSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    quantidade: {
        type: Number,
        required: true,
    },
    qtdPaga: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model("Pedidos", PedidosSchema);
