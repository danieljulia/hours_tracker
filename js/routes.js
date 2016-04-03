'use strict';

var myApp = angular.module('myApp', [
    //additional angular modules
'googleauth','LocalStorageModule'
])

myApp.config(function($routeProvider) {
     $routeProvider.when(
        '/home', 
        {
            templateUrl: 'partials/home.html', 
            controller: 'Home'
        });
    $routeProvider.when(
    	'/hours', 
    	{
    		templateUrl: 'partials/day.html', 
    		controller: 'Day'
    	});
    $routeProvider.when(
    	'/projects', 
    	{
    		templateUrl: 'partials/projects.html', 
    		controller: 'Projects'
    	});
    $routeProvider.otherwise(
        {
            redirectTo: '/hours'
        });
});
