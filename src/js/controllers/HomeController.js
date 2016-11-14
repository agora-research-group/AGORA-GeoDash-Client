;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('HomeController', HomeController);

	function getSensor(feature, $http, $scope) {
		$scope.start();
		
		$http({
            url: 'http://localhost:8080/sensor/find'
                , method: 'POST'
                , data: feature.i
                , header: {'content-type':'application/json'}
            }).success(function (response) {
            	$scope.selSensor = response;
            	getProperty($scope, $http, feature)
            }).error(function (error) {
                console.log('error'+error);
            });
		
	};
	
	function getProperty($scope, $http, feature) {
		$http({
            url: 'http://localhost:8080/sensor/listProperty'
                , method: 'POST'
                , data: feature.i
                , header: {'content-type':'application/json'}
            }).success(function (response) {
            	$scope.properties = response;
            	console.log($scope.properties);
            	$scope.complete();
            	$scope.optShow = true;
            }).error(function (error) {
                console.log('error'+error);
            });
	}
	
	
	function list($scope, $http) {
		$http.get('http://localhost:8080/decision/list')
    	.then(function (res) {
    		$scope.decisions = res.data; 
    	})
    	.catch(function (err) {
    		console.log(err);
    	});
	}

	function HomeController($scope, $http, $log, cfpLoadingBar, $mdDialog) {
		$log.debug('HomeController');
		
		$scope.selSensor = null;
		$scope.decisions = [];
		$scope.selectedDecision = null;
		$scope.properties = [];
		$scope.selectedProperty = null;
		$scope.sDateObs = new Date();
		$scope.eDateObs = new Date();
		
		list($scope, $http);
		
		$scope.start = function() {
	      cfpLoadingBar.start();
	    };

	    $scope.complete = function () {
	      cfpLoadingBar.complete();
	    }
		
		$scope.showFilters = function() {
			$scope.isFitOpen = true;
		};
		
		$scope.closeFilters = function() {
			$scope.isFitOpen = false;
		};
		
		$scope.openSettings = function() {
	        $scope.isSetOpen = true;
	    };
	    
	    $scope.closeSettings = function() {
    		$scope.isSetOpen = false;
	    };
	    
	    $scope.filter = function(ev) {
	    	
	    	$http({
	            url: 'http://localhost:8080/sensor/getObservation'
	                , method: 'POST'
	                , data: {id: $scope.selSensor.id, sDate: $scope.sDateObs, eDate: $scope.eDateObs}
	                , header: {'content-type':'application/json'}
	            }).success(function (response) {
	            	console.log(response)
	            	
	            	$mdDialog.show({
			          templateUrl: 'templates/list_observation.tmpl.html',
			          parent: angular.element(document.body),
			          targetEvent: ev,
			          clickOutsideToClose:true,
			          locals: {
			        	  selSensor: $scope.selSensor,
			          },
			          controller: 'ListObservationController',
			        })
	            }).error(function (error) {
	                console.log('error'+error);
	            });
	    	
	    };
	    
		var cemadenSource = new ol.source.Vector();
		var cemaden = new ol.layer.Vector({
			title : 'Cemaden',
			source : cemadenSource,
			style : new ol.style.Style({
				image : new ol.style.Icon(({
					opacity : 0.75,
					scale : 0.06,
					src: iconUrl,
				})),
			}),
		});
		
		var cemadenHySource = new ol.source.Vector();
		var cemadenHy = new ol.layer.Vector({
			title : 'Cemaden Hy',
			source : cemadenHySource,
			style : new ol.style.Style({
				image : new ol.style.Icon(({
					opacity : 0.75,
					scale : 0.06,
					src : iconUrl,
				})),
			}),
		});

		var map = new ol.Map({
			target : 'map',
			logo : false,
			controls : ol.control.defaults({
				zoom : false,
				attribution : false,
			}).extend([ new ol.control.Zoom({
				className : 'custom-zoom'
			}), new ol.control.LayerSwitcher(), ]),
			layers : [ new ol.layer.Group({
				'title' : 'Base maps',
				layers : [ new ol.layer.Tile({
					type : 'base',
					title : 'OSM',
					visible : true,
					source : new ol.source.OSM()
				}), ],
			}), new ol.layer.Group({
				'title' : 'Overlaps',
				layers : [ cemaden, cemadenHy ],
			}), ],
			view : new ol.View({
				center : ol.proj.fromLonLat([ -47.890926, -22.008708 ]),
				zoom : 15,
				maxZoom : 19,
				minZoom : 4,
			}),
		});
		
		var f = ol.format.ogc.filter;
		var featureRequest = new ol.format.WFS().writeGetFeature({
			srsName : 'EPSG:3857',
			featureNS : 'http://www.agora.icmc.usp.br/agora',
			featurePrefix : 'agora',
			featureTypes : [ 'cemaden_stations' ],
			outputFormat : 'application/json',
			geometryName : 'Point',
			filter : ol.format.ogc.filter.equalTo('stype', 'P')
		});

		fetch('http://www.agora.icmc.usp.br:8080/geoserver/agora/wfs', {
			method : 'POST',
			body : new XMLSerializer().serializeToString(featureRequest)
		}).then(function(response) {
			return response.json();
		}).then(function(json) {
			var features = new ol.format.GeoJSON().readFeatures(json);
			cemadenSource.addFeatures(features);
		});
		
		var f = ol.format.ogc.filter;
		var featureRequest = new ol.format.WFS().writeGetFeature({
			srsName : 'EPSG:3857',
			featureNS : 'http://www.agora.icmc.usp.br/agora',
			featurePrefix : 'agora',
			featureTypes : [ 'cemaden_stations' ],
			outputFormat : 'application/json',
			geometryName : 'Point',
			filter : ol.format.ogc.filter.equalTo('stype', 'H')
		});

		fetch('http://www.agora.icmc.usp.br:8080/geoserver/agora/wfs', {
			method : 'POST',
			body : new XMLSerializer().serializeToString(featureRequest)
		}).then(function(response) {
			return response.json();
		}).then(function(json) {
			var features = new ol.format.GeoJSON().readFeatures(json);
			cemadenHySource.addFeatures(features);
		});

		// select interaction working on "click"
		var select = new ol.interaction.Select({
			condition : ol.events.condition.singleClick,
			style : new ol.style.Style({
				image : new ol.style.Icon(({
					opacity : 0.40,
					scale : 0.06,
					src : iconUrl,
				})),
			}),
		});

		map.addInteraction(select);
		select.on('select', function(e) {

			var selected = e.selected;
			var feature = null;

			if (selected.length) {
				selected.forEach(function(feature) {
					feature = feature;
					getSensor(feature, $http, $scope);
				});
			} else {
				$scope.$apply(function() {
					$scope.selSensor = null;
					$scope.sDateObs = new Date();
					$scope.eDateObs = new Date();
					$scope.optShow = false;
				});
			};
		});

		$scope.selectLocation = function() {
			var val = $scope.searchValue.replace(" ", "+");

			return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
				params : {
					address : val,
					sensor : false
				}
			}).then(
				function(response) {
					return response.data.results.map(function(item) {
						var lct = item.geometry.location;
						map.getView().setCenter(
								ol.proj.transform([ lct.lng, lct.lat ],
										'EPSG:4326', 'EPSG:3857'));
						map.getView().setZoom(5);
					});
				});
		};

		$scope.getLocation = function(val) {
			return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
				params : {
					address : val,
					sensor : false
				}
			}).then(
				function(response) {
					return response.data.results.map(function(item) {
						if (item.formatted_address.length > 35) {
							return item.formatted_address.substring(0, 35)
									.concat("...");
						} else {
							return item.formatted_address;
						}
					});
				});
		};

	};

}(window.angular, window.ol));
