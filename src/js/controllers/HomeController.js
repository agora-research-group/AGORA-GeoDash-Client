;
(function(angular, ol, undefined) {
	'use strict';

	angular.module('agora-geodash')
			.controller('HomeController', HomeController);

	function getSensor(feature, $http, $scope) {
		$scope.start();

		$http({
			url : 'http://localhost:8080/sensor/find',
			method : 'POST',
			data : feature.i,
			header : {
				'content-type' : 'application/json'
			}
		}).success(function(response) {
			$scope.selSensor = response;
			getProperty($scope, $http, feature)
		}).error(function(error) {
			console.log('error' + error);
		});

	};

	function getProperty($scope, $http, feature) {
		$http({
			url : 'http://localhost:8080/sensor/listProperty',
			method : 'POST',
			data : feature.i,
			header : {
				'content-type' : 'application/json'
			}
		}).success(function(response) {
			$scope.properties = response;
			$scope.selectedProperty = $scope.properties[0];
			$scope.complete();
			$scope.optShow = true;
		}).error(function(error) {
			console.log('error' + error);
		});
	}

	function HomeController($scope, $http, $log, cfpLoadingBar, $mdDialog) {
		$log.debug('HomeController');

		$scope.myControl = new app.CustomToolbarControl();
		$scope.selSensor = null;
		$scope.decisions = [];
		$scope.selectedDecision = null;
		$scope.properties = [];
		$scope.selectedProperty = null;
		$scope.sDateObs = new Date();
		$scope.eDateObs = new Date();
		$scope.observations = [];

		$scope.start = function() {
			cfpLoadingBar.start();
		};

		$scope.complete = function() {
			cfpLoadingBar.complete();
		}

		$scope.openSettings = function() {
			$scope.isSetOpen = true;
		};

		$scope.closeSettings = function() {
			$scope.isSetOpen = false;
		};

		$scope.configureSensor = function(ev) {
			$mdDialog.show({
				templateUrl : 'templates/configure_sensor.tmpl.html',
				parent : angular.element(document.body),
				targetEvent : ev,
				clickOutsideToClose : false,
				controller : 'ConfigureSensorController',
				locals : {
					feature : $scope.selSensor,
					fProperties : $scope.properties,
				},
			});
		}

		$scope.filter = function(ev) {
			$http({
				url : 'http://localhost:8080/sensor/getObservation',
				method : 'POST',
				data : {
					id : $scope.selSensor.id,
					sDate : $scope.sDateObs,
					eDate : $scope.eDateObs,
					property : $scope.selectedProperty.stype
				},
				header : {
					'content-type' : 'application/json'
				}
			}).success(function(response) {
				$scope.observations = response;

				$mdDialog.show({
					templateUrl : 'templates/list_observation.tmpl.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					locals : {
						selSensor : $scope.selSensor,
						sDateObs : $scope.sDateObs,
						eDateObs : $scope.eDateObs,
						observations : response,
					},
					controller : 'ListObservationController',
					onComplete : function() {
						$scope.drawChart();
					}
				});
			}).error(function(error) {
				console.log('error' + error);
			});
		};

		$scope.drawChart = function() {
			var axisX = [];
			var axisY = [];

			for (var i = 0; i < $scope.observations.length; i++) {
				if ($scope.observations[i].measure == null) {
					axisY.push(0);
				} else {
					axisY.push($scope.observations[i].measure);
				}

				axisX.push($scope.observations[i].date + " "
						+ $scope.observations[i].time);
			}

			var chartSeries = [ {
				"name" : $scope.selSensor.id,
				"data" : axisY
			} ];

			Highcharts.chart('container', {
				options : {
					chart : {
						type : 'areaspline',
						renderTo : 'container',
						events : {
							load : function() {
								alert('The chart is being redrawn');
							}
						}
					},
					plotOptions : {
						series : {
							stacking : ''
						},
					}
				},
				xAxis : {
					categories : axisX
				},
				legend : {
					backgroundColor : '#FCFFC5'
				},
				series : chartSeries,
				title : {
					text : ''
				},
				credits : {
					enabled : false
				},
				loading : false,
				yAxis : {
					title : {
						text : "(cm)"
					}
				}
			});
		}

		var selectDrill = new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : [123,166,180,0.2],
				width : 3
			}),
			fill: new ol.style.Fill({
	          color: [163, 163, 194, 0.3]
	        }),
		});

		var selectSensor = new ol.style.Style({
			image : new ol.style.Icon(({
				opacity : 0.40,
				scale : 0.06,
				src : iconUrl,
			})),
		});

		var defaultDrill = new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : [0, 0, 0, 1],
				width : 4
			}),
			fill: new ol.style.Fill({
	          color: [71, 71, 107, 0.3]
	        }),
		});

		var defaultSensor = new ol.style.Style({
			image : new ol.style.Icon(({
				opacity : 0.75,
				scale : 0.06,
				src : iconUrl,
			})),
		});

		var regionsSource = new ol.source.Vector();
		var regions = new ol.layer.Vector({
			title : 'Regions',
			source : regionsSource,
			style : defaultDrill,
			opacity: 0.15,
		});
		
		var statesSource = new ol.source.Vector();
		var states = new ol.layer.Vector({
			title : 'States',
			source : statesSource,
			style : defaultDrill,
			visible: false,
			opacity: 0.15,
		});
		
		var citiesSource = new ol.source.Vector();
		var cities = new ol.layer.Vector({
			title : 'Cities',
			source : citiesSource,
			style : defaultDrill,
			visible: false,
			opacity: 0.15,
		});

		var cemadenSource = new ol.source.Vector();
		var cemaden = new ol.layer.Vector({
			title : 'Rainfall Gauges',
			source : cemadenSource,
			style : defaultSensor,
			visible: false,
		});

		var cemadenHySource = new ol.source.Vector();
		var cemadenHy = new ol.layer.Vector({
			title : 'Hydrological Stations',
			source : cemadenHySource,
			style : defaultSensor,
			visible: false,
		});
		
		var container = document.getElementById('popup');
		var content = document.getElementById('popup-content');
		
		var overlay = new ol.Overlay({
			element: container
		});

		var map = new ol.Map({
			target : 'map',
			logo : false,
			controls : ol.control.defaults({
				zoom : false,
				attribution : false,
				attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			      collapsible: false
			    })
			}).extend([ new ol.control.Zoom({
				className : 'custom-zoom'
			}), new ol.control.LayerSwitcher(), 
			]),
			overlays: [overlay],
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
				layers : [ regions, states, cities, cemaden, cemadenHy, ],
			}), ],
			view : new ol.View({
				center : ol.proj.fromLonLat([ -51.913371, -14.311100 ]),
				zoom : 5,
				maxZoom : 19,
				minZoom : 4,
			}),
		});
		
		getFeatures(null, "regioes", regionsSource, null, null);
		getFeatures(null, "estados", statesSource, null, null);
		getFeatures(null, "municipios", citiesSource, null, null);
		getFeatures(ol.format.ogc.filter.equalTo('stype', 'H'), "cemaden_stations", cemadenHySource, null, null);
		getFeatures(ol.format.ogc.filter.equalTo('stype', 'P'), "cemaden_stations", cemadenSource, null, null);
		
		var select = new ol.interaction.Select({
			condition : ol.events.condition.singleClick,
			layers : [ cemaden, cemadenHy, regions, states, cities ],
			style : [ selectSensor, selectDrill ],
		});
		
		map.addInteraction(select);

		select.on('select', function(e) {
			var selected = e.selected;
			var feature = null;
			var layer = null;
			
			if (selected.length) {
				selected.forEach(function(feature) {
					feature = feature;
					layer = getLayer(feature, map);
					
					if (layer == "Rainfall Gauges" || layer == "Hydrological Stations") {
						
						$scope.sDateObs = new Date();
						$scope.eDateObs = new Date();
						getSensor(feature, $http, $scope);
					} else if (layer == "Regions" ) {
						
						map.addControl($scope.myControl);
						
						$scope.start();
						statesSource.clear();
						getFeatures(ol.format.ogc.filter.equalTo('regiao_id', feature.U.id), "estados", statesSource, null, map);
						states.setVisible(true);
						regions.setVisible(false);
						$scope.complete();
					} else if (layer == "States" ) {
						
						$scope.start();
						citiesSource.clear();
						getFeatures(ol.format.ogc.filter.equalTo('estado_id', feature.U.id), "municipios", citiesSource, null, map);
						cities.setVisible(true);
						states.setVisible(false);
						$scope.complete();
						
					} else if (layer == "Cities" ) {
						
						var featuresA = [];
						featuresA.push(feature);
						
						$scope.start();
						cemadenSource.clear();
						getFeatures(ol.format.ogc.filter.and (
							ol.format.ogc.filter.equalTo('codigo_ibg', feature.U.codigo_ibg),
							ol.format.ogc.filter.equalTo('stype', 'P')
						), "cemaden_stations", cemadenSource, null);
						
						cemadenHySource.clear();
						getFeatures(ol.format.ogc.filter.and (
							ol.format.ogc.filter.equalTo('codigo_ibg', feature.U.codigo_ibg),
							ol.format.ogc.filter.equalTo('stype', 'H')
						), "cemaden_stations", cemadenHySource, null);
						
						cities.setVisible(false);
						cemaden.setVisible(true);
						cemadenHy.setVisible(true);
						
						$scope.complete();
						
						map.getView().fit(feature.getGeometry(), map.getSize());
					}
				});
			} else {
				$scope.$apply(function() {
					map.removeControl($scope.myControl);
					
					$scope.selSensor = null;
					$scope.sDateObs = new Date();
					$scope.eDateObs = new Date();
					$scope.optShow = false;
					
					getFeatures(null, "regioes", regionsSource, null, null);
					getFeatures(null, "estados", statesSource, null, null);
					getFeatures(null, "municipios", citiesSource, null, null);
					getFeatures(ol.format.ogc.filter.equalTo('stype', 'H'), "cemaden_stations", cemadenHySource, null, null);
					getFeatures(ol.format.ogc.filter.equalTo('stype', 'P'), "cemaden_stations", cemadenSource, null, null);
					
					cemaden.setVisible(false);
					cemadenHy.setVisible(false);
					cities.setVisible(false);
					states.setVisible(false);
					regions.setVisible(true);
					
					var extent1 = ol.extent.createEmpty();
					ol.extent.extend(extent1, regions.getSource().getExtent());
					map.getView().fit(extent1, map.getSize());
				});
			};
		});
		
		map.on('pointermove', function (evt) {
			var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
				return feature;
			});
			if (feature) {
				
				if (feature.U.nome == undefined) {
					content.innerHTML = feature.U.name + " - " + feature.U.city + "/" + feature.U.state;
				} else {
					content.innerHTML = feature.U.nome;
				}
				
			    overlay.setPosition(evt.coordinate);
			} else {
				overlay.setPosition(undefined);
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
							map.getView().setCenter(ol.proj.transform([ lct.lng, lct.lat ],
									'EPSG:4326', 'EPSG:3857'));
							map.getView().setZoom(10);
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
	;

}(window.angular, window.ol));