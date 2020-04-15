const baseUrl = 'https://pixabay.com/api/';
const API_KEY = '16013941-0b7abfb5c3f07bad798dbf718';
export default {
  page: 1,
  query: '',
  fetchImages() {
    const params = `?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${API_KEY}`;

    return fetch(baseUrl + params)
      .then(response => response.json())
      .then(parsedResponse => {
        this.incrementPage();
        return parsedResponse.hits;
      });
  },
  getsearchQuery() {
    return this.query;
  },
  setsearchQuery(string) {
    this.query = string;
  },
  incrementPage() {
    this.page += 1;
  },
  resetPage() {
    this.page = 1;
  },
};
