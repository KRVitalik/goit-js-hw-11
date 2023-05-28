
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import "normalize.css"

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "36591536-01f29463e86e1d04773412779";
const searchParams = new URLSearchParams({
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40,
});
let page = 1;
let id = '';
const input = document.querySelector("#search-form");
const galleryItems = document.querySelector(".gallery");
const btnLoadMore = document.querySelector(".load-more");
const btnSearch = input.elements[1];

Notiflix.Notify.init({
    position: 'center-center',
    showOnlyTheLastOne: true,
})

const lightbox = new SimpleLightbox('.gallery a');
lightbox.on('show.simplelightbox');

input.addEventListener('input', isInputValue)
function isInputValue() {
    if (input.elements[0].value === '') {
        return
    } else
        btnSearch.addEventListener('click', sendRequest)
        btnLoadMore.addEventListener('click', nextPage)
}
    
let options = {
    root: null,
    rootMargin: '450px',
    threshold: 1.0
}

const observer = new IntersectionObserver(onLoad, options);
function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      nextPage()
  }
    })
}

function sendRequest(e) {
    e.preventDefault();
    galleryItems.innerHTML = '';
    id = input.elements[0].value;
  page = 1;
        bodyColor()
    getImages(id);
}

async function getImages() {
    try {
        const URL = `${BASE_URL}?key=${API_KEY}&${searchParams}&page=${page}&q=${id}`
        const response = await axios.get(`${URL}`);
        const { data: { hits } } = response
        createMarkup(hits)
        galleryItems.insertAdjacentHTML('beforeend', createMarkup(hits))
      lightbox.refresh();
      observer.observe(btnLoadMore)
        smoothScrolling()
        // btnLoadMore.style.visibility="visible"
        notification(response)

      input.elements[0].value = ''
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(hits) {
    return hits.map(arr => {
         return `<div class="photo-card">
    <a class="gallery__link" href="${arr.largeImageURL}">
    <img class="gallery__image" src="${arr.webformatURL}" alt="${arr.tags}" loading="lazy" />
    </a>
    <div class="info">
     <p class="info-item">
       <b>Likes</b>${arr.likes}
     </p>
     <p class="info-item">
       <b>Views</b>${arr.views}
     </p>
     <p class="info-item">
       <b>Comments</b>${arr.comments}
     </p>
     <p class="info-item">
       <b>Downloads</b>${arr.downloads}
     </p>
   </div>
</div>`
    }).join('')
}

function nextPage() {
    page += 1
    getImages(page)
}

function notification(arr) {
  const arrLength = arr.data.hits.length
  let totalPages = arr.data.totalHits / searchParams.get("per_page")
    if (arrLength === 0) {
        Notiflix.Notify.failure(`Sorry, there are no images matching your search "${input.elements[0].value}". Please try again.`);
    } else if (Math.ceil(totalPages) === page) {
      observer.unobserve(btnLoadMore)
        btnLoadMore.style.visibility="hidden"
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    } else if(page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${arr.data.totalHits} images.`);
    }
}

function smoothScrolling() {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 0.3,
  behavior: "smooth",
});
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0)}`;
}

function bodyColor() {
    const body = document.querySelector('body')
  body.style.backgroundImage = `linear-gradient(90deg,
      ${getRandomHexColor()},
      ${getRandomHexColor()},
      ${getRandomHexColor()}
    )`;
}