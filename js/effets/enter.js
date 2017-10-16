var translate = require('effets/translate.js');
var transition = require('effets/transition.js');

function parse(words) {
    var attrs = {},
        param;

    words.forEach(function(word, i) {
        param = words[i + 1];
        switch (word) {
            case ':enter':
                attrs.enter = param;
                if (attrs.enter === 'top' || attrs.enter === 'bottom') {
                    attrs.axis = 'y';
                } else {
                    attrs.axis = 'x';
                }
                return;
            case 'move':
                attrs.move = param;
                return;
            case 'after':
            case 'wait':
                attrs.after = param;
                return;
            case 'over':
                attrs.over = param;
                return;
            case 'easing':
                attrs.easing = param;
                return;
            case 'scale':
                attrs.scale = {};
                if (param == 'up' || param == 'down') {
                    attrs.scale.direction = param;
                    attrs.scale.power = words[i + 2];
                } else {
                    attrs.scale.power = param;
                }
                if (parseInt(attrs.scale.power) != 0) {
                    var delta = parseFloat(attrs.scale.power) * 0.01;
                    if (attrs.scale.direction == 'up') {
                        delta = -delta;
                    }
                    attrs.scale.value = 1 + delta;
                }
                return;
            default:
                return;
        }
    });
    return attrs;
}

module.exports = function enter(lang) {
    var attrs = parse(lang),
        enter = attrs.enter || 'left',
        move =
            enter !== 'left' && enter !== 'top' ? attrs.move : '-' + attrs.move,
        over = attrs.over || '0.7s',
        after = attrs.after || '0s',
        easing = attrs.easing || 'ease-in-out',
        tmp;

    return {
        initial: translate({
            axis: attrs.axis,
            move: move,
            scale: attrs.scale,
            opacity: false,
        }),
        transition: transition(over, easing, after),
    };
};
