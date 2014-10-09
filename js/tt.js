var tt = (function() {
	"use strict";

	return {
		parseOn: function(on) {
			if (on === 'enter') {
				on = 'mouseenter';
			} else if (on === 'leave') {
				on = 'mouseleave';
			}
			return on;
		}
	};

})();