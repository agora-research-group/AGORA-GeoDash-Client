;(function(angular, ol, undefined) {
    'use strict';

    angular
        .module('agora-geodash')
        .controller('HomeController', HomeController);

    function HomeController($log, $http) {
        $log.debug('HomeController');

        var map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([-47.890926, -22.008708]),
            zoom: 15,
            maxZoom: 19,
            minZoom: 4
          })
        });

        var success = function(response) {
          alert(response.data.text);
        }

        $http.get("http://localhost:8080/hello/world").then(success)
    }

}(window.angular, window.ol));
