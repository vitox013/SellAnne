const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clientsController");
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT);

router
    .route("/")
    .get(clientsController.getAllClients)
    .post(clientsController.createNewClient)
    .patch(clientsController.updateClient)
    .delete(clientsController.deleteClient);

module.exports = router;
