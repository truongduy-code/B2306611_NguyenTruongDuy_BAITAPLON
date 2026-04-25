<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8 mt-4 min-h-[85vh] font-readex bg-white border border-slate-200">
    <div class="flex justify-between items-end border-b-2 border-slate-900 pb-6 mb-10">
      <div>
        <h2 class="font-k2d text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Tổng Quan Trạm</h2>
        <p class="text-slate-500 font-bold text-sm uppercase tracking-[0.1em] mt-2">Tổng hợp hoạt động thư viện hiện tại</p>
      </div>
      <button @click="fetchData" class="font-k2d bg-slate-900 text-white px-6 py-3 font-bold text-sm uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-md">
        Làm Mới Số Liệu
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-200 mb-12">
      <div class="p-8 border-r border-b lg:border-b-0 border-slate-200 bg-white hover:bg-blue-50/30 transition-colors">
        <div class="flex justify-between items-start mb-6">
          <p class="font-k2d text-xs font-bold text-slate-400 uppercase tracking-widest">Đầu Sách</p>
          <span class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm shadow-sm">📚</span>
        </div>
        <p class="font-k2d text-6xl font-black text-blue-600 tracking-tighter">{{ stats.totalBooks }}</p>
      </div>

      <div class="p-8 border-r border-b lg:border-b-0 border-slate-200 bg-white hover:bg-violet-50/30 transition-colors">
        <div class="flex justify-between items-start mb-6">
          <p class="font-k2d text-xs font-bold text-slate-400 uppercase tracking-widest">Độc Giả</p>
          <span class="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm shadow-sm">👥</span>
        </div>
        <p class="font-k2d text-6xl font-black text-violet-600 tracking-tighter">{{ stats.totalUsers }}</p>
      </div>

      <div class="p-8 border-r border-b lg:border-b-0 border-slate-200 bg-white hover:bg-amber-50/30 transition-colors">
        <div class="flex justify-between items-start mb-6">
          <p class="font-k2d text-xs font-bold text-slate-400 uppercase tracking-widest">Đang Mượn</p>
          <span class="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm shadow-sm">🔄</span>
        </div>
        <p class="font-k2d text-6xl font-black text-amber-500 tracking-tighter">{{ stats.activeLoans }}</p>
      </div>

      <div class="p-8 bg-white hover:bg-rose-50/30 transition-colors">
        <div class="flex justify-between items-start mb-6">
          <p class="font-k2d text-xs font-bold text-slate-400 uppercase tracking-widest">Quá Hạn</p>
          <span class="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm shadow-sm">⚠️</span>
        </div>
        <p class="font-k2d text-6xl font-black text-rose-600 tracking-tighter">{{ stats.overdueLoans }}</p>
      </div>
    </div>

    <div class="border border-slate-200 bg-white">
      <div class="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
        <h3 class="font-k2d text-xl font-black text-slate-900 uppercase tracking-widest">Hoạt Động Gần Đây</h3>
        <router-link to="/admin/thu-thu" class="font-k2d text-xs font-bold text-rose-600 uppercase tracking-widest hover:text-rose-800">Tới Quầy Thủ Thư →</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-white border-b border-slate-200">
              <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Độc Giả</th>
              <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Sách</th>
              <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày Yêu Cầu</th>
              <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="recentLoans.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400 font-medium italic text-sm">Chưa có giao dịch nào</td>
            </tr>
            <tr v-for="loan in recentLoans" :key="loan._id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="p-5">
                <p class="font-bold text-slate-900 text-base">{{ loan.docGia?.hoTen }}</p>
                <p class="text-xs text-slate-500 font-medium">{{ loan.docGia?.email }}</p>
              </td>
              <td class="p-5 font-bold text-slate-700 text-sm line-clamp-1 max-w-[250px] mt-2">
                {{ loan.sach?.tenSach }}
              </td>
              <td class="p-5 text-sm text-slate-600 font-medium">
                {{ new Date(loan.ngayYeuCau).toLocaleDateString('vi-VN') }}
              </td>
              <td class="p-5">
                <span
                  class="px-3 py-1.5 text-xs font-bold uppercase tracking-widest border shadow-sm"
                  :class="{
                    'border-slate-200 text-slate-600 bg-slate-50': loan.trangThai === 'cho_duyet',
                    'border-amber-200 text-amber-700 bg-amber-50': loan.trangThai === 'da_chuan_bi',
                    'border-emerald-200 text-emerald-700 bg-emerald-50': loan.trangThai === 'dang_muon',
                    'border-blue-200 text-blue-700 bg-blue-50': loan.trangThai === 'da_tra',
                    'border-rose-200 text-rose-700 bg-rose-50': loan.trangThai === 'da_huy'
                  }"
                >
                  {{ formatStatus(loan.trangThai) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from '../utils/toast';

const { addToast } = useToast();
const stats = ref({ totalBooks: 0, totalUsers: 0, activeLoans: 0, overdueLoans: 0 });
const recentLoans = ref([]);

const fetchData = async () => {
  try {
    const [booksRes, loansRes] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/sach/lich-su/admin')
    ]);

    let totalUsersCount = 0;
    try {
      const usersRes = await axios.get('http://localhost:3000/api/auth/users');
      if (Array.isArray(usersRes.data)) {
        totalUsersCount = usersRes.data.filter(user => user.role === 'docgia').length;
      }
    } catch (e) {}

    const books = booksRes.data;
    const loans = loansRes.data;

    stats.value.totalBooks = books.length;
    stats.value.totalUsers = totalUsersCount;
    stats.value.activeLoans = loans.filter(l => l.trangThai === 'dang_muon').length;
    stats.value.overdueLoans = loans.filter(l => l.trangThai === 'dang_muon' && new Date(l.hanTra) < new Date()).length;
    recentLoans.value = loans.slice(0, 5);
  } catch (error) {
    addToast('Lỗi tải dữ liệu Tổng quan', 'error');
  }
};

onMounted(fetchData);

const formatStatus = (stt) => {
  const map = {
    cho_duyet: 'Chờ duyệt',
    da_chuan_bi: 'Đã chuẩn bị',
    dang_muon: 'Đang mượn',
    da_tra: 'Đã trả',
    da_huy: 'Đã hủy'
  };
  return map[stt] || stt;
};
</script>
