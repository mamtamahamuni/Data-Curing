/**   
	Module: Renewal Increase Sum Insured Landing Page Controller (This module enables user to increase sum insured of the policy. Sum insured is increased for all or individual member depending upon the policy type i.e 'family-floater' or 'multi-individual')
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalIncreaseSumInsuredLandingApp = angular.module("renewalIncreaseSumInsuredLandingModule", []);

renewalIncreaseSumInsuredLandingApp.controller("renewal-increase-sum-insured-landing", ['ABHI_CONFIG', '$scope', '$rootScope', '$location', '$sessionStorage', 'RenewService', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, RenewService) {

	
	/*---- Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

  	/*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	/*---- Data Inilization ----*/

	$scope.productName = $sessionStorage.productName; // To Store Product Name
	$scope.upsellFlag = $sessionStorage.upsellFlag;
	setTimeout(function(){
		$scope.usedDeductibleAmount = sessionStorage.getItem('usedDeductible');
		console.log("step 1: " + $scope.usedDeductibleAmount);
		if($scope.usedDeductibleAmount == undefined){
			setTimeout(function(){
				getDeductibleAmount();
			},500)
		}
	},500)
	
	function getDeductibleAmount(){
		$scope.usedDeductibleAmount = sessionStorage.getItem('usedDeductible');
		console.log("step 3: " + $scope.usedDeductibleAmount);
		if($scope.usedDeductibleAmount == undefined){
			getDeductibleAmount();
		}
	}
	//$scope.updateMember = {};
	//$scope.updateMembers = 'N';	
	
	/*---- End of Data Inilization ----*/

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

	/*---------------------- To Update Sum Insured ---------------------------*/

	$scope.updateSumInsured = function (param, member) {
		$scope.upgSumInsMembers = [];
		if (member) {
			$scope.memberid = angular.copy(member.MemberId)
			$scope.memberupsellsumi = angular.copy(member.UpSellSumInsured);
			$scope.memberinitialsi = angular.copy(member.InitialSumInsured)
		}

		function updateSumInsure(members, updatesi) {
			RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateSumInsured", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo,
					"memberDetails": members
				}, true)
				.then(function (data) {
					if (data.ResponseCode == 1) {
						// if (($scope.policyDetails.ProductName == 'Activ Secure' || $scope.policyDetails.ProductName == 'Activ Assure' || $scope.policyDetails.ProductName == 'Activ Assure V2' || $scope.policyDetails.ProductName == 'Activ Health' || $scope.policyDetails.ProductName == 'Activ Health V2' || $scope.policyDetails.ProductName == 'Active Care V2' || $scope.policyDetails.ProductName == 'Activ Care') && $scope.policyDetails.SumInsuredType == 'Individual') {
							for (var i = 0; i < $scope.insuredMembers.length; i++) {
								if ((members[0].Relation.toUpperCase() == $scope.insuredMembers[i].RelationType.toUpperCase()) && $scope.policyDetails.SumInsuredType == 'Individual') {
									$scope.insuredMembers[i].SumInsured = members[0].SumInsured;
								}
								if ($scope.policyDetails.SumInsuredType != 'Individual'){
									$scope.insuredMembers[i].SumInsured = members[0].SumInsured;
								}
							}
							$scope.policyDetails.RenewalGrossPremium = data.ResponseData.premiumResponse.RenewGrossPremium;
						// }

						if ($rootScope.diamondProduct && $scope.suminsured == 400000 && $scope.upsellFlag == 'Y') {

							RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpgradeRoom", {
										"ReferenceNo": $sessionStorage.refNo,
										"PolicyNumber": $sessionStorage.policyNo,
										"RoomUpgrade": '0'
									},
									true
								)
								.then(function (data) {
									if (data.ResponseCode == 1) {
										$scope.fetchInsuredMembers();
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

		if (member && parseInt(member.SumInsured) < parseInt(member.UpSellSumInsured)) {
			updateSumInsure([{
				MemberID: member.MemberId,
				SumInsured: member.UpSellSumInsured,
				Relation: member.RelationWithProposer,
				Deductible:$scope.policyDetails.ProductName == 'Super Top Up'?$scope.setDeductable(member.UpSellSumInsured):""
			}], true);
		}

		if (member && parseInt(member.SumInsured) >= parseInt(member.UpSellSumInsured)) {
			updateSumInsure([{
				MemberID: member.MemberId,
				SumInsured: member.FixedInitialSI,
				Relation: member.RelationWithProposer,
				Deductible:$scope.policyDetails.ProductName == 'Super Top Up'?$scope.setDeductable(member.FixedInitialSI):""
			}], false);
		}

		if (!member && parseInt($scope.insuredMembers[0].SumInsured) < parseInt($scope.UpSellSumInsured)) {
			for (var i = 0; i < $scope.insuredMembers.length; i++) {
				$scope.upgSumInsMembers.push({
					MemberID: $scope.insuredMembers[i].MemberId,
					SumInsured: $scope.UpSellSumInsured,
					Relation: $scope.insuredMembers[i].RelationWithProposer,
					Deductible:$scope.policyDetails.ProductName == 'Super Top Up'?$scope.setDeductable($scope.UpSellSumInsured):""
				})
			}
			updateSumInsure($scope.upgSumInsMembers, true);
		}

		if (!member && parseInt($scope.insuredMembers[0].SumInsured) >= parseInt($scope.UpSellSumInsured)) {
			for (var i = 0; i < $scope.insuredMembers.length; i++) {
				$scope.upgSumInsMembers.push({
					MemberID: $scope.insuredMembers[i].MemberId,
					SumInsured: $scope.insuredMembers[0].FixedInitialSI,
					Relation: $scope.insuredMembers[i].RelationWithProposer,
					Deductible:$scope.policyDetails.ProductName == 'Super Top Up'?$scope.setDeductable($scope.insuredMembers[0].FixedInitialSI):""
				})
			}
			updateSumInsure($scope.upgSumInsMembers, false);
		}

	}

	/*---------------------- End of To Update Sum Insured ---------------------------*/

}]);