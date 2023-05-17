/**   
	Module: partPaymentProcess Page Controller (This module is resposible for checking suburl proesent in session storage and appent it to new-renewal-renew-thank-you page ur and redirect to the same.)
	Author: Anirudha Bhatkar
    Date: 24-05-2020
**/

'use strict';

var partPaymentProcessApp = angular.module("partPaymentProcessModule", []);

partPaymentProcessApp.controller("partPaymentProcess", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', '$timeout', 'RenewService', '$routeParams', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, $timeout, RenewService, $routeParams) {

    /*---- Data Inilization ----*/
    
    $rootScope.showLoader = true;

    /*---- End of Data Inilization ----*/

    /* To check if suburl present & append it to thank-you url and redirect */

    $timeout(function(){
        if($sessionStorage.subUrl){
            $location.url('part-payment-thank-you'+'?'+$sessionStorage.subUrl);
        }else {
            $location.url('part-payment-thank-you');
        }
    }, 1000);

    /* End of To check if suburl present & append it to thank-you url and redirect */

}]);