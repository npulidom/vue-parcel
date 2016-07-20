/**
 * Core Module
 * @class Core
 */

export default new function() {

    //++ Module
    var self  = this;
    self.name = "core";

    //++ Methods

    /**
     * Init function
     */
    self.init = function() {

        let msg = "Core: static webapp ready!";
        console.log(msg);

        //vue instance
        self.vm = new Vue({
            el: "#app",
            data: {
                message: 'Hello Vue.js!',
                style: {
                    color: 'rgb(224, 232, 66)'
                }
            }
        });
    };
};
