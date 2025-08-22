import { pagination } from './pagination';
import { getProductById } from './products-api';
import refs from './refs';
import { openModal } from './modal';
import { showMessage } from './helpers';

//Category ======================================================
const categoryItemTemplate = item => {
  return ` <li class="categories__item">
             <button class="categories__btn js-categories__btn" type="button">${item}</button>
           </li>
        `;
};

const categoryItemsTemplate = items =>
  items.map(categoryItemTemplate).join('\n');

export const createCategoryList = categories => {
  const markup = categoryItemsTemplate(categories);
  refs.categoryListEl.innerHTML = markup;
};

//Product ======================================================

const productItemTemplate = item => {
  const { id, thumbnail, title, brand = '', category, price } = item;

  return `<li class="products__item js-products__item" data-id="${id}">
            <img class="products__image" src="${thumbnail}" alt="${title}" loading="lazy" />
            <p class="products__title">${title}</p>
            ${
              brand
                ? `<p class="products__brand">
                  <span class="products__brand--bold">Brand: ${brand}</span>
              </p>`
                : ''
            }
            <p class="products__category">Category: ${category}</p>
            <p class="products__price">Price: ${price}$</p>
          </li>
        `;
};

const productItemsTemplate = items => items.map(productItemTemplate).join('\n');

export const createProductsList = products => {
  const markup = productItemsTemplate(products);
  if (pagination.page > 1) {
    refs.productsListEl.insertAdjacentHTML('beforeend', markup);
  } else {
    refs.productsListEl.innerHTML = markup;
  }
};

//ModalProduct ======================================================

export const modalProductTemplate = item => {
  const {
    title,
    tags,
    description,
    shippingInformation,
    returnPolicy,
    price,
    images,
  } = item;
  const image = images[0];

  const tagsMarkup = Array.isArray(tags) ? productTagsTemplate(tags) : '';

  return `<img class="modal-product__img" src="${image}" alt="${title}" loading="lazy" />
          <div class="modal-product__content">
            <p class="modal-product__title">${title}</p>
              <ul class="modal-product__tags">
                ${tagsMarkup}   
              </ul>
              <p class="modal-product__description">${description}</p>
              <p class="modal-product__shipping-information">Shipping: ${shippingInformation}</p>
              <p class="modal-product__return-policy">Return Policy: ${returnPolicy}</p>
              <p class="modal-product__price">Price: ${price} $</p>
              <button class="modal-product__buy-btn" type="button">Buy</button>
          </div>`;
};

function productTagTemplate(tag) {
  return `<li class="modal-product__tag">${tag}</li>`;
}

function productTagsTemplate(tags) {
  return tags.map(productTagTemplate).join('\n');
}

export async function renderModalProduct(id) {
  try {
    const product = await getProductById(id);
    const modalProduct = modalProductTemplate(product);
    refs.modalProductEl.innerHTML = modalProduct;
  } catch (error) {
    console.log(error.message);
    showMessage({ message: error.message, type: 'error' });
  }

  openModal();
}

// Loader and Loadmore button ======================================================

export const showLoader = () => {
  refs.loaderEl.classList.add('visible');
};

export const hideLoader = () => {
  refs.loaderEl.classList.remove('visible');
};

export const positionLoaderBottom = () => {
  refs.loaderEl.classList.add('load-more');
};

export const positionLoaderTop = () => {
  refs.loaderEl.classList.remove('load-more');
};

export const showLoadMoreButton = () => {
  refs.loadMoreBtnEl.classList.remove('is-hidden');
};

export const hideLoadMoreButton = () => {
  refs.loadMoreBtnEl.classList.add('is-hidden');
};
