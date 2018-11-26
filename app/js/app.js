/**
 * App.js
 */

import Vue  from "vue"
import Vuex from "vuex"

// FastClick init
import FastClick from "fastclick"
FastClick(document.body)

import App from "./components/App.vue"

// Vue setup
if (process.env.NODE_ENV == "production") {

	Vue.config.silent        = true
	Vue.config.devtools      = false
	Vue.config.productionTip = false
}

let init = () => {

	// Store
	Vue.use(Vuex)

	const store = {
		state    : {},
		mutations: {}
	}

	// new app instance
	new Vue({
		el    : '#app',
		store : new Vuex.Store(store),
		render: h => h(App)
	})
}
init()
