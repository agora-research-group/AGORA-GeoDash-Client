;(function(window, document, angular, undefine) {
    'use strict';

    angular
        .module('agora-geodash', [
            'ngRoute'
        ])

        .config(function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/home.html'
                })
                .otherwise({
                    templateUrl: '/404.html'
                });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        })

        .config(function($logProvider) {
            $logProvider.debugEnabled(true);
        })

        .run(function($log) {
            $log.info('Running agora-geodash');
        })
}(window, window.global, window.angular));
