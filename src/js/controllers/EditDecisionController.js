;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('EditDecisionController', EditDecisionController);

	function EditDecisionController($scope, $http, $log, $location, $routeParams) {
		$log.debug('EditDecisionController');
		
		$scope.decision={id:null,title:'',description:''};
		$scope.paramId = $routeParams.id;
		
		$http({
            url: 'http://localhost:8080/decision/find'
                , method: 'POST'
                , data: $routeParams.id
                , header: {'content-type':'application/json'}
            }).success(function (response) {
            	$scope.decision = response;
            }).error(function (error) {
                console.log('error'+error);
            });
		
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
