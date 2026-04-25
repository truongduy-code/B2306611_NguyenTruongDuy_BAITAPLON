const NXB = require('../models/NhaXuatBan');

const getNXBs = async (req, res) => {
    try {
        const nxbs = await NXB.find().sort({ createdAt: -1 });
        res.status(200).json(nxbs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tải NXB', error: error.message });
    }
};

const createNXB = async (req, res) => {
    try {
        const { maNXB, tenNXB, diaChi } = req.body;
        const exists = await NXB.findOne({ maNXB });
        if (exists) return res.status(400).json({ message: 'Mã NXB đã tồn tại!' });

        const nxb = await NXB.create({ maNXB, tenNXB, diaChi });
        res.status(201).json({ message: 'Thêm NXB thành công!', nxb });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo NXB', error: error.message });
    }
};

const updateNXB = async (req, res) => {
    try {
        const nxb = await NXB.findOneAndUpdate({ maNXB: req.params.maNXB }, req.body, { new: true });
        if (!nxb) return res.status(404).json({ message: 'Không tìm thấy NXB!' });
        res.status(200).json({ message: 'Cập nhật thành công!', nxb });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật NXB', error: error.message });
    }
};

const deleteNXB = async (req, res) => {
    try {
        const nxb = await NXB.findOneAndDelete({ maNXB: req.params.maNXB });
        if (!nxb) return res.status(404).json({ message: 'Không tìm thấy NXB!' });
        res.status(200).json({ message: 'Đã xóa Nhà Xuất Bản!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa NXB', error: error.message });
    }
};

module.exports = { getNXBs, createNXB, updateNXB, deleteNXB };
