'use strict';

describe('Service: magic', function () {

  // load the service's module
  ;

  // instantiate service
  var magic;  
  var scope;
  var $httpBackend;
  beforeEach(inject(function(_$magic_, $rootScope, _$httpBackend_,) { 
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('app/main/main.html')
    //   .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    
    magic = _$magic_;
    scope = $rootScope.$new();
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
  });

  // getDecks method
  describe('The Get Decks Method', function() {
    var decks = 2;
    beforeEach(function(done) {
      inject(function($rootScope, $httpBackend) {
        $httpBackend.expectGET('/api/decks/')
          .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
        magic.getDecks().success(function(data) {
          decks = data;
          console.log(decks)
          done();
          $rootScope.$apply();
        });
      });
    });

    it('should get something', function() { 
      expect(decks).toBe(2);   
    });
  });
});
