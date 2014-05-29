var translate = (function() {
	"use strict";

	function genCSS(param, move, opacity) {
		var type = 'translate',
			tmp = type + param + '(' + move + '); ',
			css = '-webkit-transform: ' + tmp + 'transform: ' + tmp;

		if (opacity !== undefined) {
			css += 'opacity: ' + (opacity ? '1' : '0') + ';';
		}

		var key = (type + '_' + param + '_' + move + '_' + opacity).replace(/-/g, 'm');
		return styles.add(key, css);
	}

	return {
		genCSS: genCSS
	};

})();