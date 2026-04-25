import { createRouter, createWebHistory } from 'vue-router';
import BookList from './components/BookList.vue';
import AddBook from './components/AddBook.vue';
import Auth from './components/Auth.vue';
import BookDetail from './components/BookDetail.vue';
import History from './components/History.vue';
import Dashboard from './components/Dashboard.vue';
import Publisher from './components/Publisher.vue';
import Category from './components/Category.vue';
import Librarian from './components/Librarian.vue';
import Explore from './components/Explore.vue';
import StaffManagement from './components/StaffManagement.vue';

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

const getInternalLanding = (user) => {
  if (!user) return '/auth';
  if (user.role === 'admin') return '/admin/dashboard';
  if (user.role === 'staff') return '/admin/thu-thu';
  return '/';
};

const routes = [
  { path: '/', name: 'Home', component: BookList },
  { path: '/kham-pha', name: 'Explore', component: Explore },
  { path: '/sach/:id', name: 'BookDetail', component: BookDetail },
  { path: '/lich-su', name: 'History', component: History, meta: { requiresAuth: true, roles: ['docgia'] } },
  { path: '/auth', name: 'Auth', component: Auth },

  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/thu-thu', name: 'Librarian', component: Librarian, meta: { requiresAuth: true, roles: ['staff', 'admin'] } },
  { path: '/admin/them-sach', name: 'AddBook', component: AddBook, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/nxb', name: 'Publisher', component: Publisher, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/the-loai', name: 'Category', component: Category, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/nhan-vien', name: 'StaffManagement', component: StaffManagement, meta: { requiresAuth: true, roles: ['admin'] } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = getUserFromStorage();
  const roles = to.meta?.roles;
  const requiresAuth = Boolean(to.meta?.requiresAuth);

  if (to.path === '/auth' && user) {
    return next(getInternalLanding(user));
  }

  if (requiresAuth && !user) {
    return next('/auth');
  }

  if (roles && roles.length > 0) {
    if (!user) {
      return next('/auth');
    }

    if (!roles.includes(user.role)) {
      return next(getInternalLanding(user));
    }
  }

  next();
});

export default router;
