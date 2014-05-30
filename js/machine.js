function processOn(on) {
	if (on === 'enter') {
		on = 'mouseenter';
	} else if (on === 'leave') {
		on = 'mouseleave';
	}
	return on;
}

angular.module('myApp', [])
.directive('amElement', ['$rootScope', '$timeout', function($rootScope, $timeout) {

	var NEXT = 'next';

	return {
		restrict: 'A',
		scope: {
			enter: '@'
		},
		link: function(scope, elm, options) {

			var element = elm,
				unregisters,
				currentState;

			function changeState(state) {
				if (currentState && currentState !== state) {
					for (var i=0; i<unregisters.length; i++) {
						unregisters[i]();
					}
					unregisters = null;
				}
				currentState = state;
				unregisters = initEvents(scope.events[state]);
			}

			function initTriggers() {
				for(var state in scope.triggers) {
					var trigger = scope.triggers[state];
					if (!trigger) {
						continue;
					}
					initTrigger(state, trigger);
				}
			}

			function initTrigger(state, trigger) {
				var tmp = trigger.split(' '),
					selector = tmp[0],
					on = processOn(tmp[1]);

				// TODO: remove jQuery dependency
				angular.element(selector).on(on, function(e) {
					changeState(state);
				});
			}

			function initEvents(events) {
				if (!events) {
					return;
				}

				var unregisters = [];
				for (var i=0; i<events.length; i++) {
					unregisters.push(initEvent(events[i]));
				}
				return unregisters;
			}

			function initEvent(event) {
				var goto = event.goto,
					on = event.on;

				var eventFn = function() {
					animator.build(element, event.type, event.param).run(finish);
				};

				function finish() {
					// change state
					if (goto) {
						if (on !== NEXT) {
							element.off(on, eventFn);
						}
						changeState(goto);
					}
				}

				if (on === NEXT) {
					$timeout(eventFn, 0);
				} else {
					element.on(on, eventFn);
				}

				return function() {
					element.off(on, eventFn);
				}
			}

			initTriggers();

			animator.build(elm, 'enter', options.enter).run(function() {
				changeState('default');
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
.directive('amState', ['$rootScope', function($rootScope) {
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
		controller: ['$scope', '$element', function($scope, $element) {

			$scope.events = [];

			this.addEvent = function(event) {
				$scope.events.push(event);
			};
		}]
	};
}])
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

			var on = processOn(scope.on),
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