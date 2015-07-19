//Module name is demoApp and empty array(No dependencies) is for dependency injection
var Ordr = angular.module('Ordr',[]);

var OrdrController = Ordr.controller('OrdrController', ['$scope', 'OrdrService', function ($scope, OrdrService) {
// var OrdrController = Ordr.controller('OrdrController', function ($scope) {
	$scope.tableID = "Yos";
	OrdrService.getMenu(function(data) {
		$scope.menuData = data.menu;
	});

}]);

var LandingController = Ordr.controller('LandingController', ['$scope', 'StorageService',
    function ($scope, StorageService) {
        $scope.tableID = StorageService.tableID;
        $scope.submit = function () {
            StorageService.tableID = $scope.tableID;
            console.log("Submitted: " + StorageService.tableID)
        }
        console.log($scope.tableID);
    }]);

var StorageService = Ordr.factory('StorageService', function () {
    var tableID = null;
    return {
        'tableID': tableID
    };
});
var OrdrService = Ordr.factory('OrdrService', ['$http', function($http) {

	function getMenu(callBackFunc) {
			console.log("Call Starting")
                    $http({
                        method: 'GET',
                        url: 'http://172.17.34.204:4000/api/getMenu/11',
                    }).
                            success(function(data) {
                                 //this is the key
                                 console.log(data)
                                 callBackFunc(data);
                            }).
                            error(function(data, response) {
                                console.log(response + " " + data);
                            });
                }

    return {
            getMenu:getMenu
           }
}]);