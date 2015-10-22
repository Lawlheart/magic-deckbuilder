'use strict';

describe('Service: magic', function () {

  // load the service's module
  beforeEach(module('magicFullstackApp'));

  // instantiate service
  var magic;
  beforeEach(inject(function (_magic_) {
    magic = _magic_;
  }));

  it('should do something', function () {
    expect(!!magic).toBe(true);
  });

  // Deck Constructor 
  describe('The Deck Constructor', function() {

    beforeEach(function() {
    });

    it('should create a deck object', function() {
      expect(typeof new magic.Deck('test', 'standard')).toBe('object');
    });

    it('should create an object with the right properties', function() {
      var deck = new magic.Deck('test', 'standard')
      expect(deck.name).toBe('test');
      expect(deck.type).toBe('standard');
      expect(deck.cards).toBe({});
    });

    describe('The addCards method', function() {

      it('should add cards properly given a multiverseid', function() {
        var deck = new magic.Deck('test', 'standard')
        deck.addCards([236504, 369045])
        expect(deck.cards.length).toBe(2);
      })

    })

  });



});
