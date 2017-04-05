/**
 * App.js
 * Browserify can only analyze static requires.
 */

import "html5shiv";
import "lodash";
import "vue";
import "bluebird";
import "js-cookie";
import "jquery";
import "velocity";

// Release
if(typeof module.hot == "undefined") {

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
