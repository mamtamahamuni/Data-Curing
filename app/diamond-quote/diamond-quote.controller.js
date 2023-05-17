var diaApp = angular.module("diQuoteApp", []);

diaApp.controller("diQuoteApp", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$q', '$sessionStorage', function ($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $q, $sessionStorage) {

    /* Data Inilization */

    var diA = this;
    var aS = appService;
    diA.plantp = "fal"
    diA.planName = "diamond";
    diA.productType = "diamond";
    diA.validForm = true;
    diA.productSelctedInCross = 'DI'
    var planNameArray = ["Standard", "Classic", "Premier"]
    var goingOn = false;
    diA.showCrossSell = false;
    diA.stProduct = false;
    var insuredMemberDetails;
    diA.roomUpgradeText = "";
    diA.sumInusred = "";
    diA.roomUpgradeFlag = false;
    diA.initSlider = false;
    diA.showHDFCCovers = false;
    diA.selectedMember = [];
    diA.tempUNSelectedMembersForTwo = []
    diA.tempUNSelectedMembers = [];
    diA.showRoomUpgrade = false;

    diA.vaccineAmount = ['--Select--', 500, 750, 1000];
    diA.ReductionInPEDWaitingPeriodText = '--Select--';
    diA.ReductionInPEDWaitingPeriodOptions = [
        { RPEDWPId: 3, RPEDWPText: "3 Yrs to 2 Yrs", RPEDWPModel: "Reduction_3Yrs_to_2Yrs_YN", RPEDWPCoverName: "Reduction_3Yrs_to_2Yrs_YN", value: 'Y' },
        { RPEDWPId: 4, RPEDWPText: "3 Yrs to 1 Yr", RPEDWPModel: "Reduction_3Yrs_to_1Yrs_YN", RPEDWPCoverName: "Reduction_3Yrs_to_1Yrs_YN", value: 'Y' }
    ];
    diA.VaccineCoverOptions = ["Rs.500 / Insured Person / Per Policy Year", "Rs.750 / Insured Person / Per Policy Year", "Rs.1000 / Insured Person / Per Policy Year"];


    /* End of data inilization */
    const FEDIMDCODE = "2111987";  //2113805
    function isFederalPasa() {
        diA.isFederalPasa = sessionStorage.getItem('imdCode') === FEDIMDCODE ? true : false;
    }

    isFederalPasa();


    const IDFCIMDCODE = "2115779";
    function isIDFCPasa() {
        diA.isIDFCPasa =  sessionStorage.getItem('imdCode') === IDFCIMDCODE ? true : false;
    }
    isIDFCPasa();

    function loadOwlCarousel() {
        diA.initSlider = true;
        $timeout(function () {
            $(".di-carousel").owlCarousel({
                items: 2,
                navigation: true,
                navigationText: ["", ""],
            });
        }, 300);
    }

    $(document).ready(function () {

        $('.show-answer').on('click', function () {

            var onlyKidsPresent = true;
            if (diA.selectedMember.length == 1 && !diA.stProduct) {
                $rootScope.alertConfiguration('E', "Family floater is only applicable for two members ");
                $rootScope.$apply();
                return false;
            }
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].RelationWithProposer != 'KID') {
                    onlyKidsPresent = false;
                }
            }
            if (onlyKidsPresent) {
                $rootScope.alertConfiguration('E', "Family floater is only applicable in case one adult should be present with the kids ");
                $rootScope.$apply();
                return false;
            }

            var deletememberedArray = [];

            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].RelationWithProposer == "FATHER" || diA.selectedMember[i].RelationWithProposer == "MOTHER" || diA.selectedMember[i].RelationWithProposer == "FATHER-IN-LAW" || diA.selectedMember[i].RelationWithProposer == "MOTHER-IN-LAW" || diA.selectedMember[i].RelationWithProposer == "BROTHER" || diA.selectedMember[i].RelationWithProposer == "SISTER" || diA.selectedMember[i].RelationWithProposer == "GRANDFATHER" || diA.selectedMember[i].RelationWithProposer == "GRANDMOTHER" || diA.selectedMember[i].RelationWithProposer == "GRANDSON" || diA.selectedMember[i].RelationWithProposer == "GRANDDAUGHTER" || diA.selectedMember[i].RelationWithProposer == "SON-IN-LAW" || diA.selectedMember[i].RelationWithProposer == "DAUGHTER-IN-LAW" || diA.selectedMember[i].RelationWithProposer == "BROTHER-IN-LAW" || diA.selectedMember[i].RelationWithProposer == "SISTER-IN-LAW" || diA.selectedMember[i].RelationWithProposer == "NEPHEW" || diA.selectedMember[i].RelationWithProposer == "NIECE") {

                    deletememberedArray.push(diA.selectedMember[i])
                    // mainMemberArrayCopy.splice(i ,1)

                }
            }

            if (deletememberedArray.length > 0) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "Invalid family construct. </br> Self Spouse and Kids are only allowed",
                    "showCancelBtn": false,
                    "gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                    "gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
                    "gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                    "modalSuccessText": "Ok",
                    "showAlertModal": true
                }
                $rootScope.$apply();
                return false;
            }
            diA.diamondQuoteDetails.PolicyType = "FF"
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].COVER_ARU_FLAG == "Y") {
                    diA.oCBProductLevel('Y', 'COVER_ARU_FLAG')
                }
                if (diA.selectedMember[i].COVER_RPEP_FLAG == "Y") {
                    diA.oCBProductLevel('Y', 'COVER_RPEP_FLAG')
                }
                if (diA.selectedMember[i].LSE == "Y") {
                    diA.oCBProductLevel('Y', 'LSE')
                }
                if (diA.selectedMember[i].COVER_CHB_FLAG == "Y") {
                    diA.oCBProductLevel('Y', 'COVER_CHB_FLAG')
                }
                if (diA.selectedMember[i].COVER_SNCB_FLAG == "Y") {
                    diA.oCBProductLevel('Y', 'COVER_SNCB_FLAG')
                }
                if (diA.selectedMember[i].COVER_URSI_FLAG == "Y") {
                    diA.oCBProductLevel('Y', 'COVER_URSI_FLAG')
                }

                /* Health Add On */
                if (diA.selectedMember[i].Future_Secure_YN == 'Y') {
                    diA.oCBProductLevel('Y', 'Future_Secure_YN');
                }
                if (diA.selectedMember[i].CancerHospitalizationBooster == 'Y') {
                    diA.oCBProductLevel('Y', 'CancerHospitalizationBooster');
                }
                if (diA.selectedMember[i].ReductionInPEDWaitingPeriod == 'Y') {
                    diA.oCBProductLevel('Y', 'ReductionInPEDWaitingPeriod');
                }
                if (diA.selectedMember[i].Vaccine_Cover_YN == 'Y') {
                    diA.oCBProductLevel('Y', 'Vaccine_Cover_YN');
                }
                if (diA.selectedMember[i].Tele_OPD_consultation_YN == 'Y') {
                    diA.oCBProductLevel('Y', 'Tele_OPD_consultation_YN');
                }
            }
            loadOwlCarousel();
            diA.updatePreminum();
        });

        $('.hide-answer').on('click', function () {
            diA.diamondQuoteDetails.PolicyType = "MI"
            /*if (diA.selectedMember.length == 2) {
                for (var i = 0; i < diA.selectedMember.length; i++) {
                    if (diA.selectedMember[i].Age < 55) {
                        diA.diamondQuoteDetails.PolicyType = "FF"
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
            }*/

            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].COVER_RPEP_FLAG == "Y") {
                    diA.COVER_RPEP_FLAG = 'Y';
                }
                if (diA.selectedMember[i].LSE == "Y") {
                    diA.LSE = 'Y';
                }
                if (diA.selectedMember[i].COVER_CHB_FLAG == "Y") {
                    diA.COVER_CHB_FLAG = 'Y';
                }
                if (diA.selectedMember[i].COVER_SNCB_FLAG == "Y") {
                    diA.COVER_SNCB_FLAG = 'Y';
                }
                if (diA.selectedMember[i].COVER_ARU_FLAG == "Y") {
                    diA.COVER_ARU_FLAG = 'Y';
                }
                if (diA.selectedMember[i].COVER_URSI_FLAG == "Y") {
                    diA.COVER_URSI_FLAG = 'Y';
                }

                /* Health Add On */
                if (diA.selectedMember[i].Future_Secure_YN == 'Y') {
                    diA.Future_Secure_YN = 'Y';
                }
                if (diA.selectedMember[i].CancerHospitalizationBooster == 'Y') {
                    diA.CancerHospitalizationBooster = 'Y';
                }
                if (diA.selectedMember[i].ReductionInPEDWaitingPeriod == 'Y') {
                    diA.ReductionInPEDWaitingPeriod = 'Y';
                }
                if (diA.selectedMember[i].Vaccine_Cover_YN == 'Y') {
                    diA.Vaccine_Cover_YN = 'Y';
                }
                if (diA.selectedMember[i].Tele_OPD_consultation_YN == 'Y') {
                    diA.Tele_OPD_consultation_YN = 'Y';
                }
            }
            loadOwlCarousel();
            diA.updatePreminum()

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
            diA.intitalACMemberList = data.ResponseData;
            diA.activeCareFamilyContruct = data.ResponseData;
            fetchQuoteDetails();
        }, function (err) { })

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
                    diA.diamondQuoteDetails = data.ResponseData.DiamondQuote;
                    diA.diamondDetail = data.ResponseData;
                    diA.IMDCode = diA.diamondDetail.DiamondQuote.IMDCode;
                    $rootScope.leminiskObj = data.ResponseData;
                    $rootScope.lemniskCodeExcute();
                    diA.diamondPreminumObj = data.ResponseData.PremiumDetail;
                    diA.selectedMember = diA.diamondQuoteDetails.MemberDetails;
                    var planNameInt = parseInt(diA.diamondQuoteDetails.PlanType);
                    /*sumam*/

                    if (data.ResponseData.Source == 'DNC_HDFC_Affiliate_Discount' || data.ResponseData.Source == 'DNC_HDFC_SECURITIES') {
                        diA.showHDFCCovers = true;
                    }
                    diA.planNameVal = planNameArray[planNameInt - 1];
                    if (data.ResponseData.STQuote) {
                        diA.stQuote = data.ResponseData.STQuote;
                        diA.stProduct = true
                        diA.showRoomUpgrade = true;
                        if (diA.stQuote.PolicyType == 'MI') {
                            for (var i = 0; i < diA.stQuote.MemberDetails.length; i++) {
                                diA.stQuote.SumInsured = diA.stQuote.MemberDetails[i].SumInsured;
                                diA.stQuote.Deductible = diA.stQuote.MemberDetails[i].Deductible;

                            }
                        }

                        diA.diamondQuoteDetails.PolicyType = 'FF';



                    }
                    else {
                        diA.stProduct = false;
                    }
                    if (diA.diamondQuoteDetails.PolicyType == "FF") {
                        $timeout(function () {
                            angular.element('.show-answer').triggerHandler('click');
                        }, 0);
                        diA.sumInusred = diA.diamondQuoteDetails.MemberDetails[0].SumInsured;
                        for (var j = 0; j < diA.diamondQuoteDetails.MemberDetails.length; j++) {
                            diA.diamondQuoteDetails.MemberDetails[j]
                            if (diA.diamondQuoteDetails.MemberDetails[j].SumInsured > diA.sumInusred) {
                                diA.sumInusred = diA.diamondQuoteDetails.MemberDetails[j].SumInsured
                            }

                            /* Health Add On */
                            if (diA.diamondQuoteDetails.MemberDetails[j].Future_Secure_YN == 'Y') {
                                diA.Future_Secure_YN = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].CancerHospitalizationBooster == 'Y') {
                                diA.CancerHospitalizationBooster = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].ReductionInPEDWaitingPeriod == 'Y') {
                                diA.ReductionInPEDWaitingPeriod = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].Vaccine_Cover_YN == 'Y') {
                                diA.Vaccine_Cover_YN = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].Tele_OPD_consultation_YN == 'Y') {
                                diA.Tele_OPD_consultation_YN = 'Y';
                            }
                        }
                    } else {
                        $timeout(function () {
                            angular.element('.hide-answer').triggerHandler('click');
                        }, 0);
                        diA.sumInusred = diA.diamondQuoteDetails.MemberDetails[0].SumInsured;
                        for (var j = 0; j < diA.diamondQuoteDetails.MemberDetails.length; j++) {
                            if (diA.diamondQuoteDetails.MemberDetails[j].SumInsured > diA.sumInusred) {
                                diA.sumInusred = diA.diamondQuoteDetails.MemberDetails[j].SumInsured
                            }

                            /* Health Add On */
                            if (diA.diamondQuoteDetails.MemberDetails[j].Future_Secure_YN == 'Y') {
                                diA.Future_Secure_YN = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].CancerHospitalizationBooster == 'Y') {
                                diA.CancerHospitalizationBooster = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].ReductionInPEDWaitingPeriod == 'Y') {
                                diA.ReductionInPEDWaitingPeriod = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].Vaccine_Cover_YN == 'Y') {
                                diA.Vaccine_Cover_YN = 'Y';
                            }
                            if (diA.diamondQuoteDetails.MemberDetails[j].Tele_OPD_consultation_YN == 'Y') {
                                diA.Tele_OPD_consultation_YN = 'Y';
                            }
                        }
                    }




                    loadOwlCarousel();
                    diA.fetchInsuredMembers()

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

    function getSumAmountInRange(sumAmount, min, max) {
        min = Number(min);
        max = Number(max);
        console.log(`filtering sum amount in range`)
        console.log(`${min} = ${max}`)
        let filteredRange = sumAmount.filter((item) => (item.amount <= max && item.amount >= min));

        return filteredRange;
    }

    aS.getData("assets/data/sum-insured.json", "", false, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            if (data.ResponseCode == 1) {
                if(diA.isIDFCPasa) {
                    let minSi = 1000000;
                    let idfcSI = sessionStorage.getItem('idfcSI');
                    diA.sumAmounts = getSumAmountInRange(data.ResponseData,1000000, idfcSI )
                }  else {
                    diA.sumAmounts = data.ResponseData;
                }
            }          
        }, function (err) {

        })

    /* End of fetching sum insured data */





    /* updated the Sum insured value */

    diA.updateSumInsured = function (param, membersObj) {
        if (membersObj != "") {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].RelationType == membersObj.RelationType) {
                    diA.selectedMember[i].SumInsured = param;
                }
            }
        } else {
            diA.sumInusred = param
            for (var i = 0; i < diA.selectedMember.length; i++) {
                diA.selectedMember[i].SumInsured = param;
            }
        }

        for (var i = 0; i < diA.selectedMember.length; i++) {
            if (diA.selectedMember[i].COVER_ARU_FLAG == 'Y' && diA.selectedMember[i].SumInsured != '500000') {
                diA.selectedMember[i].COVER_ARU_FLAG = 'N'
            }
        }
        diA.updatePreminum()
    }

    /* updated the Sum insured value Ends */



    /* update Super top UP sum insured */
    diA.updateSumInsuredDeductable = function (diSumInsured, stSumInsured, stDeductible) {
        for (var i = 0; i < diA.stQuote.MemberDetails.length; i++) {
            diA.stQuote.MemberDetails[i].SumInsured = stSumInsured;
        }

        diA.sumInusred = diSumInsured;
        diA.stQuote.SumInsured = stSumInsured;
        diA.stQuote.Deductible = stDeductible;

        diA.updatePreminum()
    }
    /* update Super top up sum insured ends */


    /* calculate preminum */

    diA.calculatePremium = function () {
        diA.updatePreminum();
    }

    /* calculate preminum Endsd*/


    /* updated the Preminum value */

    diA.updatePreminum = function () {
        angular.forEach(diA.selectedMember, function (v, i) {
            if (v.RelationType == "S" || v.RelationType == "SPO" || v.RelationType == "F" || v.RelationType == "M" || v.RelationType == "FIL" || v.RelationType == "MIL") {
                diA.showCrossSell = true;
            }
        })
        if (diA.diamondQuoteDetails.PolicyType == "FF" && diA.selectedMember.length > 1) {
            if (diA.selectedMember[0].SumInsured > diA.selectedMember[1].SumInsured) {
                diA.selectedMember[1].SumInsured = diA.selectedMember[0].SumInsured;
                diA.sumInusred = diA.selectedMember[1].SumInsured;
            } else if (diA.selectedMember[0].SumInsured < diA.selectedMember[1].SumInsured) {
                diA.selectedMember[0].SumInsured = diA.selectedMember[1].SumInsured;
                diA.sumInusred = diA.selectedMember[0].SumInsured;
            }
        }
        else if (diA.diamondQuoteDetails.PolicyType == "FF" && diA.selectedMember.length == 1) {
            diA.sumInusred = diA.selectedMember[0].SumInsured;
        }
        if (diA.stProduct) {
            var diPreminumObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "Diamond": {
                    "PlanType": diA.diamondQuoteDetails.PlanType,
                    "PolicyTenure": diA.diamondQuoteDetails.PolicyTenure,
                    "PolicyType": diA.diamondQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "EMPD": diA.diamondQuoteDetails.EMPD,
                    "AFFD": diA.diamondQuoteDetails.AFFD,
                    "FAMD": diA.diamondQuoteDetails.FAMD,
                    "MemberDetails": diA.selectedMember
                },
                "ST": diA.stQuote
            }
        }
        else {
            var diPreminumObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "Diamond": {
                    "PlanType": diA.diamondQuoteDetails.PlanType,
                    "PolicyTenure": diA.diamondQuoteDetails.PolicyTenure,
                    "PolicyType": diA.diamondQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "EMPD": diA.diamondQuoteDetails.EMPD,
                    "AFFD": diA.diamondQuoteDetails.AFFD,
                    "FAMD": diA.diamondQuoteDetails.FAMD,
                    "MemberDetails": diA.selectedMember
                }

            }

        }


        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", diPreminumObj, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    diA.diamondPreminumObj.TotalPremium = 0
                    diA.diamondPreminumObj.TotalPremium = Math.round(data.ResponseData.TotalPremium);
                    diA.diamondPreminumObj.ProductPremium = data.ResponseData.ProductPremium

                    data.ResponseData.AddonGSTPremium = Math.round(data.ResponseData.AddonGSTPremium);
                    diA.PremiumDetail = data.ResponseData

                    diA.fetchPremiumsSecondary()
                    for (var i = 0; i < diA.selectedMember.length; i++) {
                        if (diA.selectedMember[i].COVER_RPEP_FLAG == "N") {
                            diA.COVER_RPEP_FLAG = 'N';
                        }
                        if (diA.selectedMember[i].LSE == "N") {
                            diA.LSE = 'N';
                        }
                        if (diA.selectedMember[i].COVER_CHB_FLAG == "N") {
                            diA.COVER_CHB_FLAG = 'N';
                        }
                        if (diA.selectedMember[i].COVER_SNCB_FLAG == "N") {
                            diA.COVER_SNCB_FLAG = 'N';
                        }
                        if (diA.selectedMember[i].COVER_ARU_FLAG == "N") {
                            diA.COVER_ARU_FLAG = 'N';
                        }
                        if (diA.selectedMember[i].COVER_URSI_FLAG == "N") {
                            diA.COVER_URSI_FLAG = 'N';
                        }
                    }
                    for (var i = 0; i < diA.PremiumDetail.ProductPremium.length; i++) {
                        diA.PremiumDetail.TotalPremium = parseInt(diA.PremiumDetail.TotalPremium) + parseInt(diA.PremiumDetail.ProductPremium[i].Premium);
                        if (diA.PremiumDetail.ProductPremium[i].ProductCode == 'PA') {
                            diA.paActPremium = diA.PremiumDetail.ProductPremium[i].Premium;
                        } else if (diA.PremiumDetail.ProductPremium[i].ProductCode == 'CI') {
                            diA.ciActPremium = diA.PremiumDetail.ProductPremium[i].Premium;
                        } else if (diA.PremiumDetail.ProductPremium[i].ProductCode == 'CS') {
                            diA.csActPremium = diA.PremiumDetail.ProductPremium[i].Premium;
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
            }, function (err) { });
    }

    /* updated the Preminum value Ends*/


    /* Update Tenure */

    diA.updateTenure = function (tenure) {
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateTenure", {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Tenure": tenure
        }, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    diA.diamondQuoteDetails.PolicyTenure = tenure;
                    if (diA.stProduct) {
                        diA.stQuote.PolicyTenure = tenure;
                    }

                    diA.updatePreminum();
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
            }, function (err) { });
    }

    /* Update Tenure Ends*/


    /* To open add member modal */

    diA.openAddMemberModel = function () {
        //diA.activCareFamilyMapping();
        $('#add-new-member-web').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    /* End of opening add member modal */


    /* Update soft details data */

    diA.updateSoftDetails = function (op, insuredDetail, index) {

        if (op == 'AddMember') {
            diA.initSlider = false;
            var stObject = angular.copy(insuredDetail)
            if (diA.diamondQuoteDetails.PolicyType == "FF") {
                insuredDetail.SumInsured = diA.sumInusred;

            }
            else {
                insuredDetail.SumInsured = diA.selectedMember[0].SumInsured
            }

            insuredDetail.COVER_ARU_FLAG = diA.selectedMember[0].COVER_ARU_FLAG;
            insuredDetail.COVER_RPEP_FLAG = diA.selectedMember[0].COVER_RPEP_FLAG;

            insuredDetail.COVER_URSI_FLAG = diA.selectedMember[0].COVER_URSI_FLAG;
            insuredDetail.COVER_URSI_SI = diA.selectedMember[0].COVER_URSI_SI;

            insuredDetail.COVER_SNCB_FLAG = diA.selectedMember[0].COVER_SNCB_FLAG;
            insuredDetail.COVER_SNCB_SI = diA.selectedMember[0].COVER_SNCB_SI;

            insuredDetail.COVER_AHB_FLAG = diA.selectedMember[0].COVER_AHB_FLAG;
            insuredDetail.COVER_AHB_SI = diA.selectedMember[0].COVER_AHB_SI;

            insuredDetail.COVER_CHB_FLAG = diA.selectedMember[0].COVER_CHB_FLAG;
            insuredDetail.COVER_CHB_SI = diA.selectedMember[0].COVER_CHB_SI;


            //insuredDetail.COVER_SNCB_SI = diA.selectedMember[0].COVER_SNCB_SI;

            diA.selectedMember.push(insuredDetail)

            if (diA.stProduct) {
                delete insuredDetail.ProductCode
                stObject.SumInsured = diA.stQuote.SumInsured;
                stObject.Deductible = diA.stQuote.Deductible;
                stObject.ProductCode = "ST"
                appService.postData(ABHI_CONFIG.apiUrl + "GEN/" + op, {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "InsuredDetail": stObject
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (data) {
                    //delete insuredDetail.ProductCode

                    diA.stQuote.MemberDetails.push(stObject)

                    diA.calculatePremium();
                    $timeout(function () {
                        loadOwlCarousel();
                    }, 300);


                })
                if (diA.selectedMember.length >= 1) {
                    diA.stQuote.PolicyType = "FF";
                    diA.diamondQuoteDetails.PolicyType = "FF";
                }


            }
            else {
                diA.calculatePremium();
                $timeout(function () {
                    loadOwlCarousel();
                }, 300);
            }



        }
        if (op == 'UpdateMember' || (op == 'DeleteMember' && insuredDetail.RelationWithProposer != 'KID')) {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (op == 'UpdateMember' && insuredDetail.RelationType == diA.selectedMember[i].RelationType) {
                    diA.selectedMember[i].Age = insuredDetail.Age
                    diA.stQuote ? diA.stQuote.MemberDetails[i].Age = insuredDetail.Age : null;
                }
                else if (op == 'DeleteMember' && insuredDetail.RelationType == diA.selectedMember[i].RelationType) {
                    diA.selectedMember.splice(i, 1)
                    if (diA.stProduct) {
                        diA.stQuote.MemberDetails.splice(i, 1)
                    }

                    diA.initSlider = false;
                }
            }
            if (diA.selectedMember.length == 1) {
                diA.diamondQuoteDetails.PolicyType = "MI";
                if (diA.stProduct) {

                    diA.diamondQuoteDetails.PolicyType = "FF";

                }

            }

            diA.calculatePremium();
            $timeout(function () {
                loadOwlCarousel();
            }, 300);
        }
        if (op == 'DeleteMember' && insuredDetail.RelationWithProposer == 'KID') {
            diA.initSlider = false;
            fetchQuoteDetails();
        }
        diA.fetchInsuredMembers();

    }

    /* End of updating soft details data */


    /* Delete Member onQuote */

    diA.updateDeleteMemebers = function (op, member, ind) {
        $rootScope.callGtag('click-icon-x', 'quote', 'diamond-quote_plan_delete-member');
        if (diA.selectedMember.length == 1 && op == 'deleteMember') {
            $rootScope.alertConfiguration('E', "You cannot delete this member.", "delete_member_alert");
            return false;
        }
        for (var i = 0; i < diA.selectedMember.length; i++) {
            if (member.RelationType == diA.selectedMember[i].RelationType) {
                diA.selectedMember[i].ProductCode = 'DI';
                if (op == 'UpdateMember') {
                    diA.previousAge = diA.membersDetails[i + 1].Age
                    diA.membersDetails[i + 1].Age = diA.selectedMember[i].Age
                    diA.addUpdateMember(member, ind, diA.previousAge)
                } else {
                    diA.deleteMember(diA.selectedMember[i], ind);
                }

                break;
            }
        }
    }

    /* Delete Member on Quote ends */


    /* Modify Optional Care cover Benefits */

    diA.oCBMemberLevel = function (param, val, coverName) {
        var anyMemberIsPresent = false;

        if (val == 'Y') {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].RelationType == param.RelationType) {
                    diA.selectedMember[i][coverName] = val
                }
            }
            diA[coverName] = 'Y'
        } else {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].RelationType == param.RelationType) {
                    diA.selectedMember[i][coverName] = val
                }
            }
            angular.forEach(diA.selectedMember, function (v, i) {
                if (v[coverName] == 'Y')
                    anyMemberIsPresent = true;
            })
            if (anyMemberIsPresent) {
                diA[coverName] = 'Y'
            } else {
                diA[coverName] = 'N'
            }
        }
        diA.updatePreminum();
    }

    diA.vaccineCoverMemberLevel = function (param, val, siAmount, coverName) {
        var anyMemberIsPresent = false;
        val = (siAmount > 0) ? 'Y' : 'N';

        if (val == 'Y') {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].RelationType == param.RelationType) {
                    diA.selectedMember[i][coverName] = val
                    diA.selectedMember[i]["Vaccine_Cover_SI"] = siAmount
                }
            }
            diA[coverName] = 'Y'
        } else {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (diA.selectedMember[i].RelationType == param.RelationType) {
                    diA.selectedMember[i][coverName] = val
                    diA.selectedMember[i]["Vaccine_Cover_SI"] = siAmount
                }
            }
            angular.forEach(diA.selectedMember, function (v, i) {
                if (v[coverName] == 'Y')
                    anyMemberIsPresent = true;
            })
            if (anyMemberIsPresent) {
                diA[coverName] = 'Y'
            } else {
                diA[coverName] = 'N'
            }
        }
        diA.updatePreminum();
    }

    /* Modify Optional Care cover Benefits Ends*/


    /* Modify Optional care Benefits at Product Level */

    diA.vaccineCoverProductLevel = function (param, coverName, $event) {
        console.log(param)
        if (param == 'N') {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                diA.selectedMember[i][coverName] = 'N'
                diA.selectedMember[i]["Vaccine_Cover_SI"] = '--Select--'
            }
            diA[coverName] = 'N'
        }
        if (param == 'Y') {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                diA.selectedMember[i][coverName] = 'Y'
                diA.selectedMember[i]["Vaccine_Cover_SI"] = '1000'
            }
            diA[coverName] = 'Y'
        }
        diA.updatePreminum();
    }

    diA.oCBProductLevel = function (param, coverName, $event) {
        /*console.log(event.keyCode)
        if(event.keyCode == 32){
            return false ;
        }*/
        if (coverName == 'COVER_ARU_FLAG' && param == 'Y' && diA.sumInusred != '500000' && diA.diamondQuoteDetails.PolicyType == 'FF') {
            diA[coverName] = 'N'
            $rootScope.alertConfiguration('E', "Only applicable for sum insured 5 Lakh");
            $rootScope.$apply();
            return false;
        }
        if (param == 'Y') {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                if (coverName == 'COVER_ARU_FLAG' && param == 'Y' && diA.selectedMember[i].SumInsured != '500000' && diA.diamondQuoteDetails.PolicyType == 'MI') {
                    diA.selectedMember[i][coverName] = 'N'
                    $rootScope.alertConfiguration('E', "Only applicable for sum insured 5 Lakh");

                }
                else {
                    diA.selectedMember[i][coverName] = 'Y'
                }

            }
            diA[coverName] = 'Y'
        } else {
            for (var i = 0; i < diA.selectedMember.length; i++) {
                diA.selectedMember[i][coverName] = 'N'
            }
        }
        diA.updatePreminum()

    }

    /* Modify Optional care Benefits at Product Level Ends*/


    /* Submit Activ Care Quote */

    diA.submitActivCareQuote = function (event) {
        /*for(var  i = 0  ; i < diA.selectedMember.length ; i++){
            if(diA.selectedMember[i].Age > 80){
                $rootScope.alertConfiguration('E', "Age of "+diA.selectedMember[i].RelationWithProposer + " cannot be greater than 80");
                    $rootScope.$apply();
                    return false;
            }
        }*/
        event.target.disabled = false;
        event.target.innerText = "Proceed";

        if (diA.stProduct) {
            var diaSubmitQuoteObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "DIUpdateQuote": {
                    "PlanType": diA.diamondQuoteDetails.PlanType,
                    "PolicyTenure": diA.diamondQuoteDetails.PolicyTenure,
                    "PolicyType": diA.diamondQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "EMPD": diA.diamondQuoteDetails.EMPD,
                    "AFFD": diA.diamondQuoteDetails.AFFD,
                    "FAMD": diA.diamondQuoteDetails.FAMD,
                    "MemberDetails": diA.selectedMember
                },
                "STUpdateQuote": diA.stQuote
            }
        }
        else {
            var diaSubmitQuoteObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "DIUpdateQuote": {
                    "PlanType": diA.diamondQuoteDetails.PlanType,
                    "PolicyTenure": diA.diamondQuoteDetails.PolicyTenure,
                    "PolicyType": diA.diamondQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "EMPD": diA.diamondQuoteDetails.EMPD,
                    "AFFD": diA.diamondQuoteDetails.AFFD,
                    "FAMD": diA.diamondQuoteDetails.FAMD,
                    "MemberDetails": diA.selectedMember
                }

            }
        }

        var lemniskObj = {
            "Selected Members": diA.membersSelected,
            "PlanName": diA.planName,
            "tenure": diA.diamondQuoteDetails.PolicyTenure,
            "PolicyType": diA.diamondQuoteDetails.PolicyType,
            "Premium Amount": diA.diamondPreminumObj.TotalPremium,
            "sum insured": diA.sumInusred
        };
        $rootScope.lemniskTrack("", "", lemniskObj);

        /* var lemniskObjPass = {
             "ReferenceNumber": sessionStorage.getItem('rid'),
             "Savings": true,
             "ACUpdateQuote": {
                 "PolicyType": diA.diamondQuoteDetails.PolicyType,
                 "PaymentType": "UPFRONT",
                 "preminumObj" : diA.diamondPreminumObj.TotalPremium , 
                 "EMPD": diA.diamondQuoteDetails.EMPD,
                 "AFFD": diA.diamondQuoteDetails.AFFD,
                 "FAMD": diA.diamondQuoteDetails.FAMD,
                 "MemberDetails": diA.selectedMember
             }
         }

         var lemeiskData   = lemniskObjPass
         
         $rootScope.leminiskObj =  lemeiskData
         
         $rootScope.lemniskCodeExcute();*/
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", diaSubmitQuoteObj, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

            if (response.ResponseCode == 1) {
                if (diA.crossSell) {
                    if (diA.CI == 'Y') {
                        diA.productSelctedInCross = diA.productSelctedInCross + '-CI'
                    } if (diA.PA == 'Y') {
                        diA.productSelctedInCross = diA.productSelctedInCross + '-PA'
                    } if (diA.CS == 'Y') {
                        diA.productSelctedInCross = diA.productSelctedInCross + '-CS'
                    }
                    sessionStorage.setItem('productSelctedInCross', diA.productSelctedInCross)
                    $location.url('cross-sell-proposer-details?products=' + diA.productSelctedInCross);
                } else {
                    $location.url('diamond-proposer-details');
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

        }, function (err) {
            event.target.disabled = false;
            event.target.innerText = "Proceed";
        });
    }

    /* Submit Activ Care Quote */



}])