const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    codigo: {
        type: Number,
        required: true,
    },
    produto: {
        type: String,
        required: true,
    },
    estoque: {
        type: Number,
        required: true,
        default: 0
    },
    preco: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model('Products', ProductsSchema)