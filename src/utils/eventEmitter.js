// File: utils/eventEmitter.js
const EventEmitter = require('events');
class NotificationEmitter extends EventEmitter { }
const notificationEmitter = new NotificationEmitter();

module.exports = notificationEmitter;