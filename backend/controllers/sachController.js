const Sach = require('../models/Sach');
const TheoDoi = require('../models/TheoDoiMuonSach');
const Review = require('../models/Review');
const NhaXuatBan = require('../models/NhaXuatBan');
const sendEmail = require('../utils/sendEmail');

const getDocGiaDisplayName = (docGia = {}) => {
    return docGia.hoTen
        || [docGia.hoLot, docGia.ten].filter(Boolean).join(' ').trim()
        || docGia.hoTenNV
        || 'Độc giả';
};

const normalizeLichSuItem = (item) => ({
    ...item,
    docGia: item.docGia
        ? {
            ...item.docGia,
            hoTen: getDocGiaDisplayName(item.docGia)
        }
        : null
});

const getBooks = async (req, res) => {
    try {
        const books = await Sach.find().lean();

        const booksWithStats = await Promise.all(
            books.map(async (book) => {
                const [reviews, borrowCount] = await Promise.all([
                    Review.find({ sach: book._id }).lean(),
                    TheoDoi.countDocuments({
                        sach: book._id,
                        trangThai: { $ne: 'da_huy' }
                    })
                ]);

                const rating = reviews.length > 0
                    ? Number(
                        (
                            reviews.reduce((acc, r) => acc + Number(r.soSao || 0), 0) / reviews.length
                        ).toFixed(1)
                    )
                    : 0;

                return {
                    ...book,
                    rating,
                    totalReviews: reviews.length,
                    borrowCount
                };
            })
        );

        return res.status(200).json(booksWithStats);
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi tải danh sách sách!',
            error: error.message
        });
    }
};

const getBookDetail = async (req, res) => {
    try {
        const sach = await Sach.findOne({ maSach: req.params.maSach })
            .populate('maTheLoai')
            .lean();

        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách!' });
        }

        const [nxb, reviews, borrowCount] = await Promise.all([
            sach.maNXB ? NhaXuatBan.findOne({ maNXB: sach.maNXB }).lean() : null,
            Review.find({ sach: sach._id }).lean(),
            TheoDoi.countDocuments({
                sach: sach._id,
                trangThai: { $ne: 'da_huy' }
            })
        ]);

        const rating = reviews.length > 0
            ? Number(
                (
                    reviews.reduce((acc, r) => acc + Number(r.soSao || 0), 0) / reviews.length
                ).toFixed(1)
            )
            : 0;

        return res.status(200).json({
            ...sach,
            rating,
            totalReviews: reviews.length,
            borrowCount,
            theLoai: sach.maTheLoai
                ? {
                    _id: sach.maTheLoai._id,
                    tenTheLoai: sach.maTheLoai.tenTheLoai,
                    moTa: sach.maTheLoai.moTa || ''
                }
                : null,
            nhaXuatBan: nxb
                ? {
                    maNXB: nxb.maNXB,
                    tenNXB: nxb.tenNXB,
                    diaChi: nxb.diaChi || ''
                }
                : null
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi tải chi tiết sách!',
            error: error.message
        });
    }
};

const createBook = async (req, res) => {
    try {
        let hinhAnh = req.body.hinhAnh || 'https://placehold.co/300x450';

        if (req.file) {
            hinhAnh = `http://localhost:3000/uploads/${req.file.filename}`;
        }

        const sach = await Sach.create({
            ...req.body,
            hinhAnh
        });

        return res.status(201).json(sach);
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi tạo sách!',
            error: error.message
        });
    }
};

const suaSach = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.hinhAnh = `http://localhost:3000/uploads/${req.file.filename}`;
        }

        const sach = await Sach.findOneAndUpdate(
            { maSach: req.params.maSach },
            updateData,
            { new: true }
        );

        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách để cập nhật!' });
        }

        return res.status(200).json(sach);
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi cập nhật sách!',
            error: error.message
        });
    }
};

const xoaSach = async (req, res) => {
    try {
        const sach = await Sach.findOneAndDelete({ maSach: req.params.maSach });

        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách để xóa!' });
        }

        return res.status(200).json({ message: 'Đã xóa sách!' });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi xóa sách!',
            error: error.message
        });
    }
};

const muonSach = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId!' });
        }

        const noXau = await TheoDoi.findOne({
            docGia: userId,
            trangThai: 'dang_muon',
            hanTra: { $lt: new Date() }
        });

        if (noXau) {
            return res.status(403).json({
                message: 'LỖI: Bạn đang có sách trễ hạn chưa trả, tài khoản bị khóa mượn mới!'
            });
        }

        const dangGiu = await TheoDoi.countDocuments({
            docGia: userId,
            trangThai: { $in: ['cho_duyet', 'da_chuan_bi', 'dang_muon'] }
        });

        if (dangGiu >= 3) {
            return res.status(403).json({
                message: 'LỖI: Bạn chỉ được mượn tối đa 3 cuốn cùng lúc!'
            });
        }

        const sach = await Sach.findOne({ maSach: req.params.maSach });

        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách!' });
        }

        if (sach.soQuyen <= 0) {
            return res.status(400).json({
                message: 'Sách hiện đã hết trong kho, vui lòng quay lại sau!'
            });
        }

        sach.soQuyen -= 1;
        await sach.save();

        await TheoDoi.create({
            docGia: userId,
            sach: sach._id,
            trangThai: 'cho_duyet',
            ngayYeuCau: new Date()
        });

        return res.status(200).json({
            message: 'Gửi yêu cầu thành công! Vui lòng chờ thủ thư duyệt.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi mượn sách!',
            error: error.message
        });
    }
};

const huyYeuCauMuon = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId!' });
        }

        const record = await TheoDoi.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu mượn!' });
        }

        if (String(record.docGia) !== String(userId)) {
            return res.status(403).json({ message: 'Bạn không có quyền hủy yêu cầu này!' });
        }

        if (record.trangThai !== 'cho_duyet') {
            return res.status(400).json({
                message: 'Chỉ có thể hủy yêu cầu khi phiếu vẫn đang chờ duyệt!'
            });
        }

        record.trangThai = 'da_huy';
        await record.save();

        const sach = await Sach.findById(record.sach);
        if (sach) {
            sach.soQuyen += 1;
            await sach.save();
        }

        return res.status(200).json({
            message: 'Đã hủy yêu cầu mượn sách thành công!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi hủy yêu cầu mượn!',
            error: error.message
        });
    }
};

const duyetSach = async (req, res) => {
    try {
        const record = await TheoDoi.findById(req.params.id).populate('docGia sach');

        if (!record) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
        }

        if (record.trangThai !== 'cho_duyet') {
            return res.status(400).json({
                message: 'Phiếu này không ở trạng thái chờ duyệt!'
            });
        }

        record.trangThai = 'da_chuan_bi';
        record.ngayDuyet = new Date();
        await record.save();

        let emailSent = false;
        let emailAttempted = false;

        if (record.docGia?.email) {
            emailAttempted = true;
            try {
                await sendEmail({
                    email: record.docGia.email,
                    subject: 'Sách của bạn đã sẵn sàng tại quầy!',
                    html: `<h3>Chào ${getDocGiaDisplayName(record.docGia)},</h3><p>Cuốn sách <b>${record.sach.tenSach}</b> bạn yêu cầu đã được chuẩn bị xong.</p><p>Vui lòng đến thư viện nhận sách trong vòng 24h.</p>`
                });
                emailSent = true;
            } catch (e) {
                console.log('Lỗi gửi mail:', e.message);
            }
        }

        if (emailSent) {
            return res.json({
                message: 'Đã duyệt phiếu và gửi email thông báo cho độc giả!',
                emailSent: true
            });
        }

        if (emailAttempted && !emailSent) {
            return res.json({
                message: 'Đã duyệt phiếu, nhưng không gửi được email thông báo.',
                emailSent: false
            });
        }

        return res.json({
            message: 'Đã duyệt phiếu. Độc giả chưa có email để nhận thông báo.',
            emailSent: false
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi duyệt sách!',
            error: error.message
        });
    }
};

const giaoSach = async (req, res) => {
    try {
        const record = await TheoDoi.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
        }

        if (record.trangThai !== 'da_chuan_bi') {
            return res.status(400).json({ message: 'Sách chưa được chuẩn bị!' });
        }

        record.trangThai = 'dang_muon';
        record.ngayNhan = new Date();

        const hanTra = new Date();
        hanTra.setDate(hanTra.getDate() + 14);
        record.hanTra = hanTra;

        await record.save();

        return res.json({ message: 'Đã giao sách cho độc giả!' });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi giao sách!',
            error: error.message
        });
    }
};

const traSach = async (req, res) => {
    try {
        const record = await TheoDoi.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
        }

        if (record.trangThai !== 'dang_muon') {
            return res.status(400).json({
                message: 'Phiếu này chưa giao sách, không thể trả!'
            });
        }

        record.trangThai = 'da_tra';
        record.ngayTraThucTe = new Date();
        await record.save();

        const sach = await Sach.findById(record.sach);
        if (sach) {
            sach.soQuyen += 1;
            await sach.save();
        }

        return res.status(200).json({
            message: 'Nhận trả sách thành công, đã hoàn lại kho!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi trả sách!',
            error: error.message
        });
    }
};

const huySach = async (req, res) => {
    try {
        const record = await TheoDoi.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
        }

        if (['dang_muon', 'da_tra', 'da_huy'].includes(record.trangThai)) {
            return res.status(400).json({ message: 'Không thể hủy ở trạng thái này!' });
        }

        record.trangThai = 'da_huy';
        await record.save();

        const sach = await Sach.findById(record.sach);
        if (sach) {
            sach.soQuyen += 1;
            await sach.save();
        }

        return res.json({
            message: 'Đã hủy phiếu và hoàn trả sách lên kệ!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi hủy sách!',
            error: error.message
        });
    }
};

const giaHanSach = async (req, res) => {
    try {
        const record = await TheoDoi.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
        }

        if (record.trangThai !== 'dang_muon') {
            return res.status(400).json({
                message: 'Phải nhận sách rồi mới được gia hạn!'
            });
        }

        if (record.daGiaHan) {
            return res.status(400).json({ message: 'Chỉ được gia hạn 1 lần!' });
        }

        record.hanTra = new Date(record.hanTra.getTime() + 7 * 24 * 60 * 60 * 1000);
        record.daGiaHan = true;
        await record.save();

        return res.status(200).json({
            message: 'Gia hạn thành công +7 ngày!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi gia hạn!',
            error: error.message
        });
    }
};

const postReview = async (req, res) => {
    try {
        const { sachId, userId, hoTen, soSao, noiDung } = req.body;

        const check = await TheoDoi.findOne({
            docGia: userId,
            sach: sachId,
            trangThai: 'da_tra'
        });

        if (!check) {
            return res.status(403).json({
                message: 'Bạn phải đọc xong và trả sách mới được đánh giá!'
            });
        }

        await Review.create({
            sach: sachId,
            docGia: userId,
            hoTen,
            soSao,
            noiDung
        });

        return res.status(201).json({
            message: 'Cảm ơn đánh giá của bạn!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi review!',
            error: error.message
        });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ sach: req.params.sachId }).sort({ createdAt: -1 });
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi tải review!',
            error: error.message
        });
    }
};

const getLichSuCaNhan = async (req, res) => {
    try {
        const lichSu = await TheoDoi.find({ docGia: req.params.userId })
            .populate('sach')
            .sort({ createdAt: -1 });

        return res.status(200).json(lichSu);
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi tải lịch sử cá nhân!',
            error: error.message
        });
    }
};

const getAllLichSu = async (req, res) => {
    try {
        const lichSu = await TheoDoi.find()
            .populate('sach')
            .populate('docGia', 'hoTen hoLot ten hoTenNV email maDocGia msnv dienThoai soDienThoai')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json(lichSu.map(normalizeLichSuItem));
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi tải lịch sử admin!',
            error: error.message
        });
    }
};

module.exports = {
    getBooks,
    getBookDetail,
    createBook,
    suaSach,
    xoaSach,
    muonSach,
    huyYeuCauMuon,
    duyetSach,
    giaoSach,
    traSach,
    huySach,
    giaHanSach,
    postReview,
    getReviews,
    getLichSuCaNhan,
    getAllLichSu
};
