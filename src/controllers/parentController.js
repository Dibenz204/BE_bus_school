// const db = require('../models');


// const createParent = async (req, res) => {
//     try {
//         const newParent = await db.Parent.create(req.body);
//         return res.status(201).json({
//             message: 'Tạo phụ huynh thành công',
//             data: newParent
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Lỗi khi tạo phụ huynh', error: err.message });
//     }
// };

// const getAllParents = async (req, res) => {
//     try {
//         const parents = await db.Parent.findAll();
//         res.status(200).json(parents);
//     } catch (err) {
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách phụ huynh' });
//     }
// };

// // Mấy hàm khác (getById, update, delete) tao có thể viết tiếp nếu mày muốn
// module.exports = { createParent, getAllParents };
