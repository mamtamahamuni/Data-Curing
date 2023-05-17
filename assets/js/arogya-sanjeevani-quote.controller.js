var asApp = angular.module("arogyaSanjeevaniQuoteApp", []);

asApp.controller("arogyaSanjeevaniQuoteApp", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$q', function ($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $q) {

    /* Data Inilization */

    var aRS = this;
    var aS = appService;
    aRS.plantp = "fal";
    aRS.planName = "arogya-sanjeevani";
    aRS.validForm = true;
    aRS.productSelctedInCross = 'AC'
    var planNameArray = ["Standard", "Classic", "Premier"];
    aRS.showCrossSell = false;
    aRS.roomUpgradeText = "";
    aRS.initSlider = false;
    aRS.sumInusred = "";
    aRS.selectedMember = [];
    aRS.tempUNSelectedMembersForTwo = [];
    aRS.tempUNSelectedMembers = [];

    /* End of data inilization */

    function loadOwlCarousel(idName){
        aRS.initSlider = true;
        $timeout(function(){
            $("#"+idName).owlCarousel({
                items: 2,
                navigation: true,
                navigationText: ["",""],
            });
        },300);
    }

    $(document).ready(function () {

        $('.show-answer').on('click', function () {
            if (aRS.selectedMember.length == 1) {
                $rootScope.alertConfiguration('E', "Family floater is only applicable for two members ");
                $rootScope.$apply();
                return false;
            }
            
            var deletememberedParentArray  = [];
            var deletememberedParentInLawArray = [];
            for(var i = 0 ; i < aRS.selectedMember.length ; i++ ){
                if(aRS.selectedMember[i].RelationWithProposer == "FATHER" || aRS.selectedMember[i].RelationWithProposer == "MOTHER"){
                    deletememberedParentArray.push(aRS.selectedMember[i]);    
                }else if(aRS.selectedMember[i].RelationWithProposer == "FATHER-IN-LAW" || aRS.selectedMember[i].RelationWithProposer == "MOTHER-IN-LAW"){
                    deletememberedParentInLawArray.push(aRS.selectedMember[i]);
                }
            }

            if(deletememberedParentArray.length > 0 && deletememberedParentInLawArray.length > 0){
                $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Invalid family construct. </br> Parents & Parents-In-Laws not allowed together for Arogya Sanjeevani Product with Family Floater policy type.</br>Please remove either Parents or Parents-In-Law.",
                "showCancelBtn": false,
                "modalSuccessText": "Ok",
                "showAlertModal": true
                }
                $rootScope.$apply();
                return false;
            } else {
                aRS.arogyaSanjeevaniQuoteDetails.PolicyType = "FF";
                $timeout(function(){
                    loadOwlCarousel('ci-sum-isnured-slider')
                },300);
                aRS.updatePreminum();
            }

        });

        $('.hide-answer').on('click', function () {
            aRS.arogyaSanjeevaniQuoteDetails.PolicyType = "MI";
            $timeout(function(){
                loadOwlCarousel('ci-sum-isnured-slider11')
            },300);
            aRS.updatePreminum();
        });

    });


    /* To Fetch Family Members for active care */

    aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
            "Name": "getACRelation"
        }, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (data) {
            aRS.intitalACMemberList = data.ResponseData;
            aRS.activeCareFamilyContruct = data.ResponseData;
            fetchQuoteDetails();
        }, function (err) {})

    /* End of fetching family members active care */


    /* To fetch Quote details */

    function fetchQuoteDetails() {
        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });  
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetQuoteDetails", {
            "_data": reqData
            }, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (data) {
                //aS.triggerSokrati(); /* Triggering Sokrati 
                        var data = JSON.parse($rootScope.decrypt(data._resp))
                if (data.ResponseCode == 1) {
                    aRS.arogyaSanjeevaniQuoteDetails = data.ResponseData.ASQuote;
                    $rootScope.leminiskObj = data.ResponseData;
                    $rootScope.lemniskCodeExcute();
                    aRS.arogyaSanjeevaniPreminumObj = data.ResponseData.PremiumDetail;
                    aRS.selectedMember = aRS.arogyaSanjeevaniQuoteDetails.MemberDetails;
                    var planNameInt = parseInt(aRS.arogyaSanjeevaniQuoteDetails.PlanType);
                    aRS.arogyaSanjeevaniTenure = aRS.arogyaSanjeevaniQuoteDetails.PolicyTenure;
                    aRS.planNameVal = planNameArray[planNameInt - 1];
                    
                    if (aRS.arogyaSanjeevaniQuoteDetails.PolicyType == "FF") {
                        $timeout(function () {
                            angular.element('.show-answer').triggerHandler('click');
                        }, 0);
                        aRS.sumInusred = aRS.arogyaSanjeevaniQuoteDetails.MemberDetails[0].SumInsured;
                        for (var j = 0; j < aRS.arogyaSanjeevaniQuoteDetails.MemberDetails.length; j++) {
                            aRS.arogyaSanjeevaniQuoteDetails.MemberDetails[j]
                            if (aRS.arogyaSanjeevaniQuoteDetails.MemberDetails[j].SumInsured > aRS.sumInusred) {
                                aRS.sumInusred = aRS.arogyaSanjeevaniQuoteDetails.MemberDetails[j].SumInsured
                            }
                        }
                    } else {
                        $timeout(function () {
                            angular.element('.hide-answer').triggerHandler('click');
                        }, 0);
                        aRS.sumInusred = aRS.arogyaSanjeevaniQuoteDetails.MemberDetails[0].SumInsured;
                        for (var j = 0; j < aRS.arogyaSanjeevaniQuoteDetails.MemberDetails.length; j++) {
                            if (aRS.arogyaSanjeevaniQuoteDetails.MemberDetails[j].SumInsured > aRS.sumInusred) {
                                aRS.sumInusred = aRS.arogyaSanjeevaniQuoteDetails.MemberDetails[j].SumInsured
                            }
                        }
                    }
                    
                    //loadOwlCarousel();
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": "Some error ocurred.",
                        "showCancelBtn": false,
                        "gtagPostiveFunction": "click-button, activ-care-quote , service-fails[GetQuoteDetails]",
                        "gtagCrossFunction": "click-button,  activ-care-quote ,service-fails[GetQuoteDetails]",
                        "gtagNegativeFunction": "click-button, activ-care-quote , service-fails[GetQuoteDetails]",
                        "modalSuccessText": "Ok",
                        "showAlertModal": true
                    }
                }
            }, function (err) {

            })
    }

    /* End of fetching quote details */


    /* To Fetch Sum Insured Data */

    aS.getData("assets/data/sum-insured.json", "", false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (data) {
            if (data.ResponseCode == 1) {
                aRS.sumAmounts = data.ResponseData;
            } else {

            }
        }, function (err) {

        })


    /* End of fetching sum insured data */

    /* updated the Sum insured value */

    aRS.updateSumInsured = function (param, membersObj) {
        if (membersObj != "") {
            for (var i = 0; i < aRS.selectedMember.length; i++) {
                if (aRS.selectedMember[i].RelationType == membersObj.RelationType) {
                    aRS.selectedMember[i].SumInsured = param;
                }
            }
        } else {
            aRS.sumInusred = param
            for (var i = 0; i < aRS.selectedMember.length; i++) {
                aRS.selectedMember[i].SumInsured = param;
            }
        }
        aRS.updatePreminum();
    }

    /* updated the Sum insured value Ends */

    /* calculate preminum */

    aRS.calculatePremium = function () {
        aRS.updatePreminum();

    }

    /* calculate preminum Endsd*/

    /* Update soft details data */

    aRS.updateSoftDetails = function (op, insuredDetail, index) {

        if (op == 'AddMember') {
            aRS.initSlider = false;
            if (aRS.arogyaSanjeevaniQuoteDetails.PolicyType == "FF") {
                insuredDetail.SumInsured = aRS.sumInusred;
            } else {
                insuredDetail.SumInsured = aRS.selectedMember[0].SumInsured
            }
            
            aRS.selectedMember.push(insuredDetail)
            aRS.calculatePremium();
            // $timeout(function () {
            //     loadOwlCarousel();
            // }, 300);
        }
        if (op == 'UpdateMember' || (op == 'DeleteMember' && insuredDetail.RelationWithProposer != 'KID')) {
            for (var i = 0; i < aRS.selectedMember.length; i++) {
                if (op == 'UpdateMember' && insuredDetail.RelationType == aRS.selectedMember[i].RelationType) {
                    aRS.selectedMember[i].Age = insuredDetail.Age
                } 
                else if (op == 'DeleteMember' && insuredDetail.RelationType == aRS.selectedMember[i].RelationType) {
                    aRS.selectedMember.splice(i, 1)
                    aRS.initSlider = false;
                }
            }
            if(aRS.selectedMember.length == 1){
                aRS.arogyaSanjeevaniQuoteDetails.PolicyType = "MI"
            }
            aRS.calculatePremium();
            // $timeout(function () {
            //     loadOwlCarousel();
            // }, 300);
        } 
        if (op == 'DeleteMember' && insuredDetail.RelationWithProposer == 'KID'){
            aRS.initSlider = false;
            fetchQuoteDetails(); 
        }
        if (aRS.arogyaSanjeevaniQuoteDetails.PolicyType == "FF"){
            $timeout(function () {
                angular.element('.show-answer').triggerHandler('click');
            }, 0);
        } else {
            $timeout(function () {
                angular.element('.hide-answer').triggerHandler('click');
            }, 0);
        }
        aRS.fetchInsuredMembers();

    }

    /* End of updating soft details data */


    /* To delete particular member */

    aRS.aRSUpdateDeleteMember = function (member, ind, operation) {
        //$rootScope.callGtag('click-icon-x','quote','aRS-quote_plan_delete-member');
        if (aRS.selectedMember.length == 1 && operation == 'deleteMember') {
            $rootScope.alertConfiguration('E', "You cannot delete this member.", "delete_member_alert");
            return false;
        }
        for (var i = 0; i < aRS.selectedMember.length; i++) {
            if (member.RelationType == aRS.selectedMember[i].RelationType) {
                aRS.selectedMember[i].ProductCode = 'AS';
                if (operation == 'updateMember') {
                    aRS.previousAge = aRS.membersDetails[i + 1].Age
                    aRS.membersDetails[i + 1].Age = aRS.selectedMember[i].Age
                    aRS.addUpdateMember(member, ind, aRS.previousAge)
                } else {
                    aRS.deleteMember(aRS.selectedMember[i], ind);
                }

                break;
            }
        }
    }

    /* End of deleting particular member */

    /* updated the Preminum value */

    aRS.updatePreminum = function () {
            
        var acPreminumObj = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Savings": true,
            "AS": {
                "PolicyTenure": aRS.arogyaSanjeevaniQuoteDetails.PolicyTenure,
                "PolicyType": aRS.arogyaSanjeevaniQuoteDetails.PolicyType,
                "PaymentType": "UPFRONT",
                "MemberDetails": aRS.selectedMember
            }
        }

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", acPreminumObj, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    aRS.arogyaSanjeevaniPreminumObj.TotalPremium = 0;
                    aRS.arogyaSanjeevaniPreminumObj.TotalPremium = data.ResponseData.TotalPremium;
                    aRS.arogyaSanjeevaniPreminumObj.ProductPremium = data.ResponseData.ProductPremium;
                    aRS.PremiumDetail = data.ResponseData;
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": data.ResponseMessage,
                        "gtagPostiveFunction": "click-button, activ-care-quote , service-fails[UpdateTenure]",
                        "gtagCrossFunction": "click-button,  activ-care-quote ,service-fails[UpdateTenure]",
                        "gtagNegativeFunction": "click-button, activ-care-quote , service-fails[UpdateTenure]",
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function (err) {});
    }

    /* updated the Preminum value Ends*/


    /* To open add member modal */

    aRS.openAddMemberModel = function () {
        aRS.fetchInsuredMembers();
        $('#change-group-member').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    /* End of opening add member modal */


    /* Submit Activ Care Quote */

    aRS.arogyaSanjeevaniQuote = function (event) {
        
        for (var i = 0; i < aRS.selectedMember.length; i++) {
            if (aRS.selectedMember[i].Age > 80) {
                $rootScope.alertConfiguration('E', "Age of " + aRS.selectedMember[i].RelationWithProposer + " cannot be greater than 80");
                $rootScope.$apply();
                return false;
            }
        }

        event.target.disabled = false;
        event.target.innerText = "Proceed";
        var aRSSubmitQuoteObj = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Savings": true,
            "ASUpdateQuote": {
                "PolicyType": aRS.arogyaSanjeevaniQuoteDetails.PolicyType,
                "PaymentType": "UPFRONT",
                "PolicyType": aRS.arogyaSanjeevaniQuoteDetails.PolicyType,
                "MemberDetails": aRS.selectedMember
            }
        }
        var lemniskObjPass = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Savings": true,
            "ASUpdateQuote": {
                "PolicyType": aRS.arogyaSanjeevaniQuoteDetails.PolicyType,
                "PaymentType": "UPFRONT",
                "PolicyType": aRS.arogyaSanjeevaniQuoteDetails.PolicyType,
                "MemberDetails": aRS.selectedMember
            }
        }

        var lemeiskData = lemniskObjPass;
        $rootScope.leminiskObj = lemeiskData;
        $rootScope.lemniskCodeExcute();

        var lemniskObj = { 
            "Selected Members":aRS.selectedMember, 
            "PlanName": aRS.planName, 
            "PolicyTenure": aRS.arogyaSanjeevaniQuoteDetails.PolicyTenure, 
            "PolicyType": aRS.arogyaSanjeevaniQuoteDetails.PolicyType,
            "Premium Amount":aRS.PremiumDetail.TotalPremium
        };
        $rootScope.lemniskTrack("","", lemniskObj);

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", aRSSubmitQuoteObj, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

            if (response.ResponseCode == 1) {
                $location.url('arogya-sanjeevani-proposer-details');
            } else {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Some error occurred!",
                    "gtagPostiveFunction": "click-button, activ-care-quote , service-fails[UpdateQuoteDetails]",
                    "gtagCrossFunction": "click-button,  activ-care-quote ,service-fails[UpdateQuoteDetails]",
                    "gtagNegativeFunction": "click-button, activ-care-quote , service-fails[UpdateQuoteDetails]",
                    "showCancelBtn": false,
                    "modalSuccessText": "Ok",
                    "showAlertModal": true,
                }
            }

        }, function (err) {
            event.target.disabled = false;
            event.target.innerText = "Proceed";
        });
    }

    /* Submit Activ Care Quote */

}])