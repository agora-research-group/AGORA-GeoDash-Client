;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('HomeController', HomeController);

	function getObservation(feature, http, scope) {
		var success = function(response) {
			alert(response.data.text);
		}

		http.post('http://localhost:8080/sos/describesensor')
			.then(function(response) {
				return response.data;
			}, function(errResponse) {
				console.error('Error');
				// return $q.reject(errResponse);
			});
		
		var chartSeries = [{"name": "Some data", "data": [1, 2, 4, 7, 3]}];
		
		Highcharts.chart('chart', {
			options: {
		      chart: {
		        type: 'areaspline',
		        renderTo: 'chart',
		        events: {
	                load: function () {
	                    alert('The chart is being redrawn');
	                }
	            }
		      },
		      plotOptions: {
		        series: {
		          stacking: ''
		        }
		      }
		    },
		    legend: {
		    	backgroundColor: '#FCFFC5'
	        },
		    series: chartSeries,
		    title: {
		      text: ''
		    },
		    credits: {
		      enabled: false
		    },
		    loading: false,
		    yAxis: {
		    	title: {
		    		text: "Values (cm)"
		    	}
		    }
		});
		
	};

	function HomeController($scope, $http, $log) {
		$log.debug('HomeController');

		$scope.isOpenFrom = false;
		$scope.isOpenFromTo = false;
		$scope.isSetOpen = false;
		
		$scope.openSettings = function() {
	        $scope.isSetOpen = true;
	    };
	    
	    $scope.closeSettings = function() {
    		$scope.isSetOpen = false;
	    };
		
		$scope.openCalendarFrom = function(e) {
	        e.preventDefault();
	        e.stopPropagation();

	        $scope.isOpenFrom = true;
	    };
	    
	    $scope.openCalendarTo = function(e) {
	        e.preventDefault();
	        e.stopPropagation();

	        $scope.isOpenTo = true;
	    };

	    var twitterSource = new ol.source.Vector();
		var twitter = new ol.layer.Vector({
			title : 'Twitter',
			source : twitterSource,
			style : new ol.style.Style({
				image : new ol.style.Icon(({
					opacity : 0.75,
					scale : 1,
					src : twitterUrl,
				})),
			}),
		});
	    
		var cemadenSource = new ol.source.Vector();
		var cemaden = new ol.layer.Vector({
			title : 'Cemaden',
			source : cemadenSource,
			style : new ol.style.Style({
				image : new ol.style.Icon(({
					opacity : 0.75,
					scale : 0.30,
					src : cemadenUrl,
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
					scale : 0.05,
					src : iconUrl,
				})),
			}),
		});
		
		var vectorSource = new ol.source.Vector();
		var vector = new ol.layer.Vector({
			title : 'Sensors',
			source : vectorSource,
			style : new ol.style.Style({
				image : new ol.style.Icon(({
					opacity : 0.75,
					scale : 0.05,
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
				layers : [ vector, cemaden, cemadenHy, twitter ],
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
			featureTypes : [ 'sensors' ],
			outputFormat : 'application/json',
			geometryName : 'Point',
			filter : ol.format.ogc.filter.equalTo('offering', 'GAUGE_HEIGHT')
		});

		fetch('http://www.agora.icmc.usp.br:8080/geoserver/agora/wfs', {
			method : 'POST',
			body : new XMLSerializer().serializeToString(featureRequest)
		}).then(function(response) {
			return response.json();
		}).then(function(json) {
			var features = new ol.format.GeoJSON().readFeatures(json);
			vectorSource.addFeatures(features);
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
		
		var f = ol.format.ogc.filter;
		var featureRequest = new ol.format.WFS().writeGetFeature({
			srsName : 'EPSG:3857',
			featureNS : 'http://www.agora.icmc.usp.br/agora',
			featurePrefix : 'agora',
			featureTypes : [ 'saopauloprioritization_tweets' ],
			outputFormat : 'application/json',
			geometryName : 'Point',
			filter : ol.format.ogc.filter.equalTo('id_str', '712978920128249857'),
			
		});

		fetch('http://www.agora.icmc.usp.br:8080/geoserver/agora/wfs', {
			method : 'POST',
			body : new XMLSerializer().serializeToString(featureRequest)
		}).then(function(response) {
			return response.json();
		}).then(function(json) {
			var features = new ol.format.GeoJSON().readFeatures(json);
			twitterSource.addFeatures(features);
			console.log(features);
		});

		// select interaction working on "click"
		var select = new ol.interaction.Select({
			condition : ol.events.condition.singleClick,
			style : new ol.style.Style({
				image : new ol.style.Icon(({
					opacity : 0.40,
					scale : 0.05,
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
					$scope.optShow = true;
					getObservation(feature, $http, $scope);
				});
			} else {
				$scope.$apply(function() {
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

	}

}(window.angular, window.ol));
