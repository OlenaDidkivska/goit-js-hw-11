import throttle from 'lodash.throttle';

import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios');
import { fetchPhoto } from './fetchPhoto';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('div.gallery');
const info = document.querySelectorAll('.gallery .info');
const request = document.querySelector('input');

let page = 1;

async function onSearchBtn(e) {
  e.preventDefault();

  if (request.value) {
    fetchPhoto(request.value, page)
      .then(renderPhotoCard)
      .catch(error => {
        console.log(error);
      });
  } else {
    gallery.textContent = '';
    onFetchError();
  }
}

async function renderPhotoCard(response) {
  const images = response.data.hits;
  console.log(response);
  console.log(images);

  if (images.length === 0) {
    onFetchError();
  }

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

  gallery.insertAdjacentHTML('beforeend', marcup);

  if (marcup !== '') {
    // console.log(page);
    Notiflix.Notify.info(`Hooray! We found ${photo.totalHits} images.`);
    gallery.innerHTML = await marcup;
    let lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      captionsData: 'alt',
    });
    return page;
  }
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  return;
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

info.forEach(element => (element.style.display = 'flex'));

// function onScroll() {
//   scrollBy();
//   if (
//     window.scrollY + window.innerHeight >=
//     document.documentElement.scrollHeight
//   ) {
//     fetchPhoto(request.value, page).then(response => {
//       if (response.hits.length === 0) {
//         Notify.warning('You have reached the end of the list');
//         window.removeEventListener('scroll', onScroll);
//         return;
//       } else {
//         renderPhotoCard(response);
//       }
//     });
//   }
// }

// function loadMore() {
//   return pixabayAPI.fetchImages(searchParams);
// }

async function checkPosition() {
  page += 1;
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    fetchPhoto(request.value, page).then(response => {
      console.log(response.hits);
      if (response.data.hits.length === 0) {
        window.removeEventListener('scroll', checkPosition);
        Notify.warning('You have reached the end of the list');
        return;
      } else {
        renderPhotoCard(response);
        scrollBy();
      }
    });
  }
}

form.addEventListener('submit', onSearchBtn);
window.addEventListener('scroll', throttle(checkPosition, 300));
