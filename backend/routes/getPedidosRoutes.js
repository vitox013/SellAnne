const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/:id").get(pedidosController.getAllPedidos);
module.exports = router;
