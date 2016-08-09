;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('NewInfoReqController', NewInfoReqController);

	function NewInfoReqController($scope, $http, $log, $location) {
		$log.debug('NewInfoReqController');
		
		$scope.infoReq={id:null,title:'',description:''};
		
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
