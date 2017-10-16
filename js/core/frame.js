var frameFn =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(cb) {
        window.setTimeout(cb, 1000 / 60);
    };

module.exports = function frames(cb) {
    frameFn.call(window, cb);
};
