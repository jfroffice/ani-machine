(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.parser = factory();
  }
}(this, function(require, exports, module) {

	/*function ltrim(s) { 
	    return s.replace(/\s*((\S+\s*)*)/, "$1");
	}*/

	function rtrim(s) {
		return s.replace(/((\s*\S+)*)\s*/, "$1");
	}

	function getState(input) {
		var state = {};

		input.split(':').forEach(function (s) {
			if (s.indexOf('enter') 	 === 0 ||
			    s.indexOf('animate') === 0) {
				state.do = ':' + rtrim(s);
			} else if (s.indexOf('on') === 0) {
				state.on = rtrim(s.substring(3, s.length));
			} else if (s.indexOf('go') === 0) {
				state.go = rtrim(s.substring(3, s.length));
			} else if (s.indexOf('loop') === 0) {
				state.loop = rtrim(s.substring(5, s.length));
			}
		});

		if (!state.on) {
			state.on = 'active';
		}

		return state;
	}

	return { getState: getState };
}));