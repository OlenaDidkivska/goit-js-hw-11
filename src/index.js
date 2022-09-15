import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios');
import { fetchPhoto } from './fetchPhoto';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('div.gallery');
const info = document.querySelectorAll('.gallery .info');

let page = 1;

async function onSearchBtn(e) {
  e.preventDefault();
  const inputEl = e.target.elements.searchQuery.value;

  if (inputEl) {
    fetchPhoto(inputEl)
      .then(renderPhotoCard)
      .catch(error => {
        console.log(error);
      });
  } else {
    gallery.textContent = '';
  }
}

async function renderPhotoCard(photo) {
  console.log(photo);
  const images = photo.hits;
  console.log(images);

  const marcup = images.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      acc +
      `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
    <img class = gallery__image src="${webformatURL}" alt="${tags}" loading="lazy"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
  </div></a>`,
    ''
  );

  gallery.innerHTML = marcup;

  // if (marcup === '') {
  //   page = 1;
  //   gallery.textContent = '';
  //   return Notiflix.Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  // } else {
  //   page += 1;
  //   Notiflix.Notify.info(`Hooray! We found ${photo.totalHits} images.`);
  //   return (gallery.innerHTML = await marcup);
  // }
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

info.forEach(element => (element.style.display = 'flex'));

form.addEventListener('submit', onSearchBtn);
