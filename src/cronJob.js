const cron = require('node-cron');
const scheduleService = require('./services/scheduleService.js');

// Chạy mỗi phút để kiểm tra và cập nhật trạng thái
cron.schedule('* * * * *', async () => {
    // console.log('🕒 Running schedule status update cron job...');
    try {
        await scheduleService.autoUpdateScheduleStatus();
    } catch (error) {
        console.error('❌ Cron job error:', error);
    }
});

module.exports = cron;