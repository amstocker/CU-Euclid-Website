
/*
 * Canvas setup boilerplate
 *
 *  (Source: https://www.html5rocks.com/en/tutorials/canvas/hidpi/)
 */
export function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}


/*
 * Do some unicode magic
 *
 *  (Source: https://stackoverflow.com/questions/29462958/unicode-characters-not-rendering-properly-in-html5-canvas)
 */
export function toUTF16(codePoint) {
    var TEN_BITS = parseInt('1111111111', 2);
    function u(codeUnit) {
        return '\\u'+codeUnit.toString(16).toUpperCase();
    }
    
    if (codePoint <= 0xFFFF) {
        return u(codePoint);
    }
    codePoint -= 0x10000;
    
    // Shift right to get to most significant 10 bits
    var leadSurrogate = 0xD800 + (codePoint >> 10);
    
    // Mask to get least significant 10 bits
    var tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);
    
    return u(leadSurrogate) + u(tailSurrogate);
}
