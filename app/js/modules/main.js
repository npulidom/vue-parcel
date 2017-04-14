/**
 * Main Module
 */

import Vuex from "vuex";
import VueRouter from "vue-router";

import loader from "./loader.js";

export default {
    // module props
    name : "main",
    // initializer
    init() {

		//new router
		const router = new VueRouter({
			routes : loader.routes
		});

		//new vuex store
		const store = new Vuex.Store({
			state 	  : {
			},
			mutations : {
			}
		});

		//new app instance
		this.app = new Vue({
			store,
			router,
			data : {
			}
		})
		//mount app
		.$mount("#app");
    }
};
