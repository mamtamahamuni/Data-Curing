/**   
	Module: New Renewal Landing Page Controller (In this module Pay Premium (Renew) Option & all the policy details are shown to user (sum insured, premium, tenure, health return, members, etc.). User can Pay Premium (Renew Policy) and also depending on policy insured user can change tenure, adjust sum insured, apply for health retun & 'modify other policy details' ('Modify Policy Details' is a seperate section where user has several options to modify policy like member addtion-deletion, edit member details, change address details, etc.) )
	Author: Sunny Khatri & Pandurang Sarje 
	Date: 07-07-2020
**/

var newRenewLand = angular.module('newRenewModule', []);

newRenewLand.controller('newRenewLanding', ['$http', '$route', '$scope', '$location', 'ABHI_CONFIG', '$rootScope', '$localStorage', '$sessionStorage', '$timeout', '$interval', '$window', 'RenewService', '$routeParams', '$filter',
	function ($http, $route, $scope, $location, ABHI_CONFIG, $rootScope, $localStorage, $sessionStorage, $timeout, $interval, $window, RenewService, $routeParams, $filter) {

		/*---- Page Redirection When $sessionStorage.refNoArray Not Available ----*/

		if (($sessionStorage.loginWithMobileNumber === undefined || $sessionStorage.loginWithMobileNumber === null)
			&& ($sessionStorage.onlyPolicyForMobile === undefined || $sessionStorage.onlyPolicyForMobile === null)
			&& ($sessionStorage.gt == null) && ($sessionStorage.refNoArray == 'undefined')) {

			$location.path('renewal-renew-policy');
			return false;
		}

		if ($sessionStorage.loginWithMobileNumber) {
			$scope.renewalPolicies = JSON.parse(sessionStorage.getItem('singleMobileMultiPolicy'));
			$scope.showSingleMobilePolices = true;
		}

		$scope.getFormatedValue = function (policyDate) {
			let dateObj = new Date(policyDate);
			return $filter('date')(dateObj, 'dd MMMM yyyy');
		}

		/*---- End of Page Redirection When $sessionStorage.refNoArray Not Available ----*/

		/*---- Data Inilization ----*/

		$scope.showSumInsured = false;
		$scope.indexVal = 1;
		$scope.hideHeader = false;
		var policyNoArray = [];
		$scope.showSumInsure = false;
		$scope.updateMembers = 'N';
		$scope.updateHealthMiMembers = 'N';
		$scope.updateMember = {};
		$scope.showHealthReturn = false;
		$scope.showThirdTenureVal = false; // AS per Bhagyashree instruction: make this visible in UAT for all the functionality check and hide in Live till RBI instructions
		$scope.showSliderMenu = false;
		$scope.showSliderMenuMob = false;
		$scope.showPaymentModeModal = false;
		$scope.pgPaymentMode = 'emandate_normal';
		$scope.showModal = false;
		$scope.showPage = false;
		$scope.showHealthMiModal = false;
		var nRL = this;
		$scope.planName = ''; // for V3 price change notification
		//$scope.applyHealthReturn = 'N';
		//OPEN T&C 
		var dLC = this;
		dLC.tcAgreed = false;
		dLC.showTerms = function () {
			$location.url("terms-conditions");
		}
		//OPEN T&C END

		/*---- End of Data Inilization ----*/

		/*------------ Intialization Scope UpdateMember -------------*/

		function initializeupdateMember() {
			$scope.insuredMembers.forEach(function (item, index) {
				$scope.updateMember[item.RelationWithProposer] = 'N';
			})
		}

		/*------------ End of Intialization Scope UpdateMember -------------*/

		/*---------- To Get User Token ----------------*/

		function getUserToken() {
			for (var i = 0; i < $sessionStorage.refNoArray.length; i++) {
				if ($sessionStorage.refNoArray[i].ReferenceNo == $scope.refNoSelected) {
					$scope.utSelected = $sessionStorage.refNoArray[i].ut;
				}
			}
		}

		/*--------- End of To Get User Token Ends ---------*/

		/*--------- To Instantiate Slick Slider For Desktop & Mobile View ---------*/

		$scope.instantiateSlider = function () {
			$scope.showSliderMenu = true;
			//$('.slick-slider-new').removeClass('slick-initialized slick-slider');
			$timeout(function () {
				if ($scope.insuredMembers.length == 1) {
					$('.slick-prev,.slick-next').css({
						"display": "none"
					});
				} else {
					if ($('.slick-slider-new').hasClass('slick-initialized')) {
						$('.slick-slider-new').slick('destroy');
					  } 
					$timeout(function () {
						$('.slick-slider-new').slick();
						$('.slick-prev').html('<')
						$('.slick-next').html('>')
						$('.slick-prev,.slick-next').css({
							"background-color": "#da9089",
							"color": "white",
							"font-weight": "900",
							"border": "none",
							"height": "25px",
							"width": "25px",
							"position": "absolute",
							"top": "55px"
						})
						$('.slick-prev').css({
							"left": "-25px"
						})
						$('.slick-next').css({
							"left": "348px"
						})
						$('.slick-slider-new').css({
							"left": "5px"
						})
					}, 100);
				}
			}, 500);
		}

		function loadSliderMob() {
			$scope.showSliderMenuMob = true;
			//$('.slick-slider-new-mob').removeClass('slick-initialized slick-slider');
			$timeout(function () {
				$('.slick-slider-new-mob').slick();
				if ($scope.insuredMembers.length == 1) {
					$('.slick-slider-new-mob .slick-prev,.slick-slider-new-mob .slick-next').css({
						"display": "none"
					});
				} else {
					$('.slick-slider-new-mob .slick-prev').html('<')
					$('.slick-slider-new-mob .slick-next').html('>')
					$('.slick-slider-new-mob .slick-prev,.slick-slider-new-mob .slick-next').css({
						"background-color": "#da9089",
						"color": "white",
						"font-weight": "900",
						"border": "none",
						"height": "25px",
						"width": "25px",
						"position": "absolute",
						"top": "65px"
					})
					$('.slick-slider-new-mob .slick-prev').css({
						"left": "-25px"
					})
					$('.slick-slider-new-mob .slick-next').css({
						"left": "296px"
					})
					$('.slick-slider-new-mob').css({
						"left": "10px"
					})
				}
			}, 500);
		}

		$scope.instantiateSliderMob = function () {
			$scope.showSliderMenuMob = false;
			loadSliderMob();
		}

		/*------ End of To Instantiate Slick Slider For Desktop & Mobile View ---------*/

		$scope.parseIntString = function(sum){
			if(sum){
				return parseInt(sum);
			}
			else{
				return true;
			}
		}

		/*------ To Get Total Heath Return Amount Of all Members --------- */

		function healthReturnValue(insuredMembers) {
			var heathReturnSum = 0;
			for (var i = 0; i < insuredMembers.length; i++) {
				if (insuredMembers[i].HealthReturn > 0) {
					heathReturnSum = heathReturnSum + parseFloat(insuredMembers[i].HealthReturn);
				}
			}
			if (heathReturnSum > 0) {
				$scope.heathReturnAmt = heathReturnSum.toFixed(2);
				$scope.showHealthReturn = true;
			}
		}

		/*------ End of To Get Total Heath Return Amount Of all Members --------- */


		/*---- To decide whether to show 'View Sum Insured' option or Sum Insured Amount In Current Sum Insured Filed ------ */

		function suminuredValue(memberedArray, policyDetails) {

			if (policyDetails.ProductName == 'Activ Health' || policyDetails.ProductName == 'Activ Health V2' || policyDetails.ProductName == 'POS Activ Secure' || policyDetails.ProductName == 'Super Top Up' || policyDetails.ProductName == 'POS Activ Assure' || policyDetails.ProductName == 'Global Health Secure - Revised' || policyDetails.ProductName == 'Arogya Sanjeevani Policy' || policyDetails.ProductName.includes('Health') || policyDetails.ProductName == 'Activ Assure' || policyDetails.ProductName == 'Activ Assure V2') {

				if (memberedArray.length == 1) {
					$scope.suminsured = memberedArray[0].SumInsured;
					$scope.initialsuminsured = memberedArray[0].InitialSumInsured;
					$scope.showSumInsure = true;
				} else if (memberedArray.length > 1) {
					if (policyDetails.SumInsuredType == "Family Floater") {
						$scope.suminsured = memberedArray[0].SumInsured;
						$scope.initialsuminsured = memberedArray[0].InitialSumInsured;
						$scope.showSumInsure = true;
					} else {
						$scope.showSumInsure = false;
					}
				}
			} else if (policyDetails.ProductName == 'Activ Secure') {

				//if(memberedArray.length > 1){
				$scope.showSumInsure = false;
				//}else{
				//	$scope.suminsured = memberedArray[0].SumInsured;
				//	$scope.initialsuminsured =  memberedArray[0].InitialSumInsured;
				//	$scope.showSumInsure = true;
				//}
			} else if (policyDetails.ProductName == 'Activ Care V2' || policyDetails.ProductName == 'Activ Care') {

				if (memberedArray.length == 1) {
					$scope.suminsured = memberedArray[0].SumInsured;
					$scope.initialsuminsured = memberedArray[0].InitialSumInsured;
					$scope.showSumInsure = true;
				} else if (memberedArray.length > 1) {
					if (policyDetails.SumInsuredType == "Family Floater") {
						$scope.suminsured = memberedArray[0].SumInsured;
						$scope.initialsuminsured = memberedArray[0].InitialSumInsured;
						$scope.showSumInsure = true;
					} else {
						$scope.showSumInsure = false;
					}
				}
			}


		}

		/*---- End of To decide whether to show 'View Sum Insured' option or Sum Insured Amount In Current Sum Insured Filed ------ */

		// window.onunload = function() {
		// 	window.onclose =  false;
		// 	$scope.getAllPolicy(true);
		// }

		
		/*----- To Get All Policy Details ------- */
		$scope.showTenure = true;
		$scope.getAllPolicy = function (param) {
			policyNoArray = [];
			policyNoArray[0] = $sessionStorage.refNoArray.ReferenceNo == undefined ? $sessionStorage.refNoArray[0].ReferenceNo : $sessionStorage.refNoArray.ReferenceNo;
			console.log("policyNoArray[0]: " + policyNoArray[0]);
			// for (var i = 0; i < $sessionStorage.refNoArray.length; i++) {
			// 	policyNoArray.push($sessionStorage.refNoArray[i].ReferenceNo)
			// }

			RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/GetAllPolicy", {
				"ListOfReferenceNo": policyNoArray
			}, true
			)
				.then(
					function (data) {
						if (data.ResponseCode == '1') {
							if(data.ResponseData[0].IsMemberAdded == "Y" || data.ResponseData[0].IsMemberDeleted == "Y" && data.ResponseData[0].IsOptionalCoverAdded == "Y" && data.ResponseData[0].IsZoneUpgraded == "Y"){
								$scope.showRevert = false;
							}
							
							$scope.showPage = true;
							$("html, body").animate({
								scrollTop: 200
							}, 300);
							$scope.policyDetails = data.ResponseData;
							sessionStorage.setItem('userData', JSON.stringify(data.ResponseData[0]));

							$scope.policyMembers = data.ResponseData[0].InsuredMembers;
							console.log("$scope.policyMembers");
							console.log($scope.policyMembers);
							$scope.selectedPolicyDetails = $scope.policyDetails[0];
							$scope.checkUpsellFF($scope.selectedPolicyDetails);
							$scope.policySelected = $scope.policyDetails[0].PolicyNumber;
							$scope.refNoSelected = $scope.policyDetails[0].ReferenceNo;
							$scope.productName = $scope.policyDetails[0].ProductName;
							$scope.planName = $scope.policyDetails[0].PlanName; // for V3 price change notification
							$scope.tenureVal = $scope.policyDetails[0].Tenure;
							$window.gtag('config', ' UA-87053058-4', {
								'page_path': window.location.pathname + window.location.hash,
								'title': $rootScope.pageTitle,
								'dimension7': $scope.policySelected,
								'dimension1': document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".")
							});

							if(param){
								$scope.insuredMembers = $scope.selectedPolicyDetails.InsuredMembers.slice(1);
							}
							else{
								let newMemList = $scope.selectedPolicyDetails.InsuredMembers.slice(1);
								Object.keys(newMemList).forEach(key => {
                                    // if (scope.userpolicy[key]) {
                                        $scope.insuredMembers[key].InitialSumInsured = newMemList[key].InitialSumInsured?newMemList[key].InitialSumInsured:$scope.insuredMembers[key].InitialSumInsured;
                                        $scope.insuredMembers[key].SumInsured = newMemList[key].SumInsured?newMemList[key].SumInsured:$scope.insuredMembers[key].SumInsured;
                                    // }
                                });
							}
							initializeupdateMember();
							suminuredValue($scope.insuredMembers, $scope.selectedPolicyDetails);
							healthReturnValue($scope.insuredMembers);
							if ($scope.productName == 'Activ Care V2' || $scope.productName == 'Activ Care' || $scope.productName == 'Active Care V2' || $scope.productName == 'Active Care') {
								$scope.showThirdTenureVal = true;
							}
							if ($scope.policyDetails[0].UpsellFlag == 'Y' && $scope.insuredMembers[0].UpSellSumInsured != 0) {
								$scope.showSumInsured = true
								$scope.indexVal = 1;
								$scope.upSellSumInsured = $scope.insuredMembers[0].UpSellSumInsured;
								if (parseInt($scope.suminsured) == parseInt($scope.upSellSumInsured)) {
									$scope.updateMembers = 'Y';
								}
								var UpsellMembersCount = 0;
								$scope.insuredMembers.forEach(function (item, index) {
									if (parseInt(item.SumInsured) == parseInt(item.UpSellSumInsured)) {
										$scope.updateMember[item.RelationWithProposer] = 'Y';
										UpsellMembersCount++;
									}
								})
								if ($scope.insuredMembers.length == UpsellMembersCount) {
									$scope.updateHealthMiMembers = 'Y';
								}
							} else {
								$scope.showSumInsured = false;
								$scope.indexVal = 0
							}

							$scope.policySelected0 = true;
							fetchHealthReturnStatus();
							if ($window.innerWidth > 650) {
									$scope.showSliderMenu = false;
									$scope.instantiateSlider();
							}

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
					},
					error => { console.log(error) }
				)
		}

		if ($sessionStorage.refNoArray) {
			$scope.getAllPolicy(true);
		}

		/*----- End of To Get All Policy Details ------- */

		/* open mandate model */
		$scope.opneMadateModel = function () {
			$('#mandate-model').modal({ backdrop: 'static', keyboard: false });
		}
		/* open mandate model ends */


		/* submit autodebit cancelation function */
		$scope.submitMandateDetails = function () {
			RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/AutoDebitDeActivate", {
				"ReferenceNumber": $scope.refNoSelected,
				"PolicyNumber": $scope.policySelected,
				"Reason": $scope.reason
			},
				true
			)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						$rootScope.alertConfiguration('S', "Request submitted", "Success");
						$scope.reason = "";
					}
					else {
						$rootScope.alertConfiguration('E', data.ResponseMessage, "Error");
					}

				})
		}

		/*----- To Get Heath Return Flag ----------*/

		function fetchHealthReturnStatus() {

			RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/GetHealthReturnFlag", {
				"ReferenceNo": $scope.refNoSelected,
				"PolicyNumber": $scope.policySelected
			},
				true
			)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						$scope.applyHealthReturn = data.ResponseData;
						omniPolicyExpiryPush();
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

		// fetchHealthReturnStatus();

		/*---- End of To Get Heath Return Flag ---------*/

		/*------ Omnni Channel Policy Expiry Push Event ---------*/

		function omniPolicyExpiryPush() {

			RenewService.postData(ABHI_CONFIG.apiUrl + "OmniChannel/RenewDropoff",
				{ "ReferrenceNo": $scope.refNoSelected, "PageName": "new-renewal-landing" },
				true
			)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						$sessionStorage.omniPolicyExpEvent = true;
						getEvents();
					}
					else if (data.ResponseCode == 0) {
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

		/*------ Omnni Channel Policy Expiry Push Event Ends ----------*/

		/*------ To get events through omni channel ------*/

		function getEvents() {

			RenewService.postData(ABHI_CONFIG.apiUrl + "OmniChannel/EventOutCome", {
				"clientId": $scope.selectedPolicyDetails.Mobile,
				"assetId": $scope.selectedPolicyDetails.PolicyNumber
			}, true
			)
				.then(function (data) {
					//data = {"ResponseCode":1,"ResponseData":[{"_id":"SRVC2067964744572523-21-8661153-00CHA1001","channelId":"CHA1001","eventId":"EVE1031","clientId":"9647445725","messageText":"Your Aditya Birla Health Insurance policy is about to expire on 28th Nov 2022. Click on 'Pay Premium’ button to renew your policy.","assetId":"23-21-8661153-00","eventType":"Policy Expiry","dismissed":false,"uniqueRefId":"SRVC2067964744572523-21-8661153-00CHA1001","_metadata":{"version":{"document":17,"service":3,"release":"3.9"},"deleted":false,"lastUpdated":"2022-11-29T06:45:12.071Z","createdAt":"2022-10-15T06:21:44.918Z"}}],"ResponseMessage":"Success."}
					if (data.ResponseCode == 1) {
						$scope.OmniEvents = data.ResponseData;
						if ($scope.OmniEvents.length != 0) {
							var Events = [];
							for (var i = 0; i < $scope.OmniEvents.length; i++) {
								// for V3 price change notification
								// if($scope.planName == "Platinum - Enhanced" || $scope.planName == "Platinum - Essential")
								// {
								// 	Events.push("<li style='margin-bottom:10px'>" + $scope.OmniEvents[i].messageText + "</li> <li>Dear Policy Holder, premium for your Aditya Birla Health Insurance - Activ Health plan is revised effective 6th Oct 2023 under directives of IRDAI. Any renewal after 3rd January 2022 will be as per the revised premium slab.</li>");
								// } 
								if($scope.planName == "Active Assure - Diamond")
								{
									Events.push("<li style='margin-bottom:10px'>" + $scope.OmniEvents[i].messageText + "</li> <li>Dear Policy Holder, premium for your Aditya Birla Health Insurance - Activ Assure plan is revised effective 6th Oct 2023 under directives of IRDAI. Any renewal after 3rd January 2022 will be as per the revised premium slab.</li>");
								} else{
									Events.push("<li style='margin-bottom:10px'>" + $scope.OmniEvents[i].messageText + " : " + $scope.planName + "</li>");
								}
								
							}
							var allEvents = "<ul style='pointer-events:visible;'>" + Events.join('') + "</ul>";
							$rootScope.alertData = {
								"modalClass": "regular-alert",
								"modalHeader": "Alert",
								"modalBodyText": allEvents,
								"showCancelBtn": false,
								"modalSuccessText": "OK",
								"showAlertModal": true,
								"hideCloseBtn": true
							}
						} else{
							if($scope.planName == "Platinum - Enhanced" || $scope.planName == "Platinum - Essential")
							{
								var allEvents = "<ul style='pointer-events:visible;'>" + "<li>Dear Policy Holder, premium for your Aditya Birla Health Insurance - Activ Health plan is revised effective 6th Oct 2022 under directives of IRDAI. Any renewal after 3rd January 2023 will be as per the revised premium slab.</li>" + "</ul>";
								$rootScope.alertData = {
									"modalClass": "regular-alert",
									"modalHeader": "Alert",
									"modalBodyText": allEvents,
									"showCancelBtn": false,
									"modalSuccessText": "OK",
									"showAlertModal": true,
									"hideCloseBtn": true
								}
							}
						}
					} else if (data.ResponseCode == 0) {
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Alert",
							"modalBodyText": data.ResponseMessage,
							"showCancelBtn": false,
							"modalSuccessText": "OK",
							"showAlertModal": true,
							"hideCloseBtn": true
						}
					}
				})

		}

		/*----- End of To get events through omni channel -----*/

		// Smita Start

		// Smita Start

		$scope.checkGroupPolicy = function (policyNumber, mobileNumber) {
			if (policyNumber.includes('-') == false) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Invalid Policy Number",
					"modalBodyText": "Please enter valid policy number.",
					"showCancelBtn": false,
					"modalSuccessText": "Close",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
				return false;
			}

			var loginObj = {
				"LeadID": "",
				"MasterPolicyNumber": "",
				"CertificateNumber": policyNumber,
				"DOB": "",
				"ProposerMobileNumber": mobileNumber
			};

			$rootScope.showLoader = true;

			/**
			old endpoint  as part of CORS fixing Rohan had ask to change old end point to new one as blwo
			OLD: https://mtpre.adityabirlahealth.com/healthinsurance/GroupRenewal/api/groupRenew/CheckRenewDetails",loginObj)
			NEW: https://mtpre.adityabirlahealth.com/healthinsurance/buy-insurance-online/GroupRenewal/api/groupRenew/CheckRenewDetails
			AFTER CROSS: 
			https://mtpre.adityabirlahealth.com/healthinsurance/buy-insurance-online/GroupRenewal/api/groupRenew/CheckRenewDetails
			*/
			var URL = "https://mtpre.adityabirlahealth.com/healthinsurance/buy-insurance-online/GroupRenewal/api/groupRenew/CheckRenewDetails";
			RenewService.postData(URL, loginObj, true,{
				'x-ob-bypass': 1
			})
				.then(function (data) {
					if (data.ResponseCode == '1') {
						var policyDetails = data.ResponseData;
						if ((policyDetails.ErrorMessage != "" || policyDetails.ErrorMessage != undefined)) {
							sessionStorage.setItem('ut', policyDetails.Policies[0].ut);
							sessionStorage.refNoArray = JSON.stringify(policyDetails.Policies);
							$sessionStorage.loginWithMobileNumber = false;
							location.href = 'https://mtpre.adityabirlahealth.com/GroupRenewalUI/group-renew-landing';
						}
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

		// group renewal api end

		$scope.selectPolicyAndGetDetails = function (policyDetails, arrayIndex) {
			$scope.selectedPolicyDetails = policyDetails;
			$scope.checkUpsellFF($scope.selectedPolicyDetails);
			let mobileNo = $sessionStorage?.loginWithMobileNumber?.onlyMobileNumber || $sessionStorage?.onlyPolicyForMobile?.onlyMobileNumber;
			if (policyDetails.PolicyNumber != undefined && (policyDetails.PolicyNumber.startsWith("G") || policyDetails.PolicyNumber.startsWith("g"))) {
				$scope.checkGroupPolicy(policyDetails.PolicyNumber, mobileNo);
			} else {
				let checkAuthData = {
					"DOB": "",
					"PolicyNumber": policyDetails.PolicyNumber,
					"MobileNumber": mobileNo,
					"webagre": "marketing_campaign"
				}

				RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/CheckRenewDetails",
					checkAuthData, true
				)
					.then(function (data) {
						if (data.ResponseCode == '1') {
							$scope.showSingleMobilePolices = false;
							$scope.policyDetails = data.ResponseData;
							$sessionStorage.refNoArray = $scope.policyDetails.Policies[0];
							sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
							$scope.getAllPolicy(true);
							if (data.ResponseData.Policies.length > 1) {
								$rootScope.alertData = {
									"modalClass": "regular-alert",
									"modalHeader": "Alert",
									"modalBodyText": "Welcome back, we have your data saved. Would you like to proceed as per your last selection!",
									"showCancelBtn": true,
									"modalSuccessText": "Yes",
									"modalCancelText": "No",
									"hideCloseBtn": true,
									"gtagPostiveFunction": "click-button, pre-quote ,pre-quote_data-save[Yes]",
									"gtagCrossFunction": "click-button, pre-quote ,pre-quote_data-save[X]",
									"gtagNegativeFunction": "click-button, pre-quote ,pre-quote_data-save[No]",
									"showAlertModal": true,
									"positiveFunction": function () {

										/* 
											If user clicks yes then we pass old reference no. (0 position in array) number received in response
										*/
										$sessionStorage.refNoArray = $scope.policyDetails.Policies[0];
										sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
										$location.url('new-renewal-landing');
									},
									"negativeFunction": function () {
										/* 
											If user clicks NO then we pass new reference no. (last position in array) number received in response
										*/
										$sessionStorage.refNoArray = $scope.policyDetails.Policies[data.ResponseData.Policies.length - 1];
										sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
										$location.url('new-renewal-landing');
									}
								}
							}
							else {
								/* 
									If policy has single reference no.
								*/
								$sessionStorage.refNoArray = $scope.policyDetails.Policies[0];
								sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
								$location.url('new-renewal-landing');
							}
							// $sessionStorage.refNoArray = $scope.policyDetails.Policies;
							// sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
							// $location.url('new-renewal-landing');
						} else if (data.ResponseCode == '0' && (data.ResponseData != null && data.ResponseData.WhereToRedirect == 'PolicyBazar')) {
							$scope.redirectionUrl = data.ResponseData.RedirectionURL;
							$(".modal-dialog").css('width', 620);
							$rootScope.alertData = {
								"modalClass": "regular-alert",
								"modalHeader": "Alert",
								"modalBodyText": 'Dear Customer, Thank You for visiting our website. Unfortunately we are facing technical issue and we are working to resolve the same.</br> For any queries you may write to us at <a href="mailto:Care.healthinsurance@adityabirlacapital.com" style="font-size: 17px; pointer-events: visible;">care.healthinsurance@adityabirlacapital.com</a>. For policy servicing and renewal of your policy, you may also approach the Intermediary of your policy by <a href="' + $scope.redirectionUrl + '" target="_blank" style="font-size:18px; pointer-events: visible;">Clicking here.</a>',
								"showCancelBtn": false,
								"modalSuccessText": "Ok",
								"showAlertModal": true,
								"hideCloseBtn": true
							}
						} else if (data.ResponseCode == '0') {
							var errorMessage = data.ResponseData != null ? data.ResponseData.ErrorMessage : data.ResponseMessage
							if (errorMessage == 'Please provide proposal number or policy number') {
								$rootScope.alertData = {
									"modalClass": "regular-alert",
									"modalHeader": "Alert",
									"modalBodyText": 'Apologies for the inconvenience in your Renewal experience! We have captured your details, our representative will connect with you shortly on your registered mobile number.',
									"showCancelBtn": false,
									"modalSuccessText": "Ok",
									"showAlertModal": true,
									"hideCloseBtn": true
								}
							} else {
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

						}
					});
			}
		}

		if ($sessionStorage.onlyPolicyForMobile) {
			let singlePolicy = $sessionStorage.singleMobileSinglePolicy;
			if(singlePolicy != undefined){
				$scope.selectPolicyAndGetDetails(singlePolicy[0]);
			}
		}
		//Smita END


		/*----- Select Policy Details on check box  click -------*/

		$scope.selectPolicy = function (policyDetails, arrayIndex) {
			$scope.selectedPolicyDetails = policyDetails;
			$scope.checkUpsellFF($scope.selectedPolicyDetails);
			$scope.policySelected = policyDetails.PolicyNumber
			$scope.refNoSelected = policyDetails.ReferenceNo
			$scope.productName = policyDetails.ProductName
			$scope.tenureVal = policyDetails.Tenure
			$scope.insuredMembers = $scope.selectedPolicyDetails.InsuredMembers.slice(1);
			initializeupdateMember();
			suminuredValue($scope.insuredMembers, $scope.selectedPolicyDetails);
			healthReturnValue($scope.insuredMembers);
			fetchHealthReturnStatus();
			if ($scope.productName == 'Activ Care V2' || $scope.productName == 'Activ Care' || $scope.productName == 'Active Care V2' || $scope.productName == 'Active Care') {
				$scope.showThirdTenureVal = true;
			}
			if (policyDetails.UpsellFlag == 'Y' && $scope.insuredMembers[0].UpSellSumInsured != 0) {
				$scope.showSumInsured = true;
				$scope.indexVal = 1;
				$scope.upSellSumInsured = $scope.insuredMembers[0].UpSellSumInsured;
				if ($scope.suminsured == $scope.upSellSumInsured) {
					$scope.updateMembers = 'Y';
				}
				var UpsellMembersCount = 0;
				$scope.insuredMembers.forEach(function (item, index) {
					if (item.SumInsured == item.UpSellSumInsured) {
						$scope.updateMember[item.RelationWithProposer] = 'Y';
						UpsellMembersCount++;
					}
				})
				if ($scope.insuredMembers.length == UpsellMembersCount) {
					$scope.updateHealthMiMembers = 'Y';
				}
			} else {
				$scope.showSumInsured = false
				$scope.indexVal = 0;
			}

			$scope.showSliderMenu = false;
			$scope.instantiateSlider();

			for (var i = 0; i < $scope.policyDetails.length; i++) {
				if (i == arrayIndex) {
					$('#myCheckbox' + i).addClass('selectedCheckBox')
				} else {
					$('#myCheckbox' + i).removeClass('selectedCheckBox')
				}
			}

			$scope.policy = policyDetails.PolicyNumber


		}

		/*---- End of Select Policy Details on check box  click -----*/


		/*----- To Update Tenure ------*/

		$scope.updateTenure = function (tenure) {

			RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/UpdateTenure", {
				"Tenure": tenure,
				"ReferenceNo": $scope.refNoSelected,
				"PolicyNumber": $scope.policySelected
			}, true
			)
				.then(function (data) {
					if (data.ResponseCode == 1) {

						for (var i = 0; i < $scope.policyDetails.length; i++) {
							if ($scope.policySelected == $scope.policyDetails[i].PolicyNumber) {
								$scope.policyDetails[i].Tenure = tenure
								$scope.policyDetails[i].RenewalGrossPremium = data.ResponseData.premiumResponse.RenewGrossPremium
								$scope.tenureVal = tenure
							}
						}

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

		/*----- End of To Update Tenure ------*/


		/*------- Proceed To Modify Details -------- */

		$scope.procedToModifyDetails = function (pageName) {
			$sessionStorage.policyNo = $scope.policySelected;
			$sessionStorage.productName = $scope.productName;
			$sessionStorage.refNo = $scope.refNoSelected;
			$sessionStorage.personalDetials = {
				Email: $scope.selectedPolicyDetails.Email,
				Mobile: $scope.selectedPolicyDetails.Mobile
			}
			$sessionStorage.upsellFlag = $scope.selectedPolicyDetails.UpsellFlag;
			$location.url(pageName);
		}

		/*------- Proceed To Modify Details -------- */
		$scope.deducAmounts=[];
		$scope.setDeductable = function (sumi) {
			switch (sumi) {
				case "8500000":
					$scope.deducAmounts=["1500000"]
					break
				case "9000000":
					$scope.deducAmounts=["1000000"]
					break
				case "9500000":
				case "500000":
					$scope.deducAmounts=["500000"]
					break
				case "700000":
					let arr7=["500000", "700000"]
					if(arr7.includes($scope.insuredMembers[0].Deductible)){
						let i = arr7.indexOf($scope.insuredMembers[0].Deductible);
						$scope.deducAmounts = [arr7[i]];
					}
				break
				default:
					let arr=["500000", "700000", "1000000"]
					if(arr.includes($scope.insuredMembers[0].Deductible)){
						let i = arr.indexOf($scope.insuredMembers[0].Deductible);
						$scope.deducAmounts = [arr[i]];
					}
					break
			}
	
			return $scope.deducAmounts[0];
		}
		/*--------- To Update Sum Insured -------------------*/
		nRL.updateSum = "N"
		$scope.updateSumInsured = function (param, member, checked) {

			$scope.upgSumInsMembers = [];
			$scope.healthMiPolicy = false;

			if (($scope.selectedPolicyDetails.ProductName == 'Activ Health' || $scope.selectedPolicyDetails.ProductName == 'Activ Health V2' || $scope.selectedPolicyDetails.ProductName == 'POS Activ Secure' || $scope.selectedPolicyDetails.ProductName == 'Super Top Up' || $scope.selectedPolicyDetails.ProductName == 'POS Activ Assure' || $scope.selectedPolicyDetails.ProductName == 'Global Health Secure - Revised' || $scope.selectedPolicyDetails.ProductName == 'Arogya Sanjeevani Policy' || $scope.selectedPolicyDetails.ProductName.includes('Health')) && $scope.selectedPolicyDetails.SumInsuredType == 'Individual') {
				$scope.healthMiPolicy = true;
			}

			if (member) {
				$scope.memberid = angular.copy(member.MemberId)
				$scope.memberupsellsumi = angular.copy(member.UpSellSumInsured);
				$scope.memberinitialsi = angular.copy(member.InitialSumInsured);
			}

			function updatSumInsure(members, updatesi) {
				// if($scope.selectedPolicyDetails.SumInsuredType == "Family Floater"){
				// 	members.forEach(function (m, index) {
				// 		m.SumInsured = checked == 'Y'? Math.round(param) : $scope.selectedPolicyDetails.InsuredMembers[1].InitialSumInsured;
				// 	})
				// }

				RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/UpdateSumInsured", {
					"ReferenceNo": $scope.refNoSelected,
					"PolicyNumber": $scope.policySelected,
					"memberDetails": members
				}, true
				)
					.then(function (data) {
						if (data.ResponseCode == 1) {
							if (($scope.selectedPolicyDetails.ProductName == 'Activ Assure' || $scope.selectedPolicyDetails.ProductName == 'Activ Assure V2' || $scope.selectedPolicyDetails.ProductName == 'Activ Health' || $scope.selectedPolicyDetails.ProductName == 'POS Activ Secure' || $scope.selectedPolicyDetails.ProductName == 'Super Top Up' || $scope.selectedPolicyDetails.ProductName == 'POS Activ Assure' || $scope.selectedPolicyDetails.ProductName == 'Global Health Secure - Revised' || $scope.selectedPolicyDetails.ProductName == 'Arogya Sanjeevani Policy' || $scope.selectedPolicyDetails.ProductName == 'Activ Health V2' || $scope.selectedPolicyDetails.ProductName == 'POS Activ Secure' || $scope.selectedPolicyDetails.ProductName.includes('Health') || $scope.selectedPolicyDetails.ProductName == 'Active Care V2' || $scope.selectedPolicyDetails.ProductName == 'Activ Care') && ($scope.selectedPolicyDetails.SumInsuredType == 'Family Floater')) {
								$scope.suminsured = checked == 'Y'? Math.round(param) : $scope.selectedPolicyDetails.InsuredMembers[1].InitialSumInsured;
								for (var i = 0; i < $scope.policyDetails.length; i++) {
									if ($scope.policySelected == $scope.policyDetails[i].PolicyNumber) {
										$scope.policyDetails[i].RenewalGrossPremium = data.ResponseData.premiumResponse.RenewGrossPremium;
									}
								}
							}

							if ($scope.selectedPolicyDetails.ProductName == 'Activ Secure' || (($scope.selectedPolicyDetails.ProductName == 'Activ Assure' || $scope.selectedPolicyDetails.ProductName == 'Activ Assure V2' || $scope.selectedPolicyDetails.ProductName == 'Active Care V2' || $scope.selectedPolicyDetails.ProductName == 'Activ Care') && ($scope.selectedPolicyDetails.SumInsuredType == 'Individual'))) {
								$scope.suminsured = checked == 'Y'? Math.round(param) : $scope.selectedPolicyDetails.InsuredMembers[1].InitialSumInsured;
								for (var i = 0; i < $scope.insuredMembers.length; i++) {
									if ($scope.memberid == $scope.insuredMembers[i].MemberId) {
										$scope.insuredMembers[i].SumInsured = members[0].SumInsured;
									}
								}
								for (var i = 0; i < $scope.policyDetails.length; i++) {
									if ($scope.policySelected == $scope.policyDetails[i].PolicyNumber) {
										$scope.policyDetails[i].RenewalGrossPremium = data.ResponseData.premiumResponse.RenewGrossPremium;
									}
								}
							}

							if (($scope.selectedPolicyDetails.ProductName == 'Activ Health' || $scope.selectedPolicyDetails.ProductName == 'Activ Health V2' || $scope.selectedPolicyDetails.ProductName == 'POS Activ Secure' || $scope.selectedPolicyDetails.ProductName == 'Super Top Up' || $scope.selectedPolicyDetails.ProductName == 'POS Activ Assure' || $scope.selectedPolicyDetails.ProductName == 'Global Health Secure - Revised' || $scope.selectedPolicyDetails.ProductName == 'Arogya Sanjeevani Policy' || $scope.selectedPolicyDetails.ProductName.includes('Health')) && ($scope.selectedPolicyDetails.SumInsuredType == 'Individual')) {
								$scope.suminsured = checked == 'Y'? Math.round(param) : $scope.selectedPolicyDetails.InsuredMembers[1].InitialSumInsured;
								for (var i = 0; i < $scope.insuredMembers.length; i++) {
									$scope.insuredMembers[i].SumInsured = members[0].SumInsured;
								}
								for (var i = 0; i < $scope.policyDetails.length; i++) {
									if ($scope.policySelected == $scope.policyDetails[i].PolicyNumber) {
										$scope.policyDetails[i].RenewalGrossPremium = data.ResponseData.premiumResponse.RenewGrossPremium;
									}
								}
							}
							if ($window.innerWidth > 650) {
								$scope.showSliderMenu = false;
								$scope.instantiateSlider();
							}
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
						$scope.getAllPolicy(true);
					})
			}

			if (member && checked == 'Y') {
				updatSumInsure([{
					MemberID: member.MemberId,
					SumInsured: member.UpSellSumInsured,
					Relation: member.RelationWithProposer,
					Deductible:$scope.selectedPolicyDetails.ProductName == 'Super Top Up'?$scope.setDeductable(member.UpSellSumInsured):""
				}], true);
			}

			if (member && checked == 'N') {
				updatSumInsure([{
					MemberID: member.MemberId,
					SumInsured: member.FixedInitialSI,
					Relation: member.RelationWithProposer,
					Deductible:$scope.selectedPolicyDetails.ProductName == 'Super Top Up'?$scope.setDeductable(member.FixedInitialSI):""
				}], false);
			}

			if (!member && checked == 'Y' ) {

				for (var i = 0; i < $scope.insuredMembers.length; i++) {
					$scope.upgSumInsMembers.push({
						MemberID: $scope.insuredMembers[i].MemberId,
						SumInsured: $scope.insuredMembers[0].UpSellSumInsured,
						Relation: $scope.insuredMembers[i].RelationWithProposer,
						Deductible:$scope.selectedPolicyDetails.ProductName == 'Super Top Up'?$scope.setDeductable($scope.insuredMembers[0].UpSellSumInsured):""
					});
				}
				updatSumInsure($scope.upgSumInsMembers, true);
			}

			if (!member && checked == 'N' ) {

				for (var i = 0; i < $scope.insuredMembers.length; i++) {
					$scope.upgSumInsMembers.push({
						MemberID: $scope.insuredMembers[i].MemberId,
						SumInsured: $scope.insuredMembers[0].FixedInitialSI,
						Relation: $scope.insuredMembers[i].RelationWithProposer,
						Deductible:$scope.selectedPolicyDetails.ProductName == 'Super Top Up'?$scope.setDeductable($scope.insuredMembers[0].FixedInitialSI):""
					});
				}
				updatSumInsure($scope.upgSumInsMembers, false);
			}

		}

		/*--------- End of To Update Sum Insured --------------*/

		/*--------- To Apply Health Return --------------*/

		$scope.applyForHealthReturn = function (applyHealthReturn) {

			RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/UpdateHealthReturnFlag", {
				"ReferenceNo": $scope.refNoSelected,
				"PolicyNumber": $scope.policySelected,
				"Flag": applyHealthReturn
			},
				true
			)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						for (var i = 0; i < $scope.policyDetails.length; i++) {
							if ($scope.policySelected == $scope.policyDetails[i].PolicyNumber) {
								$scope.policyDetails[i].RenewalGrossPremium = data.ResponseData.premiumResponse.RenewGrossPremium;
							}
						}
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

		/*--------- End of To Apply Health Return --------------*/


		/*-------------------- To Select Payment Mode --------------------------*/

		$scope.selectPaymentMode = function () {
			if ($scope.selectedPolicyDetails.Autodebit == 'N') {
				$scope.showPaymentModeModal = true;
			} else if ($scope.selectedPolicyDetails.Autodebit == 'Y') {
				var today = new Date();
				var todayMonth = today.getMonth() + 1;
				if (todayMonth < 10) {
					todayMonth = "0" + (today.getMonth() + 1);
				}
				var todayDay = today.getDate();
				if (todayDay < 10) {
					todayDay = "0" + today.getDate();
				}
				var TodayDate = today.getFullYear() + "" + todayMonth + "" + todayDay;

				var expDate = $scope.selectedPolicyDetails.PolicyExpiryDate.trim().split('/');
				var PolicyExpDate = expDate[1] + "/" + expDate[0] + "/" + expDate[2];
				var PolicyExpDate1 = expDate[2] + "" + expDate[1] + "" + expDate[0];

				var autoDebitProcessDate = new Date(PolicyExpDate);
				autoDebitProcessDate.setDate(autoDebitProcessDate.getDate() - 15);
				var dd = autoDebitProcessDate.getDate();
				var mm = autoDebitProcessDate.getMonth() + 1;
				var yyyy = autoDebitProcessDate.getFullYear();
				if (dd < 10) {
					dd = '0' + dd
				}
				if (mm < 10) {
					mm = '0' + mm
				}
				var autoDebitProcessDate = yyyy + "" + mm + "" + dd;

				if ((TodayDate >= autoDebitProcessDate) && (TodayDate <= PolicyExpDate1)) {
					$scope.showAutoDebitModal = true;
				} else {
					$scope.pgPaymentMode = 'normal';
					$scope.requestPgURL();
				}

			}
		}

		/*-------------------- To Select Payment Mode Ends--------------------------*/

		/*--------- To Make PG Request ----------*/

		$scope.radioChecked = function() {	
			console.log(dLC.tcAgreed)  
			if(!dLC.tcAgreed){
			   dLC.tcAgreed = true;
			}else{
			   dLC.tcAgreed = false;
			}
		  }

		$scope.requestPgURL = function () {
			//T&C Changes
			if((dLC.tcAgreed && $scope.pgPaymentMode == 'JP_ emandate') || (dLC.tcAgreed && $scope.pgPaymentMode == 'JP_Enach') || $scope.pgPaymentMode == 'JP_normal' || $scope.pgPaymentMode == 'normal' || $scope.pgPaymentMode == 'emandate_normal') {
				$scope.showPaymentModeModal=false;
				RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/PGRequest", {
					"ReferenceNo": $scope.refNoSelected,
					"PolicyNumber": $scope.policySelected,
					"PaymentType": $scope.pgPaymentMode
				},
					true
				)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						window.location.href = data.ResponseData;
					} else if (data.ResponseCode == 0) {
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Alert",
							"modalBodyText": "Oops! something went wrong, There seems to be a problem. Please try again after some time.",
							"showCancelBtn": false,
							"modalSuccessText": "Ok",
							"showAlertModal": true,
							"hideCloseBtn": true
						}
					}
				});
			} 
			//T&C Changes ends  
			else {
				$scope.showPaymentModeModal=true;
			}
		}

		/*------ End of To Make PG Request ---------*/

		/*--------- To Open Modal --------*/

		$scope.openModal = function () {
			$scope.showModal = true;
		}

		/*--------- End of To Open Modal ----------------*/

		/*--------- To Close Modal --------------*/

		$scope.closeModal = function () {
			$scope.showModal = false;
		}

		/*--------- End of To Close Modal -------------*/
		 $scope.ghdAll = [];

		/*--------- To GHD Radio selection -------------*/
		$scope.radioChange = function (currentId, value, member) {
			let mObj = {};
			console.log(currentId + " :: " + value);
			
				mObj = {
					"ReferenceNo": $scope.refNoSelected,
					"PolicyNumber": $scope.policyDetails[0].PolicyNumber,
					"MemberID": member.MemberId,
					"GHDApplicable": value,
				};
				if(mObj.GHDApplicable){
					$scope.ghdAll.push(mObj);
				}

			if($scope.ghdAll.length == $scope.policyMembers.length - 1){
				$("#btnPremium01, #btnPremium02, #btnPremium03, #btnPremium04, #btnPremium05, #btnPremium06, #btnPremium07").removeAttr("disabled");
			}
			if (value.toLowerCase() == "y") {
				$("#memberRemarks" + currentId).removeClass("d-none");
			} else {
				$("#memberRemarks" + currentId).addClass("d-none");
			}
			
			console.log($scope.ghdAll);
		};
		
		/*--------- End of To GHD Radio selection -------------*/

		/*--------- To GHD Submission -------------*/
		$scope.submitGHD = function (device) {
			if ($scope.selectedPolicyDetails.LapsedButIsInNewGracePeriod == 'Y') {
				var ghdArray = [];
				// [
				// 	{
				// 		"ReferenceNo":"R2022042016563866010978",
				// 		"PolicyNumber":"24-22-0000016-00",
				// 		"MemberID":"PT00873485",
				// 		"personalDetails": {
				// 								"FirstName":"Junaid ",
				// 								"MiddleName":"",
				// 								"LastName":"",
				// 								"DOB":"1996-12-01",
				// 								"Email":"junaid.shaikh@aqmtechnologies.com",
				// 								"Relation":"",
				// 								"RelationWithProposer":"Self"
				// 							},
				// 		"GHDApplicable":"Y",
				// 		"GHDRemarks":"hasgdyafydayshgdyasgdyugawyu"
				// 	},
				// 	{
				// 		"ReferenceNo":"R2022042016563866010978",
				// 		"PolicyNumber":"24-22-0000016-00",
				// 		"MemberID":"PT00873486",
				// 		"personalDetails": {
				// 								"FirstName":"Shifa  ",
				// 								"MiddleName":"",
				// 								"LastName":"",
				// 								"DOB":"2000-01-01",
				// 								"Email":"",
				// 								"Relation":"",
				// 								"RelationWithProposer":"Spouse"
				// 							},
				// 		"GHDApplicable":"Y",
				// 		"GHDRemarks":"spouce remark"
				// 	}
				// ]

				$('.dv-memberCard-' + device).each(function () {
					var seq = $(this).find(".dv-member").attr("id").replace("member", "");
					var mObj = {
						"ReferenceNo": $scope.refNoSelected,
						"PolicyNumber": $scope.policyDetails[0].PolicyNumber,
						"MemberID": $(this).find(".lblMemberId").text(),
						"personalDetails": {
							"FirstName": $(this).find(".lblMemberName").text(),
							"MiddleName": $(this).find(".lblMiddleName").text(),
							"LastName": $(this).find(".lblLastName").text(),
							"DOB": $(this).find(".lblDOB").text(),
							"Email": $(this).find(".lblEmail").text(),
							"Relation": $(this).find(".lblRelation").text(),
							"RelationWithProposer": $(this).find(".lblRelationWithProposer").text()
						},
						"GHDApplicable": $(this).find("input:radio[name='ghdRadio" + seq + "']:checked").val(),
						"GHDRemarks": $(this).find(".txtRemarks").val()
					};
					ghdArray.push(mObj);
				});

				console.log(ghdArray);

				RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/GHD", ghdArray, true
				)
					.then(function (data) {
						if (data.ResponseCode == 1) {

							console.log("GHD Success");

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
		}
		/*--------- End of GHD Submission -------------*/
	}]);