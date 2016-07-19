;(function(angular, ol, undefined) {
    'use strict';

    angular
        .module('agora-geodash')
        .controller('HomeController', HomeController);

    function HomeController($log, $http) {
        $log.debug('HomeController');

        var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(({
            opacity: 0.75,
            scale: 0.05,
            src: iconUrl,
          })),
        });
        
        var vectorSource = new ol.source.Vector();
        var vector = new ol.layer.Vector({
          title: 'Sensors',
          source: vectorSource,
          style: iconStyle,
        });
       
        var map = new ol.Map({
            target: 'map',
            logo: false,
            controls: ol.control.defaults({
        		zoom: false,
        		attribution: false,
            }).extend([
				new ol.control.Zoom({
				    className: 'custom-zoom'
				}),
				new ol.control.LayerSwitcher(),
  		    ]),
            layers: [
	  			new ol.layer.Group({
	  			    'title': 'Base maps',
	  			    layers: [
	  					new ol.layer.Tile({
	  					  type: 'base',
	  					  title: 'OSM',	
	  					  visible: true,
	  					  source: new ol.source.OSM()
	  					}),
	  			    ],
	  			}),
	  			new ol.layer.Group({
	  			    'title': 'Overlaps',
	  			    layers: [
	  			       vector
	  			    ],
	  			}),
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([-47.890926, -22.008708]),
              zoom: 15,
              maxZoom: 19,
              minZoom: 4,
            }),
        });
        
        var f = ol.format.ogc.filter;
        var featureRequest = new ol.format.WFS().writeGetFeature({
          srsName: 'EPSG:3857',
          featureNS: 'http://www.agora.icmc.usp.br/agora',
          featurePrefix: 'agora',
          featureTypes: ['sensors'],
          outputFormat: 'application/json',
          geometryName : 'Point', 
          filter: ol.format.ogc.filter.equalTo('offering', 'GAUGE_HEIGHT')
        });

        fetch('http://www.agora.icmc.usp.br:8080/geoserver/agora/wfs', {
          method: 'POST',
          body: new XMLSerializer().serializeToString(featureRequest)
        }).then(function(response) {
          return response.json();
        }).then(function(json) {
          var features = new ol.format.GeoJSON().readFeatures(json);
          vectorSource.addFeatures(features);
        });
        
        var success = function(response) {
          alert(response.data.text);
        }

        $http.get("http://localhost:8080/hello/world").then(success)
    }

}(window.angular, window.ol));
