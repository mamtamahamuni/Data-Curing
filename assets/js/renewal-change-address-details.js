/**   
	Module: Renewal Change Address Details Landing Page Controller (This module enables user to change address details in policy)
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalChangeAddressDetailsApp = angular.module("renewalChangeAddressDetailsModule", []);

renewalChangeAddressDetailsApp.controller("renewal-change-address-details", ['ABHI_CONFIG', '$scope', '$timeout', '$rootScope', '$location', '$sessionStorage', 'RenewService','appService', function (ABHI_CONFIG, $scope, $timeout, $rootScope, $location, $sessionStorage, RenewService,appService) {
    var aS = appService;

	/*---- Page Redirection When $sessionStorage.refNo Not Available ----*/
	$scope.userpolicy = JSON.parse(sessionStorage.getItem("userData"));

	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

	/*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	/*---- Data Inilization ----*/

	var insuredMemberDetails = {} // To Store Perticular Insured Member Details
	$scope.insuredMemberDetails = {} // To Store Perticular Insured Member Details
	$scope.upsellFlag = $sessionStorage.upsellFlag;

	/*---- End of Data Inilization ----*/

	 $scope.ModificationCall= function(data){
		// delete rID.insuredDetails.PremiumDetail;
		aS.postData(ABHI_CONFIG.apiUrl+"renew/RenewModificationCall",{
			"ReferenceNumber":data.ReferenceNo,
			"PolicyNumber":data.PolicyNumber,
			}
		,false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(response){
				if(response.ResponseCode == 1){
					if(response.ResponseData.RenewGrossPremium){
						$scope.policyDetails.RenewalGrossPremium = response.ResponseData.RenewGrossPremium;
					}
				}else{
					$rootScope.alertConfiguration('E',response.ResponseMessage);
				}
			},function(err){

			});
	}

	/*------------------ To Fetch Member Details ---------------------------*/

	function fetchInsuredMembers() {

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetInsuredMemberDetail", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo,
					"MemberID": "00",
					"Relation": "Self"
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					insuredMemberDetails = data.ResponseData;
					$scope.insuredMemberDetails = angular.copy(insuredMemberDetails)
					$scope.updatePinCode("inIt")
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

	fetchInsuredMembers();

	/*------------------ End  To Fetch Member Details ---------------------------*/

	/*------------------ To Update Pin Code ----------------------------*/
	$scope.upgradeZ = false;
	$scope.zonechange = ""
	$scope.updatePinCode = function (validPinCode) {

		if (validPinCode) {

			RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/PinCode", {
						"PinCode": $scope.insuredMemberDetails.addressDetails.Pincode
					},
					false
				)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						if(validPinCode == "inIt"){ //for page inIt
							if(!$scope.userpolicy.Zone){
								$scope.userpolicy.Zone = data.ResponseData.Zone;
                                sessionStorage.removeItem('userData');
                                sessionStorage.setItem('userData', JSON.stringify($scope.userpolicy));
							}
							$scope.insuredMemberDetails.addressDetails.City   = data.ResponseData.City;
							$scope.insuredMemberDetails.addressDetails.State = data.ResponseData.State;
							// $scope.insuredMember.HomeZone = data.ResponseData.Zone;
							return;
						}
						// if ($scope.userpolicy.ProductName == "Activ Health V2") {
						var newZone = data.ResponseData.Zone.split("Z00");
						var oldZone = $scope.userpolicy.Zone.split("Z00");
						if (parseInt(oldZone[1]) >= parseInt(newZone[1])) {
							$scope.pinCodeData = data.ResponseData;
							$scope.insuredMemberDetails.addressDetails.City = $scope.pinCodeData.City;
							$scope.insuredMemberDetails.addressDetails.State = $scope.pinCodeData.State;
							// updateZone($scope.pinCodeData.Zone);
							$scope.zonechange = $scope.pinCodeData.Zone;
							$scope.upgradeZ = true;

						}
						else {
							$rootScope.alertData = {
								"modalClass": "regular-alert",
								"modalHeader": "Alert",
								"modalBodyText": "If new pincode entered is of Upscale Zone or within the same Zone then it will allow to change the pincode",
								"showCancelBtn": false,
								"modalSuccessText": "Ok",
								"showAlertModal": true,
								"hideCloseBtn": true,
								"positiveFunction": function () {
									$scope.insuredMemberDetails.addressDetails.Pincode = $scope.userpolicy.HomePincode;
									$scope.insuredMemberDetails.addressDetails.City  = $scope.userpolicy.HomeCity;
									$scope.insuredMemberDetails.addressDetails.State = $scope.userpolicy.HomeState;
								}
							}
						}
					// }
					// else{
					// 	$scope.insuredMember.HomeCity  = data.ResponseData.City;
					// 	$scope.insuredMember.HomeState = data.ResponseData.State;
					// 	$scope.insuredMember.HomeZone = data.ResponseData.Zone;
					// }
					}
					if (data.ResponseCode == 0) {
						$rootScope.alertConfiguration('E', data.ResponseMessage);
						$scope.insuredMemberDetails.addressDetails.Pincode = '';
					}
				})

		}

	}

	/*------------------ To Update Pin Code Ends -----------------------*/


	/*-------------------To Update Address Details ------------------------*/

	$scope.updateAddressDetails = function (event, validForm) {

		if (!validForm) {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			return false;
		}

		// if ($scope.policyDetails.ProductName == 'Activ Health' || $scope.policyDetails.ProductName == 'Activ Health V2') {
		// 	if (!(angular.isUndefined($scope.pinCodeData) || $scope.pinCodeData == null)) {
		// 		if ($scope.policyDetails.Zone == 'Z003' && ($scope.pinCodeData.Zone == 'Z002' || $scope.pinCodeData.Zone == 'Z001')) {
		// 			updateZone($scope.pinCodeData.Zone);
		// 		} else if ($scope.policyDetails.Zone == 'Z002' && $scope.pinCodeData.Zone == 'Z001') {
		// 			updateZone($scope.pinCodeData.Zone);
		// 		}
		// 	}
		// }

		/*------ To Delete Properties Which Are Not Required-----------*/
		delete $scope.insuredMemberDetails.MemberId
		delete $scope.insuredMemberDetails.occupation;
		delete $scope.insuredMemberDetails.personalDetails;
		delete $scope.insuredMemberDetails.relationWithProposer;
		
		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateAddress",
				$scope.insuredMemberDetails,
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					let MData = $scope.insuredMemberDetails
					$scope.ModificationCall(MData);
					$rootScope.alertConfiguration('S', "Address details changed Successfully");
					// if($scope.upgradeZ){
					// 	updateZone($scope.zonechange);
					// 	}
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

	/*------------------- End To Update Address Details ------------------------*/

	


	/*-------------------  To Upgrade Zone ------------------------*/

	function updateZone(param) {

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpgradeZone", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo,
					"Zone": param
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					// $scope.fetchPolicyDetails();
					$scope.userpolicy.HomePincode = $scope.insuredMemberDetails.addressDetails.Pincode;
					$scope.userpolicy.HomeCity = $scope.insuredMemberDetails.addressDetails.City;
					$scope.userpolicy.HomeState = $scope.insuredMemberDetails.addressDetails.State;
					$scope.userpolicy.HomeDistrict = $scope.insuredMemberDetails.addressDetails.State;
					
					sessionStorage.setItem('userData', JSON.stringify($scope.userpolicy));
					$scope.policyDetails.RenewalGrossPremium= data.ResponseData.premiumResponse.RenewGrossPremium;
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

	/*------------------- To Upgrade Zone Ends ------------------------*/
}]);