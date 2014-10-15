var am = am || {};
am.viewport = (function() {
	"use strict";

	function getOffset(elm) {
		var offsetTop = 0,
		  	offsetLeft = 0;

		do {
			if (!isNaN(elm.offsetTop)) {
		  		offsetTop += elm.offsetTop;
			}	
			if (!isNaN(elm.offsetLeft)) {
			  	offsetLeft += elm.offsetLeft;
			}
		} while (elm = elm.offsetParent);

		return {
			top: offsetTop,
			left: offsetLeft
		};
	}

	function getViewportH() {
	  	var client = window.document.documentElement.clientHeight,
	  		inner = window.innerHeight;

	  	return (client < inner) ? inner : client;
	}

	return {
		isInside: function(elm, h) {
			var scrolled = window.pageYOffset,
				viewed = scrolled + getViewportH(),
				elH = elm.offsetHeight,
				elTop = getOffset(elm).top,
				elBottom = elTop + elH;

			h = h || 0.5;

			return (elTop + elH * h) <= viewed && (elBottom) >= scrolled || (elm.currentStyle? elm.currentStyle : window.getComputedStyle(elm, null)).position == 'fixed';
		}
	};

})();