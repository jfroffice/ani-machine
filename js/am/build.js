am.build = (function(prefix, enter, leave, transform, undefined) {
	"use strict";

	function hackStyle(elm) {
		getComputedStyle(elm, null).display;
	}

	function doTransition(elm, initial, target, transition, cb) {

		// hack: access style to apply transition
		hackStyle(elm);

		if (target) {
			classie.add(elm, target);
		}

		var previousTarget = elm.getAttribute('data-previous-target');
		if (classie.has(elm, previousTarget)) {
			classie.remove(elm, previousTarget);
		}

		classie.add(elm, transition);

		if (initial) {
			classie.remove(elm, initial);
		}
		events.one(elm, prefix.TRANSITION_END_EVENT, function() {
			classie.remove(elm, transition);
			if (target) {
				elm.setAttribute('data-previous-target', target);
			} else {
				elm.removeAttribute('data-previous-target');
			}
			cb && cb();
		});
	}

	return function(elm, type, param, loop) {
		var s, run, initial;

		//console.log('animation start ' + initial);
		if (type === ':enter') {
			return function(cb) {
				s = enter(param);
				classie.add(elm, s.initial);
				doTransition(elm, s.initial, null, s.transition, function() {
					cb && cb();
				});
			};
		} if (type === ':leave') {
			return function(cb) {
				s = leave(param);
				//classie.add(elm, s.initial);
				doTransition(elm, null, s.target, s.transition, function() {
					cb && cb();
				});
			};
		} else if (type === ':transform') {
			return function(cb) {
				s = transform(param);
				doTransition(elm, null, s.target, s.transition, function() {
					cb && cb();
				});
			};
		} else if (type === ':shake') {
			return function(cb) {

				// duplicate code !!!!
				hackStyle(elm);

				classie.add(elm, 'shake');
				classie.add(elm, 'shake-constant');
				if (param[1]) {
					classie.add(elm, 'shake-' + param[1]);
				}
				events.one(elm, prefix.ANIMATION_END_EVENT, function() {
					classie.remove(elm, 'shake');
					classie.remove(elm, 'shake-constant');
					if (param[1]) {
						classie.remove(elm, 'shake-' + param[1]);
					}
					cb && cb();
				});
			};
		} else if (type === ':animate') {
			return function(cb) {

				var initial = param + ' animated';

				if (loop) {
					initial += ' loop' + loop;
				}

				hackStyle(elm);

				classie.add(elm, param);
				classie.add(elm, 'animated');

				events.one(elm, prefix.ANIMATION_END_EVENT, function() {
					classie.remove(elm, param);
					classie.remove(elm, 'animated');
					cb && cb();
				});
			};
		} else { // only animate for now
			return function(cb) {
				alert('ERROR ' + type);
			};
		}
	};

})(am.prefix, am.enter, am.leave, am.transform);
