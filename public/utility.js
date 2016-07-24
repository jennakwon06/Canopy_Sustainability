//!------- Useful utility functions used throughout all js files ------!//

function roundTo100(d) {
    return Math.round(d * 100) / 100;
}

/*
 * Check if csv cell is empty
 */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

/*
 * Check if a function exists
 */
$.fn.exists = function () {
    return this.length !== 0;
};

/**
 * Create an image and return a DOM img element
 * @param src
 * @param alt
 * @param title
 * @returns {Element}
 */
function img_create(src, alt, title) {
    var img = document.createElement('img');
    img.src= src;
    img.height = 30;
    img.width = 30;
    if (alt!=null) img.alt= alt;
    if (title!=null) img.title= title;
    return img;
    //https://jsfiddle.net/maccman/2kxxgjk8/3/
}