/**   
	Module: Renewal View Member Landing Page Controller (In this module all members present in policy and their details are shown. User can view member details, remove member, add member and make payemt request (Renew Policy))
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalViewMemberLandingApp = angular.module("renewalViewMemberLandingModule", []);

renewalViewMemberLandingApp.controller("renewal-view-member-landing", ['ABHI_CONFIG', '$scope', '$timeout', '$rootScope', '$sessionStorage', '$location', 'RenewService', function (ABHI_CONFIG, $scope, $timeout, $rootScope, $sessionStorage, $location, RenewService) {

    /*---- Page Redirection When $sessionStorage.refNo Not Available ----*/

    if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
        $location.path('renewal-renew-policy');
        return false;
    }

    /*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/

    /*---- Data Inilization ----*/

    var insuredMemberDetails = {} // To Store Perticular Insured Member Details 
    $scope.insuredMemberDetails = {} // To Store Perticular Insured Member Details
    $scope.show = false;
    $scope.productName = $sessionStorage.productName; // To Store Product Name
    $scope.upsellFlag = $sessionStorage.upsellFlag;
    $rootScope.ModificationProduct = $sessionStorage.productName;

    /*---- End of Data Inilization ----*/

    /*----- Page Drop off --------*/

    function userDropOff() {

        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/PageDrop", {
                    "ReferenceNumber": $sessionStorage.refNo,
                    "PageDrop": "renewal-view-member-landing"
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
                        "modalBodyText": data.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                }
            })

    }

    userDropOff();

    /*----- End of Page Drop off --------*/

    /*----- Omnni Channel Drop off Event -------*/

    function omniDropOff(){

        RenewService.postData(ABHI_CONFIG.apiUrl+"OmniChannel/RenewDropoff", 
            {"ReferrenceNo": $sessionStorage.refNo, "PageName": "renewal-view-member-landing"},
            true
            )
            .then(function(data){
            if(data.ResponseCode == 1) {
                $sessionStorage.omniDropOff = true;
            } 
            else if(data.ResponseCode == 0){
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

    omniDropOff();

    /*------- Omnni Channel Drop off Event Ends -------*/

    $scope.roundOffSI = function (params) {
		let num = ""+Math.round(params)
		let YZero = false
		let SI = ""
		for (let i = 0; i < num.length; i++) {
			if(num[i]=="0"){
				YZero = true;
			}
			if(YZero && num[i]!="0"){
				SI = SI + "0";
			}
			else{
				SI = SI + num[i];
			}
			
		}
		return SI;
	}

    /*------- To Fetch Member Details -------------*/
    // $scope.canAddMember = {
    //     "active":false
    // };
    // $scope.memberListMembers = setTimeout(() => {
    //     $scope.membersList.members.filter(function (member) {
    //         if(!member.isSelected && member.display){
    //             $scope.canAddMember.active = true;
    //         }
    //         return !member.isSelected && member.display
    //     })
    // }, 1000);

    $scope.insureNew = function(url){
        // if($scope.canAddMember.active){
            $location.url(url)
        // }
        // else{
        //     $rootScope.alertData = {
        //         "modalClass": "regular-alert",
        //         "modalHeader": "Alert",
        //         "modalBodyText": "You have reached to max number of insure member.",
        //         "showCancelBtn": false,
        //         "modalSuccessText": "OK",
        //         "showAlertModal": true,
        //         "hideCloseBtn": true
        //     }
        // }
    }

    $scope.fetchMemberDetails = function (member) {

        RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetInsuredMemberDetail", {
                    "ReferenceNo": $sessionStorage.refNo,
                    "PolicyNumber": $sessionStorage.policyNo,
                    "MemberID": member.MemberId,
                    "Relation": member.RelationWithProposer
                },
                true
            )
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    insuredMemberDetails = data.ResponseData;
                    $scope.insuredMemberDetails = angular.copy(insuredMemberDetails)
                    $scope.show = true;
                    $scope.activeMember = member.RelationWithProposer
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

    /*------- End of To Fetch Member Details -------------*/

    /*------- To Hide Member Detials ------------- */

    $scope.hideMemberDetails = function (member) {
        $scope.show = false;
        $scope.fetchInsuredMembers();
    }

    /*------- End of To Hide Member Detials ------------- */

    /*------- To Remove Specific Member -------------*/

    $scope.deleteMember = function (member) {

        $rootScope.alertData = {
            "modalClass": "regular-alert",
            "modalHeader": "Alert",
            "modalBodyText": "Are you sure you want to remove this member?",
            "showCancelBtn": true,
            "modalSuccessText": "Yes",
            "modalCancelText": "No",
            "showAlertModal": true,
            "positiveFunction": function () {

                $scope.insuredMembersNotKids = []; // To Store Elderly Members Other Than Kids
                $scope.insuredMembersNotKids = $scope.insuredMembers.filter(function (member) {
                    return member.RelationType != 'Kid';
                });

                if (($scope.policyDetails.ProductCode == '4112' || $scope.policyDetails.ProductCode == '4226') && member.RelationType == 'Self') {
                    $rootScope.alertConfiguration('E', 'Self is mandatory can not be removed');
                    return false;
                }

                if (($scope.insuredMembersNotKids.length > 1 && member.RelationType != 'Kid') || ($scope.insuredMembersNotKids.length >= 1 && member.RelationType == "Kid")) {
                    RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/DeleteMember", {
                                "ReferenceNo": $sessionStorage.refNo,
                                "PolicyNumber": $sessionStorage.policyNo,
                                "MemberID": member.MemberId,
                                "Relation": member.RelationWithProposer
                            },
                            true
                        )
                        .then(function (data) {
                            if (data.ResponseCode == 1) {
                                $scope.fetchInsuredMembers();
                                // $scope.fetchPolicyDetails();
                                $rootScope.alertConfiguration('S', member.RelationWithProposer + " deleted Successfully");
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

                } else if ($scope.insuredMembersNotKids.length == 1 && member.RelationType != 'Kid') {
                    $rootScope.alertConfiguration('E', member.RelationWithProposer + ' can not be removed');
                    return false;
                }
            }
        }

    }

    /*------- End of To Remove Specific Member --------------*/

}]);