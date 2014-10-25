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
			loop: '@',
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
				loop: scope.loop,
				goto: scope.goto
			});
		}
	};
});