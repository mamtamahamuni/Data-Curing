/**   
	Module: Renewal Renew Policy Page Controller (Responsible for checking (or validating) user Policy Credentials and landing user on 'New Renewal Landing Page' on valid credentials)
	Author: Pandurang Sarje 
	Date: 01-09-2020
**/

var renewalRenewApp = angular.module('renewalRenewModule', []);

'use strict';

renewalRenewApp.controller("renewal-renew", function ($scope, appService, ABHI_CONFIG, $localStorage, $rootScope, $location, $sessionStorage, $window, $routeParams, RenewService, $timeout, $interval) {

	/*----- To delete existing login data ---*/

	delete $sessionStorage.refNoArray;
	delete $sessionStorage.policyNo;
	delete $sessionStorage.productName;
	delete $sessionStorage.refNo;
	delete $sessionStorage.checkAuthData;
	delete $sessionStorage.personalDetials;
	delete $sessionStorage.upsellFlag;
	delete $sessionStorage.dropOff;
	delete $sessionStorage.loginWithMobileNumber;
	delete $sessionStorage.singleMobileMultiPolicy;
	delete $sessionStorage.singleMobileSinglePolicy;

	sessionStorage.removeItem("ut");
	sessionStorage.removeItem("refNoArray");
	sessionStorage.removeItem("singleMobileMultiPolicy");
	sessionStorage.removeItem("userData");
	sessionStorage.removeItem("policyNewCover");
	
1
	/*----- End of To delete existing login data ---*/

	/*---- Data Inilization ----*/

	$rootScope.showLoader = false;
	$rootScope.alertBox = false;
	/* for developing condition added for messaging functionality (bypass login only for messaging functionality) */
	if ($routeParams.m || $routeParams.d) {
		$scope.userLoggedIn = true;
	} else {
		$scope.userLoggedIn = !!$localStorage.login;
	}


	/*---- End of Data Inilization ----*/

	/*---- Intialization of auth scope ------------------*/

	$scope.auth = {
		'policynumber': '',
		'dob': '',
		'txtMobileNumber': '',
		'defaultRenewalMethod': 'policy',
		'isMobileMethod': true,
		'onlyMobileNumber': '',
		'otpValue': '',
		'showOTPField': false,
		'sendOTPButton': true
	};

	/*---- End of Intialization of auth scope -----------*/

	/*---- To check if RouteParmas available & decrypt it in Non-Logged In Case -----*/

	if (!$scope.userLoggedIn) {

		if ($routeParams.p) {
			var policyNumber = atob($routeParams.p);
			if (policyNumber != 'undefined' && policyNumber != null && policyNumber != '') {
				$scope.auth.policynumber = policyNumber;
			}
		}

	}

	/*---- End of To check if RouteParmas available & decrypt it in Non-Logged In Case -----*/

	/************************group policy************************** */
	$scope.checkGroupPolicy = function (auth, form) {
		if(form){
			if (auth.policynumber.includes('-') == false) {
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
			} else if (form.dob.$error.pattern) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Invalid Date of birth",
					"modalBodyText": "Please enter valid date of birth.",
					"showCancelBtn": false,
					"modalSuccessText": "Close",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
				return false;

			}else if (form.txtMobileNumber.$error.pattern) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Invalid Mobile Number",
					"modalBodyText": "Please enter valid mobile number.",
					"showCancelBtn": false,
					"modalSuccessText": "Close",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
				return false;
			} else {
				var inputs = $(".renew-form .form-control");
				var ind = 0;
				for (var i = 0; i < inputs.length; i++) {
					if ($(inputs[i]).val() == '') {
						if (i == 1 || i == 2) {
							ind = ind + 1;
						}
					}
				}
				if (ind >= 2) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Insufficient details",
						"modalBodyText": "Please provide atleast 2 details.",
						"showCancelBtn": false,
						"modalSuccessText": "Close",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
					return false;
				}
				var checkAuthData = null;
	
				var subDate = auth.dob.split('/');
	
				var subDate1;
	
				if ((angular.isUndefined(subDate[0]) || subDate[0] == null) || (angular.isUndefined(subDate[1]) || subDate[1] == null) || (angular.isUndefined(subDate[2]) || subDate[2] == null)) {
					subDate1 = "";
				} else {
					subDate1 = subDate[1] + "/" + subDate[0] + "/" + subDate[2];
				}
	
				
			}
		}

		var loginObj = {
			"LeadID": "",
			"MasterPolicyNumber": "",
			"CertificateNumber": auth.policynumber,
			"DOB": (angular.isUndefined(subDate1) || subDate1 == null) ? "" : subDate1,
			"ProposerMobileNumber": auth.txtMobileNumber
		}
		$rootScope.showLoader = true;

		// RenewService.postData("https://mtpre.adityabirlahealth.com/GroupRenewal/api/groupRenew/CheckRenewDetails", loginObj, true)
		// backup url
		RenewService.postData("https://mtpre.adityabirlahealth.com/healthinsurance/GroupRenewal/api/groupRenew/CheckRenewDetails", loginObj, true)
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


	/************************group policy************************** */

	/*----- To Validate User logged In & Check for  RouteParams availbale & decrypt it -------*/

	function validateUserLogin() {

		if ($scope.userLoggedIn) {

			if ($routeParams.p && ($routeParams.d || $routeParams.m)) {

				var policyNumber = atob($routeParams.p);
				var policyDob = $routeParams.d != undefined ? atob($routeParams.d) : '';
				var txtMobileNumber = $routeParams.m != undefined ? atob($routeParams.m) : '';
				var apiURL = '';

				if ((policyNumber != 'undefined' && policyNumber != null && policyNumber != '') && ((policyDob != 'undefined' && policyDob != null && policyDob != '') || (txtMobileNumber != 'undefined' && txtMobileNumber != null && txtMobileNumber != ''))) {

					$rootScope.showLoader = true;
					var checkAuthData = null;

					if (policyDob != 'undefined' && policyDob != null && policyDob != '') {
						var subDate = policyDob.split('/');

						var subDate1;

						if ((angular.isUndefined(subDate[0]) || subDate[0] == null) || (angular.isUndefined(subDate[1]) || subDate[1] == null) || (angular.isUndefined(subDate[2]) || subDate[2] == null)) {
							subDate1 = "";
						} else {
							subDate1 = subDate[1] + "/" + subDate[0] + "/" + subDate[2];
						}
					}
					if (policyNumber != undefined && (policyNumber.charAt(0).toLowerCase() != policyNumber.charAt(0).toUpperCase())) {


						// checkAuthData = {
						// 	"LeadID": "",
						// 	"MasterPolicyNumber": "",
						// 	"CertificateNumber": policyNumber,
						// 	"DOB": (angular.isUndefined(subDate1) || subDate1 == null) ? "" : subDate1,
						// 	"ProposerMobileNumber": txtMobileNumber
						// }

						$scope.auth.policynumber = policyNumber;
						$scope.auth.dob = policyDob;
						$scope.auth.txtMobileNumber = txtMobileNumber;
						
							$scope.checkGroupPolicy($scope.auth, null)
						  
						return;
						// apiURL = "https://mtpre.adityabirlahealth.com/GroupRenewal/api/groupRenew/CheckRenewDetails";
					}
					else {
						checkAuthData = {
							"PolicyNumber": policyNumber,
							"DOB": (angular.isUndefined(subDate1) || subDate1 == null) ? "" : subDate1,
							"MobileNumber": txtMobileNumber,
							"webagre": "marketing_campaign"
						}
						apiURL = ABHI_CONFIG.apiUrl + "Renew/CheckRenewDetails";
					}

					$sessionStorage.checkAuthData = checkAuthData;
					$rootScope.allowNextPage = "allow";

					RenewService.postData(apiURL,
						checkAuthData, true
					)
						.then(function (data) {
							//data = {"ResponseCode":1,"ResponseData":{"Policies":[{"PolicyNumber":"23-22-0000708-01","ReferenceNo":"R2022042016563866010978","ut":"772FE511532A40EE97D225282C5EBAD7E8EC0EC00B1A418989EA9A0E9EAF9705840FA54127FD41AFA59C11EEECEBDAD5"}],"WhereToRedirect":null,"RedirectionURL":null,"ErrorMessage":null},"ResponseMessage":"Success."};
							if (data.ResponseCode == '1') {
								$scope.policyDetails = data.ResponseData
								policyDetails = data.ResponseData
								// console.log($scope.policyDetails);
								/*
									If policy has multiple reference no.
								*/
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
											$sessionStorage.loginWithMobileNumber = false;
											$location.url('new-renewal-landing');
										},
										"negativeFunction": function () {
											/* 
												If user clicks NO then we pass new reference no. (last position in array) number received in response
											*/
											$sessionStorage.refNoArray = $scope.policyDetails.Policies[data.ResponseData.Policies.length - 1];
											sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
											$sessionStorage.loginWithMobileNumber = false;
											//$location.url('new-renewal-landing');
											($routeParams.n == 'new') ? $location.url('new-renewal-landing-new') : $location.url('new-renewal-landing');
										}
									}
								}
								else {
									/* 
										If policy has single reference no.
									*/
									$sessionStorage.refNoArray = policyDetails.Policies[0];
									sessionStorage.setItem('ut', policyDetails.Policies[0].ut);
									$sessionStorage.loginWithMobileNumber = false;

									if (checkAuthData.CertificateNumber != undefined && (checkAuthData.CertificateNumber.charAt(0).toLowerCase() != checkAuthData.CertificateNumber.charAt(0).toUpperCase())) {
										setTimeout(() => {
											location.href = 'http://10.12.1.227:8080/group-renew-landing';
										}, 1000);
									}
									else{
										$location.url('new-renewal-landing');
									}
									//$location.url('new-renewal-landing');
									// ($routeParams.n == 'new') ? $location.url('new-renewal-landing-new') : $location.url('new-renewal-landing');

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
			}

		}

	}

	validateUserLogin();

	/*----- To Validate User logged In & Check for  RouteParams availbale & decrypt it -------*/

	/*---------- To validate form & check login ----------*/

	var checkAuthData = null;

	$scope.withMobileToggle = {
		getOtp: true,
		getPolicy: false
	};

	//////// SMITA ================

	$scope.toggleSelectionMethod = function (method) {
		$scope.auth.isMobileMethod = method === 'mobile' ? true : false;
	}

	$scope.loginWithMobileNumber = function (auth, form) {
		RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/RenewWithMobileNumber",
			{
				"MobileNumber": $scope.auth.onlyMobileNumber
			},
			true,
			{
				'x-ob-bypass': 1
			}).then(
				(data) => {
					if (data.ResponseCode == '1') {
						if (data.ResponseData.Count > 1) {
							$sessionStorage.loginWithMobileNumber = $scope.auth;
							$scope.auth.multilePolicies = true;
							sessionStorage.setItem('singleMobileMultiPolicy', JSON.stringify(data.ResponseData.Response));
							$location.url('new-renewal-landing');
						} else if (data.ResponseData.Count == 1) {
							$sessionStorage.onlyPolicyForMobile = $scope.auth;
							$scope.auth.onlyPolicyFromMobileNo = true;
							$sessionStorage.singleMobileSinglePolicy = data.ResponseData.Response;
							$location.url('new-renewal-landing');
						} else if (data.ResponseData.Count === 0) {
							$scope.auth = {
								'policynumber': '',
								'dob': '',
								'txtMobileNumber': '',
								'defaultRenewalMethod': 'mobile',
								'isMobileMethod': true,
								'onlyMobileNumber': '',
								'otpValue': '',
								'showOTPField': false,
								'sendOTPButton': true
							};

							$rootScope.alertData = {
								"modalClass": "regular-alert",
								"modalHeader": "No Policies",
								"modalBodyText": "No policy found against entered mobile number. Kindly enter the registered mobile number.",
								"showCancelBtn": false,
								"modalSuccessText": "Close",
								"showAlertModal": true,
								"hideCloseBtn": true
							}

						} else {
							$scope.auth.multilePolicies = false;
							$location.url('new-renewal-landing');
						}
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

							$scope.auth = {
								'policynumber': '',
								'dob': '',
								'txtMobileNumber': '',
								'defaultRenewalMethod': 'mobile',
								'isMobileMethod': true,
								'onlyMobileNumber': '',
								'otpValue': '',
								'showOTPField': false,
								'sendOTPButton': true
							};
						}
					}
				},
				(error) => {
					//reset values

				}

			); //check policy details
	};


	/* trigger otp function */
	$scope.otpTriggerTime = 0;
	$scope.triggerOTP = function (param, form, isResend) {
		if (Object.keys(form?.onlyMobileNumber?.$error || "").length || form?.onlyMobileNumber?.$error.pattern) {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Invalid Mobile Number",
				"modalBodyText": "Please enter valid mobile number.",
				"showCancelBtn": false,
				"modalSuccessText": "Close",
				"showAlertModal": true,
				"hideCloseBtn": true
			}
		} else {
			if (isResend) {
				$scope.otpTriggerTime++;
				$scope.auth.otpValue = '';
			}

			RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/RenewRequestOTP",
				{
					"MobileNumber": $scope.auth.onlyMobileNumber
				},
				true,
				{
					'x-ob-bypass': 1
				}).then(
					(res) => {
						if (res === undefined) {
							$rootScope.alertData = {
								"modalClass": "regular-alert",
								"modalHeader": "Unable to process",
								"modalBodyText": "Something went wrong ...",
								"showCancelBtn": false,
								"modalSuccessText": "Close",
								"showAlertModal": true,
								"hideCloseBtn": true
							}
						} else if (res.ResponseCode === 1) {
						
							if ($scope.otpTriggerTime !== 3) {
								$scope.auth.countDown = 90;
								var intervalRef = $interval(function () {
									$scope.auth.countDown = $scope.auth.countDown - 1;
									$scope.auth.showTimer = true;
								}, 1000);

								$timeout(function () {
									$interval.cancel(intervalRef);
									$scope.auth.showTimer = false;
								}, 90000);
							}

							$scope.auth.showOTPField = true;
							$scope.auth.sendOTPButton = false;
							$scope.auth.showOTPMessage = res.ResponseMessage;

						}
					}, (error) => {

					}
				);
		}
	}

	$scope.verifyOTP = function (param, form) {
		if (Object.keys(form?.otpValue?.$error || "").length) {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Invalid OTP",
				"modalBodyText": "Please enter valid OTP.",
				"showCancelBtn": false,
				"modalSuccessText": "Close",
				"showAlertModal": true,
				"hideCloseBtn": true
			}
		} else {

			RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/RenewVerifyOTP",
				{
					"MobileNumber": $scope.auth.onlyMobileNumber,
					"OTP": $scope.auth.otpValue
				},
				true,
				{
					'x-ob-bypass': 1
				}).then(
					(res) => {
						if (res.ResponseCode === 1) {
							$scope.loginWithMobileNumber();
						} else {
							$scope.auth.OTPErrorMessage = res.ResponseMessage
						}

					}, (error) => {

					}
				);
		}
	}
	/* trigger OTP function ends */


	///// SMITA END ===================

	$scope.checkLogin = function (auth, form) {
		if (auth.policynumber != undefined && (auth.policynumber.charAt(0).toLowerCase() != auth.policynumber.charAt(0).toUpperCase())) {
			$scope.checkGroupPolicy(auth, form)
		} else if (form.policynumber.$error.minlength || auth.policynumber.includes('-') == false) {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Invalid Policy Number",
				"modalBodyText": "Please enter valid policy number.",
				"showCancelBtn": false,
				"modalSuccessText": "Close",
				"showAlertModal": true,
				"hideCloseBtn": true
			}
		} else if (form.dob.$error.pattern) {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Invalid Date of birth",
				"modalBodyText": "Please enter valid date of birth.",
				"showCancelBtn": false,
				"modalSuccessText": "Close",
				"showAlertModal": true,
				"hideCloseBtn": true
			}
		} else if (form.txtMobileNumber.$error.pattern) {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Invalid Mobile Number",
				"modalBodyText": "Please enter valid mobile number.",
				"showCancelBtn": false,
				"modalSuccessText": "Close",
				"showAlertModal": true,
				"hideCloseBtn": true
			}
		} else {
			//if (!form.$$success.parse || form.$$success.parse.length < 2) {
			if (!form.$$success.parse) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Insufficient details",
					"modalBodyText": "Please provide atleast 2 details.",
					"showCancelBtn": false,
					"modalSuccessText": "Close",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
			} else {
				var inputs = $(".renew-form .form-control");
				var ind = 0;
				for (var i = 0; i < inputs.length; i++) {
					if ($(inputs[i]).val() == '') {
						if (i == 1 || i == 2) {
							ind = ind + 1;
						}
					}
				}
				if (ind >= 2) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Insufficient details",
						"modalBodyText": "Please provide atleast 2 details.",
						"showCancelBtn": false,
						"modalSuccessText": "Close",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
					return false;
				}

				var subDate = auth.dob.split('/');

				var subDate1;

				if ((angular.isUndefined(subDate[0]) || subDate[0] == null) || (angular.isUndefined(subDate[1]) || subDate[1] == null) || (angular.isUndefined(subDate[2]) || subDate[2] == null)) {
					subDate1 = "";
				} else {
					subDate1 = subDate[1] + "/" + subDate[0] + "/" + subDate[2];
				}

				checkAuthData = {
					"PolicyNumber": auth.policynumber,
					"DOB": (angular.isUndefined(subDate1) || subDate1 == null) ? "" : subDate1,
					"MobileNumber": auth.txtMobileNumber,
					"webagre": "marketing_campaign"
				}

				$sessionStorage.checkAuthData = checkAuthData;
				$rootScope.allowNextPage = "allow";

				RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/CheckRenewDetails",
					checkAuthData, true
				)
					.then(function (data) {
						if (data.ResponseCode == '1') {
							$scope.policyDetails = data.ResponseData
							// console.log($scope.policyDetails);
							/*
								If policy has multiple reference no.
							*/
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
										$sessionStorage.loginWithMobileNumber = false;
										$location.url('new-renewal-landing');
									},
									"negativeFunction": function () {
										/* 
											If user clicks NO then we pass new reference no. (last position in array) number received in response
										*/
										$sessionStorage.refNoArray = $scope.policyDetails.Policies[data.ResponseData.Policies.length - 1];
										sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
										$sessionStorage.loginWithMobileNumber = false;
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
								$sessionStorage.loginWithMobileNumber = false;
								$location.url('new-renewal-landing');
							}
							// $sessionStorage.refNoArray = $scope.policyDetails.Policies;
							// sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
							// $location.url('new-renewal-landing');
						} else if (data.ResponseCode == '0') {

							if(data.ResponseData.WhereToRedirect == null)
							{							
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
							} else {
								if(data.ResponseData.WhereToRedirect != null && data.ResponseData.WhereToRedirect == 'PolicyBazar'){
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

						
					})

			}

		}
	}

	/*---------- End of To validate form & check login ----------*/

	
	/*---------- To append '-' in Policy Number --------------*/

	$(function () {
		$('#policynum').on('keypress', function (e) {
			var key = e.charCode || e.keyCode || 0;
			var value = e.originalEvent.key
			var text = $(this);
			var policyval = text.val();
			var val = policyval.toUpperCase()
			if (val.charAt(0).toLowerCase() != val.charAt(0).toUpperCase()) {
				switch (val) {
					case "GHI":
						if (text.val().length === 3) {
							text.val(text.val() + '-');
						} else {
							val = "";
						}
						break;
					case "GPA":
						if (text.val().length === 3) {
							text.val(text.val() + '-');
						} else {
							val = "";
						}
						break;
					case "GCI":
						if (text.val().length === 3) {
							text.val(text.val() + '-');
						} else {
							val = "";
						}
						break;
					case "GFB":
						if (text.val().length === 3) {
							text.val(text.val() + '-');
						} else {
							val = "";
						}
						break;
					case "GP":
						if (text.val().length === 2) {

							text.val(text.val() + '-');
						} else {
							val = "";
						}
						break;

					default:
						break;
				}
				if (val.startsWith('GP') && text.val().length === 5) {
					text.val(text.val() + '-');
				} else if ((val.startsWith('GHI') || val.startsWith('GFB') || val.startsWith('GCI') || val.startsWith('GPA')) && text.val().length === 6) {
					text.val(text.val() + '-');
				} else if (val.startsWith('GP') && text.val().length === 8) {
					text.val(text.val() + '-');
				} else if ((val.startsWith('GHI') || val.startsWith('GFB') || val.startsWith('GCI') || val.startsWith('GPA')) && text.val().length === 9) {
					text.val(text.val() + '-');
				} else if (val.startsWith('GP') && text.val().length > 25) {
					val = val.slice(0, -1);
				} else if ((val.startsWith('GHI') || val.startsWith('GFB') || val.startsWith('GCI') || val.startsWith('GPA')) && text.val().length > 25) {
					val = val.slice(0, -1);
				}
			} else {
				if (key !== 8 && key !== 9) {
					if (text.val().length === 2) {
						text.val(text.val() + '-');
					}
					if (text.val().length === 5) {
						text.val(text.val() + '-');
					}
					if (text.val().length === 13) {
						text.val(text.val() + '-');
					}
					if (text.val().length === 16) {
						text.val(text.val() + '-');
					}
				}
				return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
			}
		})
	});

	/*---------- End of To append '-' in Policy Number --------*/

	/*----------- on keyup append '-' in policy number -----------*/
	$scope.checkPolicyNumber = function () {
		if (($scope.auth.policynumber.charAt(0).toLowerCase() != $scope.auth.policynumber.charAt(0).toUpperCase()) && ($scope.auth.policynumber.includes('-') == false)) {
			if ($scope.auth.policynumber.startsWith("GHI") || $scope.auth.policynumber.startsWith("GCI") || $scope.auth.policynumber.startsWith("GFB") || $scope.auth.policynumber.startsWith("GPA")) {
				$scope.auth.policynumber = $scope.auth.policynumber = $scope.auth.policynumber.slice(0, 3) + '-' + $scope.auth.policynumber.slice(3, 5) + '-' + $scope.auth.policynumber.slice(5, 7) + '-' + $scope.auth.policynumber.slice(7, 14) + '-' + $scope.auth.policynumber.slice(14, 16);
				var policyNumber = $scope.auth.policynumber.charAt($scope.auth.policynumber.length - 1);
				if (policyNumber == '-') {
					$scope.auth.policynumber = $scope.auth.policynumber.slice(0, $scope.auth.policynumber.lastIndexOf('-', $scope.auth.policynumber.length - 1))
				}
			} else if ($scope.auth.policynumber.startsWith("GP")) {
				$scope.auth.policynumber = $scope.auth.policynumber = $scope.auth.policynumber.slice(0, 2) + '-' + $scope.auth.policynumber.slice(2, 4) + '-' + $scope.auth.policynumber.slice(4, 6) + '-' + $scope.auth.policynumber.slice(6, 13) + '-' + $scope.auth.policynumber.slice(13, 15);
				var policyNumber = $scope.auth.policynumber.charAt($scope.auth.policynumber.length - 1);
				if (policyNumber == '-') {
					$scope.auth.policynumber = $scope.auth.policynumber.slice(0, $scope.auth.policynumber.lastIndexOf('-', $scope.auth.policynumber.length - 1))
				}
			}
		} else {
			if (($scope.auth.policynumber != '') && ($scope.auth.policynumber.includes('-') == false)) {
				$scope.auth.policynumber = $scope.auth.policynumber.slice(0, 2) + '-' + $scope.auth.policynumber.slice(2, 4) + '-' + $scope.auth.policynumber.slice(4, 11) + '-' + $scope.auth.policynumber.slice(11, 13) + '-' + $scope.auth.policynumber.slice(13, 15);
				var policyNumber = $scope.auth.policynumber.charAt($scope.auth.policynumber.length - 1);
				if (policyNumber == '-') {
					$scope.auth.policynumber = $scope.auth.policynumber.slice(0, $scope.auth.policynumber.lastIndexOf('-', $scope.auth.policynumber.length - 1))
				}
			}
		}
	}
	/*----------- on keyup append '-' in policy number -----------*/
});