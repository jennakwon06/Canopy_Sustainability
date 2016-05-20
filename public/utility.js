/**
 * Created by JennaKwon on 5/18/16.
 */
// !-------------- UTILITY FUNCTIONS ----------------! //

console.log("order 1: utility loaded");

function roundTo100(d) {
    return Math.round(d * 100) / 100;
}

/*
 * Check if csv cell is empty
 */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

