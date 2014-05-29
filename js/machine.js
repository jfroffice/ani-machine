angular.module('myApp', [])
.directive('amElement', ['$rootScope', '$timeout', function($rootScope, $timeout) {

	var NEXT = 'next';

	return {
		restrict: 'A',
		scope: {
			enter: '@'
		},
		link: function(scope, elm, options) {

			var element = elm;

			function changeState(value) {
				var actions = scope.actions[value];
				for (var i=0; i<actions.length; i++) {
					initAction(actions[i]);
				}
			}

			function initAction(action) {
				var goto = action.goto,
					on = action.on;

				var actionFn = function() {
					animator.build(element, action.type, action.param).run(finish);
				};

				function finish() {
					// change state
					if (goto) {
						if (on !== NEXT) {
							element.off(on, actionFn);
						}
						changeState(goto);
					}
				}

				if (on === NEXT) {
					$timeout(actionFn, 0);
				} else {
					element.on(on, actionFn);
				}
			}

			animator.build(elm, 'enter', options.enter).run(function() {
				changeState('default');
			});
		},
		controller: ['$scope', '$element', function($scope, $element) {

			$scope.actions = {};

			this.setActions = function(state, actions) {
				$scope.actions[state] = actions;
			};
		}]
	};
}])
.directive('amState', ['$rootScope', function($rootScope) {
	return {
		restrict: 'E',
		scope: {
			value: '@'
		},
		require: '^amElement',
		link: function (scope, element, attrs, elementCtrl) {
	      	elementCtrl.setActions(scope.value, scope.actions);
	    },
		controller: ['$scope', '$element', function($scope, $element) {

			$scope.actions = [];

			this.addAction = function(action) {
				$scope.actions.push(action);
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

			var on = scope.on,
				type, param;

			if (on === 'enter') {
				on = 'mouseenter';
			} else if (on === 'leave') {
				on = 'mouseleave';
			}

			if (scope.enter) {
				type = 'enter';
				param = scope.enter;
			} else if (scope.animate) {
				type = 'animate';
				param = scope.animate;
			}

			stateCtrl.addAction({
				on: on,
				type: type,
				param: param,
				goto: scope.goto
			});
		}
	};
});