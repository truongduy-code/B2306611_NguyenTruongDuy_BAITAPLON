<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8 mt-4 min-h-[85vh] font-readex bg-white border border-slate-200">
    <div class="flex justify-between items-end border-b-2 border-slate-900 pb-6 mb-10">
      <div>
        <h2 class="font-k2d text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Quản Lý Nhân Viên</h2>
        <p class="text-slate-500 font-bold text-sm uppercase tracking-[0.1em] mt-2">Chỉ quản lý mới được tạo tài khoản staff / admin</p>
      </div>
      <button @click="fetchUsers" class="font-k2d bg-slate-900 text-white px-6 py-3 font-bold text-sm uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-md">
        Làm Mới
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">
      <div class="xl:col-span-2 border border-slate-200 p-8 bg-slate-50">
        <h3 class="font-k2d text-2xl font-black text-slate-900 uppercase mb-6">Tạo tài khoản nội bộ</h3>

        <form @submit.prevent="createEmployee" class="space-y-5">
          <div>
            <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vai trò</label>
            <select v-model="form.role" @change="syncRoleDefaults" class="w-full px-5 py-3 bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600/30 transition-all text-sm font-bold text-slate-700">
              <option value="staff">Thủ thư</option>
              <option value="admin">Quản lý</option>
            </select>
          </div>

          <div>
            <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Họ tên nhân viên</label>
            <input v-model="form.hoTenNV" required class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="Nguyễn Văn B">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input v-model="form.email" type="email" required class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="staff@library.local">
            </div>

            <div>
              <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mật khẩu</label>
              <input v-model="form.password" type="text" required class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="********">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">MSNV</label>
              <input v-model="form.msnv" class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900 uppercase" placeholder="VD: NV001">
            </div>

            <div>
              <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Chức vụ</label>
              <input v-model="form.chucVu" class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="Thủ thư / Quản lý">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Số điện thoại</label>
              <input v-model="form.soDienThoai" class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="09xxxxxxxx">
            </div>

            <div>
              <label class="font-k2d block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Địa chỉ</label>
              <input v-model="form.diaChi" class="w-full px-5 py-3 border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-600/30 transition-all font-bold text-slate-900" placeholder="123 Đường ABC, Quận XYZ, TP. HCM">
            </div>
          </div>

          <button type="submit" :disabled="isProcessing" class="font-k2d w-full py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 disabled:opacity-60">
            {{ isProcessing ? 'ĐANG XỬ LÝ...' : 'TẠO TÀI KHOẢN NỘI BỘ' }}
          </button>
        </form>
      </div>

      <div class="xl:col-span-3 border border-slate-200 bg-white">
        <div class="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-k2d text-xl font-black text-slate-900 uppercase tracking-widest">Danh sách nội bộ</h3>
          <span class="bg-blue-50 text-blue-600 font-bold px-5 py-2 border border-blue-100 text-xs">
            {{ employees.length }} tài khoản
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-white border-b border-slate-200">
                <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Nhân viên</th>
                <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">MSNV</th>
                <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Vai trò</th>
                <th class="font-k2d p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Chức vụ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="employees.length === 0">
                <td colspan="4" class="p-8 text-center text-slate-400 font-medium italic text-sm">Chưa có tài khoản nội bộ nào</td>
              </tr>

              <tr v-for="item in employees" :key="item._id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="p-5">
                  <p class="font-bold text-slate-900 text-base">{{ item.hoTen }}</p>
                  <p class="text-xs text-slate-500 font-medium">{{ item.email }}</p>
                </td>

                <td class="p-5 text-sm font-bold text-slate-700">{{ item.msnv }}</td>

                <td class="p-5">
                  <span
                    class="px-3 py-1.5 text-xs font-bold uppercase tracking-widest border shadow-sm"
                    :class="item.role === 'admin'
                      ? 'border-rose-200 text-rose-700 bg-rose-50'
                      : 'border-blue-200 text-blue-700 bg-blue-50'"
                  >
                    {{ item.roleLabel || (item.role === 'admin' ? 'Quản lý' : 'Thủ thư') }}
                  </span>
                </td>

                <td class="p-5 text-sm text-slate-600 font-medium">
                  {{ item.chucVu }}
                  <span v-if="item._id === currentUser?._id" class="ml-2 text-[10px] uppercase font-black text-emerald-600">(Bạn)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from '../utils/toast';

const { addToast } = useToast();

const currentUser = ref(null);
const employees = ref([]);
const isProcessing = ref(false);

const defaultForm = () => ({
  role: 'staff',
  hoTenNV: '',
  email: '',
  password: '123456',
  msnv: '',
  chucVu: 'Thủ thư',
  soDienThoai: '',
  diaChi: ''
});

const form = ref(defaultForm());

const syncRoleDefaults = () => {
  form.value.chucVu = form.value.role === 'admin' ? 'Quản lý' : 'Thủ thư';
};

const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/auth/users');
    employees.value = Array.isArray(res.data)
      ? res.data.filter(user => ['staff', 'admin'].includes(user.role))
      : [];
  } catch (error) {
    addToast('Lỗi tải danh sách nhân viên', 'error');
  }
};

const createEmployee = async () => {
  isProcessing.value = true;

  try {
    const payload = {
      ...form.value,
      creatorRole: currentUser.value?.role || ''
    };

    const res = await axios.post('http://localhost:3000/api/auth/employees', payload);
    addToast(res.data.message, 'success');
    form.value = defaultForm();
    fetchUsers();
  } catch (error) {
    addToast(error.response?.data?.message || 'Lỗi tạo tài khoản nội bộ', 'error');
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  try {
    currentUser.value = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    currentUser.value = null;
  }
  fetchUsers();
});
</script>
