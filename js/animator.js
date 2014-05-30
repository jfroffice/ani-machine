var animator = (function() {
	"use strict";

	function doTransition(elm, initial, target, transition, cb) {
		getComputedStyle(elm[0], null).display;

		if (target) {
			elm.addClass(target);
		}

		elm.addClass(transition);

		if (initial) {
			elm.removeClass(initial);
		}
		elm.one(prefix.TRANSITION_END_EVENT, function() {
			elm.removeClass(transition);
			cb && cb();
		});
	}

	return {
		build: function(elm, type, param) {

			var s, run, initial;

			if (elm.hasClass('animated')) { // catch only animated state
				//console.log('animation already running...');
				// should plan to execute animate when current one is finish
				return function() {};
			}

			if (type === 'enter') {
				s = enter.genCSS(param);
				initial = s.initial;
			} else {
				initial = param + ' animated';
			}

			elm.addClass(initial);
			//console.log('animation start ' + initial);

			if (type === 'enter') {
				return function(cb) {
					doTransition(elm, initial, null, s.transition, function() {
						//console.log('animation end ' + initial);
						cb && cb();
					});
				};
			} else { // only animate for now
				return function(cb) {
					elm.one(prefix.ANIMATION_END_EVENT, function() {
						//console.log('animation end : ' + initial);
						elm.removeClass(initial);
						cb && cb();
					});
				};
			}
		}
	};

})();