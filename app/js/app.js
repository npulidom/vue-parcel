/**
 * App.js
 */

import "html5shiv";
import "lodash";
import "vue";
import "jquery";

console.info("App -> Environment: " + process.env.NODE_ENV);

// Release
if(process.env.NODE_ENV == "production") {

	Vue.config.silent        = true;
	Vue.config.devtools      = false;
	Vue.config.productionTip = false;
}

// FastClick init
import fastclick from "fastclick";
// init
fastclick(document.body);

// app core
import main from "./modules/main.js";
// init
main.init();
