const express = require('express');
const router = express.Router();
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    createEmployee,
    getAllUsers
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/employees', createEmployee);
router.get('/users', getAllUsers);

module.exports = router;
