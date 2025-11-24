const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Hàm gửi OTP
const sendOTPEmail = async (toEmail, otp) => {
    const msg = {
        to: toEmail,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: '🔐 Mã xác nhận đổi mật khẩu - Bus School',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #ff6b35; text-align: center;">🚌 Bus School System</h2>
                    <p style="font-size: 16px; color: #333;">Xin chào,</p>
                    <p style="font-size: 14px; color: #666;">
                        Đây là mã xác nhận từ hệ thống <strong>Bus-School</strong> do <strong>PhongNhi</strong> thiết kế.
                    </p>
                    <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <p style="font-size: 14px; color: #666; margin: 0;">Vui lòng nhập mã sau:</p>
                        <h1 style="font-size: 36px; color: #ff6b35; letter-spacing: 8px; margin: 10px 0;">${otp}</h1>
                    </div>
                    <p style="font-size: 14px; color: #d32f2f; font-weight: bold;">
                        ⏰ Mã có hiệu lực trong vòng 60 giây để xác nhận đổi mật khẩu.
                    </p>
                    <p style="font-size: 12px; color: #999; margin-top: 20px;">
                        Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        © 2025 Bus School System - Designed by PhongNhi
                    </p>
                </div>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('✅ Email OTP đã được gửi đến:', toEmail);
        return true;
    } catch (error) {
        console.error('❌ Lỗi khi gửi email:', error);
        if (error.response) {
            console.error('Chi tiết lỗi:', error.response.body);
        }
        throw error;
    }
};

// ⭐ Hàm gửi thông báo đổi mật khẩu thành công
const sendPasswordChangedNotification = async (toEmail, userName) => {
    const msg = {
        to: toEmail,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: '✅ Mật khẩu đã được thay đổi - Bus School',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #4caf50; text-align: center;">🚌 Bus School System</h2>
                    <p style="font-size: 16px; color: #333;">Xin chào <strong>${userName}</strong>,</p>
                    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
                        <p style="font-size: 14px; color: #2e7d32; margin: 0;">
                            <strong>✅ Tài khoản của bạn đã được đổi mật khẩu thành công.</strong>
                        </p>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                        Nếu <strong>KHÔNG PHẢI</strong> do bạn đổi, vui lòng liên hệ cán bộ nhà trường để xử lý ngay.
                    </p>
                    <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="font-size: 13px; color: #e65100; margin: 0;">
                            <strong>⚠️ Lưu ý bảo mật:</strong><br>
                            - Không chia sẻ mật khẩu với bất kỳ ai<br>
                            - Thay đổi mật khẩu định kỳ<br>
                            - Sử dụng mật khẩu mạnh (ít nhất 8 ký tự)
                        </p>
                    </div>
                    <p style="font-size: 12px; color: #999;">
                        Thời gian thay đổi: ${new Date().toLocaleString('vi-VN')}
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        © 2025 Bus School System - Designed by PhongNhi<br>
                        Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('✅ Email thông báo đổi mật khẩu đã được gửi đến:', toEmail);
        return true;
    } catch (error) {
        console.error('❌ Lỗi khi gửi email thông báo:', error);
        if (error.response) {
            console.error('Chi tiết lỗi:', error.response.body);
        }
        throw error;
    }
};

module.exports = { sendOTPEmail, sendPasswordChangedNotification };