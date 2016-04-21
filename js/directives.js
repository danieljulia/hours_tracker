"use strict";

myApp.directive('inputtext', function ($timeout) {
    return {
        restrict:'E',
        replace:true,
        template:'<input type="text"/>',
        scope: {
        	//if there were attributes it would be shown here
        },
        link:function (scope, element, attrs, ctrl) {
        	// DOM manipulation may happen here.
        }
    }
});


/** i don't get it
myApp.directive('hour', function ($timeout) {
    return {
        restrict:'AE',
        replace:true,
        templateUrl: 'partials/hour.html',

        scope: {
        	//if there were attributes it would be shown here

        },
        link:function (scope, element, attrs, ctrl) {
        	// DOM manipulation may happen here.
          console.log("link",scope);
          scope.$on("click", function (e, msg) {
           console.log(e,msg);
         });

        }
    }
});
*/


myApp.directive('version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
});

// you may add as much directives as you want below
