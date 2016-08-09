;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('EditInfoReqController', EditInfoReqController);

	function EditInfoReqController($scope, $http, $log, $location, $routeParams) {
		$log.debug('EditInfoReqController');
		
		$scope.infoReq={id:null,title:'',description:''};
		$scope.paramId = $routeParams.id;
		
		$http({
            url: 'http://localhost:8080/informationRequirement/find'
                , method: 'POST'
                , data: $routeParams.id
                , header: {'content-type':'application/json'}
            }).success(function (response) {
            	$scope.infoReq = response;
            }).error(function (error) {
                console.log('error'+error);
            });
		
		$scope.register = function() {
			$http({
	            url: 'http://localhost:8080/informationRequirement/save'
	                , method: 'POST'
	                , data: $scope.infoReq
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
			$location.path("/ListInfoReqs");
		}
	}

}(window.angular, window.ol));
