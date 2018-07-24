/**
 * App.js
 */

import "lodash"
import "vue"
import "jquery"

console.info("App -> Environment: " + process.env.NODE_ENV)

// FastClick init
import fastclick from "fastclick"
fastclick(document.body)

// production settings
if(process.env.NODE_ENV == "production") {

	Vue.config.silent        = true
	Vue.config.devtools      = false
	Vue.config.productionTip = false
}

// app core
import main from "./modules/main.js"
// init
main.init()
