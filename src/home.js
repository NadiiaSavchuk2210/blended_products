//Логіка сторінки Home

import {
  handleCategoryBtnClick,
  handleDOMContentLoaded,
  handleFormElInput,
  handleProductElClick,
  handleSearchFormSubmit,
  handleLoadMoreBtnClick,
} from './js/handlers';
import { initFormState, resetForm } from './js/helpers';
import refs from './js/refs';

import debounce from 'debounce';
import { formStorage } from './js/storage';

initFormState(formStorage.formData);
//!======================================================
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
refs.categoryListEl.addEventListener('click', handleCategoryBtnClick);
refs.productsListEl.addEventListener('click', handleProductElClick);
refs.searchFormEl.addEventListener('input', debounce(handleFormElInput, 200));
refs.searchFormEl.addEventListener('submit', handleSearchFormSubmit);
refs.searchFormClearBtnEl.addEventListener('click', resetForm);
refs.loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
