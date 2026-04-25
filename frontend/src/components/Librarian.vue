<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8 mt-4 bg-white min-h-[85vh] border border-slate-200 rounded-3xl relative font-readex">
    <div class="mb-8 flex justify-between items-end border-b-2 border-slate-900 pb-6">
      <div>
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter font-k2d">Quầy Thủ Thư</h2>
        <p class="text-slate-500 font-bold text-sm uppercase tracking-[0.1em]">Xử lý các yêu cầu mượn/trả sách theo quy trình</p>
      </div>
      <button @click="fetchData" class="font-k2d bg-slate-900 border shadow-md px-6 py-3 text-white font-bold uppercase tracking-widest text-sm hover:bg-rose-600 transition-all flex items-center gap-2">
        Làm mới số liệu
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-slate-400 font-bold animate-pulse text-base uppercase tracking-widest">
      Đang tải dữ liệu quầy trực...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div class="flex flex-col gap-4">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-black text-slate-900 text-xl uppercase tracking-wider font-k2d">Yêu Cầu Mới</h3>
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">{{ choDuyet.length }}</span>
          </div>

          <div v-if="choDuyet.length === 0" class="text-center py-10 text-slate-400 italic text-sm border-2 border-dashed border-slate-200 rounded-xl">Chưa có yêu cầu mới</div>

          <div class="space-y-5">
            <div v-for="item in choDuyet" :key="item._id" class="p-5 border border-slate-200 rounded-2xl bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all group relative">
              <div class="flex justify-between items-start mb-3">
                <span class="font-bold text-blue-700 text-sm truncate">👤 {{ item.docGia?.hoTen }}</span>

                <div class="relative" @mouseenter="hoverItem = item._id" @mouseleave="hoverItem = null">
                  <button @click="openModal(item)" class="text-slate-500 hover:text-blue-600 bg-white shadow-sm border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black uppercase transition-colors">👁️ Chi tiết</button>
                  <transition name="popover">
                    <div v-if="hoverItem === item._id" class="absolute z-50 right-0 top-full mt-2 w-72 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 pointer-events-none">
                      <div class="absolute -top-1.5 right-6 w-3 h-3 bg-slate-900 border-t border-l border-slate-700 rotate-45"></div>
                      <div class="relative z-10">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Thông Tin Trích Xuất</p>
                        <p class="text-sm mb-2">📧 <span class="font-medium">{{ item.docGia?.email }}</span></p>
                        <p class="text-sm mb-3">⏰ <span class="font-medium text-blue-300">YC: {{ new Date(item.ngayYeuCau).toLocaleString('vi-VN') }}</span></p>
                        <div class="mt-4 pt-4 border-t border-slate-700 flex gap-4 items-center bg-slate-800/50 p-3 rounded-xl">
                          <img :src="item.sach?.hinhAnh" class="w-12 h-16 object-cover rounded shadow-md border border-slate-600">
                          <div class="flex-1">
                            <p class="text-xs text-slate-300 font-bold line-clamp-1 mb-2">{{ item.sach?.tacGia || 'Ẩn danh' }}</p>
                            <div class="flex justify-between items-center">
                              <span class="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">{{ item.sach?.maSach }}</span>
                              <span class="text-xs font-bold" :class="item.sach?.soQuyen > 0 ? 'text-green-400' : 'text-rose-400'">Kho: {{ item.sach?.soQuyen }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              <p class="font-extrabold text-slate-900 mb-5 line-clamp-2 leading-tight text-base">📖 {{ item.sach?.tenSach }}</p>

              <div class="flex gap-2">
                <button @click="xuLy(item._id, 'duyet')" class="flex-1 bg-blue-600 text-white py-3 rounded-xl text-xs font-black hover:bg-blue-700 shadow-md active:scale-95 transition-all uppercase tracking-widest">Chuẩn bị</button>
                <button @click="xuLy(item._id, 'huy')" class="px-4 bg-white border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 uppercase tracking-widest">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-amber-500">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-black text-slate-800 text-xl uppercase tracking-wider font-k2d">Chờ Nhận</h3>
            <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-black">{{ daChuanBi.length }}</span>
          </div>

          <div v-if="daChuanBi.length === 0" class="text-center py-10 text-slate-400 italic text-sm border-2 border-dashed border-slate-200 rounded-xl">Kệ chờ đang trống</div>

          <div class="space-y-5">
            <div v-for="item in daChuanBi" :key="item._id" class="p-5 border border-slate-200 rounded-2xl bg-amber-50/30 hover:shadow-md hover:border-amber-300 transition-all relative">
              <div class="flex justify-between items-start mb-3">
                <span class="font-bold text-amber-700 text-sm truncate">👤 {{ item.docGia?.hoTen }}</span>
                <div class="relative" @mouseenter="hoverItem = item._id" @mouseleave="hoverItem = null">
                  <button @click="openModal(item)" class="text-slate-500 hover:text-amber-600 bg-white shadow-sm border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black uppercase transition-colors">👁️ Chi tiết</button>
                  <transition name="popover">
                    <div v-if="hoverItem === item._id" class="absolute z-50 right-0 top-full mt-2 w-72 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 pointer-events-none">
                      <div class="absolute -top-1.5 right-6 w-3 h-3 bg-slate-900 border-t border-l border-slate-700 rotate-45"></div>
                      <div class="relative z-10">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Thông Tin Trích Xuất</p>
                        <p class="text-sm mb-2">📧 <span class="font-medium">{{ item.docGia?.email }}</span></p>
                        <p class="text-sm mb-2">⏰ <span class="font-medium text-slate-300">YC: {{ new Date(item.ngayYeuCau).toLocaleString('vi-VN') }}</span></p>
                        <p class="text-sm mb-3">✅ <span class="font-medium text-amber-400">Duyệt: {{ new Date(item.ngayDuyet).toLocaleString('vi-VN') }}</span></p>
                        <div class="mt-4 pt-4 border-t border-slate-700 flex gap-4 items-center bg-slate-800/50 p-3 rounded-xl">
                          <img :src="item.sach?.hinhAnh" class="w-12 h-16 object-cover rounded shadow-md border border-slate-600">
                          <div class="flex-1">
                            <p class="text-xs text-slate-300 font-bold line-clamp-1 mb-2">{{ item.sach?.tacGia || 'Ẩn danh' }}</p>
                            <div class="flex justify-between items-center">
                              <span class="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">{{ item.sach?.maSach }}</span>
                              <span class="text-xs font-bold text-amber-400">Đã trừ kho</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              <p class="font-extrabold text-slate-900 mb-5 line-clamp-2 leading-tight text-base">📖 {{ item.sach?.tenSach }}</p>

              <div class="flex gap-2">
                <button @click="xuLy(item._id, 'giao')" class="flex-1 bg-amber-500 text-white py-3 rounded-xl text-xs font-black hover:bg-amber-600 shadow-md active:scale-95 transition-all uppercase tracking-widest">Đã giao khách</button>
                <button @click="xuLy(item._id, 'huy')" class="px-4 bg-white border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 uppercase tracking-widest">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-black text-slate-800 text-xl uppercase tracking-wider font-k2d">Đang Mượn</h3>
            <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-black">{{ dangMuon.length }}</span>
          </div>

          <div v-if="dangMuon.length === 0" class="text-center py-10 text-slate-400 italic text-sm border-2 border-dashed border-slate-200 rounded-xl">Chưa có sách nào đang mượn</div>

          <div class="space-y-5">
            <div v-for="item in dangMuon" :key="item._id" class="p-5 border rounded-2xl bg-white hover:shadow-md hover:border-emerald-300 transition-all relative" :class="isLate(item.hanTra) ? 'border-rose-300 bg-rose-50 shadow-rose-900/5' : 'border-slate-200'">
              <div class="flex justify-between items-start mb-3">
                <span class="font-bold text-emerald-700 text-sm truncate">👤 {{ item.docGia?.hoTen }}</span>
                <div class="relative" @mouseenter="hoverItem = item._id" @mouseleave="hoverItem = null">
                  <button @click="openModal(item)" class="text-slate-500 hover:text-emerald-600 bg-white shadow-sm border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black uppercase transition-colors">👁️ Chi tiết</button>
                  <transition name="popover">
                    <div v-if="hoverItem === item._id" class="absolute z-50 right-0 top-full mt-2 w-72 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 pointer-events-none">
                      <div class="absolute -top-1.5 right-6 w-3 h-3 bg-slate-900 border-t border-l border-slate-700 rotate-45"></div>
                      <div class="relative z-10">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Thông Tin Trích Xuất</p>
                        <p class="text-sm mb-2">📧 <span class="font-medium">{{ item.docGia?.email }}</span></p>
                        <p class="text-sm mb-2">📦 <span class="font-medium text-emerald-300">Nhận: {{ new Date(item.ngayNhan).toLocaleString('vi-VN') }}</span></p>
                        <p class="text-sm mb-3">⏳ <span class="font-medium" :class="isLate(item.hanTra) ? 'text-rose-400' : 'text-slate-300'">Hạn: {{ new Date(item.hanTra).toLocaleDateString('vi-VN') }}</span></p>
                        <div class="mt-4 pt-4 border-t border-slate-700 flex gap-4 items-center bg-slate-800/50 p-3 rounded-xl">
                          <img :src="item.sach?.hinhAnh" class="w-12 h-16 object-cover rounded shadow-md border border-slate-600">
                          <div class="flex-1">
                            <p class="text-xs text-slate-300 font-bold line-clamp-1 mb-2">{{ item.sach?.tacGia || 'Ẩn danh' }}</p>
                            <div class="flex justify-between items-center">
                              <span class="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">{{ item.sach?.maSach }}</span>
                              <span v-if="item.daGiaHan" class="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded uppercase font-bold">Đã gia hạn</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              <p class="font-extrabold text-slate-900 mb-3 line-clamp-1 text-base">📖 {{ item.sach?.tenSach }}</p>
              <p class="text-xs font-black uppercase mb-5 tracking-widest" :class="isLate(item.hanTra) ? 'text-rose-600' : 'text-slate-500'">
                🕒 {{ getDueText(item.hanTra) }}
              </p>

              <button @click="xuLy(item._id, 'tra')" class="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm transition-all active:scale-95 uppercase tracking-widest">Hoàn Tất Trả</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal && selectedItem" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh] border border-slate-200">
        <div class="bg-slate-50 border-b border-slate-200 px-8 py-6 flex justify-between items-center">
          <h3 class="text-2xl font-black text-slate-900 font-k2d uppercase tracking-widest">📄 Chi Tiết Phiếu Mượn</h3>
          <button @click="closeModal" class="w-10 h-10 bg-white border border-slate-300 shadow-sm rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 font-black text-lg transition-all">✕</button>
        </div>

        <div class="p-8 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
              <p class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Thông tin độc giả</p>
              <p class="text-xl font-bold text-slate-900 mb-1 font-k2d uppercase">{{ selectedItem.docGia?.hoTen }}</p>
              <p class="text-sm text-slate-500 font-medium mb-5">{{ selectedItem.docGia?.email }}</p>
              <div class="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs text-slate-500 uppercase tracking-widest flex justify-between">Yêu cầu: <span class="font-bold text-slate-800">{{ new Date(selectedItem.ngayYeuCau).toLocaleString('vi-VN') }}</span></p>
              </div>
            </div>

            <div class="bg-white shadow-sm border border-slate-200 p-6 rounded-3xl">
              <p class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Tiến trình xử lý</p>
              <div class="space-y-4">
                <p class="text-xs text-slate-500 uppercase tracking-widest flex justify-between">Duyệt sách: <span class="font-bold text-slate-800">{{ selectedItem.ngayDuyet ? new Date(selectedItem.ngayDuyet).toLocaleString('vi-VN') : 'Chưa' }}</span></p>
                <p class="text-xs text-slate-500 uppercase tracking-widest flex justify-between">Nhận sách: <span class="font-bold text-slate-800">{{ selectedItem.ngayNhan ? new Date(selectedItem.ngayNhan).toLocaleString('vi-VN') : 'Chưa' }}</span></p>
              </div>
              <p v-if="selectedItem.hanTra" class="mt-5 text-xs font-bold p-4 rounded-xl border uppercase tracking-widest" :class="isLate(selectedItem.hanTra) ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-100 border-slate-200 text-slate-800'">
                Hạn trả: {{ new Date(selectedItem.hanTra).toLocaleDateString('vi-VN') }}
              </p>
            </div>
          </div>

          <div class="bg-slate-900 text-white border border-slate-800 p-6 rounded-3xl flex gap-6">
            <img :src="selectedItem.sach?.hinhAnh" class="w-28 h-40 object-cover rounded-xl shadow-md border border-slate-700 bg-white">
            <div class="flex-1 flex flex-col justify-center">
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Thông tin sách</p>
              <p class="font-black text-white text-2xl leading-tight mb-3 font-k2d tracking-tighter">{{ selectedItem.sach?.tenSach }}</p>
              <div class="flex gap-4 mb-3 text-sm">
                <span class="text-slate-400 font-medium">Tác giả: <span class="text-white">{{ selectedItem.sach?.tacGia || 'Ẩn danh' }}</span></span>
              </div>
              <div class="flex gap-4 text-sm">
                <span class="text-slate-400 font-medium">Mã: <span class="text-white font-mono bg-slate-800 px-2 py-1 rounded">{{ selectedItem.sach?.maSach }}</span></span>
                <span class="text-slate-400 font-medium">Kho: <span class="font-bold text-white">{{ selectedItem.sach?.soQuyen }} cuốn</span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 p-6 rounded-b-[2rem] border-t border-slate-200 flex gap-4 justify-end items-center">
          <span class="text-xs font-bold text-slate-500 mr-auto uppercase tracking-widest font-k2d">Thao tác:</span>

          <button @click="xuLy(selectedItem._id, 'huy')" v-if="['cho_duyet', 'da_chuan_bi'].includes(selectedItem.trangThai)" class="px-6 py-3 bg-white border border-slate-300 text-slate-600 rounded-xl text-xs font-black hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all uppercase tracking-widest">Hủy Phiếu</button>

          <button @click="xuLy(selectedItem._id, 'duyet')" v-if="selectedItem.trangThai === 'cho_duyet'" class="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg active:scale-95 transition-all uppercase tracking-widest">Chuẩn bị xong</button>

          <button @click="xuLy(selectedItem._id, 'giao')" v-if="selectedItem.trangThai === 'da_chuan_bi'" class="px-8 py-3 bg-amber-500 text-white rounded-xl text-xs font-black hover:bg-amber-600 shadow-lg active:scale-95 transition-all uppercase tracking-widest">Đã Giao Sách</button>

          <button @click="xuLy(selectedItem._id, 'tra')" v-if="selectedItem.trangThai === 'dang_muon'" class="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-lg active:scale-95 transition-all uppercase tracking-widest">Hoàn Tất Trả</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from '../utils/toast';

const { addToast } = useToast();
const records = ref([]);
const loading = ref(true);

const showModal = ref(false);
const selectedItem = ref(null);
const hoverItem = ref(null);

const choDuyet = computed(() => records.value.filter(r => r.trangThai === 'cho_duyet'));
const daChuanBi = computed(() => records.value.filter(r => r.trangThai === 'da_chuan_bi'));
const dangMuon = computed(() => records.value.filter(r => r.trangThai === 'dang_muon'));

const openModal = (item) => {
  selectedItem.value = item;
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/sach/lich-su/admin');
    records.value = res.data;
  } catch (error) {
    addToast('Lỗi tải dữ liệu', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const isLate = (date) => new Date(date) < new Date();

const getDueText = (end) => {
  const diff = Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24));
  return diff < 0 ? `Trễ ${Math.abs(diff)} ngày` : `Còn ${diff} ngày`;
};

const xuLy = async (id, hanhDong) => {
  const actionText = {
    duyet: 'Chuẩn bị sách xong',
    giao: 'Đã giao sách cho khách',
    tra: 'Xác nhận trả sách',
    huy: 'Hủy phiếu mượn'
  };

  if (!confirm(`Bạn có chắc chắn muốn thực hiện: ${actionText[hanhDong]}?`)) return;

  try {
    await axios.put(`http://localhost:3000/api/sach/admin/${hanhDong}/${id}`);
    addToast('Thao tác thành công!', 'success');
    if (showModal.value) closeModal();
    fetchData();
  } catch (e) {
    addToast(e.response?.data?.message || 'Lỗi xử lý nghiệp vụ', 'error');
  }
};
</script>

<style scoped>
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.popover-enter-active,
.popover-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
