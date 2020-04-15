import './styles.css';
import 'material-design-icons/iconfont/material-icons.css';
import apiService from './js/apiService';
import imageCardTemplate from './templates/imageCardTemplate.hbs';
import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
// import * as basicLightbox from 'basiclightbox';
// import 'basiclightbox/dist/basicLightbox.min.css';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import InfiniteScroll from 'infinite-scroll';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  query: document.querySelector('input[name="query"]'),
  // loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', handleInputForm);
// refs.loadMoreBtn.addEventListener('click', fetchImages);
// refs.gallery.addEventListener('click', showImage);

// function handleInputForm(e) {
//   e.preventDefault();
//   clearList();
//   apiService.resetPage();
//   apiService.searchQuery = refs.query.value;
//   fetchImages();
//   modul();
//   refs.loadMoreBtn.classList.add('js-btn-visibil');
// }

// function fetchImages() {
//   apiService
//     .fetchImages()
//     .then(hits => {
//       createElement(hits);
//     })
//     .then(() => scroll())
//     .catch(() => {
//       PNotify.error({
//         title: 'Oh No!',
//         text: 'Something terrible happened.',
//       });
//     });
// }

// function createElement(items) {
//   const newList = items.map(item => imageCardTemplate(item)).join('');
//   refs.gallery.insertAdjacentHTML('beforeend', newList);
// }

// function clearList() {
//   refs.gallery.innerHTML = '';
//   refs.loadMoreBtn.classList.remove('js-btn-visibil');
// }

// function scroll() {
//   window.scrollTo({
//     top: document.body.scrollHeight,
//     behavior: 'smooth',
//   });
// }

// function modul() {
//   const success = PNotify.success({
//     title: 'Desktop Success',
//     text: 'All done! Come back to my tab!',
//     modules: {
//       Buttons: {
//         closer: false,
//         sticker: false,
//       },
//       Desktop: {
//         desktop: true,
//       },
//     },
//   });
//   success.on('click', function () {
//     success.close();
//   });
// }

// function showImage(e) {
//   if (e.target.nodeName === 'IMG') {
//     const largImg = e.target.dataset.url;
//     basicLightbox
//       .create(
//         `
//     	<img width="1200" height="900" src="${largImg}">
//     `,
//       )
//       .show();
//   }
// }

const masonryInstance = new Masonry(refs.gallery, {
  columnWidth: '.photo-card',
  itemSelector: '.photo-card',
  percentPosition: true,
  transitionDuration: '0.3s',
  fitWidth: true,
  gutter: 10,
});

const infScroll = new InfiniteScroll(refs.gallery, {
  responseType: 'text',
  history: false,
  path() {
    console.log('path', apiService.getsearchQuery());
    return `https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${apiService.query}&page=${this.pageIndex}&per_page=12&key=16013941-0b7abfb5c3f07bad798dbf718`;
  },
  append: '.photo-card',
  outlayer: masonryInstance,
});
imagesLoaded(refs.gallery).on(
  'progress',
  masonryInstance.layout.bind(masonryInstance),
);

function handleInputForm(e) {
  e.preventDefault();
  clearList();
  apiService.resetPage();
  infScroll.pageIndex = 1;
  infScroll.option({
    path() {
      console.log(apiService.fetchImages('cat'));
      return apiService.fetchImages('cat');
    },
  });
  // `https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${apiService.query}&page=${
  //   this.pageIndex
  // }&per_page=12&key=16013941-0b7abfb5c3f07bad798dbf718`
  apiService.setsearchQuery(refs.query.value);
  fetchImages();
  infScroll.loadNextPage();
}

function fetchImages() {
  apiService
    .fetchImages()
    .then(hits => {
      createElement(hits);
    })
    .catch(() => {
      PNotify.error({
        title: 'Oh No!',
        text: 'Something terrible happened.',
      });
    });
}

infScroll.on('load', (response, url) => {
  // createElement(items)
  // console.dir(response.hits);
  // console.log(url);
});

function createElement(items) {
  const newList = items.reduce((arr, item) => {
    const div = document.createElement('div');
    div.classList.add('photo-card');
    div.innerHTML = imageCardTemplate(item);
    arr.push(div);
    return arr;
  }, []);
  refs.gallery.append(...newList);
  masonryInstance.addItems(newList);
  imagesLoaded(refs.gallery).on(
    'progress',
    masonryInstance.layout.bind(masonryInstance),
  );
}

function clearList() {
  refs.gallery.innerHTML = '';
}
