;(function(angular, ol, undefined) {
    'use strict';

    angular
        .module('agora-geodash')
        .controller('HomeController', HomeController);

    function HomeController($log) {
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
    }

}(window.angular, window.ol));
