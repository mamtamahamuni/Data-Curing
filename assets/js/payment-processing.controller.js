/*
    
    Name: Payment Response
    Author: Sunny Khattri
    Date: ----

*/


var payPro = angular.module("paymentApp", []);

payPro.controller("paymentResponse", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$timeout','$interval', function ($rootScope, appService, ABHI_CONFIG, $location, $timeout,$interval) {
    
    $rootScope.proceedPayment = false;
    var pAY = this;
    var aS = appService;
    var val = $location.search();
    var timeStart;
    var toAllowRedirection = false;
    sessionStorage.removeItem('preQuoteProposedData')
    sessionStorage.removeItem('preQuoteInsuredData')
    sessionStorage.removeItem('coverTo')
    sessionStorage.removeItem('selectedMember')
    var referenceNo = sessionStorage.getItem('rid');

    /* Get Payment Response */
        debugger;
        var i = 0;
        function getPaymentStatus() {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/PGStatus", {
                    "Token": val.id
                }, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function (response) {
                    if (response.ResponseCode == 1) {
                        toAllowRedirection = true;
                        sessionStorage.setItem('responseData',JSON.stringify(response.ResponseData));
                        $location.url('paymentProcess');
                        $timeout(function(){
                            window.location.reload()
                        },300);
                       // window.location.reload();
                    } else if (response.ResponseCode == 2) { /* If Pending then all the service for three time by the interval of 30 sec. */
                        if(response.ResponseData.Page == "PENDING") {
                            if(i < 3){
                                pAY.numCount = 30;
                                var intervalCount = $interval(function() {
                                    --pAY.numCount;
                                }, 1000);
                                $timeout(function(){
                                    $interval.cancel(intervalCount);
                                    getPaymentStatus();
                                    i++;
                                },30000);
                            }else{
                                var modeltext = "<p>We haven't received your payment so unable to generate your policy at this time.</p><p>Please find below contact details for more information.</p><p>Email : abc@gmail.com</p><p>Contact : 9876543211</p><p>Reference Number: "+referenceNo+"</p> ";
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Alert",
                                    "modalBodyText": modeltext ,
                                    "showCancelBtn": false,
                                    "modalSuccessText" : "Ok",
                                    "hideCloseBtn": true,
                                    "showOkBtn": false,
                                    "showAlertModal": true
                                    
                                }
                            }
                        }
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": response.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true,
                            "positiveFunction" : function(){
                                toAllowRedirection = true;
                                if (response.ResponseData.Product.length > 1) {
                                    $location.url('cross-sell-declaration');
                                } else if (response.ResponseData.Product[0] == 'PL') {
                                    $location.url('platinum-declaration');
                                } else if (response.ResponseData.Product[0] == 'DI') {
                                    $location.url('diamond-declaration');
                                } else if (response.ResponseData.Product[0] == 'PA' || response.ResponseData.Product[0] == 'CI' || response.ResponseData.Product[0] == 'CS') {
                                    $location.url('rfb-declaration');
                                }
                            }
                        }
                    }
                }, function (err) {});
        }

    /* Get Payment Response Ends */

    $rootScope.$on('$routeChangeSuccess', function (e, newLocation, oldLocation) {
    if(oldLocation.routePath == "paymentResponse" && newLocation.routePath == "paymentProcessing"){
        window.location.reload();
        }
    })

    /*$rootScope.$on('$routeChangeStart', function (event, next, prev) {
        if(angular.isUndefined(prev)){
            return false;
        }
        if(prev.$$route.controller == 'paymentResponse' && (angular.isUndefined(next) || !(next.$$route.controller == 'postPaymentCtrl' || next.$$route.controller == 'thankYou' || next.$$route.controller == 'declarationCtrl' || toAllowRedirection))){
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "You are not authorized to go back.",
                "showCancelBtn": false,
                "modalSuccessText" : "Ok",
                "showAlertModal": true,
            }
            $rootScope.showWhiteLoader = false;
            event.preventDefault();
        }
    })*/

    getPaymentStatus();

}]);

/* End of payment response controller */