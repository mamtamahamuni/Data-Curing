/**
	Module: VIL Raise Track Controller
	Author: Pandurang Sarje
	Date: 12-01-2021
**/

'use strict';

var vRTApp = angular.module("vilRaiseTrackApp",[]);

vRTApp.controller("vil-raise-track", ['$scope', '$rootScope', '$sessionStorage', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$http', '$q', function($scope, $rootScope, $sessionStorage, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $http, $q) {

    /* Page Redirection When $sessionStorage.coiDetails Not Available */

    if($sessionStorage.coiDetails == null || $sessionStorage.coiDetails == 'undefined'){
        $location.url('vil-login');
        return false;
    }
    
    /* End of Page Redirection When $sessionStorage.coiDetails Not Available */
    
    /* Data Inilization */

    var aS = appService;

    /* End of Data Inilization */

    /* To Proceed Claim Registration */

    $scope.proceedRegistration = function () {
        $location.url('vil-raise');
    }

    /* End of To Proceed Claim Registration */

    /* To Proceed Track Claim */

    $scope.proceedTrackClaim = function () {
        $location.url('vil-track');
    }

    /* End of To Proceed Track Claim */

}]);