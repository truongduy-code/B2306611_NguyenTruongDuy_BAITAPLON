const mongoose = require('mongoose');

const nxbSchema = mongoose.Schema({
    maNXB: { type: String, required: true, unique: true },
    tenNXB: { type: String, required: true },
    diaChi: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('NhaXuatBan', nxbSchema);
