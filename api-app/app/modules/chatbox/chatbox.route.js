const express = require('express');
const validate = require('express-validation');
const controller = require('./chatbox.controller');
const rules = require('./chatbox.rule');
const routes = express.Router();
const prefix = '/chatbox';
const multer = require('multer');
// const path = require('path');
const upload = multer();

// Create conversation
routes
    .route('/conversation/create-group')
    .post(validate(rules.createGroupConversation), controller.createGroupConversation);

// Add participant to conversation
routes
    .route('/conversation/add-group-participant')
    .post(validate(rules.addGroupParticipant), controller.addGroupParticipant);

// Pin conversation
routes.route('/conversation/pin').post(validate(rules.pinConversation), controller.pinConversation);

// Get conversation list
routes.route('/conversation').get(controller.getConversationList);

// Update conversation
routes.route('/conversation').put(validate(rules.updateConversation), controller.updateConversation);

// Send message
routes.route('/message').post(upload.array('files'), validate(rules.sendMessage), controller.sendMessage);

// Get message list
routes.route('/message').get(controller.getMessageList);

module.exports = {
    prefix,
    routes,
};
