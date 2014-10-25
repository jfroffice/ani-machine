am.maestro = (function(parser, frame, undefined) {

	return {
		init: function(options) {

			var self = this,
				triggers = options.triggers;

			self.events = options.events;
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
					loop = event.loop,
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
			
				return function() {
					self.element.off(on, eventFn);
					// if (loop) {
					// 	frame(function() {
					// 		self.element.removeClass('swing animated loop4');
					// 		//self.element.addClass('loopoff');
					// 	});
					// }
				};
			}

			var sameState = self.currentState === state;

			if (self.currentState && self.offs && !sameState) {
				self.offs.forEach(function(off) {
					off();
				});
			}

			if (sameState) {
				initEvents(self.events[state]);
			} else {
				self.currentState = state;
				frame(function() {
					self.offs = initEvents(self.events[state]);
				})
			}
		}
	};
})(am.parser, am.frame);