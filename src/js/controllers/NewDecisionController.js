;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('NewDecisionController', NewDecisionController);

	function listInfoReqs($scope, $http) {
		$http.get('http://localhost:8080/informationRequirement/list')
    	.then(function (res) {
    		console.log("resposta!");
    		$scope.infReqs = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}
	
	function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(infReqs) {
    	var lowertitle = infReqs.title.toLowerCase();
    	var lowerdescription = infReqs.description.toLowerCase();  
    	  
        return (lowertitle.indexOf(lowercaseQuery) === 0) ||
            (lowerdescription.indexOf(lowercaseQuery) === 0);
      };

    }
	
	function NewDecisionController($scope, $http, $log, $location) {
		$log.debug('NewDecisionController');
		
		$scope.infReqs = [];
		$scope.selectedInfReqs= [];
		$scope.selectedItem = null;
		$scope.searchText = null;
		
		$scope.decision=null;

		listInfoReqs($scope, $http);
		
		$scope.querySearch = function(query) {
	      var results = query ? $scope.infReqs.filter(createFilterFor(query)) : [];
	      return results;
	    };
		
		$scope.register = function() {
			var decision = $scope.decision;
			decision.infReqs = $scope.selectedInfReqs;
			
			$http({
	            url: 'http://localhost:8080/decision/save'
	                , method: 'POST'
	                , data: decision
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	                console.log('success', response);
	            }).error(function (error) {
	                console.log('error'+error);
	            });
			
			$location.path("ListDecisions");
		}
	}

}(window.angular, window.ol));
