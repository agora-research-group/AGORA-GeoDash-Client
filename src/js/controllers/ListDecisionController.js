;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('ListDecisionController', ListDecisionController);

	function ListDecisionController($scope, $http, $log) {
		$log.debug('ListDecisionController');
		
		$scope.decisions = [];
		
		$http.get('http://localhost:8080/decision/list')
	    	.then(function (res) {
	    		console.log("resposta!");
	    		$scope.decisions = res.data; 
	    	})
	    	.catch(function (err) {
	    		console.log(err);
	    	});
		
	}

}(window.angular, window.ol));
