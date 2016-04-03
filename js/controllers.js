'use strict';


Date.prototype.formatDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
  };




myApp.controller("Day" ,function ($scope, $rootScope,$location,UtilSrvc,jrgGoogleAuth,$http) {

  if($rootScope.user==null){
    $location.path("home");
    return;
  }

    $scope.aVariable = 'anExampleValueWithinScope';
    $scope.valueFromService = UtilSrvc.helloWorld("Amy");

    var d=new Date();
    d.setHours(12);
	d.setMinutes(0);
	d.setSeconds(0);
	d.setMilliseconds(0);
	$scope.d=d;
	convert();

    
	
     //get all the projects

    $http({
      method: 'GET',
      url: 'db/project/visible/1'
    }).then(function successCallback(response) {
        $scope.projects=response.data;
        console.log(response.data);
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    gethours();
    


    $scope.submit=function(){
     
        var data={
            project_slug:$scope.myprojects,
            hours:$scope.myhours,
            day:$scope.day,
            user_id:$rootScope.user
        }
        $http({
          method: 'POST',
          url: 'db/hours',
          data:data,
          
        }).then(function successCallback(response) {
            //refresh
             gethours();
             $scope.myprojects=null;
             $scope.myhours=null;

          }, function errorCallback(response) {
            console.log(response);
          });



    }
 $scope.del=function(){
   $http({
          method: 'DELETE',
          url: 'db/hours/'+this.h.id
        
        }).then(function successCallback(response) {
           
             gethours();

          }, function errorCallback(response) {
            console.log(response);
          });

 }

    $scope.next=function(){
    	$scope.d.setDate($scope.d.getDate() + 1);
    	convert();
        gethours();
    }
    $scope.prev=function(){
    	$scope.d.setDate($scope.d.getDate() - 1);
    	convert();
         gethours();
    }
     $scope.nextWeek=function(){
    	$scope.d.setDate($scope.d.getDate() + 7);
    	convert();
         gethours();
    }
    $scope.prevWeek=function(){
    	$scope.d.setDate($scope.d.getDate() - 7);
    	convert();
         gethours();
    }

    //private functions

    function gethours(){
            //get hours for current day

      $http({
        method: 'GET',
        url: 'db/hours/day/'+$scope.day
      }).then(function successCallback(response) {
        $scope.hours=new Array();
        //filter by current user
        console.log("recuperant hores..",response.data);
        for(var i=0;i<response.data.length;i++){
          var r=response.data[i];
          console.log(r);
          if( r.user_id==$rootScope.user ){
            $scope.hours.push(r);
          
          }

        }
        console.log(response.data);
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
    

    //$scope.day=$scope.day.formatDate();
    function convert(){
        $scope.day = $scope.d.toISOString().slice(0, 10);
        
        $scope.weekNumber=$scope.d.getWeekNumber();
        $scope.weekDay=$scope.d.getWeekDay();

        //demanar dades actuals a la api
    }

});




myApp.controller("Home" ,function ($scope,$rootScope,jrgGoogleAuth,localStorageService) {

    //hardcoded
    
    //initialize google auth with client id
    // jrgGoogleAuth.init({'client_id':googleClientId, 'scope':'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'});
    jrgGoogleAuth.init({'client_id':config.googleClientId, 'scopeHelp':['login']});

    //do actual login
    var evtGoogleLogin ="evtGoogleLogin";
 
    


    $scope.googleLogin =function() {
       
        jrgGoogleAuth.login({'extraInfo':{'user_id':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });
    };

     $scope.googleLogout=function() {
       
        //jrgGoogleAuth.logout();
        localStorageService.remove('user');
        $rootScope.user=null;

    };

    $rootScope.user=localStorageService.get('user');
    

    
    $scope.googleInfo;


    $scope.$on(evtGoogleLogin, function(evt, googleInfo) {
        $scope.googleInfo =googleInfo;
        console.log("ja tinc la info",googleInfo);
        localStorageService.set('user',slugify(googleInfo.rawData.displayName));
         $rootScope.user=localStorageService.get('user');
    });
    //$scope.googleLogin();
    
   
    function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}


});

myApp.controller("Projects" ,function ($scope,$rootScope,$location,localStorageService,$http) {
  
 if($rootScope.user==null){
    $location.path("home");
    return;
  }


refresh();
    function refresh(){
        $http({
      method: 'GET',
      url: 'db/project/visible/1'
    }).then(function successCallback(response) {
        $scope.projects=response.data;
       
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    $http({
      method: 'GET',
      url: 'db/project/visible/0'
    }).then(function successCallback(response) {
        $scope.projects_hidden=response.data;
       
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    }
    

    $scope.hide = function() {
            console.log(this.p.slug);
    $http({
      method: 'PUT',
      url: 'db/project/'+this.p.id,
      data:{
        visible:0
      }
    }).then(function successCallback(response) {
        
        refresh();
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }


    $scope.show = function() {
            console.log(this.p.slug);
    $http({
      method: 'PUT',
      url: 'db/project/'+this.p.id,
      data:{
        visible:1
      }
    }).then(function successCallback(response) {
        
        refresh();
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }


    $scope.submit=function(){
     
        var data={
            slug:$scope.project,
            comments:'',
        
        }
        $http({
          method: 'POST',
          url: 'db/project',
          data:data,
          
        }).then(function successCallback(response) {
            refresh();

          }, function errorCallback(response) {
            console.log(response);
          });



    }

});
