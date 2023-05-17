/**   
	Module: Renewal Renew Policy Page Controller (Responsible for checking (or validating) user Policy Credentials and landing user on 'New Renewal Landing Page' on valid credentials)
	Author: Anirudha Bhatkar 
	Date: 25-02-2023
**/

var counterOfferApp = angular.module('counterOfferModule', []);

'use strict';

counterOfferApp.controller("counter-offer", function ($scope, appService, ABHI_CONFIG, $localStorage, $rootScope, $location, $sessionStorage, $window, $routeParams, RenewService, $timeout, $interval) {
	var aS = appService;
	$scope.counterLogin = {
		"proposalNo":"220000571852",
		"mobile":"7719936355",
		"timers":75
	}

	if($routeParams.mobile_no && $routeParams.proposal_no){
		$scope.counterLogin.mobile = $routeParams.mobile_no;
		$scope.counterLogin.proposalNo = $routeParams.proposal_no;
	}
	else{
		$location.url('pre-quote');
	}

	$scope.dis = false;

	var timerSwitch
	$scope.offerData = {};
	$scope.triggerOTP = function () {
		if($scope.dis){
			$("#otpModal").modal("show");
			clearTimeout(timerSwitch);
		$scope.counterLogin.timers = 75;
		timerSwitch =setInterval(resendOTP,1000); 
		aS.postData(ABHI_CONFIG.apiUrl + "CFRAcceptReject/RequestOTP", {
			"MobileNumber":$scope.counterLogin.mobile,
			"ProposerNo": $scope.counterLogin.proposalNo
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function (data) {
			if(data.ResponseData.ResponseCode == "1"){
				 $scope.offerData = {
					"ReferenceNo": data.ResponseData.ReferenceNo,
        			"ut": data.ResponseData.ut
				}
				sessionStorage.setItem('counterOfferData' , JSON.stringify($scope.offerData));
				sessionStorage.setItem('ut' , data.ResponseData.ut);
			}
			else if(data.ResponseData.ResponseCode == "999"){
				$("#otpModal").modal("hide");
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "This link is expired",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
			}
		});
		}
		else{
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "Please check the box to grant permission before proceeding",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
					for (let i = 0; i < $scope.otpInt.length; i++) {
						$scope.otpInt[i].value = "";
					}
					$scope.counterLogin.timers = 0;
				}
			}
		}
		
	}

	function resendOTP() {
		if($location.path() == "/counter-offer-login"){
			var timeWrap = document.getElementById('timmer');
			if ($scope.counterLogin.timers == -1) {
			clearTimeout(timerSwitch);
			}else{
				timeWrap.innerHTML = $scope.counterLogin.timers--;
				console.log($scope.counterLogin.timers, "counterLogin.timers");
			}
		}
	}

	$scope.otpInt = document.getElementsByClassName('inputclass');
	$scope.subOtp = false;
	$scope.otpVal = "";
	$scope.keyup = function(i, event){
		let int = Number.isInteger(parseInt($scope.otpInt[i].value));
		if(event.key == "Backspace"){
			$scope.otpInt[i-1].focus();
		}
		if(($scope.otpInt.length > i) && int){
			if(5 > i){
				$scope.otpInt[i+1].focus();
			}
		}else{
			$scope.otpInt[i].value = "";
		}
		if($scope.otpInt[0].value && $scope.otpInt[1].value && $scope.otpInt[2].value && $scope.otpInt[3].value && $scope.otpInt[4].value && $scope.otpInt[5].value){
			$scope.subOtp = true;
			$scope.otpVal = $scope.otpInt[0].value + $scope.otpInt[1].value + $scope.otpInt[2].value + $scope.otpInt[3].value + $scope.otpInt[4].value + $scope.otpInt[5].value
		}
		else{
			$scope.subOtp = false;
			$scope.otpVal = "";
		}
	}

	$scope.counterOfferDetails= [
		{
			"MemberId": null,
			"MemberName": "Setgfd Sefrghj",
			"RelationWithProposer": "Self",
			"Gender": "Male",
			"SumInsured": "500000",
			"Exclusions": "",
			"UW_Remarks": "",
			"LoadingAmount": "0",
			"TotalLoadingAmount": "0",
			"proposalNo": "220000543512"
		}
	]

	$scope.submitOtp = function () {
		clearTimeout(timerSwitch);
		
		aS.postData(ABHI_CONFIG.apiUrl + "CFRAcceptReject/VerifyOTP", {
			"ReferenceNumber":$scope.offerData.ReferenceNo,
			"ProposalNumber":$scope.counterLogin.proposalNo,
			"MobileNumber":$scope.counterLogin.mobile,
			"OTP":$scope.otpVal
		}
		, true, {
			headers: {
				'Content-Type': 'application/json'
			}
	}).then(function (data) {
			if(data.ResponseCode == "1"){
				
				$sessionStorage.counterOfferDetails = {
					"ProposalMobNumber":$routeParams.mobile_no,
					"ProposalNumber":$routeParams.proposal_no
				};
				$sessionStorage.refNo = data.ResponseData.ReferenceNo;
				$("#otpModal").modal("hide");
				const inClass = document.getElementsByClassName("in");
				if(inClass){
					inClass[0].style.opacity= 0;
					inClass[0].style.overflow = 'auto';
				}

				$location.path( "/counter-offer-quote" );
			}
			else{
				if(data.ResponseData){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": data.ResponseData.ErrorMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true,
						"positiveFunction": function () {
							for (let i = 0; i < $scope.otpInt.length; i++) {
								$scope.otpInt[i].value = "";
							}
							$scope.counterLogin.timers = 0;
							$scope.otpVal = "";
							clearTimeout(timerSwitch);
							$scope.subOtp = false;
						}
					}
				}
				else{
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true,
						"positiveFunction": function () {
							for (let i = 0; i < $scope.otpInt.length; i++) {
								$scope.otpInt[i].value = "";
							}
							$scope.counterLogin.timers = 0;
							$scope.otpVal = "";
							clearTimeout(timerSwitch);
							$scope.subOtp = false;
						}
					}
				}
			}
		}, function (err) { 

		});
	}
});