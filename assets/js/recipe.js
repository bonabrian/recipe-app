const searchForm = document.querySelector('form');
const searchResultElem = document.querySelector('.results');
const infoElem = document.querySelector('#info');
const errorElem = document.querySelector('#error');
const RAPID_API_URL = 'https://recipe-puppy.p.rapidapi.com/';
const RAPID_API_HOST = 'recipe-puppy.p.rapidapi.com';
const RAPID_API_KEY = '56390d845emsh319e8c6b667ba41p1dc1b9jsn7d4f972316a8';
let searchQuery = '';

const setLoading = (loading) => {
  const loadingComponent = `
    <div class="box-loading">
      <div class="loading">
        <div class="loading__load">
          <div class="loading__load__animation">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="loading__load__text">please wait...</div>
        </div>
      </div>
    </div>
  `;
  if (loading) {
    infoElem.innerHTML = loadingComponent;
  } else {
    infoElem.innerHTML = '';
  }
};

const resetResults = () => {
  searchResultElem.innerHTML = '';
};

const showError = (message) => {
  errorElem.classList.remove('hide');
  errorElem.innerHTML = message;
};

const hideError = () => {
  errorElem.classList.add('hide');
  errorElem.innerHTML = '';
};

const generateResults = (results) => {
  let recipesHTML = '';
  if (results.length) {
    results.map((recipe) => {
      recipesHTML += `
      <div class="item">
        <div class="item__img">
          <img src="${(recipe.thumbnail != '' ? recipe.thumbnail : 'assets/img/empty.png')}" alt="${recipe.title}">
        </div>
        <div class="item__text">
          <div class="item__title">
            <h3>${recipe.title}</h3>
          </div>
          <p>Ingredients: ${recipe.ingredients}</p>
        </div>
      </div>
      `;
    });
  } else {
    showError('No data found.');
  }

  searchResultElem.innerHTML = recipesHTML;
};

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchQuery = encodeURIComponent(e.target.querySelector('input').value);
  if (!searchQuery || searchQuery == '') return;
  // Reset results
  resetResults();
  // Hide error
  hideError();

  fetchAPI();
});

async function fetchAPI() {
  setLoading(true);
  await fetch(RAPID_API_URL + `?p=1&q=${searchQuery}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPID_API_HOST,
      'x-rapidapi-key': RAPID_API_KEY
    }
  })
  .then(response => {
    if (!response.ok) {
      showError(response.statusText);
      return;
    }
    return response.json();
  })
  .then(json => {
    console.log(json);
    setLoading(false);
    const results = json.results;
    generateResults(results);
    console.log(json);
  })
  .catch(err => {
    setLoading(false);
    if (err == 'TypeError: Failed to fetch') {
      showError('Please check your internet connection, and try again.');
    } else {
      showError(err);
    }
  });
}
