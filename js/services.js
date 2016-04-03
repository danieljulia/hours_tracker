"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here. 
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
myApp.value('version', '0.1');

// EXAMPLE OF CORRECT DECLARATION OF SERVICE
// here is a declaration of simple utility function to know if an given param is a String.
myApp.service("UtilSrvc", function () {
    return {
        isAString: function(o) {
            return typeof o == "string" || (typeof o == "object" && o.constructor === String);
        },
        helloWorld : function(name) {
        	var result = "Hum, Hello you, but your name is too weird...";
        	if (this.isAString(name)) {
        		result = "Hello, " + name;
        	}
        	return result;
        }
    }
});


/*
myApp.service("GoogleLogin", function (jrgGoogleAuth) {

    var googleClientId ='710387660045-ag7s6vlti2t9rchvil0a987i9gv8p135.apps.googleusercontent.com';     //hardcoded
    var info;

    //initialize google auth with client id
    // jrgGoogleAuth.init({'client_id':googleClientId, 'scope':'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'});
    jrgGoogleAuth.init({'client_id':googleClientId, 'scopeHelp':['login']});

    //do actual login
    var evtGoogleLogin ="evtGoogleLogin";

    evtGoogleLogin, function(evt, googleInfo) {
            info =googleInfo;
            console.log("ja tinc la info",googleInfo);
    };



    return {

        doLogin :function() {
           
            jrgGoogleAuth.login({'extraInfo':{'user_id':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });

        },
        getInfo:function(){
            return info;
        }

    }

});*/