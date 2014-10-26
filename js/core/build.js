am.build = (function(prefix, enter, transform, undefined) {
	"use strict";

	function hackStyle(elm) {
		getComputedStyle(elm, null).display;
	}

	function doTransition(elm, initial, target, transition, cb) {
		
		// hack: access style to apply transition
		hackStyle(elm);

		if (target) {
			classie.addClass(elm, target);
			//elm.addClass(target);
		}

		var previousTarget = elm.getAttribute('data-previous-target');
		if (classie.hasClass(elm, previousTarget)) {
			classie.removeClass(elm, previousTarget);
		}
		//if (elm.hasClass(elm.data('previous-target'))) {
		//	elm.removeClass(elm.data('previous-target'));
		//}

		classie.addClass(elm, transition);
		//elm.addClass(transition);

		if (initial) {
			classie.removeClass(elm, initial);
			//elm.removeClass(initial);
		}
		evt.on(elm, prefix.TRANSITION_END_EVENT, function() {
		//elm.one(prefix.TRANSITION_END_EVENT, function() {
			classie.removeClass(elm, transition);
			//elm.removeClass(transition);
			elm.setAttribute('data-previous-target', target);
			//elm.data('previous-target', target);
			cb && cb();
		});
	}

	return function(elm, type, param, loop) {
		var s, run, initial;

		//console.log('animation start ' + initial);
		if (type === ':enter') {
			return function(cb) {
				s = enter(param);
				classie.addClass(elm, s.initial);
				//elm.addClass(s.initial);
				doTransition(elm, s.initial, null, s.transition, function() {
					//console.log('animation end ' + initial);
					cb && cb();
				});
			};
		} else if (type === ':transform') {
			return function(cb) {
				s = transform(param);
				doTransition(elm, null, s.target, s.transition, function() {
					//console.log('animation end ' + initial);
					cb && cb();
				});
			};
		} else if (type === ':shake') {
			return function(cb) {

				var initial = 'shake shake-constant shake-' + param[1];

				// duplicate code !!!!
				hackStyle(elm);

				classie.addClass(elm, initial);
				//elm.addClass(initial);
				evt.one(elm, prefix.ANIMATION_END_EVENT, function() {
					console.log('animation end : ' + initial);
					
					classie.removeClass(elm, param);
					classie.removeClass(elm, 'animated');
					//elm.removeClass(initial);
					cb && cb();
				});
				// elm.addEventListener(prefix.ANIMATION_END_EVENT, function() {
				// //elm.one(prefix.ANIMATION_END_EVENT, function() {
				// 		//console.log('animation end : ' + initial);
				// 		classie.removeClass(elm, initial);
				// 		//elm.removeClass(initial);
				// 		cb && cb();
				// 	}, false);
			};
		} else if (type === ':animate') {
			return function(cb) {

				var initial = param + ' animated';
				console.log('animation start ' + initial);

				if (loop) {
					initial += ' loop' + loop;
				}

				hackStyle(elm);

				classie.addClass(elm, param);
				classie.addClass(elm, 'animated');
				//elm.addClass(initial);

				evt.one(elm, prefix.ANIMATION_END_EVENT, function() {
					console.log('animation end : ' + initial);
					
					classie.removeClass(elm, param);
					classie.removeClass(elm, 'animated');
					//elm.removeClass(initial);
					cb && cb();
				});
			/*	elm.addEventListener(prefix.ANIMATION_END_EVENT, function() {
				//elm.one(prefix.ANIMATION_END_EVENT, function() {
						console.log('animation end : ' + initial);
						
						classie.removeClass(elm, param);
						classie.removeClass(elm, 'animated');
						//elm.removeClass(initial);
						cb && cb();
					}, false);*/
			};
		} else { // only animate for now
			return function(cb) {
				alert('ERROR ' + type);
			};
		}
	};

})(am.prefix, am.enter, am.transform);