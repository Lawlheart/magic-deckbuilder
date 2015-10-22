'use strict';

angular.module('magicFullstackApp')
  .service('magic', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

	var magic = {
			Deck: function(name, type) {
				this.name = name;
				this.type = type;
			}
	}
	return magic;

});
