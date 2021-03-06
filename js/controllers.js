'use strict';


Date.prototype.formatDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
  };




myApp.controller("Day" ,function ($scope, $sce,$rootScope,$location,UtilSrvc,jrgGoogleAuth,$http) {

  console.log("user....",$rootScope.user);


  if($rootScope.user==null){
    $location.path("home");
    return;
  }

    var d=new Date();
    var comments=[];
    d.setHours(12);
  	d.setMinutes(0);
  	d.setSeconds(0);
  	d.setMilliseconds(0);
  	$scope.d=d;
    $scope.showcomment=false;
  	convert();

     //get all the projects

    $http({
      method: 'GET',
      url: 'db/project/visible/1?by=slug&order=asc'
    }).then(function successCallback(response) {
        $scope.projects=response.data;

      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    gethours();





    $scope.add=function(){
        if(parseFloat(this.myhours)==0 || this.myhours==undefined) return;
      //  alert($scope.mycomment);
        //console.log($scope.p);
        var data={
            project_slug:this.p.slug,
            hours:this.myhours,
            day:$scope.day,
            user_id:$rootScope.user,
            comments:this.mycomment
        }

        this.myhours=null;
        this.mycomment=null;
        this.p.c=false;
        var scope=this;

        $http({
          method: 'POST',
          url: 'db/hours',
          data:data,

        }).then(function successCallback(response) {
            //refresh
             gethours();
             counthours(scope.p.slug);

          }, function errorCallback(response) {

          });



    }

    function getweekhours(){

        var scope=this;

        var user=$rootScope.user;
        var y=$scope.d.getFullYear();
        var w=$scope.d.getWeekNumber();

        $http({
          method: 'GET',
          url: "db/stats.php?option=week_user_get&w="+w+"&y="+y+"&user="+user
        }).then(function successCallback(response) {
            console.log("ja tinc el resultat",response.data);

              $scope.week_total=response.data.t;
          }, function errorCallback(response) {

          });



    }



 $scope.del=function(){


    if(this.h.id==0) return;
    var scope=this;


   $http({
          method: 'DELETE',
          url: 'db/hours/'+this.h.id

        }).then(function successCallback(response) {

             gethours();
             counthours(scope.h.project_slug);

          }, function errorCallback(response) {

          });

 }

 $scope.setcomment=function($index){

   $scope.projects[$index].c=1;

 }

 $scope.docomment=function($index){

   $scope.projects[$index].c=!$scope.projects[$index].c;
  // console.log($scope.mycomment[$index]);

   //$scope.showcomment=true;
 }

 function comments_load(slug, func){

   $http({
     method: 'GET',
     url: 'db/stats.php?option=comments_get_project&slug='+slug

       }).then(function successCallback(response) {
         comments[slug]=response.data;
         func();

               }, function errorCallback(response) {

               });
 }

 function comments_process(term,slug){

   var coms=comments[slug];
   var results = [];
   var q = term.toLowerCase().trim();
   var c=0;
   for(var i=0;i<coms.length;i++){

       if (coms[i].comments.toLowerCase().indexOf(q) != -1){
         //results.push({ label: state, value: state });
         results.push({ label: coms[i].comments, value: coms[i].comments });
         c++;
     }


   }

   if(c==0){
     for(var i=0;i<coms.length;i++){
           results.push({ label: coms[i].comments, value: coms[i].comments });
     }
     return results;
   }

      return results;
 }

 function suggest_comment(term) {
   //ajax call to get most used comments for the project but only first time
   //if(comments[''])

   var slug=$scope.projects[this.id].slug;

   if(comments[slug]==undefined){
     return comments_load(slug,function(){

       return comments_process(term,slug);

     });
   }
    return comments_process(term,slug);
  // var q = term.toLowerCase().trim();
   //var results = [];

   // Find first 10 states that start with `term`.
   /*
   for (var i = 0; i < states.length && results.length < 10; i++) {
     var state = states[i];
     if (state.toLowerCase().indexOf(q) === 0)
       results.push({ label: state, value: state });
   }
*/
//results.push({ label: "Blah", value: "Blah" });
//results.push({ label: "Blah", value: "Blah" });
//results.push({ label: "Blah", value: "Blah" });

   //return results;
 }

 $scope.autocomplete_options =function($index){
  return {
    suggest: suggest_comment,
    id:$index
  };

 };


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

    //simply counts the hours for the project, i know, it's not perfect

    function counthours(slug){
        console.log("counting hours");

            $http({
              method: 'GET',
              url: 'db/stats.php?option=count_hours&slug='+slug

                }).then(function successCallback(response) {
                        console.log("oo",response)

                        }, function errorCallback(response) {
                          console.log("ooo",response);
                        });


    }

    function gethours(){
            //get hours for current day

        getweekhours();


      $http({
        method: 'GET',
        url: 'db/hours/day/'+$scope.day
      }).then(function successCallback(response) {
        $scope.hours=new Array();
        //filter by current user
        $scope.total=0;

        for(var i=0;i<response.data.length;i++){
          var r=response.data[i];

          if( r.user_id==$rootScope.user ){

            if(r.hours % 1 == 0) r.hours=parseInt(r.hours);
            else r.hours=parseFloat(r.hours);
            $scope.hours.push(r);
            $scope.total+=parseFloat(r.hours);
          }

        }

      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }

    //todo d'un altre manera, servei?
    $scope.toColor=function(str){
      return toColor(str);
    }

    //$scope.day=$scope.day.formatDate();
    function convert(){
        $scope.day = $scope.d.toISOString().slice(0, 10);

        $scope.weekNumber=$scope.d.getWeekNumber();
        $scope.weekDay=$scope.d.getWeekDay();

        //demanar dades actuals a la api
    }

});


/**
Home
*/


myApp.controller("Home" ,function ($scope,$http,googleLogin,$rootScope,jrgGoogleAuth,localStorageService) {


  //  console.log("login",googleLogin);
  //googleLogin.doLogin($scope);

    //hardcoded

    //initialize google auth with client id
    // jrgGoogleAuth.init({'client_id':googleClientId, 'scope':'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'});
    jrgGoogleAuth.init({'client_id':config.googleClientId, 'scopeHelp':['login']});

    //do actual login
    var evtGoogleLogin ="evtGoogleLogin";


        $http({
          method: 'GET',
          url: 'db/stats.php?option=projects_get'
        }).then(function successCallback(response) {
            $scope.projects=response.data;

          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
          $http({
            method: 'GET',
            url: 'db/stats.php?option=weeks_get'
          }).then(function successCallback(response) {
              $scope.weeks=response.data;

            }, function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });



    $scope.googleLogin =function() {

        jrgGoogleAuth.login({'extraInfo':{'user_id':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });
        console.log(jrgGoogleAuth);
    };

     $scope.googleLogout=function() {

        //jrgGoogleAuth.logout();
        localStorageService.remove('user');
        $rootScope.user=null;

    };

    console.log("assignant usuari al rootScope");
    $rootScope.user=localStorageService.get('user');



    $scope.googleInfo;


    $scope.$on(evtGoogleLogin, function(evt, googleInfo) {
        $scope.googleInfo =googleInfo;
        $rootScope.googleInfo=googleInfo;
        localStorageService.set('user',slugify(googleInfo.rawData.displayName));
         $rootScope.user=localStorageService.get('user');
    });
    //$scope.googleLogin();

    //todo d'un altre manera, servei?
    $scope.toColor=function(str){
      return toColor(str);
    }



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
//(year:search.year,user:search.user,comments:search.comments)

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

    //todo d'un altre manera, servei?
    $scope.toColor=function(str){
      return toColor(str);
    }
});


var users;

myApp.controller("Project" ,function ($scope,$routeParams,$rootScope,$location,localStorageService,$http) {
    var project=$routeParams.slug;
    $scope.project={};
    $scope.project.slug="";

    $scope.day="";
    $scope.user_id="";
    $scope.comments="";
    $scope.total=0;

    //todo , maybe in the db





    $http({
      method: 'GET',
      url: 'db/stats.php?option=project_one_get&slug='+project
    }).then(function successCallback(response) {
        $scope.project=response.data;
          $scope.project.rate=parseInt($scope.project.budget/$scope.project.total);
      }, function errorCallback(response) {

      });


    $http({
      method: 'GET',
      url: 'db/stats.php?option=project_get&slug='+project
    }).then(function successCallback(response) {
        users=[];

        $scope.hours=response.data;

        for(var i=0;i<$scope.hours.length;i++){
          $scope.hours[i].visible=true;
          if( users[$scope.hours[i].user_id]==undefined){
            users[$scope.hours[i].user_id]=parseFloat($scope.hours[i].hours);
          }else{
            users[$scope.hours[i].user_id]+=parseFloat($scope.hours[i].hours);
          }
        };
        var data=[];
        var i=0;
        for (var key in users) {
          data[i]={x:i+1,y:users[key]};

        //  users[i]=key;
            i++;
       }

       for (var key in users) {
         users.push({name:key,h:users[key]});

       }
       $scope.users=users;



        //console.log(users);
        //
        //var data = [{ x: 1, y: 1 }, { x: 2, y: 3 }];
        doGraph(data);

          countAll();
      }, function errorCallback(response) {

      });

      $scope.saveproject=function(){
        console.log($scope.project);
        var data={
            slug:$scope.project.slug,
            comments:$scope.project.comments,
            visible:$scope.project.visible,
            budget:$scope.project.budget
        }
        $http({
          method: 'PUT',
          url: 'db/project/'+$scope.project.id,
          data:data,

        }).then(function successCallback(response) {
          //  refresh();
          console.log("refrescat",response);

          }, function errorCallback(response) {
            console.log("error al guardar",response);
          });


      };

      $scope.dofilter=function(){
        for(var i=0;i<$scope.hours.length;i++){
          $scope.hours[i].visible=true;
        };


        console.log($scope.day,$scope.user_id,$scope.comments);

        //year
        if($scope.day!=""){
          for(var i=0;i<$scope.hours.length;i++){
            var h=$scope.hours[i];

            if(h.day.indexOf($scope.day)==-1){
              $scope.hours[i].visible=false;
            }
          };
        }

        //user_id
        if($scope.user_id!=""){
          for(var i=0;i<$scope.hours.length;i++){
            var h=$scope.hours[i];

            if(h.user_id.indexOf($scope.user_id)==-1){
              $scope.hours[i].visible=false;
            }
          };
        }

        //comments
        if($scope.comments!=""){
          for(var i=0;i<$scope.hours.length;i++){
            var h=$scope.hours[i];
            if(h.comments==undefined){
              $scope.hours[i].visible=false;
            }else{
              if(h.comments.indexOf($scope.comments)==-1){
                $scope.hours[i].visible=false;
              }
            }
          };
        }

        countAll();
      }

      function countAll(){
        var t=0;
        for(var i=0;i<$scope.hours.length;i++){
          if($scope.hours[i].visible)
            t+=parseFloat($scope.hours[i].hours);
        }
        $scope.total=t;
      }



    $scope.toColor=function(str){
      return toColor(str);
    }

});



myApp.controller("Test" ,function ($scope,$http,googleLogin,$rootScope,jrgGoogleAuth,localStorageService) {

  googleLogin.doLogin(this);

});
