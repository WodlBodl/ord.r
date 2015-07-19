(function () {
  'use strict';

  angular.module('routingApp', ['ngRoute'])

  angular.module('routingApp')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/splash', {
          controller: 'SplashCtrl',
          templateUrl: 'partials/splash.html'
        })
        .when('/page1', {
          controller: 'Page1Ctrl',
          templateUrl: 'partials/page1.html'
        })
        .when('/page1/:name', {
          controller: 'Page1Ctrl',
          templateUrl: 'partials/page1.html'
        })
        .when('/page2', {
          controller: 'Page2Ctrl',
          templateUrl: 'partials/page2.html'
        })
        .when('/page3', {
          controller: 'Page3Ctrl',
          templateUrl: 'partials/page3.html'
        })
        .otherwise('/splash');
        }]);

  angular.module('routingApp')
    .controller('SplashCtrl', ['$scope', function ($scope) {
        
        }])
    .controller('Page1Ctrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
      $scope.name = $routeParams.name;
       
        }])
    .controller('Page2Ctrl', ['$scope', function ($scope) {
        
        }])
    .controller('Page3Ctrl', ['$scope', function ($scope) {
        
        }])

}());