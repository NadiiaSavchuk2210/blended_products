import refs from './refs';

//! Event Listeners ======================================================
refs.closeModalBtnEl.addEventListener('click', closeModal);
refs.modalEl.addEventListener('click', handleBackdropClick);

//! Handlers======================================================
export function openModal() {
  refs.modalEl.classList.add('modal--is-open');
  document.addEventListener('keydown', handleEscKeydown);
}

export function closeModal() {
  refs.modalEl.classList.remove('modal--is-open');
  document.removeEventListener('keydown', handleEscKeydown);
}

function handleEscKeydown(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

function handleBackdropClick(e) {
  if (e.target === refs.modalEl) {
    closeModal();
  }
}
