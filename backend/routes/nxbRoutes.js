const express = require('express');
const router = express.Router();
const { getNXBs, createNXB, updateNXB, deleteNXB } = require('../controllers/nxbController');

router.route('/')
    .get(getNXBs)
    .post(createNXB);

router.route('/:maNXB')
    .put(updateNXB)
    .delete(deleteNXB);

module.exports = router;
