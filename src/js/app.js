var b = 2;
;(function(window, document, angular, undefine) {
    'use strict';

    var a = 1;

    var app = angular
    	.module('agora-geodash', [
            'ngRoute', 'ui.bootstrap', 'ngAnimate', 'ui.bootstrap.datetimepicker'
        ])

        .constant('initUrl', 'http://localhost/AGORA-GeoDash-client/src/')
        
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
        });
        
}(window, window.global, window.angular));
