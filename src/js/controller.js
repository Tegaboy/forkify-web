import * as model from './module.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/pagination.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_TIME_OUT } from './config.js';
import 'regenerator-runtime/runtime';
import 'core-js/stable';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlView = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultView.update(model.getSearchResultPage());

    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    // searchView.renderSpinner();
    await model.loadSearchResult(query);

    resultView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (err) {
    resultView.renderError();
    console.error(err);
  }
};

const controlPagination = function (page) {
  resultView.render(model.getSearchResultPage(page));

  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.isBookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);

  console.log(model.state.recipe);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlRecipeUploead = async function (data) {
  try {
    addRecipeView.renderSpinner();

    await model.addRecipeUpload(data);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    setTimeout(() => {
      addRecipeView.removeWindow();
    }, MODAL_TIME_OUT * 1000);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addEventHandler(controlView);

  recipeView.addEventHandlerServings(controlServings);

  recipeView.addEventHandlerBookMark(controlAddBookmark);

  searchView.addEventHandler(controlSearchResult);

  paginationView.addEventHandler(controlPagination);

  addRecipeView.addHandlerUpload(controlRecipeUploead);
};

init();
