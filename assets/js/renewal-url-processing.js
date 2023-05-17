/**   
	Module: Renewal Url Processing Page Controller (This module is responsible to enable continue journey from where the user dropped off/left in his earlier journey.)
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalUrlProcessingApp = angular.module("renewalUrlProcessingModule", []);

renewalUrlProcessingApp.controller("renewal-url-processing", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', 'RenewService', '$routeParams', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, RenewService, $routeParams) {

    /*---- Data Inilization ----*/
    
    $rootScope.showLoader = true;

    /*---- End of Data Inilization ----*/

    /*---------------------- To Continue Journey ---------------------------*/

    function continueJourney() {
console.log("ravikant 1");
debugger;
        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/ContinueJourney", {
                    "URLKey": $routeParams.urlKey
                },
                true
            )
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    $scope.continueJourneyData = data.ResponseData;
                    $sessionStorage.refNo = $scope.continueJourneyData.ReferenceNumber;
                    $sessionStorage.policyNo = $scope.continueJourneyData.PolicyNumber;
                    sessionStorage.setItem('ut', $scope.continueJourneyData.ut);
                    fetchPolicyDetails();
                } else if (data.ResponseCode == 0) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": data.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                }
            })

    }
    continueJourney();

    /*---------------------- To Continue Journey Ends ---------------------------*/

    /*-------------------- To Fetch Policy Details ------------------------------ */

    function fetchPolicyDetails() {

        console.log("ravikant 11");
        debugger;
        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetPolicyDetails", {
                    "ReferenceNo": $sessionStorage.refNo,
                    "PolicyNumber": $sessionStorage.policyNo
                },
                true
            )
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    $scope.policyDetails = data.ResponseData;
                    $sessionStorage.productName = $scope.policyDetails.ProductName;
                    $sessionStorage.personalDetials = {
                        Email: $scope.policyDetails.Email,
                        Mobile: $scope.policyDetails.Mobile
                    }
                    $sessionStorage.upsellFlag = $scope.policyDetails.UpsellFlag;

                    if ($scope.continueJourneyData.PageDrop == 'renewal-payment-processing') {

                        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetPaymentID", {
                                    "ReferenceNo": $sessionStorage.refNo
                                },
                                true
                            )
                            .then(function (data) {
                                if (data.ResponseCode == 1) {
                                    $scope.paymentData = data.ResponseData;
                                    $location.url($scope.continueJourneyData.PageDrop + '?id=' + $scope.paymentData.PaymentId);
                                } else if (data.ResponseCode == 0) {
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "Alert",
                                        "modalBodyText": data.ResponseMessage,
                                        "showCancelBtn": false,
                                        "modalSuccessText": "Ok",
                                        "showAlertModal": true,
                                        "hideCloseBtn": true
                                    }
                                }
                            });

                    } else {
                        $location.url($scope.continueJourneyData.PageDrop);
                    }
                } else if (data.ResponseCode == 0) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": data.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                }
            });

    }

    /*---------------------- To Fetch Policy Details Ends ---------------------------*/

}]);