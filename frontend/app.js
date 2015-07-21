(function () {
  'use strict';

  angular.module('routingApp', ['ngRoute'], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
  });

  angular.module('routingApp')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/splash', {
          controller: 'SplashCtrl',
          templateUrl: 'partials/splash.html'
        })
        .when('/menu', {
          controller: 'MenuCtrl',
          templateUrl: 'partials/page1.html'
        })
        .when('/page2', {
          controller: 'Page2Ctrl',
          templateUrl: 'partials/page2.html'
        })
        .when('/partner', {
          controller: 'PartnerCtrl',
          templateUrl: 'partials/partner_page.html'
        })

        .otherwise('/splash');
        }]);

  angular.module('routingApp')
    .controller('SplashCtrl', ['$scope', '$location', 'StorageService', 'OrdrService',
      function ($scope, $location, StorageService, OrdrService) {
        $scope.table = null;

        $scope.submit = function () {
          OrdrService.getTableID($scope.table, function(data) {
              StorageService.setTableID(data);
              $location.path('menu');
          });
        };
        }])
    .controller('MenuCtrl', ['$scope', 'OrdrService', 'StorageService',
       function ($scope, OrdrService, StorageService) {
        OrdrService.getMenu(function(data) {
          $scope.menuItems = data.menu;
        });

           $scope.assistance = null;

    //private channel
    var pusher = new Pusher('3e537abd69de47be577d',{encrypted: true , authEndpoint:             'http://172.17.34.204:4000/pusher/auth_presence'});
    var presenceChannel = 'presence-';
    // need to loop this for each channel, as each event needs to be binded to their channel
    var tableID = StorageService.getTableID(),
        channel = pusher.subscribe(presenceChannel.concat(tableID));
    channel.bind('assistance', function(data) {
      //Your Code here, You recieve all the data that being message
        $scope.assistance = data.message;
        $scope.$apply($scope.assistance);
    });
    channel.bind('assitanceResponse', function(data){
      //Your Code here, You recieve all the data that being message
    });









        $scope.getAssistance = function() {
            OrdrService.getAssistance(StorageService.getTableID(), function(data) {
                $scope.assistanceBool = true;
            });
        };

        // Initialize the order object
        $scope.orders = {
            'tableId': StorageService.getTableID(),
            'order': [],
            'price': 0,
        };

        $scope.addQuantity = function (menuItem) {
            menuItem.quantity += 1;
        }

        $scope.removeQuantity = function (menuItem) {
            if (menuItem.quantity > 0) {
                menuItem.quantity -= 1;
            }
        };

//           $scope.addOrder = function () {
//               for (var i = 0; i < $scope.menuItems.length; i++) {
//                if ($scope.menuItems[i].quantity > 0) {
//                    delete $scope.menuItems[i].$$hashKey;
//                    delete $scope.menuItems[i].imgPath;
//                    delete $scope.menuItems[i].ingredients;
//                    var order_object = JSON.stringify($scope.menuItems[i]);
//                    $scope.orders.order.push($scope.menuItems[i])
//                }
//               }
//            OrdrService.addOrder($scope.orders, function(data) {
//                    console.log("Success");
//               });
//            };

            $scope.addOrder = function () {
               for (var i = 0; i < $scope.menuItems.length; i++) {
                if ($scope.menuItems[i].quantity > 0) {
                    delete $scope.menuItems[i].$$hashKey;
                    delete $scope.menuItems[i].imgPath;
                    delete $scope.menuItems[i].ingredients;
                    var order_object = JSON.stringify($scope.menuItems[i]);
                    OrdrService.addOrder($scope.menuItems[i], StorageService.getTableID(), function(data) {
                    });
                };
               };
            };
            $scope.submitOrder = function () {
                OrdrService.submitOrder(StorageService.getTableID(), function(data) {
                });
            };

        }])
    .controller('Page2Ctrl', ['$scope', function ($scope) {

        }])
    .controller('PartnerCtrl', ['$scope', function ($scope) {
        $scope.orders = [];
//
        $scope.alerts = [];

            var restaurant = new Pusher('3e537abd69de47be577d',{encrypted: true , authEndpoint: 'http://172.17.34.204:4000/pusher/auth_restaurant'});
                var restaurantId = 'private-restaurant-233654524632'
                var channel = restaurant.subscribe(restaurantId);
                channel.bind('assistance', function(data) {
                  //Your Code here, You recieve all the data that being message
                    $scope.$apply($scope.alerts.push(data));
                });
                channel.bind('orderNotification', function(data) {
                  //Your Code here, You recieve all the data that being message
//                    $scope.orders = JSON.parse($scope.json_object);
                    $scope.$apply($scope.orders.push(data));
                });
                channel.bind('assitanceResponse', function(data){
                  //Your Code here, You receive all the data that being message

                });

        $scope.checkOrder = function (item) {
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i] == item) {
                    $scope.orders.splice(i, 1);
                }
            }
        };
        }])

  angular.module('routingApp')
    .factory('OrdrService', ['$http', function($http) {

      function getMenu(callBackFunc) {
            $http({
                method: 'GET',
                url: 'http://172.17.34.204:4000/api/getMenu/11',
            }).
                    success(function(data) {
                         //this is the key
                         callBackFunc(data);
                    }).
                    error(function(data, response) {
                        console.log(response + " " + data);
                    });
            }
      function getAssistance(tableId, callBackFunc) {
          var url_assistance =  'http://172.17.34.204:4000/api/trigger/assistance/' + tableId
          $http({
                method: 'GET',
                url: url_assistance
            }).
                    success(function(data) {
                         //this is the key
                         callBackFunc(data);
                    }).
                    error(function(data, response) {
                        console.log(response + " " + data);
                    });
            }
        function getTableID(table, callBackFunc) {
            var tableNumber = {'number': table};
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                method: 'POST',
                url: 'http://172.17.34.204:4000/api/table/new',
                data: tableNumber
            }).
                success(function(data) {
                    callBackFunc(data);
            }).
                error(function(data, response) {
                    console.log(response + " " + data);
            });
        }
        function submitOrder(tableId, callBackFunc) {
            var tableId = {'tableId': tableId};
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                method: 'POST',
                url: 'http://172.17.34.204:4000/api/table/placeOrder',
                data: tableId
            }).
                success(function(data) {
                    callBackFunc(data);
            }).
                error(function(data, response) {
                    console.log(response + " " + data);
            });
        }
        function addOrder(order_object, tableId, callBackFunc) {
//            var order = data.order.toString();
            var orders = {'tableId': tableId,
                          'name': order_object.name,
                          'price': order_object.price,
                          'quantity': order_object.quantity};
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
            $http({
                method: 'POST',
                url: 'http://172.17.34.204:4000/api/table/addOrder',
                data: orders
            }).
                success(function(data) {
                    callBackFunc(data);
            }).
                error(function(data, response) {
                    console.log(response + " " + data);
            });
        }

      return {
              getMenu:getMenu,
              getTableID: getTableID,
              addOrder: addOrder,
              submitOrder: submitOrder,
              getAssistance: getAssistance
             };
      }])

    .factory('StorageService', function () {
        var tableID = null;
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
