<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 xl:grid-cols-3 gap-0 border border-slate-200 mt-4 min-h-[85vh] relative items-start font-readex bg-white selection:bg-blue-600 selection:text-white">

    <div class="xl:col-span-1 p-10 xl:sticky xl:top-28 border-r border-slate-200">
      <h2 class="font-k2d text-2xl font-extrabold mb-10 text-slate-900 border-b border-slate-200 pb-5 uppercase">
        {{ isEditing ? '🛠️ Cập Nhật' : '📦 Thêm Sách' }}
      </h2>

      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="mb-5 border border-slate-200 p-6 bg-slate-50">
          <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Ảnh Bìa Sách (Mặc định)</label>
          <div class="flex items-center gap-6">
            <div class="w-20 h-28 bg-white border border-slate-200 p-3 flex items-center justify-center shrink-0">
              <img v-if="preview" :src="preview" class="max-w-[80%] max-h-[80%] object-contain">
              <span v-else class="text-xl opacity-20">📷</span>
            </div>
            <input type="file" @change="onFileChange" accept="image/*" class="text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:border file:border-blue-100 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors w-full cursor-pointer" />
          </div>
        </div>

        <div class="border border-slate-200 p-6">
          <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mã Sách</label>
          <input v-model="book.maSach" required :disabled="isEditing" class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900 disabled:opacity-50" placeholder="VD: MS001">
        </div>

        <div class="border border-slate-200 p-6">
          <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tên Tựa Sách</label>
          <input v-model="book.tenSach" required class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="Nhập tên tựa sách...">
        </div>

        <div class="border border-slate-200 p-6">
          <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tác Giả</label>
          <input v-model="book.tacGia" class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="VD: Nguyễn Nhật Ánh...">
        </div>

        <div class="border border-slate-200 p-6">
          <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mô Tả</label>
          <textarea
            v-model="book.moTa"
            rows="5"
            class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all text-slate-900 resize-y"
            placeholder="Nhập mô tả ngắn cho cuốn sách..."
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-0 border border-slate-200">
          <div class="p-6 border-r border-slate-200">
            <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thể Loại</label>
            <select v-model="book.maTheLoai" required class="w-full px-5 py-3 bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600/30 transition-all text-xs font-bold text-slate-700">
              <option v-for="tl in dsTL" :key="tl._id" :value="tl._id">{{ tl.tenTheLoai }}</option>
            </select>
          </div>
          <div class="p-6">
            <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">NXB</label>
            <select v-model="book.maNXB" required class="w-full px-5 py-3 bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600/30 transition-all text-xs font-bold text-slate-700">
              <option v-for="n in dsNXB" :key="n.maNXB" :value="n.maNXB">{{ n.tenNXB }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-0 border border-slate-200">
          <div class="p-6 border-r border-slate-200">
            <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Đơn Giá</label>
            <input v-model.number="book.donGia" type="number" required class="w-full px-5 py-3 bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900 text-sm">
          </div>
          <div class="p-6">
            <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Số Lượng</label>
            <input v-model.number="book.soQuyen" type="number" required class="w-full px-5 py-3 bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900 text-sm">
          </div>
        </div>

        <button type="submit" class="font-k2d w-full mt-5 py-5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 active:scale-95">
          {{ isProcessing ? 'ĐANG XỬ LÝ...' : 'LƯU DỮ LIỆU SÁCH' }}
        </button>
      </form>
    </div>

    <div class="xl:col-span-2 p-10 flex flex-col xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)]">
      <div class="flex justify-between items-center mb-8 border-b border-slate-200 pb-5 shrink-0">
        <h2 class="font-k2d text-2xl font-extrabold text-slate-900 uppercase">📊 Kho Sách Hiện Tại</h2>
        <span class="bg-blue-50 text-blue-600 font-bold px-5 py-2 border border-blue-100 text-xs">{{ books.length }} tựa sách</span>
      </div>

      <div class="overflow-y-auto flex-1 scrollbar-hide pr-2 relative">
        <table class="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr>
              <th class="sticky top-0 z-20 bg-slate-50 font-k2d p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Bìa</th>
              <th class="sticky top-0 z-20 bg-slate-50 font-k2d p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Thông tin sách</th>
              <th class="sticky top-0 z-20 bg-slate-50 font-k2d p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-200">Tồn kho</th>
              <th class="sticky top-0 z-20 bg-slate-50 font-k2d p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right border-b border-slate-200">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="b in books" :key="b.maSach" class="hover:bg-slate-50/50 transition-colors group">
              <td class="p-5">
                <div class="w-14 h-20 bg-white border border-slate-100 p-3 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-slate-900/5 relative">
                  <img :src="b.hinhAnh" class="max-w-[80%] max-h-[80%] object-contain">
                </div>
              </td>
              <td class="p-5">
                <p class="font-k2d font-bold text-slate-900 text-base line-clamp-1 mb-2">{{ b.tenSach }}</p>
                <div class="flex items-center gap-3">
                  <p class="text-[10px] font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-none">Mã: {{ b.maSach }}</p>
                  <p class="text-[10px] font-bold text-blue-500 uppercase tracking-widest line-clamp-1">{{ b.tacGia }}</p>
                </div>
              </td>
              <td class="p-5 text-center">
                <span class="px-4 py-1.5 text-xs font-bold" :class="b.soQuyen > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                  {{ b.soQuyen }} cuốn
                </span>
              </td>
              <td class="p-5 text-right whitespace-nowrap">
                <button @click="editB(b)" class="text-orange-500 hover:bg-orange-50 font-bold px-4 py-2 text-xs transition-colors mr-1 border border-orange-100 uppercase tracking-widest">Sửa</button>
                <button @click="openDeleteModal(b)" class="text-red-500 hover:bg-red-50 font-bold px-4 py-2 text-xs transition-colors border border-red-100 uppercase tracking-widest">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm font-readex">
        <div class="bg-white w-full max-w-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] p-12 border border-slate-100 flex flex-col items-center text-center animate-pop">
          <div class="w-20 h-20 bg-red-50 text-red-500 border border-red-100 flex items-center justify-center text-4xl mb-8">⚠️</div>
          <h3 class="font-k2d text-3xl font-black text-slate-900 mb-4 uppercase leading-tight">Bạn có chắc chắn muốn xóa?</h3>
          <p class="text-slate-500 text-sm mb-12 leading-relaxed max-w-sm">
            Hành động này sẽ xóa vĩnh viễn cuốn sách <span class="font-bold text-slate-900">"{{ bookToDelete?.tenSach }}"</span> khỏi hệ thống. Dữ liệu sẽ không thể được hoàn tác.
          </p>

          <div class="flex gap-4 w-full border-t border-slate-200 pt-10">
            <button @click="showDeleteModal = false" class="flex-1 py-5 bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Hủy Bỏ</button>
            <button @click="confirmDelete" class="flex-1 py-5 bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 uppercase text-xs tracking-widest">Xác Nhận Xóa</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from '../utils/toast';

const { addToast } = useToast();
const books = ref([]);
const dsNXB = ref([]);
const dsTL = ref([]);

const isEditing = ref(false);
const isProcessing = ref(false);
const preview = ref('');
const file = ref(null);

const defaultBook = () => ({
  maSach: '',
  tenSach: '',
  donGia: 0,
  soQuyen: 1,
  tacGia: '',
  maNXB: '',
  maTheLoai: '',
  moTa: '',
  hinhAnh: ''
});

const book = ref(defaultBook());

const showDeleteModal = ref(false);
const bookToDelete = ref(null);

const openDeleteModal = (b) => {
  bookToDelete.value = b;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!bookToDelete.value) return;
  try {
    await axios.delete(`http://localhost:3000/api/sach/${bookToDelete.value.maSach}`);
    addToast('Đã xóa sách khỏi kho!', 'success');
    showDeleteModal.value = false;
    bookToDelete.value = null;
    fetchData();
  } catch (e) {
    addToast('Lỗi khi xóa sách!', 'error');
  }
};

const fetchData = async () => {
  try {
    const [s, n, t] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/nxb'),
      axios.get('http://localhost:3000/api/the-loai')
    ]);
    books.value = s.data;
    dsNXB.value = n.data;
    dsTL.value = t.data;
  } catch (error) {
    addToast('Lỗi tải dữ liệu kho', 'error');
  }
};

onMounted(fetchData);

const onFileChange = (e) => {
  file.value = e.target.files[0];
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (ev) => (preview.value = ev.target.result);
    reader.readAsDataURL(file.value);
  }
};

const editB = (b) => {
  isEditing.value = true;
  book.value = {
    maSach: b.maSach || '',
    tenSach: b.tenSach || '',
    donGia: b.donGia || 0,
    soQuyen: b.soQuyen || 0,
    tacGia: b.tacGia || '',
    maNXB: b.maNXB || '',
    maTheLoai: b.maTheLoai || '',
    moTa: b.moTa || '',
    hinhAnh: b.hinhAnh || ''
  };
  preview.value = b.hinhAnh;
  file.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const submitForm = async () => {
  isProcessing.value = true;
  const fd = new FormData();
  Object.keys(book.value).forEach((k) => fd.append(k, book.value[k] ?? ''));

  if (file.value) {
    fd.append('hinhAnhFile', file.value);
  }

  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    if (isEditing.value) {
      await axios.put(`http://localhost:3000/api/sach/${book.value.maSach}`, fd, config);
      addToast('Cập nhật sách thành công!', 'success');
    } else {
      await axios.post('http://localhost:3000/api/sach', fd, config);
      addToast('Thêm sách mới thành công!', 'success');
    }

    isEditing.value = false;
    book.value = defaultBook();
    file.value = null;
    preview.value = '';
    fetchData();
  } catch (e) {
    addToast('Lỗi lưu dữ liệu. Vui lòng thử lại!', 'error');
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes pop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pop { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>
