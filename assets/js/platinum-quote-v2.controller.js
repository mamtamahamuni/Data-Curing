var acApp = angular.module("platinumQuoteNewQuoteApp", []);

acApp.controller("platinumQuoteNewQuoteController", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$q', function ($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $q) {

    /* Data Inilization */

    var pLV = this;
    var aS = appService;
    pLV.plantp = "fal"

    pLV.validForm = true;
    pLV.productSelctedInCross = 'AC'

    var goingOn = false;
    pLV.planName = "platinum";
    pLV.ProductCode = "";
    // pLV.productPlanName = "Essential";
    pLV.showCrossSell = false;
    var insuredMemberDetails;
    pLV.PLcoverSlider = false;
    pLV.CIcoverSlider = false;
    pLV.ICMIcoverSlider = false;
    pLV.HPCcoverSlider = false;
    pLV.OPDcoverSlider = false;
    pLV.CDcoverSlider = false;
    pLV.RoomcoverSlider = false;
    pLV.cdCollapse = 'Y';
    pLV.rTCollapse = 'Y'
    pLV.wavierCopay = 'N';
    pLV.roomUpgradeText = "";

    pLV.BP_YN = 'N'
    pLV.initSlider = false;
    pLV.sumInusred = ""
    pLV.selectedMember = [];
    pLV.tempUNSelectedMembersForTwo = []
    pLV.tempUNSelectedMembers = [];

    pLV.hospiCashArray = [];
    pLV.oPDArray = [];
    pLV.roomArray = ["Single", "ANY", "SHARED"];
    pLV.vaccineAmount = ['--Select--', 500, 750, 1000];
    pLV.ReductionInPEDWaitingPeriodText = '--Select--';
    pLV.ReductionInPEDWaitingPeriodOptions = [
                                                {RPEDWPId:1,RPEDWPText:"-- Select --",RPEDWPModel:"ReductionInPEDWaitingPeriod",RPEDWPCoverName:"ReductionInPEDWaitingPeriod", value: 'N', display:'Essential,Enhanced, Premier'},
                                                {RPEDWPId:1,RPEDWPText:"4 Yrs to 2 Yrs",RPEDWPModel:"ReductionInPEDWP4yrsto2yrs",RPEDWPCoverName:"ReductionInPEDWP4yrsto2yrs", value: 'Y', display:'Essential'},
                                                {RPEDWPId:2,RPEDWPText:"4 Yrs to 1 Yr",RPEDWPModel:"ReductionInPEDWP4yrsto1yrs",RPEDWPCoverName:"ReductionInPEDWP4yrsto1yrs", value: 'Y', display:'Essential'},
                                                {RPEDWPId:3,RPEDWPText:"3 Yrs to 2 Yrs",RPEDWPModel:"ReductionInPEDWP3yrsto2yrs",RPEDWPCoverName:"ReductionInPEDWP3yrsto2yrs", value: 'Y', display:'Enhanced, Premier'},
                                                {RPEDWPId:4,RPEDWPText:"3 Yrs to 1 Yr",RPEDWPModel:"ReductionInPEDWP3yrsto1yrs",RPEDWPCoverName:"ReductionInPEDWP3yrsto1yrs", value: 'Y', display:'Enhanced, Premier'}
                                            ];
    pLV.VaccineCoverOptions = ["Rs.500 / Insured Person / Per Policy Year", "Rs.750 / Insured Person / Per Policy Year", "Rs.1000 / Insured Person / Per Policy Year"];


    for (var i = 500; i <= 5000; i = i + 500) {
        //var objVal = ''

        pLV.hospiCashArray.push({
            "key": String(i),
            "val": i
        })


    }

    for (var i = 5000; i <= 20000; i = i + 1000) {
        //var objVal = ''

        pLV.oPDArray.push({
            "key": String(i),
            "val": i
        })


    }
    // console.log(pLV.hospicash)

    /* End of data inilization */


    function loadOwlCarousel(idName) {
        pLV.initSlider = true;
        $timeout(function () {
            $("#" + idName).owlCarousel({
                items: 2,
                navigation: true,
                navigationText: ["", ""],
            });
        }, 300);
    }


    /* This event triggers we select HCB as YES */


    function coverCcorousel(coverName, coruselId) {
        if (coverName == 'PA') {
            pLV.PLcoverSlider = true;
        } else if (coverName == 'CI') {
            pLV.CIcoverSlider = true;
        }
        else if (coverName == 'ICMI') {
            pLV.ICMIcoverSlider = true;
        }
        else if (coverName == 'HPC') {
            pLV.HPCcoverSlider = true;
        }
        else if (coverName == 'OPD') {
            pLV.OPDcoverSlider = true;
        }
        else if (coverName == 'RT') {
            pLV.RoomcoverSlider = true;
        }

        $timeout(function () {
            $("#" + coruselId).owlCarousel({
                items: 4,
                navigation: true,
                navigationText: ["", ""],
            });
        }, 500);
    }

    function ChronicDisease(coverName, coruselId) {
        pLV.CDcoverSlider = true

        $timeout(function () {
            $("#" + coruselId).owlCarousel({
                items: 2,
                navigation: true,
                navigationText: ["", ""],
            });
        }, 500);
    }
    $(document).ready(function () {

        $('.show-answer').on('click', function () {
            var isSelfPResent = false;
            var isChronicPresent = false;
            if (pLV.selectedMember.length == 1) {
                $rootScope.alertConfiguration('E', "Family floater is only applicable for two members ");
                $rootScope.$apply();
                return false;
            }

            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationWithProposer == "SELF") {
                    isSelfPResent = true;
                }
                if (pLV.selectedMember[i].PreExistingDisease != 'NCHR') {
                    isChronicPresent = true;
                }
            }

            if (!isSelfPResent) {
                $rootScope.alertConfiguration('E', "Self is mandatory for Family Floater Policy ");
                $rootScope.$apply();
                return false;
            }
            if (isChronicPresent) {
                $rootScope.alertConfiguration('E', "Family Floater Policy is not applicable in case of any chronic condition");
                $rootScope.$apply();
                return false;
            }
            var deletememberedArray = [];

            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationWithProposer == "FATHER" || pLV.selectedMember[i].RelationWithProposer == "MOTHER" || pLV.selectedMember[i].RelationWithProposer == "FATHER-IN-LAW" || pLV.selectedMember[i].RelationWithProposer == "MOTHER-IN-LAW" || pLV.selectedMember[i].RelationWithProposer == "BROTHER" || pLV.selectedMember[i].RelationWithProposer == "SISTER" || pLV.selectedMember[i].RelationWithProposer == "GRANDFATHER" || pLV.selectedMember[i].RelationWithProposer == "GRANDMOTHER" || pLV.selectedMember[i].RelationWithProposer == "GRANDSON" || pLV.selectedMember[i].RelationWithProposer == "GRANDDAUGHTER" || pLV.selectedMember[i].RelationWithProposer == "SON-IN-LAW" || pLV.selectedMember[i].RelationWithProposer == "DAUGHTER-IN-LAW" || pLV.selectedMember[i].RelationWithProposer == "BROTHER-IN-LAW" || pLV.selectedMember[i].RelationWithProposer == "SISTER-IN-LAW" || pLV.selectedMember[i].RelationWithProposer == "NEPHEW" || pLV.selectedMember[i].RelationWithProposer == "NIECE") {

                    deletememberedArray.push(pLV.selectedMember[i])
                    // mainMemberArrayCopy.splice(i ,1)

                }
            }

            /* if((pLV.selectedMember.length - deletememberedArray.length > 1) && deletememberedArray.length > 0){
                  console.log( deletememberedArray)
                   console.log(pLV.selectedMember)
 
                   $rootScope.alertData = {
                             "modalClass": "regular-alert",
                             "modalHeader": "Alert",
                             "modalBodyText": "As per the poroduct policy in Flamily floater Self Spouse and Kids are allowed rest all the members will be deleted",
                             "showCancelBtn": false,
                             "gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                             "gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
                             "gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                             "modalSuccessText": "Ok",
                             "showAlertModal": true,
                             "positiveFunction": function(){
                                         appService.postData(ABHI_CONFIG.apiUrl + "GEN/DeleteMember", {
                                         "ReferenceNumber": sessionStorage.getItem('rid'),
                                         "InsuredDetail": deletememberedArray
                                                 }, true, {
                                                     headers: {
                                                         'Content-Type': 'application/json'
                                                     }
                                                 })
                                                 .then(function(data) {
                                                      pLV.platinumQuoteDetails.PolicyType = "FF"
                                                              //pLV.initSlider = false;
 
                                                              for(var i = 0 ; i < deletememberedArray.length ; i++){
                                                                 for(var j = 0 ; j <pLV.selectedMember.length ; j++){
                                                                     if(deletememberedArray[i].RelationWithProposer == pLV.selectedMember[j].RelationWithProposer)
                                                                         pLV.selectedMember.splice(j , 1)
                                                                 }
                                                              }
 
                                                              $timeout(function(){
                                                                loadOwlCarousel('ci-sum-isnured-slider')
                                                             },300);
 
                                                              pLV.updateSoftDetails("", "", "")
                                                         
                                                         
                                                         pLV.updatePreminum();
                                                 })
                                 }
                         }
                         $rootScope.$apply();
             }
             else if(deletememberedArray.length > 0){
                 $rootScope.alertData = {
                             "modalClass": "regular-alert",
                             "modalHeader": "Alert",
                             "modalBodyText": "You cannot opt for Family Floater polciy as atleat two members are required",
                             "showCancelBtn": false,
                             "gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                             "gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
                             "gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                             "modalSuccessText": "Ok",
                             "showAlertModal": true
                         }
             }*/

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
            else {
                pLV.platinumQuoteDetails.PolicyType = "FF"
                $timeout(function () {
                    loadOwlCarousel('ci-sum-isnured-slider')
                }, 300);
                for (var i = 0; i < pLV.selectedMember.length; i++) {
                    pLV.selectedMember[i].RoomType = pLV.selectedMember[0].RoomType
                    pLV.selectedMember[i].hospitalCash_SI = pLV.selectedMember[0].hospitalCash_SI
                }
                pLV.updatePreminum();
            }


            if (false) {
                appService.postData(ABHI_CONFIG.apiUrl + "GEN/DeleteMember", {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "InsuredDetail": deletememberedArray
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (data) {
                        pLV.platinumQuoteDetails.PolicyType = "FF"
                        //pLV.initSlider = false;

                        $timeout(function () {
                            loadOwlCarousel('ci-sum-isnured-slider')
                        }, 300);

                        pLV.updateSoftDetails("", "", "")


                        pLV.updatePreminum();
                    })
            }
            //console.log(deletememberedArray)


        });

        $('.hide-answer').on('click', function () {
            pLV.platinumQuoteDetails.PolicyType = "MI"
            //pLV.initSlider = false;

            /*for (var i = 0; i < pLV.selectedMember.length; i++ ) {
                if (pLV.selectedMember[i].PACoverFlag == "Y") {
                     $('#content-personal-accident').collapse('show');
                    pLV.paCollapse = 'Y';
                    coverCcorousel('PA');
                }
                if (pLV.selectedMember[i].CICoverFlag == "Y") {
                     $('#content-critical-illness').collapse('show');
                    pLV.ciCollapse = 'Y';
                    coverCcorousel('CI');
                }
                if (pLV.selectedMember[i].ICMICoverFlag == "Y") {
                     $('#content-international-coverage').collapse('show');
                    pLV.iCMICollapse = 'Y';
                    coverCcorousel('ICMI');
                }

                
            }*/

            var childCount = 0;
            var isChildBelowFive = false;

            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationWithProposer == 'KID') {
                    childCount++;
                    if (parseInt(pLV.selectedMember[i].Age) < 5) {
                        isChildBelowFive = true;
                    }
                }
            }

            if (childCount > 0 && isChildBelowFive == true) {
                $rootScope.alertConfiguration('E', "Multi-individual is only applicable for above 5 years kids ");
                angular.element('.show-answer').triggerHandler('click');
            } else {
                pLV.platinumQuoteDetails.PolicyType = "MI";
            }

            $timeout(function () {
                loadOwlCarousel('ci-sum-isnured-slider11');
            }, 300);

            pLV.updatePreminum()
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
            pLV.intitalACMemberList = data.ResponseData;
            pLV.activeCareFamilyContruct = data.ResponseData;
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
                var data = JSON.parse($rootScope.decrypt(data._resp))
                console.log("Get Quote Details");
                console.log(data);
                //aS.triggerSokrati(); /* Triggering Sokrati 
                //data = {"ResponseCode":1,"ResponseData":{"DiamondQuote":null,"PlatinumQuote":{"PlanName":"Platinum-Essential","PolicyTenure":"1","PolicyType":"MI","SumInsured":"500000","MemberDetails":[{"Age":"41","PACoverRiskClass":"1","PACoverFlag":"N","CICoverFlag":"N","ICMICoverFlag":"N","PACoverSI":"1000000","CICoverSI":null,"ICMICoverSI":null,"PPN":"N","Gender":"0","SumInsured":"1000000","RelationType":"SPO","RelationWithProposer":"SPOUSE"},{"Age":"41","PACoverRiskClass":"1","PACoverFlag":"Y","CICoverFlag":"N","ICMICoverFlag":"N","PACoverSI":"1000000","CICoverSI":null,"ICMICoverSI":null,"PPN":"N","Gender":"0","SumInsured":"1000000","RelationType":"S","RelationWithProposer":"SELF"}]},"PAQuote":null,"CIQuote":null,"CSQuote":null,"ACQuote":null,"STQuote":null},"ResponseMessage":"Success."}
                if (data.ResponseCode == 1) {
                    pLV.platinumQuoteDetails = data.ResponseData.PlatinumQuote;

                    $rootScope.leminiskObj = data.ResponseData;
                    pLV.pincode = pLV.platinumQuoteDetails.PINCode;
                    pLV.platinumQuoteDetails.PINCode != "" ?  pLV.changePinCode(pLV.platinumQuoteDetails.PINCode): "";
                    $rootScope.lemniskCodeExcute();
                    pLV.platinumPreminumObj = data.ResponseData.PremiumDetail;
                    pLV.ProductCode = pLV.platinumPreminumObj.ProductPremium[0].ProductCode;
                    //pLV.platinumPreminumObj.AddonPremium = data.ResponseData.PremiumDetail.AddonPremium;
                    pLV.selectedMember = pLV.platinumQuoteDetails.MemberDetails;
                    var planNameInt = parseInt(pLV.platinumQuoteDetails.PlanType);

                    pLV.productPlanName = (pLV.platinumQuoteDetails.PlanName == 'Platinum - Essential') ? 'Essential' : (pLV.platinumQuoteDetails.PlanName == 'Platinum - Enhanced') ? 'Enhanced' : (pLV.platinumQuoteDetails.PlanName == 'Gold Enhanced') ? 'Gold' : 'Premier'

                    pLV.PLplanName = (pLV.platinumQuoteDetails.PlanName == 'Platinum - Essential') ? 'PAPLEssential' : (pLV.platinumQuoteDetails.PlanName == 'Platinum - Enhanced') ? 'PAPLEnhanced' : (pLV.platinumQuoteDetails.PlanName == 'Gold Enhanced') ? 'PAPLGold' : 'PAPLPremier'

                    pLV.CIplanName = (pLV.platinumQuoteDetails.PlanName == 'Platinum - Essential') ? 'CIPLEssential' : (pLV.platinumQuoteDetails.PlanName == 'Platinum - Enhanced') ? 'CIPLEnhanced' : (pLV.platinumQuoteDetails.PlanName == 'Gold Enhanced') ? 'CIPLGold' : 'CIPLPremier'

                    pLV.ICMIplanName = (pLV.platinumQuoteDetails.PlanName == 'Platinum - Essential') ? 'ICMIPLEssential' : (pLV.platinumQuoteDetails.PlanName == 'Platinum - Enhanced') ? 'ICMIPLEnhanced' : (pLV.platinumQuoteDetails.PlanName == 'Gold Enhanced') ? 'ICMIPLGold' : 'ICMIPLPremier'
                    /**/

                    //pLV.platinumQuoteDetails.MemberDetails[0].PreExistingDisease = '1010'
                    sessionStorage.setItem('plPlan', pLV.productPlanName)
                    //
                    if (pLV.platinumQuoteDetails.PolicyType == "FF") {
                        $timeout(function () {
                            angular.element('.show-answer').triggerHandler('click');
                        }, 0);
                        $('#content-rt-coverage').removeClass('owl-carousel buy-owl-carousel');
                        $('#content-hpc-coverage').removeClass('owl-carousel buy-owl-carousel cK-carousel');
                        pLV.sumInusred = pLV.platinumQuoteDetails.MemberDetails[0].SumInsured;
                        for (var j = 0; j < pLV.platinumQuoteDetails.MemberDetails.length; j++) {
                            if (pLV.platinumQuoteDetails.MemberDetails[j].PACoverFlag == 'Y') {
                                pLV.paCollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].CICoverFlag == 'Y') {
                                pLV.ciCollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].ICMICoverFlag == 'Y') {
                                pLV.iCMICollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].hospitalCash == 'Y') {
                                pLV.hPCCollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].opdExpense == 'Y') {
                                pLV.oPDCollapse = 'Y';
                            }

                            if (pLV.platinumQuoteDetails.MemberDetails[j].SumInsured > pLV.sumInusred) {
                                pLV.sumInusred = pLV.platinumQuoteDetails.MemberDetails[j].SumInsured
                            }
                            
                            /* Health Add On */
                            if (pLV.platinumQuoteDetails.MemberDetails[j].FutureSecure == 'Y') {
                                pLV.FutureSecure = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].CancerHospitalizationBooster == 'Y') {
                                pLV.CancerHospitalizationBooster = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].ReductionInPEDWaitingPeriod == 'Y') {
                                pLV.ReductionInPEDWaitingPeriod = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].VaccineCover == 'Y') {
                                pLV.VaccineCover = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].TeleOPDConsultation == 'Y') {
                                pLV.TeleOPDConsultation = 'Y';
                            }
                        }
                    } else {
                        $timeout(function () {
                            angular.element('.hide-answer').triggerHandler('click');
                        }, 0);
                        pLV.sumInusred = pLV.platinumQuoteDetails.MemberDetails[0].SumInsured;

                        for (var j = 0; j < pLV.platinumQuoteDetails.MemberDetails.length; j++) {
                            if (pLV.platinumQuoteDetails.MemberDetails[j].PACoverFlag == 'Y') {
                                pLV.paCollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].CICoverFlag == 'Y') {
                                pLV.ciCollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].ICMICoverFlag == 'Y') {
                                pLV.iCMICollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].hospitalCash == 'Y') {
                                pLV.hPCCollapse = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].opdExpense == 'Y') {
                                pLV.oPDCollapse = 'Y';
                            }
                            /*if(pLV.platinumQuoteDetails.MemberDetails[j].PreExistingDisease != 'NCHR'){
                                pLV.cdCollapse = 'Y';
                            }*/
                            if (pLV.platinumQuoteDetails.MemberDetails[j].SumInsured > pLV.sumInusred) {
                                pLV.sumInusred = pLV.platinumQuoteDetails.MemberDetails[j].SumInsured
                            }
                            
                            /* Health Add On */
                            if (pLV.platinumQuoteDetails.MemberDetails[j].FutureSecure == 'Y') {
                                pLV.FutureSecure = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].CancerHospitalizationBooster == 'Y') {
                                pLV.CancerHospitalizationBooster = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].ReductionInPEDWaitingPeriod == 'Y') {
                                pLV.ReductionInPEDWaitingPeriod = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].VaccineCover == 'Y') {
                                pLV.VaccineCover = 'Y';
                            }
                            if (pLV.platinumQuoteDetails.MemberDetails[j].TeleOPDConsultation == 'Y') {
                                pLV.TeleOPDConsultation = 'Y';
                            }
                        }
                    }

                    for (var i = 0; i < pLV.platinumQuoteDetails.MemberDetails.length; i++) {
                        if (pLV.platinumQuoteDetails.MemberDetails[i].PreExistingDisease == 'NCHR') {
                            pLV.platinumQuoteDetails.MemberDetails[i].BP_YN = 'N';
                            pLV.platinumQuoteDetails.MemberDetails[i].Diabetes_YN = 'N'
                            pLV.platinumQuoteDetails.MemberDetails[i].Asthma_YN = 'N'
                            pLV.platinumQuoteDetails.MemberDetails[i].Cholesterol_YN = 'N'
                        }
                        else {
                            var preexisting = pLV.platinumQuoteDetails.MemberDetails[i].PreExistingDisease.split('')
                            pLV.platinumQuoteDetails.MemberDetails[i].BP_YN = (preexisting[0] == '1') ? 'Y' : 'N';
                            pLV.platinumQuoteDetails.MemberDetails[i].Diabetes_YN = (preexisting[1] == '1') ? 'Y' : 'N';
                            pLV.platinumQuoteDetails.MemberDetails[i].Asthma_YN = (preexisting[2] == '1') ? 'Y' : 'N';
                            pLV.platinumQuoteDetails.MemberDetails[i].Cholesterol_YN = (preexisting[3] == '1') ? 'Y' : 'N';

                        }
                        if (pLV.platinumQuoteDetails.MemberDetails[i].copayment == 'Y') {
                            pLV.wavierCopay = 'Y';
                        }
                    }

                    if (pLV.paCollapse == 'Y') {
                        pLV.coverShowHide(pLV.paCollapse, 'PAC', 'pl-personal-accident-cover')
                    }
                    if (pLV.ciCollapse == 'Y') {
                        pLV.coverShowHide(pLV.ciCollapse, 'CIC', 'ci-critical-illness-cover')
                    }

                    if (pLV.iCMICollapse == 'Y') {
                        pLV.coverShowHide(pLV.iCMICollapse, 'ICMI', 'icmi-international-cover')
                    }
                    if (pLV.hPCCollapse == 'Y') {
                        pLV.coverShowHide(pLV.hPCCollapse, 'HPC', 'hpc-cover')
                    }
                    if (pLV.oPDCollapse == 'Y') {
                        pLV.coverShowHide(pLV.oPDCollapse, 'OPD', 'opd-cover')
                    }
                    if (pLV.rTCollapse == 'Y') {
                        pLV.coverShowHide(pLV.rTCollapse, 'RT', 'rt-cover')
                    }
                    if (pLV.cdCollapse == 'Y') {
                        pLV.coverShowHide(pLV.cdCollapse, 'CD', 'pl-chronic-disease')
                    }
                    
                            
                    /* Health Add On */
                    if (pLV.FutureSecure == 'Y') {
                        pLV.coverShowHide(pLV.FutureSecure, 'FS', 'pl-FutureSecure-Question');
                    }
                    if (pLV.CancerHospitalizationBooster == 'Y') {
                        pLV.coverShowHide(pLV.CancerHospitalizationBooster, 'CHB', 'pl-CancerHospitalizationBooster-Question');
                    }
                    if (pLV.ReductionInPEDWaitingPeriod == 'Y') {
                        pLV.coverShowHide(pLV.ReductionInPEDWaitingPeriod, 'RPEDWP', 'pl-ReductionInPEDWaitingPeriod-Question');
                    }
                    if (pLV.VaccineCover == 'Y') {
                        pLV.coverShowHide(pLV.VaccineCover, 'VC', 'pl-VaccineCover-Question');
                    }
                    if (pLV.TeleOPDConsultation == 'Y') {
                        pLV.coverShowHide(pLV.TeleOPDConsultation, 'TOPDC', 'pl-TeleOPDConsultation-Question');
                    }
                    
                    pLV.healthCareWorkerDetails = pLV.platinumQuoteDetails.MemberDetails[0].HealthCareWorkerDetail;
                    //console.log(pLV.selectedMember);
                    // loadOwlCarousel();
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
    /*  get zone by using pincode */
    pLV.changePinCode = function (pinCode) {
        if(pinCode != undefined && pinCode.length == 6 ){
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/PinCode", {
            "PinCode": pinCode,
            "Productcode":pLV.ProductCode
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    pLV.platinumQuoteDetails.Zone = data.ResponseData.Zone;
                    pLV.updatePreminum();
                } else {
                    // $rootScope.alertConfiguration('E',data.ResponseMessage);
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": data.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                        "positiveFunction": function () {
                            pLV.pincode = "";
                        }
                    }
                }
            });
        }
    }

    /* get zone by using pincode */

    /* To Fetch Sum Insured Data */

    aS.getData("assets/data/sum-insured.json", "", false, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            if (data.ResponseCode == 1) {
                pLV.sumAmounts = data.ResponseData;
            } else {

            }
        }, function (err) {

        })


    /* End of fetching sum insured data */

    /* Change gender event */

    pLV.changeGender = function (member) {
        angular.forEach(pLV.membersDetails, function (v, i) {
            if (v.RelationWithProposer == "SELF") {
                v.Gender = member.Gender;
                pLV.addUpdateMember(angular.copy(v), i - 1, v.Age);
                pLV.updatePreminum();
            } else if (v.RelationWithProposer == "SPOUSE") {
                (member.Gender == "1") ? v.Gender = "0" : v.Gender = "1";
                pLV.addUpdateMember(angular.copy(v), i - 1, v.Age);
                pLV.updatePreminum();
            }
        });
    }

    /* End of change gender event */


    /* Function to form PED */

    function toFormPED(membersDetails, platinumPED, chronicSelectCount) {
        var chronicParams = ['BP_YN', 'Diabetes_YN', 'Asthma_YN', 'Cholesterol_YN'];
        for (var i = 0; i < chronicParams.length; i++) {
            if (membersDetails[chronicParams[i]] == "Y") {
                platinumPED = platinumPED + "1";
                chronicSelectCount = chronicSelectCount + 1;
            } else {
                platinumPED = platinumPED + "0";
            }
        }
        if (platinumPED == "0000") {
            platinumPED = "NCHR";
        }
        var returnObj = {
            'platinumPED': platinumPED,
            'chronicSelectCount': chronicSelectCount
        }
        return returnObj;
    }

    /* End of function to form PED */


    /* Chronic condition select */

    pLV.chronicSelect = function (membersDetails) {
        platinumPED = "";
        var chronicSelectCount = 0;
        pLV.platinumQuoteDetails.PolicyType = "MI"
        pLV.deleteMemberObj = [];

        $rootScope.alertConfiguration('S', "Premium has been re-calculated basis chronic disease selected", "premium_recalculated_chronic_disease_alert");

        $timeout(function () {
            var returnPED = toFormPED(membersDetails, platinumPED, chronicSelectCount);
            platinumPED = returnPED.platinumPED;
            chronicSelectCount = returnPED.chronicSelectCount;
            pLV.chronicSelectNo = chronicSelectCount;

            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationType == membersDetails.RelationType) {
                    pLV.selectedMember[i].PreExistingDisease = platinumPED
                }
            }

            $timeout(function () {
                angular.element('.hide-answer').triggerHandler('click');
            }, 0);

        }, 500);
    }

    /* End of chronic condition select */

    /* Wavier of Copay Cover Logic */
    pLV.wavierCopayCover = function (param) {
        for (var i = 0; i < pLV.selectedMember.length; i++) {
            if (param == 'Y') {
                pLV.selectedMember[i].copayment = 'Y'
            } else {
                pLV.selectedMember[i].copayment = 'N'
            }
        }
        pLV.updatePreminum()
    }

    /* Wavier of Copay Cover Logic ends*/



    /* updated the Sum insured value */

    pLV.updateSumInsured = function (param, membersObj) {
        if (membersObj != "") {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationType == membersObj.RelationType) {
                    pLV.selectedMember[i].SumInsured = param;
                }
            if(pLV.CancerHospitalizationBooster == 'Y' && parseInt(param) > 10000000 ){
                $rootScope.alertConfiguration('E', "Cancer Hospitalization Booster is not available for Base Policy with Sum Insured above 1 Cr", "");
                //pLV.CancerHospitalizationBooster = 'N'   
                for (var i = 0; i < pLV.selectedMember.length; i++) {
                    if (pLV.selectedMember[i].RelationType == membersObj.RelationType) {
                    pLV.selectedMember[i].CancerHospitalizationBooster = 'N'
                    }
                }
                var anyMemberIsPresent = false;
                angular.forEach(pLV.selectedMember, function(v, i) {
                    if (v["CancerHospitalizationBooster"] == 'Y')
                        anyMemberIsPresent = true;
                })
                if (anyMemberIsPresent) {
                    pLV.CancerHospitalizationBooster = 'Y'
                } else {
                    pLV.CancerHospitalizationBooster = 'N'
                }
            } 
            
            }

        } else {
            pLV.sumInusred = param
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                pLV.selectedMember[i].SumInsured = param;
            }
            if(pLV.CancerHospitalizationBooster == 'Y' && parseInt(param) > 10000000 ){
                $rootScope.alertConfiguration('E', "Cancer Hospitalization Booster is not available for Base Policy with Sum Insured above 1 Cr", "");
                pLV.CancerHospitalizationBooster = 'N'   
                for (var i = 0; i < pLV.selectedMember.length; i++) {
                    pLV.selectedMember[i].CancerHospitalizationBooster = 'N'
                }
            } 
            
        }

        if (pLV.platinumQuoteDetails.PolicyType == 'FF' && pLV.sumInusred < 1000000) {
            pLV.iCMICollapse = 'N';
            pLV.coverShowHide('N', 'ICMI', 'content-international-coverage')
        }
        if (pLV.platinumQuoteDetails.PolicyType == 'FF' && pLV.sumInusred <= 300000) {
            for (var i = 0; i < pLV.selectedMember.length; i++) {

                if (pLV.selectedMember[i].SumInsured <= 300000) {
                    pLV.selectedMember[i].RoomType = 'Single'
                }
            }
        }
        else if (pLV.platinumQuoteDetails.PolicyType == 'MI') {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].SumInsured < 1000000 && pLV.selectedMember[i].RelationType == membersObj.RelationType) {
                    pLV.selectedMember[i].ICMICoverFlag = 'N'
                }
                if (pLV.selectedMember[i].SumInsured <= 300000) {
                    pLV.selectedMember[i].RoomType = 'Single'
                }
            }
        }

        pLV.updatePreminum()
    }

    /* updated the Sum insured value Ends */

    /* Show Hide Memeber Level Sum insured */
    pLV.coverShowHide = function (param, coverName, coruselId) {
        if (param == 'Y' && coverName == "PAC") {
            $('#content-personal-accident').collapse('show');

            $timeout(function () {
                coverCcorousel('PA', coruselId);
            }, 300);
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].PACoverFlag = 'Y'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'PAC', false)
            }

        }
        else if (param == 'N' && coverName == "PAC") {
            $('#content-personal-accident').collapse('hide');
            pLV.PLcoverSlider = false;
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].PACoverFlag = 'N'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'PAC', false)
            }
        }

        else if (param == 'Y' && coverName == "CIC") {
            $('#content-critical-illness').collapse('show');

            $timeout(function () {
                coverCcorousel('CI', coruselId);
            }, 300);
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].CICoverFlag = 'Y'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'CIC', false)
            }
        }
        else if (param == 'N' && coverName == "CIC") {
            $('#content-critical-illness').collapse('hide');
            pLV.CIcoverSlider = false;
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].CICoverFlag = 'N'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'CIC', false)
            }
        }


        else if (param == 'Y' && coverName == "HPC" && pLV.platinumQuoteDetails.PolicyType == 'MI') {
            $('#content-hpc-coverage').collapse('show');

            $timeout(function () {
                coverCcorousel('HPC', coruselId);
            }, 300);
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].hospitalCash = 'Y'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'HPC', false)
            }
        }
        else if (param == 'N' && coverName == "HPC" && pLV.platinumQuoteDetails.PolicyType == 'MI') {
            $('#content-hpc-coverage').collapse('hide');
            pLV.HPCcoverSlider = false;
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].hospitalCash = 'N'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'HPC', false)
            }
        }

        else if (param == 'Y' && coverName == "HPC" && pLV.platinumQuoteDetails.PolicyType == 'FF') {
            $('#content-hpc-coverage').collapse('show');

            $timeout(function () {
                coverCcorousel('HPC', coruselId);
            }, 300);

            for (var i = 0; i < pLV.selectedMember.length; i++) {
                pLV.selectedMember[i].hospitalCash = 'Y'
            }

        }
        else if (param == 'N' && coverName == "HPC" && pLV.platinumQuoteDetails.PolicyType == 'FF') {
            $('#content-hpc-coverage').collapse('hide');
            pLV.HPCcoverSlider = false;

            for (var i = 0; i < pLV.selectedMember.length; i++) {
                pLV.selectedMember[i].hospitalCash = 'N'
            }

        }

        else if (param == 'Y' && coverName == "OPD") {
            $('#content-opd-coverage').collapse('show');

            $timeout(function () {
                coverCcorousel('OPD', coruselId);
            }, 300);
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].opdExpense = 'Y'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'OPD', false)
            }
        }
        else if (param == 'N' && coverName == "OPD") {
            $('#content-opd-coverage').collapse('hide');
            pLV.OPDcoverSlider = false;
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].opdExpense = 'N'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'OPD', false)
            }
        }

        else if (param == 'Y' && coverName == "RT") {
            $('#content-rt-coverage').collapse('show');

            $timeout(function () {
                coverCcorousel('RT', coruselId);
            }, 300);
        }
        else if (param == 'N' && coverName == "RT") {
            $('#content-rt-coverage').collapse('hide');
            pLV.RoomcoverSlider = false;
        }


        else if (param == 'Y' && coverName == "ICMI") {
            $('#content-international-coverage').collapse('show');

            $timeout(function () {
                coverCcorousel('ICMI', coruselId);
            }, 300);
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].ICMICoverFlag = 'Y'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'ICMI', false)
            }
        }

        else if (param == 'N' && coverName == "ICMI") {
            $('#content-international-coverage').collapse('hide');
            pLV.ICMIcoverSlider = false;
            if (pLV.selectedMember.length == 1) {
                pLV.selectedMember[0].ICMICoverFlag = 'N'
                pLV.updateCoverSumInsured('', pLV.selectedMember[0], 'ICMI', false)
            }
        }


        else if (coverName == "CD") {
            $('#content-chronic-disease').collapse('show');

            $timeout(function () {
                ChronicDisease('CD', coruselId);
            }, 300);
        }


        for (var i = 0; i < pLV.selectedMember.length; i++) {
            if (param == 'N' && coverName == "PAC") {
                pLV.selectedMember[i].PACoverFlag = 'N'
            }
            if (param == 'N' && coverName == "CIC") {
                pLV.selectedMember[i].CICoverFlag = 'N'
            }
            if (param == 'N' && coverName == "ICMI") {
                pLV.selectedMember[i].ICMICoverFlag = 'N'
            }
            if (param == 'N' && coverName == "HPC") {
                pLV.selectedMember[i].hospitalCash = 'N'
            }
            if (param == 'N' && coverName == "OPD") {
                pLV.selectedMember[i].opdExpense = 'N'
            }
        }

        pLV.updatePreminum();

    }

    /* Show Hide Memeber Level Sum insured ends */




    /*Change member Level cover sum insured */

    pLV.updateCoverSumInsured = function (value, member, coverName, updateSuminsiuredFlag) {

        if (member.Age > 65 && (coverName == "PAC" || coverName == "CIC" || coverName == "ICMI")) {
            $rootScope.alertConfiguration('E', "Not applicable above 65 years", "delete_member_alert");
            member.CICoverFlag = 'N';
            member.ICMICoverFlag = 'N';
            member.PACoverFlag = 'N';
            return false;
        }

        if (updateSuminsiuredFlag) {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (member.RelationType == pLV.selectedMember[i].RelationType && coverName == "PAC") {
                    pLV.selectedMember[i].PACoverSI = value.amount;
                }
                if (member.RelationType == pLV.selectedMember[i].RelationType && coverName == "CIC") {
                    pLV.selectedMember[i].CICoverSI = value.amount;
                }
                if (member.RelationType == pLV.selectedMember[i].RelationType && coverName == "ICMI") {
                    pLV.selectedMember[i].ICMICoverSI = value.amount;
                }
                if (member.RelationType == pLV.selectedMember[i].RelationType && coverName == "HPC") {
                    pLV.selectedMember[i].hospitalCash_SI = value.key;
                }
                if (member.RelationType == pLV.selectedMember[i].RelationType && coverName == "OPD") {
                    pLV.selectedMember[i].opdExpense_SI = value.key;
                }
                if (coverName == "HPC" && pLV.platinumQuoteDetails.PolicyType == 'FF') {
                    pLV.selectedMember[i].hospitalCash_SI = value;
                }
                if (member.RelationType == pLV.selectedMember[i].RelationType && coverName == "RT" && pLV.platinumQuoteDetails.PolicyType == 'MI') {
                    pLV.selectedMember[i].RoomType = value;
                }
                if (coverName == "RT" && pLV.platinumQuoteDetails.PolicyType == 'FF') {
                    pLV.selectedMember[i].RoomType = value;
                }

            }
        }



        pLV.updatePreminum();

    }

    /*Change member Level cover sum insured ends*/





    /* calculate preminum */

    pLV.calculatePremium = function () {
        pLV.updatePreminum();

    }

    /* calculate preminum Endsd*/



    /* Update soft details data */

    pLV.updateSoftDetails = function (op, insuredDetail, index) {

        if (op == 'AddMember') {
            pLV.initSlider = false;
            if (pLV.platinumQuoteDetails.PolicyType == "FF") {
                insuredDetail.SumInsured = pLV.sumInusred;
            }
            else {
                insuredDetail.SumInsured = pLV.selectedMember[0].SumInsured;
            }
            if (insuredDetail.RelationWithProposer == 'KID' && insuredDetail.Age < 18) {
                insuredDetail.CICoverFlag = 'N';
                insuredDetail.CICoverSI = pLV.selectedMember[0].CICoverSI;
            }
            else {
                insuredDetail.CICoverFlag = 'N';
                insuredDetail.CICoverSI = pLV.selectedMember[0].CICoverSI;
            }

            if (insuredDetail.RelationWithProposer == 'KID' && insuredDetail.Age < 5) {
                insuredDetail.PACoverFlag = 'N';
            }
            else {
                insuredDetail.PACoverFlag = 'N';
            }

            if (pLV.productPlanName == 'Premier') {
                insuredDetail.CICoverFlag = 'Y';
                insuredDetail.PACoverFlag = 'Y';
            }

            //Gender: "1"
            insuredDetail.ICMICoverFlag = pLV.selectedMember[0].ICMICoverFlag;
            insuredDetail.ICMICoverSI = pLV.selectedMember[0].ICMICoverSI;

            insuredDetail.hospitalCash = pLV.selectedMember[0].hospitalCash;
            insuredDetail.hospitalCash_SI = pLV.selectedMember[0].hospitalCash_SI;

            insuredDetail.opdExpense = pLV.selectedMember[0].opdExpense;
            insuredDetail.opdExpense_SI = pLV.selectedMember[0].opdExpense_SI;

            insuredDetail.PACoverFlag = pLV.selectedMember[0].PACoverFlag;
            insuredDetail.PACoverRiskClass = pLV.selectedMember[0].PACoverRiskClass;
            insuredDetail.PACoverSI = pLV.selectedMember[0].PACoverSI;

            insuredDetail.copayment = pLV.selectedMember[0].copayment;

            insuredDetail.RoomType = pLV.roomArray[0];

            insuredDetail.PreExistingDisease = 'NCHR';
            insuredDetail.BP_YN = 'N';
            insuredDetail.Diabetes_YN = 'N';
            insuredDetail.Asthma_YN = 'N';
            insuredDetail.Cholesterol_YN = 'N';
            //RelationType: "S"
            //RelationWithProposer: "SELF"
            //SumInsured: "1000000"


            pLV.selectedMember.push(insuredDetail)
            pLV.calculatePremium();



        }
        if (op == 'UpdateMember' || (op == 'DeleteMember' && insuredDetail.RelationWithProposer != 'KID')) {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (op == 'UpdateMember' && insuredDetail.RelationType == pLV.selectedMember[i].RelationType) {
                    pLV.selectedMember[i].Age = insuredDetail.Age
                    if (insuredDetail.Age > 65) {
                        pLV.selectedMember[i].CICoverFlag = 'N';
                        pLV.selectedMember[i].ICMICoverFlag = 'N';
                        pLV.selectedMember[i].PACoverFlag = 'N';
                    }
                }
                else if (op == 'DeleteMember' && insuredDetail.RelationType == pLV.selectedMember[i].RelationType) {
                    pLV.selectedMember.splice(i, 1)
                    pLV.initSlider = false;
                }
            }

            if (pLV.selectedMember.length == 1) {
                pLV.platinumQuoteDetails.PolicyType = "MI"
            }
            pLV.calculatePremium();

            /*$timeout(function(){
                loadOwlCarousel();
            },300);*/
        }
        if (op == 'DeleteMember' && insuredDetail.RelationWithProposer == 'KID') {
            pLV.initSlider = false;
            fetchQuoteDetails();
        }

        if (pLV.platinumQuoteDetails.PolicyType == "FF") {
            $timeout(function () {
                angular.element('.show-answer').triggerHandler('click');
            }, 0);
            $('#content-rt-coverage').removeClass('owl-carousel buy-owl-carousel');
            $('#content-hpc-coverage').removeClass('owl-carousel buy-owl-carousel cK-carousel');
            if (pLV.paCollapse == 'Y') {
                $('#content-personal-accident').removeClass('in');
                pLV.PLcoverSlider = false;
                pLV.coverShowHide(pLV.paCollapse, 'PAC', 'pl-personal-accident-cover')
            }
            if (pLV.ciCollapse == 'Y') {
                $('#content-critical-illness').removeClass('in');
                pLV.CIcoverSlider = false;
                pLV.coverShowHide(pLV.ciCollapse, 'CIC', 'ci-critical-illness-cover')
            }
            if (pLV.iCMICollapse == 'Y') {
                $('#content-international-coverage').removeClass('in');
                pLV.ICMIcoverSlider = false;
                pLV.coverShowHide(pLV.iCMICollapse, 'ICMI', 'icmi-international-cover')
            }
            if (pLV.hPCCollapse == 'Y') {
                $('#content-hpc-coverage').removeClass('in');
                pLV.HPCcoverSlider = false;
                pLV.coverShowHide(pLV.hPCCollapse, 'HPC', 'hpc-cover')
            }
            if (pLV.oPDCollapse == 'Y') {
                $('#content-opd-coverage').removeClass('in');
                pLV.OPDcoverSlider = false;
                pLV.coverShowHide(pLV.oPDCollapse, 'OPD', 'opd-cover')
            }
            if (pLV.rTCollapse == 'Y') {
                $('#content-rt-coverage').removeClass('in');
                pLV.RoomcoverSlider = false;
                pLV.coverShowHide(pLV.rTCollapse, 'RT', 'rt-cover')
            }
            if (pLV.cdCollapse == 'Y') {
                $('#content-chronic-disease').removeClass('in');
                pLV.CDcoverSlider = false;

                pLV.coverShowHide('', 'CD', 'pl-chronic-disease')

            }

        }
        else {
            $timeout(function () {
                angular.element('.hide-answer').triggerHandler('click');
            }, 0);
            if (pLV.paCollapse == 'Y') {
                $('#content-personal-accident').removeClass('in');
                pLV.PLcoverSlider = false;
                pLV.coverShowHide(pLV.paCollapse, 'PAC', 'pl-personal-accident-cover')
            }
            if (pLV.ciCollapse == 'Y') {
                $('#content-critical-illness').removeClass('in');
                pLV.CIcoverSlider = false;
                pLV.coverShowHide(pLV.ciCollapse, 'CIC', 'ci-critical-illness-cover')
            }
            if (pLV.iCMICollapse == 'Y') {
                $('#content-international-coverage').removeClass('in');
                pLV.ICMIcoverSlider = false;
                pLV.coverShowHide(pLV.iCMICollapse, 'ICMI', 'icmi-international-cover')
            }
            if (pLV.hPCCollapse == 'Y') {
                $('#content-hpc-coverage').removeClass('in');
                pLV.HPCcoverSlider = false;
                pLV.coverShowHide(pLV.hPCCollapse, 'HPC', 'hpc-cover')
            }
            if (pLV.oPDCollapse == 'Y') {
                $('#content-opd-coverage').removeClass('in');
                pLV.OPDcoverSlider = false;
                pLV.coverShowHide(pLV.oPDCollapse, 'OPD', 'opd-cover')
            }
            if (pLV.rTCollapse == 'Y') {
                $('#content-rt-coverage').removeClass('in');
                pLV.RoomcoverSlider = false;
                pLV.coverShowHide(pLV.rTCollapse, 'RT', 'rt-cover')
            }
            if (pLV.cdCollapse == 'Y') {
                $('#content-chronic-disease').removeClass('in');
                pLV.CDcoverSlider = false;

                pLV.coverShowHide('', 'CD', 'pl-chronic-disease')

            }
        }
        pLV.fetchInsuredMembers();

    }

    /* End of updating soft details data */



    /* To delete particular member */

    pLV.cKUpdateDeleteMember = function (member, ind, operation) {
        $rootScope.callGtag('click-icon-x', 'quote', 'cK-quote_plan_delete-member');
        if (pLV.selectedMember.length == 1 && operation == 'deleteMember') {
            $rootScope.alertConfiguration('E', "You cannot delete this member.", "delete_member_alert");
            return false;
        }
        if (member.RelationType == 'S' && operation == 'deleteMember' && pLV.platinumQuoteDetails.PolicyType == "FF") {
            $rootScope.alertConfiguration('E', "You cannot delete Self in Family Floater.", "delete_member_alert");
            return false;
        }
        for (var i = 0; i < pLV.selectedMember.length; i++) {
            if (member.RelationType == pLV.selectedMember[i].RelationType) {
                pLV.selectedMember[i].ProductCode = 'PL';
                if (operation == 'updateMember') {
                    pLV.previousAge = pLV.membersDetails[i + 1].Age
                    pLV.membersDetails[i + 1].Age = pLV.selectedMember[i].Age
                    pLV.addUpdateMember(member, ind, pLV.previousAge)
                } else {
                    pLV.deleteMember(pLV.selectedMember[i], ind);
                }

                break;
            }
        }
    }

    /* End of deleting particular member */

    /* updated the Preminum value */

    pLV.updatePreminum = function () {
        /*angular.forEach(pLV.selectedMember, function(v, i) {
            if (v.RelationType == "S" || v.RelationType == "SPO" || v.RelationType == "F" || v.RelationType == "M" || v.RelationType == "FIL" || v.RelationType == "MIL") {
                pLV.showCrossSell = true;
            }
        })*/
        /*if (pLV.platinumQuoteDetails.PolicyType == "FF") {
            if (pLV.selectedMember[0].SumInsured > pLV.selectedMember[1].SumInsured) {
                pLV.selectedMember[1].SumInsured = pLV.selectedMember[0].SumInsured;
                pLV.sumInusred = pLV.selectedMember[1].SumInsured;
            } else if (pLV.selectedMember[0].SumInsured < pLV.selectedMember[1].SumInsured) {
                pLV.selectedMember[0].SumInsured = pLV.selectedMember[1].SumInsured;
                pLV.sumInusred = pLV.selectedMember[0].SumInsured;
            }
        }*/

        for (var i = 0; i < pLV.selectedMember.length; i++) { 
            pLV.selectedMember[i]["VaccineCoverSI"] = (pLV.selectedMember[i]["VaccineCoverSI"] == "--Select--") ? '' : pLV.selectedMember[i]["VaccineCoverSI"];  

            // if(pLV.CancerHospitalizationBooster == 'Y' && parseInt(pLV.selectedMember[i].SumInusred) > 10000000 ){
            //     pLV.selectedMember[i].SumInusred = pLV.oldSI;
            // }
        }

        var plPreminumObj = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Savings": true,
            "Platinum": {

                "AFFD": "N",
                "EMPD": "N",
                "FAMD": "N",
                "MemberDetails": pLV.selectedMember,
                "PaymentType": null,
                "PlanName": pLV.platinumQuoteDetails.PlanName, //"Platinum - Essential",
                "PolicyTenure": pLV.platinumQuoteDetails.PolicyTenure,
                "PolicyType": pLV.platinumQuoteDetails.PolicyType,
                "Zone": pLV.platinumQuoteDetails.Zone,

            }
        }

        //console.log(pLV.selectedMember);

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", plPreminumObj, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    pLV.platinumPreminumObj.TotalPremium = 0
                    pLV.platinumPreminumObj.TotalPremium = data.ResponseData.TotalPremium;
                    pLV.secondYearSaving = data.ResponseData.TenureSavings.TotalTwoYearSaving
                    pLV.threeYearSaving = data.ResponseData.TenureSavings.TotalThreeYearSaving
                    pLV.platinumPreminumObj.ProductPremium = data.ResponseData.ProductPremium
                    pLV.PremiumDetail = data.ResponseData
                    pLV.platinumPreminumObj.AddonGSTPremium = data.ResponseData.AddonGSTPremium;
                    //console.log("pLV.platinumPreminumObj.AddonPremium: " + pLV.platinumPreminumObj.AddonPremium);

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

    pLV.updateTenure = function (tenure) {
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
                    pLV.platinumQuoteDetails.PolicyTenure = tenure;



                    pLV.updatePreminum();
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

    pLV.openAddMemberModel = function () {
        pLV.fetchInsuredMembers();
        $('#change-group-member').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    /* End of opening add member modal */

    /* validate mmember construct on submit */
    /*function validateMemberconstruct(){
        var validconstruct = true;

        for( var i = 0 ; i < )
    }
*/

    /* validate mmember construct on submit ends*/





    /* Submit Activ Care Quote */

    pLV.submitplatinumQuote = function (event) {

        var errors = "<ul>";
        var errorsCount = 0;

        for (var i = 0; i < pLV.selectedMember.length; i++) {
            if (pLV.platinumQuoteDetails.PolicyType == 'FF' && pLV.selectedMember[i].RelationWithProposer == 'KID' && pLV.selectedMember[i].Age > 25) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Age of kid cannot be greater than 25 in case of family floater policy type",

                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true
                }
                return false;

            }
            else if (pLV.platinumQuoteDetails.PolicyType == 'MI' && pLV.selectedMember[i].RelationWithProposer == 'KID' && pLV.selectedMember[i].Age < 5) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Age of kid cannot be less than 5 in case of multi individual policy type",

                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true
                }
                return false;
            }
            if (pLV.pincode == "" || pLV.pincode == undefined) {
                $rootScope.alertConfiguration('E', "Please enter pincode");
                return false;
            }
        }
        event.target.disabled = false;
        event.target.innerText = "Proceed";

        var plQuoteSubmit = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "PLUpdateQuote": {

                "AFFD": "N",
                "EMPD": "N",
                "FAMD": "N",
                "MemberDetails": pLV.selectedMember,
                "PaymentType": null,
                "PlanName": "Platinum - Essential",
                "PolicyTenure": pLV.platinumQuoteDetails.PolicyTenure,
                "PolicyType": pLV.platinumQuoteDetails.PolicyType,
                "Zone": pLV.platinumQuoteDetails.Zone,
                "PINCode":pLV.pincode,
            }
        }

        var lemniskObj = {
            "Selected Members": pLV.selectedMember,
            "PlanName": pLV.PlanName + ' ' + pLV.productPlanName,
            "PolicyTenure": pLV.platinumQuoteDetails.PolicyTenure,
            "PolicyType": pLV.platinumQuoteDetails.PolicyType,
            "Premium Amount": pLV.PremiumDetail.TotalPremium
        };
        $rootScope.lemniskTrack("", "", lemniskObj);
        /*var lemniskObjPass = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Savings": true,
            "CKUpdateQuote": {
                "PolicyType": pLV.platinumQuoteDetails.PolicyType,
                "PaymentType": "UPFRONT",
                "PolicyType": pLV.platinumQuoteDetails.PolicyType,
               
                "MemberDetails": pLV.selectedMember
            }
        }

        var lemeiskData   = lemniskObjPass
        
        $rootScope.leminiskObj =  lemeiskData
        
        $rootScope.lemniskCodeExcute();*/
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", plQuoteSubmit, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

            if (response.ResponseCode == 1) {

                $location.url('platinum-proposer-details');

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



    $rootScope.$on('$routeChangeStart', function (scope, next, current) {
        if (next.$$route.controller == "plansQuoteCtrl" && current.$$route.controller == 'platinumQuoteNewQuoteController' && pLV.platinumQuoteDetails.Source == 'DNC_HDFC_SECURITIES') {
            // Show here for your model, and do what you need**
            $location.url('pre-quote');
        }
    });

    /* Modify Health Add On at Member Level */

    pLV.oCBMemberLevel = function(param, val, coverName) {
        var anyMemberIsPresent = false;
        if(coverName == 'CancerHospitalizationBooster' && parseInt(param.SumInsured) > 10000000){            
            pLV[coverName] = 'N'
            $rootScope.alertConfiguration('E', "Only applicable for sum insured upto Rs. 1 Crore");
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationType == param.RelationType ) {
                    pLV.selectedMember[i][coverName] = 'N'
                }
            }
        } else{
            if (val == 'Y') {
                for (var i = 0; i < pLV.selectedMember.length; i++) {
                    if (pLV.selectedMember[i].RelationType == param.RelationType ) {
                        pLV.selectedMember[i][coverName] = val
                    }
                }
                pLV[coverName] = 'Y'
            } else {
                for (var i = 0; i < pLV.selectedMember.length; i++) {
                    if (pLV.selectedMember[i].RelationType == param.RelationType) {
                        pLV.selectedMember[i][coverName] = val
                    }
                }
                angular.forEach(pLV.selectedMember, function(v, i) {
                    if (v[coverName] == 'Y')
                        anyMemberIsPresent = true;
                })
                if (anyMemberIsPresent) {
                    pLV[coverName] = 'Y'
                } else {
                    pLV[coverName] = 'N'
                }
            }
        }
        pLV.updatePreminum();
    }

    pLV.vaccineCoverMemberLevel = function(param, val, siAmount, coverName) {
        var anyMemberIsPresent = false;
        val = (siAmount > 0) ? 'Y' : 'N';
        
        if (val == 'Y') {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationType == param.RelationType ) {
                    pLV.selectedMember[i][coverName] = val
                    pLV.selectedMember[i]["VaccineCoverSI"] = siAmount
                }
            }
            pLV[coverName] = 'Y'
        } else {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                if (pLV.selectedMember[i].RelationType == param.RelationType) {
                    pLV.selectedMember[i][coverName] = val
                    pLV.selectedMember[i]["VaccineCoverSI"] = siAmount
                }
            }
            angular.forEach(pLV.selectedMember, function(v, i) {
                if (v[coverName] == 'Y')
                    anyMemberIsPresent = true;
            })
            if (anyMemberIsPresent) {
                pLV[coverName] = 'Y'
            } else {
                pLV[coverName] = 'N'
            }
        }
        pLV.updatePreminum();
    }

    /* Modify Health Add On at Member Level Ends*/

    /* Modify Health Add On at Product Level */

    pLV.vaccineCoverProductLevel = function(param, coverName , $event) {
        console.log(param)
        if (param == 'N') {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                pLV.selectedMember[i][coverName] = 'N'
                pLV.selectedMember[i]["VaccineCoverSI"] = '--Select--'
            }
            pLV[coverName] = 'N'
        }
        if (param == 'Y') {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                pLV.selectedMember[i][coverName] = 'Y'
                pLV.selectedMember[i]["VaccineCoverSI"] = '1000'
            }
            pLV[coverName] = 'Y'
        }
        pLV.updatePreminum();
    }

    pLV.oCBProductLevel = function(param, coverName , $event) {
        
        if(coverName == 'CancerHospitalizationBooster' && param == 'Y' && parseInt(pLV.sumInsured) > 10000000){
            pLV[coverName] = 'N'
            $rootScope.alertConfiguration('E', "Only applicable for sum insured upto 1 Crore");
            $rootScope.$apply();
            return false;
        }

        if (param == 'Y') {
            for (var i = 0; i < pLV.selectedMember.length; i++) {   
                if(coverName == 'CancerHospitalizationBooster' && parseInt(pLV.selectedMember[i].SumInsured) > 10000000)
                {
                    pLV.selectedMember[i][coverName] = 'N'
                    pLV[coverName] = 'N'
                    $rootScope.alertConfiguration('E', "Only applicable for sum insured upto Rs. 1 Crore");
                }
                else {            
                    pLV.selectedMember[i][coverName] = 'Y' 

                    for (var j = 0; j < pLV.ReductionInPEDWaitingPeriodOptions.length; j++) {
                        if(pLV.ReductionInPEDWaitingPeriodOptions[j].RPEDWPCoverName == coverName){
                            pLV.selectedMember[i]['ReductionInPEDWaitingPeriod'] = 'Y' 
                            pLV.ReductionInPEDWaitingPeriod = 'Y'
                            pLV.ReductionInPEDWaitingPeriodText = pLV.ReductionInPEDWaitingPeriodOptions[j].RPEDWPText
                        } 
                        if(pLV.ReductionInPEDWaitingPeriodOptions[j].RPEDWPCoverName != coverName){
                            pLV.selectedMember[i][pLV.ReductionInPEDWaitingPeriodOptions[j].RPEDWPCoverName] = 'N' 
                        } 
                    }  
                    
                    if(coverName == 'CancerHospitalizationBooster' && parseInt(pLV.selectedMember[i].Age) > 65){
                        pLV[coverName] = 'N'
                        $rootScope.alertConfiguration('E', "This Add On is available for minimum age 91 days and maximum age 65 Years");
                        $rootScope.$apply();
                        return false;
                    }
                    pLV[coverName] = 'Y'
                }
            }
        } else {
            for (var i = 0; i < pLV.selectedMember.length; i++) {
                pLV.selectedMember[i][coverName] = 'N'

                for (var j = 0; j < pLV.ReductionInPEDWaitingPeriodOptions.length; j++) {
                    if(pLV.ReductionInPEDWaitingPeriodOptions[j].RPEDWPCoverName == coverName){
                        pLV.selectedMember[i]['ReductionInPEDWaitingPeriod'] = 'N' 
                        pLV.ReductionInPEDWaitingPeriod = 'N'
                        pLV.ReductionInPEDWaitingPeriodText = pLV.ReductionInPEDWaitingPeriodOptions[j].RPEDWPText
                    } 
                }  
            }
        }
        pLV.updatePreminum()        
    }

    /* Modify Health Add On at Product Level Ends*/

}])