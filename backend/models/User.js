const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['docgia', 'staff', 'admin'],
        default: 'docgia'
    },

    hoTen: {
        type: String,
        trim: true
    },

    maDocGia: {
        type: String,
        trim: true,
        uppercase: true,
        unique: true,
        sparse: true,
        required: function () {
            return this.role === 'docgia';
        }
    },
    hoLot: {
        type: String,
        trim: true
    },
    ten: {
        type: String,
        trim: true,
        required: function () {
            return this.role === 'docgia';
        }
    },
    ngaySinh: {
        type: Date
    },
    phai: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        default: 'Khác'
    },
    diaChi: {
        type: String,
        trim: true
    },
    dienThoai: {
        type: String,
        trim: true
    },

    msnv: {
        type: String,
        trim: true,
        uppercase: true,
        unique: true,
        sparse: true,
        required: function () {
            return ['staff', 'admin'].includes(this.role);
        }
    },
    hoTenNV: {
        type: String,
        trim: true,
        required: function () {
            return ['staff', 'admin'].includes(this.role);
        }
    },
    chucVu: {
        type: String,
        trim: true,
        default: 'Thủ thư',
        required: function () {
            return ['staff', 'admin'].includes(this.role);
        }
    },
    soDienThoai: {
        type: String,
        trim: true
    },

    resetPasswordCode: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

userSchema.methods.getDisplayName = function () {
    if (['staff', 'admin'].includes(this.role)) {
        return this.hoTen || this.hoTenNV || '';
    }

    return this.hoTen || [this.hoLot, this.ten].filter(Boolean).join(' ').trim();
};

module.exports = mongoose.model('User', userSchema);
