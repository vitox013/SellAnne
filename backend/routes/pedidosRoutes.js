const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT);

router
    .route("/")
    .post(pedidosController.createNewPedido)
    .patch(pedidosController.updatePedido)
    .delete(pedidosController.deletePedido);

module.exports = router;
