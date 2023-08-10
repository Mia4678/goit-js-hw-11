import axios from 'axios';

    const PIXABAY_API_KEY = '38752753-3e559f3e5f741918923bcfb47';
    const BASE_URL = 'https://pixabay.com/api/';
    const ITEMS_PER_PAGE = 40;

    export async function searchImages(query, page) {
    const response = await axios.get(BASE_URL, {
        params: {
      key: PIXABAY_API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: ITEMS_PER_PAGE,
      page: page,
    },
  });

  return response.data.hits;
}