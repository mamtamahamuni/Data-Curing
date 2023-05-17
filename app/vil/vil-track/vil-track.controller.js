/**
	Module: VIL Track Controller
	Author: Pandurang Sarje
	Date: 12-05-2021
**/

'use strict';

var vTApp = angular.module("vilTrackApp",[]);

vTApp.controller("vil-track", ['$scope', '$rootScope', '$sessionStorage', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$http', '$q', function($scope, $rootScope, $sessionStorage, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $http, $q) {

    /* Page Redirection When $sessionStorage.coiDetails Not Available */

    if($sessionStorage.coiDetails == null || $sessionStorage.coiDetails == 'undefined'){
        $location.url('vil-login');
        return false;
    }
    
    /* End of Page Redirection When $sessionStorage.coiDetails Not Available */
    
    /* Data Initialization */

    var aS = appService;
    $scope.claimNumber = "";

    /* End of Data Initialization */

    /* To get claim status */
    
    $scope.trackClaim = function(validForm,event){
        
        /* Form Validation */
        if(!validForm){
            $scope.showErrors = true;
            $("html, body").animate({ scrollTop: $("#vil-track-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E',"Please fill valid data", "valid_data_alert");
            return false;
        }
        /* End of Form Validation */

        $http.defaults.headers.common['p1'] = '';
        $http.defaults.headers.common['p2'] = 'bzi6xdEQmDTdRGUzsF99Cw==';
        $http.defaults.headers.common['p3'] = '76mOIGX9yoXJcn9AvqJG3Q==';
        $http.defaults.headers.common['p4'] = 'JTPdpgaOfcnB62c3kAoWKQ==';

        var encryptedClaimNo = $rootScope.encryptWithoutString($scope.claimNumber);
    
        aS.getData(ABHI_CONFIG.hservicesv2+"/Hospicash/GetClaimTracking_Details?ClaimNumber="+encryptedClaimNo, "", 
        true, {
            headers: {
                'Content-Type' : 'application/json',
                'x-client-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                'x-abhi-api-key' : 'BFA9AF04-696E-4EFD-BD4E-EED9F6CCDBF5',
                'x-abhi-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                'X-NewRelic-ID' :'VgcHVlRaDBACU1lTDgQPV1U='
            }
        })
        .then(function (data) {
            var response = JSON.parse($rootScope.decrypt(data._resp));
            if (response.code == 1){
                $scope.claimStatus = response.data;
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "Your Claim Status Is: "+$scope.claimStatus,
                    "showCancelBtn": false,
                    "modalSuccessText": "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function () {
                        //$scope.claimNumber = "";
                    }
                }
            } else{
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": response.msg,
                    "showCancelBtn": false,
                    "modalSuccessText": "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true
                }
            }
            
        }, function (err) {
        })

    }
    
    /* End of To get claim status */

}]);