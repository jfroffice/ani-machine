/**
 * ani-machine - Declarative animation and machine state
 * @version v0.1.2
 * @link https://github.com/jfroffice/ani-machine
 * @license MIT
 */
var prefix = (function() {
	"use strict";

	var ANIMATION_END_EVENTS = {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},
		TRANSITION_END_EVENTS = {
			'WebkitTransition': 'webkitTransitionEnd',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		};

	function getPrefix(name) {
		var b = document.body || document.documentElement,
			s = b.style,
			v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
			p = name;

		if(typeof s[p] == 'string')
			return name;

		p = p.charAt(0).toUpperCase() + p.substr(1);
		for( var i=0; i<v.length; i++ ) {
			if(typeof s[v[i] + p] == 'string')
				return v[i] + p;
		}
		return false;
	}

	return {
		TRANSITION_END_EVENT: TRANSITION_END_EVENTS[getPrefix('transition')],
		ANIMATION_END_EVENT: ANIMATION_END_EVENTS[getPrefix('animation')]
	};

})();
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
		} while (elm = elm.offsetParent)

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
				elBottom = elTop + elH,
				h = h || 0.5;

			return (elTop + elH * h) <= viewed
				&& (elBottom) >= scrolled
				|| (elm.currentStyle? elm.currentStyle : window.getComputedStyle(elm, null)).position == 'fixed';
		}
	};

})();
var styles = (function() {
	"use strict";

	var cache = {};

	function buildCSS(key, content) {
		if (cache[key]) {
			return;
		}

		cache[key] = true;
		return '.' + key + '{' + content + '}';
	}

	function add(key, content) {
		var raw = buildCSS(key, content);
		if (!raw) {
			return key;
		}
		var style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = raw;
		document.getElementsByTagName("head")[0].appendChild(style);
		return key;
	}

	return {
		add: add
	};

})();
var translate = (function() {
	"use strict";

	function genCSS(param, move, opacity) {
		var type = 'translate',
			tmp = type + param + '(' + move + '); ',
			css = '-webkit-transform: ' + tmp + 'transform: ' + tmp;

		if (opacity !== undefined) {
			css += 'opacity: ' + (opacity ? '1' : '0') + ';';
		}

		var key = (type + '_' + param + '_' + move + '_' + opacity).replace(/-/g, 'm');
		return styles.add(key, css);
	}

	return {
		genCSS: genCSS
	};

})();
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

	return {
		genCSS: genCSS
	};

})();
var animator = (function() {
	"use strict";

	function hackStyle(elm) {
		getComputedStyle(elm[0], null).display;
	}

	function doTransition(elm, initial, target, transition, cb) {
		// hack: access style to apply transition
		hackStyle(elm);

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

			//console.log('animation start ' + initial);

			if (type === 'enter') {
				return function(cb) {
					s = enter.genCSS(param);
					elm.addClass(s.initial);
					doTransition(elm, s.initial, null, s.transition, function() {
						//console.log('animation end ' + initial);
						cb && cb();
					});
				};
			} else { // only animate for now
				return function(cb) {

					hackStyle(elm);

					var initial = param + ' animated';

					elm
						.addClass(initial)
						.one(prefix.ANIMATION_END_EVENT, function() {
							//console.log('animation end : ' + initial);
							elm.removeClass(initial);
							cb && cb();
						});
				};
			}
		}
	};

})();
angular.module('aniMachine', [])
.directive('amElement', ['$timeout', '$window', function($timeout, $window) {

	var ACTIVE = 'active';

	return {
		restrict: 'A',
		scope: {
			enter: '@'
		},
		link: function(scope, element, options) {

			var events = scope.events,
				triggers = scope.triggers,
				jobs = [],
				running,
				unregisters,
				currentState;

			function changeState(state) {
				var sameState = currentState === state;

				if (currentState && unregisters && !sameState) {
					for (var i=0; i<unregisters.length; i++) {
						unregisters[i]();
					}
				}

				if (sameState) {
					initEvents(events[state]);
				} else {
					currentState = state;
					unregisters = initEvents(events[state]);
				}
			}

			function initTriggers() {
				for(var state in triggers) {
					var trigger = triggers[state];
					if (!trigger) {
						continue;
					}
					initTrigger(state, trigger);
				}
			}

			function initTrigger(state, trigger) {
				var tmp = trigger.split(' '),
					selector = tmp[0],
					on = tt.parseOn(tmp[1]);

				[].forEach.call(document.querySelectorAll(selector), function(el) {
					el.addEventListener(on, function() {
						changeState(state);
					});
				});
			}

			function initEvents(events) {
				if (!events) {
					return;
				}

				var tmp = [];
				events.forEach(function(e) {
					tmp.push(initEvent(e));
				});
				return tmp;
			}

			function addQueue(job) {
				jobs.push(job);
				run();
			}

			function run() {
				if (running) {
					return;
				}
				var job = jobs[0];
				if (!job) {
					return;
				}
				running = true;
				job.run(function() {
					job.finish();
					// remove job from array here !
					jobs.splice(0, 1);
					running = false;
					run();
				});
			}

			function initEvent(event) {
				var goto = event.goto,
					on = event.on;

				var eventFn = function() {

					var params = event.param.split(' ');
					event.currentStep += 1;

					if (event.currentStep >= params.length) {
						console.warn('try to relaunch animation that is not finished');
					} else {
						addQueue({
							run: animator.build(element, event.type, params[event.currentStep]),
							finish: finish
						});						
					}
				};

				function finish() {

					if (event.currentStep < (event.param.split(' ').length-1)) {
						$timeout(eventFn, 0);
					} else {
						event.currentStep = -1;
					}

					// change state
					if (goto) {
						if (on !== ACTIVE) {
							element.off(on, eventFn);
						}
						changeState(goto);
					}
				}

				if (on === ACTIVE) { // autostart animation
					$timeout(eventFn, 0);
				} else {
					element.on(on, eventFn);
				}
			
				return function() {
					element.off(on, eventFn);
				};
			}

			initTriggers();

			if (events['enter'] || events['leave']) {

				if (am.viewport.isInside(element[0])) {
					if (!events['default']) {
						changeState('enter');
					}
				}

				scope.$watch(function() {
						return am.viewport.isInside(element[0]);
					}, function(newValue, oldValue) {
			           	if (newValue !== oldValue) {
			           		changeState(newValue ? 'enter' : 'leave');
			           }
				}, true);

				// should be outside !?
			    angular.element($window)
			    	.bind('resize', function () {
	                	scope.$apply();
	            	})
			    	.bind('scroll', function () {
	                	scope.$apply();
	            	});
			}

			if (!options.enter) {
				changeState('default');
				return;
			}

			addQueue({
				run: animator.build(element, 'enter', options.enter),
				finish: function() {
					changeState('default');
				}
			});
		},
		controller: ['$scope', '$element', function($scope, $element) {

			$scope.events = {};
			$scope.triggers = {};

			this.setEvents = function(state, trigger, events) {
				state = state || 'default';
				$scope.events[state] = events;
				$scope.triggers[state] = trigger;
			};
		}]
	};
}])
.directive('amState', function() {
	return {
		restrict: 'E',
		scope: {
			value: '@',
			trigger: '@'
		},
		require: '^amElement',
		link: function (scope, element, attrs, elementCtrl) {
			elementCtrl.setEvents(scope.value, scope.trigger, scope.events);
		},
		controller: ['$scope', function($scope) {

			$scope.events = [];

			this.addEvent = function(event) {
				$scope.events.push(event);
			};
		}]
	};
})
.directive('amEvent', function() {
	return {
		restrict: 'E',
		scope: {
			on: '@',
			animate: '@',
			enter: '@',
			goto: '@'
		},
		require: '^amState',
		link: function(scope, elm, options, stateCtrl) {

			var on = tt.parseOn(scope.on),
				type, param;

			if (scope.enter) {
				type = 'enter';
				param = scope.enter;
			} else if (scope.animate) {
				type = 'animate';
				param = scope.animate;
			}

			stateCtrl.addEvent({
				on: on,
				type: type,
				param: param,
				currentStep: -1,
				goto: scope.goto
			});
		}
	};
});