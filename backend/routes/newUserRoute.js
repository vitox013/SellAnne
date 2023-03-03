const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");

const newUserController = require("../controllers/newUserController");

router.route("/").post(newUserController.createNewUser);

router.get("/:id/verify/:token/", async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });

        if (!user)
            return res.status(400).send({ message: "Usuário não encontrado!" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.status(400).send({ message: "Link expirado!" });

        const setVerify = await User.findOneAndUpdate(
            { _id: user._id },
            {
                $set: {
                    verified: true,
                },
            }
        );

        await token.remove();

        res.status(200).send({ message: "Email verificado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro interno!" });
    }
});

module.exports = router;
