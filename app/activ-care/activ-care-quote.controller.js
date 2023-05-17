var acApp = angular.module("activCareQuoteApp", []);

acApp.controller("activCareQuoteApp", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$q', function($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $q) {
    
    /* Data Inilization */

        var aC = this;
        var aS = appService;
        aC.plantp = "fal"
        aC.planName = "activ-Care"
        aC.validForm = true;
        aC.productSelctedInCross = 'AC'
        var planNameArray = ["Standard", "Classic", "Premier"]
        var goingOn = false;
        aC.showCrossSell = false;
        var insuredMemberDetails;
        aC.roomUpgradeText = "";
        aC.sumInusred = ""
        aC.selectedMember = [];
        aC.tempUNSelectedMembersForTwo = []
        aC.tempUNSelectedMembers = [];

        aC.vaccineAmount = ['--Select--', 500, 750, 1000];
        aC.ReductionInPEDWaitingPeriodText = '--Select--';
        aC.ReductionInPEDWaitingPeriodOptions = [
                                                    {RPEDWPId:1,RPEDWPText:"-- Select --",RPEDWPModel:"ReductionInPEDWaitingPeriod",RPEDWPCoverName:"ReductionInPEDWaitingPeriod", value: 'N', display:'Essential,Enhanced, Premier'},
                                                    {RPEDWPId:1,RPEDWPText:"4 Yrs to 2 Yrs",RPEDWPModel:"ReductionInPEDWP4yrsto2yrs",RPEDWPCoverName:"ReductionInPEDWP4yrsto2yrs", value: 'Y', display:'Essential'},
                                                    {RPEDWPId:2,RPEDWPText:"4 Yrs to 1 Yr",RPEDWPModel:"ReductionInPEDWP4yrsto1yrs",RPEDWPCoverName:"ReductionInPEDWP4yrsto1yrs", value: 'Y', display:'Essential'},
                                                    {RPEDWPId:3,RPEDWPText:"3 Yrs to 2 Yrs",RPEDWPModel:"ReductionInPEDWP3yrsto2yrs",RPEDWPCoverName:"ReductionInPEDWP3yrsto2yrs", value: 'Y', display:'Enhanced, Premier'},
                                                    {RPEDWPId:4,RPEDWPText:"3 Yrs to 1 Yr",RPEDWPModel:"ReductionInPEDWP3yrsto1yrs",RPEDWPCoverName:"ReductionInPEDWP3yrsto1yrs", value: 'Y', display:'Enhanced, Premier'}
                                                ];
        aC.VaccineCoverOptions = ["Rs.500 / Insured Person / Per Policy Year", "Rs.750 / Insured Person / Per Policy Year", "Rs.1000 / Insured Person / Per Policy Year"];


    /* End of data inilization */

    $(document).ready(function() {

        $('.show-answer').on('click', function() {
            if (aC.selectedMember.length == 1) {
                $rootScope.alertConfiguration('E', "Family floater is only applicable for two members ");
                $rootScope.$apply();
                return false;
            }
            aC.activCareQuoteDetails.PolicyType = "FF"
            for (var i = 0; i < aC.selectedMember.length; i++) {
                if (aC.selectedMember[i].ARU == "Y") {
                    aC.oCBProductLevel('Y', 'ARU')
                }
                if (aC.selectedMember[i].QNH == "Y") {
                    aC.oCBProductLevel('Y', 'QNH')
                }
                if (aC.selectedMember[i].LSE == "Y") {
                    aC.oCBProductLevel('Y', 'LSE')
                }
                if (aC.selectedMember[i].PME == "Y") {
                    aC.oCBProductLevel('Y', 'PME')
                }
                if (aC.selectedMember[i].AHC == "Y") {
                    aC.oCBProductLevel('Y', 'AHC')
                }
                if (aC.selectedMember[i].PPN == "Y") {
                    aC.oCBProductLevel('Y', 'PPN')
                }
            }
            aC.updatePreminum();
        });

        $('.hide-answer').on('click', function() {
            aC.activCareQuoteDetails.PolicyType = "MI"
            if (aC.selectedMember.length == 2) {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    if (aC.selectedMember[i].Age < 55) {
                        aC.activCareQuoteDetails.PolicyType = "FF"
                       $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Error",
                                "modalBodyText": "Incase Of Multi-Individual age of both members should be 55 or above ",
                                "showCancelBtn": false,
                                "modalSuccessText": "OK",
                                "showAlertModal": true,
                                "hideCloseBtn": true,
                                "positiveFunction": function(){
                                    angular.element('.show-answer').triggerHandler('click');  
                                }
                            }
                    }
                }
            }
            
            for (var i = 0; i < aC.selectedMember.length; i++) {
                if (aC.selectedMember[i].QNH == "Y") {
                    aC.QNH = 'Y';
                }
                if (aC.selectedMember[i].LSE == "Y") {
                    aC.LSE = 'Y';
                }
                if (aC.selectedMember[i].PME == "Y") {
                    aC.PME = 'Y';
                }
                if (aC.selectedMember[i].AHC == "Y") {
                    aC.AHC = 'Y';
                }
                if (aC.selectedMember[i].ARU == "Y") {
                    aC.ARU = 'Y';
                }
                if (aC.selectedMember[i].PPN == "Y") {
                    aC.PPN = 'Y';
                }
            }

            aC.updatePreminum()
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
            .then(function(data) {
                aC.intitalACMemberList = data.ResponseData;
                aC.activeCareFamilyContruct = data.ResponseData;
                fetchQuoteDetails();
            }, function(err) {})

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
                .then(function(data) {
                    //aS.triggerSokrati(); /* Triggering Sokrati 
                        var data = JSON.parse($rootScope.decrypt(data._resp))
                    if (data.ResponseCode == 1) {
                        aC.activCareQuoteDetails = data.ResponseData.ACQuote;
                         $rootScope.leminiskObj =  data.ResponseData
                            $rootScope.lemniskCodeExcute();
                        aC.activCarePreminumObj = data.ResponseData.PremiumDetail;
                        aC.selectedMember = aC.activCareQuoteDetails.MemberDetails;
                        var planNameInt = parseInt(aC.activCareQuoteDetails.PlanType);
                        if(aC.activCareQuoteDetails.PlanType == "1" ){
                            aC.roomUpgradeText = "from shared to single private A.C room ."
                        }
                        else if(aC.activCareQuoteDetails.PlanType == "2"){
                            aC.roomUpgradeText = "from shared to single private A.C room ."
                        }
                        else{
                            aC.roomUpgradeText = "from single private AC room to any room except suite & above ."
                        }
                        aC.planNameVal = planNameArray[planNameInt - 1];
                        if(aC.activCareQuoteDetails.PolicyType == "FF") {
                            $timeout(function() {
                                angular.element('.show-answer').triggerHandler('click');
                            }, 0);
                            aC.sumInusred = aC.activCareQuoteDetails.MemberDetails[0].SumInsured;
                            for (var j = 0; j < aC.activCareQuoteDetails.MemberDetails.length; j++) {
                                aC.activCareQuoteDetails.MemberDetails[j]
                                if (aC.activCareQuoteDetails.MemberDetails[j].SumInsured > aC.sumInusred) {
                                    aC.sumInusred = aC.activCareQuoteDetails.MemberDetails[j].SumInsured
                                }

                                /* Health Add On */
                                if (aC.activCareQuoteDetails.MemberDetails[j].Future_Secure_YN == 'Y') {
                                    aC.Future_Secure_YN = 'Y';
                                }
                                if (aC.activCareQuoteDetails.MemberDetails[j].Cancer_H_Booster_YN == 'Y') {
                                    aC.Cancer_H_Booster_YN = 'Y';
                                }
                                if (aC.activCareQuoteDetails.MemberDetails[j].Vaccine_Cover_YN == 'Y') {
                                    aC.Vaccine_Cover_YN = 'Y';
                                }
                                if (aC.activCareQuoteDetails.MemberDetails[j].Tele_OPD_YN == 'Y') {
                                    aC.Tele_OPD_YN = 'Y';
                                }
                            }
                        }else {
                            $timeout(function() {
                                angular.element('.hide-answer').triggerHandler('click');
                            }, 0);
                            aC.sumInusred = aC.activCareQuoteDetails.MemberDetails[0].SumInsured;
                            for (var j = 0; j < aC.activCareQuoteDetails.MemberDetails.length; j++) {
                                if (aC.activCareQuoteDetails.MemberDetails[j].SumInsured > aC.sumInusred) {
                                    aC.sumInusred = aC.activCareQuoteDetails.MemberDetails[j].SumInsured
                                }
                                
                                /* Health Add On */
                                if (aC.activCareQuoteDetails.MemberDetails[j].Future_Secure_YN == 'Y') {
                                    aC.Future_Secure_YN = 'Y';
                                }
                                if (aC.activCareQuoteDetails.MemberDetails[j].Cancer_H_Booster_YN == 'Y') {
                                    aC.Cancer_H_Booster_YN = 'Y';
                                }
                                if (aC.activCareQuoteDetails.MemberDetails[j].Vaccine_Cover_YN == 'Y') {
                                    aC.Vaccine_Cover_YN = 'Y';
                                }
                                if (aC.activCareQuoteDetails.MemberDetails[j].Tele_OPD_YN == 'Y') {
                                    aC.Tele_OPD_YN = 'Y';
                                }
                            }
                        }

                        /* Health Add On */
                        if (aC.Future_Secure_YN == 'Y') {
                            // aC.coverShowHide(aC.FutureSecure, 'FS', 'pl-FutureSecure-Question');
                        }
                        if (aC.Cancer_H_Booster_YN == 'Y') {
                            // aC.coverShowHide(aC.Cancer_H_Booster_YN, 'CHB', 'pl-CancerHospitalizationBooster-Question');
                        }
                        if (aC.Vaccine_Cover_YN == 'Y') {
                            // aC.coverShowHide(aC.Vaccine_Cover_YN, 'VC', 'pl-VaccineCover-Question');
                        }
                        if (aC.Vaccine_Cover_YN == 'Y') {
                            // aC.coverShowHide(aC.Vaccine_Cover_YN, 'TOPDC', 'pl-TeleOPDConsultation-Question');
                        }
                    }else{
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
                }, function(err) {

                })
        }

    /* End of fetching quote details */


    /* To Fetch Sum Insured Data */

        aS.getData("assets/data/sum-insured.json", "", false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if (data.ResponseCode == 1) {
                    aC.sumAmounts = data.ResponseData;
                }
            }, function(err) {

            })

    /* End of fetching sum insured data */


    /* To Fetch Insured Members */

        aC.fetchInsuredMembers = function() {
            var defer = $q.defer();
            aC.showCrossSell = false;
            var reqData = $rootScope.encrypt({
                "ReferenceNumber": sessionStorage.getItem('rid')
            });
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetInsuredMembers", {
                "_data": reqData,
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    if (data.ResponseCode == 1) {
                        insuredMemberDetails = data.ResponseData.ProductInsuredDetail;
                        for (var i = 0; i < insuredMemberDetails.length; i++) {
                            if (insuredMemberDetails[i].IsPrimaryProduct) {
                                aC.insuredMembers = insuredMemberDetails[i].InsuredMembers.slice(1);
                            }
                        }
                        aC.crossSell = false;
                        angular.forEach(data.ResponseData.ProductInsuredDetail, function(val, ind) {
                            if (val.IsPrimaryProduct) {
                                productCode = val.ProductCode;
                                aC.membersDetails = val.InsuredMembers;
                                membersCopy = angular.copy(val.InsuredMembers);
                            } else {
                                aC.crossSell = true;
                                aC[val.ProductCode] = 'Y';
                                aC[val.ProductCode + "Members"] = val.InsuredMembers;
                            }
                        });
                        aC.showCrossSell = false;
                        angular.forEach(aC.membersDetails, function(v, i) {
                            if (v.RelationType == "S" || v.RelationType == "SPO" || v.RelationType == "F" || v.RelationType == "M" || v.RelationType == "FIL" || v.RelationType == "MIL") {
                                aC.showCrossSell = true;
                            }
                        })
                        
                        if (aC.crossSell) {
                            if (aC.PA == 'Y') {
                                mapProductInsuredMembers('PAMembers', 'isPA', 'PAQuoteDetails')
                            }
                            if (aC.CI == 'Y') {
                                mapProductInsuredMembers('CIMembers', 'isCI', 'CIQuoteDetails')
                            }
                            if (aC.CS == 'Y') {
                                mapProductInsuredMembers('CSMembers', 'isCS', 'CSQuoteDetails')
                            }
                        }
                        defer.resolve(data);
                    }else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": "Some error ocurred.",
                            "showCancelBtn": false,
                            "modalSuccessText": "Ok",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {

                });
            return defer.promise;

        }

        aC.fetchInsuredMembers();

    /* End of fetching insured members */


    /* Manage selected member of cross sell products*/

        function mapProductInsuredMembers(arrayParam, paramTrue, quoteObj) {
            aC[quoteObj] = [];
            for (var i = 0; i < aC.membersDetails.length; i++) {
                for (var j = 0; j < aC[arrayParam].length; j++) {
                    if (aC.membersDetails[i].RelationType == aC[arrayParam][j].RelationType) {
                        aC.membersDetails[i][paramTrue] = 'Y';
                        break;
                    }
                }
                if(aC.membersDetails[i].RelationType == "PROPOSER" || aC.membersDetails[i].RelationType == 'S' || aC.membersDetails[i].RelationType == 'SPO'){
                    aC[quoteObj][i] = {
                        "suminsured":(paramTrue == 'isPA') ? "3000000" : "2500000",
                        "AnnualIncome" : ""
                    };
                }else if(aC.membersDetails[i].RelationType == 'F' || aC.membersDetails[i].RelationType == 'M' || aC.membersDetails[i].RelationType == 'FIL' || aC.membersDetails[i].RelationType == 'MIL'){
                    aC[quoteObj][i] = {
                        "suminsured": (paramTrue == 'isPA') ? "3000000" : "1000000",
                        "AnnualIncome" : ""
                    };
                }else{
                    aC[quoteObj][i] = {
                        "suminsured": (paramTrue == 'isPA') ? "1500000" : "1000000",
                        "AnnualIncome" : ""
                    };
                }
            }
        }

    /* End of manging selected member of cross sell products */

    
    /* updated the Sum insured value */

    aC.updateSumInsured = function (param, membersObj) {
        if (membersObj != "") {
            for (var i = 0; i < aC.selectedMember.length; i++) {
                if (aC.selectedMember[i].RelationType == membersObj.RelationType) {
                    aC.selectedMember[i].SumInsured = param;
                }
                if(aC.CancerHospitalizationBooster == 'Y' && parseInt(param) > 10000000 ){
                    $rootScope.alertConfiguration('E', "Cancer Hospitalization Booster is not available for Base Policy with Sum Insured above 1 Cr", "");
                    //aC.CancerHospitalizationBooster = 'N'   
                    for (var i = 0; i < aC.selectedMember.length; i++) {
                        if (aC.selectedMember[i].RelationType == membersObj.RelationType) {
                        aC.selectedMember[i].CancerHospitalizationBooster = 'N'
                        }
                    }
                    var anyMemberIsPresent = false;
                    angular.forEach(aC.selectedMember, function(v, i) {
                        if (v["CancerHospitalizationBooster"] == 'Y')
                            anyMemberIsPresent = true;
                    })
                    if (anyMemberIsPresent) {
                        aC.CancerHospitalizationBooster = 'Y'
                    } else {
                        aC.CancerHospitalizationBooster = 'N'
                    }
                }             
            }

        } else {
            aC.sumInusred = param
            for (var i = 0; i < aC.selectedMember.length; i++) {
                aC.selectedMember[i].SumInsured = param;
            }
            if(aC.CancerHospitalizationBooster == 'Y' && parseInt(param) > 10000000 ){
                $rootScope.alertConfiguration('E', "Cancer Hospitalization Booster is not available for Base Policy with Sum Insured above 1 Cr", "");
                aC.CancerHospitalizationBooster = 'N'   
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    aC.selectedMember[i].CancerHospitalizationBooster = 'N'
                }
            } 
            
        }

        if (aC.activCareQuoteDetails.PolicyType == 'FF' && aC.sumInusred < 1000000) {
            aC.iCMICollapse = 'N';
            // aC.coverShowHide('N', 'ICMI', 'content-international-coverage')
        }
        if (aC.activCareQuoteDetails.PolicyType == 'FF' && aC.sumInusred <= 300000) {
            for (var i = 0; i < aC.selectedMember.length; i++) {

                if (aC.selectedMember[i].SumInsured <= 300000) {
                    aC.selectedMember[i].RoomType = 'Single'
                }
            }
        }
        else if (aC.activCareQuoteDetails.PolicyType == 'MI') {
            for (var i = 0; i < aC.selectedMember.length; i++) {
                if (aC.selectedMember[i].SumInsured < 1000000 && aC.selectedMember[i].RelationType == membersObj.RelationType) {
                    aC.selectedMember[i].ICMICoverFlag = 'N'
                }
                if (aC.selectedMember[i].SumInsured <= 300000) {
                    aC.selectedMember[i].RoomType = 'Single'
                }
            }
        }

        aC.updatePreminum()
    }

    /* updated the Sum insured value Ends */


    /* calculate preminum */

        aC.calculatePremium = function() {
            aC.updatePreminum();
        }

    /* calculate preminum Endsd*/


    /* updated the Preminum value */

        aC.updatePreminum = function() {
            angular.forEach(aC.selectedMember, function(v, i) {
                if (v.RelationType == "S" || v.RelationType == "SPO" || v.RelationType == "F" || v.RelationType == "M" || v.RelationType == "FIL" || v.RelationType == "MIL") {
                    aC.showCrossSell = true;
                }
            })
            
            if (aC.activCareQuoteDetails.PolicyType == "FF") {
                if (aC.selectedMember[0].SumInsured > aC.selectedMember[1].SumInsured) {
                    aC.selectedMember[1].SumInsured = aC.selectedMember[0].SumInsured;
                    aC.sumInusred = aC.selectedMember[1].SumInsured;
                } else if (aC.selectedMember[0].SumInsured < aC.selectedMember[1].SumInsured) {
                    aC.selectedMember[0].SumInsured = aC.selectedMember[1].SumInsured;
                    aC.sumInusred = aC.selectedMember[0].SumInsured;
                }
            }

            for (var i = 0; i < aC.selectedMember.length; i++) { 
                aC.selectedMember[i]["Vaccine_Cover_SI"] = (aC.selectedMember[i]["Vaccine_Cover_SI"] == "--Select--") ? '' : aC.selectedMember[i]["Vaccine_Cover_SI"];
            }

            var acPreminumObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "AC": {
                    "PlanType": aC.activCareQuoteDetails.PlanType,
                    "PolicyTenure": aC.activCareQuoteDetails.PolicyTenure,
                    "PolicyType": aC.activCareQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "EMPD": aC.activCareQuoteDetails.EMPD,
                    "AFFD": aC.activCareQuoteDetails.AFFD,
                    "FAMD": aC.activCareQuoteDetails.FAMD,
                    "MemberDetails": aC.selectedMember
                }
            }

            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", acPreminumObj, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        aC.activCarePreminumObj.TotalPremium = 0
                        aC.activCarePreminumObj.TotalPremium = data.ResponseData.TotalPremium;
                        aC.activCarePreminumObj.ProductPremium = data.ResponseData.ProductPremium
                        aC.PremiumDetail = data.ResponseData
                        aC.activCarePreminumObj.AddonGSTPremium = data.ResponseData.AddonGSTPremium;
                        aC.fetchPremiumsSecondary()
                        for (var i = 0; i < aC.selectedMember.length; i++) {
                                if (aC.selectedMember[i].QNH == "N") {
                                    aC.QNH = 'N';
                                }
                                if (aC.selectedMember[i].LSE == "N") {
                                    aC.LSE = 'N';
                                }
                                if (aC.selectedMember[i].PME == "N") {
                                    aC.PME = 'N';
                                }
                                if (aC.selectedMember[i].AHC == "N") {
                                    aC.AHC = 'N';
                                }
                                if (aC.selectedMember[i].ARU == "N") {
                                    aC.ARU = 'N';
                                }
                                if (aC.selectedMember[i].PPN == "N") {
                                    aC.PPN = 'N';
                                }
                            }
                        for (var i = 0; i < aC.PremiumDetail.ProductPremium.length; i++) {
                            aC.PremiumDetail.TotalPremium = parseInt(aC.PremiumDetail.TotalPremium) + parseInt(aC.PremiumDetail.ProductPremium[i].Premium);
                            if (aC.PremiumDetail.ProductPremium[i].ProductCode == 'PA') {
                                aC.paActPremium = aC.PremiumDetail.ProductPremium[i].Premium;
                            } else if (aC.PremiumDetail.ProductPremium[i].ProductCode == 'CI') {
                                aC.ciActPremium = aC.PremiumDetail.ProductPremium[i].Premium;
                            } else if (aC.PremiumDetail.ProductPremium[i].ProductCode == 'CS') {
                                aC.csActPremium = aC.PremiumDetail.ProductPremium[i].Premium;
                            }
                        }

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
                }, function(err) {});
        }

    /* updated the Preminum value Ends*/


    /* Update Tenure */

        aC.updateTenure = function(tenure) {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateTenure", {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "Tenure": tenure
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        aC.activCareQuoteDetails.PolicyTenure = tenure;
                        aC.updatePreminum();
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
                }, function(err) {});
        }

    /* Update Tenure Ends*/


    /* To open add member modal */

        aC.openAddMemberModel = function() {
            aC.activCareFamilyMapping();
            $('#change-group-member').modal({
                backdrop: 'static',
                keyboard: false
            });
        }

    /* End of opening add member modal */
    

    /* Delete Member onQuote */

        aC.updateDeleteMemebers = function(op , member , $index){
            if(aC.activCareQuoteDetails.PolicyType == "MI"){
                if(parseInt(member.Age) > 80 || parseInt(member.Age) < 55){
                    $rootScope.alertConfiguration('E', " Age can not be greater then 80 or less than 55 ");
                    member.Age = aC.aCSelectedMembers[$index].Age;
                    $rootScope.$apply();
                    return false; 
                }
            }
            else{
                if(parseInt(member.Age) > 80 || parseInt(member.Age) < 18){
                    $rootScope.alertConfiguration('E', " Age can not be greater then 80 or less than 18 ");
                    member.Age = aC.aCSelectedMembers[$index].Age;
                    $rootScope.$apply();
                    return false; 
                }
            }

            
            if(op == "UpdateMember"){
                for(var i =0 ; i < aC.selectedMember.length ; i++){
                    aC.aCSelectedMembers[i].Age = aC.selectedMember[i].Age;
                }
            }else if(op == "DeleteMember" && aC.selectedMember.length == 2){
                angular.forEach(aC.activeCareFamilyContruct , function(v, i){
                    if(v.RelationType == member.RelationType){
                        v.isSelected = false;
                    }
                })
                angular.forEach(aC.aCSelectedMembers , function(v , i){
                    if(v.RelationType == member.RelationType){
                       v.Age = "";
                       delete v.isAlreadyPresent
                       aC.aCSelectedMembers.splice(i ,1);
                   }
                })
            }
            aC.acValidations();
        }

    /* Delete Member on Quote ends */   


    /* Modify Optional Care cover Benefits */

        aC.oCBMemberLevel = function(param, val, coverName) {
            var anyMemberIsPresent = false;
            if (val == 'Y') {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    if (aC.selectedMember[i].RelationWithProposer == param.RelationWithProposer) {
                        aC.selectedMember[i][coverName] = val
                    }
                }
                aC[coverName] = 'Y'
            } else {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    if (aC.selectedMember[i].RelationWithProposer == param.RelationWithProposer) {
                        aC.selectedMember[i][coverName] = val
                    }
                }
                angular.forEach(aC.selectedMember, function(v, i) {
                    if (v[coverName] == 'Y')
                        anyMemberIsPresent = true;
                })
                if (anyMemberIsPresent) {
                    aC[coverName] = 'Y'
                } else {
                    aC[coverName] = 'N'
                }
            }
            aC.updatePreminum();
        }

        aC.vaccineCoverMemberLevel = function(param, val, siAmount, coverName) {
            var anyMemberIsPresent = false;
            val = (siAmount > 0) ? 'Y' : 'N';
            
            if (val == 'Y') {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    if (aC.selectedMember[i].RelationType == param.RelationType ) {
                        aC.selectedMember[i][coverName] = val
                        aC.selectedMember[i]["Vaccine_Cover_SI"] = siAmount
                    }
                }
                aC[coverName] = 'Y'
            } else {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    if (aC.selectedMember[i].RelationType == param.RelationType) {
                        aC.selectedMember[i][coverName] = val
                        aC.selectedMember[i]["Vaccine_Cover_SI"] = siAmount
                    }
                }
                angular.forEach(aC.selectedMember, function(v, i) {
                    if (v[coverName] == 'Y')
                        anyMemberIsPresent = true;
                })
                if (anyMemberIsPresent) {
                    aC[coverName] = 'Y'
                } else {
                    aC[coverName] = 'N'
                }
            }
            aC.updatePreminum();
        }

    /* Modify Optional Care cover Benefits Ends*/


    /* Modify Optional care Benefits at Product Level */

        aC.vaccineCoverProductLevel = function(param, coverName , $event) {
            console.log(param)
            if (param == 'N') {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    aC.selectedMember[i][coverName] = 'N'
                    aC.selectedMember[i]["Vaccine_Cover_SI"] = '--Select--'
                }
                aC[coverName] = 'N'
            }
            if (param == 'Y') {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    aC.selectedMember[i][coverName] = 'Y'
                    aC.selectedMember[i]["Vaccine_Cover_SI"] = '1000'
                }
                aC[coverName] = 'Y'
            }   
            aC.updatePreminum();
        }

        aC.oCBProductLevel = function(param, coverName , $event) {
            /*console.log(event.keyCode)
            if(event.keyCode == 32){
                return false ;
            }*/
            if (param == 'Y') {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    aC.selectedMember[i][coverName] = 'Y'
                }
                aC[coverName] = 'Y'
            } else {
                for (var i = 0; i < aC.selectedMember.length; i++) {
                    aC.selectedMember[i][coverName] = 'N'
                }
            }
            aC.updatePreminum()
            
        }

    /* Modify Optional care Benefits at Product Level Ends*/


    /* Submit Activ Care Quote */

        aC.submitActivCareQuote = function(event) {
            for(var  i = 0  ; i < aC.selectedMember.length ; i++){
                if(aC.selectedMember[i].Age > 80){
                    $rootScope.alertConfiguration('E', "Age of "+aC.selectedMember[i].RelationWithProposer + " cannot be greater than 80");
                        $rootScope.$apply();
                        return false;
                }
            }
            event.target.disabled = false;
            event.target.innerText = "Proceed";
            console.log(aC.selectedMember);
            var acSubmitQuoteObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "ACUpdateQuote": {
                    "PolicyType": aC.activCareQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "EMPD": aC.activCareQuoteDetails.EMPD,
                    "AFFD": aC.activCareQuoteDetails.AFFD,
                    "FAMD": aC.activCareQuoteDetails.FAMD,
                    "MemberDetails": aC.selectedMember
                }
            }

            var lemniskObjPass = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "ACUpdateQuote": {
                    "PolicyType": aC.activCareQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "preminumObj" : aC.activCarePreminumObj.TotalPremium , 
                    "EMPD": aC.activCareQuoteDetails.EMPD,
                    "AFFD": aC.activCareQuoteDetails.AFFD,
                    "FAMD": aC.activCareQuoteDetails.FAMD,
                    "MemberDetails": aC.selectedMember
                }
            }
            
            var lemeiskData   = lemniskObjPass
            
            $rootScope.leminiskObj =  lemeiskData
            
            $rootScope.lemniskCodeExcute($location.$$path);

            var lemniskObj = { 
                "Selected Members":aC.selectedMember, 
                "PlanName": aC.planName, 
                "PolicyTenure": aC.activCarePreminumObj.PolicyTenure, 
                "PolicyType": aC.activCarePreminumObj.PolicyType,
                "Premium Amount":aC.activCarePreminumObj.TotalPremium
            };
            $rootScope.lemniskTrack("","", lemniskObj);
            
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", acSubmitQuoteObj, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {

                if (response.ResponseCode == 1) {
                    if (aC.crossSell) {
                         if(aC.CI == 'Y'){
                            aC.productSelctedInCross = aC.productSelctedInCross+'-CI'
                        }if(aC.PA == 'Y'){
                             aC.productSelctedInCross = aC.productSelctedInCross+'-PA'
                        }if(aC.CS == 'Y'){
                             aC.productSelctedInCross = aC.productSelctedInCross+'-CS'
                        }
                        sessionStorage.setItem('productSelctedInCross' ,  aC.productSelctedInCross)
                        $location.url('cross-sell-proposer-details?products='+ aC.productSelctedInCross);
                    } else {
                        $location.url('activ-care-proposer-details');
                    }
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

            }, function(err) {
                event.target.disabled = false;
                event.target.innerText = "Proceed";
            });
        }

    /* Submit Activ Care Quote */

}])