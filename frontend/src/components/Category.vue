<template>
  <div class="max-w-7xl mx-auto p-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

    <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow border border-gray-100 h-fit sticky top-24">
      <h2 class="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Thêm Thể Loại Mới</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-bold mb-1">Tên Thể Loại</label>
          <input v-model="form.tenTheLoai" type="text" required class="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Khoa học viễn tưởng">
        </div>
        <div>
          <label class="block text-sm font-bold mb-1">Mô tả (Không bắt buộc)</label>
          <textarea v-model="form.moTa" rows="3" class="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập mô tả..."></textarea>
        </div>
        <button type="submit" :disabled="isSubmitting" class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400">
          {{ isSubmitting ? 'Đang lưu...' : 'Thêm Thể Loại' }}
        </button>
      </form>
    </div>

    <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow border border-gray-100">
      <h2 class="text-xl font-bold mb-6 text-gray-800 border-b pb-2 flex justify-between items-center">
        <span>Danh Sách Thể Loại</span>
        <span class="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">{{ categories.length }} Thể loại</span>
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên Thể Loại</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mô tả</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Xóa</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading" class="text-center"><td colspan="3" class="py-4 text-gray-500">Đang tải...</td></tr>
            <tr v-else-if="categories.length === 0" class="text-center"><td colspan="3" class="py-4 text-gray-500">Chưa có thể loại nào.</td></tr>
            <tr v-for="cat in categories" :key="cat._id" class="hover:bg-gray-50">
              <td class="px-4 py-4 font-bold text-blue-600">{{ cat.tenTheLoai }}</td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ cat.moTa || '---' }}</td>
              <td class="px-4 py-4 text-right">
                <button @click="deleteCat(cat._id, cat.tenTheLoai)" class="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg font-medium">Xóa</button>
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
const categories = ref([]);
const loading = ref(true);
const isSubmitting = ref(false);
const form = ref({ tenTheLoai: '', moTa: '' });

const fetchCats = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/the-loai');
    categories.value = res.data;
  } catch (error) { addToast('Lỗi tải dữ liệu', 'error'); }
  finally { loading.value = false; }
};

onMounted(fetchCats);

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    await axios.post('http://localhost:3000/api/the-loai', form.value);
    addToast('Thêm thể loại thành công!', 'success');
    form.value = { tenTheLoai: '', moTa: '' };
    fetchCats();
  } catch (error) {
    addToast(error.response?.data?.message || 'Lỗi thêm', 'error');
  } finally { isSubmitting.value = false; }
};

const deleteCat = async (id, name) => {
  if (!confirm(`Bạn có chắc muốn xóa thể loại "${name}"?`)) return;
  try {
    await axios.delete(`http://localhost:3000/api/the-loai/${id}`);
    addToast('Đã xóa!', 'success');
    fetchCats();
  } catch (error) { addToast('Lỗi xóa!', 'error'); }
};
</script>
