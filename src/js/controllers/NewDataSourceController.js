;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('NewDataSourceController', NewDataSourceController);

	function NewDataSourceController($scope, $http, $log, $location) {
		$log.debug('NewDataSourceController');
		
		$scope.dataSource={id:null,title:'',description:''};
		
		$scope.register = function() {
			$http({
	            url: 'http://localhost:8080/dataSource/save'
	                , method: 'POST'
	                , data: $scope.dataSource
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	                $location.path("/ListDataSources");
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
		}
	}

}(window.angular, window.ol));
