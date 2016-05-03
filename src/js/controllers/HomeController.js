;(function(angular) {
    'use strict';

    angular
        .module('agora-geodash')
        .controller('HomeController', HomeController);

    function HomeController($log) {
        $log.debug('HomeController')
    }

}(window.angular));
