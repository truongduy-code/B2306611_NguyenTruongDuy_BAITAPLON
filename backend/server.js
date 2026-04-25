const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const sachRoutes = require('./routes/sachRoutes');
const authRoutes = require('./routes/authRoutes');
const nxbRoutes = require('./routes/nxbRoutes');
const theLoaiRoutes = require('./routes/theLoaiRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/sach', sachRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/nxb', nxbRoutes);
app.use('/api/the-loai', theLoaiRoutes);

app.get('/', (req, res) => {
    res.send('API Quản lý mượn sách đang hoạt động...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy ở cổng ${PORT}`);
});
