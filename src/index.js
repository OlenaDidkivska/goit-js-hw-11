import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios');
import { fetchPhoto } from './fetchPhoto';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('div.gallery');
const info = document.querySelectorAll('.gallery .info');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;

async function onSearchBtn(e) {
  e.preventDefault();
  const inputEl = e.target.elements.searchQuery.value;

  if (inputEl) {
    fetchPhoto(inputEl, page)
      .then(renderPhotoCard)
      .catch(error => {
        console.log(error);
      });
  } else {
    gallery.textContent = '';
    onFetchError();
  }
}

async function renderPhotoCard(photo) {
  const images = photo.hits;
  if (photo.hits.length === 0) {
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

  gallery.innerHTML = marcup;

  if (marcup !== '') {
    page += 1;
    console.log(page);
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

// function checkPosition() {
//   const height = document.body.offsetHeight;
//   const screenHeight = window.innerHeight;
//   const scrolled = window.scrollY;
//   const threshold = height - screenHeight / 4;
//   const position = scrolled + screenHeight;

//   if (position >= threshold) {
//     fetchPhoto();
//   }
// }

info.forEach(element => (element.style.display = 'flex'));

form.addEventListener('submit', onSearchBtn);
loadMoreBtn.addEventListener('click', onLoadMore);
