var styles = require('core/styles.js');
var transition = require('effets/transition.js');

function parse(words) {
  var attrs = {},
      param, ignoreNext;

  words.forEach(function (word, i) {
    if (ignoreNext) {
      ignoreNext = false;
      return;
    }
    param = words[i+1];
    switch (word) {
    case "twist":
      if (param === 'left') {
	attrs.skewx = words[i+2];
      } else if (param === 'right') {
	attrs.skewx = '-' + words[i+2];
      }
      ignoreNext = true;
      return;
    case "rotate":
      if (param === 'left') {
	attrs.rotatey = '-' + words[i+2];
      } else if (param === 'right') {
	attrs.rotatey = words[i+2];
      }
      ignoreNext = true;
      return;
    case "move":
      var param2 = words[i+2];
      if (param === 'left') {
	attrs.translatex = '-' + param2;
      } else if (param === 'right') {
	attrs.translatex = param2;
      } else if (param === 'bottom') {
	attrs.translatey = param2;
      } else if (param === 'top') {
	attrs.translatey = '-' + param2;
      }
      ignoreNext = true;
      return;
    case 'scale':
      attrs.scale = {};
      if (param == 'up' || param == 'down') {
	attrs.scale.direction = param;
	attrs.scale.power    = words[i+2];
      } else {
	attrs.scale.power = param;
      }
      if (parseInt(attrs.scale.power) != 0) {
	var delta = parseFloat(attrs.scale.power) * 0.01;
	if (attrs.scale.direction == 'up') { delta = -delta; }
	attrs.scale.value = 1 + delta;
      }
      return;
    case "after":
    case "wait":
      attrs.after = param;
      return;
    case "over":
      attrs.over = param;
      return;
    default:
      return;
    }
  });
  return attrs;
}

module.exports = function transform(lang) {

  var attrs = parse(lang),
      skewx = attrs.skewx,
      skewy = attrs.skewy,
      rotatey = attrs.rotatey,
      translatex = attrs.translatex,
      translatey = attrs.translatey,
      scale = attrs.scale,
      over = attrs.over || '1.0s',
      after = attrs.after || '0s',
      easing = attrs.easing || 'ease-in-out',
      key = '',
      tmp = '';

  if (skewx) {
    tmp += 'skewx(' + skewx + ') ';
    key += 'skewx' + skewx;
  }

  if (skewy) {
    tmp += 'skewy(' + skewy + ') ';
    key += 'skewy' + skewy;
  }
  
  if (translatex) {
    tmp += 'translatex(' + translatex + ')';
    key += 'translatex' + translatex;
  }

  if (translatey) {
    tmp += 'translatey(' + translatey + ')';
    key += 'translatey' + translatey;
  }

  if (rotatey) {
    tmp += 'rotate(' + rotatey + ') ';
    key += 'rotate' + rotatey;
  }

  if (scale) {
    tmp += ' scale(' + scale.value + ')';
    key += 'scale' + scale.value.toString().replace('.', '_');
  }

  var css =  '-webkit-transform: ' 	+ tmp + ' translateZ(0);' + 
      'transform: '	+ tmp + ' translateZ(0);';
  
  //css += ';  -webkit-transform-origin: 50% 50% ; transform-origin: 50% 50%';

  key = key.replace(/-/g, 'm');

  return {
    target: styles(key, css),
    reset: true,
    transition: transition(over, easing, after)
  };
};
