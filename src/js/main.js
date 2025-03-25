// Axios
import axios from 'axios';
// IziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
// SimpleLightbox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let searchedText, currentPage = 1, totalPages;

const form = document.querySelector('.gallery-form');
const galleryList = document.querySelector('#gallery-list');
const loadMoreBtn = document.querySelector('#loadMoreBtn');

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

const searchPhotos = (search, page) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Search: ${search} | Page: ${page}`);

    if (page > totalPages) {
      currentPage = 1;
      page = 1;
    } else {
      searchedText = search;
      const pixabayApi = await axios.get("https://pixabay.com/api/", {
        params: {
          key: '49404317-b3e2234da46703b9b16558004',
          q: search,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: page,
          per_page: 100,
        }
      });

      totalPages = Math.ceil(parseFloat(pixabayApi.data.totalHits / pixabayApi.data.hits.length));
      console.log(`Searched Photo: ${searchedText} \nCurrent Page: ${currentPage} \nTotal Pages: ${totalPages}`);

      if (pixabayApi.data.hits.length === 0) {
        iziToast.error({
          position: 'topRight',
          color: 'red',
          message:
            'Sorry, there are no images matching your search query. Please, try again!',
        });
      }
      if (currentPage < totalPages) {
        loadMoreBtn.style.display = 'block';
      }

      resolve(pixabayApi);
    };
  });
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  currentPage = 1;
  loadMoreBtn.style.display = 'display';
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
    const responsedPhotos = await searchPhotos(search, currentPage);
    const photos = responsedPhotos.data.hits;
    galleryList.innerHTML = '';
    photos.forEach(photo => {
      galleryItem(photo);
    });
    galleryBox.refresh();
    e.target.reset();
  }
});

loadMoreBtn.addEventListener("click", async e => {
  currentPage++;
  const responsedPhotos = await searchPhotos(searchedText, currentPage);
  const photos = responsedPhotos.data.hits;

  photos.forEach(photo => {
    galleryItem(photo);
  });

  const galleryItemD = document.querySelector(".gallery img");
  if (galleryItemD) {
    const cardHeight = galleryItemD.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 3.85,
      behavior: 'smooth',
    });
  }

  galleryBox.refresh();

   if (currentPage === totalPages) {
    loadMoreBtn.removeEventListener("click", searchPhotos);
    iziToast.error({
      position: 'topRight',
      color: 'blue',
      message:
        "We're sorry, but you've reached the end of search results!",
    });
    loadMoreBtn.style.display = 'none';
  }

})