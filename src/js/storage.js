import { showMessage } from './helpers';

export const initialFormData = {
  searchValue: '',
  selectedCategory: '',
};
export const formStorage = {
  formData: { ...initialFormData },
};

export function setDataToLS(key, data) {
  const jsonObj = JSON.stringify(data);
  localStorage.setItem(key, jsonObj);
}

export function getDataFromLS(key, defaultValue = {}) {
  const jsonData = localStorage.getItem(key);
  try {
    return jsonData ? JSON.parse(jsonData) : defaultValue;
  } catch (error) {
    console.warn('Failed to parse localStorage:', error);
    showMessage({ message: error.message, type: 'error' });
    return defaultValue;
  }
}

export function removeDataFromLS(key) {
  localStorage.removeItem(key);
}
