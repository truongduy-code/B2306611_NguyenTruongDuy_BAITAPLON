<template>
  <div class="max-w-6xl mx-auto p-12 bg-white border border-slate-200 mb-10 selection:bg-slate-900 selection:text-white" v-if="rawData">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
      <div>
        <h2 class="font-k2d text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 uppercase">Tủ Sách Cá Nhân</h2>
        <p class="text-slate-500 font-medium leading-relaxed">Theo dõi tiến độ mượn trả và quản lý kho tri thức của bạn.</p>
      </div>
      <div class="bg-slate-900 px-8 py-4 text-white uppercase tracking-widest text-sm font-bold shadow-lg">
        Hoạt động
      </div>
    </div>

    <div class="flex flex-wrap items-stretch mb-16 border border-slate-200 bg-white">
      <button @click="currentTab = 'pending'" class="font-k2d px-10 py-5 text-sm font-bold whitespace-nowrap transition-all duration-300 border-r border-slate-200" :class="currentTab === 'pending' ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50'">
        Yêu cầu xử lý ({{ pending.length }})
      </button>
      <button @click="currentTab = 'loans'" class="font-k2d px-10 py-5 text-sm font-bold whitespace-nowrap transition-all duration-300 border-r border-slate-200" :class="currentTab === 'loans' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'">
        Sách đang giữ ({{ loans.length }})
      </button>
      <button @click="currentTab = 'history'" class="font-k2d px-10 py-5 text-sm font-bold whitespace-nowrap transition-all duration-300 border-r border-slate-200" :class="currentTab === 'history' ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50'">
        Lịch sử mượn
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-slate-400 font-bold animate-pulse">Đang đồng bộ dữ liệu kệ sách...</div>

    <div v-else>
      <div v-if="currentTab === 'pending'" class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200">
        <div v-if="pending.length === 0" class="col-span-full text-center py-32 text-slate-400 font-medium rounded-none border-b border-slate-200 bg-slate-50">
          Bạn không có yêu cầu nào đang xử lý.
        </div>

        <div
          v-for="item in pending"
          :key="item._id"
          class="flex flex-col sm:flex-row gap-8 p-10 border-b border-r border-slate-200 transition-all hover:bg-slate-50"
          :class="item.trangThai === 'cho_duyet' ? 'bg-white' : 'bg-slate-50'"
        >
          <div class="w-[120px] aspect-[1/1] bg-white border border-slate-100 p-4 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300" :class="{ 'grayscale opacity-60': item.trangThai === 'cho_duyet' }">
            <img :src="item.sach?.hinhAnh" class="max-w-[80%] max-h-[80%] object-contain">
          </div>

          <div class="flex-1 flex flex-col justify-center pt-2">
            <p class="font-k2d text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">
              {{ new Date(item.ngayYeuCau).toLocaleDateString('vi-VN') }}
            </p>

            <h3 class="font-k2d text-xl font-bold text-slate-900 mb-4 leading-tight">{{ item.sach?.tenSach }}</h3>

            <div v-if="item.trangThai === 'cho_duyet'" class="flex items-center gap-3 bg-slate-100 p-3 border border-slate-200 mb-4">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-slate-500 animate-pulse"></span>
              <span class="font-k2d text-xs font-bold text-slate-600 uppercase tracking-widest">Đang chờ duyệt</span>
            </div>

            <div v-else class="flex flex-col gap-2 mb-4">
              <span class="font-k2d bg-slate-900 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-center">
                Sách đã sẵn sàng
              </span>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">Tới thư viện để nhận sách</p>
            </div>

            <div v-if="item.trangThai === 'cho_duyet'" class="flex justify-start">
              <button
                @click="huyYeuCau(item)"
                :disabled="cancelingId === item._id"
                class="font-k2d px-6 py-3 bg-white text-rose-600 border border-rose-200 font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-60"
              >
                {{ cancelingId === item._id ? 'ĐANG HỦY...' : 'Hủy yêu cầu' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'loans'" class="space-y-12">
        <div v-if="loans.length === 0" class="text-center py-32 text-slate-400 font-medium border border-slate-200 rounded-none bg-white">
          Hiện tại bạn không giữ cuốn sách nào.
        </div>

        <div v-for="item in loans" :key="item._id" class="flex flex-col sm:flex-row gap-10 p-12 bg-white border border-slate-200 hover:shadow-xl hover:border-slate-400 transition-all duration-500">
          <div class="w-32 aspect-[1/1] bg-white border border-slate-100 p-5 flex items-center justify-center shrink-0 shadow-sm relative">
            <img :src="item.sach?.hinhAnh" class="max-w-[80%] max-h-[80%] object-contain">
          </div>

          <div class="flex-1 flex flex-col justify-center pt-2">
            <h3 class="font-k2d text-2xl font-bold text-slate-900 mb-2 leading-tight uppercase">{{ item.sach?.tenSach }}</h3>
            <p class="font-k2d text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">
              Nhận sách: {{ new Date(item.ngayNhan).toLocaleDateString('vi-VN') }}
            </p>

            <div class="bg-slate-100 rounded-none h-4 w-full mb-3 overflow-hidden shadow-inner border border-slate-200">
              <div class="h-full rounded-none transition-all duration-1000 relative" :class="getDueColor(item.hanTra)" :style="`width: ${getDuePercentage(item.ngayNhan, item.hanTra)}%`"></div>
            </div>

            <p class="font-k2d text-sm font-bold flex items-center gap-2" :class="getDueTextColor(item.hanTra)">
              <span class="text-lg">🕒</span> {{ getDueText(item.hanTra) }}
            </p>
          </div>

          <div class="flex flex-col gap-3 justify-center sm:border-l border-slate-100 sm:pl-10 mt-6 sm:mt-0 shrink-0">
            <button v-if="!item.daGiaHan" @click="giaHan(item._id)" class="font-k2d px-10 py-5 bg-white text-slate-900 hover:text-white font-bold hover:bg-slate-900 transition-all text-xs uppercase tracking-widest border border-slate-300 shadow-sm">
              Gia hạn +7 ngày
            </button>
            <div v-else class="bg-slate-50 px-10 py-5 border border-slate-200 text-center">
              <span class="font-k2d text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">Đã gia hạn 1 lần</span>
            </div>
            <p class="text-[10px] text-slate-500 text-center font-medium w-full max-w-[160px] mx-auto">
              Vui lòng mang sách đến quầy thủ thư để hoàn tất trả sách.
            </p>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'history'" class="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-200">
        <div v-if="history.length === 0" class="col-span-full text-center py-32 text-slate-400 font-medium border-b border-slate-200 bg-slate-50">
          Lịch sử trống.
        </div>

        <div v-for="item in history" :key="item._id" class="group flex flex-col gap-4 p-8 bg-white border-r border-b border-slate-200 relative transition-all duration-300 hover:bg-slate-50">
          <div class="absolute top-4 right-4 z-10">
            <span v-if="item.trangThai === 'da_tra'" class="bg-slate-900 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">Hoàn Thành</span>
            <span v-else class="bg-slate-100 text-slate-500 border border-slate-200 text-[8px] font-black px-2 py-1 uppercase tracking-widest">Đã Hủy</span>
          </div>

          <div class="w-full aspect-[2/3] bg-slate-50 overflow-hidden border border-slate-100 relative p-4 flex items-center justify-center">
            <img :src="item.sach?.hinhAnh" class="max-w-full max-h-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
          </div>

          <div class="flex-1 flex flex-col pt-2">
            <h3 class="font-k2d text-sm font-bold text-slate-900 leading-tight uppercase line-clamp-2 mb-2">{{ item.sach?.tenSach }}</h3>
            <p class="font-k2d text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-auto">
              {{ new Date(item.ngayYeuCau).toLocaleDateString('vi-VN') }}
            </p>
          </div>
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
const loading = ref(true);
const rawData = ref([]);
const currentTab = ref('pending');
const cancelingId = ref('');
let user = null;

const pending = computed(() => rawData.value.filter(i => ['cho_duyet', 'da_chuan_bi'].includes(i.trangThai)));
const loans = computed(() => rawData.value.filter(i => i.trangThai === 'dang_muon'));
const history = computed(() => rawData.value.filter(i => ['da_tra', 'da_huy'].includes(i.trangThai)));

const getDuePercentage = (start, end) => {
  const total = new Date(end) - new Date(start);
  const passed = new Date() - new Date(start);
  return Math.min(Math.max((passed / total) * 100, 0), 100);
};

const getDueText = (end) => {
  const diff = Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24));
  return diff < 0 ? `Quá hạn ${Math.abs(diff)} ngày` : `Còn ${diff} ngày nữa`;
};

const getDueColor = (end) => (new Date(end) - new Date() < 0 ? 'bg-red-600' : 'bg-slate-900');
const getDueTextColor = (end) => (new Date(end) - new Date() < 0 ? 'text-red-600' : 'text-slate-900');

const fetchData = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/sach/lich-su/${user._id}`);
    rawData.value = res.data;
  } catch (e) {
    addToast('Lỗi tải kệ sách cá nhân', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return window.location.href = '/auth';
  user = JSON.parse(userStr);
  if (user.role === 'admin') return window.location.href = '/admin/dashboard';
  fetchData();
});

const giaHan = async (id) => {
  if (!confirm('Bạn muốn gia hạn thêm 7 ngày cho cuốn sách này?')) return;
  try {
    await axios.put(`http://localhost:3000/api/sach/gia-han/${id}`);
    addToast('Gia hạn thành công!', 'success');
    fetchData();
  } catch (e) {
    addToast(e.response?.data?.message || 'Lỗi gia hạn', 'error');
  }
};

const huyYeuCau = async (item) => {
  if (!confirm(`Bạn muốn hủy yêu cầu mượn cho sách "${item.sach?.tenSach}"?`)) return;

  cancelingId.value = item._id;
  try {
    await axios.put(`http://localhost:3000/api/sach/yeu-cau/huy/${item._id}`, {
      userId: user._id
    });
    addToast('Đã hủy yêu cầu mượn sách!', 'success');
    fetchData();
  } catch (e) {
    addToast(e.response?.data?.message || 'Không thể hủy yêu cầu', 'error');
  } finally {
    cancelingId.value = '';
  }
};
</script>
