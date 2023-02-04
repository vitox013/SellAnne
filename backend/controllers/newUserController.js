const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @desc CheckDuplicateEmail
// @route POST /auth
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Confirmando data
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    // Checando se usuário já existe
    const duplicate = await User.findOne({ email }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "Usuário já existe" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = { username, email, password: hashedPassword };

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({
            message: `Usuário ${username} criado com sucesso`,
        });
    } else {
        res.status(400).json({ message: "Erro ao criar usuário" });
    }
});

module.exports = {
    createNewUser,
};
