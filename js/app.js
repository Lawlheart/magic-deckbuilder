var app = angular.module('MagicApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'MainController',
		templateUrl: 'views/deck.html'
	}).when('/blocks', {
		controller: 'BlockListController',
		templateUrl: 'views/block-list.html'
	}).when('/blocks/:blockId', {
		controller: 'BlockController',
		templateUrl: 'views/block.html'
	}).when('/search', {
		controller: 'SearchController',
		templateUrl: 'views/search.html'
	});
	// .otherwise({
	// 	redirectTo: '/'
	// })
}]);

// $(document).ready(function(){
// 	console.log("START")
// 	$('ul.cards img.cardImage').on('click', function() {
// 		console.log("TESTING")
// 	});

// });