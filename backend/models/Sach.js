const mongoose = require('mongoose');

const sachSchema = mongoose.Schema({
    maSach: { type: String, required: true, unique: true },
    tenSach: { type: String, required: true },
    donGia: { type: Number, required: true },
    soQuyen: { type: Number, required: true, default: 0 },
    namXuatBan: { type: Number },
    tacGia: { type: String },
    maNXB: { type: String },
    moTa: { type: String, default: '' },
    hinhAnh: { type: String, default: 'https://placehold.co/300x450/e2e8f0/475569?text=Chua+Co+Anh' },

    maTheLoai: { type: mongoose.Schema.Types.ObjectId, ref: 'TheLoai' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sach', sachSchema);
