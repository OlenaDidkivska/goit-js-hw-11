import { fetchPhoto } from './fetchPhoto';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

function onSearchBtn(e) {
  e.preventDefault();
  const inputEl = e.target.elements.searchQuery.value;

  fetchPhoto(inputEl)
    .then(renderPhotoCard)
    .catch(error => {
      console.log(error);
    });

  //   if (inputEl) {
  //     fetchPhoto(inputEl).then(verificationInfo).catch(onFetchError);
  //   } else {
  //     clearTextContent();
  //   }
}

async function renderPhotoCard(photo) {
  const marcup = await photo.hits.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      acc +
      `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`,
    ''
  );
  return (gallery.innerHTML = await marcup);
}

form.addEventListener('submit', onSearchBtn);
