const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const sendResetEmail = require("../utils/sendResetEmail");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: "Email não encontrado" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return res.status(400).json({ message: "Senha inválida" });

    if (!foundUser.verified) {
        let token = await Token.findOne({ userId: foundUser.id });

        if (!token) {
            token = await new Token({
                userId: foundUser._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();

            const url = `${process.env.BASE_URL}users/${foundUser.id}/verify/${token.token}`;

            await sendEmail(
                foundUser.email,
                "Verifique seu Email - SellAnne",
                url,
                foundUser.username
            );
        }

        return res.status(400).send({
            message:
                "Verifique seu email através do link que lhe enviamos via email!",
        });
    }

    const accessToken = jwt.sign(
        {
            UserInfo: {
                userId: foundUser._id,
                currentUser: foundUser.username,
                email: foundUser.email,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing email
    res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt)
        return res.status(401).json({ message: "Não autorizado!!!" });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });

            const foundUser = await User.findOne({
                email: decoded.email,
            }).exec();

            if (!foundUser)
                return res.status(401).json({ message: "Unauthorized" });

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        currentUser: foundUser.username,
                        userId: foundUser._id,
                        email: foundUser.email,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            res.json({ accessToken });
        })
    );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
};

const sendEmailResetPwd = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Preencha o email" });

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser)
        return res.status(401).json({ message: "Email não cadastrado" });

    let token = await Token.findOne({ userId: foundUser.id });

    if (!token) {
        token = await new Token({
            userId: foundUser._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}users/${foundUser.id}/reset/${token.token}`;

        await sendResetEmail(
            foundUser.email,
            "Resete sua senha - SellAnne",
            url,
            foundUser.username
        );

        return res.status(200).json({
            message: "Enviamos o link de recuperação para seu email!",
        });
    }

    return res
        .status(429)
        .json({ message: "Link já foi enviado. Tente novamente mais tarde!" });
});

const resetPwd = asyncHandler(async (req, res) => {
    const { password, userId, token } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Preencha o campo senha!" });
    } else if (!token) {
        return res
            .status(400)
            .json({ message: "Link expirou. Tente novamente!" });
    } else if (!userId) {
        return res.status(400).json({ message: "Necessário o Id do usuário!" });
    }

    const foundUser = await User.findOne({ _id: userId }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: "Usuario não encontrado" });
    }

    const foundToken = await Token.findOne({ userId: foundUser.id });

    if (foundToken) {
        foundUser.password = await bcrypt.hash(password, 10);
        await foundUser.save();

        await foundToken.remove();

        return res.status(200).json({ message: "Senha alterada com sucesso" });
    }

    return res.status(401).json({ message: "Link expirado" });
});

module.exports = {
    login,
    refresh,
    logout,
    sendEmailResetPwd,
    resetPwd,
};
