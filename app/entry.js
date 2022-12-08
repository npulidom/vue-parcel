/**
 * App Entrypoint
 */

import { createApp } from 'vue'

// feature flags
globalThis.__VUE_OPTIONS_API__ = process.env.NODE_ENV == "development"
globalThis.__VUE_PROD_DEVTOOLS__ = process.env.NODE_ENV == "development"

// modules
import App    from './components/App.vue'
import router from './modules/router.js'
import store  from './modules/store.js'

const init = () => {

	// new app instance
	const app = createApp(App)
				.use(store())
				.use(router())

	// mount
	app.mount('#app')
}

init()
