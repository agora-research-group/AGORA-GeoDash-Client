;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('ListInfoReqController', ListInfoReqController);

	function list($scope, $http) {
		$http.get('http://localhost:8080/informationRequirement/list')
    	.then(function (res) {
    		console.log("resposta!");
    		$scope.inforeqs = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}
	
	function ListInfoReqController($scope, $http, $log, $location, $window) {
		$log.debug('ListInfoReqController');
		
		$scope.inforeqs = [];
		
		list($scope, $http);
		
		$scope.itensperpage = 10;
		
		$scope.config = {
		    itemsPerPage: $scope.itensperpage,
		    fillLastPage: false
		};
		
		$scope.delete = function (id) {
			console.log(id);
			
			$http({
	            url: 'http://localhost:8080/informationRequirement/delete'
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
