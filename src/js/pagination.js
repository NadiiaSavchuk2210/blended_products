const paginationInitState = {
  page: 1,
  limit: 12,
  skip: 0,
  total: 0,
  totalPages: 0,
};

export let pagination = { ...paginationInitState };

export function updatePagination({ page, total, reset = false } = {}) {
  if (reset) {
    pagination = { ...paginationInitState };
    return;
  }
  if (typeof page === 'number' && page > 0) {
    pagination.page = page;
  }
  if (typeof total === 'number' && total >= 0) {
    pagination.total = total;
    pagination.totalPages = Math.ceil(pagination.total / pagination.limit);
  }
}
