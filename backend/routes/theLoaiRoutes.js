const express = require('express');
const router = express.Router();
const { getTheLoais, createTheLoai, deleteTheLoai } = require('../controllers/theLoaiController');

router.route('/')
    .get(getTheLoais)
    .post(createTheLoai);

router.route('/:id')
    .delete(deleteTheLoai);

module.exports = router;
