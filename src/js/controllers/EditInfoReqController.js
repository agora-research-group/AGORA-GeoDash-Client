;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('EditInfoReqController', EditInfoReqController);

	function listDataSources($scope, $http) {
		$http.get('http://localhost:8080/dataSource/list')
    	.then(function (res) {
    		console.log("resposta!");
    		$scope.dataSources = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}
	
	function EditInfoReqController($scope, $http, $log, $location, $routeParams) {
		$log.debug('EditInfoReqController');
		
		$scope.infoReq={id:null,title:'',description:''};
		$scope.paramId = $routeParams.id;
		
		$scope.infoReq={id:null,title:'',description:''};
		$scope.dataSources = [];
		$scope.selectedItem = null;
		
		listDataSources($scope, $http);
		
		$http({
            url: 'http://localhost:8080/informationRequirement/find'
                , method: 'POST'
                , data: $routeParams.id
                , header: {'content-type':'application/json'}
            }).success(function (response) {
            	$scope.infoReq = response;
            	$scope.selectedItem = $scope.infoReq.dataSource;
            }).error(function (error) {
                console.log('error'+error);
            });
		
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
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
			$location.path("ListInfoReqs");
		}
	}

}(window.angular, window.ol));
