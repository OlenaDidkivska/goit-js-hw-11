import axios from 'axios';

const BASE_URL = 'https://pixabay.com';
export async function fetchPhoto(title, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/?key=29843828-e519b5089d649383ab6008921`,
      {
        params: {
          q: `${title}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: `${page}`,
        },
      }
    );
    const photoItems = response.data;
    console.log(`GET: Here's the list of todos`, photoItems);
    return photoItems;
  } catch (errors) {
    console.error(errors);
  }
}
