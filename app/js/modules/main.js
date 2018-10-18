/**
 * Main Module
 */

import Vue       from "vue"
import Vuex      from "vuex"
import VueRouter from "vue-router"

import loader from "./loader.js"

export default {

	init() {

		this.setupEnvironment()

		// router
		Vue.use(VueRouter)

		const router = new VueRouter({ routes: loader.routes })

		// store
		Vue.use(Vuex)

		const store = new Vuex.Store({
			state 	 : {},
			mutations: {}
		})

		// app instance
		this.app = new Vue({
			store,
			router,
			data: {}
		})
		.$mount("#app")
	},

	setupEnvironment() {

		console.log("Main -> Environment:", process.env.NODE_ENV)

		if (process.env.NODE_ENV != "production")
			return

		Vue.config.silent        = true
		Vue.config.devtools      = false
		Vue.config.productionTip = false
	}
}
