import axios from 'axios';

const API_KEY = '51769269-403519ddb75627d5d460176b7';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, currentPage) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: PER_PAGE,
    },
  });

  return response.data;
}
