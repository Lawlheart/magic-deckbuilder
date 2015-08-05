app.factory('magic', ['$http', function($http) {
	return $http.get('js/all-sets.json')
			.success(function(data) {
				return data;
			}).error(function(err) {
				return err;
			});
}]);