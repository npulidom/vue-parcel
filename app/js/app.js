/**
 * App.js
 */

import "lodash"
import "jquery"

// FastClick init
import fastclick from "fastclick"
fastclick(document.body)

// app core
import main from "./modules/main.js"
// init
main.init()
