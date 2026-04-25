const mongoose = require('mongoose');

const theoDoiSchema = mongoose.Schema({
    docGia: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },

    trangThai: {
        type: String,
        enum: ['cho_duyet', 'da_chuan_bi', 'dang_muon', 'da_tra', 'da_huy'],
        default: 'cho_duyet'
    },

    ngayYeuCau: { type: Date, default: Date.now },
    ngayDuyet: { type: Date },
    ngayNhan: { type: Date },
    hanTra: { type: Date },
    ngayTraThucTe: { type: Date },

    daGiaHan: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiSchema);
