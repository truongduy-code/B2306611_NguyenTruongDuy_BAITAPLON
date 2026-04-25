<template>
  <div
    class="min-h-screen font-readex text-slate-800 relative selection:bg-slate-900 selection:text-white"
    :class="isAdminRoute ? 'bg-slate-50' : 'bg-white'"
  >
    <div class="fixed top-0 right-0 z-[100] flex flex-col gap-0 border-l border-slate-200">
      <transition-group name="list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="min-w-[320px] px-8 py-6 text-white flex items-center justify-between border-b border-slate-800"
          :class="toast.type === 'success' ? 'bg-slate-800' : 'bg-red-700'"
        >
          <div class="flex items-center gap-5">
            <div class="w-10 h-10 border border-white/40 flex items-center justify-center font-black text-xl">
              {{ toast.type === 'success' ? '✓' : '✕' }}
            </div>
            <span class="font-k2d font-bold text-sm tracking-wide uppercase">
              {{ toast.message }}
            </span>
          </div>
          <button @click="removeToast(toast.id)" class="ml-4 opacity-60 hover:opacity-100 transition-opacity">
            ✕
          </button>
        </div>
      </transition-group>
    </div>

    <div v-if="isAdminRoute" class="flex min-h-screen">
      <aside class="w-72 bg-slate-950 text-white flex flex-col border-r border-slate-900 sticky top-0 h-screen shrink-0 shadow-2xl">
        <div class="flex items-center gap-4 px-8 py-8 border-b border-slate-800/50">
          <div class="bg-white text-slate-900 w-12 h-12 flex items-center justify-center shadow-lg">
            <span class="font-k2d font-black text-2xl">L.</span>
          </div>
          <div>
            <h1 class="font-k2d text-xl font-black tracking-widest uppercase text-white">
              Admin<span class="text-slate-400">.</span>
            </h1>
            <p class="font-k2d text-[8px] text-slate-400 uppercase tracking-[0.3em]">
              Control Center
            </p>
          </div>
        </div>

        <nav class="flex-1 flex flex-col pt-8">
          <p class="font-k2d px-8 text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-4">
            Nghiệp Vụ
          </p>

          <router-link
            v-if="currentUser?.role === 'admin'"
            to="/admin/dashboard"
            class="font-k2d px-8 py-5 text-xs font-bold uppercase tracking-widest transition-all border-l-4 border-transparent hover:bg-slate-900 hover:border-slate-500 text-slate-400"
            active-class="bg-slate-900 border-white text-white shadow-lg"
          >
            Tổng Quan
          </router-link>

          <router-link
            to="/admin/thu-thu"
            class="font-k2d px-8 py-5 text-xs font-bold uppercase tracking-widest transition-all border-l-4 border-transparent hover:bg-slate-900 hover:border-slate-500 text-slate-400"
            active-class="bg-white border-white text-slate-900 shadow-lg"
          >
            Quầy Thủ Thư
          </router-link>

          <router-link
            v-if="currentUser?.role === 'admin'"
            to="/admin/them-sach"
            class="font-k2d px-8 py-5 text-xs font-bold uppercase tracking-widest transition-all border-l-4 border-transparent hover:bg-slate-900 hover:border-slate-500 text-slate-400"
            active-class="bg-slate-900 border-white text-white"
          >
            Quản Lý Sách
          </router-link>

          <router-link
            v-if="currentUser?.role === 'admin'"
            to="/admin/nxb"
            class="font-k2d px-8 py-5 text-xs font-bold uppercase tracking-widest transition-all border-l-4 border-transparent hover:bg-slate-900 hover:border-slate-500 text-slate-400"
            active-class="bg-slate-900 border-white text-white"
          >
            Nhà Xuất Bản
          </router-link>

          <router-link
            v-if="currentUser?.role === 'admin'"
            to="/admin/the-loai"
            class="font-k2d px-8 py-5 text-xs font-bold uppercase tracking-widest transition-all border-l-4 border-transparent hover:bg-slate-900 hover:border-slate-500 text-slate-400"
            active-class="bg-slate-900 border-white text-white"
          >
            Thể Loại
          </router-link>

          <p class="font-k2d px-8 text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-10 mb-4">
            Hệ Thống
          </p>

          <router-link
            to="/"
            class="font-k2d px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all border-l-4 border-transparent hover:bg-slate-900"
          >
            ← Về Trang Chủ
          </router-link>
        </nav>

        <div class="p-8 border-t border-slate-800/50 bg-black/20 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="font-k2d text-xs font-bold uppercase text-white">
              {{ currentUser?.hoTen }}
            </span>
            <span class="font-k2d text-[9px] text-slate-500 uppercase tracking-widest mt-1">
              {{ currentUser?.role === 'staff' ? 'Thủ thư' : 'Quản trị viên' }}
            </span>
          </div>

          <button
            @click="logout"
            class="w-10 h-10 border border-slate-800 text-slate-400 hover:bg-white hover:text-slate-900 hover:border-white transition-all flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>
      </aside>

      <main class="flex-1 overflow-x-hidden p-8 bg-slate-50">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <div v-else class="flex flex-col min-h-screen bg-white">
      <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20">
          <router-link to="/" class="flex items-center gap-4 group">
            <div class="w-10 h-10 bg-slate-900 flex items-center justify-center transition-transform group-hover:rotate-12 shadow-md">
              <span class="text-white font-black text-xl">L.</span>
            </div>
            <span class="font-k2d text-2xl font-black text-slate-900 tracking-tighter uppercase">
              Luxe<span class="text-slate-400">.</span>
            </span>
          </router-link>

          <nav class="flex items-stretch border-l border-slate-200">
            <router-link
              to="/"
              class="font-k2d px-10 border-r border-slate-200 text-slate-600 font-bold transition-all text-[10px] uppercase tracking-[0.3em] flex items-center hover:text-slate-900 hover:bg-slate-50"
              active-class="bg-slate-900 text-white border-slate-900 hover:text-white hover:bg-slate-900"
            >
              Home
            </router-link>

            <router-link
              to="/kham-pha"
              class="font-k2d px-10 border-r border-slate-200 text-slate-600 font-bold transition-all text-[10px] uppercase tracking-[0.3em] flex items-center hover:text-slate-900 hover:bg-slate-50"
              active-class="bg-slate-900 text-white border-slate-900 hover:text-white hover:bg-slate-900"
            >
              Catalog
            </router-link>

            <router-link
              v-if="currentUser && currentUser.role !== 'admin'"
              to="/lich-su"
              class="font-k2d px-10 border-r border-slate-200 text-slate-600 font-bold transition-all text-[10px] uppercase tracking-[0.3em] flex items-center hover:text-slate-900 hover:bg-slate-50"
              active-class="bg-slate-100 text-slate-900 border-slate-200"
            >
              My Shelf
            </router-link>

            <router-link
              v-if="currentUser?.role === 'admin' || currentUser?.role === 'staff'"
              :to="currentUser?.role === 'staff' ? '/admin/thu-thu' : '/admin/dashboard'"
              class="font-k2d px-10 border-r border-slate-200 bg-slate-50 text-slate-900 font-bold transition-all text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-slate-900 hover:text-white"
            >
              <span class="text-slate-400">⚡</span>
              {{ currentUser?.role === 'staff' ? 'Librarian Desk' : 'Admin Center' }}
            </router-link>

            <div class="flex items-center gap-4 px-8">
              <template v-if="currentUser">
                <div v-if="currentUser.role !== 'admin'" class="relative">
                  <button
                    @click="toggleNotification"
                    class="relative w-11 h-11 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                    title="Thông báo"
                  >
                    🔔
                    <span
                      v-if="notificationCount > 0"
                      class="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white"
                    >
                      {{ notificationCount }}
                    </span>
                  </button>

                  <transition name="fade">
                    <div
                      v-if="notificationOpen"
                      class="absolute right-0 top-14 w-[360px] bg-white border border-slate-200 shadow-2xl z-50"
                    >
                      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p class="font-k2d text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                            Thông báo
                          </p>
                          <p class="text-[11px] text-slate-400 mt-1">
                            Tình trạng mượn sách của bạn
                          </p>
                        </div>
                        <span class="font-k2d text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {{ notificationCount }} mục
                        </span>
                      </div>

                      <div v-if="loadingNotifications" class="px-5 py-8 text-center text-slate-400 text-sm">
                        Đang tải thông báo...
                      </div>

                      <div v-else-if="notificationItems.length === 0" class="px-5 py-8 text-center text-slate-400 text-sm">
                        Không có thông báo mới.
                      </div>

                      <div v-else class="max-h-[420px] overflow-y-auto">
                        <div
                          v-for="item in notificationItems"
                          :key="item.key"
                          class="px-5 py-4 border-b border-slate-100"
                          :class="item.tone === 'danger' ? 'bg-rose-50/70' : item.tone === 'info' ? 'bg-amber-50/40' : 'bg-white'"
                        >
                          <div class="flex items-start gap-3">
                            <div
                              class="w-9 h-9 shrink-0 flex items-center justify-center border"
                              :class="item.tone === 'danger'
                                ? 'bg-rose-100 text-rose-600 border-rose-200'
                                : item.tone === 'info'
                                  ? 'bg-amber-100 text-amber-600 border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'"
                            >
                              {{ item.icon }}
                            </div>

                            <div class="flex-1">
                              <p class="font-k2d text-xs font-black uppercase tracking-[0.15em] text-slate-900 mb-1">
                                {{ item.title }}
                              </p>
                              <p class="text-sm text-slate-600 leading-relaxed">
                                {{ item.detail }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="px-5 py-3 border-t border-slate-200 bg-slate-50">
                        <router-link
                          to="/lich-su"
                          @click="notificationOpen = false"
                          class="font-k2d text-[11px] font-black uppercase tracking-[0.18em] text-slate-700 hover:text-rose-600 transition-colors"
                        >
                          Xem chi tiết trong My Shelf →
                        </router-link>
                      </div>
                    </div>
                  </transition>
                </div>

                <div class="flex flex-col items-end leading-none">
                  <span class="font-k2d text-xs font-bold text-slate-900 uppercase">
                    {{ currentUser.hoTen }}
                  </span>
                  <span class="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                    {{ currentUser.role }}
                  </span>
                </div>

                <button
                  @click="logout"
                  class="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                >
                  ✕
                </button>
              </template>

              <template v-else>
                <router-link
                  to="/auth"
                  class="font-k2d bg-slate-900 text-white px-10 py-5 font-bold transition-all uppercase tracking-[0.3em] text-[10px] flex items-center hover:bg-slate-800 shadow-md"
                >
                  Login
                </router-link>
              </template>
            </div>
          </nav>
        </div>
      </header>

      <div
        v-if="currentUser && currentUser.role !== 'admin' && overdueCount > 0"
        class="border-b border-rose-200 bg-rose-50"
      >
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              ⚠️
            </div>
            <div>
              <p class="font-k2d text-xs font-black text-rose-700 uppercase tracking-[0.2em] mb-1">
                Cảnh báo quá hạn
              </p>
              <p class="text-sm text-slate-700 leading-relaxed">
                Bạn đang có <b>{{ overdueCount }}</b> sách quá hạn. Tài khoản sẽ bị <b>khóa mượn thêm sách</b> cho đến khi bạn trả các cuốn đang quá hạn.
              </p>
            </div>
          </div>

          <router-link
            to="/lich-su"
            class="font-k2d shrink-0 text-[11px] font-black uppercase tracking-[0.18em] text-rose-700 hover:text-rose-900 transition-colors"
          >
            Đi tới My Shelf →
          </router-link>
        </div>
      </div>

      <main class="flex-grow w-full">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { toasts, useToast } from './utils/toast';

const { removeToast } = useToast();
const route = useRoute();

const currentUser = ref(null);
const notificationOpen = ref(false);
const loadingNotifications = ref(false);
const notificationItems = ref([]);
const overdueCount = ref(0);

const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const notificationCount = computed(() => notificationItems.value.length);

const loadCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  currentUser.value = userStr ? JSON.parse(userStr) : null;
};

const resetNotifications = () => {
  notificationItems.value = [];
  overdueCount.value = 0;
  notificationOpen.value = false;
};

const fetchNotifications = async () => {
  if (!currentUser.value || currentUser.value.role === 'admin') {
    resetNotifications();
    return;
  }

  loadingNotifications.value = true;

  try {
    const res = await axios.get(`http://localhost:3000/api/sach/lich-su/${currentUser.value._id}`);
    const list = Array.isArray(res.data) ? res.data : [];
    const now = new Date();

    const overdueItems = list.filter(
      (item) => item.trangThai === 'dang_muon' && item.hanTra && new Date(item.hanTra) < now
    );
    const readyItems = list.filter((item) => item.trangThai === 'da_chuan_bi');
    const pendingItems = list.filter((item) => item.trangThai === 'cho_duyet');

    overdueCount.value = overdueItems.length;

    const nextNotifications = [];

    if (overdueItems.length > 0) {
      nextNotifications.push({
        key: 'overdue',
        icon: '⚠️',
        tone: 'danger',
        title: 'Sách quá hạn',
        detail: `Bạn đang có ${overdueItems.length} sách quá hạn. Hệ thống sẽ tạm khóa chức năng mượn thêm cho đến khi bạn trả sách.`
      });
    }

    if (readyItems.length > 0) {
      nextNotifications.push({
        key: 'ready',
        icon: '📦',
        tone: 'info',
        title: 'Sách đã sẵn sàng',
        detail: `${readyItems.length} yêu cầu của bạn đã được chuẩn bị. Bạn có thể đến thư viện để nhận sách tại quầy.`
      });
    }

    if (pendingItems.length > 0) {
      nextNotifications.push({
        key: 'pending',
        icon: '⏳',
        tone: 'normal',
        title: 'Yêu cầu đang chờ duyệt',
        detail: `Hiện có ${pendingItems.length} yêu cầu mượn đang chờ thủ thư xử lý.`
      });
    }

    notificationItems.value = nextNotifications;
  } catch (error) {
    resetNotifications();
  } finally {
    loadingNotifications.value = false;
  }
};

const toggleNotification = async () => {
  notificationOpen.value = !notificationOpen.value;
  if (notificationOpen.value) {
    await fetchNotifications();
  }
};

onMounted(async () => {
  loadCurrentUser();
  await fetchNotifications();
});

watch(
  () => route.fullPath,
  async () => {
    notificationOpen.value = false;
    loadCurrentUser();
    await fetchNotifications();
  }
);

const logout = () => {
  if (confirm('Bạn có muốn đăng xuất?')) {
    localStorage.removeItem('user');
    window.location.href = '/';
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=K2D:wght@400;500;600;700;800;900&family=Readex+Pro:wght@300;400;500;600;700&display=swap');

.font-readex { font-family: 'Readex Pro', sans-serif; }
.font-k2d { font-family: 'K2D', sans-serif; }

.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
