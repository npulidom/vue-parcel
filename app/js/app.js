/**
 * App.js
 * Browserify can only analyze static requires.
 */

//essential
import "html5shiv";
import "lodash";
import "vue";
import "bluebird";
import "js-cookie";
import "jquery";
import "velocity";

//TODO: bind gulp (node) environment.
if(typeof ENV !== "undefined" && ENV === "production") {

    Vue.config.devtools = false;
    Vue.config.silent   = true;
}

//FastClick init
import fastclick from "fastclick";
//init
fastclick(document.body);

//app core
import core from "./src/core.js";
//init
core.init();
