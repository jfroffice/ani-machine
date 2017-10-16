var cache = {};

function buildCSS(key, content) {
    if (cache[key]) {
        return;
    }
    return '.' + key + '{' + content + '}';
}

module.exports = function styles(key, content) {
    var raw = buildCSS(key, content);
    if (!raw) {
        return key;
    }
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = raw;
    cache[key] = true; //style;
    document.getElementsByTagName('head')[0].appendChild(style);
    return key;
};
