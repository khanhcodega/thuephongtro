const ChatController = require('../app/controllers/ChatController');
const express = require('express');
const router = express.Router();
const middlewareCheckLogin = require('../app/middlewares/client');

module.exports = (io) => {
    router.use(middlewareCheckLogin.ensureAuthenticated);
    router.get('/', ChatController.index);
    router.get('/get-chat', ChatController.createChat);
    router.post('/send-message', (req, res, next) => {
        ChatController.sendMessage(req, res, next, io); // Truyền io vào
    });
    return router;
};
