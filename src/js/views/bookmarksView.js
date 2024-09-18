import Views from './view.js';
import previewView from './previewView.js';

class BookmarkView extends Views {
  _parentElement = document.querySelector(`.bookmarks__list`);
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();
