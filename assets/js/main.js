'use strict';

/**
 * Globals params
 */
var landing_id = 'svg-landing';


//Run Js
window.onload = init;

/**
 * function init
 *
 */
function init() {
    console.log('init');
    initLanding(landing_id);
}

/**
 * function init Landing
 */
function initLanding(id) {
    console.groupCollapsed('landing');
    var opts = {
        duration: 50,
        file: '/assets/svg/landing.svg',
        type: 'scenario',
        animTimingFunction: Vivus.EASE,
        reverseStack: true
    };
    var landing = new Vivus(id, opts);
    landing.play(2);
    console.groupEnd()
}

