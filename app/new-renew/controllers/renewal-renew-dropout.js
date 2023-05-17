/**   
	Module: Renewal Renew Dropout Page Controller (This module is responsible for processing drop-out url (provided to user on their whats app with unique reference id) and landing the user on New Renewal Landing Page)
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';   

var renewalRenewDropoutApp = angular.module("renewalRenewDropoutModule", []);

renewalRenewDropoutApp.controller("renewal-renew-dropout", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', 'RenewService', '$routeParams', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, RenewService, $routeParams) {

    /*---- Data Inilization ----*/

    $rootScope.showLoader = true;

    /*---- End of Data Inilization ----*/

    /*---------------------- To fetch Data ---------------------------*/

    function fetchData() {

        RenewService.postData(ABHI_CONFIG.healthWebsiteUrl + "RenewalPolicy/fetchData", { // healthinsurance domain removed from api 
                    "transId": $routeParams.rid,
                    "tblName": "renew-dropout"
                },
                true
            )
            .then(function (data) {
                if (data.code == 1) {
                    $scope.fetchedData = data.data;
                    if ($routeParams.utm_source && $routeParams.utm_campaign) {
                        $sessionStorage.subUrl = 'utm_source=' + $routeParams.utm_source + '&' + 'utm_campaign=' + $routeParams.utm_campaign;
                    }
                    checkRenewDetails();
                } else if (data.code == 0) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": "Oops! Something went wrong",
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                }
            });
    }

    fetchData();

    /*----------------------  To fetch Data Ends ---------------------------*/


    /*-------------------- To Check Renew Details ------------------------------ */

    function checkRenewDetails() {

        var checkAuthData = {
            "PolicyNumber": $scope.fetchedData[0].PolicyNumber,
            "DOB": (angular.isUndefined($scope.fetchedData[0].Dob) || $scope.fetchedData[0].Dob == null) ? "" : $scope.fetchedData[0].Dob,
            "MobileNumber": $scope.fetchedData[0].Mobile,
            "webagre": "marketing_campaign"
        }

        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/CheckRenewDetails",
                checkAuthData, true
            )
            .then(function (data) {
                if (data.ResponseCode == '1') {
                    $scope.policyDetails = data.ResponseData;
                    $sessionStorage.refNoArray = $scope.policyDetails.Policies;
                    sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
                    $location.url('new-renewal-landing');
                } else if (data.ResponseCode == '0') {
                    var errorMessage = data.ResponseData != null ? data.ResponseData.ErrorMessage : data.ResponseMessage
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": errorMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                        "positiveFunction": function () {
                            $location.url('renewal-renew-policy');
                        }
                    }
                }
            })
    }

    /*---------------------- To Check Renew Details Ends ---------------------------*/

}]);