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



/**
https://github.com/jackrabbitsgroup/angular-google-auth/blob/master/google-auth.js
*/


myApp.factory('googleLogin', function(jrgGoogleAuth){
  var login={};

  jrgGoogleAuth.init({'client_id':config.googleClientId, 'scopeHelp':['login']});


  login.doLogin=function($scope){
    //console.log("here we have the scope",gapi,jrgGoogleAuth,$scope);
    var evtGoogleLogin ="evtGoogleLogin";
    $scope.googleLogin =function() {
      console.log("jrg",jrgGoogleAuth,gapi);
        jrgGoogleAuth.login({'extraInfo':{'user_id':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });
    };
  //  jrgGoogleAuth.login({'extraInfo':{'user_id':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });
    $scope.$on(evtGoogleLogin, function(evt, googleInfo) {
      console.log("Google login",evt,googleInfo);
      //  login.googleInfo =googleInfo;
          console.log("*****",login.googleInfo.user);

    });

  }

/*
  $scope.googleLogin =function() {
    console.log("jrg",jrgGoogleAuth,gapi);
      jrgGoogleAuth.login({'extraInfo':{'user_id':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });
  };

  $scope.googleLogout=function() {

  };

  $scope.$on(evtGoogleLogin, function(evt, googleInfo) {
    console.log("Google login",evt,googleInfo);
      login.googleInfo =googleInfo;
  });
*/
  //$scope.googleLogin();

  return login;
});



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
      /*
      $routeProvider.when(
        '/project/test',
        {
          templateUrl: 'partials/project.html',
          controller: 'Project'
        });*/
        $routeProvider.when(
          '/test',
          {
            templateUrl: 'partials/test.html',
            controller: 'Test'
          });

      $routeProvider.when(
        '/project/:slug',
        {
          templateUrl: 'partials/project.html',
          controller: 'Project'
        });
    $routeProvider.otherwise(
        {
            redirectTo: '/hours'
        });
});
