import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://dummyjson.com',
});

export const getProductCategories = async () => {
  const res = await axios.get('/products/category-list');
  return ['all', ...res.data];
};

//!======================================================

export const getProducts = async (currentPage = 1) => {
  const params = createParams({ limit: 12, currentPage });
  const res = await axios.get('/products', { params });
  return res.data;
};

export const getProductsByCategory = async ({
  selectedCategory,
  currentPage = 1,
}) => {
  const params = createParams({ limit: 12, currentPage });
  const res = await axios.get(`/products/category/${selectedCategory}`, {
    params,
  });
  return res.data;
};

export const getProductById = async id => {
  const res = await axios.get(`/products/${id}`);
  return res.data;
};

export const getProductsBySearchValue = async ({ query, currentPage = 1 }) => {
  const params = createParams({ limit: 12, currentPage, q: query });
  const res = await axios.get(`/products/search`, { params });
  return res.data;
};

//!======================================================
function createParams({ limit, currentPage, ...rest }) {
  const skip = (currentPage - 1) * limit;
  return { ...rest, limit, skip };
}
