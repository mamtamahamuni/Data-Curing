/**   
	Module: Axis Telesales Renew Policy Page Controller (Responsible for processing axis id (present in url as parameter) and and landing the user on New Renewal Landing Page)
	Author: Pandurang Sarje 
    Date: 16-03-2021
**/

var axisTeleRenewApp = angular.module('axisTeleRenewPolicyModule', []);

'use strict';

axisTeleRenewApp.controller("axis-telesales-renew-policy", ['ABHI_CONFIG', '$scope', '$rootScope', '$localStorage', '$sessionStorage', '$routeParams', '$window', '$location', '$timeout', 'appService', function (ABHI_CONFIG, $scope, $rootScope, $localStorage, $sessionStorage, $routeParams, $window, $location, $timeout, appService) {

    /*---- Data Inilization ----*/
    
    var aS = appService;
    $rootScope.showLoader = true;

    /*---- End of Data Inilization ----*/

    /*---- To check if Referenceid parameter present in URL & process it  -----*/

    if ($routeParams.Referenceid && $routeParams.Referenceid != "") {
        var refId = $rootScope.decryptAxisTeleSalesUrlParam($routeParams.Referenceid);
        aS.getData(ABHI_CONFIG.apiUrl+"Renew/AxisTelesales_FyntuneDetails?RefernceNo="+refId, "", true, {
            'x-ob-at': 'p0tzzQYkT70L2WSN9hwyHw0ZHHRfpeC4oy1tsufl71IKATgkh1rjofuhEi8Ul4vYwoJHqhO7S4qvdEzE',
            'Content-Type': 'application/json'
        })
        .then(function (data) {
            if (data.ResponseCode == 1){
                $scope.fetchedData = data.ResponseData;
                if($scope.fetchedData != null && $scope.fetchedData !== ""){
                    checkRenewDetails();
                }
            } else if(data.ResponseCode == 0) {
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
        }, function (err) {
        })
    } else {
        $rootScope.showLoader = false;
        $rootScope.alertData = {
            "modalClass": "regular-alert",
            "modalHeader": "Alert",
            "modalBodyText": 'Oops! Something went wrong.',
            "showCancelBtn": false,
            "modalSuccessText": "Ok",
            "showAlertModal": true,
            "hideCloseBtn": true
        }
    }
    /*---- To check if Referenceid parameter present in URL & process it  -----*/
    
    /*----- To Check Renew Details -------*/

    function checkRenewDetails() {
        
        var checkAuthData = {
            "PolicyNumber": $scope.fetchedData.Policynumber,
            "DOB": "",
            "MobileNumber": $scope.fetchedData.Mobileno,
            "webagre": "marketing_campaign"
        }
        
        $sessionStorage.checkAuthData = checkAuthData;

        aS.postData(ABHI_CONFIG.apiUrl+"Renew/CheckRenewDetails",
            checkAuthData, true, {
                'x-ob-at': 'p0tzzQYkT70L2WSN9hwyHw0ZHHRfpeC4oy1tsufl71IKATgkh1rjofuhEi8Ul4vYwoJHqhO7S4qvdEzE',
                'Content-Type': 'application/json'
            }
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
                    "hideCloseBtn": true
                }
            }
        })
        
    }

    /*----- End of To Check Renew Details -------*/

}]);