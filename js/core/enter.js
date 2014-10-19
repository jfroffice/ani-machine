am.enter = (function(translate, transition, undefined) {
	"use strict";

	function parse(lang) {
		var words = lang,//.split(/[, ]+/),
			attrs = {},
			param;

		words.forEach(function (word, i) {
			param = words[i+1];
			switch (word) {
				case ":enter":
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
				case 'scale':
				  	attrs.scale = {};
				  	if (param == 'up' || param == 'down') {
				  		attrs.scale.direction = param;
				    	attrs.scale.power    = words[i+2];
				    	return;
				  	}
				  	attrs.scale.power = param;
				  	return;
				default:
					return;
			}
		});
		return attrs;
	}

	return function(lang) {

		var attrs = parse(lang),
			enter = attrs.enter || 'left',
			move = (enter !== 'left' && enter !== 'top') ? attrs.move : '-' + attrs.move,
			over = attrs.over || '0.7s',
			after = attrs.after || '0s',
			easing = attrs.easing || 'ease-in-out',
			scale = attrs.scale,
			axis = 'x',
			tmp;

		if (enter && (enter === 'top' || enter === 'bottom')) {
			axis = 'y';
		}

		if (scale && parseInt(scale.power) != 0) {
			var delta = parseFloat(scale.power) * 0.01;
			if (scale.direction == 'up') { delta = -delta; }
		  	scale.value = 1 + delta;
		}

		return {
			initial: translate({
				axis: axis,
				move: move,
				scale: scale,
				opacity: false
			}),
			transition: transition(over, easing, after)
		};
	}

})(am.translate, am.transition);