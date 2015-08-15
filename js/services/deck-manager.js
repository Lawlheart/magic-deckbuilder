app.factory('deckManager', ['$http', function($http) {
	var deckManager =  $http.get('decks.json')
		.success(function(data) {
			console.log(data);
			return data
		}).error(function(err) {
			return err
		});
	return deckManager
}]);