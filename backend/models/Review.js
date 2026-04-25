const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    sach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
    docGia: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hoTen: { type: String, required: true },
    soSao: { type: Number, required: true, min: 1, max: 5 },
    noiDung: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
