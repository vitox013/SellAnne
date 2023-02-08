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
    }
});

module.exports = mongoose.model("Client", ClientSchema);
