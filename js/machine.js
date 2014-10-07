angular.module('myApp', [])
.directive('amElement', ['$timeout', function($timeout) {

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
				if (currentState && unregisters && currentState !== state) {
					for (var i=0; i<unregisters.length; i++) {
						unregisters[i]();
					}
				}
				currentState = state;
				unregisters = initEvents(events[state]);
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
				for (var i=0; i<events.length; i++) {
					tmp.push(initEvent(events[i]));
				}
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
					addQueue({
						run: animator.build(element, event.type, event.param),
						finish: finish
					});
				};

				function finish() {
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
				goto: scope.goto
			});
		}
	};
});