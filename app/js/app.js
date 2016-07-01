/**
 * App.js
 * Browserify can only analyze static requires.
 * It is not in the scope of browserify to handle dynamic requires.
 */

//essential
import "html5shiv";
import "lodash";
import "vue";
import "bluebird";
import "js-cookie";
import "jquery";
import "velocity";
import "velocity.ui";

//UI framework
import "foundation";

//FastClick init
import fastclick from "fastclick";
//init
fastclick(document.body);

//app core
import core from "./src/core.js";
//init
core.init();
