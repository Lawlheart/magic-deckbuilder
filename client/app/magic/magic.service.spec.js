'use strict';

describe('Service: magic', function () {

  // load the service's module
  beforeEach(module('magicApp'));

  // instantiate service
  var magic;
  beforeEach(inject(function (_$magic_) {
    magic = _$magic_;
  }));

  it('should do something', function () {
    expect(!!magic).toBe(true);
  });

  // Deck Constructor 
  describe('The Deck Constructor', function() {

    it('should create a deck object', function() {
      expect(typeof new magic.Deck('test', 'standard')).toBe('object');
    });

    it('should create an object with the right properties', function() {
      var deck = new magic.Deck('test', 'standard');
      expect(deck.name).toBe('test');
      expect(deck.type).toBe('standard');
      expect(typeof deck.cards).toBe('object');
    });

    //having trouble with async calls, tests may be false positives
    describe('The addCards method', function() {
      var deck;
      beforeEach(function(done) {
        deck = new magic.Deck('test', 'standard');
        console.log('adding cards')
        deck.addCards([236504, 369045, 401891, 401891, 401891], function(cards) {
          console.log(cards);
          done();
        });
      });

      it('should add cards properly given a multiverseid', function() {
        expect(deck.cards.length).toBe(2);
        expect(deck.cards[0].name).toBe('Animar, Soul of Elements');
        expect(deck.cards[1].multiverseid).toBe(369045);
        expect(deck.cards[1].hasOwnProperty('name')).toBe(true);
      });
      it('should properly add multiple copies of one card', function() {
          expect(deck.cards.length).toBe(5);
      });



    });
    
    // describe('The removeCards method', function() {
    //   it('should remove the right card given a multiverseid', function() {
    //     var deck = new magic.Deck('test', 'standard');
    //     deck.addCards([236504, 369045, 401891, 401891, 401891]);
    //   });
    // });


  });



});
