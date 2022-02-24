/**
 * Store
 */

import { createStore, createLogger } from 'vuex'

export default () => createStore({

	// Only use strict mode in dev environment
	strict: process.env.NODE_ENV == 'development',

	plugins: process.env.NODE_ENV == 'development' ? [createLogger()] : [],

	state: () => ({

		foo: 'bar'
	}),
})
