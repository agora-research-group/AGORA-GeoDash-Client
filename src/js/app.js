var b = 2;
;(function(window, document, angular, undefine) {
    'use strict';

    var a = 1;

    var app = angular
    	.module('agora-geodash', [
            'ngRoute', 'ui.bootstrap', 'ngAnimate', 'ui.bootstrap.datetimepicker', 'angular-table', 
            'angular-confirm', 'ngMaterial'
        ])

        .config(function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/home.html'
                })
                .when('/ListDecisions', {
                    templateUrl: 'views/list_decision.html'
                })
                .when('/NewDecision', {
                    templateUrl: 'views/new_decision.html'
                })
                .when('/EditDecision/:id', {
                    templateUrl: 'views/edit_decision.html'
                })
                .when('/ListInfoReqs', {
                    templateUrl: 'views/list_inforeq.html'
                })
                .when('/NewInfoReq', {
                    templateUrl: 'views/new_inforeq.html'
                })
                .when('/EditInfoReq/:id', {
                    templateUrl: 'views/edit_inforeq.html'
                })
                .when('/ListDataSources', {
                    templateUrl: 'views/list_datasource.html'
                })
                .when('/NewDataSource', {
                    templateUrl: 'views/new_datasource.html'
                })
                .when('/EditDataSource/:id', {
                    templateUrl: 'views/edit_datasource.html'
                })
                .otherwise({
                    templateUrl: '/views/home.html'
                });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
        })

        .config(function($logProvider) {
            $logProvider.debugEnabled(true);
        })

        .run(function($log) {
            $log.info('Running agora-geodash');
        });
        
}(window, window.global, window.angular));
