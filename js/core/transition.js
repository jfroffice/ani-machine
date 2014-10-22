am.transition = (function(styles, undefined) {
	"use strict";

	return function(over, easing, after) {
		var tmp = over + ' ' + easing + ' ' + after,
			tmp2 = tmp + ', skew, scale, opacity ' + tmp + ';';

		var key = '_' + tmp.replace(/ /g, '_').replace(/\./g, '_');
		var css =  '-webkit-transition: -webkit-transform ' + tmp2 +
					       'transition: transform '			+ tmp2;

		return styles.build(key, css);
	};

})(am.styles);