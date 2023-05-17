/**   
	Module: Renewal Payment Processing Page Controller (User makes payment on payment gateway and post-payment lands on this module where we call pg-status api which gives information about whether payment is received at our end or not. If received the payment then we land the user on thank you page, if not we land the user on New Renewal Landing Page.)
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var partPaymentProcessingApp = angular.module("partPaymentProcessingModule", []);

partPaymentProcessingApp.controller("part-payment-processing", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', 'RenewService', '$routeParams', '$timeout', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, RenewService, $routeParams, $timeout) {

    /*---- Data Inilization ----*/

    $scope.upsellFlag = $sessionStorage.upsellFlag;
    var arraynew = [];

    /*---- Data Inilization ----*/

    /*---------------------- Drop off Url ---------------------------*/

    function userDropOff() {

        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/PageDrop", {
                    "ReferenceNumber": $location.search().id,
                    "PageDrop": "part-payment-processing"
                },
                false
            )
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    $sessionStorage.dropOffPayment = true;
                }
            })

    }

    userDropOff();

    /*---------------------- Drop off Url Ends ---------------------------*/

    /*---------------------- Omni Channel Drop off Event ---------------------------*/

    function omniDropOff(){

        RenewService.postData(ABHI_CONFIG.apiUrl+"OmniChannel/RenewDropoff", 
            {"ReferrenceNo": $sessionStorage.refNo, "PageName": "part-payment-processing"},
            true
            )
            .then(function(data){
            if(data.ResponseCode == 1) {
                $sessionStorage.omniDropOffPayment = true;
            }           
        })

    }
    
    /*---------------------- Omni Channel Drop off Event Ends ---------------------------*/

    /*---------------------- To fetch PGStatus ---------------------------*/

    function fetchPgStatus() {

        RenewService.postData("https://mtpre.adityabirlahealth.com/PartPayment/api/PartPayment/PGStatus", {
                    "Token": $routeParams.id
                },
                false
            )
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    $sessionStorage.refNo = data.ResponseData.ReferenceNo;
                    $sessionStorage.policyNo = data.ResponseData.PolicyNumber;
                    sessionStorage.setItem('responseData', JSON.stringify(data.ResponseData));
                    // omniDropOff();
                    $timeout(function(){
                        $location.url('partPaymentProcess');
                    }, 500);
                } else if (data.ResponseCode == 0) {
                    arraynew.push({
                        "PolicyNumber": data.ResponseData.PolicyNumber,
                        "ReferenceNo": data.ResponseData.ReferenceNo,
                        "ut": data.ResponseData.Token
                    })
                    $sessionStorage.refNoArray = arraynew;
                    $sessionStorage.refNo = data.ResponseData.ReferenceNo;
                    $sessionStorage.policyNo = data.ResponseData.PolicyNumber;
                    sessionStorage.setItem('ut', data.ResponseData.Token);
                    // omniDropOff();
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": "<h4 style='pointer-events:visible;'>We haven't received your payment so unable to generate your policy at this time. Reach on <a href='mailto:Care.healthinsurance@adityabirlacapital.com'>care.healthinsurance@adityabirlacapital.com</a> or call <a href='tel:1800-270-7000'>1800-270-2700</a>. Reference Number: "+$sessionStorage.refNo+"</h4>",
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                        "positiveFunction": function () {
                            $location.url('part-payment-login');
                        }
                    }
                }
            })
    }

    fetchPgStatus();

    /*---------------------- End of To fetch PGStatus ---------------------------*/

    /*---------------------- To Reload Page For running ecommerce Script in index.html file -----------*/

    $rootScope.$on('$routeChangeSuccess', function (e, newLocation, oldLocation) {
        if (newLocation.$$route.originalPath == "/renewPaymentProcess" && oldLocation.$$route.originalPath == "/part-payment-processing") {
            window.location.reload();
        }
    })

    /*---------------------- End of To Reload Page For running ecommerce Script in index.html file -----------*/

}]);