import './css/styles.css';
import { fetchCatalog } from './fetchCatalog.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const onInput = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
let placeholder = onInput.placeholder = 'Enter country';

onInput.addEventListener('input', debounce(onInputForm, DEBOUNCE_DELAY));

Notiflix.Notify.init({
    position: 'center-center',
    showOnlyTheLastOne: true,
})

function onInputForm() {
    isInputEmpty();
    fetchCatalog(onInput.value.trim())
        .then((data) => {
            isCountryOverTen(data);
            isOneCountry(data);
        })
        .catch((err) => {
            console.log(err);
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

    function createMarkup(arr) {
        return arr.map(({ flags, name }) => `<li>
        <img width='200px' src="${flags.svg}" alt="${flags.alt}" />
        <h2 id="flags">${name.official}</h2>
    </li>`).join('');
};

        function createMarkupInformation(arr) {
    return arr.map(({population, capital, languages}) =>`<p>Capital: ${capital}</p>
        <p>Population: ${population}</p><p>Languages: ${Object.values(languages).join(', ')}</p>`).join('')
};
