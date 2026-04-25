<template>
  <div class="max-w-7xl mx-auto p-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

    <div class="lg:col-span-1 bg-white p-6 rounded-xl shadow border border-gray-100 h-fit sticky top-4">
      <div class="flex justify-between items-center mb-6 border-b pb-2">
        <h2 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Sửa Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản' }}</h2>
        <button v-if="isEditing" @click="cancelEdit" class="text-sm text-gray-500 hover:text-red-500 underline">Hủy sửa</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Mã NXB</label>
          <input v-model="nxb.maNXB" type="text" required :disabled="isEditing" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="VD: NXB01">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Tên Nhà Xuất Bản</label>
          <input v-model="nxb.tenNXB" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: NXB Trẻ">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Địa Chỉ</label>
          <textarea v-model="nxb.diaChi" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập địa chỉ..."></textarea>
        </div>

        <button type="submit" :disabled="isSubmitting" class="w-full mt-4 py-2 rounded-lg font-medium text-white transition-colors" :class="isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'">
          {{ isSubmitting ? 'Đang xử lý...' : (isEditing ? 'Lưu Thay Đổi' : 'Thêm NXB') }}
        </button>
      </form>
    </div>

    <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-gray-100 overflow-hidden">
      <h2 class="text-xl font-bold mb-6 text-gray-800 border-b pb-2 flex justify-between items-center">
        <span>Danh Sách Nhà Xuất Bản</span>
        <span class="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">{{ nxbs.length }} NXB</span>
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mã</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên NXB</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Địa chỉ</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="text-center"><td colspan="4" class="py-4 text-gray-500">Đang tải...</td></tr>
            <tr v-else-if="nxbs.length === 0" class="text-center"><td colspan="4" class="py-4 text-gray-500">Chưa có NXB nào.</td></tr>

            <tr v-for="item in nxbs" :key="item.maNXB" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-mono text-sm text-gray-500">{{ item.maNXB }}</td>
              <td class="px-4 py-3 font-bold text-blue-600">{{ item.tenNXB }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ item.diaChi || '---' }}</td>
              <td class="px-4 py-3 text-right text-sm font-medium space-x-2 whitespace-nowrap">
                <button @click="editNXB(item)" class="text-orange-600 hover:text-orange-900 bg-orange-50 px-3 py-1 rounded">Sửa</button>
                <button @click="deleteNXB(item.maNXB, item.tenNXB)" class="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded">Xóa</button>
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
const isSubmitting = ref(false);
const isEditing = ref(false);
const loading = ref(true);
const nxbs = ref([]);

const defaultNXB = () => ({ maNXB: '', tenNXB: '', diaChi: '' });
const nxb = ref(defaultNXB());

const fetchNXBs = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/nxb');
    nxbs.value = res.data;
  } catch (error) { addToast('Lỗi tải dữ liệu NXB', 'error'); }
  finally { loading.value = false; }
};

onMounted(fetchNXBs);

const editNXB = (selected) => {
  isEditing.value = true;
  nxb.value = { ...selected };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  isEditing.value = false;
  nxb.value = defaultNXB();
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:3000/api/nxb/${nxb.value.maNXB}`, nxb.value);
      addToast('Cập nhật NXB thành công!', 'success');
    } else {
      await axios.post('http://localhost:3000/api/nxb', nxb.value);
      addToast('Thêm NXB thành công!', 'success');
    }
    cancelEdit();
    fetchNXBs();
  } catch (error) {
    addToast(error.response?.data?.message || 'Lỗi xử lý', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const deleteNXB = async (ma, ten) => {
  if (!confirm(`Xóa vĩnh viễn NXB "${ten}"?`)) return;
  try {
    await axios.delete(`http://localhost:3000/api/nxb/${ma}`);
    nxbs.value = nxbs.value.filter(n => n.maNXB !== ma);
    addToast('Đã xóa NXB!', 'success');
  } catch (error) { addToast('Lỗi khi xóa!', 'error'); }
};
</script>
