import App from './app.js';
// import config from './config.json';

$.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler()
      }
    }
  }

const config = {};
if (config.beta) {
    document.body.classList.add('beta');
}

var cfg = Object.assign({}, config);
window.app = new App({ config: cfg });
window.app.start();
