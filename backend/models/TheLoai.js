const mongoose = require('mongoose');

const theLoaiSchema = mongoose.Schema({
    tenTheLoai: { type: String, required: true, unique: true },
    moTa: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('TheLoai', theLoaiSchema);
