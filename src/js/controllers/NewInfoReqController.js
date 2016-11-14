;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('NewInfoReqController', NewInfoReqController);

	function listDataSources($scope, $http) {
		$http.get('http://localhost:8080/dataSource/list')
    	.then(function (res) {
    		$scope.dataSources = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}
	
	function NewInfoReqController($scope, $http, $log, $location) {
		$log.debug('NewInfoReqController');
		
		$scope.infoReq={id:null,title:'',description:''};
		$scope.dataSources = [];
		$scope.selectedItem = null;
		
		listDataSources($scope, $http);
		
		$scope.register = function() {
			var infoReq = $scope.infoReq;
			infoReq.dataSource = $scope.selectedItem; 
			
			$http({
	            url: 'http://localhost:8080/informationRequirement/save'
	                , method: 'POST'
	                , data: infoReq
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	                $location.path("ListInfoReqs");
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
		}
	}

}(window.angular, window.ol));
