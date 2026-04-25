<template>
  <div class="min-h-[85vh] flex rounded-3xl overflow-hidden shadow-2xl bg-white m-4 border border-gray-100">
    <div class="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
        class="absolute inset-0 w-full h-full object-cover opacity-40 hover:opacity-50 transition-opacity duration-1000"
        alt="Library Background"
      >
      <div class="relative z-10 p-12 text-center">
        <h2 class="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">Thế Giới Tri Thức</h2>
        <p class="text-xl text-gray-200 font-light drop-shadow-md">
          Khám phá, học hỏi và kết nối qua hàng ngàn cuốn sách trong hệ thống thư viện của chúng tôi
        </p>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gray-50/50">
      <div class="w-full max-w-2xl">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
            {{ pageTitle }}
          </h2>
          <p class="text-gray-500">
            {{ pageDescription }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <template v-if="mode === 'register'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 animate-[fade-in-up_0.35s_ease-out]">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Họ lót</label>
                <input
                  v-model="registerForm.hoLot"
                  type="text"
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                  placeholder="Nguyễn Văn"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Tên</label>
                <input
                  v-model="registerForm.ten"
                  type="text"
                  required
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                  placeholder="A"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 animate-[fade-in-up_0.4s_ease-out]">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
                <input
                  v-model="registerForm.ngaySinh"
                  type="date"
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Phái</label>
                <select
                  v-model="registerForm.phai"
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700 cursor-pointer"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 animate-[fade-in-up_0.45s_ease-out]">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                <input
                  v-model="registerForm.diaChi"
                  type="text"
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                  placeholder="Ninh Kiều, Cần Thơ"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Điện thoại</label>
                <input
                  v-model="registerForm.dienThoai"
                  type="text"
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                  placeholder="09xxxxxxxx"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                placeholder="email@example.com"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                placeholder="••••••••"
              >
            </div>
          </template>

          <template v-else-if="mode === 'login'">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email / Mã độc giả / Mã nhân viên</label>
              <input
                v-model="loginForm.email"
                type="text"
                required
                class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                placeholder="email@example.com hoặc DG001 hoặc NV001"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                placeholder="••••••••"
              >
            </div>

            <div class="flex justify-end">
              <button
                type="button"
                @click="openForgotPassword"
                class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>
          </template>

          <template v-else>
            <div v-if="forgotStep === 1">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email tài khoản</label>
              <input
                v-model="forgotForm.email"
                type="email"
                required
                class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                placeholder="email@example.com"
              >
            </div>

            <template v-else>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  v-model="forgotForm.email"
                  type="email"
                  readonly
                  class="w-full px-5 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-700"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Mã xác nhận</label>
                <input
                  v-model="forgotForm.code"
                  type="text"
                  required
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700 tracking-[0.3em]"
                  placeholder="123456"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  v-model="forgotForm.newPassword"
                  type="password"
                  required
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                  placeholder="••••••••"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
                <input
                  v-model="forgotForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                  placeholder="••••••••"
                >
              </div>
            </template>
          </template>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ submitButtonText }}
          </button>
        </form>

        <div class="mt-8 relative flex items-center justify-center border-t border-gray-200 pt-6">
          <span class="text-gray-500 text-sm text-center" v-if="mode === 'login'">
            Chưa có tài khoản?
            <button @click="switchMode('register')" class="text-blue-600 font-extrabold hover:underline ml-1 focus:outline-none">
              Tạo tài khoản
            </button>
          </span>

          <span class="text-gray-500 text-sm text-center" v-else-if="mode === 'register'">
            Đã có tài khoản?
            <button @click="switchMode('login')" class="text-blue-600 font-extrabold hover:underline ml-1 focus:outline-none">
              Đăng nhập
            </button>
          </span>

          <span class="text-gray-500 text-sm text-center" v-else>
            Nhớ lại mật khẩu rồi?
            <button @click="switchMode('login')" class="text-blue-600 font-extrabold hover:underline ml-1 focus:outline-none">
              Quay lại đăng nhập
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useToast } from '../utils/toast';

const { addToast } = useToast();

const isLoading = ref(false);
const mode = ref('login');
const forgotStep = ref(1);

const loginForm = ref({
  email: '',
  password: ''
});

const registerForm = ref({
  email: '',
  password: '',
  hoLot: '',
  ten: '',
  ngaySinh: '',
  phai: 'Nam',
  diaChi: '',
  dienThoai: ''
});

const forgotForm = ref({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
});

const getLandingByRole = (user) => {
  if (user?.role === 'admin') return '/admin/dashboard';
  if (user?.role === 'staff') return '/admin/thu-thu';
  return '/';
};

const pageTitle = computed(() => {
  if (mode.value === 'register') return 'Đăng Ký Độc Giả';
  if (mode.value === 'forgot') return forgotStep.value === 1 ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu';
  return 'Mừng Trở Lại!';
});

const pageDescription = computed(() => {
  if (mode.value === 'register') {
    return 'Email là bắt buộc, mã độc giả sẽ được hệ thống tự tạo. Tài khoản nội bộ staff/admin do quản lý tạo.';
  }
  if (mode.value === 'forgot') {
    return forgotStep.value === 1
      ? 'Nhập email để hệ thống gửi mã xác nhận.'
      : 'Nhập mã vừa nhận trong email và mật khẩu mới.';
  }
  return 'Đăng nhập bằng email, mã độc giả hoặc mã nhân viên';
});

const submitButtonText = computed(() => {
  if (isLoading.value) return 'Đang xử lý...';
  if (mode.value === 'register') return 'ĐĂNG KÝ ĐỘC GIẢ';
  if (mode.value === 'forgot') return forgotStep.value === 1 ? 'GỬI MÃ XÁC NHẬN' : 'ĐẶT LẠI MẬT KHẨU';
  return 'ĐĂNG NHẬP';
});

const resetForgotForm = () => {
  forgotStep.value = 1;
  forgotForm.value = {
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  };
};

const switchMode = (newMode) => {
  mode.value = newMode;
  if (newMode !== 'forgot') {
    resetForgotForm();
  }
};

const openForgotPassword = () => {
  forgotForm.value.email = loginForm.value.email || '';
  mode.value = 'forgot';
  forgotStep.value = 1;
};

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    if (mode.value === 'login') {
      const response = await axios.post('http://localhost:3000/api/auth/login', loginForm.value);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      addToast(response.data.message, 'success');

      setTimeout(() => {
        window.location.href = getLandingByRole(response.data.user);
      }, 800);
    }

    if (mode.value === 'register') {
      const response = await axios.post('http://localhost:3000/api/auth/register', registerForm.value);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      addToast(response.data.message, 'success');

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }

    if (mode.value === 'forgot' && forgotStep.value === 1) {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', {
        email: forgotForm.value.email
      });

      addToast(response.data.message, 'success');
      forgotStep.value = 2;
    }

    if (mode.value === 'forgot' && forgotStep.value === 2) {
      if (forgotForm.value.newPassword !== forgotForm.value.confirmPassword) {
        addToast('Mật khẩu nhập lại không khớp!', 'error');
        return;
      }

      const currentEmail = forgotForm.value.email;

      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        email: forgotForm.value.email,
        code: forgotForm.value.code,
        newPassword: forgotForm.value.newPassword
      });

      addToast(response.data.message, 'success');
      resetForgotForm();
      mode.value = 'login';
      loginForm.value.email = currentEmail;
      loginForm.value.password = '';
    }
  } catch (error) {
    addToast(error.response?.data?.message || 'Có lỗi xảy ra!', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
