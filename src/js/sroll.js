import { pagination } from './pagination';
import refs from './refs';

export function smoothScrollAfterLoad() {
  const productsList = refs.productsListEl;
  if (!productsList?.children.length) return;

  let previousCount = productsList.children.length - pagination.limit;
  previousCount = Math.max(0, previousCount);

  const firstNewCard = productsList.children[previousCount];
  const secondNewCard =
    productsList.children[previousCount + 1] || firstNewCard;

  if (!firstNewCard) return;

  const firstHeight = firstNewCard?.offsetHeight || 0;
  const secondHeight = secondNewCard?.offsetHeight || 0;

  const style = getComputedStyle(productsList);
  const gap = parseFloat(style.gap) || 0;

  const scrollDistance = firstHeight + secondHeight + gap;

  window.scrollBy({
    top: scrollDistance,
    behavior: 'smooth',
  });
}
