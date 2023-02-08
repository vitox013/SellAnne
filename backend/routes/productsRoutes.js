const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT);

router
    .route("/")
    .post(productsController.createNewProduct)
    .patch(productsController.updateProduct)
    .delete(productsController.deleteProduct);

module.exports = router;
