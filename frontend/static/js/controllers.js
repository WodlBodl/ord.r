//Module name is demoApp and empty array(No dependencies) is for dependency injection
var Ordr = angular.module('Ordr',[]);
//Creating an object which will include custom function 
var controllers = {};
//Using controllers to define a controller(SimpleController) and we have anonymous function as second parameter
controllers.OrdrController = function ($scope) {
	//Scope is empty, We are adding customers property to scope 
	$scope.user = 'Rishab';
}
//Assigning function to the controller or we can use controller object 
Ordr.controller(controllers);