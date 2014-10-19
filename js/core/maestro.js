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
					before = event.before ? event.before.replace('()', '') : '',
					after = event.after ? event.after.replace('()', '') : '',
					on = event.on;

				function doAction(action) {
					var params = action.split(' '),
						param = params[0];

					if (params) {
						addQueue({
							run: am.build(self.element, param, params),
							finish: finish
						});	
					} else {
						event.currentStep += 1;
						if (event.currentStep >= params.length) {
							console.warn('try to relaunch animation that is not finished');
						} else {
							addQueue({
								run: am.build(self.element, event.type, params[event.currentStep]),
								finish: finishSequence
							});	
						}												
					}
				}

				function eventFn() {

					before && callFn(before);
					
					if (!event.param) {
						gotoFn();
						return;
					}

					var actions = event.param.split(':');

					actions.forEach(function(action) {
						if (action.length) {
							doAction(action);
						}
					});

				/*	var params = event.param.split(' '),
						param = params[0];
									
					if (params && param.indexOf(':') === 0) {
						addQueue({
							run: am.build(self.element, param.slice(1, param.length), params.slice(1, params.length)),
							finish: finish
						});	
					} else {
						event.currentStep += 1;
						if (event.currentStep >= params.length) {
							console.warn('try to relaunch animation that is not finished');
						} else {
							addQueue({
								run: am.build(self.element, event.type, params[event.currentStep]),
								finish: finishSequence
							});	
						}												
					}*/
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
						event.currentStep = -1;
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