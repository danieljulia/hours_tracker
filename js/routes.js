'use strict';

var myApp = angular.module('myApp', [
    //additional angular modules
'googleauth','LocalStorageModule'
])


angular.module('myApp').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                    //console.log(event);
                   // event.srcElement.next().focus();
                }
            });
        };
    });

/*
// override the default input to update on blur
myApp.directive('ngModelOnblur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 100, // needed for angular 1.2.x
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });         
            });
        }
    };
});
*/


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
