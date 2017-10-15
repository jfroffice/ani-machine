var styles = require('core/styles.js');

module.exports = function transition(over, easing, after) {
  "use strict";
  var tmp = over + ' ' + easing + ' ' + after,
      tmp2 = tmp + ', all ' + tmp + ';'; /* all for Safari */

  var key = '_' + tmp.replace(/ /g, '_').replace(/\./g, '_');
  var css = '-webkit-transition: -webkit-transform ' + tmp2 +
      'transition: transform ' + tmp2;

  return styles(key, css);
};
