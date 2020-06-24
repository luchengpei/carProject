import Vue from 'vue'
import App from './App'


import store from './store'
import Vuelidate from 'vuelidate'


import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false;

Vue.prototype.$store = store;

Vue.directive('anchor', {
	inserted: function(el, binding) {
		el.onclick = function() {
			document.documentElement.scrollTop = $('#anchor-' + binding.value).offset().top
		}
	}
})

App.mpType = 'app';

const app = new Vue({
	store,
	...App
});
Vue.use(Vuelidate);
app.$mount();
