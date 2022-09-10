export async function fetchPhoto(title) {
  return await fetch(
    `https://pixabay.com/api/?key=29843828-e519b5089d649383ab6008921&q=${title}&image_type=photo&orientation=horizontal&safesearch=true&webformatURL`
  ).then(async responce => await responce.json());
}
