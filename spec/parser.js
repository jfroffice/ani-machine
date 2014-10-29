var assert = require("assert"),
	parser = require('../js/dom/parser'),
	data, def;

describe('init state', function(){
  describe(':enter', function(){
    it('defined', function() {      
      data = parser.getStates({}, 'default', ':enter value');
      assert.equal(':enter value', data.default[0].do);
    })
  })
  describe(':go', function(){
    it('defined', function() {      
      data = parser.getStates({}, 'default', ':enter value :go next');
      assert.equal('next', data.default[0].go);
    })
  	it('undefined by default', function() {      
  	  data = parser.getStates({}, 'default', ':enter value');
  	  assert.equal(undefined, data.default[0].go);
  	})
  })
  describe(':on', function(){
    it('defined', function() {      
      data = parser.getStates({}, 'default', ':on value');
      assert.equal('active', data.default[0].on);
      assert.equal('value', data.default[1].on);
    })
    it('undefined set as active by default', function() {      
      data = parser.getStates({}, 'toto', '');
      assert.equal('active', data.toto[0].on);
    })
    it('multiple :on define multiple events', function() {      
      data = parser.getStates({}, 'default', ':on active :on value :on value2');
      assert.equal(3, data.default.length);
      assert.equal('active', data.default[0].on);
      assert.equal('value', data.default[1].on);
      assert.equal('value2', data.default[2].on);
    })
    it('multiple :on define with :enter', function() {      
      var data = parser.getStates({}, 'default', ':enter value :on on :animate pulse');
      assert.equal('active', data.default[0].on);
      assert.equal(':enter value', data.default[0].do);
      assert.equal('on', data.default[1].on);
      assert.equal(':animate pulse', data.default[1].do);
    })
  })
  describe(':trigger', function(){
    it('defined', function() {      
      data = parser.getTriggers({}, 'default', ':trigger .btn click');
      assert.equal('.btn click', data.default);
    })
    it('defined 2', function() {      
      data = parser.getTriggers({}, 'special', ':on active :enter value :trigger .btn--special click');
      assert.equal('.btn--special click', data.special);
    })
  })
  describe(':before', function(){
    it('defined', function() {      
      data = parser.getStates({}, 'default', ':before test()');
      assert.equal('test()', data.default[0].before);
    })
    it('undefined', function() {  
      data = parser.getStates({}, 'default', ':enter value');
      assert.equal(undefined, data.default[0].before);    
    })
  })
  describe(':after', function(){
    it('defined', function() {      
      data = parser.getStates({}, 'default', ':after test()');
      assert.equal('test()', data.default[0].after);
    })
    it('undefined', function() {  
      data = parser.getStates({}, 'default', ':enter value');
      assert.equal(undefined, data.default[0].after);    
    })
  })
  describe(':loop', function(){
    it('defined', function() {      
      data = parser.getStates({}, 'value', ':loop 3');
      assert.equal('3', data.value[0].loop);
    })
    it('undefined', function() {      
      data = parser.getStates({}, 'value', '');
      assert.equal(undefined, data.value[0].loop);
    })
  })
})
