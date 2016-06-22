/**
 * Handlebars Raw Filter Helper
 */
module.exports = function(options) {

    var text = options.fn(this);

    return text;
};
