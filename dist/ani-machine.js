/**
 * ani-machine - Declarative animation and machine state
 * @version v0.1.6
 * @link https://github.com/jfroffice/ani-machine
 * @license MIT
 */
var am = {};
am.prefix = (function() {
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
am.parser = (function() {
	"use strict";

	return function(on) {
		if (on === 'enter') {
			on = 'mouseenter';
		} else if (on === 'leave') {
			on = 'mouseleave';
		}
		return on;
	};
})();
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
am.styles = (function(undefined) {
	"use strict";

	var cache = {};

	function buildCSS(key, content) {
		if (cache[key]) {
			return;
		}
		return '.' + key + '{' + content + '}';
	}

	return {
		build: function(key, content) {
			var raw = buildCSS(key, content);
			if (!raw) {
				return key;
			}
			var style = document.createElement("style");
			style.type = "text/css";
			style.innerHTML = raw;
			cache[key] = true; //style;
			document.getElementsByTagName("head")[0].appendChild(style);
			return key;
		}
	};

})();
am.translate = (function(styles, undefined) {
	"use strict";

	var PREFIX = 'am_';

	return function(options) {
		var type = 'translate',
			tmp = type + options.axis + '(' + options.move + ')',
			scale = options.scale,
			key = PREFIX,
			css;

		if (scale !== undefined) {
			tmp += ' scale(' + scale.value + ')';
		}

		css = '-webkit-transform: ' + tmp + ';transform: ' + tmp + ';';

		if (options.opacity !== undefined) {
			css += ' opacity: ' + (options.opacity ? '1' : '0') + ';';
		}
	
		key += type + options.axis + '_' + options.move + '_' + options.opacity;

		if (scale !== undefined) {
			key += ('_scale' + scale.value).replace('.', '_');
		}

		key = key.replace(/-/g, 'm');

		return styles.build(key, css);
	};

})(am.styles);
am.transition = (function(styles, undefined) {
	"use strict";

	return function(over, easing, after) {
		var tmp = over + ' ' + easing + ' ' + after,
			tmp2 = tmp + ', rotate, skew, scale, opacity ' + tmp + ';';

		var key = '_' + tmp.replace(/ /g, '_').replace(/\./g, '_');
		var css =  '-webkit-transition: -webkit-transform ' + tmp2 +
					       'transition: transform '			+ tmp2;

		return styles.build(key, css);
	};

})(am.styles);
am.transform = (function(styles, transition, undefined) {
	"use strict";

	var PREFIX = 'am_';

	function parse(words) {
		var attrs = {},
			param, ignoreNext;

		words.forEach(function (word, i) {
			if (ignoreNext) {
				ignoreNext = false;
				return;
			}
			param = words[i+1];
			switch (word) {
				case "twist":
					if (param === 'left') {
						attrs.skewx = words[i+2];
					} else if (param === 'right') {
						attrs.skewx = '-' + words[i+2];
					}
					ignoreNext = true;
					return;
				case "rotate":
					if (param === 'left') {
						attrs.rotatey = '-' + words[i+2];
					} else if (param === 'right') {
						attrs.rotatey = words[i+2];
					}
					ignoreNext = true;
					return;
				case "move":
					var param2 = words[i+2];
					if (param === 'left') {
						attrs.translatex = '-' + param2;
					} else if (param === 'right') {
						attrs.translatex = param2;
					} else if (param === 'bottom') {
						attrs.translatey = param2;
					} else if (param === 'top') {
						attrs.translatey = '-' + param2;
					}
					ignoreNext = true;
					return;
				case 'scale':
				  	attrs.scale = {};
				  	if (param == 'up' || param == 'down') {
				  		attrs.scale.direction = param;
				    	attrs.scale.power    = words[i+2];
				  	} else {
				  		attrs.scale.power = param;
				  	}
				  	if (parseInt(attrs.scale.power) != 0) {
				  		var delta = parseFloat(attrs.scale.power) * 0.01;
				  		if (attrs.scale.direction == 'up') { delta = -delta; }
				  	  	attrs.scale.value = 1 + delta;
				  	}
				  	return;
				case "after":
				case "wait":
					attrs.after = param;
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

	return function(lang) {

		var attrs = parse(lang),
			skewx = attrs.skewx,
			skewy = attrs.skewy,
			rotatey = attrs.rotatey,
			translatex = attrs.translatex,
			translatey = attrs.translatey,
			scale = attrs.scale,
			over = attrs.over || '1.0s',
			after = attrs.after || '0s',
			easing = attrs.easing || 'ease-in-out',
			key = PREFIX,
			tmp = '';
		
		//console.log(attrs);

		if (skewx) {
			tmp += 'skewx(' + skewx + ') ';
			key += 'skewx' + skewx;
		}

		if (skewy) {
			tmp += 'skewy(' + skewy + ') ';
			key += 'skewy' + skewy;
		}
		
		if (translatex) {
			tmp += 'translatex(' + translatex + ')';
			key += 'translatex' + translatex;
		}

		if (translatey) {
			tmp += 'translatey(' + translatey + ')';
			key += 'translatey' + translatey;
		}

		if (rotatey) {
			tmp += 'rotate(' + rotatey + ') ';
			key += 'rotate' + rotatey;
		}

		if (scale) {
			tmp += ' scale(' + scale.value + ')';
			key += 'scale' + scale.value.toString().replace('.', '_');
		}

		var css =  '-webkit-transform: ' 	+ tmp + ' translateZ(0);' + 
					       'transform: '	+ tmp + ' translateZ(0);'
	
		//css += ';  -webkit-transform-origin: 50% 50% ; transform-origin: 50% 50%';

		key = key.replace(/-/g, 'm');

		//console.log(key);

		return {
			target: styles.build(key, css),
			reset: true,
			transition: transition(over, easing, after)
		};
	}

})(am.styles, am.transition);
am.enter = (function(translate, transition, undefined) {
	"use strict";

	function parse(words) {
		var attrs = {},
			param;

		words.forEach(function (word, i) {
			param = words[i+1];
			switch (word) {
				case ":enter":
					attrs.enter = param;
					if (attrs.enter === 'top' || attrs.enter === 'bottom') {
						attrs.axis = 'y';
					} else {
						attrs.axis = 'x';
					}
					return;
				case "move":
					attrs.move = param;
					return;
				case "after":
				case "wait":
					attrs.after = param;
					return;
				case "over":
					attrs.over = param;
					return;
				case 'scale':
				  	attrs.scale = {};
				  	if (param == 'up' || param == 'down') {
				  		attrs.scale.direction = param;
				    	attrs.scale.power    = words[i+2];
				  	} else {
				  		attrs.scale.power = param;
				  	}
				  	if (parseInt(attrs.scale.power) != 0) {
				  		var delta = parseFloat(attrs.scale.power) * 0.01;
				  		if (attrs.scale.direction == 'up') { delta = -delta; }
				  	  	attrs.scale.value = 1 + delta;
				  	}
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
			tmp;

		return {
			initial: translate({
				axis: attrs.axis,
				move: move,
				scale: attrs.scale,
				opacity: false
			}),
			transition: transition(over, easing, after)
		};
	}

})(am.translate, am.transition);
am.frame = (function () {
  	var frameFn = window.requestAnimationFrame 		||
  		 		window.webkitRequestAnimationFrame 	||
  		 		window.mozRequestAnimationFrame 	||
        		function(cb) {
          			window.setTimeout(cb, 1000/60);
        		};

     return function(cb) {
     	frameFn.call(window, cb);
     }
}());
am.build = (function(prefix, enter, transform, undefined) {
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

		if (elm.hasClass(elm.data('previous-target'))) {
			elm.removeClass(elm.data('previous-target'));
		}

		elm.addClass(transition);

		if (initial) {
			elm.removeClass(initial);
		}
		elm.one(prefix.TRANSITION_END_EVENT, function() {
			elm.removeClass(transition);
			elm.data('previous-target', target);
			cb && cb();
		});
	}

	return function(elm, type, param) {
		var s, run, initial;

		//console.log('animation start ' + initial);
		if (type === ':enter') {
			return function(cb) {
				s = enter(param);
				elm.addClass(s.initial);
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

				hackStyle(elm);

				var initial = 'shake shake-constant shake-' + param[1];

				elm
					.addClass(initial)
					.one(prefix.ANIMATION_END_EVENT, function() {
						//console.log('animation end : ' + initial);
						elm.removeClass(initial);
						cb && cb();
					});
			};
		} else if (type === ':animate') {
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
		} else { // only animate for now
			return function(cb) {
				alert('ERROR ' + type);
			};
		}
	};

})(am.prefix, am.enter, am.transform);
am.maestro = (function(parser, frame, undefined) {

	return {
		init: function(options) {

			var self = this,
				triggers = options.triggers;

			self.events = options.events;
			self.element = options.element;
			self.deferFn = options.timeoutFn;
			self.jobs = [];
			self.unregisters = [];
			self.currentState;
			self.running;

			function initTrigger(state, trigger) {
				var tmp = trigger.split(' '),
					selector = tmp[0],
					on = parser(tmp[1]);

				[].forEach.call(document.querySelectorAll(selector), function(el) {
					el.addEventListener(on, function() {
						self.state(state);
					});
				});
			}

			for(var state in triggers) {
				var trigger = triggers[state];
				if (!trigger) {
					continue;
				}
				initTrigger(state, trigger);
			}
		},
		state: function(state) {

			var self = this,
				ACTIVE = 'active';

			function addQueue(job) {
				self.jobs.push(job);
				run();
			}

			function run() {
				if (self.running) {
					return;
				}
				var job = self.jobs[0];
				if (!job) {
					return;
				}
				self.running = true;
				job.run(function() {
					job.finish();
					self.jobs.splice(0, 1);
					self.running = false;
					run();
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

			function callFn(fn) {
				fn = window[fn];					 
				if (typeof fn === "function") fn.apply(null, self);
			}

			function initEvent(event) {
				var goto = event.goto,
					before = event.before,
					after = event.after,
					on = event.on;

				function eventFn() {

					before && callFn(before);
					
					if (!event.param) {
						gotoFn();
						return;
					}

					var params = event.param.split(' '),
						param = params[0];
									
					if (params) {
						if (param === ':animate') {
							event.currentStep += 1;
							if (event.currentStep >= params.length) {
								console.warn('try to relaunch animation that is not finished');
							} else {
								addQueue({
									run: am.build(self.element, param, params[event.currentStep]),
									finish: finishSequence
								});	
							}												
						} else {
							addQueue({
								run: am.build(self.element, param, params),
								finish: finish
							});	
						} 

					} 
				}

				function gotoFn() {
					if (!goto) {
						return;
					}

					if (on !== ACTIVE) {
						self.element.off(on, eventFn);
					}
					self.state(goto);
				}

				function finish() {
					gotoFn();
					after && callFn(after);
				}

				function finishSequence() {
					if (event.currentStep < (event.param.split(' ').length-1)) {
						frame(eventFn);
					} else {
						event.currentStep = 0;
					}

					finish();
				}

				if (on === ACTIVE) { // autostart animation
					frame(eventFn);
				} else {
					self.element.on(on, eventFn);
				}
			
				return function() { self.element.off(on, eventFn); };
			}

			var sameState = self.currentState === state;

			if (self.currentState && self.unregisters && !sameState) {
				for (var i=0; i<self.unregisters.length; i++) {
					self.unregisters[i]();
				}
			}

			if (sameState) {
				initEvents(self.events[state]);
			} else {
				self.currentState = state;
				self.unregisters = initEvents(self.events[state]);
			}
		}
	};
})(am.parser, am.frame);
angular.module('aniMachine', [])
.directive('amElement', ['$window', function($window) {

	return {
		restrict: 'A',
		scope: {
			enter: '@'
		},
		link: function(scope, element, options) {

			var events = scope.events,
				triggers = scope.triggers;

			var musician = Object.create(am.maestro);
			musician.init({
				triggers: triggers,
				events: events,
				element: element
			});			

			if (events.enter || events.leave) {

				if (am.viewport.isInside(element[0])) {
					if (!events['default']) {
						musician.state('enter');
					}
				}

				scope.$watch(function() {
						return am.viewport.isInside(element[0]);
					}, function(newValue, oldValue) {
						if (newValue !== oldValue) {
							musician.state(newValue ? 'enter' : 'leave');
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

			musician.state('default');
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
			before: '@',
			after: '@',
			do: '@',
			goto: '@'
		},
		require: '^amState',
		link: function(scope, elm, options, stateCtrl) {
			stateCtrl.addEvent({
				on: am.parser(scope.on),
				param: scope.do,
				currentStep: 0,
				before: scope.before ? scope.before.replace('()', '') : '',
				after: scope.after ? scope.after.replace('()', '') : '',
				goto: scope.goto
			});
		}
	};
});