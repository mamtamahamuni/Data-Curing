/**   
	Module: Policy Part Payment Page Controller
	Author: Ravikant Gaud 
	Date: 16-05-2022
**/

var partPaymentApp = angular.module('partPaymentModule', []);

'use strict';

partPaymentApp.controller("part-payment", function ($scope, ABHI_CONFIG, $localStorage, $rootScope, $location, $sessionStorage, $window, $routeParams, RenewService) {
	delete $sessionStorage.refNoArray
	
	$scope.Policies = [

        {

            "ReferenceNo": "PP2022051718091964362364",

            "ut": "F07264CD8A494A599C0CFBDF547FD044A01F7C7448A74F78846543091342AEDC1C1DDA6A86CA467697E2B6D0C1712098",

            "PolicyInsuredDetail": {

				"PolicyNumber": "21-22-0003858-00",

				"Customername": "Parul Sahni 1",

				"ProductName": "Activ Health V2",

				"MobileNo": "9561430150"

			},

            "memberIDDetails": [

                {

                    "PolicyNumber": "21-22-0003858-00",

                    "Customername": "Parul Sahni 1",

                    "ProductName": "Activ Health V2",

                    "MobileNo": "9561430150"

                },

                {

                    "PolicyNumber": "21-22-0003899-00",

                    "Customername": "Parul Sahni 2",

                    "ProductName": "Activ Health V2",

                    "MobileNo": "9561430150"

                },

                {

                    "PolicyNumber": "21-22-0003930-00",

                    "Customername": "Parul Sahni 3",

                    "ProductName": "Activ Health V2",

                    "MobileNo": "9561430150"

                }

            ]

        }

    ]

	/*---- Intialization of auth scope ------------------*/

	$scope.auth = {
		'Policyno': '',
		'MemberID': '',
		'Amount': ''
	};

	console.log($scope.auth, "form");

	/*---- End of Intialization of auth scope -----------*/

	/*---------- Check - Pattern --------------*/

	$scope.patternCheck = function (value, pattern, event) {
		let p = new RegExp(pattern)
		let num = $scope.renewForm[value].$$lastCommittedViewValue.toUpperCase();
		// let AlphaArr = ["P", "T"]
		// if(value == "MemberID" && num.indexOf(event.key) < 2){
		// 	if(num[num.indexOf(event.key)] != AlphaArr[num.indexOf(event.key)]){
		// 		$scope.auth[value] =  num.replace(num[num.indexOf(event.key)], "")
		// 	}
		// 	return;
		// }
		if(!p.test(event.key)){
			$scope.auth[value] =  num.replace(num[num.indexOf(event.key)], "");
		}else{
			$scope.auth[value] =  num;
		}
	}

	/*---------- Check - Pattern --------------*/

	/*---------- formate - amount --------------*/

	$scope.formateAmount = function (value, pattern, event) {
		let p = new RegExp(pattern)
		let num = $scope.renewForm[value].$$lastCommittedViewValue;
		if(!p.test(event.key)){
			$scope.auth[value] =  num.replace(num[num.indexOf(event.key)], "")
			if(event.key != "Backspace"){
				return;
			}
		}
		for (let i = 0; i < num.length; i++) {
			if(num[i]==',' || num[i]=='₹'){
				num = num.replace(num[i], '');
			}
		}
	
		if(num && num[0] != "," && num[0] != "0"){
			num = new Intl.NumberFormat('en-IN').format(num);
			$scope.auth[value] = '₹'+num;
		}else{
			$scope.auth[value] = '';
		}
		
	}

	/*---------- formate - amount --------------*/


	/*---------- Login --------------*/

	$scope.loginPartPeyment = function () {
		console.log($scope.auth,"auth part");
		let num = $scope.auth.Amount;
		for (let i = 0; i < num.length; i++) {
			if(num[i]==',' || num[i]=='₹'){
				num =  num.replace(num[i], "")
			}
		}
		$scope.auth.Amount =  num
		var request = $scope.auth;
		RenewService.postData("https://mtpre.adityabirlahealth.com/PartPayment/api/PartPayment/CheckPolicyDetails", request, true)
		.then(function (data) {
			console.log(data, "part Login");
			if (data.ResponseCode == '1') {
				// if (data) {
				$scope.policyDetails = data.ResponseData
				$scope.policyDetails.Policies[0]['amt'] = num;
				$sessionStorage.refNoArray = $scope.policyDetails.Policies[0];
				sessionStorage.setItem('ut', $scope.policyDetails.Policies[0].ut);
				$location.url('part-payment'); 
			}
			else{
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

				// $scope.policyDetails = $scope.Policies;
				// $sessionStorage.refNoArray = $scope.policyDetails[0];
				// sessionStorage.setItem('ut', $scope.policyDetails[0].ut);
				// $scope.policyDetails[0]['amt'] = num;
				// $location.url('part-payment');
			}
		});
	}

	/*---------- Login --------------*/

	/*---------- To append '-' in Policy Number --------------*/

	$(function () {
		$('#policynum').on('keypress',function(e) {
			var key = e.charCode || e.keyCode || 0;
			var value = e.originalEvent.key
			var text = $(this);
			var policyval = text.val();
			var val = policyval.toUpperCase()
			if (val.startsWith("G") || val.startsWith("g")) {
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
		if (($scope.auth.Policyno.startsWith("G") || $scope.auth.Policyno.startsWith("g")) && ($scope.auth.Policyno.includes('-') == false)) {
			if ($scope.auth.Policyno.startsWith("GHI") || $scope.auth.Policyno.startsWith("GCI") || $scope.auth.Policyno.startsWith("GFB") || $scope.auth.Policyno.startsWith("GPA")) {
				$scope.auth.Policyno = $scope.auth.Policyno = $scope.auth.Policyno.slice(0, 3) + '-' + $scope.auth.Policyno.slice(3, 5) + '-' + $scope.auth.Policyno.slice(5, 7) + '-' + $scope.auth.Policyno.slice(7, 14) + '-' + $scope.auth.Policyno.slice(14, 16);
				var policyNumber = $scope.auth.Policyno.charAt($scope.auth.Policyno.length - 1);
				if (policyNumber == '-') {
					$scope.auth.Policyno = $scope.auth.Policyno.slice(0, $scope.auth.Policyno.lastIndexOf('-', $scope.auth.Policyno.length - 1))
				}
			} else if ($scope.auth.Policyno.startsWith("GP")) {
				$scope.auth.Policyno = $scope.auth.Policyno = $scope.auth.Policyno.slice(0, 2) + '-' + $scope.auth.Policyno.slice(2, 4) + '-' + $scope.auth.Policyno.slice(4, 6) + '-' + $scope.auth.Policyno.slice(6, 13) + '-' + $scope.auth.Policyno.slice(13, 15);
				var policyNumber = $scope.auth.Policyno.charAt($scope.auth.Policyno.length - 1);
				if (policyNumber == '-') {
					$scope.auth.Policyno = $scope.auth.Policyno.slice(0, $scope.auth.Policyno.lastIndexOf('-', $scope.auth.Policyno.length - 1))
				}
			}
		}else{
			if (($scope.auth.Policyno != '') && ($scope.auth.Policyno.includes('-') == false)){
				$scope.auth.Policyno = $scope.auth.Policyno.slice(0, 2) + '-' + $scope.auth.Policyno.slice(2, 4) + '-' + $scope.auth.Policyno.slice(4, 11) + '-' + $scope.auth.Policyno.slice(11, 13) + '-' + $scope.auth.Policyno.slice(13, 15);
			var policyNumber = $scope.auth.Policyno.charAt($scope.auth.Policyno.length - 1);
			if (policyNumber == '-') {
				$scope.auth.Policyno = $scope.auth.Policyno.slice(0, $scope.auth.Policyno.lastIndexOf('-', $scope.auth.Policyno.length - 1))
			}
		  }
		}
	}
	/*----------- on keyup append '-' in policy number -----------*/
});