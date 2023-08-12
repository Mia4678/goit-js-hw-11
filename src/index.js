import { searchImages } from './pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elements = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

let currentPage = 1;
let currentSearchQuery = '';

elements.form.addEventListener('submit', async e => {
  e.preventDefault();
  currentPage = 1;
  currentSearchQuery = e.target.searchQuery.value.trim();

  if (!currentSearchQuery) {
   hideImageGallery();
   hideLoadMoreButton();
  return;
  } else {
    showLoadMoreButton();
    showImageGallery();
  }

  try {
    const images = await searchImages(currentSearchQuery, currentPage);
    displayImages(images);
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

elements.loadMoreButton.addEventListener('click', async () => {
  try {
    currentPage++;
    const images = await searchImages(currentSearchQuery, currentPage);
    displayImages(images);
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching more images:', error);

  }
});


function displayImages(images) {
  if (images.length === 0) {
    hideImageGallery();
    hideLoadMoreButton();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } 
  const imageGallery = new ImageGallery(images, elements.gallery);
  imageGallery.append();

}

class ImageGallery {
  constructor(images, galleryElement) {
    this.images = images;
    this.galleryElement = galleryElement;
  }

  render() {
    const imageCards = this.images
      .map(image => this.createImageCard(image))
      .join('');
    this.galleryElement.innerHTML = imageCards;
  }

  append() {
    const imageCards = this.images
      .map(image => this.createImageCard(image))
      .join('');
    this.galleryElement.innerHTML += imageCards; // Append new images to the existing gallery content
  }

  createImageCard(image) {
    const { webformatURL, tags, likes, views, comments, downloads } = image;

    return `
        <div class="photo-card">
          <a href="${webformatURL}" data-lightbox="gallery"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="250" /></a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${downloads}
            </p>
          </div>
        </div>
      `;
  }
}
const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

function showLoadMoreButton() {
  elements.loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
    elements.loadMoreButton.style.display = 'none'; // Приховати кнопку
}

function hideImageGallery () {
  elements.gallery.style.display = 'none';
}

function showImageGallery () {
  elements.gallery.style.display = 'flex';
}

