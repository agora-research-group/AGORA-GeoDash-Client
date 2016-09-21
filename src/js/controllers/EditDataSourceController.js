;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('EditDataSourceController', EditDataSourceController);

	function findDataSource(id, scope, http) {
		http({
            url: 'http://localhost:8080/dataSource/find'
                , method: 'POST'
                , data: id
                , header: {'content-type':'application/json'}
            }).success(function (response) {
            	scope.dataSource = response;
            }).error(function (error) {
                console.log('error'+error);
            });
	}
	
	function EditDataSourceController($scope, $http, $log, $location, $routeParams) {
		$log.debug('EditDataSourceController');
		
		$scope.dataSource={id:null,title:'',description:''};
		$scope.paramId = $routeParams.id;
		
		findDataSource($routeParams.id, $scope, $http);
		
		$scope.register = function() {
			$http({
	            url: 'http://localhost:8080/dataSource/save'
	                , method: 'POST'
	                , data: $scope.dataSource
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
			$location.path("/ListDataSources");
		}
	}

}(window.angular, window.ol));
