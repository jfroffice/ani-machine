var assert = require("assert"),
	parser = require('../js/parser/parser-state'),
	data, def;

describe('init state', function(){
  describe(':enter', function(){
    it('defined', function() {      
      data = parser.getState(':enter value');
      assert.equal(':enter value', data.do);
    })
  })
  describe(':go', function(){
    it('defined', function() {      
      data = parser.getState(':enter value :go next');
      assert.equal('next', data.go);
    })
  	it('undefined by default', function() {      
  	  data = parser.getState(':enter value');
  	  assert.equal(undefined, data.go);
  	})
  })
  describe(':on', function(){
    it('defined', function() {      
      data = parser.getState(':on value');
      assert.equal('value', data.on);
    })
    it('undefined set as active by default', function() {      
      data = parser.getState('');
      assert.equal('active', data.on);
    })
  })
  describe(':loop', function(){
    it('defined', function() {      
      data = parser.getState(':loop 3');
      assert.equal('3', data.loop);
    })
    it('undefined', function() {      
      data = parser.getState('');
      assert.equal(undefined, data.loop);
    })
  })
})
