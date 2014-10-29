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