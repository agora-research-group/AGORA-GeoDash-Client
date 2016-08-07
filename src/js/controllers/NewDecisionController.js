;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('NewDecisionController', NewDecisionController);

	function NewDecisionController($scope, $http, $log, $location) {
		$log.debug('NewDecisionController');
		
		$scope.decision={id:null,title:'',description:''};
		
		$scope.register = function() {
			$http({
	            url: 'http://localhost:8080/decision/save'
	                , method: 'POST'
	                , data: $scope.decision
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
			$location.path("/ListDecisions");
		}
	}

}(window.angular, window.ol));
