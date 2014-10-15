var am = am || {};
am.maestro = {
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
				on = tt.parseOn(tmp[1]);

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

		function initEvent(event) {
			var goto = event.goto,
				on = event.on;

			function eventFn() {

				var params = event.param.split(' ');
				
				if (params && params[0] === ':enter') {
					addQueue({
						run: animator.build(self.element, 'enter', params.slice(1, params.length)),
						finish: finish
					});	
				} else {
					event.currentStep += 1;
					if (event.currentStep >= params.length) {
						console.warn('try to relaunch animation that is not finished');
					} else {
						addQueue({
							run: animator.build(self.element, event.type, params[event.currentStep]),
							finish: finishSequence
						});	
					}												
				}
			};

			function finish() {
				if (goto) {
					if (on !== ACTIVE) {
						self.element.off(on, eventFn);
					}
					changeState(goto);
				}
			}

			function finishSequence() {
				if (event.currentStep < (event.param.split(' ').length-1)) {
					self.deferFn(eventFn, 0);
				} else {
					event.currentStep = -1;
				}

				finish();
			}

			if (on === ACTIVE) { // autostart animation
				self.deferFn(eventFn, 0);
			} else {
				self.element.on(on, eventFn);
			}
		
			return function() {
				self.element.off(on, eventFn);
			};
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