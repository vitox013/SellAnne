const Products = require("../models/Products");
const asyncHandler = require("express-async-handler");

// @desc    Get all products
// @route   GET /products
// @acess Private
const getAllProducts = asyncHandler(async (req, res) => {
    const vendedorId = req.params.id;

    if (vendedorId !== "undefined") {
        const products = await Products.find({ vendedor: vendedorId }).lean();

        if (!products?.length) {
            return res
                .status(400)
                .json({ message: "Nenhum produto encontrado" });
        }
        res.json(products);
    } else {
        return [];
    }
});

// @desc    Create new products
// @route   Post /products
// @acess Private
const createNewProduct = asyncHandler(async (req, res) => {
    const { vendedor, codigo, produto, estoque, preco } = req.body;

    // Confirmando data
    if (!codigo || !produto || !estoque || !preco) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    // Checando se produto já existe
    const duplicate = await Products.findOne({ vendedor, codigo })
        .lean()
        .exec();
    if (duplicate) {
        return res.status(409).json({ message: "Esse produto já existe" });
    }

    const productsObject = { vendedor, codigo, produto, estoque, preco };

    const products = await Products.create(productsObject);

    if (products) {
        res.status(201).json({
            message: `Produto ${products.produto} criado com sucesso`,
        });
    } else {
        res.status(400).json({ message: "Erro ao criar produto" });
    }
});

// @desc    Update a products
// @route   PATCH /products
// @acess Private

const updateProduct = asyncHandler(async (req, res) => {
    const { vendedor, id, codigo, produto, estoque, preco } = req.body;

    if (!codigo || !produto || !estoque || !preco) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    const products = await Products.findById(id, vendedor).exec();

    if (!products) {
        return res.status(400).json({ message: "Produto não encontrado" });
    }

    // Checando se produto já existe
    const duplicate = await Products.findOne({ vendedor, codigo })
        .lean()
        .exec();

    if (duplicate && duplicate?._id.toString() !== id) {
        return res
            .status(409)
            .json({ message: "Existe um outro produto com esse codigo" });
    }

    products.codigo = codigo;
    products.produto = produto;
    products.estoque = estoque;
    products.preco = preco;

    const updateProducts = await products.save();

    res.json({ message: `${updateProducts.produto} atualizado!` });
});

// @desc    Delete a products
// @route   DELETE /products
// @acess Private
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Necessário informar o id" });
    }

    const products = await Products.findById(id).exec();

    if (!products) {
        return res.status(400).json({ message: "Produto não encontrado" });
    }

    const result = await products.deleteOne();

    const reply = `Produto: ${result.nome} foi deletado com sucesso`;

    res.json(reply);
});

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
};
