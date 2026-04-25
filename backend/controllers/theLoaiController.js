const TheLoai = require('../models/TheLoai');

const getTheLoais = async (req, res) => {
    try {
        const theLoais = await TheLoai.find().sort({ createdAt: -1 });
        res.status(200).json(theLoais);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tải danh sách thể loại', error: error.message });
    }
};

const createTheLoai = async (req, res) => {
    try {
        const { tenTheLoai, moTa } = req.body;
        const exists = await TheLoai.findOne({ tenTheLoai });
        if (exists) return res.status(400).json({ message: 'Thể loại này đã tồn tại!' });

        const newTL = await TheLoai.create({ tenTheLoai, moTa });
        res.status(201).json({ message: 'Thêm thể loại thành công!', theLoai: newTL });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo thể loại', error: error.message });
    }
};

const deleteTheLoai = async (req, res) => {
    try {
        const tl = await TheLoai.findByIdAndDelete(req.params.id);
        if (!tl) return res.status(404).json({ message: 'Không tìm thấy thể loại!' });
        res.status(200).json({ message: 'Đã xóa thể loại!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa thể loại', error: error.message });
    }
};

module.exports = { getTheLoais, createTheLoai, deleteTheLoai };
