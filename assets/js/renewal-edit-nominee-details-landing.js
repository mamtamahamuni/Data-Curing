/**   
	Module: Renewal Edit Nominee Details Landing Page Controller (This module enables user to edit nominee details (first name, last name, etc.) )
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalEditNomineeDetailsLandingApp = angular.module("renewalEditNomineeDetailsLandingModule", []);

renewalEditNomineeDetailsLandingApp.controller("renewal-edit-nominee-details-landing", ['ABHI_CONFIG', '$scope', '$rootScope', '$timeout', '$location', '$sessionStorage', 'RenewService', function (ABHI_CONFIG, $scope, $rootScope, $timeout, $location, $sessionStorage, RenewService) {

	/*---- Page Redirection When $sessionStorage.refNo Not Available ----*/

	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

	/*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	/*---- Data Inilization ----*/

	var nomineeDetails = {} // To Nominee Details
	$scope.nomineeDetails = {
		"ReferenceNo": $sessionStorage.refNo,
		"PolicyNumber": $sessionStorage.policyNo,
		"NomineeFirstName": "",
		"NomineeMiddleName": "",
		"NomineeLastName": "",
		"NomineeRelation": "",
		"NomineeContactNo": ""
	}
	$scope.nomineeRel = [
		"Spouse", "Son", "Daughter", "Mother", "Father", "Mother-In-Law", "Father-In-Law", "Brother", "Sister",
		"Grandfather", "Grandmother", "Grandson", "Granddaughter", "Son in-law", "Daughter in-law", "Brother in-law",
		"Sister in-law", "Nephew", "Niece"
	]
	$scope.upsellFlag = $sessionStorage.upsellFlag;

	/*---- End of Data Inilization ----*/

	/*------------------ To Fetch/Get Nominee Details ---------------------------*/

	function fetchNomineeDetails() {
		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetNomineeDetails", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					nomineeDetails = data.ResponseData;
					$scope.nomineeDetails = angular.copy(nomineeDetails);
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

	fetchNomineeDetails();

	/*------------------ End To Fetch/Get Nominee Details ---------------------------*/

	/*----------------- To Change Nominee Relation ------------------------*/

	$scope.changeNomineeRel = function (rel) {
		$scope.nomineeDetails.NomineeRelation = rel;
	}

	/*----------------- End To Change Nominee Relation ------------------------*/

	/*----------------- To Update Nominee Details ------------------------*/
	$scope.updateNomineeDetails = function (event, validForm) {

		if (!validForm) {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			return false;
		}

		if ($scope.nomineeDetails.NomineeRelation == '') {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			return false;
		}

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateNomineeDetails",
				$scope.nomineeDetails,
				//{"ReferenceNo": $sessionStorage.refNo, "PolicyNumber": $sessionStorage.policyNo, "NomineeFirstName" : $scope.nomineeDetails.NomineeFirstName, "NomineeMiddleName": $scope.nomineeDetails.NomineeMiddleName, "NomineeLastName": $scope.nomineeDetails.NomineeLastName, "NomineeRelation": $scope.nomineeDetails.NomineeRelation, "NomineeContactNo": $scope.nomineeDetails.NomineeContactNo},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$rootScope.alertConfiguration('S', "Nominee details changed Successfully");
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
	/*----------------- End To Update Nominee Details ------------------------*/

}]);