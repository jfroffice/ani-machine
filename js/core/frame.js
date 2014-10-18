am.frame = (function () {
  	var frameFn = window.requestAnimationFrame 		||
  		 		window.webkitRequestAnimationFrame ||
  		 		window.mozRequestAnimationFrame 	||
        		function(cb) {
          			window.setTimeout(cb, 1000/60);
        		};

     return function(cb) {
     	frameFn.call(window, cb);
     }
}());