// require('js/am/build.js');

require('classie');

var am = {
  prefix: require('core/prefix.js'),
  viewport: require('core/viewport'),
  styles: require('core/styles.js'),
  frame: require('core/frame.js'),
  translate : require('effets/translate.js'),
  transition : require('effets/transition.js'),
  enter : require('effets/enter.js'),
  leave : require('effets/leave.js'),
  transform : require('effets/transform.js'),
  sequencer : require('am/sequencer.js'),
  start : require('am/facade.js')
};

require('css/light.css');
require('csshake/dist/csshake.min.css');
require('animate.css/animate.min.css');

module.exports = am;
