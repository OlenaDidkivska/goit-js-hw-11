const axios = require('axios');
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhoto } from './fetchPhoto';

document.cookie = 'Lax';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('div.gallery'),
  request: document.querySelector('input'),
};

const { form, gallery, request } = refs;

let page = 1;
const perPage = 40;

async function onSearchBtn(e) {
  e.preventDefault();
  gallery.textContent = '';

  if (!request.value) {
    onFetchError();
    return;
  }

  fetchPhoto(request.value, (page = 1), perPage)
    .then(renderPhotoCard)
    .then(notificationTotalHits)
    .catch(error => {
      console.log(error);
    });

  return;
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
    fetchPhoto(request.value, page, perPage)
      .then(checkPhotoList)
      .then(reachedTheEnd)
      .catch(error => {
        console.log(error);
      });
  }

  return;
}

function checkPhotoList(images) {
  if (images.hits.length !== 0) {
    renderPhotoCard(images);
    scrollBy();
  }
  return images;
}

function scrollBy() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  return;
}

form.addEventListener('submit', onSearchBtn);
window.addEventListener('scroll', onScroll);

function onFetchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  return;
}

function reachedTheEnd(photo) {
  if (page * perPage > photo.totalHits) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    ),
      window.removeEventListener('scroll', onScroll);
    return;
  }
}
