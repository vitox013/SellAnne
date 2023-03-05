const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Token = require("../models/Token");

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
    const {
        userId,
        username,
        email,
        password,
        cliente,
        fornecedor,
        newPassword,
    } = req.body;

    // Atualização dos dados cadastrais do usuário

    if (username || email || password) {
        if (!userId || !username || !email) {
            return res
                .status(400)
                .json({ message: "Preencha todos os campos" });
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

        if (user?.username !== username || user?.email !== email) {
            user.username = username;
            user.email = email;
        }

        if (password) {
            if (password == newPassword) {
                return res
                    .status(409)
                    .json({ message: "Nova senha igual a senha atual!" });
            }
            const match = await bcrypt.compare(password, user.password);

            if (!match)
                return res.status(400).json({ message: "Senha inválida" });

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            return res
                .status(200)
                .json({ message: "Senha atualizada com sucesso" });
        }

        const updateUser = await user.save();

        res.status(200).json({ message: `Nome atualizado!` });
    }
    //Atualização de clientes ou produto
    if (cliente || fornecedor) {
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
                    const atualizarCliente = await User.findOneAndUpdate(
                        { "clients._id": cliente._id },
                        {
                            $set: {
                                "clients.$.clientName": cliente.clientName,
                                "clients.$.telefone": cliente.telefone,
                            },
                        }
                    );

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
                                "clients.$.pedidos.$[field].qtdPaga":
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
        if (fornecedor) {
            //Criação de fornecedor
            if (!fornecedor._id) {
                user.fornecedores.push(fornecedor);
                await user.save();
                return res.json({ message: `Fornecedor criado!` });
            } else if (
                fornecedor._id &&
                (fornecedor.nomeFornecedor || fornecedor.metodo)
            ) {
                const atualizarFornecedor = await User.findOneAndUpdate(
                    { "fornecedores._id": fornecedor._id },
                    {
                        $set: {
                            "fornecedores.$.nomeFornecedor":
                                fornecedor.nomeFornecedor,
                            "fornecedores.$.porcentagemPadrao":
                                fornecedor.porcentagemPadrao,
                        },
                    }
                );
                res.json({ message: `Fornecedor atualizado!` });
            } else if (fornecedor.produto) {
                const user = await User.findById(userId).exec();
                if (fornecedor.produto._id) {
                    const atualizarProduto = await User.findOneAndUpdate(
                        {
                            "fornecedores.produtos._id": fornecedor.produto._id,
                        },
                        {
                            $set: {
                                "fornecedores.$.produtos.$[field].code":
                                    fornecedor.produto.code,
                                "fornecedores.$.produtos.$[field].productName":
                                    fornecedor.produto.productName,
                                "fornecedores.$.produtos.$[field].precoVenda":
                                    fornecedor.produto.precoVenda,
                                "fornecedores.$.produtos.$[field].preco":
                                    fornecedor.produto.preco,
                                "fornecedores.$.produtos.$[field].porcentagemVenda":
                                    fornecedor.produto.porcentagemVenda,
                            },
                        },
                        {
                            arrayFilters: [
                                { "field._id": fornecedor.produto._id },
                            ],
                        }
                    );
                    res.json({ message: `Produto atualizado!` });
                } else {
                    const criarProduto = await User.findOneAndUpdate(
                        { "fornecedores._id": fornecedor._id },
                        {
                            $push: {
                                "fornecedores.$.produtos": fornecedor.produto,
                            },
                        }
                    );
                    return res.json({
                        message: `${fornecedor.produto.productName} criado!`,
                    });
                }
            }
        }
    }
});

// @desc    Delete a user
// @route   DELETE /users
// @acess Private
const deleteUser = asyncHandler(async (req, res) => {
    const { userId, cliente, fornecedor } = req.body;

    if (cliente) {
        if (cliente.pedido) {
            const deletarPedido = await User.findOneAndUpdate(
                { "clients._id": cliente._id },
                {
                    $pull: {
                        "clients.$[field].pedidos": {
                            _id: cliente.pedido._id,
                        },
                    },
                },
                { arrayFilters: [{ "field._id": cliente._id }] }
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
    } else if (fornecedor) {
        if (fornecedor._id && !fornecedor.produto) {
            const deletarFornecedor = await User.findByIdAndUpdate(userId, {
                $pull: { fornecedores: { _id: fornecedor._id } },
            });
            return res.status(200).json({ message: "Fornecedor deletado" });
        } else {
            const deletarProduto = await User.findOneAndUpdate(
                { "fornecedores._id": fornecedor._id },
                {
                    $pull: {
                        "fornecedores.$[field].produtos": {
                            _id: fornecedor.produto._id,
                        },
                    },
                },
                { arrayFilters: [{ "field._id": fornecedor._id }] }
            );
            return res.json({
                message: `Produto deletado!`,
            });
        }
    }

    if ((userId, !cliente, !fornecedor)) {
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado" });
        }
        const result = await user.deleteOne();
        const reply = `Usuario: ${user.username} foi deletado com sucesso`;
        res.json(reply);
    }
});

module.exports = {
    getUserData,
    updateUser,
    deleteUser,
};
