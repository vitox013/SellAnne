const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Token = require("../models/Token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    await sendEmail(
        user.email,
        "Verifique seu email - SellAnne",
        url,
        user.username
    );

    if (user) {
        res.status(201).json({
            message: `Conta criada, verifique seu email para verificar sua conta!`,
        });
    } else {
        res.status(400).json({ message: "Erro ao criar usuário" });
    }
});

module.exports = {
    createNewUser,
};
