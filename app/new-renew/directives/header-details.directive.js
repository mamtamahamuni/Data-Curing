/**   
	Module: Header Details Directive (Represent View For Header In Modify Other Policy Details Section Pages. Responsible for Getting Insured Members, Policy Details, Making Payment Request, Applying Health Returns & Setting Elegible Members List To Add In Policy)
	Author: Pandurang Sarje 
    Date: 20-08-2020
**/

'use strict';

var headerDetailsDir = angular.module('headerDetailsDirModule', [])

headerDetailsDir.directive('headerDetails', ['$rootScope', 'ABHI_CONFIG', '$location', '$sessionStorage', 'RenewService', '$window', function ($rootScope, ABHI_CONFIG, $location, $sessionStorage, RenewService, $window) {

    return {
        restrict: 'E',
        templateUrl: 'partials/header-details.directive.html',
        // scope: { options: '='},
        link: function (scope, element, attrs) {

// ***************2 coat dev start***********************//
            
            scope.setTimeCall;
            scope.intervalArr = [];            
            scope.setTimerToCall = function () {
                     if(($location.path() == "/new-renewal-landing" || $location.path() == "/renewal-view-member-landing" || $location.path() == "/renewal-view-member-add-user" || $location.path() == "/renewal-increase-sum-insured-landing" || $location.path() == "/renewal-increase-policy-tenure-landing" || $location.path() == "/renewal-edit-nominee-details-landing" || $location.path() == "/renewal-upgrade-zone-landing" || $location.path() == "/renewal-change-address-details" || $location.path() == "/renewal-edit-optional-covers" || $location.path() == "/renewal-edit-member-landing")){
                        clearInterval(RenewService.CalltimerSwitch);
                        RenewService.CalltimerSwitch = setInterval(startCallTimer,1000);
                        scope.setTimeCall = 900;
                    }
            }

            scope.setTimerToCall();

             document.onmousemove = scope.setTimerToCall;
             document.onkeypress = scope.setTimerToCall;
            //  scope.displayCount = {
            //     "count":0
            // }
            function startCallTimer() {
                
             if($location.path() == "/new-renewal-landing" || $location.path() == "/renewal-view-member-landing" || $location.path() == "/renewal-view-member-add-user" || $location.path() == "/renewal-increase-sum-insured-landing" || $location.path() == "/renewal-increase-policy-tenure-landing" || $location.path() == "/renewal-edit-nominee-details-landing" || $location.path() == "/renewal-upgrade-zone-landing" || $location.path() == "/renewal-change-address-details" || $location.path() == "/renewal-edit-optional-covers" || $location.path() == "/renewal-edit-member-landing"){
                 if (scope.setTimeCall == -1) {
                        // $("#wranModal").modal("hide");
                        scope.setTimerToCall();
                        scope.getAllPolicyModify(true);
                        RenewService.isStart = false;

                 }
                 else{
                    scope.setTimeCall = scope.setTimeCall- 1;
                    // scope.displayCount.count=scope.setTimeCall;
                 }
                //  if(scope.setTimeCall < 15 &&  RenewService.isStart){
                //     RenewService.isStart = true;
                //  }
                 
                //   if(scope.setTimeCall < 11 &&  RenewService.isStart){
                //     RenewService.isStart = false;
                //     scope.revertTimeWarning();
                //  }

                //  console.log(scope.setTimeCall, "scope.setTimeCall");

             }
             else{
                clearInterval(RenewService.CalltimerSwitch);
                scope.setTimeCall = 900;
             }
            }


            // scope.revertTimeWarning = function () {
            //     $("#wranModal").modal("show");
            // }
            scope.showRevert = true;
            scope.getAllPolicyModify = function () {
             let  policyNoArray = [];
              policyNoArray[0] = $sessionStorage.refNoArray.ReferenceNo;
     
              RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/GetAllPolicy", {
                  "ListOfReferenceNo": policyNoArray
              }, true
              ).then(
                      function (data) {
                          if (data.ResponseCode == '1') {
                              if(data.ResponseData[0].IsMemberAdded != "Y" && data.ResponseData[0].IsMemberDeleted != "Y" && data.ResponseData[0].IsOptionalCoverAdded != "Y" && data.ResponseData[0].IsZoneUpgraded != "Y" ){
                                  scope.GetOriginalQuote();
                              }
                              else{
                                    scope.showRevert = false;
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

          scope.alertRevert = function () {
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Revert Quote",
                "modalBodyText": "<p>Are you sure, you want to revert all the modification that you have done?</p>",
                "showCancelBtn": true,
                "gtagPostiveFunction" : "click-button,revert-renew-modification ",
                "gtagNegativeFunction" : "click-button,revert-renew-modification-cancel ",
                "modalSuccessText" : "Yes",
                "modalCancelText" : "Close",
                "showAlertModal": true,
                "positiveFunction": function(){
                    scope.getAllPolicyModify();
                }
            }
          }
     
          scope.ogData = {};
             scope.GetOriginalQuote = function () {
                RenewService.getData(ABHI_CONFIG.apiUrl+"Renew/GetOriginalQuote?ReferenceNumber="+$sessionStorage.refNoArray.ReferenceNo+"&PolicyNumber="+$sessionStorage.refNoArray.PolicyNumber, true
             ).then(function (data) {
                         if (data.ResponseCode == '1') {
                            if($location.path() == "/new-renewal-landing"){
                                scope.getAllPolicy(false);
                            }
                            else{
                                scope.fetchPolicyDetails();
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

// ***************2 coat dev End***********************//
scope.upFF = true;
scope.checkUpsellFF = function (data) {
    if(data.SumInsuredType == "Family Floater" && scope.parseIntString(data.InsuredMembers[1].SumInsured) > scope.parseIntString(data.InsuredMembers[1].UpSellSumInsured)){
        scope.upFF = false;
    }
}
scope.locPath = $location.path();
if(scope.locPath == '/new-renewal-landing'){
    return;
}
// scope.size = function(){
//     scope.width = $window.innerWidth;
    // $scope.vw = screen.width;
        //         if (scope.width <= 480) {
        //             scope.newMemberToInsure.desktop = "M";
                    
        //         }else{
        //             scope.newMemberToInsure.desktop = "D";
        //             console.log("desktop");
        //         }
        //   }
// scope.size();

// scope.timeOutFunctionId;

// angular.element($window).bind('resize', function(){

//   scope.width = $window.innerWidth;
//   if(timeOutFunctionId){
//     //   clearTimeout(scope.timeOutFunctionId);
// //   }
//   scope.timeOutFunctionId = setTimeout(() => {
//       scope.size();
//   }, 1000);
  // manuall $digest required as resize event
  // is outside of angular
//   scope.$digest();
// });


            /*---- To stop execution when $sessionStorage.refNo Not Available ----*/

            if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined' || $location.path() == "/new-renewal-landing") {
                return false;
            }

            // angular.extend(scope.options, {
            //     fetchUpdatedPolicy: function(updatedPremium){
            //     //   scope.fetchPolicyDetails();    
            //         scope.policyDetails.RenewalGrossPremium= updatedPremium;
            //     }
            //   });
            
    
            /*---- End of To stop execution when $sessionStorage.refNo Not Available ----*/

            /*---- Data Inilization ----*/

            var insuredMembersData = {}; // To Store Insured Members Data
            var insuredMembers = []; // To Store Insured Members Including Proposer
            scope.insuredMembersData = {}; // To Store Insured Members Data
            scope.allInsuredMembers = []; // To Store Insured Members Including Proposer
            scope.insuredMembers = []; // To Store Insured Members Except Proposer
            scope.suminsuredArray = [] // To Store Sum Insured and UpSellSumInsured
            scope.showSumInsured = false;
            scope.showThirdTenureVal = false;
            scope.showHealthReturn = false;
            scope.showModal = false;
            //scope.applyHealthReturn = 'N';
            scope.updateMembers = 'N';
            scope.updateMember = {};
            scope.roomupgradeflag = false;
            scope.showPaymentModeModal = false;
            scope.payMode = {
                mode:'emandate_normal'
            }
            // scope.pgPaymentMode = 'emandate_normal';
            
            //OPEN T&C 
            var dLC = this;
            dLC.tcAgreed = false;
            dLC.showTerms = function () {
                $location.url("terms-conditions");
            }
            //OPEN T&C END

            scope.vaccineAmount = ['--Select--', 500, 750, 1000];
            scope.ReductionInPEDWaitingPeriodText = '--Select--';
            scope.ReductionInPEDWaitingPeriodOptions = [
                                                        {RPEDWPId:1,RPEDWPText:"-- Select --",RPEDWPModel:"ReductionInPEDWaitingPeriod",RPEDWPCoverName:"ReductionInPEDWaitingPeriod", value: 'N', display:'Essential,Enhanced, Premier'},
                                                        {RPEDWPId:1,RPEDWPText:"4 Yrs to 2 Yrs",RPEDWPModel:"ReductionInPEDWP4yrsto2yrs",RPEDWPCoverName:"ReductionInPEDWP4yrsto2yrs", value: 'Y', display:'Essential'},
                                                        {RPEDWPId:2,RPEDWPText:"4 Yrs to 1 Yr",RPEDWPModel:"ReductionInPEDWP4yrsto1yrs",RPEDWPCoverName:"ReductionInPEDWP4yrsto1yrs", value: 'Y', display:'Essential'},
                                                        {RPEDWPId:3,RPEDWPText:"3 Yrs to 2 Yrs",RPEDWPModel:"ReductionInPEDWP3yrsto2yrs",RPEDWPCoverName:"ReductionInPEDWP3yrsto2yrs", value: 'Y', display:'Enhanced, Premier'},
                                                        {RPEDWPId:4,RPEDWPText:"3 Yrs to 1 Yr",RPEDWPModel:"ReductionInPEDWP3yrsto1yrs",RPEDWPCoverName:"ReductionInPEDWP3yrsto1yrs", value: 'Y', display:'Enhanced, Premier'}
                                                    ];
            scope.VaccineCoverOptions = ["Rs.500 / Insured Person / Per Policy Year", "Rs.750 / Insured Person / Per Policy Year", "Rs.1000 / Insured Person / Per Policy Year"];
            /*---- End of Data Inilization ----*/

            /*------------ Intialization Scope UpdateMember -------------*/

            function initializeupdateMember() {
                scope.insuredMembers.forEach(function (item, index) {
                    scope.updateMember[item.RelationWithProposer] = 'N';
                })
            }

            /*------------ End of Intialization Scope UpdateMember ----------*/

            /*--------- To Get Total Heath Return Amount Of all Members ------------ */

            function healthReturnValue(insuredMembers) {
                var heathReturnSum = 0;

                for (var i = 0; i < insuredMembers.length; i++) {
                    if (insuredMembers[i].HealthReturn > 0) {
                        heathReturnSum = heathReturnSum + parseFloat(insuredMembers[i].HealthReturn);
                    }
                }
                if (heathReturnSum > 0) {
                    scope.heathReturnAmt = heathReturnSum.toFixed(2);
                    scope.showHealthReturn = true;
                }

            }

            /*--------- End of To Get Total Heath Return Amount Of all Members -------- */

            /*----------- To Get Family Construct String --------------*/

            function addHeaderValue(insuredMembers) {
                scope.FamilyConstructString = ""
                scope.FamilyConstruct = [];
                scope.daughterCount = 0;
                scope.sonCount = 0;
                scope.othersCount = 0;

                for (var i = 0; i < insuredMembers.length; i++) {
                    if (insuredMembers[i].RelationWithProposer == 'Self') {
                        scope.FamilyConstruct.push(insuredMembers[i].RelationWithProposer);
                    }
                    if (insuredMembers[i].RelationWithProposer == 'Spouse') {
                        scope.FamilyConstruct.push(insuredMembers[i].RelationWithProposer);
                    }
                    if (insuredMembers[i].RelationWithProposer == 'Kid1' || insuredMembers[i].RelationWithProposer == 'Kid2' || insuredMembers[i].RelationWithProposer == 'Kid3' || insuredMembers[i].RelationWithProposer == 'Kid4') {
                        if (insuredMembers[i].Gender == 'Male' || insuredMembers[i].Gender == 'M') {
                            scope.sonCount++;
                        } else {
                            scope.daughterCount++;
                        }
                    }
                    if (insuredMembers[i].RelationWithProposer != 'Self' && insuredMembers[i].RelationWithProposer != 'Spouse' && insuredMembers[i].RelationWithProposer != 'Kid1' && insuredMembers[i].RelationWithProposer != 'Kid2' && insuredMembers[i].RelationWithProposer != 'Kid3' && insuredMembers[i].RelationWithProposer != 'Kid4') {
                        scope.othersCount++;
                    }
                }
                if (scope.daughterCount != 0) {
                    scope.FamilyConstruct.push(scope.daughterCount + ' Daughter');
                }
                if (scope.sonCount != 0) {
                    scope.FamilyConstruct.push(scope.sonCount + ' Son');
                }
                if (scope.othersCount != 0) {
                    if (scope.othersCount == 1) {
                        scope.FamilyConstruct.push(scope.othersCount + ' Other');
                    } else {
                        scope.FamilyConstruct.push(scope.othersCount + ' Others');
                    }

                }
                scope.FamilyConstructString = scope.FamilyConstruct.toString().replace(/,/g, ', ');

            }

            /*------------ End of To Get Family Construct String -------------*/

            scope.parseIntString = function(sum){
                if(sum){
                    return parseInt(sum);
                }
                else{
                    return true;
                }
            }

            

            /*--------- To decide whether to show 'View Sum Insured' option or Sum Insured Amount in header --------*/

            function suminuredValue(memberedArray, policyDetails) {

                if (policyDetails.ProductName == 'Activ Health' || policyDetails.ProductName == 'Activ Health V2' || policyDetails.ProductName == 'Activ Assure' || policyDetails.ProductName == 'Activ Assure V2' || policyDetails.ProductName == 'Super Top Up') {

                    if (memberedArray.length == 1) {
                        scope.suminsured = memberedArray[0].SumInsured;
                        scope.initialsuminsured = memberedArray[0].InitialSumInsured;
                        scope.showSumInsured = true;
                    } else if (memberedArray.length > 1) {
                        if (policyDetails.SumInsuredType == "Family Floater") {
                            scope.suminsured = memberedArray[0].SumInsured;
                            scope.initialsuminsured = memberedArray[0].InitialSumInsured;
                            scope.showSumInsured = true;
                        } else {
                            scope.showSumInsured = false;
                        }
                    }
                } else if (policyDetails.ProductName == 'Activ Secure') {
                    // if(memberedArray.length > 1){
                    scope.showSumInsured = false;
                    // } else{
                    //    scope.suminsured = memberedArray[0].SumInsured;
                    //    scope.initialsuminsured = memberedArray[0].InitialSumInsured;
                    //    scope.showSumInsured = true;
                    // }
                } else if (policyDetails.ProductName == 'Active Care V2' || policyDetails.ProductName == 'Activ Care') {

                    if (memberedArray.length == 1) {
                        scope.suminsured = memberedArray[0].SumInsured;
                        scope.initialsuminsured = memberedArray[0].InitialSumInsured;
                        scope.showSumInsured = true;
                    } else if (memberedArray.length > 1) {
                        if (policyDetails.SumInsuredType == "Family Floater") {
                            scope.suminsured = memberedArray[0].SumInsured;
                            scope.initialsuminsured = memberedArray[0].InitialSumInsured;
                            scope.showSumInsured = true;
                        } else {
                            scope.showSumInsured = false;
                        }
                    }
                }

            }

            /*--------- End of To decide whether to show 'View Sum Insured' option or Sum Insured Amount in header --------*/

            /*--------- Elegible Members list configuration To Display on Add New Member Page -----------*/
            
            scope.membersToAdd = function () {
                console.log(scope.productSelected , "scope.productSelected  member");
                scope.childCount = 0;


                scope.membersList = {
                    "membersSelected": "",
                    "kidsCount": "",
                    "members": [{
                            "memberType": "SELF",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() != "SPOUSE") ? false:true
                        },
                        {
                            "memberType": "SPOUSE",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() != "SELF") ? false:true
                        },
                        {
                            "memberType": "FATHER",
                            "isSelected": false,
                            "display":scope.productSelected  == "ActivSecure" || (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "MOTHER") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth")? true : false
                        },
                        {
                            "memberType": "MOTHER",
                            "isSelected": false,
                            "display":scope.productSelected  == "ActivSecure" || (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "FATHER") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth")? true : false
                        },
                        {
                            "memberType": "FATHER-IN-LAW",
                            "isSelected": false,
                            "display":(scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "MOTHER-IN-LAW") || ((scope.productSelected  == "SuperTopUp" || scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },
                        {
                            "memberType": "MOTHER-IN-LAW",
                            "isSelected": false,
                            "display":(scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "FATHER-IN-LAW") || ((scope.productSelected  == "SuperTopUp" || scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") && scope.userpolicy.SumInsuredType !="Family Floater")  ? true : false
                        },
                        {
                            "memberType": "KID",
                            "isSelected": false,
                            "display": scope.productSelected  != "ActivCareV2"
                        },
                        {
                            "memberType": "BROTHER",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "SISTER-IN-LAW") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") || (scope.productSelected  == "ActivAssureV2"  || scope.productSelected  == "ActivAssure") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },
                        {
                            "memberType": "SISTER",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "BROTHER-IN-LAW") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") || (scope.productSelected  == "ActivAssureV2"  || scope.productSelected  == "ActivAssure") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },
                        {
                            "memberType": "GRANDFATHER",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "GRANDMOTHER") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },
                        {
                            "memberType": "GRANDMOTHER",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "GRANDFATHER") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },                        
                        {
                            "memberType": "GRANDSON",
                            "isSelected": false,
                            "display": scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth" || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater") ? true : false
                        },
                        {
                            "memberType": "GRANDDAUGHTER",
                            "isSelected": false,
                            "display": scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth" || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater") ? true : false
                        },
                        {
                            "memberType": "SON-IN-LAW",
                            "isSelected": false,
                            "display": scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth" || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater") ? true : false
                        },
                        {
                            "memberType": "DAUGHTER-IN-LAW",
                            "isSelected": false,
                            "display": scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth" || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater") ? true : false
                        },
                        {
                            "memberType": "BROTHER-IN-LAW",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "SISTER") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },
                        {
                            "memberType": "SISTER-IN-LAW",
                            "isSelected": false,
                            "display": (scope.productSelected  == "ActivCareV2" && scope.allInsuredMembers[1].RelationType.toUpperCase() == "BROTHER") || (scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth") || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },
                        {
                            "memberType": "NEPHEW",
                            "isSelected": false,
                            "display": scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth" || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        },
                        {
                            "memberType": "NIECE",
                            "isSelected": false,
                            "display": scope.productSelected  == "ActivHealthV2" || scope.productSelected  == "ActivHealth" || (scope.productSelected  == "SuperTopUp" && scope.userpolicy.SumInsuredType !="Family Floater")? true : false
                        }
                    ]
                }

                // if ($sessionStorage.productName == 'Active Care V2' ||$sessionStorage.productName == 'Activ Care V2' || $sessionStorage.productName == 'Activ Care' ||  $sessionStorage.productName == 'Active Care') {

                //     angular.forEach(scope.allInsuredMembers, function (v, i) {
                //         if (v.RelationType.toUpperCase() == "SELF") {
                //             scope.membersList.members[0].isSelected = true;
                //             scope.membersList.members[2].display = false;
                //             scope.membersList.members[3].display = false;
                //             scope.membersList.members[4].display = false;
                //             scope.membersList.members[5].display = false;
                //             scope.membersList.members[6].display = false;
                //         } else if (v.RelationType.toUpperCase() == "SPOUSE") {
                //             scope.membersList.members[1].isSelected = true;
                //             scope.membersList.members[2].display = false;
                //             scope.membersList.members[3].display = false;
                //             scope.membersList.members[4].display = false;
                //             scope.membersList.members[5].display = false;
                //             scope.membersList.members[6].display = false;
                //         } else if (v.RelationType.toUpperCase() == "FATHER") {
                //             scope.membersList.members[2].isSelected = true;
                //             scope.membersList.members[0].display = false;
                //             scope.membersList.members[1].display = false;
                //             scope.membersList.members[4].display = false;
                //             scope.membersList.members[5].display = false;
                //             scope.membersList.members[6].display = false;
                //         } else if (v.RelationType.toUpperCase() == "MOTHER") {
                //             scope.membersList.members[3].isSelected = true;
                //             scope.membersList.members[0].display = false;
                //             scope.membersList.members[1].display = false;
                //             scope.membersList.members[4].display = false;
                //             scope.membersList.members[5].display = false;
                //             scope.membersList.members[6].display = false;
                //         } else if (v.RelationType.toUpperCase() == "FATHER-IN-LAW") {
                //             scope.membersList.members[4].isSelected = true;
                //             scope.membersList.members[0].display = false;
                //             scope.membersList.members[1].display = false;
                //             scope.membersList.members[2].display = false;
                //             scope.membersList.members[3].display = false;
                //             scope.membersList.members[6].display = false;
                //         } else if (v.RelationType.toUpperCase() == "MOTHER-IN-LAW") {
                //             scope.membersList.members[5].isSelected = true;
                //             scope.membersList.members[0].display = false;
                //             scope.membersList.members[1].display = false;
                //             scope.membersList.members[2].display = false;
                //             scope.membersList.members[3].display = false;
                //             scope.membersList.members[6].display = false;
                //         }
                //     });

                // } else {

                    angular.forEach(scope.allInsuredMembers, function (v, i) {
                        if (v.RelationType.toUpperCase() == "SELF") {
                            scope.membersList.members[0].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "SPOUSE") {
                            scope.membersList.members[1].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "FATHER") {
                            scope.membersList.members[2].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "MOTHER") {
                            scope.membersList.members[3].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "FATHER-IN-LAW") {
                            scope.membersList.members[4].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "MOTHER-IN-LAW") {
                            scope.membersList.members[5].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "BROTHER") {
                            scope.membersList.members[7].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "SISTER") {
                            scope.membersList.members[8].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "GRANDFATHER") {
                            scope.membersList.members[9].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "GRANDMOTHER") {
                            scope.membersList.members[10].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "GRANDSON") {
                            scope.membersList.members[11].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "GRANDDAUGHTER") {
                            scope.membersList.members[12].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "SON-IN-LAW") {
                            scope.membersList.members[13].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "DAUGHTER-IN-LAW") {
                            scope.membersList.members[14].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "BROTHER-IN-LAW") {
                            scope.membersList.members[15].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "SISTER-IN-LAW") {
                            scope.membersList.members[16].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "NEPHEW") {
                            scope.membersList.members[17].isSelected = true;
                        } else if (v.RelationType.toUpperCase() == "NIECE") {
                            scope.membersList.members[18].isSelected = true;
                        } 
                        else if (v.RelationType.toUpperCase() == "KID") {
                            scope.childCount = scope.childCount + 1;
                        } 
                    });

                    if (scope.childCount == 3 && $rootScope.platinumProduct) {
                        scope.membersList.members[6].isSelected = true;
                    } else if (scope.childCount == 4) {
                        scope.membersList.members[6].isSelected = true;
                    }

                    
                    console.log(scope.membersList,"scope.membersList...");
                // }

            }

            /*--------- End of Elegible Members list configuration To Display on Add New Member Page --------*/

            // scope.GetOriginalQuote = function () {
            //     let  policyNoArray = [];
            //      policyNoArray[0] = $sessionStorage.refNoArray.ReferenceNo == undefined ? $sessionStorage.refNoArray[0].ReferenceNo : $sessionStorage.refNoArray.ReferenceNo;
            //      console.log("policyNoArray[0]: " + policyNoArray[0]);
            //      // for (var i = 0; i < $sessionStorage.refNoArray.length; i++) {
            //      // 	policyNoArray.push($sessionStorage.refNoArray[i].ReferenceNo)
            //      // }
     
            //      RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/GetOriginalQuote", {
            //         "ReferenceNo": $sessionStorage.refNo,
            //         "PolicyNumber": $sessionStorage.policyNo,
            //      }, true
            //      )
            //          .then(
            //              function (data) {
            //                  if (data.ResponseCode == '1') {
                                
            //                  } else if (data.ResponseCode == 0) {
            //                      $rootScope.alertData = {
            //                          "modalClass": "regular-alert",
            //                          "modalHeader": "Alert",
            //                          "modalBodyText": data.ResponseMessage,
            //                          "showCancelBtn": false,
            //                          "modalSuccessText": "Ok",
            //                          "showAlertModal": true,
            //                          "hideCloseBtn": true
            //                      }
            //                  }
            //              },
            //              error => { console.log(error) }
            //          )
            //  }

            



            /*--------- To Apply Health Return --------------*/

            scope.applyForHealthReturn = function (applyHealthReturn) {

                RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateHealthReturnFlag", {
                            "ReferenceNo": $sessionStorage.refNo,
                            "PolicyNumber": $sessionStorage.policyNo,
                            "Flag": applyHealthReturn
                        },
                        true
                    )
                    .then(function (data) {
                        if (data.ResponseCode == 1) {
                            scope.fetchPolicyDetails();
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
            

              
            /*---------- To Fetch Insured Members ------------- */
            scope.AS_PAPlan = true;
            scope.canBeFF = true;
            scope.canBeMI = true;

            scope.fetchInsuredMembers = function () {

                RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetInsuredMembers", {
                            "ReferenceNo": $sessionStorage.refNo,
                            "PolicyNumber": $sessionStorage.policyNo
                        },
                        true
                    )
                    .then(function (data) {
                        if (data.ResponseCode == 1) {
                            var familyArray = ["PROPOSER","Self", "Spouse", "Kid1", "Kid2", "Kid3", "Kid4", "Kid5","Mother", "Father", "Mother-In-Law", "Father-In-Law","Brother","Grandmother","Grandfather","Sister","Sister in-law","Sister-In-Law"];
                            insuredMembersData = data.ResponseData;
                            if(sessionStorage.getItem('policyNewCover')){
                                scope.membersCover = [...insuredMembersData.InsuredMembers[1].optionalCoverages,...JSON.parse(sessionStorage.getItem('policyNewCover'))];
                            }
                            else{
                                scope.membersCover = insuredMembersData.InsuredMembers[1].optionalCoverages;
                            }
                            if($location.path() == "/renewal-view-member-add-user"){
                                scope.setCoverOnLoad();
                            }
                            var familyMembers = [];
                            if(sessionStorage.getItem('userData')){
                                scope.userpolicy = JSON.parse(sessionStorage.getItem("userData"))
                                if(scope.userpolicy.InsuredMembers.length < insuredMembersData.InsuredMembers.length){
                                    scope.userpolicy.InsuredMembers.push(insuredMembersData.InsuredMembers[insuredMembersData.InsuredMembers.length-1])
                                }
                                for (let m = 0; m < insuredMembersData.InsuredMembers.length; m++) {
                                    Object.keys(insuredMembersData.InsuredMembers[m]).forEach(key => {
                                        // if (scope.userpolicy[key]) {
                                            scope.userpolicy.InsuredMembers[m][key] = insuredMembersData.InsuredMembers[m][key]?insuredMembersData.InsuredMembers[m][key]:scope.userpolicy.InsuredMembers[m][key];
                                        // }
                                    });
                                }
                                // scope.userpolicy.InsuredMembers = insuredMembersData.InsuredMembers;
                                sessionStorage.removeItem('userData');
                                sessionStorage.setItem('userData', JSON.stringify(scope.userpolicy));
                                scope.checkUpsellFF(scope.userpolicy)
                                $rootScope.platinumPlan = scope.userpolicy.PlanName;
                            }

                            if(scope.userpolicy.ProductCode == "4111" && (scope.userpolicy.PlanName == "Plan 1" || scope.userpolicy.PlanName == "Plan 2" || scope.userpolicy.PlanName == "Plan 3")){
                                scope.AS_PAPlan = false;
                                for (let i = 0; i < scope.userpolicy.InsuredMembers.length; i++) {
                                    if(parseInt(scope.userpolicy.InsuredMembers[i].SumInsured)>=500000){
                                        scope.AS_PAPlan = true;
                                    };
                                    
                                }
                            }

                            


                            for (var f = 0; f < familyArray.length; f++) {
                                for (var m = 0; m < data.ResponseData.InsuredMembers.length; m++) {
                                    if (familyArray[f] == data.ResponseData.InsuredMembers[m].RelationWithProposer) {
                                        familyMembers.push(data.ResponseData.InsuredMembers[m]);
                                    }
                                }
                            }

                            console.log(familyMembers);

                            insuredMembers = familyMembers;
                            insuredMembers.forEach(function(e,i){
                                if((e.SumInsured > "500000.00"||e.SumInsured == null) && (insuredMembersData.ProductName == "Activ Assure"||insuredMembersData.ProductName == "Active Assure")){
                                    scope.roomupgradeflag = true;
                                }
                                if(e.RelationType.toUpperCase() != "PROPOSER" && e.RelationType.toUpperCase() != "SELF"  && e.RelationType.toUpperCase() != "SPOUSE" && e.RelationType.toUpperCase() != "KID" ){
                                    scope.canBeFF = false;
                                }
                                if(e.RelationType.toUpperCase() != "PROPOSER"){
                                    if(scope.userpolicy.InsuredMembers[i].ISMemberChronic == "Y"){
                                        scope.canBeFF = false;
                                    }
                                }
                                if(scope.parseIntString(scope.userpolicy.InsuredMembers[i].Age) < 5 ){
                                    scope.canBeMI = false;
                                }
                            })
                            insuredMembers = data.ResponseData.InsuredMembers;

                            scope.usedDeductible = 0;
                            insuredMembers.forEach(function(e){
                                if(parseInt(e.Deductible) > parseInt(scope.usedDeductible)){
                                    scope.usedDeductible = e.Deductible;
                                }
                            });
                            sessionStorage.setItem("usedDeductible", scope.usedDeductible);
                            //scope.usedDeductible = $sessionStorage.usedDeductible;
                            console.log('step 2');
                            scope.insuredMembersData = angular.copy(insuredMembersData);
                            scope.allInsuredMembers = angular.copy(insuredMembers);
                            scope.insuredMembers = insuredMembers.slice(1);
                            initializeupdateMember();
                            healthReturnValue(scope.insuredMembers);
                            scope.suminsuredArray = [];
                            scope.suminsuredArray.push(scope.insuredMembers[0].SumInsured);
                            addHeaderValue(scope.insuredMembers);
                            scope.membersToAdd();
                            scope.fetchPolicyDetails();
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
                    });

            }

            scope.fetchInsuredMembers();

            /*---------- End To Fetch Insured Members ------------- */

            /*---------- To Fetch Policy Details ------------------ */
            
            scope.fetchPolicyDetails = function () {

                RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetPolicyDetails", {
                            "ReferenceNo": $sessionStorage.refNo,
                            "PolicyNumber": $sessionStorage.policyNo
                        },
                        true
                    )
                    .then(function (data) {
                        if (data.ResponseCode == 1) {
                            
                            scope.policyDetails = data.ResponseData;
                            sessionStorage.setItem('productCode', scope.policyDetails.ProductCode)
                            if(!sessionStorage.getItem("userData")){
                                sessionStorage.setItem('userData', scope.policyDetails);
                            }
                            else{
                                scope.userpolicy = JSON.parse(sessionStorage.getItem("userData"));
                                Object.keys(scope.policyDetails).forEach(key => {
                                    // if (scope.userpolicy[key]) {
                                        scope.userpolicy[key] = scope.policyDetails[key]?scope.policyDetails[key]:scope.userpolicy[key];
                                    // }
                                });

                                sessionStorage.removeItem('userData');
                                sessionStorage.setItem('userData', JSON.stringify(scope.userpolicy)); 
                            }
                            
	                        // scope.pincodeVal = scope.policyDetails.HomePincode;

                            suminuredValue(scope.insuredMembers, scope.policyDetails);
                            scope.s = scope.policyDetails.PolicyStartDate.split("/");
                            scope.policyStart = new Date(scope.s[1]+'/'+scope.s[0]+'/'+scope.s[2]);
                            if (scope.policyDetails.ProductName == 'Activ Care V2' || scope.policyDetails.ProductName == 'Activ Care'||scope.policyDetails.ProductName == 'Active Care V2' || scope.policyDetails.ProductName == 'Active Care') {
                                scope.showThirdTenureVal = true;
                            }
                            if (scope.policyDetails.UpsellFlag == 'Y' && scope.insuredMembers[0].UpSellSumInsured != 0) {
                                scope.UpSellSumInsured = scope.insuredMembers[0].UpSellSumInsured;
                                scope.suminsuredArray.push(scope.UpSellSumInsured);
                                if (scope.suminsured == scope.UpSellSumInsured) {
                                    scope.updateMembers = 'Y';
                                }
                                scope.insuredMembers.forEach(function (item, index) {
                                    if (item.SumInsured == item.UpSellSumInsured) {
                                        scope.updateMember[item.RelationWithProposer] = 'Y';
                                    }
                                })
                            }
                            scope.suminsuredArrayCopy = angular.copy(scope.suminsuredArray);
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
                    });

            }

            //scope.fetchPolicyDetails();

            /*-------- End To Fetch Policy Details ------------ */

            /*-------- To Get Heath Return Flag -------------*/

            function fetchHealthReturnStatus() {

                RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetHealthReturnFlag", {
                            "ReferenceNo": $sessionStorage.refNo,
                            "PolicyNumber": $sessionStorage.policyNo
                        },
                        true
                    )
                    .then(function (data) {
                        if (data.ResponseCode == 1) {
                            scope.applyHealthReturn = data.ResponseData;
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

            fetchHealthReturnStatus();

            /*------- End of To Get Heath Return flag ----------*/


            /*-------- To Make PG Request ----------- */

            scope.radioChecked = function() {	
                console.log(dLC.tcAgreed)  
                if(!dLC.tcAgreed){
                   dLC.tcAgreed = true;
                }else{
                   dLC.tcAgreed = false;
                }
              }

            scope.requestPgURL = function () {
            //T&C Changes
            if((dLC.tcAgreed && scope.payMode.mode == 'JP_ emandate') || (dLC.tcAgreed && scope.payMode.mode == 'JP_Enach') || scope.payMode.mode == 'JP_normal' || scope.payMode.mode == 'normal' || scope.payMode.mode == 'emandate_normal') {
                scope.showPaymentModeModal=false;
                RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/PGRequest", {
                        "ReferenceNo": $sessionStorage.refNo,
                        "PolicyNumber": $sessionStorage.policyNo,
                        "PaymentType": scope.payMode.mode
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
                    scope.showPaymentModeModal=true;
                }

            }

            //scope.fetchPolicyDetails();

            /*------------- End of To Make PG Request ------------- */

            /*--------- To Open Modal -----------*/

            scope.openModal = function () {
                scope.showModal = true;
            }

            /*--------- End of To Open Modal --------*/

            /*--------- To Close Modal ----------*/

            scope.closeModal = function () {
                scope.showModal = false;
            }

            /*--------- End of To Close Modal ---------*/

            /* Modify Health Add On at Member Level */

            scope.oCBProductLevel = function (param, coverName, member, $event) {
                if (coverName == 'Cancer Hospitalization Booster' && param == 'Y' && parseInt(scope.sumInsured) > 10000000) {
                    scope[member][coverName.replace(/-|\s/g,'')] = 'N'
                    $rootScope.alertConfiguration('E', "Only applicable for sum insured upto 1 Crore");
                    $rootScope.$apply();
                    $('#CHB-chk').prop('checked', false);
                    return false;
                }

                if (param == 'Y') {
                    scope[member].optionalCoverages.push({
                        "Coverage": coverName,
                        "CoverSI": ""
                    })
                    scope[member][coverName.replace(/-|\s/g,'')] = 'Y';
                    for (var i = 0; i < scope.insuredMembers.length; i++) {
                        if (coverName == 'Cancer Hospitalization Booster' && parseInt(scope.insuredMembers[i].SumInsured) > 10000000) {
                            scope.insuredMembers[i][coverName] = 'N'
                            scope[coverName] = 'N'
                            $rootScope.alertConfiguration('E', "Only applicable for sum insured upto Rs. 1 Crore");
                            $('#CHB-chk').prop('checked', false);
                        }
                        else {
                            scope.insuredMembers[i][coverName.replace(/-|\s/g,'')] = 'Y'

                            if (coverName == 'Cancer Hospitalization Booster' && parseInt(scope.insuredMembers[i].Age) > 65) {
                                scope[coverName] = 'N'
                                $rootScope.alertConfiguration('E', "This Add On is available for minimum age 91 days and maximum age 65 Years");
                                $rootScope.$apply();
                                return false;
                            }
                            scope[member][coverName.replace(/-|\s/g,'')] = 'Y'
                        }
                    }
                } else {
                    scope[member][coverName.replace(/-|\s/g,'')] = 'N';
                    for (var i = 0; i < scope.insuredMembers.length; i++) {
                        scope.insuredMembers[i][coverName] = 'N'
                        scope[member].optionalCoverages = scope[member].optionalCoverages.filter((item) => item.Coverage !== coverName);
                    }
                }
            }
        
            /* Modify Health Add On at Member Level Ends*/
        
            /* Modify Health Add On at Product Level */
        
            scope.vaccineCoverProductLevel = function(param, vcsi, coverName, member , $event) {
                console.log(param)
                if (param == 'N') {
                    scope[member].VaccineCoverSI = '--Select--'
                    scope[coverName] = 'N'
                    scope[member][coverName] = 'N';
                    scope[member].optionalCoverages = scope[member].optionalCoverages.filter((item) => item.Coverage !== coverName);
                }
                if (param == 'Y') {
                    vcsi = (vcsi == '' || vcsi == undefined || vcsi == "--Select--") ? 1000 : vcsi;
                    scope[member].VaccineCoverSI = (vcsi != '' && vcsi != undefined && vcsi != "--Select--") ? vcsi : 1000;
                    scope[coverName] = 'Y';
                    scope[member].optionalCoverages = scope[member].optionalCoverages.filter((item) => item.Coverage !== coverName);
                    scope[member][coverName] = 'Y';
                    scope[member].optionalCoverages.push({
                        "Coverage": coverName,
                        "CoverSI": vcsi
                    })
                }
            }

            scope.oCBMemberLevel = function (param, val, coverName) {
                var anyMemberIsPresent = false;
                // if (coverName == 'CancerHospitalizationBooster' && parseInt(param.SumInsured) > 10000000) {
                //     scope[coverName] = 'N'
                //     $rootScope.alertConfiguration('E', "Only applicable for sum insured upto Rs. 1 Crore");
                //     for (var i = 0; i < scope.insuredMembers.length; i++) {
                //         if (scope.insuredMembers[i].RelationType == param.RelationType) {
                //             scope.insuredMembers[i][coverName] = 'N'
                //         }
                //     }
                // } else {
                if (val == 'Y') {
                    for (var i = 0; i < scope.insuredMembers.length; i++) {
                        if (scope.insuredMembers[i].RelationType == param.RelationType) {
                            scope.insuredMembers[i][coverName] = val
                        }
                    }
                    scope[coverName] = 'Y'
                } else {
                    for (var i = 0; i < scope.insuredMembers.length; i++) {
                        if (scope.insuredMembers[i].RelationType == param.RelationType) {
                            scope.insuredMembers[i][coverName] = val
                        }
                    }
                    angular.forEach(scope.insuredMembers, function (v, i) {
                        if (v[coverName] == 'Y')
                            anyMemberIsPresent = true;
                    })
                    if (anyMemberIsPresent) {
                        scope[coverName] = 'Y'
                    } else {
                        scope[coverName] = 'N'
                    }
                }
                // }
                //$scope.calculatePremium();
            }

            /*-------------------- To Select Payment Mode --------------------------*/
           
            scope.selectPaymentMode = function () {
                
                    if (scope.policyDetails.Autodebit == 'N') {
                        scope.showPaymentModeModal = true;
                    } else if (scope.policyDetails.Autodebit == 'Y') {
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
    
                        var expDate = scope.policyDetails.PolicyExpiryDate.trim().split('/');
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
                            scope.showAutoDebitModal = true;
                        } else {
                            scope.payMode.mode = 'normal';
                            scope.requestPgURL();
                        }
    
                    }
                
            }

            /*-------------------- To Select Payment Mode Ends--------------------------*/


        }
    }

}])