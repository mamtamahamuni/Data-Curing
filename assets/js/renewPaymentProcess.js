/**   
	Module: RenewPaymentProcess Page Controller (This module is resposible for checking suburl proesent in session storage and appent it to new-renewal-renew-thank-you page ur and redirect to the same.)
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewPaymentProcessApp = angular.module("renewPaymentProcessModule", []);

renewPaymentProcessApp.controller("renewPaymentProcess", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', '$timeout', 'RenewService', '$routeParams', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, $timeout, RenewService, $routeParams) {

    /*---- Data Inilization ----*/
    
    $rootScope.showLoader = true;

    /*---- End of Data Inilization ----*/

    /* To check if suburl present & append it to thank-you url and redirect */

    $timeout(function(){
        if($sessionStorage.subUrl){
            $location.url('new-renewal-renew-thank-you'+'?'+$sessionStorage.subUrl);
        }else {
            $location.url('new-renewal-renew-thank-you');
        }
    }, 1000);

    /* End of To check if suburl present & append it to thank-you url and redirect */

}]);