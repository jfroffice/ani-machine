/**
 * ani-machine - Declarative animation and machine state
 * @version v0.1.9
 * @link https://github.com/jfroffice/ani-machine
 * @license MIT
 */
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

 /*jshint browser: true, strict: true, undef: true */
 /*global define: false */

 (function(window) {
	'use strict';
	
	var hasClass = function( elem, c ) {
		  return elem.classList.contains( c );
	};

	var addClass = function( elem, c ) {
	  	elem.classList.add( c );
	};

	var removeClass = function( elem, c ) {
		elem.classList.remove( c );
	};
	
	function toggleClass( elem, c ) {
		var fn = hasClass( elem, c ) ? removeClass : addClass;
		fn( elem, c );
	}

	var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	};

	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( classie );
	} else {
		// browser global
		window.classie = classie;
	}

})(window);
// Event helper from jsCore v0.6.1 github.com/Octane/jsCore
var events = (function() {

    function off(eventDetails) {
       eventDetails.eventTypes.forEach(function (eventType) {
           eventDetails.element.removeEventListener(
               eventType,
               eventDetails.callback
               );
       });
    }

    function on(element, selector, eventTypes, callback) {
       var listener;
       if (arguments.length == 3) {
           callback = eventTypes;
           eventTypes = selector;
           selector = undefined;
       }
       if (selector) {
           selector += ',' + selector + ' *';
           listener = function (event) {
               var target = event.target;
               if (target.matches && target.matches(selector)) {
                   if (callback.handleEvent) {
                       callback.handleEvent(event);
                   } else {
                       callback.call(element, event);
                   }
               }
           };
       } else {
           listener = callback;
       }
       if ('string' == typeof eventTypes) {
           eventTypes = eventTypes.split(/[\s,]+/);
       }
       eventTypes.forEach(function (eventType) {
           element.addEventListener(eventType, listener);
       });
       return {
           element: element,
           eventTypes: eventTypes,
           callback: listener
       };
    }

    function one(element, selector, eventTypes, callback) {
       var details;
       function listener(event) {
           off(details);
           if (callback.handleEvent) {
               callback.handleEvent(event);
           } else {
               callback.call(element, event);
           }
       }
       if (arguments.length == 3) {
           callback = eventTypes;
           eventTypes = selector;
           selector = undefined;
       }
       details = on(element, selector, eventTypes, listener);
    }

    return {
        one: one,
        on: on,
        off: off
    };

})();
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

	return function(key, content) {
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
	};

})();
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
am.translate = (function(styles, undefined) {
	"use strict";

	return function(options) {
		var type = 'translate',
			tmp = type + options.axis + '(' + options.move + ')',
			scale = options.scale,
			key = '',
			css;

		if (scale !== undefined) {
			tmp += ' scale(' + scale.value + ')';
			key += ('_scale' + scale.value).replace('.', '_');
		}

		css = '-webkit-transform: ' + tmp + ';transform: ' + tmp + ';';

		if (options.opacity !== undefined) {
			css += ' opacity: ' + (options.opacity ? '1' : '0') + ';';
		}

		//css += '-webkit-perspective: 1000; -webkit-backface-visibility: hidden;'


		key += type + options.axis + '_' + options.move + '_' + options.opacity;

		return styles(key.replace(/-/g, 'm'), css);
	};

})(am.styles);

am.transition = (function(styles, undefined) {
	"use strict";

	return function(over, easing, after) {
		var tmp = over + ' ' + easing + ' ' + after,
			tmp2 = tmp + ', all ' + tmp + ';'; /* all for Safari */

		var key = '_' + tmp.replace(/ /g, '_').replace(/\./g, '_');
		var css = '-webkit-transition: -webkit-transform ' + tmp2 +
				          'transition: transform '		   + tmp2;

		return styles(key, css);
	};

})(am.styles);

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
				case "easing":
					attrs.easing = param;
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
am.transform = (function(styles, transition, undefined) {
	"use strict";

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
			key = '',
			tmp = '';

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

		return {
			target: styles(key, css),
			reset: true,
			transition: transition(over, easing, after)
		};
	}

})(am.styles, am.transition);
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require, exports, module);
	} else {
		root.parser = factory();
	}
}(this, function(require, exports, module) {

	//function ltrim(s) { 
	//    return s.replace(/\s*((\S+\s*)*)/, "$1");
	//}

	function rtrim(s) {
		return s.replace(/((\s*\S+)*)\s*/, "$1");
	}

	function getValue(key, s) {
		return rtrim(s.substring(key.length+1, s.length));
	}

	function getState(input) {
		var events = [],
			e;

		if (input.indexOf(':on active') === -1) {
			input = ':on active ' + input;
		}

		input.split(':o').forEach(function(sentence) {
			if (sentence.length) {
				e = {};
				sentence.split(':').forEach(function (s) {
					if (s.indexOf('n') === 0) {
						e.on = rtrim(s.substring(2, s.length));
					} else if (s.indexOf('enter') 		=== 0
						 	|| s.indexOf('transform') 	=== 0
						 	|| s.indexOf('animate') 	=== 0
						 	|| s.indexOf('shake') 		=== 0) {
						e.do = ':' + rtrim(s);
					} else if (s.indexOf('go') === 0) {
						e.go = rtrim(s.substring(3, s.length));
					} else if (s.indexOf('transform') === 0) {
						e.transform = getValue('transform', s);
					} else if (s.indexOf('before') === 0) {
						e.before = rtrim(s.substring(7, s.length)).replace('()', '');
					} else if (s.indexOf('after') === 0) {
						e.after = rtrim(s.substring(6, s.length)).replace('()', '');
					} else if (s.indexOf('loop') === 0) {
						e.loop = rtrim(s.substring(5, s.length));
					}
				});	
				events.push(e);			
			}
		});

		return events;
	}

	return { 
		getStates: function(states, state, input) {
			states = states || {};
			states[state] = getState(input);
			return states;
		},
		getTriggers: function(triggers, state, input) {
			var triggers = triggers || {},
				idx = input.indexOf(':trigger');

			if (idx !== -1) {
				triggers[state] = rtrim(input.substring(idx+9, input.length));
			}

			return triggers;
		}
	};
}));
am.build = (function(prefix, enter, transform, undefined) {
	"use strict";

	function hackStyle(elm) {
		getComputedStyle(elm, null).display;
	}

	function doTransition(elm, initial, target, transition, cb) {

		// hack: access style to apply transition
		hackStyle(elm);

		if (target) {
			classie.add(elm, target);
			//elm.addClass(target);
		}

		var previousTarget = elm.getAttribute('data-previous-target');
		if (classie.has(elm, previousTarget)) {
			classie.remove(elm, previousTarget);
		}
		//if (elm.hasClass(elm.data('previous-target'))) {
		//	elm.removeClass(elm.data('previous-target'));
		//}

		classie.add(elm, transition);
		//elm.addClass(transition);

		if (initial) {
			classie.remove(elm, initial);
			//elm.removeClass(initial);
		}
		events.one(elm, prefix.TRANSITION_END_EVENT, function() {
		//elm.one(prefix.TRANSITION_END_EVENT, function() {
			classie.remove(elm, transition);
			//elm.removeClass(transition);
			if (target) {
				elm.setAttribute('data-previous-target', target);
			}
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
				classie.add(elm, s.initial);
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

				// duplicate code !!!!
				hackStyle(elm);

				classie.add(elm, 'shake');
				classie.add(elm, 'shake-constant');
				if (param[1]) {
					classie.add(elm, 'shake-' + param[1]);
				}
				//elm.addClass(initial);
				events.one(elm, prefix.ANIMATION_END_EVENT, function() {
					//console.log('animation end : ' + initial);

					classie.remove(elm, 'shake');
					classie.remove(elm, 'shake-constant');
					if (param[1]) {
						classie.remove(elm, 'shake-' + param[1]);
					}
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
				//console.log('animation start ' + initial);

				if (loop) {
					initial += ' loop' + loop;
				}

				hackStyle(elm);

				classie.add(elm, param);
				classie.add(elm, 'animated');
				//elm.addClass(initial);

				events.one(elm, prefix.ANIMATION_END_EVENT, function() {
					//console.log('animation end : ' + initial);

					classie.remove(elm, param);
					classie.remove(elm, 'animated');
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

am.sequencer = (function(frame, undefined) {
	"use strict";

	function parser(on) {
		if (on === 'enter') {
			on = 'mouseenter';
		} else if (on === 'leave') {
			on = 'mouseleave';
		}
		return on;
	};

	return {
		getState: function() {
			return this.currentState;
		},
		init: function(options) {

			var self = this,
				triggers = options.triggers;

			self.states = options.states;
			self.element = options.element;
			self.jobs = [];
			self.offs = [];
			self.currentState;
			self.running;

			function initTrigger(state, trigger) {
				var tmp = trigger.split(' '),
					selector = tmp[0],
					on = parser(tmp[1]);

				[].forEach.call(document.querySelectorAll(selector), function(el) {
					events.on(el, on, function() {
					//el.addEventListener(on, function() {
						self.changeState(state, true);
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

			self.changeState('default');
			return self;
		},
		changeState: function(state, force) {

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

			function initState(state) {
				if (!state) {
					return;
				}

				var tmp = [];
				for(var key in state) {
					tmp.push(initEvent(state[key]));
				}
				return tmp;
			}

			function callFn(fn) {
				fn = window[fn];					 
				if (typeof fn === "function") fn.apply(null, self);
			}

			function initEvent(event) {
				var go = event.go,
					before = event.before,
					after = event.after,
					loop = event.loop,
					eventParam = event.do,
					on = parser(event.on),
					releaseEvent;

				event.currentStep = event.currentStep || 0;

				function eventFn() {

					before && callFn(before);
					
					if (!eventParam) {
						goFn();
						return;
					}

					var params = eventParam.split(' '),
						param = params[0];
									
					if (params) {
						if (param === ':animate') {
							event.currentStep += 1;
							if (event.currentStep >= params.length) {
								console.warn('try to relaunch animation that is not finished');
							} else {
								addQueue({
									run: am.build(self.element, param, params[event.currentStep], loop),
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

				function goFn() {
					if (!go) {
						return;
					}

					if (on !== ACTIVE) {
						events.off(releaseEvent);
						//self.element.off(on, eventFn);
					}
					self.changeState(go);
				}

				function finish() {
					goFn();
					after && callFn(after);
				}

				function finishSequence() {
					if (event.currentStep < (eventParam.split(' ').length-1)) {
						frame(eventFn);
					} else {
						event.currentStep = 0;
					}

					finish();
				}

				if (on === ACTIVE) { // autostart animation
					frame(eventFn);
				} else {
					releaseEvent = events.on(self.element, on, eventFn);
					//self.element.addEventListener(on, eventFn);
					//self.element.on(on, eventFn);
				}
			
				return function() {
					releaseEvent && events.off(releaseEvent);//self.element, on, eventFn);
					//self.element.removeEventListener(on, eventFn);
					//self.element.off(on, eventFn);
				};
			}

			var sameState = self.currentState === state;

			if (self.currentState && self.offs && !sameState) {
				self.offs.forEach(function(off) {
					off();
				});
			}

			if (!sameState || force) {
				self.currentState = state;
				self.offs = initState(self.states[state]);
			}
		}
	};
})(am.frame);
am.start = (function(sequencer, viewport, undefined) {
	"use strict";

	var ATTR = 'data-am',
		DEFAULT = 'default',
		sequencers = [],
		enterLeave;

	function enterLeaveFn() {
		if (enterLeave) {
			clearTimeout(enterLeave);
		}

		enterLeave = setTimeout(function() {
			enterLeave = null;

			// check if element need to change state to enter or leave
			(function () {
				sequencers.forEach(function(s) {
					if (s.states.enter || s.states.leave) {
						if (viewport.isInside(s.element)) {
							s.changeState('enter');
						} else {
							s.changeState('leave');
						}
					}
				});
			})();

		}, 10);	
	}

	events.on(window, 'scroll', enterLeaveFn);
	events.on(window, 'resize', enterLeaveFn);

	return function() {
		[].forEach.call(document.querySelectorAll('[' + ATTR + ']'), function(element) {

			var states = {},
				triggers = {};

			[].forEach.call(element.attributes, function(attribute) {
				if (attribute.name.indexOf(ATTR) !== -1) {

					var state = attribute.name.replace(ATTR + '-', ''),
						input = attribute.value;

					if (state === ATTR) {
						state = DEFAULT;
					}

					states = parser.getStates(states, state, input)
					triggers = parser.getTriggers(triggers, state, input);
				}
			});

			sequencers.push(
				Object.create(sequencer).init({
					element: element,
					states: states,
					triggers: triggers
			}));
		});
	};

})(am.sequencer, am.viewport);