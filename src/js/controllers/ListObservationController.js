;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash').controller('ListObservationController',
			ListObservationController);

	function ListObservationController($scope, $log, $mdDialog, selSensor) {
		$log.debug('ListObservationController');

		$scope.id = selSensor.id;

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
