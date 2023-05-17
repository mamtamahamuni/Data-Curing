/**   
	Module: Renewal Renew Policy Page Controller (Responsible for checking (or validating) user Policy Credentials and landing user on 'New Renewal Landing Page' on valid credentials)
	Author: Anirudha Bhatkar 
	Date: 25-02-2023
**/

var counterOfferApp = angular.module('counterOfferQuoteModule', []);

'use strict';

counterOfferApp.controller("counter-offer-quote", function ($scope, appService, ABHI_CONFIG, $localStorage, $rootScope, $location, $sessionStorage, $window, $routeParams, RenewService, $timeout, $interval) {
	var aS = appService;
	if($sessionStorage.counterOfferDetails){
		$scope.proposalDetails =  $sessionStorage.counterOfferDetails;
		console.log($scope.proposalDetails,"$scope.offerDetails");
	}
	else{
		$location.url('counter-offer-login');
	}

	sessionStorage.removeItem('counterPgToken');

	/*----- Page Drop off --------*/

    function userDropOff() {

        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/PageDrop", {
                    "ReferenceNumber": $sessionStorage.refNo,
                    "PageDrop": "counter-offer-quote"
                },
                true
            )
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    $sessionStorage.dropOff = true;
                } else if (data.ResponseCode == 0) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": data.ResponseData.ErrorMessage?ResponseData.ErrorMessage:data.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                }
            })

    }


    /*----- End of Page Drop off --------*/


	/*----- Get Proposal details --------*/
	$scope.offerDetails = {};
    $scope.GetProposerDetails= function() {

        RenewService.postData(ABHI_CONFIG.apiUrl+"CFRAcceptReject/GetProposerDetails", {
                    "ReferenceNumber": $sessionStorage.refNo,
					"ProposalNumber":$scope.proposalDetails.ProposalNumber,
					"MobileNumber":$scope.proposalDetails.ProposalMobNumber,
                },
                true
            )
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    $scope.offerDetails = data.ResponseData.counterOfferDetails;
					sessionStorage.setItem('counterOfferDetails', JSON.stringify($scope.offerDetails))
					// const bodyEl = document.createElement("BODY")
					
					const inClass = document.getElementsByClassName("modal-open");
					const inClassMod = document.getElementsByClassName("modal-backdrop");
					if(inClass.length>0){
						inClass[0].style.overflow = 'auto';
						inClassMod[0].style.position = 'relative';
					}
					
    				userDropOff();
                } else if (data.ResponseCode == 0) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": data.ResponseData?data.ResponseData.ErrorMessage:data.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
						"positiveFunction": function(){
							$location.url('counter-offer-login');
						}
                    }
                }
            })

    }

    $scope.GetProposerDetails();

    /*----- End of Get Proposal details --------*/

	$scope.parseIntString = function(sum){
		if(sum){
			return parseInt(sum);
		}
		else{
			return false;
		}
	}

	$scope.memberView = [{"show": ""}, {"show": ""}];
	$scope.showHideMember= function(i){
		let customAc = document.getElementsByClassName('custom-accordian');
		// $scope.memberView[i].show = customAc[i].style.height;
		if(!$scope.memberView[i].show){
			customAc[i].style.height = '0px';
			$scope.memberView[i].show = 'auto';
		}
		else{
			customAc[i].style.height = 'auto';
			$scope.memberView[i].show = '';
		}
	}


	$scope.paymentDone = function () {
		if($scope.dis){
			$scope.rejectCF({
				"ReferenceNo":$sessionStorage.refNo,
				"ProposalNumber":$scope.proposalDetails.ProposalNumber,
				"Accepted":"Y"
			});
		};
	}

	$scope.callPGstatus = function () {
		aS.postData(ABHI_CONFIG.apiUrl + "CFRAcceptReject/PGRequest", {
			"ReferenceNo":$sessionStorage.refNo,
			"ProposalNumber":$scope.proposalDetails.ProposalNumber,
			"PaymentType":"normal",
			"DisclamerAccptRjct":$scope.dis?"Y":"N"
			}
			, true, 
			// {
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	}
			// }
			{
				'x-ob-bypass': 1
			}
			).then(function (data) {

			if(data.ResponseCode == 1){
					window.location.href = data.ResponseData;
					let token = data.ResponseData.split("=")
					sessionStorage.setItem("counterPgToken",token[1]);
				
			}else if(data.ResponseCode == 0) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": data.ResponseData.ErrorMessage?ResponseData.ErrorMessage:data.ResponseMessage,
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
			}
		})
	}

	$scope.payBut = false;
	$scope.dis = false;
	$scope.Disclaimer = function(dis){
		if(dis.checked){
			$scope.payBut = true;
		}
		else{
			$scope.payBut = false;
		}

	}

	$scope.rejectCF = function(param) {
		aS.postData(ABHI_CONFIG.apiUrl + "CFRAcceptReject/AcceptRejectCounterOffer", 
		param
		, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function (data) {

			if(data.ResponseCode == 1){
				if(param.Accepted){
					if($scope.offerDetails[0].TotalLoadingAmount == "0"){
						$location.url('counter-offer-thank-you');
					}
					else{
						$scope.callPGstatus();
					}
				}
			}else if(data.ResponseCode == 0) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": data.ResponseData.ErrorMessage?ResponseData.ErrorMessage:data.ResponseMessage,
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
			}
		});
	}

	$scope.submit_fb = function(){
		if($scope.high_premium || $scope.alternate_products || $scope.plan_change || $scope.mind_change || $scope.not_satisfied || $scope.wrong_premium || $scope.other_fb){
			if($scope.other_fb && !$scope.other_reason){
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Plase specify your condition.",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
				return;
			}

			aS.postData(ABHI_CONFIG.apiUrl + "CFRAcceptReject/CFRFeedBack", {
				"ReferenceNumber":$sessionStorage.refNo,
				"ProposalNumber":$scope.proposalDetails.ProposalNumber,
				"ProposalName":$scope.proposalDetails.MemberName,
				"ProposalMobNumber":$scope.proposalDetails.ProposalMobNumber,
				"Counterofferpremiumonhigherside":$scope.high_premium?"Y":"",
				"Alternateproductsavailableinmarketatthesamepremium":$scope.alternate_products?"Y":"",
				"ProductorPlanchange":$scope.plan_change?"Y":"",
				"Changeofmind":$scope.mind_change?"Y":"",
				"Notsatisfiedwiththecounterofferdecision":$scope.not_satisfied?"Y":"",
				"Wrongpremiumcalculation":$scope.wrong_premium?"Y":"",
				"Others":$scope.other_fb?"Y":"",
				"OthersReason":$scope.other_reason
			}
			
			, true, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (data) {
	
				if(data.ResponseCode == 1){
					$scope.rejectCF({
						"ReferenceNo":$sessionStorage.refNo,
						"ProposalNumber":$scope.proposalDetails.ProposalNumber,
						"Rejected":"Y"
					});
					$("#rejectModal").modal("hide");
					$("#thankyouModal").modal("show");
				}else if(data.ResponseCode == 0) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText":data.ResponseData.ErrorMessage?ResponseData.ErrorMessage:data.ResponseMessage,
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
				"modalBodyText": "Plase select atleast one reason.",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true,
				"hideCloseBtn": true
			}
		}
	}
	
});