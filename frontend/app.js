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
          controller: 'MenuCtrl',
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
    .controller('SplashCtrl', ['$scope', '$location', 'StorageService',
      function ($scope, $location, StorageService) {
        $scope.tableID = StorageService.getTableID();

        $scope.submit = function () {
            StorageService.setTableID($scope.tableID);
            
            console.log("Submitted: " + StorageService.getTableID());

            $location.path('/menu');
        }
        }])
    .controller('MenuCtrl', ['$scope', 'OrdrService', 'StorageService',
       function ($scope, OrdrService, StorageService) {
        $scope.tableID = StorageService.getTableID();
        OrdrService.getMenu(function(data) {
          $scope.menuData = data.menu;
        });

        }])
    .controller('Page2Ctrl', ['$scope', function ($scope) {
        
        }])
    .controller('Page3Ctrl', ['$scope', function ($scope) {
        
        }])

  angular.module('routingApp')
    .factory('OrdrService', ['$http', function($http) {

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
      }])
    .factory('StorageService', function () {
        var tableID = 'Inital';
        function setTableID(value) {
            tableID = value;
        }
        function getTableID() {
            return tableID;
        }
        return {
            getTableID: getTableID,
            setTableID: setTableID
        };
      })

}());