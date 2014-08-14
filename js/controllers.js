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
		$scope.selectedComputer = '';
		$scope.computers = data;
  });

	$http.get(api.monitor).success(function(data) {
		$scope.selectedMonitor = '';
		$scope.monitors = data;
	});

	$scope.selected = [];
	$scope.handleRecord = function(){
		$scope.$watch('selected.length', function(len){
			if (len > 0) {
				var item = $scope.selected[0]
					,	modal = $modal({
							title: 'Details for '+(item.Hostname || 'SKU # '+item.SKU),
							contentTemplate: 'partials/details.html',
							show: false
						});

				modal.$promise.then(function(){
					modal.show();
				});
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
