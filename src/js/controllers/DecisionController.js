;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('DecisionController', DecisionController);

	function DecisionController($scope, $http, $log) {
		$log.debug('DecisionController');
		
		$scope.teste = "abra";
	}

}(window.angular, window.ol));
