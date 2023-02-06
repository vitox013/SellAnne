const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clientsController");
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT);

router
    .route("/:id")
    .get(clientsController.getAllClients)

module.exports = router;
