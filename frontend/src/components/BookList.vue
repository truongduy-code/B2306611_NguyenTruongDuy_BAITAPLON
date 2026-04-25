<template>
  <div class="font-readex max-w-[1280px] mx-auto pt-6 pb-16 px-4 sm:px-6 lg:px-8 bg-white min-h-screen selection:bg-rose-600 selection:text-white">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-16 border border-slate-200 shadow-2xl shadow-rose-900/10">
      <div class="lg:col-span-2 relative overflow-hidden p-8 md:p-12 flex flex-col justify-center border-r border-slate-200 min-h-[400px]">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-[20s]"></div>
        <div class="absolute inset-0 bg-rose-950/80 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-rose-950 via-rose-900/90 to-transparent"></div>

        <div class="relative z-10">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 border border-rose-300/30 text-rose-200 text-xs font-black uppercase tracking-[0.2em] mb-6 font-k2d bg-rose-900/40 backdrop-blur-sm">
            <span class="w-2 h-2 bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></span> Thư viện số thế hệ mới
          </span>

          <h1 class="font-k2d text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase drop-shadow-lg">
            Tri Thức <br><span class="text-rose-400 text-[0.8em]">Vô Hạn</span>
          </h1>

          <p class="text-rose-100 text-sm font-medium max-w-md mb-8 leading-relaxed uppercase tracking-[0.1em] opacity-90 drop-shadow-md">
            Catalog tuyển chọn những tác phẩm kinh điển và hiện đại dành cho hội viên cao cấp
          </p>

          <div class="relative max-w-md flex items-stretch border border-white/30 bg-white/10 backdrop-blur-md shadow-2xl">
            <input
              v-model="searchQuery"
              @keyup.enter="searchAndNavigate"
              type="text"
              placeholder="Tìm kiếm tác phẩm, tác giả..."
              class="w-full pl-6 pr-4 py-4 bg-transparent text-white font-medium outline-none transition-all rounded-none placeholder-rose-200/70 text-sm focus:bg-white/20"
            >
            <button
              @click="searchAndNavigate"
              class="font-k2d px-8 py-4 bg-rose-600 text-white font-bold transition-all uppercase tracking-widest text-sm hover:bg-rose-500 border-l border-white/30"
            >
              TÌM
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-rose-600 to-red-700 flex flex-col justify-between relative overflow-hidden group">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>

        <div class="relative z-10 px-8 pt-8 pb-8">
          <h3 class="font-k2d text-rose-100 font-bold uppercase tracking-widest text-xs mb-5">
            Tổng quan thư viện
          </h3>

          <div class="grid grid-cols-2 gap-0 border border-rose-300/30 bg-white/5 backdrop-blur-sm">
            <div class="p-5 border-r border-b border-rose-300/20">
              <p class="font-k2d text-[10px] font-bold uppercase tracking-[0.15em] text-rose-100/80 mb-2">Đầu sách</p>
              <p class="font-k2d text-4xl font-black text-white tracking-tighter">{{ stats.totalBooks }}</p>
            </div>

            <div class="p-5 border-b border-rose-300/20">
              <p class="font-k2d text-[10px] font-bold uppercase tracking-[0.15em] text-rose-100/80 mb-2">Lượt mượn</p>
              <p class="font-k2d text-4xl font-black text-white tracking-tighter">{{ stats.totalBorrows }}</p>
            </div>

            <div class="p-5 border-r border-rose-300/20">
              <p class="font-k2d text-[10px] font-bold uppercase tracking-[0.15em] text-rose-100/80 mb-2">Đánh giá</p>
              <p class="font-k2d text-4xl font-black text-white tracking-tighter">{{ stats.totalReviews }}</p>
            </div>

            <div class="p-5">
              <p class="font-k2d text-[10px] font-bold uppercase tracking-[0.15em] text-rose-100/80 mb-2">Bản sẵn</p>
              <p class="font-k2d text-4xl font-black text-white tracking-tighter">{{ stats.availableCopies }}</p>
            </div>
          </div>

          <p class="text-white/90 text-xs mt-5 font-bold uppercase tracking-[0.1em] border-t border-rose-300/40 pt-4 leading-relaxed">
            Thống kê được lấy trực tiếp từ dữ liệu sách, phiếu mượn và đánh giá hiện có trên hệ thống
          </p>
        </div>

        <button
          @click="$router.push('/kham-pha')"
          class="relative z-10 w-full bg-slate-900 p-6 text-white flex flex-col items-start justify-center hover:bg-rose-950 transition-colors border-t border-rose-800 cursor-pointer shadow-[0_-10px_20px_rgba(0,0,0,0.1)]"
        >
          <p class="font-k2d text-xs font-bold uppercase tracking-[0.1em] text-rose-400 mb-1">Toàn bộ danh mục</p>
          <div class="flex items-center justify-between w-full">
            <span class="font-k2d text-2xl font-black uppercase tracking-widest text-white">Khám phá ngay</span>
            <span class="text-3xl group-hover:translate-x-2 transition-transform text-rose-500">→</span>
          </div>
        </button>
      </div>
    </div>

    <div v-if="loading" class="py-16 text-center font-k2d font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse text-base">
      Đang đồng bộ dữ liệu...
    </div>

    <div v-else class="space-y-24">
      <div v-for="group in groupedBooks" :key="group.category._id" class="w-full">
        <div class="flex items-end justify-between border-b-[3px] border-rose-600 mb-8 relative">
          <div class="bg-rose-600 text-white px-6 py-3 relative flex items-center shadow-md">
            <h2 class="font-k2d text-2xl md:text-3xl font-black uppercase tracking-widest">{{ group.category.tenTheLoai }}</h2>
            <div class="absolute -bottom-[10px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-rose-600"></div>
          </div>

          <button
            @click="$router.push({ path: '/kham-pha', query: { cat: group.category._id } })"
            class="font-k2d text-xs font-black text-slate-500 uppercase tracking-[0.1em] hover:text-rose-600 transition-all pb-2 shrink-0"
          >
            Xem tất cả →
          </button>
        </div>

        <div class="flex flex-nowrap overflow-x-auto gap-0 border border-slate-200 scrollbar-hide snap-x bg-slate-50/50 items-stretch">
          <div
            v-for="book in group.books"
            :key="book.maSach"
            class="snap-start shrink-0 w-[220px] md:w-[240px] group flex flex-col cursor-pointer transition-all duration-300 border-r border-slate-200 bg-white hover:shadow-xl hover:shadow-rose-900/10 hover:z-10"
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

              <h3 class="font-k2d text-base font-bold leading-snug mb-4 line-clamp-2 uppercase tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                {{ book.tenSach }}
              </h3>

              <div class="grid grid-cols-2 gap-2 mb-4">
                <div class="border border-slate-200 bg-slate-50 px-3 py-2">
                  <p class="font-k2d text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Lượt mượn</p>
                  <p class="font-k2d text-lg font-black text-slate-900">{{ book.borrowCount || 0 }}</p>
                </div>

                <div class="border border-slate-200 bg-slate-50 px-3 py-2">
                  <p class="font-k2d text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Đánh giá</p>
                  <p class="font-k2d text-lg font-black text-slate-900">{{ book.totalReviews || 0 }}</p>
                </div>
              </div>

              <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <span class="font-k2d font-bold text-slate-500 text-xs uppercase tracking-widest">
                  Còn {{ book.soQuyen }} quyển
                </span>

                <div class="flex items-center gap-1">
                  <span class="text-amber-400 text-sm">★</span>
                  <span class="font-k2d font-black text-sm text-slate-900">
                    {{ Number(book.rating || 0).toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="$router.push({ path: '/kham-pha', query: { cat: group.category._id } })"
            class="shrink-0 w-[150px] flex flex-col items-center justify-center bg-rose-50/50 hover:bg-rose-600 transition-all border-r border-slate-200 group"
          >
            <div class="w-12 h-12 border-2 border-rose-200 group-hover:border-white flex items-center justify-center text-rose-400 group-hover:text-white transition-all mb-4 text-lg rounded-full">→</div>
            <span class="font-k2d font-bold uppercase tracking-[0.1em] text-xs text-rose-700 group-hover:text-white">Xem thêm</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const books = ref([]);
const categories = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const router = useRouter();

const fetchData = async () => {
  try {
    const [booksRes, catsRes] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/the-loai')
    ]);

    books.value = Array.isArray(booksRes.data) ? booksRes.data : [];
    categories.value = Array.isArray(catsRes.data) ? catsRes.data : [];
  } catch (error) {
    console.error('Lỗi tải dữ liệu', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const searchAndNavigate = () => {
  if (searchQuery.value.trim() !== '') {
    router.push({ path: '/kham-pha', query: { q: searchQuery.value.trim() } });
  } else {
    router.push('/kham-pha');
  }
};

const stats = computed(() => {
  const totalBooks = books.value.length;
  const totalBorrows = books.value.reduce((sum, book) => sum + Number(book.borrowCount || 0), 0);
  const totalReviews = books.value.reduce((sum, book) => sum + Number(book.totalReviews || 0), 0);
  const availableCopies = books.value.reduce((sum, book) => sum + Number(book.soQuyen || 0), 0);

  return {
    totalBooks,
    totalBorrows,
    totalReviews,
    availableCopies
  };
});

const groupedBooks = computed(() => {
  const groups = [];

  categories.value.forEach(cat => {
    const catBooks = books.value.filter(b => String(b.maTheLoai) === String(cat._id));
    if (catBooks.length > 0) {
      groups.push({ category: cat, books: catBooks });
    }
  });

  return groups;
});
</script>

<style scoped>
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.snap-x { scroll-snap-type: x mandatory; }
.snap-start { scroll-snap-align: start; }
</style>
