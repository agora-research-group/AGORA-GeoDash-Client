;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash').controller('ConfigureSensorController',
			ConfigureSensorController);

	function ConfigureSensorController($scope, $log, $mdDialog) {
		$log.debug('ConfigureSensorController');

		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
		
	}

}(window.angular, window.ol));
