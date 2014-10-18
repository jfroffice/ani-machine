var translate = (function(undefined) {
	"use strict";

	function genCSS(options) {
		var type = 'translate',
			tmp = type + options.axis + '(' + options.move + ')',
			css, key;

		if (options.scale !== undefined) {
			tmp += ' scale(' + options.scale.value + ')';
		}

		css = '-webkit-transform: ' + tmp + ';transform: ' + tmp + ';';

		if (options.opacity !== undefined) {
			css += ' opacity: ' + (options.opacity ? '1' : '0') + ';';
		}
	
		var key = (type + '_' + options.axis + '_' + options.move + '_' + options.opacity).replace(/-/g, 'm');

		console.log(css);

		return styles.add(key, css);
	}

	return { genCSS: genCSS };
})();