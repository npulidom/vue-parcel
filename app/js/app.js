/**
 * App.js
 */

// FastClick init
import FastClick from "fastclick"

import Vue  from "vue"
import Vuex from "vuex"

import App from "./components/App.vue"

// Vue setup
if (process.env.NODE_ENV == "production") {

	Vue.config.silent        = true
	Vue.config.devtools      = false
	Vue.config.productionTip = false
}

let init = () => {

	// FastClick
	FastClick(document.body)

	// Store
	Vue.use(Vuex)

	const store = {
		state    : {},
		mutations: {}
	}

	// New app instance
	new Vue({
		el    : '#app',
		store : new Vuex.Store(store),
		render: h => h(App)
	})
}
init()
