import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
// import { getJson, sendJson } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const recipeConstructor = function (data) {
  const { recipe } = data.data;

  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = recipeConstructor(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.isBookmarked = true;
    else state.recipe.isBookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.result = data.recipes.map(rec => {
      return {
        id: rec.id,
        imageUrl: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = 1) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = ing.quantity * (newServings / state.recipe.servings))
  );

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.isBookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const addRecipeUpload = async function (recipe) {
  try {
    const ingredients = Object.entries(recipe)
      .filter(
        entries => entries[0].startsWith('ingredient') && entries[1] !== ''
      )
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split('-');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format!\nPlease use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const newRecipe = {
      cooking_time: +recipe.cookingTime,
      image_url: recipe.image,
      ingredients,
      publisher: recipe.publisher,
      servings: +recipe.servings,
      source_url: recipe.sourceUrl,
      title: recipe.title,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, newRecipe);

    state.recipe = recipeConstructor(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
