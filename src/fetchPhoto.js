import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29843828-e519b5089d649383ab6008921';
export async function fetchPhoto(title, page) {
  try {
    const response = await axios.get(`${BASE_URL}?`, {
      params: {
        key: `${KEY}`,
        q: `${title}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: `${page}`,
      },
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
}
