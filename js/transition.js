var transition = (function() {
	"use strict";

	function genCSS(over , easing, after) {
		var tmp = over + ' ' + easing + ' ' + after,
			tmp2 = tmp + ', opacity ' + tmp + ';';

		var key = '_' + tmp.replace(/ /g, '_').replace(/\./g, '_');
		return styles.add(key, '-webkit-transition: -webkit-transform ' + tmp2 +
					'transition: transform ' + tmp2);
	}

	return {
		genCSS: genCSS
	};

})();