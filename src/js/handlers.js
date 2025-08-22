import {
  checkEndOfCollection,
  isFormValid,
  loadAndRenderCategories,
  loadAndRenderProducts,
  loadAndRenderProductsByQuery,
  resetForm,
  showMessage,
  toggleActiveCategory,
  trimFormData,
  updateSubmitState,
} from './helpers';
import { pagination, updatePagination } from './pagination';
import refs from './refs';
import {
  hideLoader,
  hideLoadMoreButton,
  positionLoaderTop,
  renderModalProduct,
  showLoader,
} from './render-function';
import { formStorage, setDataToLS } from './storage';
import { LS_KEYS } from './constants';

let { formData, searchValue } = formStorage;
let { selectedCategory } = formData;

// Categories and products ======================================================
export async function handleDOMContentLoaded() {
  await loadAndRenderCategories();
  await loadAndRenderProducts({ currentPage: pagination.page });
}

export async function handleCategoryBtnClick(e) {
  positionLoaderTop();
  showLoader();

  if (!e.target.classList.contains('js-categories__btn')) return;
  searchValue = '';
  toggleActiveCategory({ targetEl: e.target });
  selectedCategory = e.target.textContent;
  await loadAndRenderProducts({
    selectedCategory,
    currentPage: 1,
  });
  updatePagination({ reset: true });
}

export function handleProductElClick(e) {
  const item = e.target.closest('.js-products__item');
  if (!item) return;
  renderModalProduct(item.dataset.id);
}

export async function handleLoadMoreBtnClick() {
  showLoader();

  updatePagination({ page: pagination.page + 1 });
  refs.loadMoreBtnEl.disabled = true;
  hideLoadMoreButton();

  try {
    if (searchValue) {
      await loadAndRenderProductsByQuery({
        searchValue,
      });
    } else {
      await loadAndRenderProducts({
        selectedCategory,
        currentPage: pagination.page,
      });
    }
  } catch (error) {
    console.log(error.message);
    showMessage({ message: error.message, type: 'error' });
  } finally {
    checkEndOfCollection();
    refs.loadMoreBtnEl.disabled = false;
    hideLoader();
  }
}

// Form input ======================================================
export function handleFormElInput(e) {
  const { name, value } = e.target;
  if (name in formData) {
    formData[name] = value;
    setDataToLS(LS_KEYS.form, formData);
  }

  updateSubmitState(formData);
}

//  Form submit ======================================================
export function handleSearchFormSubmit(e) {
  e.preventDefault();

  const trimmedFormData = trimFormData(formData);

  if (!isFormValid(trimmedFormData)) {
    updateSubmitState(trimmedFormData);
    return;
  }

  formData = { ...trimmedFormData };
  setDataToLS(LS_KEYS.form, formData);
  searchValue = formData.searchValue;

  updatePagination({ reset: true });
  loadAndRenderProductsByQuery({ searchValue });
  toggleActiveCategory({ reset: true });
  resetForm();
}
