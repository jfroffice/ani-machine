am.translate = (function(styles, undefined) {
	"use strict";

	return function(options) {
		var type = 'translate',
			tmp = type + options.axis + '(' + options.move + ')',
			scale = options.scale,
			key = '',
			css;

		if (scale !== undefined) {
			tmp += ' scale(' + scale.value + ')';
			key += ('_scale' + scale.value).replace('.', '_');
		}

		css = '-webkit-transform: ' + tmp + ';transform: ' + tmp + ';';

		if (options.opacity !== undefined) {
			css += ' opacity: ' + (options.opacity ? '1' : '0') + ';';
		}
	
		key += type + options.axis + '_' + options.move + '_' + options.opacity;

		return styles(key.replace(/-/g, 'm'), css);
	};

})(am.styles);