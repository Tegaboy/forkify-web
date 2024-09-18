import Views from './view.js';
import previewView from './previewView.js';

class ResultView extends Views {
  _parentElement = document.querySelector(`.results`);
  _errorMessage = 'Could not get receipes <br> Please try another query';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
