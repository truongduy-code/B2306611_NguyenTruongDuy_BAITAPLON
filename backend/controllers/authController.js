const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const splitFullName = (fullName = '') => {
    const cleanName = String(fullName).trim().replace(/\s+/g, ' ');
    if (!cleanName) return { hoLot: '', ten: '' };

    const parts = cleanName.split(' ');
    const ten = parts.pop() || '';
    const hoLot = parts.join(' ');

    return { hoLot, ten };
};

const generateCode = (prefix) => {
    const timePart = Date.now().toString().slice(-6);
    const randomPart = Math.floor(Math.random() * 900 + 100);
    return `${prefix}${timePart}${randomPart}`;
};

const generateResetCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateUniqueReaderCode = async () => {
    for (let i = 0; i < 20; i++) {
        const code = generateCode('DG');
        const existed = await User.findOne({ maDocGia: code });
        if (!existed) return code;
    }

    throw new Error('Không thể tạo mã độc giả tự động. Vui lòng thử lại!');
};

const generateUniqueEmployeeCode = async () => {
    for (let i = 0; i < 20; i++) {
        const code = generateCode('NV');
        const existed = await User.findOne({ msnv: code });
        if (!existed) return code;
    }

    throw new Error('Không thể tạo mã nhân viên tự động. Vui lòng thử lại!');
};

const getRoleLabel = (role) => {
    const map = {
        docgia: 'Độc giả',
        staff: 'Thủ thư',
        admin: 'Quản lý'
    };
    return map[role] || role;
};

const formatUserForClient = (userDoc) => {
    const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
    const hoTenDocGia = [user.hoLot, user.ten].filter(Boolean).join(' ').trim();

    delete user.password;
    delete user.resetPasswordCode;
    delete user.resetPasswordExpires;

    return {
        ...user,
        hoTen: user.hoTen || user.hoTenNV || hoTenDocGia,
        maSo: ['staff', 'admin'].includes(user.role) ? user.msnv : user.maDocGia,
        soDienThoaiHienThi: ['staff', 'admin'].includes(user.role) ? user.soDienThoai : user.dienThoai,
        roleLabel: getRoleLabel(user.role)
    };
};

const buildReaderPayload = (body) => {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();

    if (!email) {
        throw new Error('Email không được để trống!');
    }

    if (!password) {
        throw new Error('Mật khẩu không được để trống!');
    }

    const hoLotInput = String(body.hoLot || '').trim();
    const tenInput = String(body.ten || '').trim();
    const legacyName = String(body.hoTen || '').trim();
    const splittedName = splitFullName(legacyName);
    const hoLot = hoLotInput || splittedName.hoLot;
    const ten = tenInput || splittedName.ten;
    const hoTen = [hoLot, ten].filter(Boolean).join(' ').trim();

    if (!ten) {
        throw new Error('Vui lòng nhập tên độc giả!');
    }

    return {
        email,
        password,
        role: 'docgia',
        hoTen,
        hoLot,
        ten,
        ngaySinh: body.ngaySinh || undefined,
        phai: ['Nam', 'Nữ', 'Khác'].includes(body.phai) ? body.phai : 'Khác',
        diaChi: String(body.diaChi || '').trim(),
        dienThoai: String(body.dienThoai || '').trim()
    };
};

const buildEmployeePayload = async (body) => {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    const role = body.role === 'admin' ? 'admin' : 'staff';
    const hoTenNV = String(body.hoTenNV || body.hoTen || '').trim();

    if (!email) {
        throw new Error('Email nhân viên không được để trống!');
    }

    if (!password) {
        throw new Error('Mật khẩu nhân viên không được để trống!');
    }

    if (!hoTenNV) {
        throw new Error('Vui lòng nhập họ tên nhân viên!');
    }

    const msnv = String(body.msnv || '').trim().toUpperCase() || await generateUniqueEmployeeCode();

    return {
        email,
        password,
        role,
        hoTen: hoTenNV,
        msnv,
        hoTenNV,
        chucVu: String(body.chucVu || (role === 'admin' ? 'Quản lý' : 'Thủ thư')).trim(),
        diaChi: String(body.diaChi || '').trim(),
        soDienThoai: String(body.soDienThoai || '').trim()
    };
};

const register = async (req, res) => {
    try {
        const payload = buildReaderPayload(req.body);

        const userExistsByEmail = await User.findOne({ email: payload.email });
        if (userExistsByEmail) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        payload.maDocGia = await generateUniqueReaderCode();

        const user = await User.create(payload);
        res.status(201).json({
            message: `Đăng ký độc giả thành công! Mã độc giả của bạn là ${user.maDocGia}`,
            user: formatUserForClient(user)
        });
    } catch (error) {
        const statusCode = error.message?.includes('Vui lòng')
            || error.message?.includes('đã được sử dụng')
            || error.message?.includes('không được để trống')
            || error.message?.includes('Không thể tạo mã độc giả')
            ? 400
            : 500;

        res.status(statusCode).json({
            message: error.message || 'Lỗi server',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const identifier = String(req.body.email || req.body.taiKhoan || '').trim();
        const password = String(req.body.password || '').trim();

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
        }

        const normalizedEmail = identifier.toLowerCase();
        const normalizedCode = identifier.toUpperCase();

        const user = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { maDocGia: normalizedCode },
                { msnv: normalizedCode }
            ]
        });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
        }

        res.status(200).json({
            message: 'Đăng nhập thành công!',
            user: formatUserForClient(user)
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: 'Vui lòng nhập email để lấy lại mật khẩu!' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này!' });
        }

        const code = generateResetCode();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        user.resetPasswordCode = code;
        user.resetPasswordExpires = expires;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Mã đặt lại mật khẩu - Thư viện Online',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Khôi phục mật khẩu</h2>
                    <p>Xin chào ${user.getDisplayName ? user.getDisplayName() : (user.hoTen || 'bạn')},</p>
                    <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản thư viện.</p>
                    <p>Mã xác nhận của bạn là:</p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2563eb; margin: 16px 0;">
                        ${code}
                    </div>
                    <p>Mã này có hiệu lực trong <b>10 phút</b>.</p>
                    <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
                </div>
            `
        });

        res.status(200).json({
            message: 'Đã gửi mã xác nhận về email. Vui lòng kiểm tra hộp thư của bạn!'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Không thể gửi email khôi phục mật khẩu!',
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const code = String(req.body.code || '').trim();
        const newPassword = String(req.body.newPassword || '').trim();

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email, mã xác nhận và mật khẩu mới!' });
        }

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Mã xác nhận không đúng hoặc đã hết hạn!' });
        }

        user.password = newPassword;
        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({
            message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại ngay bây giờ.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi đặt lại mật khẩu!',
            error: error.message
        });
    }
};

const createEmployee = async (req, res) => {
    try {
        const creatorRole = String(req.body.creatorRole || '').trim();

        if (creatorRole !== 'admin') {
            return res.status(403).json({ message: 'Chỉ quản lý mới được tạo tài khoản nội bộ!' });
        }

        const payload = await buildEmployeePayload(req.body);

        const existedEmail = await User.findOne({ email: payload.email });
        if (existedEmail) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        const existedMSNV = await User.findOne({ msnv: payload.msnv });
        if (existedMSNV) {
            return res.status(400).json({ message: 'Mã số nhân viên này đã tồn tại!' });
        }

        const user = await User.create(payload);

        res.status(201).json({
            message: `Tạo tài khoản ${getRoleLabel(user.role).toLowerCase()} thành công!`,
            user: formatUserForClient(user)
        });
    } catch (error) {
        const statusCode = error.message?.includes('không được để trống')
            || error.message?.includes('Vui lòng')
            || error.message?.includes('đã được sử dụng')
            || error.message?.includes('đã tồn tại')
            || error.message?.includes('Không thể tạo mã nhân viên')
            ? 400
            : 500;

        res.status(statusCode).json({
            message: error.message || 'Lỗi tạo tài khoản nội bộ!',
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -resetPasswordCode -resetPasswordExpires')
            .sort({ createdAt: -1 });

        res.status(200).json(users.map(formatUserForClient));
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tải danh sách người dùng', error: error.message });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    createEmployee,
    getAllUsers
};
