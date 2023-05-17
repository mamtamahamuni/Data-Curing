/**   
	Module: Renewal Upgrade Zone/Room Landing Page Controller (In this module user can modify his zone (where user can avail hospital facility available for active health policy) or can upgrage room type (avialabe for activ assure policy)).
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalUpgradeZoneLandingApp = angular.module("renewalUpgradeZoneLandingModule", []);

renewalUpgradeZoneLandingApp.controller("renewal-upgrade-zone-landing", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', 'RenewService', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, RenewService) {

	/*---- Page Redirection When $sessionStorage.refNo Not Available ----*/

	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

	/*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	/*---- Data Inilization ----*/
	
	//$scope.room = "0"
	$scope.upsellFlag = $sessionStorage.upsellFlag;
	
	/*---- End of Data Inilization ----*/

	/*--------------------- To fetch Zone Details ------------------------*/
	$scope.zoneData= {
		zone:"",
		pincode:""
	}

	function fetchZoneDetails() {

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetZone", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.zoneData.zone = data.ResponseData.Zone;
					$scope.zoneData.pincode = data.ResponseData.ZonePincode;
					$scope.zonevAL = data.ResponseData.Zone;
					$scope.pincodeVal = data.ResponseData.ZonePincode
					// $scope.pincodeVaL = $scope.policyDetails.HomePincode;
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
	if ($rootScope.platinumProduct) {
		fetchZoneDetails();
	}

	/*--------------------- To fetch Zone Details Ends------------------------*/

	/*--------------------- To fetch Room Details ------------------------*/

	function fetchRoomDetails() {

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetUpgradeRoom", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.room = data.ResponseData;
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
	if ($rootScope.diamondProduct) {
		fetchRoomDetails();
	}

	$scope.zoneUpgradeAlert= function (z) {
		$rootScope.alertData = {
			"modalClass": "regular-alert",
			"modalHeader": "Warning",
			"modalBodyText": "<p>The entered pin-code upgrade your zone to "+ z.Zone +" which may impact your premium. Once you click \"Yes\", it can not be down graded to lower zone. Are you sure you want to upgrade?</p>",
			"showCancelBtn": true,
			"modalSuccessText": "Yes",
			"modalCancelText": "No",
			"showAlertModal": true,
			"positiveFunction": function(){
				updateZone(z);
			},
			"negativeFunction": function(){
				$scope.insuredDetails.MemberDetail.NatureOfDuty = "";
				$scope.nOD = "";
				$scope.nODCopy = "";
				curActMember.PA.risk = "";
				curActMember.PA.RiskType = "";
				calculatePremium();
				$rootScope.alertConfiguration('S',"Premium recalculated based on selected Nature of Duty.",'premium_recalculated_nature-of-duty_alert');
			}
		}
	}

	/*--------------------- To fetch Room Details Ends ------------------------*/

	$scope.changePinCode = function (validPinCode) {
        if (validPinCode) {
            RenewService.postData(ABHI_CONFIG.apiUrl + "GEN/PinCode", {
                "PinCode": validPinCode,
				"Productcode": sessionStorage.getItem('productCode')
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (data) {
                    if (data.ResponseCode == 1) {
						
						// if(param == "inIt"){ //for page inIt
						// 	if(!$scope.userpolicy.Zone){
						// 		$scope.userpolicy.Zone = data.ResponseData.Zone;
						// 	}
						// 	$scope.insuredMember.HomeCity  = data.ResponseData.City;
						// 	$scope.insuredMember.HomeState = data.ResponseData.State;
						// 	$scope.insuredMember.HomeZone = data.ResponseData.Zone;
						// 	return;
						// }
                        // if ($scope.userpolicy.ProductName == "Activ Health V2") {
                            var newZone = data.ResponseData.Zone.split("Z00");
                            var oldZone = $scope.zonevAL.split("Z00");
                            var oldZone = $scope.zoneData.zone.split("Z00");
                            if (parseInt(oldZone[1]) > parseInt(newZone[1])) {
								// $scope.insuredMember.HomeCity  = data.ResponseData.City;
								// $scope.insuredMember.HomeState = data.ResponseData.State;
								// $scope.zonevAL = data.ResponseData.Zone;
								$scope.zoneData.zone = data.ResponseData.Zone;
								$scope.zoneData.pincode = data.ResponseData.PinCode;
								// $scope.pincodeVal = data.ResponseData.PinCode;
								$scope.zoneUpgradeAlert(data.ResponseData);
                            }
							else if (parseInt(oldZone[1]) == parseInt(newZone[1])) {
								$rootScope.alertData = {
									"modalClass": "regular-alert",
									"modalHeader": "Alert",
									"modalBodyText": "<p>Enter pincode come's under same " + data.ResponseData.Zone+".",
									"showCancelBtn": false,
									"modalSuccessText": "Ok",
									"showAlertModal": true,
									"hideCloseBtn": true,
									"positiveFunction": function () {
										
									}
								}
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
										// $scope.insuredMember.HomePincode = $scope.userpolicy.HomePincode;
										// $scope.insuredMember.HomeCity  = $scope.userpolicy.HomeCity;
										// $scope.insuredMember.HomeState = $scope.userpolicy.HomeState;
										// $scope.insuredMember.HomeZone = $scope.userpolicy.Zone;
										// $scope.pincodeVal = $scope.policyDetails.HomePincode;
										$scope.zoneData.pincode = "";
									}
								}
                            }
                        // }
						// else{
						// 	$scope.insuredMember.HomeCity  = data.ResponseData.City;
						// 	$scope.insuredMember.HomeState = data.ResponseData.State;
						// 	$scope.insuredMember.HomeZone = data.ResponseData.Zone;
						// }
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "Ok",
                            "showAlertModal": true,
                            "hideCloseBtn": true,
                            "positiveFunction": function () {
                                $scope.insuredMember.HomePincode = "";
                            }
                        }

                    }
                }, function (err) {
                });
        }
    }

	/*------------------ To Update Zone -----------------------*/

	function updateZone(param) {

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpgradeZone", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo,
					"Zone": param.Zone,
					"ZonePincode":JSON.stringify(param.PinCode),
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					// $scope.updateAddressDetails(param);
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

	

	/*------------------ End of To Update Zone -----------------------*/

	/*-------------------To Update Address Details ------------------------*/

	$scope.updateAddressDetails = function (param) {

		let addressDetail = {
								"ReferenceNo": $sessionStorage.refNo,
								"PolicyNumber": $sessionStorage.policyNo,
								"addressDetails":{
									"AddressLine1":$scope.policyDetails.HomeAddress1,
									"AddressLine2":$scope.policyDetails.HomeAddress2,
									"City":param.City,
									"State":param.State,
									"Pincode":param.PinCode,
									"Landmark":"null"
								},
								"ChronicDetails":null
							}
		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateAddress",addressDetail,true)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.fetchPolicyDetails();
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

	/*------------------ To Update Room -----------------------*/

	$scope.updateRoom = function (param) {

		if ($scope.insuredMembers[0].SumInsured >= 500000) {

			RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpgradeRoom", {
						"ReferenceNo": $sessionStorage.refNo,
						"PolicyNumber": $sessionStorage.policyNo,
						"RoomUpgrade": param
					},
					true
				)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						$scope.fetchPolicyDetails();
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

		} else if ($scope.insuredMembers[0].SumInsured <= 400000 && $scope.upsellFlag == 'Y' && param == '1') {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "As upgrade room is available on Sum Insured of ₹ 5,00,000 and above. So please select the incresed Sum Insured.",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true,
				"hideCloseBtn": true
			}
			$scope.room = "0";
		}

	}

	/*------------------ End of To Update Room -----------------------*/

}]);