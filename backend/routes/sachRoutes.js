const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getBooks,
    getBookDetail,
    createBook,
    muonSach,
    huyYeuCauMuon,
    traSach,
    suaSach,
    xoaSach,
    getLichSuCaNhan,
    getAllLichSu,
    giaHanSach,
    postReview,
    getReviews,
    duyetSach,
    giaoSach,
    huySach
} = require('../controllers/sachController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/chi-tiet/:maSach', getBookDetail);

router.put('/gia-han/:id', giaHanSach);
router.put('/yeu-cau/huy/:id', huyYeuCauMuon);
router.post('/reviews', postReview);
router.get('/reviews/:sachId', getReviews);
router.get('/lich-su/admin', getAllLichSu);
router.get('/lich-su/:userId', getLichSuCaNhan);

router.put('/admin/duyet/:id', duyetSach);
router.put('/admin/giao/:id', giaoSach);
router.put('/admin/tra/:id', traSach);
router.put('/admin/huy/:id', huySach);

router.post('/:maSach/muon', muonSach);

router.route('/').get(getBooks).post(upload.single('hinhAnhFile'), createBook);
router.route('/:maSach').put(upload.single('hinhAnhFile'), suaSach).delete(xoaSach);

module.exports = router;
