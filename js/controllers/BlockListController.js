app.controller('BlockListController', ['$scope', 'magic', '$routeParams', function ($scope, magic, $routeParams) {
	magic.success(function(data) {
		$scope.blocks = data;
		console.log(data)
		var blocks = $scope.blocks
		$scope.blockList = [[
				blocks["DTK"], 
				blocks["FRF"], 
				blocks["KTK"]
				],[
				blocks["JOU"],
				blocks["BNG"],
				blocks["THS"]
				],[
				blocks["DGM"],
				blocks["GTC"],
				blocks["RTR"]
				],[
				blocks["AVR"],
				blocks["DKA"],
				blocks["ISD"]
				],[
				blocks["NPH"],
				blocks["MBS"],
				blocks["SOM"]
				],[
				blocks["ROE"],
				blocks["WWK"],
				blocks["ZEN"]
				],[
				blocks["ARB"],
				blocks["CON"],
				blocks["ALA"]
		]];
		console.log($scope.blockList[0])

	});


	
}]);