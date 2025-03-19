// Axios
import axios from 'axios';
// IziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
// SimpleLightbox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.gallery-form');
const gallery = document.querySelector('#appGallery');
const galleryList = document.querySelector('#gallery-list');

const galleryItem = photoInfo => {
    const item = document.createElement('li');
    item.classList.add('gallery-item');
    item.dataset.source = photoInfo.largeImageURL;

    const itemLink = document.createElement('a');
    itemLink.classList.add('gallery-link');
    itemLink.style.color = 'black';
    itemLink.href = photoInfo.largeImageURL;

    const img = document.createElement('img');
    img.src = photoInfo.webformatURL;
    img.alt = photoInfo.tags;
    img.width = 360;
    img.height = 200;

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    // Beğeniler
    const iLikeDiv = document.createElement('div');
    iLikeDiv.classList.add('info');

    const iLikeKey = document.createElement('h5');
    iLikeKey.classList.add('key');
    iLikeKey.textContent = 'Likes:';
    iLikeDiv.appendChild(iLikeKey);

    const iLikeValue = document.createElement('p');
    iLikeValue.classList.add('value');
    iLikeValue.textContent = photoInfo.likes;
    iLikeDiv.appendChild(iLikeValue);

    // Görüntülemeler
    const iViewsDiv = document.createElement('div');
    iViewsDiv.classList.add('info');

    const iViewsKey = document.createElement('h5');
    iViewsKey.classList.add('key');
    iViewsKey.textContent = 'Views:';
    iViewsDiv.appendChild(iViewsKey);

    const iViewsValue = document.createElement('p');
    iViewsValue.classList.add('value');
    iViewsValue.textContent = photoInfo.views;
    iViewsDiv.appendChild(iViewsValue);

    // Yorumlar
    const iCommentsDiv = document.createElement('div');
    iCommentsDiv.classList.add('info');

    const iCommentsKey = document.createElement('h5');
    iCommentsKey.classList.add('key');
    iCommentsKey.textContent = 'Comments:';
    iCommentsDiv.appendChild(iCommentsKey);

    const iCommentsValue = document.createElement('p');
    iCommentsValue.classList.add('value');
    iCommentsValue.textContent = photoInfo.comments;
    iCommentsDiv.appendChild(iCommentsValue);

    // İndirmeler
    const iDownloadsDiv = document.createElement('div');
    iDownloadsDiv.classList.add('info');

    const iDownloadsKey = document.createElement('h5');
    iDownloadsKey.classList.add('key');
    iDownloadsKey.textContent = 'Downloads:';
    iDownloadsDiv.appendChild(iDownloadsKey);

    const iDownloadsValue = document.createElement('p');
    iDownloadsValue.classList.add('value');
    iDownloadsValue.textContent = photoInfo.downloads;
    iDownloadsDiv.appendChild(iDownloadsValue);

    contentDiv.appendChild(iLikeDiv);
    contentDiv.appendChild(iViewsDiv);
    contentDiv.appendChild(iCommentsDiv);
    contentDiv.appendChild(iDownloadsDiv);

    itemLink.appendChild(img);
    item.appendChild(contentDiv);
    item.appendChild(itemLink);
    galleryList.appendChild(item);

}

let galleryBox = new SimpleLightbox('.gallery li > a', {
  captionsData: 'alt',
  captionDelay: 350,
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  galleryList.innerHTML = '';
  const search = e.target.elements.search.value;
  if (search === '') {
    iziToast.warning({
      position: 'topRight',
      message: 'Please enter a search query!',
    });
    return false;
  } else {
    const item = document.createElement('li');
    item.classList.add('gallery-item');

    const itemLoader = document.createElement('span');
    itemLoader.classList.add('loader');

    item.appendChild(itemLoader);
    item.style.textAlign = 'center';
    item.style.border = 'none';
    galleryList.appendChild(item);

    axios
      .get('https://pixabay.com/api/', {
        params: {
          key: '49404317-b3e2234da46703b9b16558004',
          q: search,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
        },
      })
      .then(response => {
        const photos = response.data.hits;
        galleryList.innerHTML = '';
        if (photos.length === 0) {
          iziToast.error({
            position: 'topRight',
            color: 'red',
            message:
              'Sorry, there are no images matching your search query. Please, try again!',
          });
        } else {
          photos.forEach(photo => {
            galleryItem(photo);
          });
          galleryBox.refresh();
        }
      })
      .catch(error => {
        iziToast.error({
          position: 'topRight',
          color: 'red',
          message: error.message,
        });
        galleryList.innerHTML = '';
        console.error("Pixabay error: ", error);
      });
    e.target.reset();
  }
});