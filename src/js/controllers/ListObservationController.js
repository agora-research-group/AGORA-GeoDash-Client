;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash').controller('ListObservationController',
			ListObservationController);

	function ListObservationController($scope, $log, $mdDialog, selSensor, sDateObs, 
			eDateObs, observations) {
		$log.debug('ListObservationController');

		$scope.selSensor = selSensor;
		$scope.sDateObs = sDateObs;
		$scope.eDateObs = eDateObs;
		$scope.observations = observations;

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
