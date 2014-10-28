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
					} else if (s.indexOf('enter') 	 === 0 ||
					    s.indexOf('animate') === 0) {
						e.do = ':' + rtrim(s);
					} else if (s.indexOf('go') === 0) {
						e.go = rtrim(s.substring(3, s.length));
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