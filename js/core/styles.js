am.styles = (function(undefined) {
	"use strict";

	var cache = {};

	function buildCSS(key, content) {
		if (cache[key]) {
			return;
		}
		cache[key] = true;
		return '.' + key + '{' + content + '}';
	}

	return function(key, content) {
		var raw = buildCSS(key, content);
		if (!raw) {
			return key;
		}
		var style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = raw;
		document.getElementsByTagName("head")[0].appendChild(style);
		return key;
	};

})();