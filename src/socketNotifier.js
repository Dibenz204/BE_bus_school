// File: socketNotifier.js
const notificationEmitter = require('./utils/eventEmitter');

const sendRealTimeNotification = (notification, targetUserId) => {
    try {
        // Phát sự kiện thay vì gửi trực tiếp qua socket
        if (notification.recipient_type === 'parent' && targetUserId) {
            notificationEmitter.emit(`notification_user_${targetUserId}`, notification);
        } else if (notification.recipient_type === 'admin') {
            notificationEmitter.emit('admin_notification', notification);
        }

        console.log(`📡 Sent real-time notification to ${notification.recipient_type}`);
    } catch (error) {
        console.error('❌ Error sending real-time notification:', error);
    }
};

module.exports = { sendRealTimeNotification };