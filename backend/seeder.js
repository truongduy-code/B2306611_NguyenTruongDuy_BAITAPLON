const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Sach = require('./models/Sach');
const TheLoai = require('./models/TheLoai');
const NXB = require('./models/NhaXuatBan');
const User = require('./models/User');
const TheoDoi = require('./models/TheoDoiMuonSach');
const Review = require('./models/Review');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/QuanLyMuonSach';
const APP_PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const UPLOAD_BASE_URL = `http://localhost:${APP_PORT}/uploads`;

const localImage = (index) => `${UPLOAD_BASE_URL}/img${index}.png`;

const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
};

const addDays = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
};

const splitName = (fullName = '') => {
    const clean = String(fullName).trim().replace(/\s+/g, ' ');
    if (!clean) return { hoLot: '', ten: '' };

    const parts = clean.split(' ');
    const ten = parts.pop() || '';
    const hoLot = parts.join(' ');
    return { hoLot, ten };
};

const ensureUploadImagesExist = () => {
    const missing = [];

    for (let i = 1; i <= 20; i++) {
        const filePath = path.join(UPLOAD_DIR, `img${i}.png`);
        if (!fs.existsSync(filePath)) {
            missing.push(`img${i}.png`);
        }
    }

    if (missing.length > 0) {
        throw new Error(`Thiếu ảnh trong backend/uploads: ${missing.join(', ')}`);
    }
};

const seedData = async () => {
    try {
        ensureUploadImagesExist();

        await mongoose.connect(MONGO_URI);
        console.log('🟢 Đã kết nối database, bắt đầu seed dữ liệu demo...');

        await Review.deleteMany({});
        await TheoDoi.deleteMany({});
        await Sach.deleteMany({});
        await TheLoai.deleteMany({});
        await NXB.deleteMany({});
        await User.deleteMany({});

        console.log('🗑️ Đã xóa sạch dữ liệu demo cũ');

        const adminUser = await User.create({
            email: 'admin@library.local',
            password: '123456',
            role: 'admin',
            hoTen: 'Quản lý thư viện',
            msnv: 'NV001',
            hoTenNV: 'Quản lý thư viện',
            chucVu: 'Quản lý',
            diaChi: 'Thư viện trung tâm',
            soDienThoai: '0900000001'
        });

        const staffUser = await User.create({
            email: 'staff@library.local',
            password: '123456',
            role: 'staff',
            hoTen: 'Thủ thư thư viện',
            msnv: 'NV002',
            hoTenNV: 'Thủ thư thư viện',
            chucVu: 'Thủ thư',
            diaChi: 'Thư viện trung tâm',
            soDienThoai: '0900000002'
        });

        const readerNames = [
            'Nguyễn Minh Anh',
            'Trần Gia Hân',
            'Lê Quốc Bảo',
            'Phạm Tuấn Kiệt',
            'Võ Khánh Linh',
            'Huỳnh Nhật Nam',
            'Đặng Thiên Phúc',
            'Bùi Phương Nhi',
            'Phan Hoài Thương',
            'Ngô Quốc Huy',
            'Đoàn Mỹ Duyên',
            'Dương Trí Khang',
            'Mai Thanh Trúc',
            'Tạ Hoàng Long',
            'Châu Ngọc Diễm',
            'Lý Gia Bảo',
            'Đinh Phúc An',
            'La Bảo Ngọc'
        ];

        const readers = await User.insertMany(
            readerNames.map((fullName, index) => {
                const { hoLot, ten } = splitName(fullName);
                const stt = String(index + 1).padStart(3, '0');

                return {
                    email: `reader${index + 1}@library.local`,
                    password: '123456',
                    role: 'docgia',
                    hoTen: fullName,
                    maDocGia: `DG${stt}`,
                    hoLot,
                    ten,
                    ngaySinh: new Date(2002, index % 12, (index % 28) + 1),
                    phai: index % 2 === 0 ? 'Nam' : 'Nữ',
                    diaChi: `Khu vực ${index + 1}, Cần Thơ`,
                    dienThoai: `0900000${String(index + 1).padStart(3, '0')}`
                };
            })
        );

        console.log(`👤 Đã tạo 1 admin, 1 staff, ${readers.length} độc giả`);

        const nxbList = await NXB.insertMany([
            { maNXB: 'NXB_KD', tenNXB: 'NXB Kim Đồng', diaChi: '55 Quang Trung, Hà Nội' },
            { maNXB: 'NXB_TRE', tenNXB: 'NXB Trẻ', diaChi: '161B Lý Chính Thắng, TP.HCM' },
            { maNXB: 'NXB_NN', tenNXB: 'Nhã Nam', diaChi: '59 Đỗ Quang, Hà Nội' }
        ]);

        const theLoaiList = await TheLoai.insertMany([
            {
                tenTheLoai: 'Manga - Comic',
                moTa: 'Dòng sách truyện tranh và manga với nhịp truyện nhanh, hình ảnh sinh động, phù hợp cho độc giả yêu thích giải trí, phiêu lưu, hành động và hài hước.'
            },
            {
                tenTheLoai: 'Văn Học Thiếu Nhi',
                moTa: 'Những tác phẩm văn học dành cho thiếu nhi, giàu tính giáo dục, nuôi dưỡng trí tưởng tượng, cảm xúc trong sáng và các bài học nhân văn nhẹ nhàng.'
            },
            {
                tenTheLoai: 'Tủ Sách Tuổi Mới Lớn',
                moTa: 'Nhóm sách dành cho lứa tuổi học sinh, thanh thiếu niên với nội dung gần gũi về tình bạn, học đường, ước mơ, sự trưởng thành và cảm xúc tuổi trẻ.'
            },
            {
                tenTheLoai: 'Kiến Thức - Khoa Học',
                moTa: 'Các đầu sách cung cấp kiến thức phổ thông, khoa học khám phá và thông tin bổ ích về tự nhiên, vũ trụ, trái đất và thế giới xung quanh.'
            },
            {
                tenTheLoai: 'Truyện Tranh Lịch Sử',
                moTa: 'Thể loại tái hiện các nhân vật, truyền thuyết và sự kiện lịch sử qua hình ảnh và lối kể dễ tiếp cận, giúp độc giả học sử một cách sinh động hơn.'
            }
        ]);

        const getNXBCode = (ma) => nxbList.find((n) => n.maNXB === ma)?.maNXB;
        const getTheLoaiId = (name) => theLoaiList.find((t) => t.tenTheLoai === name)?._id;

        const bookBlueprints = [
            {
                maSach: 'MS001',
                tenSach: 'Doraemon - Truyện Ngắn Tập 1',
                donGia: 20000,
                tongKho: 15,
                namXuatBan: 2023,
                tacGia: 'Fujiko F. Fujio',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Tập truyện ngắn mở đầu của Doraemon đưa người đọc theo chân Nobita và chú mèo máy đến từ tương lai qua nhiều bảo bối thần kỳ. Mỗi câu chuyện vừa hài hước, gần gũi với tuổi học trò, vừa gửi gắm bài học nhẹ nhàng về tình bạn, sự cố gắng và trí tưởng tượng.',
                hinhAnh: localImage(1)
            },
            {
                maSach: 'MS002',
                tenSach: 'Thám Tử Lừng Danh Conan - Tập 100',
                donGia: 25000,
                tongKho: 12,
                namXuatBan: 2022,
                tacGia: 'Gosho Aoyama',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Cột mốc đặc biệt của series Conan với những vụ án gay cấn, các manh mối quan trọng và sự phát triển rõ nét của tuyến truyện Tổ chức Áo Đen. Cuốn sách phù hợp với độc giả yêu thích suy luận, bí ẩn và những màn phá án thông minh.',
                hinhAnh: localImage(2)
            },
            {
                maSach: 'MS003',
                tenSach: 'Shin Cậu Bé Bút Chì - Tập 1',
                donGia: 22000,
                tongKho: 10,
                namXuatBan: 2021,
                tacGia: 'Yoshito Usui',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Những mẩu chuyện đời thường siêu lầy của cậu bé Shin tạo nên tiếng cười liên tục từ đầu đến cuối. Dưới lớp vỏ hài hước là một thế giới gia đình ấm áp, nơi các tình huống quen thuộc được kể lại bằng phong cách tinh nghịch và duyên dáng.',
                hinhAnh: localImage(3)
            },
            {
                maSach: 'MS004',
                tenSach: 'One Piece - Tập 100',
                donGia: 25000,
                tongKho: 14,
                namXuatBan: 2022,
                tacGia: 'Eiichiro Oda',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Tập 100 đánh dấu chặng đường hoành tráng của băng Mũ Rơm với những trận chiến lớn, cảm xúc dâng cao và nhiều khoảnh khắc bùng nổ. Đây là cuốn sách dành cho người yêu thích tinh thần phiêu lưu, khát vọng tự do và sức mạnh của tình đồng đội.',
                hinhAnh: localImage(4)
            },
            {
                maSach: 'MS005',
                tenSach: 'Jujutsu Kaisen - Chú Thuật Hồi Chiến 1',
                donGia: 30000,
                tongKho: 8,
                namXuatBan: 2023,
                tacGia: 'Gege Akutami',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Tập đầu tiên mở ra thế giới chú thuật đầy nguy hiểm, nơi những lời nguyền và sức mạnh siêu nhiên luôn rình rập con người. Cốt truyện nhanh, mạnh và dồn dập, kết hợp giữa hành động, kinh dị và cảm xúc tuổi trẻ.',
                hinhAnh: localImage(5)
            },
            {
                maSach: 'MS006',
                tenSach: 'Spy x Family - Tập 1',
                donGia: 30000,
                tongKho: 9,
                namXuatBan: 2023,
                tacGia: 'Tatsuya Endo',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Một gia đình đặc biệt được tạo nên từ điệp viên, sát thủ và cô bé có khả năng đọc suy nghĩ. Spy x Family mang đến sự pha trộn hấp dẫn giữa hành động, hài hước và cảm giác ấm áp bất ngờ trong những mối quan hệ tưởng như giả tạo.',
                hinhAnh: localImage(6)
            },
            {
                maSach: 'MS007',
                tenSach: 'Dế Mèn Phiêu Lưu Ký',
                donGia: 55000,
                tongKho: 20,
                namXuatBan: 2020,
                tacGia: 'Tô Hoài',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Văn Học Thiếu Nhi'),
                moTa: 'Tác phẩm kinh điển của văn học thiếu nhi Việt Nam kể về hành trình trưởng thành của Dế Mèn qua những chuyến đi xa và những lần va vấp. Cuốn sách giàu tính phiêu lưu, nhân văn và rất phù hợp để nuôi dưỡng trí tưởng tượng cũng như lòng trắc ẩn.',
                hinhAnh: localImage(7)
            },
            {
                maSach: 'MS008',
                tenSach: 'Đất Rừng Phương Nam',
                donGia: 75000,
                tongKho: 11,
                namXuatBan: 2023,
                tacGia: 'Đoàn Giỏi',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Văn Học Thiếu Nhi'),
                moTa: 'Bức tranh sống động về thiên nhiên, con người và đời sống Nam Bộ được thể hiện qua hành trình của cậu bé An. Tác phẩm vừa giàu chất phiêu lưu, vừa đậm hồn quê, giúp người đọc cảm nhận vẻ đẹp hào sảng và chân tình của miền đất phương Nam.',
                hinhAnh: localImage(8)
            },
            {
                maSach: 'MS009',
                tenSach: 'Kính Vạn Hoa - Tập 1',
                donGia: 90000,
                tongKho: 7,
                namXuatBan: 2022,
                tacGia: 'Nguyễn Nhật Ánh',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Tủ Sách Tuổi Mới Lớn'),
                moTa: 'Những câu chuyện học đường vui nhộn xoay quanh bộ ba Quý Ròm, Tiểu Long và Hạnh. Tập sách gợi lại tuổi học trò trong trẻo với vô số trò nghịch ngợm, tình bạn đáng yêu và những tình huống khiến người đọc vừa bật cười vừa thấy thân thuộc.',
                hinhAnh: localImage(9)
            },
            {
                maSach: 'MS010',
                tenSach: 'Tý Quậy - Tập 1',
                donGia: 45000,
                tongKho: 9,
                namXuatBan: 2021,
                tacGia: 'Đào Hải',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Văn Học Thiếu Nhi'),
                moTa: 'Tý Quậy mang đến những mẩu chuyện hóm hỉnh, nghịch ngợm nhưng giàu chất trẻ thơ. Cuốn sách rất hợp với độc giả nhỏ tuổi nhờ lối kể gần gũi, vui tươi và nhịp truyện nhẹ nhàng, dễ đọc.',
                hinhAnh: localImage(10)
            },
            {
                maSach: 'MS011',
                tenSach: 'Lĩnh Nam Chích Quái',
                donGia: 150000,
                tongKho: 5,
                namXuatBan: 2023,
                tacGia: 'Trần Thế Pháp',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Truyện Tranh Lịch Sử'),
                moTa: 'Tập hợp những truyền thuyết dân gian đặc sắc của người Việt, tái hiện thế giới huyền thoại với nhiều nhân vật và câu chuyện giàu bản sắc văn hóa. Cuốn sách vừa có giá trị lịch sử, vừa giúp độc giả hiểu hơn về nguồn cội và trí tưởng tượng dân gian.',
                hinhAnh: localImage(11)
            },
            {
                maSach: 'MS012',
                tenSach: 'Búp Sen Xanh',
                donGia: 65000,
                tongKho: 10,
                namXuatBan: 2023,
                tacGia: 'Sơn Tùng',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Truyện Tranh Lịch Sử'),
                moTa: 'Tác phẩm khắc họa tuổi thơ và những năm đầu đời của Chủ tịch Hồ Chí Minh bằng giọng kể giàu cảm xúc. Cuốn sách có giá trị giáo dục cao, truyền cảm hứng về nghị lực, nhân cách và tinh thần học hỏi.',
                hinhAnh: localImage(12)
            },
            {
                maSach: 'MS013',
                tenSach: '10 Vạn Câu Hỏi Vì Sao - Vũ Trụ Bí Ẩn',
                donGia: 40000,
                tongKho: 13,
                namXuatBan: 2021,
                tacGia: 'Nhiều Tác Giả',
                maNXB: getNXBCode('NXB_TRE'),
                maTheLoai: getTheLoaiId('Kiến Thức - Khoa Học'),
                moTa: 'Cuốn sách giải đáp hàng loạt câu hỏi thú vị về bầu trời, các hành tinh, vì sao và những bí mật của vũ trụ. Nội dung trình bày dễ hiểu, phù hợp với học sinh và những ai yêu thích khám phá khoa học phổ thông.',
                hinhAnh: localImage(13)
            },
            {
                maSach: 'MS014',
                tenSach: 'Bách Khoa Thư Về Trái Đất',
                donGia: 180000,
                tongKho: 6,
                namXuatBan: 2022,
                tacGia: 'DK Publishing',
                maNXB: getNXBCode('NXB_NN'),
                maTheLoai: getTheLoaiId('Kiến Thức - Khoa Học'),
                moTa: 'Một bách khoa thư trực quan về hành tinh của chúng ta, từ cấu tạo địa chất, khí hậu đến hệ sinh thái và tài nguyên thiên nhiên. Cuốn sách nổi bật nhờ hình ảnh đẹp, lượng kiến thức phong phú và bố cục khoa học, dễ tra cứu.',
                hinhAnh: localImage(14)
            },
            {
                maSach: 'MS015',
                tenSach: 'Thám Tử Lừng Danh Conan - Tập 99',
                donGia: 25000,
                tongKho: 10,
                namXuatBan: 2022,
                tacGia: 'Gosho Aoyama',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Tập truyện tiếp nối mạch suy luận đặc trưng của Conan với những vụ án bất ngờ, logic chặt chẽ và nhiều nút thắt hấp dẫn. Đây là lựa chọn rất hợp với người đọc yêu sự hồi hộp và thích xâu chuỗi manh mối.',
                hinhAnh: localImage(15)
            },
            {
                maSach: 'MS016',
                tenSach: 'Thám Tử Lừng Danh Conan - Tập 98',
                donGia: 25000,
                tongKho: 10,
                namXuatBan: 2021,
                tacGia: 'Gosho Aoyama',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Một tập truyện giàu tính suy luận với nhiều tình tiết được cài cắm khéo léo và bầu không khí bí ẩn quen thuộc. Cuốn sách duy trì sức hút của series bằng cách cân bằng giữa phá án, hành động và chiều sâu tuyến nhân vật.',
                hinhAnh: localImage(16)
            },
            {
                maSach: 'MS017',
                tenSach: 'Doraemon - Truyện Ngắn Tập 2',
                donGia: 20000,
                tongKho: 14,
                namXuatBan: 2023,
                tacGia: 'Fujiko F. Fujio',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Tiếp tục hành trình tuổi thơ cùng Doraemon và những bảo bối kỳ diệu mở ra vô số tình huống thú vị. Tập truyện mang màu sắc vui nhộn, sáng tạo và vẫn giữ được thông điệp nhẹ nhàng về trách nhiệm và tình bạn.',
                hinhAnh: localImage(17)
            },
            {
                maSach: 'MS018',
                tenSach: 'Doraemon - Truyện Ngắn Tập 3',
                donGia: 20000,
                tongKho: 14,
                namXuatBan: 2023,
                tacGia: 'Fujiko F. Fujio',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Những câu chuyện ngắn trong tập 3 tiếp tục khơi gợi trí tưởng tượng của người đọc bằng các phát minh từ tương lai và các bài học rất đời thường. Đây là cuốn sách phù hợp để đọc giải trí lẫn gợi nhớ một tuổi thơ đầy màu sắc.',
                hinhAnh: localImage(18)
            },
            {
                maSach: 'MS019',
                tenSach: 'One Piece - Tập 99',
                donGia: 25000,
                tongKho: 8,
                namXuatBan: 2022,
                tacGia: 'Eiichiro Oda',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Tập 99 là giai đoạn cao trào trước cột mốc lớn của One Piece, nơi các trận chiến và mối quan hệ đồng đội được đẩy lên mạnh mẽ. Cuốn sách hấp dẫn nhờ tiết tấu nhanh, khí thế bùng nổ và cảm xúc rất đậm chất shonen.',
                hinhAnh: localImage(19)
            },
            {
                maSach: 'MS020',
                tenSach: 'Spy x Family - Tập 2',
                donGia: 30000,
                tongKho: 8,
                namXuatBan: 2023,
                tacGia: 'Tatsuya Endo',
                maNXB: getNXBCode('NXB_KD'),
                maTheLoai: getTheLoaiId('Manga - Comic'),
                moTa: 'Tập 2 tiếp tục khai thác sự hài hước và đáng yêu của gia đình Forger, đồng thời mở rộng thêm nhiều tình huống gián điệp hấp dẫn. Cuốn sách giữ nhịp đọc rất tốt, cân bằng giữa giải trí, hành động và cảm xúc gia đình.',
                hinhAnh: localImage(20)
            }
        ];

        const books = await Sach.insertMany(
            bookBlueprints.map((b) => ({
                maSach: b.maSach,
                tenSach: b.tenSach,
                donGia: b.donGia,
                soQuyen: b.tongKho,
                namXuatBan: b.namXuatBan,
                tacGia: b.tacGia,
                maNXB: b.maNXB,
                maTheLoai: b.maTheLoai,
                moTa: b.moTa,
                hinhAnh: b.hinhAnh
            }))
        );

        const bookMap = new Map(books.map((b) => [b.maSach, b]));
        const stockMap = new Map(bookBlueprints.map((b) => [b.maSach, b.tongKho]));

        const loans = [];
        const reviews = [];

        const reviewTexts = [
            'Sách rất cuốn, nội dung hấp dẫn và dễ đọc.',
            'Mình thích cách kể chuyện và hình minh họa của cuốn này.',
            'Đọc xong thấy rất đáng mượn, sẽ giới thiệu cho bạn bè.',
            'Nội dung ổn, trình bày đẹp, đọc khá cuốn.',
            'Một cuốn sách hay và phù hợp với nhiều lứa tuổi.',
            'Thông tin bổ ích, trải nghiệm đọc rất tốt.',
            'Tác phẩm nổi bật, mình chấm điểm khá cao.',
            'Cách viết lôi cuốn, càng đọc càng thấy hay.'
        ];

        const returnedBookCodes = [
            'MS001', 'MS002', 'MS003', 'MS004', 'MS005',
            'MS006', 'MS007', 'MS008', 'MS009', 'MS010',
            'MS011', 'MS012', 'MS013', 'MS014', 'MS015',
            'MS016', 'MS017', 'MS018', 'MS019', 'MS020'
        ];

        returnedBookCodes.forEach((maSach, index) => {
            const reader = readers[index % readers.length];
            const book = bookMap.get(maSach);

            const ngayYeuCau = daysAgo(70 - index);
            const ngayDuyet = addDays(ngayYeuCau, 1);
            const ngayNhan = addDays(ngayDuyet, 1);
            const hanTra = addDays(ngayNhan, 14);
            const ngayTraThucTe = addDays(ngayNhan, 6 + (index % 6));

            loans.push({
                docGia: reader._id,
                sach: book._id,
                trangThai: 'da_tra',
                ngayYeuCau,
                ngayDuyet,
                ngayNhan,
                hanTra,
                ngayTraThucTe,
                daGiaHan: false
            });

            reviews.push({
                sach: book._id,
                docGia: reader._id,
                hoTen: reader.hoTen,
                soSao: [5, 4, 5, 4, 5, 5, 4, 5][index % 8],
                noiDung: reviewTexts[index % reviewTexts.length]
            });
        });

        const borrowingBookCodes = ['MS001', 'MS002', 'MS004', 'MS006', 'MS007', 'MS008', 'MS013', 'MS020'];
        borrowingBookCodes.forEach((maSach, index) => {
            const reader = readers[(index + 3) % readers.length];
            const book = bookMap.get(maSach);

            const ngayYeuCau = daysAgo(14 + index);
            const ngayDuyet = addDays(ngayYeuCau, 1);
            const ngayNhan = addDays(ngayDuyet, 1);
            const hanTra = index < 2 ? daysAgo(index + 1) : addDays(ngayNhan, 14);

            loans.push({
                docGia: reader._id,
                sach: book._id,
                trangThai: 'dang_muon',
                ngayYeuCau,
                ngayDuyet,
                ngayNhan,
                hanTra,
                daGiaHan: index === 4
            });
        });

        const pendingBookCodes = ['MS003', 'MS005', 'MS009', 'MS014', 'MS019'];
        pendingBookCodes.forEach((maSach, index) => {
            const reader = readers[(index + 7) % readers.length];
            const book = bookMap.get(maSach);

            loans.push({
                docGia: reader._id,
                sach: book._id,
                trangThai: 'cho_duyet',
                ngayYeuCau: daysAgo(index + 2),
                daGiaHan: false
            });
        });

        const preparedBookCodes = ['MS010', 'MS011', 'MS015', 'MS017'];
        preparedBookCodes.forEach((maSach, index) => {
            const reader = readers[(index + 11) % readers.length];
            const book = bookMap.get(maSach);

            const ngayYeuCau = daysAgo(index + 5);
            const ngayDuyet = addDays(ngayYeuCau, 1);

            loans.push({
                docGia: reader._id,
                sach: book._id,
                trangThai: 'da_chuan_bi',
                ngayYeuCau,
                ngayDuyet,
                daGiaHan: false
            });
        });

        const cancelledBookCodes = ['MS012', 'MS016', 'MS018'];
        cancelledBookCodes.forEach((maSach, index) => {
            const reader = readers[(index + 14) % readers.length];
            const book = bookMap.get(maSach);

            loans.push({
                docGia: reader._id,
                sach: book._id,
                trangThai: 'da_huy',
                ngayYeuCau: daysAgo(index + 8),
                daGiaHan: false
            });
        });

        await TheoDoi.insertMany(loans);
        await Review.insertMany(reviews);

        const activeStatuses = new Set(['cho_duyet', 'da_chuan_bi', 'dang_muon']);
        const activeCountByBook = {};

        loans.forEach((loan) => {
            const matched = books.find((b) => String(b._id) === String(loan.sach));
            if (!matched) return;

            if (activeStatuses.has(loan.trangThai)) {
                activeCountByBook[matched.maSach] = (activeCountByBook[matched.maSach] || 0) + 1;
            }
        });

        for (const book of books) {
            const baseStock = stockMap.get(book.maSach) || 0;
            const reserved = activeCountByBook[book.maSach] || 0;
            book.soQuyen = Math.max(0, baseStock - reserved);
            await book.save();
        }

        console.log(`📚 Đã tạo ${books.length} sách`);
        console.log(`👥 Đã tạo ${readers.length} độc giả`);
        console.log(`🧾 Đã tạo ${loans.length} phiếu mượn/trả`);
        console.log(`⭐ Đã tạo ${reviews.length} đánh giá`);
        console.log('👑 Admin: admin@library.local / NV001 / 123456');
        console.log('🧑‍💼 Staff: staff@library.local / NV002 / 123456');
        console.log('🚀 Seeder hoàn tất!');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeder lỗi:');
        console.error(error.message);
        process.exit(1);
    }
};

seedData();
