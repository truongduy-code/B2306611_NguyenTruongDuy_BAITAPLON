<template>
  <div v-if="isLoading" class="min-h-[70vh] flex items-center justify-center bg-white">
    <div class="text-center">
      <p class="font-k2d text-2xl font-black text-slate-900 uppercase">Đang tải chi tiết sách...</p>
      <p class="text-slate-500 mt-3">Vui lòng chờ một chút</p>
    </div>
  </div>

  <div v-else-if="!book" class="min-h-[70vh] flex items-center justify-center bg-white">
    <div class="text-center">
      <p class="font-k2d text-3xl font-black text-slate-900 uppercase">Không tìm thấy sách</p>
      <p class="text-slate-500 mt-3">Mã sách này không tồn tại hoặc đã bị xóa.</p>
      <button
        @click="$router.push('/')"
        class="mt-6 px-6 py-3 bg-slate-900 text-white font-k2d font-bold uppercase text-sm tracking-widest hover:bg-slate-800 transition-all"
      >
        Về trang chủ
      </button>
    </div>
  </div>

  <div v-else class="w-full relative min-h-screen bg-white border-b border-slate-200 mb-10 overflow-hidden selection:bg-rose-600 selection:text-white">
    <div class="absolute top-0 left-0 w-full h-[30rem] bg-rose-950">
      <div class="absolute inset-0 bg-gradient-to-br from-rose-950 via-rose-900 to-black opacity-90 z-10"></div>
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>

    <button
      @click="$router.back()"
      class="font-k2d absolute top-8 left-8 z-30 text-white hover:text-rose-200 flex items-center gap-2 font-bold px-6 py-4 border border-white/20 backdrop-blur-md transition-all active:scale-95 shadow-lg text-xs uppercase tracking-widest"
    >
      <span>←</span> TRỞ VỀ
    </button>

    <div class="relative z-20 max-w-6xl mx-auto px-6 pt-32 pb-16">
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div class="lg:w-1/3 flex justify-center lg:justify-end">
          <div class="sticky top-32 h-fit w-full max-w-[280px] md:max-w-[320px] relative z-40 bg-white border-[1px] border-slate-200 p-2 shadow-2xl shadow-rose-900/20">
            <div
              ref="imgContainer"
              class="relative w-full overflow-hidden cursor-crosshair"
              @mousemove="handleMouseMove"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <img :src="book.hinhAnh" class="w-full h-auto object-cover border border-slate-100 block relative z-10">

              <div
                v-show="isZooming && book.soQuyen > 0"
                class="absolute bg-slate-900/30 backdrop-blur-[1px] border border-white/50 pointer-events-none shadow-[0_0_0_999px_rgba(255,255,255,0.4)] z-30"
                :style="lensStyle"
              ></div>

              <div v-if="book.soQuyen <= 0" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-40 pointer-events-none">
                <span class="font-k2d text-white font-black text-xl bg-rose-600 px-6 py-3 rounded-none shadow-xl uppercase tracking-widest shadow-rose-900/50">
                  ĐÃ HẾT SÁCH
                </span>
              </div>
            </div>

            <transition name="fade">
              <div
                v-show="isZooming && book.soQuyen > 0"
                class="absolute top-0 left-[105%] w-[450px] aspect-square bg-white shadow-2xl shadow-rose-900/20 border border-slate-200 z-50 hidden lg:block pointer-events-none"
                :style="{
                  backgroundImage: `url(${book.hinhAnh})`,
                  backgroundPosition: bgPosition,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat'
                }"
              ></div>
            </transition>
          </div>
        </div>

        <div class="lg:w-2/3 flex flex-col justify-end pt-4 lg:pt-10">
          <h1 class="font-k2d text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 drop-shadow-xl leading-[1.0] tracking-tight uppercase">
            {{ book.tenSach }}
          </h1>

          <div class="flex items-center gap-4 mb-12 flex-wrap">
            <div class="flex text-amber-400 text-2xl drop-shadow-md">
              <span v-for="i in 5" :key="i">{{ i <= Math.round(Number(book.rating || 0)) ? '★' : '☆' }}</span>
            </div>

            <div class="bg-white/10 backdrop-blur-xl px-5 py-2 border border-white/20 flex items-center gap-2 shadow-lg">
              <span class="font-k2d font-black text-white text-xl">{{ Number(book.rating || 0).toFixed(1) }}</span>
              <span class="font-k2d text-white/90 text-xs font-bold uppercase tracking-[0.1em]">
                {{ reviews.length }} đánh giá
              </span>
            </div>

            <div class="bg-white/10 backdrop-blur-xl px-5 py-2 border border-white/20 shadow-lg">
              <span class="font-k2d text-white text-xs font-bold uppercase tracking-[0.1em]">
                Mã sách: {{ book.maSach }}
              </span>
            </div>
          </div>

          <div class="bg-white p-8 lg:p-10 shadow-2xl shadow-rose-900/10 border border-slate-100 relative overflow-hidden mb-12">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-200 mb-8">
              <div class="bg-blue-50/50 p-6 border-r border-b md:border-b-0 border-slate-200">
                <p class="font-k2d text-xs font-bold text-blue-500 uppercase mb-2 tracking-[0.1em]">Tác giả</p>
                <p class="font-k2d font-black text-blue-900 text-xl leading-tight">{{ book.tacGia || 'Ẩn danh' }}</p>
              </div>

              <div class="bg-amber-50/50 p-6 border-r border-b md:border-b-0 border-slate-200">
                <p class="font-k2d text-xs font-bold text-amber-600 uppercase mb-2 tracking-[0.1em]">Kho lưu trữ</p>
                <p class="font-k2d font-black text-amber-900 text-xl leading-tight">{{ book.soQuyen }} cuốn</p>
              </div>

              <div class="bg-emerald-50/50 p-6 border-r border-slate-200">
                <p class="font-k2d text-xs font-bold text-emerald-600 uppercase mb-2 tracking-[0.1em]">Trạng thái</p>
                <p class="font-k2d font-black text-emerald-900 text-xl leading-tight">
                  {{ book.soQuyen > 0 ? 'Sẵn sàng' : 'Tạm hết' }}
                </p>
              </div>

              <div class="bg-rose-50/50 p-6">
                <p class="font-k2d text-xs font-bold text-rose-500 uppercase mb-2 tracking-[0.1em]">Giá đền bù</p>
                <p class="font-k2d font-black text-rose-900 text-xl leading-tight">{{ formatPrice(book.donGia) }}đ</p>
              </div>
            </div>

            <div
              v-if="hasOverdueLoan"
              class="border border-rose-200 bg-rose-50 p-5 mb-8"
            >
              <p class="font-k2d text-xs font-black text-rose-700 uppercase tracking-[0.18em] mb-2">
                Cảnh báo quá hạn
              </p>
              <p class="text-sm text-slate-700 leading-relaxed">
                Bạn đang có <b>{{ overdueCount }}</b> sách quá hạn. Tài khoản hiện bị khóa mượn thêm cho đến khi bạn trả sách tại thư viện.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 mb-8">
              <div class="p-6 border-b md:border-b-0 md:border-r border-slate-200 bg-white">
                <p class="font-k2d text-xs font-bold text-slate-500 uppercase mb-2 tracking-[0.1em]">Nhà xuất bản</p>
                <p class="font-k2d font-black text-slate-900 text-xl leading-tight">
                  {{ nxbInfo?.tenNXB || 'Chưa cập nhật' }}
                </p>
                <p class="text-sm text-slate-500 mt-2">
                  Mã NXB: {{ nxbInfo?.maNXB || book.maNXB || '---' }}
                </p>
              </div>

              <div class="p-6 bg-white">
                <p class="font-k2d text-xs font-bold text-slate-500 uppercase mb-2 tracking-[0.1em]">Thể loại</p>
                <p class="font-k2d font-black text-slate-900 text-xl leading-tight">
                  {{ theLoaiInfo?.tenTheLoai || 'Chưa cập nhật' }}
                </p>
                <p class="text-sm text-slate-500 mt-2">
                  {{ theLoaiInfo?.moTa || 'Chưa có mô tả thể loại.' }}
                </p>
              </div>

              <div class="p-6 border-t md:border-r border-slate-200 bg-slate-50/50">
                <p class="font-k2d text-xs font-bold text-slate-500 uppercase mb-2 tracking-[0.1em]">Năm xuất bản</p>
                <p class="font-k2d font-black text-slate-900 text-xl leading-tight">
                  {{ book.namXuatBan || 'Chưa cập nhật' }}
                </p>
              </div>

              <div class="p-6 border-t border-slate-200 bg-slate-50/50">
                <p class="font-k2d text-xs font-bold text-slate-500 uppercase mb-2 tracking-[0.1em]">Địa chỉ nhà xuất bản</p>
                <p class="text-base text-slate-700 leading-relaxed">
                  {{ nxbInfo?.diaChi || 'Chưa cập nhật địa chỉ nhà xuất bản.' }}
                </p>
              </div>
            </div>

            <button
              @click="openBorrowModal"
              :disabled="borrowDisabled"
              class="font-k2d w-full py-5 bg-rose-600 text-white font-bold text-lg uppercase tracking-widest hover:bg-rose-700 transition-all duration-500 shadow-lg shadow-rose-600/30 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {{ borrowButtonText }}
            </button>

            <p class="text-center mt-5 text-slate-500 text-xs font-bold uppercase tracking-[0.1em]">
              Quy định: Mượn tối đa 3 cuốn • Thời gian giữ 14 ngày
            </p>
          </div>

          <div class="bg-slate-50 border border-slate-200 p-8 md:p-10 relative">
            <div class="absolute top-0 left-8 w-12 h-1 bg-rose-600"></div>
            <h2 class="font-k2d text-xl font-black text-slate-900 uppercase tracking-widest mb-6">Tóm tắt nội dung</h2>
            <div class="prose prose-slate max-w-none">
              <p class="text-slate-800 text-base leading-loose whitespace-pre-line text-justify">
                {{ book.moTa || 'Nội dung tóm tắt của tác phẩm này đang được thủ thư cập nhật. Tuy nhiên, một cuốn sách hay luôn xứng đáng để bạn tự mình khám phá. Bấm mượn ngay để trải nghiệm nhé!' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-24">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <h2 class="font-k2d text-3xl font-extrabold text-slate-900 uppercase">Nhận xét từ cộng đồng</h2>
          <button
            v-if="!showReviewForm"
            @click="showReviewForm = true"
            class="font-k2d bg-rose-50 text-rose-600 border border-rose-200 px-6 py-4 font-bold text-sm hover:bg-rose-600 hover:text-white transition-all shadow-sm uppercase tracking-widest"
          >
            Viết đánh giá
          </button>
        </div>

        <transition name="page">
          <div v-if="showReviewForm" class="bg-white border border-slate-200 p-8 shadow-xl relative mb-10">
            <button @click="showReviewForm = false" class="absolute top-6 right-6 text-slate-400 hover:text-rose-600 font-bold w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center transition-colors text-lg">✕</button>
            <h3 class="font-k2d text-2xl font-bold mb-6 text-slate-900">Trải nghiệm của bạn thế nào?</h3>

            <div class="flex gap-3 mb-8">
              <button
                v-for="i in 5"
                :key="i"
                @click="reviewForm.soSao = i"
                class="text-5xl transition-transform hover:scale-110 focus:outline-none"
                :class="i <= reviewForm.soSao ? 'text-amber-400 drop-shadow-md' : 'text-slate-200'"
              >
                ★
              </button>
            </div>

            <textarea
              v-model="reviewForm.noiDung"
              rows="4"
              class="w-full p-6 bg-slate-50 border border-slate-200 rounded-none outline-none focus:ring-1 focus:border-rose-500 transition-all mb-8 resize-none text-slate-900 placeholder-slate-400 text-base"
              placeholder="Hãy chia sẻ cảm nhận chân thực của bạn..."
            ></textarea>

            <button
              @click="submitReview"
              class="font-k2d bg-rose-600 text-white px-10 py-4 font-bold text-sm uppercase tracking-widest shadow-md hover:bg-rose-700 transition-all"
            >
              Gửi Đánh Giá
            </button>
          </div>
        </transition>

        <div v-if="reviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="rev in reviews"
            :key="rev._id"
            class="p-8 bg-white border border-slate-100 shadow-lg shadow-slate-900/5 hover:shadow-rose-900/10 transition-all flex flex-col gap-5 hover:-translate-y-1"
          >
            <div class="flex justify-between items-center pb-5 border-b border-slate-100">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-rose-100 text-rose-700 font-black text-2xl flex items-center justify-center rounded-none">
                  {{ rev.hoTen.charAt(0).toUpperCase() }}
                </div>
                <span class="font-k2d text-lg font-bold text-slate-900">{{ rev.hoTen }}</span>
              </div>
              <span class="font-k2d text-xs font-bold text-slate-500 uppercase tracking-widest">
                {{ new Date(rev.createdAt).toLocaleDateString('vi-VN') }}
              </span>
            </div>

            <div class="flex text-amber-400 text-xl drop-shadow-sm">
              <span v-for="i in 5" :key="i">{{ i <= rev.soSao ? '★' : '☆' }}</span>
            </div>

            <p class="text-slate-700 text-base leading-relaxed">"{{ rev.noiDung }}"</p>
          </div>
        </div>

        <div v-else class="bg-slate-50/50 py-24 text-center border border-dashed border-slate-200 rounded-none">
          <p class="font-k2d text-slate-500 font-bold text-xl uppercase tracking-widest">Chưa có đánh giá nào</p>
          <p class="text-slate-500 text-sm mt-3">Hãy trở thành người đầu tiên chia sẻ cảm nhận về cuốn sách này.</p>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showBorrowModal" class="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-xl bg-white border border-slate-200 shadow-2xl p-8">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <p class="font-k2d text-xs font-bold text-rose-500 uppercase tracking-[0.2em] mb-2">Xác nhận mượn sách</p>
              <h3 class="font-k2d text-2xl font-black text-slate-900 uppercase leading-tight">
                {{ book.tenSach }}
              </h3>
            </div>
            <button @click="showBorrowModal = false" class="w-10 h-10 border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all">
              ✕
            </button>
          </div>

          <div class="grid grid-cols-2 gap-0 border border-slate-200 mb-6">
            <div class="p-4 border-r border-slate-200 bg-slate-50">
              <p class="font-k2d text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mã sách</p>
              <p class="font-k2d text-lg font-black text-slate-900">{{ book.maSach }}</p>
            </div>
            <div class="p-4 bg-slate-50">
              <p class="font-k2d text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tồn kho</p>
              <p class="font-k2d text-lg font-black text-slate-900">{{ book.soQuyen }} cuốn</p>
            </div>
          </div>

          <div class="border border-rose-100 bg-rose-50 p-5 mb-6">
            <p class="text-sm text-slate-700 leading-relaxed">
              Sau khi gửi yêu cầu, hệ thống sẽ giữ chỗ cuốn sách này cho bạn và chuyển sang trạng thái
              <b>chờ duyệt</b>. Nếu sách đã quá hạn ở tài khoản của bạn, bạn sẽ không thể mượn tiếp.
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="showBorrowModal = false"
              class="flex-1 py-4 border border-slate-200 text-slate-700 font-k2d font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Quay lại
            </button>
            <button
              @click="confirmBorrow"
              :disabled="isProcessing"
              class="flex-1 py-4 bg-rose-600 text-white font-k2d font-bold text-xs uppercase tracking-widest hover:bg-rose-700 transition-all disabled:opacity-70"
            >
              {{ isProcessing ? 'ĐANG GỬI...' : 'XÁC NHẬN MƯỢN' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from '../utils/toast';

const route = useRoute();
const { addToast } = useToast();

const book = ref(null);
const reviews = ref([]);
const nxbInfo = ref(null);
const theLoaiInfo = ref(null);

const isLoading = ref(true);
const isProcessing = ref(false);
const showReviewForm = ref(false);
const showBorrowModal = ref(false);
const reviewForm = ref({ soSao: 5, noiDung: '' });

const currentUser = ref(null);
const overdueCount = ref(0);

const imgContainer = ref(null);
const isZooming = ref(false);
const bgPosition = ref('0% 0%');

const LENS_SIZE = 120;
const lensStyle = ref({
  top: '0px',
  left: '0px',
  width: `${LENS_SIZE}px`,
  height: `${LENS_SIZE}px`
});

const hasOverdueLoan = computed(() => overdueCount.value > 0);

const borrowDisabled = computed(() => {
  return isProcessing.value || hasOverdueLoan.value || !book.value || book.value.soQuyen <= 0;
});

const borrowButtonText = computed(() => {
  if (isProcessing.value) return 'ĐANG XỬ LÝ...';
  if (hasOverdueLoan.value) return 'ĐANG BỊ KHÓA MƯỢN';
  if (!book.value) return 'ĐANG TẢI...';
  return book.value.soQuyen > 0 ? 'GỬI YÊU CẦU MƯỢN SÁCH' : 'TẠM HẾT SÁCH';
});

const formatPrice = (value) => {
  const num = Number(value || 0);
  return num.toLocaleString('vi-VN');
};

const handleMouseMove = (e) => {
  if (!imgContainer.value) return;
  const rect = imgContainer.value.getBoundingClientRect();

  let x = e.clientX - rect.left - (LENS_SIZE / 2);
  let y = e.clientY - rect.top - (LENS_SIZE / 2);

  if (x > rect.width - LENS_SIZE) x = rect.width - LENS_SIZE;
  if (x < 0) x = 0;
  if (y > rect.height - LENS_SIZE) y = rect.height - LENS_SIZE;
  if (y < 0) y = 0;

  lensStyle.value.top = `${y}px`;
  lensStyle.value.left = `${x}px`;

  const bgX = (x / (rect.width - LENS_SIZE)) * 100;
  const bgY = (y / (rect.height - LENS_SIZE)) * 100;
  bgPosition.value = `${bgX}% ${bgY}%`;
};

const handleMouseEnter = () => {
  isZooming.value = true;
};

const handleMouseLeave = () => {
  isZooming.value = false;
};

const loadBorrowStatus = async () => {
  const userStr = localStorage.getItem('user');
  currentUser.value = userStr ? JSON.parse(userStr) : null;
  overdueCount.value = 0;

  if (!currentUser.value || currentUser.value.role === 'admin') return;

  try {
    const res = await axios.get(`http://localhost:3000/api/sach/lich-su/${currentUser.value._id}`);
    const list = Array.isArray(res.data) ? res.data : [];
    overdueCount.value = list.filter(
      (item) => item.trangThai === 'dang_muon' && item.hanTra && new Date(item.hanTra) < new Date()
    ).length;
  } catch (e) {
    overdueCount.value = 0;
  }
};

const fetchData = async () => {
  isLoading.value = true;

  try {
    const [booksRes, nxbRes, theLoaiRes] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/nxb'),
      axios.get('http://localhost:3000/api/the-loai')
    ]);

    const books = Array.isArray(booksRes.data) ? booksRes.data : [];
    const nxbs = Array.isArray(nxbRes.data) ? nxbRes.data : [];
    const theLoais = Array.isArray(theLoaiRes.data) ? theLoaiRes.data : [];

    const foundBook = books.find((b) => b.maSach === route.params.id);
    book.value = foundBook || null;

    if (!book.value) {
      nxbInfo.value = null;
      theLoaiInfo.value = null;
      reviews.value = [];
      return;
    }

    nxbInfo.value = nxbs.find((n) => n.maNXB === book.value.maNXB) || null;
    theLoaiInfo.value = theLoais.find((t) => String(t._id) === String(book.value.maTheLoai)) || null;

    try {
      const reviewsRes = await axios.get(`http://localhost:3000/api/sach/reviews/${book.value._id}`);
      reviews.value = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
    } catch (e) {
      reviews.value = [];
    }
  } catch (e) {
    book.value = null;
    nxbInfo.value = null;
    theLoaiInfo.value = null;
    reviews.value = [];
    addToast('Lỗi tải chi tiết sách', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchData();
  await loadBorrowStatus();
});

const openBorrowModal = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return addToast('Vui lòng đăng nhập để thao tác!', 'error');
  if (hasOverdueLoan.value) return addToast('Bạn đang có sách quá hạn nên chưa thể mượn thêm!', 'error');
  if (!book.value || book.value.soQuyen <= 0) return addToast('Sách hiện đang tạm hết.', 'error');

  showBorrowModal.value = true;
};

const confirmBorrow = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    showBorrowModal.value = false;
    return addToast('Vui lòng đăng nhập để thao tác!', 'error');
  }

  if (hasOverdueLoan.value) {
    showBorrowModal.value = false;
    return addToast('Bạn đang có sách quá hạn nên chưa thể mượn thêm!', 'error');
  }

  isProcessing.value = true;
  try {
    await axios.post(`http://localhost:3000/api/sach/${book.value.maSach}/muon`, {
      userId: user._id,
      userEmail: user.email,
      hoTen: user.hoTen
    });

    showBorrowModal.value = false;
    addToast('Gửi yêu cầu thành công! Đang chờ thủ thư duyệt.', 'success');
    await fetchData();
    await loadBorrowStatus();
  } catch (e) {
    addToast(e.response?.data?.message || 'Lỗi gửi yêu cầu', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const submitReview = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return addToast('Cần đăng nhập!', 'error');
  if (!book.value?._id) return addToast('Không tìm thấy sách để đánh giá!', 'error');
  if (!reviewForm.value.noiDung.trim()) return addToast('Vui lòng nhập nội dung!', 'error');

  try {
    await axios.post('http://localhost:3000/api/sach/reviews', {
      sachId: book.value._id,
      userId: user._id,
      hoTen: user.hoTen,
      ...reviewForm.value
    });

    addToast('Cảm ơn đóng góp của bạn!', 'success');
    showReviewForm.value = false;
    reviewForm.value = { soSao: 5, noiDung: '' };
    await fetchData();
  } catch (e) {
    addToast(e.response?.data?.message || 'Chưa đủ điều kiện đánh giá', 'error');
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
