import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  lightbox,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  formEl: document.querySelector('.form'),
  ulElem: document.querySelector('.gallery'),
  loaderMoreBtn: document.querySelector('.btn'),
};

let currentQuery = '';
let currentPage;
let maxPage = 0;
let perPage = 15;

refs.formEl.addEventListener('submit', async e => {
  e.preventDefault();

  currentPage = 1;
  showLoader();

  currentQuery = e.target.elements['search-text'].value.trim();

  if (!currentQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Please fill in the field',
      position: 'topRight',
      color: 'red',
    });
    hideLoader();
    return;
  }

  try {
    const res = await getImagesByQuery(currentQuery, currentPage);
    clearGallery();
    if (res.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'Nothing found for your query.',
        position: 'topRight',
      });
      hideLoader();
      return;
    }

    const markup = createGallery(res.hits);
    refs.ulElem.innerHTML = markup;

    lightbox.refresh();
    maxPage = Math.ceil(res.totalHits / perPage);
  } catch (error) {
    console.error(error);
    maxPage = 0;
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong!',
      position: 'topRight',
      color: 'red',
    });
  }

  checkBtnVisibleStatus();
  showNotification();
  hideLoader();
  e.target.reset();
});

refs.loaderMoreBtn.addEventListener('click', async () => {
  currentPage += 1;

  showLoader();
  checkBtnVisibleStatus();
  showNotification();

  try {
    const res = await getImagesByQuery(currentQuery, currentPage);
    const markup = createGallery(res.hits);
    refs.ulElem.insertAdjacentHTML('beforeend', markup);

    const cardHeight =
      refs.ulElem.firstElementChild?.getBoundingClientRect().height || 300;

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    lightbox.refresh();
  } catch {
    iziToast.error({
      title: `Error`,
      message: `Error`,
      position: 'topRight',
      color: `red`,
    });
  }

  hideLoader();
});

function checkBtnVisibleStatus() {
  if (currentPage < maxPage) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
  }
}

function showNotification() {
  if (currentPage === 1 && maxPage !== 0) {
    iziToast.info({
      title: `Info`,
      message: `MaxPage - ${maxPage}`,
      position: 'topRight',
    });
  } else if (maxPage === 0) {
    iziToast.info({
      title: `Info`,
      message: `Nothing found`,
      position: 'topRight',
    });
  } else if (currentPage === maxPage) {
    iziToast.info({
      title: `Info`,
      message: `This is the last page`,
      position: 'topRight',
    });
  }
}
