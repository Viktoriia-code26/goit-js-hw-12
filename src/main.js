import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreButton = document.querySelector('.btn');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
const perPage = 15;

form.addEventListener('submit', async e => {
  e.preventDefault();

  const input = document.querySelector('input[name="search-text"]');
  currentQuery = input.value.trim();

  if (!currentQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query',
      position: 'topRight',
    });
    return;
  }

  currentPage = 1;
  showLoader();
  hideLoadMoreButton();
  document.querySelector('.end-message')?.remove();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    clearGallery();

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images.`,
      position: 'topRight',
    });

    if (currentPage * perPage < totalHits) {
      showLoadMoreButton();
    } else {
      showEndMessage();
    }
  } catch (error) {
    console.error('Error:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  loadMoreButton.disabled = true;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    window.scrollBy({
      top: 600,
      behavior: 'smooth',
    });

    if (currentPage * perPage >= totalHits) {
      hideLoadMoreButton();
      showEndMessage();
    }
  } catch (error) {
    console.error('Error:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadMoreButton.disabled = false;
  }
});
