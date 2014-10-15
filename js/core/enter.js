var enter = (function() {
	"use strict";

	function parse(lang) {
		var words = lang.split(/[, ]+/),
			attrs = {},
			param;

		words.forEach(function (word, i) {
			param = words[i+1];
			switch (word) {
				case "enter":
					attrs.enter = param;
					return;
				case "after":
				case "wait":
					attrs.after = param;
					return;
				case "move":
					attrs.move = param;
					return;
				case "over":
					attrs.over = param;
					return;
				default:
					return;
			}
		});
		return attrs;
	}

	function genCSS(lang) {

		var attrs = parse('enter ' + lang);

		var over = attrs.over || '0.7s',
			enter = attrs.enter || 'left',
			move = (enter !== 'left' && enter !== 'top') ? attrs.move : '-' + attrs.move,
			after = attrs.after || '0s',
			easing = attrs.easing || 'ease-in-out',
			axis = 'x',
			tmp;

		if (enter && (enter === 'top' || enter === 'bottom')) {
			axis = 'y';
		}

		return {
			initial: translate.genCSS(axis, move, false),
			transition: transition.genCSS(over, easing, after)
		};
	}

	return { genCSS: genCSS };

})();