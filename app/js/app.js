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
//import "velocity.ui";

//UI framework
import "foundation";

//TODO: bind gulp (node) environment.
if(typeof ENV !== "undefined" && ENV === "production") {

    Vue.config.devtools = false;
    Vue.config.silent   = true;
}

//FastClick init
import fastclick from "fastclick";
//init
fastclick(document.body);

//init foundation
$(document).foundation();

//app core
import core from "./src/core.js";
//init
core.init();
