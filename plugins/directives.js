import Vue from 'vue'

Vue.directive('autofocus', {
  inserted: function(el) {
    el.focus();
  }
})

Vue.directive('no-submit', {
  inserted: function(button) {
    button.setAttribute('type', 'button');
  }
})
