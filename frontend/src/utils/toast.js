import { ref } from 'vue';

export const toasts = ref([]);

export const useToast = () => {
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) toasts.value.splice(index, 1);
  };

  return { addToast, removeToast };
};
