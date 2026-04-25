<template>
  <div class="font-readex max-w-[1400px] mx-auto pt-6 pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen selection:bg-rose-600 selection:text-white">
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="lg:w-64 shrink-0">
        <div class="sticky top-28 space-y-6">
          <div>
            <h2 class="font-k2d text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Danh mục</h2>
            <div class="flex flex-col border border-slate-200">
              <button
                @click="selectedCat = ''"
                class="font-k2d px-5 py-4 text-left text-sm font-bold uppercase tracking-wider border-b border-slate-100 transition-all"
                :class="selectedCat === '' ? 'bg-slate-900 text-[#FFD1DC]' : 'bg-white text-slate-600 hover:bg-[#FFD1DC]/20'"
              >
                Tất cả tác phẩm
              </button>
              <button
                v-for="cat in categories"
                :key="cat._id"
                @click="selectedCat = cat._id"
                class="font-k2d px-5 py-4 text-left text-sm font-bold uppercase tracking-wider border-b border-slate-100 transition-all"
                :class="selectedCat === cat._id ? 'bg-slate-900 text-[#FFD1DC]' : 'bg-white text-slate-600 hover:bg-[#FFD1DC]/20'"
              >
                {{ cat.tenTheLoai }}
              </button>
            </div>
          </div>

          <div class="p-6 bg-[#FFD1DC]/20 border border-[#FFD1DC]">
            <p class="font-k2d text-xs font-bold uppercase tracking-widest text-rose-700 mb-3">Tìm kiếm nhanh</p>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tên sách, tác giả..."
              class="w-full bg-white border border-rose-200 px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-rose-400/50 transition-all"
            >
          </div>

          <div class="p-6 bg-slate-50 border border-slate-200">
            <p class="font-k2d text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Trạng thái kho</p>
            <label class="flex items-center gap-3 cursor-pointer group">
              <input v-model="inStockOnly" type="checkbox" class="w-5 h-5 accent-rose-600 cursor-pointer">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-rose-600 transition-colors">
                Chỉ hiện sách còn kho
              </span>
            </label>
          </div>

          <div class="p-6 bg-slate-50 border border-slate-200">
            <p class="font-k2d text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Sắp xếp theo</p>
            <select
              v-model="sortBy"
              class="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-rose-400/50 transition-all cursor-pointer"
            >
              <option value="newest">Mới cập nhật</option>
              <option value="popular">Nhiều lượt mượn</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-8">
          <h1 class="font-k2d text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            {{ currentTitle }}
          </h1>
          <span class="font-k2d text-sm font-bold text-slate-500 uppercase tracking-widest">
            {{ filteredAndSortedBooks.length }} Kết quả
          </span>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-0 border border-slate-200">
          <div v-for="i in 10" :key="i" class="h-64 bg-slate-50 animate-pulse border-r border-b border-slate-200"></div>
        </div>

        <div v-else-if="filteredAndSortedBooks.length === 0" class="py-32 text-center border border-slate-200 bg-slate-50">
          <p class="font-k2d font-bold text-slate-400 uppercase tracking-[0.2em] text-xl mb-3">Không tìm thấy dữ liệu</p>
          <button @click="resetFilters" class="font-k2d text-xs font-black text-rose-600 uppercase tracking-widest hover:text-rose-900">
            ✕ Xóa bộ lọc
          </button>
        </div>

        <div v-else>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-l border-slate-200 bg-slate-50/30 items-stretch">
            <div
              v-for="book in paginatedBooks"
              :key="book.maSach"
              class="group flex flex-col h-full cursor-pointer transition-all duration-300 border-r border-b border-slate-200 bg-white hover:z-10 hover:shadow-xl hover:shadow-rose-900/5"
              @click="$router.push('/sach/' + book.maSach)"
            >
              <div class="relative w-full aspect-[2/3] overflow-hidden border-b border-slate-100 bg-white flex items-center justify-center p-4">
                <img
                  :src="book.hinhAnh"
                  class="w-auto h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  :class="{ 'grayscale opacity-60': book.soQuyen <= 0 }"
                >
                <div v-if="book.soQuyen <= 0" class="absolute top-3 right-3 bg-rose-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-widest shadow-sm">
                  Hết sách
                </div>
              </div>

              <div class="p-5 flex-1 flex flex-col bg-white">
                <p class="font-k2d text-xs font-bold text-slate-400 uppercase tracking-[0.05em] mb-2 line-clamp-1">
                  {{ book.tacGia || 'Đang cập nhật' }}
                </p>

                <h3 class="font-k2d text-base font-bold leading-snug mb-3 line-clamp-2 uppercase tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                  {{ book.tenSach }}
                </h3>

                <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                  <span class="font-k2d font-bold text-slate-500 text-xs flex items-center gap-1 uppercase tracking-widest">
                    <span class="text-rose-500">📚</span> {{ book.borrowCount || 0 }} lượt mượn
                  </span>

                  <div class="flex items-center gap-1">
                    <span class="text-amber-400 text-xs">★</span>
                    <span class="font-k2d font-bold text-xs">{{ book.rating || '0.0' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-4">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="font-k2d px-6 py-4 border border-slate-200 bg-white text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
            >
              ← Trang trước
            </button>

            <span class="font-k2d text-sm font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-6 py-3.5 border border-slate-200">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="font-k2d px-6 py-4 border border-slate-200 bg-white text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
            >
              Trang sau →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const books = ref([]);
const categories = ref([]);
const loading = ref(true);

const searchQuery = ref(route.query.q || '');
const selectedCat = ref(route.query.cat || '');
const inStockOnly = ref(false);
const sortBy = ref('newest');

const currentPage = ref(1);
const itemsPerPage = 10;

const fetchData = async () => {
  try {
    const [booksRes, catsRes] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/the-loai')
    ]);
    books.value = booksRes.data;
    categories.value = catsRes.data;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

watch(selectedCat, (newVal) => {
  if (newVal !== route.query.cat) {
    router.replace({ query: { ...route.query, cat: newVal || undefined } });
  }
});

watch(searchQuery, (newVal) => {
  if (newVal !== route.query.q) {
    router.replace({ query: { ...route.query, q: newVal || undefined } });
  }
});

watch([searchQuery, selectedCat, inStockOnly, sortBy], () => {
  currentPage.value = 1;
});

const filteredAndSortedBooks = computed(() => {
  let result = books.value.filter((b) => {
    const mSearch =
      !searchQuery.value ||
      b.tenSach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (b.tacGia && b.tacGia.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const mCat = !selectedCat.value || b.maTheLoai === selectedCat.value;
    const mStock = !inStockOnly.value || b.soQuyen > 0;

    return mSearch && mCat && mStock;
  });

  if (sortBy.value === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0));
  } else {
    result.reverse();
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredAndSortedBooks.value.length / itemsPerPage));

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredAndSortedBooks.value.slice(start, start + itemsPerPage);
});

const currentTitle = computed(() => {
  if (searchQuery.value) return `Từ khóa: "${searchQuery.value}"`;
  if (selectedCat.value) {
    const cat = categories.value.find((c) => c._id === selectedCat.value);
    return cat ? cat.tenTheLoai : 'Catalog';
  }
  return 'Tất cả tác phẩm';
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedCat.value = '';
  inStockOnly.value = false;
  sortBy.value = 'newest';
};
</script>

<style scoped>
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
