import icons from 'url:../../img/icons.svg';
import Views from './view';

class PaginationView extends Views {
  _parentElement = document.querySelector(`.pagination`);

  addEventHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    const curPage = this._data.page;

    const prevBtn = function (curPg) {
      const page = curPg - 1;
      const html = `
        <button class="btn--inline pagination__btn--prev" data-goto="${page}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page}</span>
        </button>
      `;

      return html;
    };

    const nextBtn = function (curPg) {
      const page = curPg + 1;
      const html = `
       <button class="btn--inline pagination__btn--next" data-goto="${page}">
          <span>Page ${page}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
       </button>
      `;

      return html;
    };

    // page 1 others
    if (numPages > curPage && curPage === 1) {
      return nextBtn(curPage);
    }
    // last page
    if (numPages === curPage && curPage > 1) {
      return prevBtn(curPage);
    }
    // other
    if (numPages > curPage && curPage > 1) {
      return prevBtn(curPage) + nextBtn(curPage);
    }
    // only 1
    return '';
  }
}

export default new PaginationView();
