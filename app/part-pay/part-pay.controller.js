'use strict';

var partPay = angular.module("partPayModule", []);

partPay.controller("partPay", ['$rootScope', '$scope', 'ABHI_CONFIG','$sessionStorage', 'RenewService','$location', '$routeParams', function ($rootScope, $scope, ABHI_CONFIG, $sessionStorage, RenewService, $location, $routeParams) {
	$scope.pgPaymentMode = 'emandate_normal';

    $scope.auth = {
		'Policyno': '',
		'MemberID': '',
		'Amount': ''
	};

    $scope.selectPolicy = function (policyDetails, arrayIndex) {
        console.log(policyDetails, arrayIndex, "selected policy");

        $scope.policySelected = policyDetails.PolicyNumber;
        
        for (var i = 0; i < $scope.policyArr.length; i++) {
			if (i == arrayIndex) {
				$('#myCheckbox' + i).addClass('selectedCheckBox')
			} else {
				$('#myCheckbox' + i).removeClass('selectedCheckBox')
			}
		}

        if(!$scope.Policies.PolicyInsuredDetail){
            let request = {
                "ReferenceNo":$scope.Policies.ReferenceNo,
                "PolicyNumber":$scope.policySelected
            }
            RenewService.postData("https://mtpre.adityabirlahealth.com/PartPayment/api/PartPayment/UpdatePolicy", request, true)
            .then(function (data) {
                if (data.ResponseCode == '1') {
                // if (data) {
                        console.log(data, "part Login");
                        
                        $scope.disablePay = false;
                        
                    }
                    else{
                         $scope.disablePay = true;
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
            });
        }
    }

    $scope.getAllPolicy = function () {
        console.log("log payment");
        $scope.Policies = $sessionStorage.refNoArray;
        $scope.policyArr= [];
        if($scope.Policies){
            if($scope.Policies.memberIDDetails){
                $scope.policyArr = $scope.Policies.memberIDDetails;
            }
            else if($scope.Policies.PolicyInsuredDetail){
                $scope.policyArr.push($scope.Policies.PolicyInsuredDetail);
            }
        }
        else{
			$location.url('part-payment-login');
        }
        $scope.selectPolicy($scope.policyArr[0], 0);

        // setTimeout(function(){
        //     litmusCode('','PartPaymentPage','','part_payment_page','part-payment-page');
        // }, 5000)

    }

    // if($routeParams.pid == undefined){        
    //     $scope.getAllPolicy();
    // }
    
    if($routeParams.pid != undefined){
        RenewService.postData(ABHI_CONFIG.healthWebsiteUrl + "RenewalPolicy/fetchPartPaymentData", { // healthinsurance domain removed from api 
                "transId": $routeParams.pid,
                "tblName": "part-payment"
            },
            true
        )
        .then(function (data) {
            if (data.code == 1) {
                $scope.fetchedData = data.data;
                if ($routeParams.utm_source && $routeParams.utm_campaign) {
                    $sessionStorage.subUrl = 'utm_source=' + $routeParams.utm_source + '&' + 'utm_campaign=' + $routeParams.utm_campaign;
                }
                $scope.loginPartPeyment();
            } else if (data.code == 0) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "Oops! Something went wrong",
                    "showCancelBtn": false,
                    "modalSuccessText": "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true
                }
            }
        });
    } 
    else{
        $scope.getAllPolicy();
    }
    
   $scope.mobileMasking = function (mob) {
        let mobLast = mob.slice(6);
        return "*** *** "+ mobLast;
   }

    $scope.pay = function () {
        $scope.showPaymentModeModal = false;
        let request = {
            "ReferenceNo":$scope.Policies.ReferenceNo,
            "PolicyNumber":$scope.policySelected,
			"PaymentType": $scope.pgPaymentMode
        }

        RenewService.postData("https://mtpre.adityabirlahealth.com/PartPayment/api/PartPayment/PGRequest", request, true)
		.then(function (data) {
            if (data.ResponseCode == '1') {
            // if (data) {
                    console.log(data, "part Login");
                    window.location.href = data.ResponseData;
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
                }
        });
    }

     /*-------------------- To Select Payment Mode --------------------------*/

	$scope.selectPaymentMode = function () {
		if(!$scope.disablePay){
            $scope.showPaymentModeModal = true;
        }
    
}

/*-------------------- To Select Payment Mode Ends--------------------------*/


    /*---------------------- To Check Renew Details - For Part Payment ---------------------------*/
    $scope.loginPartPeyment = function () {
		console.log("$scope.fetchedData");
		console.log($scope.fetchedData);
		console.log($scope.auth,"auth part");
		let num = $scope.fetchedData[0].Amount;
		for (let i = 0; i < num.length; i++) {
			if(num[i]==',' || num[i]=='₹'){
				num =  num.replace(num[i], "")
			}
		}
		$scope.auth.Amount =  num;
		$scope.auth.Policyno =  $scope.fetchedData[0].PolicyNumber;

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
				//$location.url('part-payment');
                $scope.getAllPolicy();
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
			}
		});
	}
    /*---------------------- To Check Renew Details - For Part Payment Ends---------------------------*/

}]);