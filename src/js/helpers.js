import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { pagination, updatePagination } from './pagination';
import {
  getProductCategories,
  getProducts,
  getProductsByCategory,
  getProductsBySearchValue,
} from './products-api';
import refs from './refs';
import {
  createCategoryList,
  createProductsList,
  hideLoader,
  hideLoadMoreButton,
  positionLoaderTop,
  showLoader,
  showLoadMoreButton,
} from './render-function';
import { formStorage, getDataFromLS, removeDataFromLS } from './storage';
import { LS_KEYS } from './constants';
import { smoothScrollAfterLoad } from './sroll';

let { initialFormData, formData } = formStorage;

//! Load functions ======================================================
export async function loadAndRenderCategories() {
  try {
    const categories = await getProductCategories();
    createCategoryList(categories);
    const firstCategoryBtn = refs.categoryListEl.querySelector(
      '.js-categories__btn'
    );
    const isAllCategories = firstCategoryBtn.textContent === 'all';

    if (firstCategoryBtn && isAllCategories) {
      firstCategoryBtn.classList.add('categories__btn--active');
    }
  } catch (error) {
    console.log(error.message);
    showMessage({ message: error.message, type: 'error' });
  }
}

export async function loadAndRenderProducts({
  selectedCategory = '',
  currentPage = 1,
}) {
  let res;
  const isSelectedCategory = selectedCategory && selectedCategory !== 'all';

  try {
    if (isSelectedCategory) {
      res = await getProductsByCategory({
        selectedCategory,
        currentPage,
      });
    } else {
      res = await getProducts(currentPage);
    }

    updatePagination({ total: res.total, page: currentPage });
    renderProductsOrEmptyState(res.products);
    hideLoader();
  } catch (error) {
    console.log(error.message);
    showMessage({ message: error.message, type: 'error' });
  }
}

export async function loadAndRenderProductsByQuery({ searchValue }) {
  positionLoaderTop();
  showLoader();
  try {
    const res = await getProductsBySearchValue({
      query: searchValue,
      currentPage: pagination.page,
    });
    updatePagination({ total: res.total, page: pagination.page });
    showNotification(pagination);
    renderProductsOrEmptyState(res.products);
    hideLoader();
  } catch (error) {
    console.log(error.message);
    showMessage({ message: error.message, type: 'error' });
  }
}

//! Categories and products ======================================================

export function noProducts(products) {
  return products?.length === 0;
}

function renderProductsOrEmptyState(products) {
  if (noProducts(products)) {
    refs.productsListEl.innerHTML = '';
    refs.notFoundEl.classList.add('not-found--visible');
    hideLoadMoreButton();
    return;
  } else {
    refs.notFoundEl.classList.remove('not-found--visible');
    createProductsList(products);
    if (pagination.page > 1) {
      smoothScrollAfterLoad();
    }
    checkEndOfCollection();
  }
}

export function toggleActiveCategory({ targetEl, reset = false }) {
  const prevSelectedCategoryEl = document.querySelector(
    '.categories__btn--active'
  );

  if (prevSelectedCategoryEl) {
    prevSelectedCategoryEl.classList.remove('categories__btn--active');
    if (reset) return;
  }

  if (targetEl) {
    targetEl.classList.add('categories__btn--active');
  }
}

//! Form helpers ======================================================
export function updateSubmitState(formData) {
  refs.searchFormSubmitBtnEl.disabled = !isFormValid(formData);
}

export function isFormValid(data) {
  const searchText = data?.searchValue.trim() ?? '';
  return searchText.length > 0;
}

export function trimFormData(formDataObj) {
  return Object.fromEntries(
    Object.entries(formDataObj).map(([key, value]) => [key, value.trim()])
  );
}

export function resetForm() {
  refs.searchFormEl.reset();
  loadAndRenderProducts();
  formData = { ...initialFormData };
  formData.searchValue = '';
  removeDataFromLS(LS_KEYS.form);
  updateSubmitState();
}

export function initFormState(formData) {
  try {
    const savedFormData = getDataFromLS(LS_KEYS.form);
    if (savedFormData && typeof savedFormData === 'object') {
      Object.keys(formData).forEach(key => {
        formData[key] = savedFormData[key] || '';
      });
    }

    const searchTextInputEl = refs.searchFormEl.elements.searchValue;

    if (searchTextInputEl) {
      searchTextInputEl.value = formData.searchValue;
      updateSubmitState(formData);
    }
  } catch (error) {
    console.log(error);
    showMessage({ message: error.message, type: 'error' });
  }
}

// Pagination ======================================================
export function checkEndOfCollection() {
  const noMore = pagination.page >= pagination.totalPages;

  if (noMore) {
    hideLoadMoreButton();
    return;
  }
  showLoadMoreButton();
}

// Notification ======================================================
export function showNotification(pagination) {
  if (pagination.page === 1 && pagination.totalPages !== 0) {
    showMessage({ message: `Total pages: ${pagination.totalPages}` });
  } else if (pagination.totalPages === 0) {
    showMessage({ message: `Nothing found` });
  } else if (pagination.page === pagination.totalPages) {
    showMessage({ message: 'This is the last page' });
  }
}

export function showMessage({ message, type = 'info' }) {
  iziToast[type]({ message });
}
