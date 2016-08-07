;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('ListDecisionController', ListDecisionController);

	function list($scope, $http) {
		$http.get('http://localhost:8080/decision/list')
    	.then(function (res) {
    		console.log("resposta!");
    		$scope.decisions = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}
	
	function ListDecisionController($scope, $http, $log, $location) {
		$log.debug('ListDecisionController');
		
		$scope.decisions = [];
		
		list($scope, $http);
		
		$scope.delete = function (id) {
			console.log(id);
			
			$http({
	            url: 'http://localhost:8080/decision/delete'
	                , method: 'DELETE'
	                , data: id
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
                	list($scope, $http);
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
		}
	}

}(window.angular, window.ol));
