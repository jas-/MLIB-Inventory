'use strict';

var ctrl = angular.module('inventoryControllers', [])
	,	url = 'http://inventory-server.dev:8081'
	,	api = {
		computer: url+'/computer',
		monitor: url+'/monitor',
		model: url+'/model',
		rma: url+'/rma',
		cors: url+'/cors'
	};

ctrl.controller('list', function ($scope, $http, $window, $modal) {
  $http.get(api.computer).success(function(data) {
		$scope.computers = data;
  });

	$http.get(api.monitor).success(function(data) {
		$scope.monitors = data;
	});

	$scope.selected = [];
	$scope.handleRecord = function(){
		$scope.$watch('selected.length', function(len){
			if (len > 0) {
				var modal = $modal({
					title: 'Details for '+$scope.selected[0].Hostname,
					template: 'partials/details.html',
					show: false
				});
				$scope.showModal = function() {
					modal.$promise.then(modal.show);
				}
			}
		});
	};
});

ctrl.controller('search', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('scans/' + $routeParams.id + '.json').success(function(data) {
      $scope.scan = data;
    });
  }
]);

ctrl.controller('details', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('scans/' + $routeParams.id + '.json').success(function(data) {
      $scope.scan = data;
    });
  }
]);
