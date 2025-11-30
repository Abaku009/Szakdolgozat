const { Router } = require("express");
const messageController = require("../controllers/messageController");
const messageRouter = Router();

messageRouter.post("/", messageController.postNewMessage);

module.exports = messageRouter;

