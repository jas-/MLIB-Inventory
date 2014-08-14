'use strict';

var inventory = angular.module('MLIB-Inventory', [
	'ngRoute',
	'trNgGrid',
	'mgcrea.ngStrap',
	'inventoryControllers'
]);

inventory.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/search/:id', {
			templateUrl: 'partials/search.html',
			controller: 'search'
		})
		.when('/details/:id', {
			templateUrl: 'partials/details.html',
			controller: 'details'
		})
		.when('/manage', {
			templateUrl: 'partials/manage.html'
		})
		.otherwise({
			templateUrl: 'partials/default.html',
			redirectTo: '/'
		});
	}
]);
