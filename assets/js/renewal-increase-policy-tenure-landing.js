/**   
	Module: Renewal Increase Policy Tenure Landing Page Controller (This module enables user to change tenure of the policy.)
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalIncreasePolicyTenureLandingApp = angular.module("renewalIncreasePolicyTenureLandingModule", []);

renewalIncreasePolicyTenureLandingApp.controller("renewal-increase-policy-tenure-landing", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', 'RenewService', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, RenewService) {

	/*---- Page Redirection When $sessionStorage.refNo Not Available ----*/

	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

	/*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	/*---- Data Inilization ----*/

	//$scope.policyDetails = {} // To Store Policy Details
	$scope.upsellFlag = $sessionStorage.upsellFlag;

	/*---- End of Data Inilization ----*/

	/*---------------------- To Update Tenure ---------------------------------*/

	$scope.updateTenure = function (tenure) {

		$scope.policyDetails.Tenure = tenure;

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateTenure", {
					"Tenure": $scope.policyDetails.Tenure,
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.policyDetails.RenewalGrossPremium= data.ResponseData.premiumResponse.RenewGrossPremium;
					// $scope.fetchPolicyDetails();
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

	/*---------------------- End To Update Tenure ---------------------------------*/

}]);