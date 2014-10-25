am.maestro = (function(parser, frame, undefined) {

	return {
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
					el.addEventListener(on, function() {
						self.changeState(state);
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
		changeState: function(state) {

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
				for(key in state) {
					tmp.push(initEvent(state[key]));
				}
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
					loop = event.loop,
					eventParam = event.do,
					on = parser(event.on);

				event.currentStep = event.currentStep || 0;

				function eventFn() {

					before && callFn(before);
					
					if (!eventParam) {
						gotoFn();
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

				function gotoFn() {
					if (!goto) {
						return;
					}

					if (on !== ACTIVE) {
						self.element.off(on, eventFn);
					}
					self.changeState(goto);
				}

				function finish() {
					gotoFn();
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
					self.element.on(on, eventFn);
				}
			
				return function() {
					self.element.off(on, eventFn);
				};
			}

			var sameState = self.currentState === state;

			if (self.currentState && self.offs && !sameState) {
				self.offs.forEach(function(off) {
					off();
				});
			}

			var future = self.states[state];

			if (sameState) {
				initState(future);
			} else {
				self.currentState = state;
				self.offs = initState(future);
			}
		}
	};
})(am.parser, am.frame);