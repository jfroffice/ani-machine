var assert = require('assert'),
    parser = require('../js/dom/parser'),
    data,
    def;

describe('init state', function() {
    describe(':enter', function() {
        it('defined', function() {
            data = parser.getStates({}, 'default', ':enter value');
            assert.equal(':enter value', data.default[0].do);
        });
    });
    describe(':leave', function() {
        it('defined', function() {
            data = parser.getStates({}, 'default', ':leave value');
            assert.equal(':leave value', data.default[0].do);
        });
    });
    describe(':go', function() {
        it('defined', function() {
            data = parser.getStates(
                {},
                'default',
                ':enter value :go next :after 2.0s'
            );
            assert.equal('next', data.default[0].go);
            assert.equal('2.0s', data.default[0].after);
        });
        it('undefined by default', function() {
            data = parser.getStates({}, 'default', ':enter value');
            assert.equal(undefined, data.default[0].go);
        });
    });
    describe(':wait', function() {
        it('defined', function() {
            data = parser.getStates(
                {},
                'default',
                ':enter value :wait 2.0s :go next'
            );
            assert.equal('2000', data.default[0].wait);
        });
        it('undefined by default', function() {
            data = parser.getStates({}, 'default', ':enter value');
            assert.equal(undefined, data.default[0].wait);
        });
    });
    describe(':on', function() {
        it('defined', function() {
            data = parser.getStates({}, 'default', ':on value');
            assert.equal('active', data.default[0].on);
            assert.equal('value', data.default[1].on);
        });
        it('undefined set as active by default', function() {
            data = parser.getStates({}, 'toto', '');
            assert.equal('active', data.toto[0].on);
        });
        it('multiple :on define multiple events', function() {
            data = parser.getStates(
                {},
                'default',
                ':on active :on value :on value2'
            );
            assert.equal(3, data.default.length);
            assert.equal('active', data.default[0].on);
            assert.equal('value', data.default[1].on);
            assert.equal('value2', data.default[2].on);
        });
        it('multiple :on define with :enter', function() {
            var data = parser.getStates(
                {},
                'default',
                ':enter value :on on :animate pulse'
            );
            assert.equal('active', data.default[0].on);
            assert.equal(':enter value', data.default[0].do);
            assert.equal('on', data.default[1].on);
            assert.equal(':animate pulse', data.default[1].do);
        });
    });
    describe(':trigger', function() {
        it('defined', function() {
            data = parser.getTriggers({}, 'default', ':trigger .btn click');
            assert.equal('.btn click', data.default);
        });
        it('defined complex', function() {
            data = parser.getTriggers(
                {},
                'special',
                ':on active :enter value :trigger .btn--special click'
            );
            assert.equal('.btn--special click', data.special);
        });
    });
    describe(':before', function() {
        it('defined', function() {
            data = parser.getStates(
                {},
                'default',
                ':transform move bottom 250px move left 0 :before test() :go value'
            );
            assert.equal(
                ':transform move bottom 250px move left 0',
                data.default[0].do
            );
            assert.equal('test', data.default[0].before);
        });
        it('undefined', function() {
            data = parser.getStates({}, 'default', ':enter value');
            assert.equal(undefined, data.default[0].before);
        });
    });
    describe(':after', function() {
        it('defined', function() {
            data = parser.getStates({}, 'default', ':after test()');
            assert.equal('test', data.default[0].after);
        });
        it('undefined', function() {
            data = parser.getStates({}, 'default', ':enter value');
            assert.equal(undefined, data.default[0].after);
        });
    });
    describe(':transform', function() {
        it('defined', function() {
            data = parser.getStates({}, 'default', ':transform value');
            assert.equal(':transform value', data.default[0].do);
        });
        it('undefined', function() {
            data = parser.getStates({}, 'default', '');
            assert.equal(undefined, data.default[0].do);
        });
    });
    describe(':loop', function() {
        it('defined', function() {
            data = parser.getStates({}, 'value', ':loop 3');
            assert.equal('3', data.value[0].loop);
        });
        it('undefined', function() {
            data = parser.getStates({}, 'value', '');
            assert.equal(undefined, data.value[0].loop);
        });
    });
});
