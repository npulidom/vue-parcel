/**
 * Router
 */

import { createRouter, createWebHistory } from 'vue-router'

// Views
import Home    from "./../components/Home.vue"
import Section from "./../components/Section.vue"

// Routes
const routes = [

	{ path: '/', component: Home },
	{ path: '/section', component: Section },
	// not found
	{ path: '/:pathMatch(.*)*', redirect: "/" }
]

// export Router Object
export default () => {

	const router = createRouter({

		routes,

		history: createWebHistory(),

		scrollBehavior(to, from, savedPosition) {

			// Avoid relocating the user when navigating to the same path
			if (to.path == from.path) return

			// transition delay
			const ms = from.name ? 350 : 0

			return new Promise(resolve => { setTimeout(() => { resolve(savedPosition ? savedPosition : { top: 0, left: 0 })}, ms) })
		}
	})

	return router
}
