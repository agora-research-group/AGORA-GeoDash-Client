;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('InformationController', InformationController);

	function InformationController($scope, $http, $log) {
		$log.debug('InformationController');
		
		$scope.teste = "abra";
	}

}(window.angular, window.ol));
