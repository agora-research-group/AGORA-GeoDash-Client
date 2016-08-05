;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('DataSourceController', DataSourceController);

	function DataSourceController($scope, $http, $log) {
		$log.debug('DataSourceController');
		
		$scope.teste = "abra";
	}

}(window.angular, window.ol));
