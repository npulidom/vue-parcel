/**
 * Loader Module
 */

import Home    from "../components/home.vue"
import Section from "../components/section.vue"

export default {

	routes: [
		{
			path: "/",
			component: Home
		},
		{
			path: "/section",
			component: Section
		},
		// not found
		{
			path: "*",
			redirect: "/"
		}
	]
}
