am.translate = (function(styles, undefined) {
	"use strict";

	return function(options) {
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

		return styles(key, css);
	};

})(am.styles);