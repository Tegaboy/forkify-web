import Views from './view.js';

class AddRecipeView extends Views {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindows();
    this._addHandlercloseWindows();
  }

  _addWindow() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  removeWindow() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  _addHandlerShowWindows() {
    this._btnOpen.addEventListener('click', this._addWindow.bind(this));
  }

  _addHandlercloseWindows() {
    this._btnClose.addEventListener('click', this.removeWindow.bind(this));

    this._overlay.addEventListener('click', this.removeWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
}

export default new AddRecipeView();
