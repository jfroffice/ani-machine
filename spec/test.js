var assert = require("assert"),
	parser = require('../js/parser/parser-state'),
	data, def;

describe('init state', function(){
  describe(':enter', function(){
    it('defined', function() {      
      data = parser.getState(':enter value')[0];
      assert.equal(':enter value', data.do);
    })
  })
  describe(':go', function(){
    it('defined', function() {      
      data = parser.getState(':enter value :go next')[0];
      assert.equal('next', data.go);
    })
  	it('undefined by default', function() {      
  	  data = parser.getState(':enter value')[0];
  	  assert.equal(undefined, data.go);
  	})
  })
  describe(':on', function(){
    it('defined', function() {      
      var events = parser.getState(':on value');
      assert.equal('active', events[0].on);
      assert.equal('value', events[1].on);
    })
    it('undefined set as active by default', function() {      
      data = parser.getState('')[0];
      assert.equal('active', data.on);
    })
    it('multiple :on define multiple events', function() {      
      var events = parser.getState(':on active :on value :on value2');
      assert.equal(3, events.length);
      assert.equal('active', events[0].on);
      assert.equal('value', events[1].on);
      assert.equal('value2', events[2].on);
    })
    it('multiple :on define with :enter', function() {      
      var events = parser.getState(':enter value :on on :animate pulse');
      assert.equal('active', events[0].on);
      assert.equal(':enter value', events[0].do);
      assert.equal('on', events[1].on);
      assert.equal(':animate pulse', events[1].do);
    })

  })
  describe(':loop', function(){
    it('defined', function() {      
      data = parser.getState(':loop 3')[0];
      assert.equal('3', data.loop);
    })
    it('undefined', function() {      
      data = parser.getState('')[0];
      assert.equal(undefined, data.loop);
    })
  })
})
