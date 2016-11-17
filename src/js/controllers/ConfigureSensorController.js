;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash').controller('ConfigureSensorController',
			ConfigureSensorController);

	function listInfoReqs($scope, $http) {
		$http.get('http://localhost:8080/informationRequirement/list')
    	.then(function (res) {
    		$scope.infReqs = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}
	
	function listProperties($scope, $http) {
		$http({
            url: 'http://localhost:8080/property/findByFeatureId'
                , method: 'POST'
                , data: $scope.feature.id
                , header: {'content-type':'application/json'}
            }).success(function (response) {
                console.log('success', response);
                $scope.properties = response;                
            }).error(function (error) {
                console.log('error'+error);
            });
	}
	
	function ConfigureSensorController($scope, $http, $log, $mdDialog, feature, fProperties) {
		$log.debug('ConfigureSensorController');
		
		$scope.feature = feature;
  	  	$scope.fProperties = fProperties;
  	  	$scope.infReqs = [];
  	  	$scope.properties = [];
  	  	$scope.property = null;
  	  	$scope.selectedInfoReq = null;
  	  	$scope.selectedProperty = null;
  	  	
  	  	listInfoReqs($scope, $http);
  	  	listProperties($scope, $http);

  	  	$scope.register = function() {
	  	  	var property = $scope.property;
	  	  	property.infoReq = $scope.selectedInfoReq;
	  	  	property.propertyId = $scope.selectedProperty.stype;
	  	  	property.featureId = $scope.feature.id;

	  	  	$http({
	            url: 'http://localhost:8080/property/save'
	                , method: 'POST'
	                , data: property
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	                $scope.property = null;
	                $scope.selectedInfoReq = null;
	                $scope.selectedProperty = null;
	                listProperties($scope, $http);
	            }).error(function (error) {
	                console.log('error'+error);
	            });
		};
		
		$scope.delete = function (id) {
			console.log(id);
			
			$http({
	            url: 'http://localhost:8080/property/delete'
	                , method: 'DELETE'
	                , data: id
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	                $scope.property = null;
	                $scope.selectedInfoReq = null;
	                $scope.selectedProperty = null;
	                listProperties($scope, $http);
	            }).error(function (error) {
	                console.log('error'+error);
	            });
		};
		
		$scope.edit = function (id) {
			console.log(id);
			
			$http({
	            url: 'http://localhost:8080/property/find'
	                , method: 'POST'
	                , data: id
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	                var property = response;
	                
	                $scope.property = property;
	                $scope.selectedInfoReq = property.infoReq;
	                
	                var p = {stype:property.propertyId};
	    	  	  	$scope.selectedProperty = p;
	            }).error(function (error) {
	                console.log('error'+error);
	            });
		}
  	  	
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		
	}

}(window.angular, window.ol));
