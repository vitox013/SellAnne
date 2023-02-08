const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/:id").get(productsController.getAllProducts);
module.exports = router;
