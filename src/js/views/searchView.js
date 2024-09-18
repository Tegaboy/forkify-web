class RenderSearchs {
  _parentElement = document.querySelector('.search');

  getQuery() {
    let query = this._parentElement.querySelector(`.search__field`).value;
    if (query === '') query = '_';
    this._clearInput();
    return query;
  }

  addEventHandler(control) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      control();
    });
  }

  _clearInput() {
    this._parentElement.querySelector(`.search__field`).value = '';
  }
}

export default new RenderSearchs();
