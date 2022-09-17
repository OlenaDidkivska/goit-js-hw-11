const axios = require('axios');
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhoto } from './fetchPhoto';
import throttle from 'lodash.throttle';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('div.gallery'),
  request: document.querySelector('input'),
};

const { form, gallery, request } = refs;

let page = 1;

async function onSearchBtn(e) {
  e.preventDefault();

  if (!request.value) {
    gallery.textContent = '';
    onFetchError();
    return;
  }

  fetchPhoto(request.value, page)
    .then(renderPhotoCard)
    .then(notificationTotalHits)
    .catch(error => {
      console.log(error);
    });
}

function notificationTotalHits(photo) {
  Notiflix.Notify.success(`Hooray! We found ${photo.totalHits} images.`);
}

async function renderPhotoCard(photo) {
  if (photo.hits.length === 0) {
    onFetchError();
    return;
  }

  page += 1;

  const marcup = photo.hits.reduce(
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

  gallery.insertAdjacentHTML('beforeend', marcup);

  let lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
  });

  return photo;
}

function onScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    fetchPhoto(request.value, page)
      .then(checkPhotoList)
      .catch(error => {
        console.log(error);
      });
  }
}

function checkPhotoList(images) {
  if (images.hits.length === 0) {
    Notify.warning('You have reached the end of the list');
    window.removeEventListener('scroll', onScroll);
    return;
  } else {
    renderPhotoCard(images);
    scrollBy();
  }
}

function scrollBy() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

form.addEventListener('submit', onSearchBtn);
window.addEventListener('scroll', onScroll);

function onFetchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  return;
}
