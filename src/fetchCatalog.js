const BASE_URL = "https://restcountries.com/v3.1/";
const ENDPOINT = 'name/'
const options = '?fields=name,capital,population,flags,languages'

export function fetchCatalog(name) {
    return fetch(`${BASE_URL}${ENDPOINT}${name}${options}`).then(
        (resp) => {
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.json()
        });
}