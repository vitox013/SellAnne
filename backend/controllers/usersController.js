const User = require("../models/User");
const Client = require("../models/Client");
const Products = require("../models/Products");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc    Get all users
// @route   GET /users
// @acess Private
const getUserData = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
        return res.status(400).json({ message: "Usuário não encontrado" });
    }
    res.json(user);
});

// @desc    Update a user
// @route   PATCH /users
// @acess Private

const updateUser = asyncHandler(async (req, res) => {
    const { userId, username, email, password, cliente, produto } = req.body;

    // Atualização dos dados cadastrais do usuário

    if (username || email || password) {
        if (!userId || !username || !email) {
            {
                return res
                    .status(400)
                    .json({ message: "Preencha todos os campos" });
            }
        }

        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado" });
        }

        // Checando se usuário já existe
        const duplicate = await User.findOne({ email }).lean().exec();

        if (duplicate && duplicate?._id.toString() !== userId) {
            return res
                .status(409)
                .json({ message: "Existe um outro usuário com esse email" });
        }

        user.username = username;
        user.email = email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        const updateUser = await user.save();

        res.json({ message: `${updateUser.username} atualizado!` });
    }
    //Atualização de clientes ou produto
    if (cliente || produto) {
        const user = await User.findById(userId).exec();

        if (cliente) {
            //Criação e atualização de clientes
            if ((cliente.clientName || cliente.telefone) && !cliente.pedido) {
                //Criando novo cliente
                if (!cliente._id) {
                    user.clients.push(cliente);
                    await user.save();
                    return res.json({ message: `Cliente criado!` });
                }
                // Atualizando dados de cliente existente
                else {
                    const doc = await User.findOneAndUpdate(
                        { "clients._id": cliente._id },
                        {
                            $set: {
                                "clients.$.clientName": cliente.clientName,
                                "clients.$.telefone": cliente.telefone,
                            },
                        }
                    );
                    await user.save();

                    return res.json({
                        message: `${cliente.clientName} atualizado!`,
                    });
                }
            }
            //Verificando pedidos do cliente
            else {
                if (!cliente.pedido._id) {
                    const criarPedido = await User.findOneAndUpdate(
                        { "clients._id": cliente._id },
                        {
                            $push: {
                                "clients.$.pedidos": cliente.pedido,
                            },
                        }
                    );
                    return res.json({ message: `Pedido criado!` });
                } else {
                    const atualizarPedido = await User.findOneAndUpdate(
                        {
                            "clients.pedidos._id": cliente.pedido._id,
                        },
                        {
                            $set: {
                                "clients.$.pedidos.$[field].quantidade":
                                    cliente.pedido.quantidade,
                                "clients.$.pedidos.$[field].quantidade":
                                    cliente.pedido.qtdPaga,
                            },
                        },
                        {
                            arrayFilters: [{ "field._id": cliente.pedido._id }],
                        }
                    );

                    return res.json({ message: `Pedido atualizado!` });
                }
            }
        }
        if (produto) {
            const user = await User.findById(userId).exec();

            if (produto._id) {
                const atualizarProduto = await User.findOneAndUpdate(
                    {
                        "produtos._id": produto._id,
                    },
                    {
                        $set: {
                            "produtos.$[field].estoque": produto.estoque,
                            "produtos.$[field].preco": produto.preco,
                            "produtos.$[field].productNome":
                                produto.productNome,
                        },
                    },
                    {
                        arrayFilters: [{ "field._id": produto._id }],
                    }
                );
                res.json({ message: `${produto.productNome} atualizado!` });
            } else {
                user.produtos.push(produto);
                await user.save();
                res.json({ message: "Produto Criado" });
            }
        }
    }
});

// @desc    Delete a user
// @route   DELETE /users
// @acess Private
const deleteUser = asyncHandler(async (req, res) => {
    const { userId, cliente, produto } = req.body;

    if (cliente) {
        if (cliente.pedido) {
            const deletarPedido = await User.findOneAndUpdate(
                {
                    "clients._id": cliente._id,
                },
                {
                    $pullAll: {
                        "clients.$.pedidos": [{ _id: cliente.pedido._id }],
                    },
                }
            );
            return res.status(200).json({ message: "Pedido deletado" });
        } else {
            const deletarCliente = await User.findOneAndUpdate(
                { "clients._id": cliente._id },
                {
                    $pull: {
                        clients: { _id: cliente._id },
                    },
                }
            );
            return res.status(200).json({ message: "Cliente deletado" });
        }
    } else if (produto) {
        const deletarProduto = await User.findByIdAndUpdate(userId, {
            $pull: { produtos: { _id: produto._id } },
        });

        return res.status(200).json({ message: "Produto deletado" });
    }

    if ((userId, !cliente, !produto)) {
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado" });
        }
        const result = await user.deleteOne();
        const reply = `Usuario: ${user.username} foi deletado com sucesso`;
        res.json(reply);
    }
    // const user = await User.findById(userId).exec();

    // if (!user) {
    //     return res.status(400).json({ message: "Usuário não encontrado" });
    // }

    // const result = await user.deleteOne();

    // const reply = `Usuario: ${user.username} foi deletado com sucesso`;

    // res.json(reply);
});

module.exports = {
    getUserData,
    updateUser,
    deleteUser,
};
