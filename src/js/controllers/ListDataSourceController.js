;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('ListDataSourceController', ListDataSourceController);

	function list($scope, $http) {
		$http.get('http://localhost:8080/dataSource/list')
    	.then(function (res) {
    		console.log("resposta!");
    		$scope.dataSources = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}
	
	function ListDataSourceController($scope, $http, $log, $location, $window) {
		$log.debug('ListDataSourceController');
		
		$scope.dataSources = [];
		
		list($scope, $http);
		
		$scope.itensperpage = 10;
		
		$scope.config = {
		    itemsPerPage: $scope.itensperpage,
		    fillLastPage: false
		};
		
		$scope.delete = function (id) {
			console.log(id);
			
			$http({
	            url: 'http://localhost:8080/dataSource/delete'
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
