# Hệ thống mượn sách online

Dự án web quản lý mượn sách online được xây dựng theo mô hình MEVN Stack.

## Công nghệ sử dụng

- MongoDB
- Express.js
- Vue.js 3
- Node.js
- Vite
- Axios
- Mongoose

## Cấu trúc thư mục

```text
HE_THONG_MUON_SACH_CLEAN_CODE/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   ├── seeder.js
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Yêu cầu trước khi chạy

Máy cần cài sẵn:

- Node.js
- npm
- MongoDB

MongoDB cần được mở trước khi chạy backend.

## Cấu hình backend

File cấu hình nằm tại:

```text
backend/.env
```

Nội dung mặc định:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/QuanLyMuonSach
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

## Cài đặt thư viện

Cài thư viện cho backend:

```bash
cd backend
npm install
```

Cài thư viện cho frontend:

```bash
cd frontend
npm install
```

Lưu ý: cần chạy `npm install` riêng trong cả hai thư mục `backend` và `frontend`.

## Chạy backend

Vào thư mục backend:

```bash
cd backend
```

Chạy server:

```bash
npx run server.js
```

Sau khi chạy thành công, backend hoạt động tại:

```text
http://localhost:3000
```

## Chạy frontend

Mở terminal khác, vào thư mục frontend:

```bash
cd frontend
```

Chạy giao diện:

```bash
npm run dev
```

Sau khi chạy thành công, frontend hoạt động tại:

```text
http://localhost:5173
```

## Thêm dữ liệu mẫu

Nếu cần thêm dữ liệu mẫu vào MongoDB, chạy trong thư mục backend:

```bash
node seeder.js
```
