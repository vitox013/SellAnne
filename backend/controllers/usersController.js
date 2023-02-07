const User = require("../models/User");
const Client = require("../models/Client");
const Products = require("../models/Products");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc    Get all users
// @route   GET /users
// @acess Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users?.length) {
        return res.status(400).json({ message: "Nenhum usuário encontrado" });
    }
    res.json(users);
});

// @desc    Create new user
// @route   Post /users
// @acess Private
// const createNewUser = asyncHandler(async (req, res) => {
//     const { username, email, password } = req.body;

//     // Confirmando data
//     if (!username || !email || !password) {
//         return res.status(400).json({ message: "Preencha todos os campos" });
//     }

//     // Checando se usuário já existe
//     const duplicate = await User.findOne({ email }).lean().exec();
//     if (duplicate) {
//         return res.status(409).json({ message: "Usuário já existe" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const userObject = { username, email, password: hashedPassword };

//     const user = await User.create(userObject);

//     if (user) {
//         res.status(201).json({
//             message: `Usuário ${username} criado com sucesso`,
//         });
//     } else {
//         res.status(400).json({ message: "Erro ao criar usuário" });
//     }
// });

// @desc    add client to user
// @route   Post /users
// @acess Private

const addClient = asyncHandler(async (req, res) => {});

// @desc    Update a user
// @route   PATCH /users
// @acess Private

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, password, clientes, produtos } = req.body;

    if (!id || !username || !email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: "Usuário não encontrado" });
    }

    // Checando se usuário já existe
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate && duplicate?._id.toString() !== id) {
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
});

// @desc    Delete a user
// @route   DELETE /users
// @acess Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Necessário informar o id" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const result = await user.deleteOne();

    const reply = `Usuario: ${user.username} foi deletado com sucesso`;

    res.json(reply);
});

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
};
