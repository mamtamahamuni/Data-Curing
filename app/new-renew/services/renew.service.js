/**   
	Module: Renew Service (Includes GET & POST HTTP Request Functions, Common Filters And Directives Used For Renew)
	Author: Pandurang Sarje 
    Date: 01-07-2020
**/

app.factory("RenewService", ['$http', '$rootScope', '$route', '$location', 'ABHI_CONFIG', '$sessionStorage', '$localStorage', function ($http, $rootScope, $route, $location, ABHI_CONFIG, $sessionStorage, $localStorage, $q) {

    /*---- Data Inilization ----*/

    var obj = {};
// ***************2 coat dev start***********************//
    obj.isStart = true;
    obj.CalltimerSwitch;
// ***************2 coat dev end***********************//

    /*---- End of Data Inilization ----*/

    /*---- Get Request Function  ----*/

    obj.getData = function (q, loader) {

        $rootScope.showLoader = loader;

        var headers = {
            'x-ob-at': 'p0tzzQYkT70L2WSN9hwyHw0ZHHRfpeC4oy1tsufl71IKATgkh1rjofuhEi8Ul4vYwoJHqhO7S4qvdEzE',
            'Content-Type': 'application/json'
        }

        var req = {
            method: 'GET',
            url: q,
            headers: headers
        };

        return $http(req).then(function (results) {
            $rootScope.showLoader = false;
            return results.data;
        }, function (error) {
            console.log(error);
            $rootScope.showLoader = false;
        })
    }

    /*---- End of Get Request Function  ----*/

    /*---- Post Request Function ----*/

    obj.postData = function (q, data, loader, config) {

        $rootScope.showLoader = loader;

        var headers = {
            'x-ob-at': 'p0tzzQYkT70L2WSN9hwyHw0ZHHRfpeC4oy1tsufl71IKATgkh1rjofuhEi8Ul4vYwoJHqhO7S4qvdEzE',
            'Content-Type': 'application/json'
            //'x-ob-ut': sessionStorage.getItem('ut'),
            //'x-ob-bypass': '1'
        }

        var req = {
            method: 'POST',
            url: q,
            data: data,
            headers: config ? config : headers
        };

        return $http(req).then(function (results) {
            $rootScope.showLoader = false;
            if (results.data.ResponseCode == 401) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Request Unauthorized..!!",
                    "showCancelBtn": false,
                    "modalSuccessText": "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function () {
                        $location.url('renewal-renew-policy');
                    }
                }
            }
            return results.data;
        }, function (error) {
            console.log(error);
            $rootScope.showLoader = false;
        })
    }

    /*---- End of Post Request Function ----*/

    obj.litmusCode = function(memberid,type,username,module_type,module_name) {
        /* if (window.addEventListener) {
           window.addEventListener("message", onMessage(), false);
         }
         else if (window.attachEvent) {
           window.attachEvent("onmessage", onMessage(), false);
         }*/
         
         
         var userDetails = {
            // "appId": "g3wj_touchpoint", //currently points to staging. Needs to be changed for production.  
             "appId": "dl9m_touchpoint", 
             "user_type" : "First Time", //”First Time” or “Regular”
             "name" : username, //optional
             "transaction_date" : "2016-Jun-24", //optional
            // "city": "Bangalore", //optional
             "customer_id":memberid,
             "trigger_name":type,
             'request_source':"Website",
             'is_request_dedupe_enable' :false
             };
     
             var event_name="myEvent";
     
             var efd = true;
     
             var params ={
               "event_name":"myEvent"
               };
     
               if(module_type == 'policy_details'){
                 userDetails["policy_details"] = module_name;
               }
               else if(module_type == 'endorsement_activity'){
                 userDetails["endorsement_activity"] = module_name;
               }
               else if(module_type == 'claim_intimation'){
                 userDetails["claim_intimation"] = module_name;
               }
               else if(module_type == 'appointment_type'){
                 userDetails["appointment_type"] = module_name;
               }
               else if(module_type == 'claim_status'){
                 userDetails["claim_status"] = module_name;
               }
               else if(module_type == 'home_page'){
                 userDetails["home_page"] = module_name;
               }
               else if(module_type == 'part_payment_page'){
                userDetails["part_payment_page"] = module_name;
              }
     
         if (typeof ltmsLi !== 'undefined') {
             /*Use any one. uncomment commented lines and comment out uncommented line(s).*/
             ltmsLi.init(userDetails , feedbackRequestURL , params, function(err, success) {
             if (err) {
             /*Here you will not get the code. if error occured then no need to call capture method.*/
             console.log('____', err);
             } else {
             ltmsLi.capture(efd, event_name, params);
             }
             });
             } else {
             console.log("LW library not defined. Please continue with your other functionality.");
             }
             
       }

     

    // obj.GetOriginalData =  new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(obj.GetOriginalQuote());
    //     }, 300);
    // });

    return obj;
}]);


/***************** Common Filters And Directives Used For Renew ******************/


/*------ Move to next input field directive -----*/

app.directive("moveNxtOnMaxlength", function () {
    return {
        restrict: "A",
        link: function ($scope, element) {
            var ele = element.find('input');
            element.on("input", function (e) {
                if (element.val().length == element.attr("maxlength")) {
                    var $nextElement = element.closest('.col-xs-4').next().find('input');
                    if ($nextElement.length) {
                        $nextElement[0].focus();
                    }
                }
            });
        }
    }
});

/*----- End of move to next input field directive ----*/

/*---- Filter To Return Amount In Alphanumeric -----*/

app.filter('INRALPHA', function () {
    return function (input) {
        if (input >= 100000) {
            input = (input / 100000) + ' Lacs';
          }
          else if(input >= 1000) {
            input = (input/1000) + ' Thousand';
          }
        return input;
    }
});

/*---- Filter To Return Amount In Alphanumeric Ends -----*/

/*---- Filter To Return Decimal Number Without Decimal ----*/

app.filter('NODECIMAL', function () {

    return function (input) {

        var output = "";

        if (!isNaN(input)) {

            var result = input.split('.')

            if (result) {
                output = result[0];
            }

            return output;
        }
    }

});

/*---- End of Filter To Return Decimal Number Without Decimal ----*/

/*----- Filter INR Without Decimal --------*/

app.filter('INRNODEC', function () {
    return function (input) {
        if (!isNaN(input)) {
            var result = input.toString().split('.');
            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

            return output;
        }
    }
});

/*------- End of Filter INR Without Decimal -----*/

