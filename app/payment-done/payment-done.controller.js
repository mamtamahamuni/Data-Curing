var pDApp = angular.module("paymentDoneApp", []);

pDApp.controller("paymentDone", ['$rootScope','ABHI_CONFIG','$location', function($rootScope, ABHI_CONFIG, $location) {

	var pD = this;

    pD.referenceNumber =  sessionStorage.getItem('rid');

}]);

/* End of controller */
