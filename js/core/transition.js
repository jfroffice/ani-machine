var transition = (function() {
	"use strict";

	function genCSS(over, easing, after) {
		var tmp = over + ' ' + easing + ' ' + after,
			tmp2 = tmp + ', scale, opacity ' + tmp + ';';

		var key = '_' + tmp.replace(/ /g, '_').replace(/\./g, '_');
		var css =  '-webkit-transition: -webkit-transform ' + tmp2 +
					       'transition: transform '			+ tmp2;

		console.log(css);
		return styles.add(key, css);
	}

	return { genCSS: genCSS };
})();