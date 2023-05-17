var afApp = angular.module("activFitQuoteApp", []);

afApp.controller("activFitQuoteController", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$q', function ($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $q) {

    /* Data Inilization */

    var aFV = this;
    var aS = appService;
    aFV.plantp = "fal"

    aFV.validForm = true;
    aFV.productSelctedInCross = 'AC'

    var goingOn = false;
    aFV.planName = "activ fit";
    // aFV.productPlanName = "Essential";
    aFV.showCrossSell = false;
    var insuredMemberDetails;
    aFV.PLcoverSlider = false;
    aFV.CIcoverSlider = false;
    aFV.ICMIcoverSlider = false;
    aFV.HPCcoverSlider = false;
    aFV.OPDcoverSlider = false;
    aFV.CDcoverSlider = false;
    aFV.RoomcoverSlider = false;
    aFV.TCcoverSlider = false;
    aFV.EMIcoverSlider = false;
    aFV.PWcoverSlider = false;
    aFV.maternity = 'N'
    aFV.cdCollapse = 'Y';
    aFV.rTCollapse = 'Y'
    aFV.wavierCopay = 'N';
    aFV.roomUpgradeText = "";

    aFV.BP_YN = 'N'
    aFV.initSlider = false;
    aFV.sumInusred = ""
    aFV.selectedMember = [];
    aFV.tempUNSelectedMembersForTwo = []
    aFV.tempUNSelectedMembers = [];

    aFV.emiCashArray = [];
    aFV.oPDArray = [];
    aFV.roomArray = ["Single", "ANY", "SHARED"];

    aFV.fMember = false;

    for (var i = 10000; i <= 100000; i = i + 10000) {
        //var objVal = ''

        aFV.emiCashArray.push({
            "key": String(i),
            "val": i
        })


    }

    for (var i = 5000; i <= 20000; i = i + 1000) {
        //var objVal = ''

        aFV.oPDArray.push({
            "key": String(i),
            "val": i
        })


    }
    // console.log(aFV.hospicash)

    /* End of data inilization */


    function loadOwlCarousel(idName) {
        aFV.initSlider = true;
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
       if (coverName == 'TC') {
            aFV.TCcoverSlider = true;
        }
        else if (coverName == 'EMI') {
            aFV.EMIcoverSlider = true;
        }
        else if (coverName == 'PWC') {
            aFV.PWcoverSlider = true;
        }
        else if (coverName == 'NON') {
            aFV.NONcoverSlider = true;
        }
        else if (coverName == 'OPD') {
            aFV.OPDcoverSlider = true;
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
        aFV.CDcoverSlider = true

        $timeout(function () {
            $("#" + coruselId).owlCarousel({
                items: 2,
                navigation: true,
                navigationText: ["", ""],
            });
        }, 500);
    }

    
    /* updated the Preminum value */
    aFV.setPlPreminumObj = function () {
    aFV.plPreminumObj = {
        "ReferenceNumber": sessionStorage.getItem('rid'),
        "Savings": true,
        "Fit": {
            "AFFD": "N",
            "EMPD": "N",
            "FAMD": "N",
            "MemberDetails": aFV.selectedMember,
            "PaymentType": null,
            "PlanName": aFV.fitQuoteDetails.PlanName,
            "PolicyTenure": aFV.fitQuoteDetails.PolicyTenure,
            "PolicyType": aFV.fitQuoteDetails.PolicyType,
            "SuperNoClaimBonus":aFV.SuperNoClaimBonus == "Y"?"Y":"N",
            "PremiumWaiver":aFV.pwcCollapse == "Y"?"Y":"N",
            "NonMedicalExpensesWaiver":aFV.nonCollapse == "Y" && aFV.fitQuoteDetails.PolicyType =="FF" ?"Y":"N",
            "ReductionInmaternityWP":aFV.maternity
            // "Zone": aFV.fitQuoteDetails.Zone,

        }
    }

    if(aFV.fitQuoteDetails.PolicyType == "MI"){
        aFV.plPreminumObj.Fit.PremiumWaiver = "";
    }
    }
    aFV.updatePreminum = function () {
        aFV.setPlPreminumObj();
        for (let m = 0; m < aFV.selectedMember.length; m++) {

                if(aFV.maternity == "Y" && aFV.selectedMember[m].Gender == "0"){
                    aFV.selectedMember[m].ReductionInMaternityWP = "Y";
                }
                else{
                    aFV.selectedMember[m].ReductionInMaternityWP = "N";
                }   
        }

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", aFV.plPreminumObj, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    aFV.aFVplatinumPreminumObj.TotalPremium = 0
                    aFV.PremiumDetail = data.ResponseData
                    aFV.aFVplatinumPreminumObj.TotalPremium = data.ResponseData.TotalPremium;
                    aFV.secondYearSaving = data.ResponseData.TenureSavings.TotalTwoYearSaving
                    aFV.threeYearSaving = data.ResponseData.TenureSavings.TotalThreeYearSaving
                    aFV.aFVplatinumPreminumObj.ProductPremium = data.ResponseData.ProductPremium

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
    aFV.isSelfPResent = false;

    $(document).ready(function () {

        $('.show-answer').on('click', function () {
            // var isChronicPresent = false;
            if (aFV.selectedMember.length == 1) {
                $rootScope.alertConfiguration('E', "Family floater is only applicable for two members ");
                $rootScope.$apply();
                $timeout(function () {
                    angular.element('.hide-answer').triggerHandler('click');
                }, 0);
                return false;
            }

            for (var i = 0; i < aFV.selectedMember.length; i++) {
                if (aFV.selectedMember[i].RelationWithProposer == "SELF") {
                    aFV.isSelfPResent = true;
                }
            }

            if (!aFV.isSelfPResent) {
                $rootScope.alertConfiguration('E', "Self is mandatory for Family Floater Policy ");
                $rootScope.$apply();
                return false;
            }
            // if (isChronicPresent) {
            //     $rootScope.alertConfiguration('E', "Family Floater Policy is not applicable in case of any chronic condition");
            //     $rootScope.$apply();
            //     return false;
            // }
            var deletememberedArray = [];

            for (var i = 0; i < aFV.selectedMember.length; i++) {
                if (aFV.selectedMember[i].RelationWithProposer == "FATHER" || aFV.selectedMember[i].RelationWithProposer == "MOTHER" || aFV.selectedMember[i].RelationWithProposer == "FATHER-IN-LAW" || aFV.selectedMember[i].RelationWithProposer == "MOTHER-IN-LAW" || aFV.selectedMember[i].RelationWithProposer == "BROTHER" || aFV.selectedMember[i].RelationWithProposer == "SISTER" || aFV.selectedMember[i].RelationWithProposer == "GRANDFATHER" || aFV.selectedMember[i].RelationWithProposer == "GRANDMOTHER" || aFV.selectedMember[i].RelationWithProposer == "GRANDSON" || aFV.selectedMember[i].RelationWithProposer == "GRANDDAUGHTER" || aFV.selectedMember[i].RelationWithProposer == "SON-IN-LAW" || aFV.selectedMember[i].RelationWithProposer == "DAUGHTER-IN-LAW" || aFV.selectedMember[i].RelationWithProposer == "BROTHER-IN-LAW" || aFV.selectedMember[i].RelationWithProposer == "SISTER-IN-LAW" || aFV.selectedMember[i].RelationWithProposer == "NEPHEW" || aFV.selectedMember[i].RelationWithProposer == "NIECE") {

                    deletememberedArray.push(aFV.selectedMember[i])
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
            else {
                aFV.fitQuoteDetails.PolicyType = "FF"
                
                $timeout(function () {
                    loadOwlCarousel('ci-sum-isnured-slider')
                }, 300);
                for (var i = 0; i < aFV.selectedMember.length; i++) {
                    aFV.selectedMember[i].RoomType = aFV.selectedMember[0].RoomType
                    aFV.selectedMember[i].hospitalCash_SI = aFV.selectedMember[0].hospitalCash_SI
                }
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
                        aFV.fitQuoteDetails.PolicyType = "FF"
                        //aFV.initSlider = false;

                        $timeout(function () {
                            loadOwlCarousel('ci-sum-isnured-slider')
                        }, 300);

                        aFV.updateSoftDetails("", "", "")


                        aFV.updatePreminum();
                    })
            }
            //console.log(deletememberedArray)


        });

       
            $('.hide-answer').on('click', function () {
                if(aFV.fitPlanName == 'prefered'){
                aFV.fitQuoteDetails.PolicyType = "FF"
                $timeout(function () {
                    loadOwlCarousel('ci-sum-isnured-slider')
                }, 300);
                    return false;
                }
                aFV.fitQuoteDetails.PolicyType = "MI"
                var childCount = 0;
                var isChildBelowFive = false;
    
                for (var i = 0; i < aFV.selectedMember.length; i++) {
                    if (aFV.selectedMember[i].RelationWithProposer == 'KID') {
                        childCount++;
                        if (parseInt(aFV.selectedMember[i].Age) < 5) {
                            isChildBelowFive = true;
                        }
                    }
                }
    
                if (childCount > 0 && isChildBelowFive == true) {
                    $rootScope.alertConfiguration('E', "Multi-individual is only applicable for above 5 years kids ");
                    angular.element('.show-answer').triggerHandler('click');
                } else {
                    aFV.fitQuoteDetails.PolicyType = "MI";
                }
    
                $timeout(function () {
                    loadOwlCarousel('ci-sum-isnured-slider11');
                }, 300);
            });
        

    });

    aFV.updatePolicyType = function(PT){
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdatePolicyType", {
            "ReferenceNo":sessionStorage.getItem('rid'),
            "PolicyType":PT
        }, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (data) {
            aFV.updatePreminum()
           
        }, function (err) { })
    }

    

    aFV.reSetCovers = function (PT){

        for (var i = 0; i < aFV.selectedMember.length; i++) {
            if (aFV.selectedMember[i].RelationWithProposer == "SELF") {
                aFV.isSelfPResent = true;
            }
        }
        if (aFV.selectedMember.length == 1 && PT =="FF") {
            return false;
        }

        if (!aFV.isSelfPResent  && PT =="FF") {
            return false;
        }

        if(aFV.fitPlanName == 'prefered' && PT =="MI"){
            return false;
        }

        let arr = ['content-opd-coverage', 'content-non-coverage', 'content-emi-coverage', 'premium-waiver-cover', 'content-tc-coverage']
        aFV.travelCollapse = "N";
        aFV.pwcCollapse = "N";
        aFV.emiCollapse = "N";
        // aFV.SuperNoClaimBonus = "N";
        aFV.nonCollapse = "N";
        aFV.oPDCollapse = "N";
        aFV.maternity = "N";

        angular.forEach(aFV.selectedMember, function (v, i) {
            v.EMIProtect = '';
            v.EMIProtectCoverSuminsured = '';
            v.NonMedicalExpensesWaiver = '';
            v.OPDExpenses = 'N';
            v.PremiumWaiver = "";
            v.ReductionInMaternityWP = "N"
            // v.SuperNoClaimBonus = "N";
            v.TravelCoverSumInsured= "";
            v.TravelProtect= "";
        });

        for (let i = 0; i < arr.length; i++) {
            $('#'+arr[i]).removeClass('in');
        }

        aFV.fitQuoteDetails.PolicyType = PT;

        aFV.updatePolicyType(PT);

    }



    /* To Fetch Family Members for active care */

    aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
        "Name": "getACRelation"
    }, true, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            aFV.intitalACMemberList = data.ResponseData;
            aFV.activeCareFamilyContruct = data.ResponseData;
            fetchQuoteDetails();
        }, function (err) { })

    /* End of fetching family members active care */


    /* To fetch Quote details */
    aFV.d_dis =  false;
    aFV.f_dis =  false;

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
               
                if (data.ResponseCode == 1) {
                    aFV.fitQuoteDetails = data.ResponseData.FITQuote;


                    $rootScope.leminiskObj = data.ResponseData;
                    aFV.pincode = aFV.fitQuoteDetails.PINCode; 
                    aFV.fitQuoteDetails.PINCode != "" ?  aFV.changePinCode(aFV.fitQuoteDetails.PINCode): "";
                    $rootScope.lemniskCodeExcute();
                    aFV.aFVplatinumPreminumObj = data.ResponseData.PremiumDetail;
                    aFV.selectedMember = aFV.fitQuoteDetails.MemberDetails;
                    aFV.fitPlanName = aFV.selectedMember[0].PlanName;
                    var planNameInt = parseInt(aFV.fitQuoteDetails.PlanType);
                    aFV.d_dis =  aFV.aFVplatinumPreminumObj.DirectPurchaseDiscount == "Y"?true:false;
                    aFV.f_dis =  aFV.aFVplatinumPreminumObj.FamilyDisount == "Y"?true:false;

                    aFV.productPlanName = aFV.aFVplatinumPreminumObj.ProductPremium[0].ProductName;
                    let list = document.getElementsByClassName("index-ref")
                
                    for (let i_ref = 0; i_ref < list.length; i_ref++) { //for header Index
                        if(!aFV.d_dis && !aFV.f_dis && i_ref > 1){
                            list[i_ref].innerHTML = i_ref;
                        }
                        else{
                            list[i_ref].innerHTML = i_ref + 1;
                        }
                    }
                    console.log(list, "header Index");
                   
                    sessionStorage.setItem('plPlan', aFV.productPlanName)
                    //
                    if (aFV.fitQuoteDetails.PolicyType == "FF" && aFV.selectedMember[0].RelationWithProposer == "SELF") {
                        $timeout(function () {
                            angular.element('.show-answer').triggerHandler('click');
                        }, 0);
                        $('#content-rt-coverage').removeClass('owl-carousel buy-owl-carousel');
                        $('#content-hpc-coverage').removeClass('owl-carousel buy-owl-carousel cK-carousel');
                        aFV.sumInusred = aFV.fitQuoteDetails.MemberDetails[0].SumInsured;
                        for (var j = 0; j < aFV.fitQuoteDetails.MemberDetails.length; j++) {
                            if(aFV.fitQuoteDetails.MemberDetails[j].Gender == "0"){
                                aFV.fMember = true
                            }
                           

                            if (aFV.fitQuoteDetails.MemberDetails[j].SumInsured > aFV.sumInusred) {
                                aFV.sumInusred = aFV.fitQuoteDetails.MemberDetails[j].SumInsured
                            }



                            if(aFV.fitQuoteDetails.MemberDetails[j].TravelProtect == "Y"){
                                aFV.travelCollapse = "Y";
                                aFV.TCcoverSlider = true;
                                $('#content-tc-coverage').collapse('show');
                                coverCcorousel('TC', 'tc-cover');
                            }


                            if(aFV.fitQuoteDetails.PremiumWaiver == "Y"){
                                aFV.pwcCollapse = "Y"
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].EMIProtect == "Y"){
                                aFV.emiCollapse = "Y";
                                aFV.EMIcoverSlider = true;
                                $('#content-emi-coverage').collapse('show');
                                coverCcorousel('EMI', 'emi-cover');
                            }

                           
                            if(aFV.fitQuoteDetails.SuperNoClaimBonus == "Y"){
                                aFV.SuperNoClaimBonus = "Y"
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].NonMedicalExpensesWaiver == "Y"){
                                aFV.nonCollapse = "Y";
                                aFV.NONcoverSlider = true;
                                $('#content-non-coverage').collapse('show');
                                coverCcorousel('NON', 'non-cover');
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].OPDExpenses == "Y"){
                                aFV.oPDCollapse = "Y";
                                aFV.OPDcoverSlider = true;
                                $('#content-opd-coverage').collapse('show');
                                coverCcorousel('OPD' , 'opd-cover');
                            }


                        }
                    } else {
                        aFV.fitQuoteDetails.PolicyType == "MI"
                        $timeout(function () {
                            angular.element('.hide-answer').triggerHandler('click');
                        }, 0);
                        aFV.sumInusred = aFV.fitQuoteDetails.MemberDetails[0].SumInsured;

                        for (var j = 0; j < aFV.fitQuoteDetails.MemberDetails.length; j++) {
                            if(aFV.fitQuoteDetails.MemberDetails[j].Gender == "0"){
                                aFV.fMember = true
                            }
                            
                            if (aFV.fitQuoteDetails.MemberDetails[j].SumInsured > aFV.sumInusred) {
                                aFV.sumInusred = aFV.fitQuoteDetails.MemberDetails[j].SumInsured
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].TravelProtect == "Y"){
                                aFV.travelCollapse = "Y"
                                aFV.TCcoverSlider = true;
                                $('#content-tc-coverage').collapse('show');
                                coverCcorousel('TC', 'tc-cover');
                            }

                            if(aFV.fitQuoteDetails.PremiumWaiver == "Y"){
                                aFV.pwcCollapse = "Y";
                                $('#premium-waiver-cover').collapse('show');
                                coverCcorousel('PWC', 'pcw-cover');
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].EMIProtect == "Y"){
                                aFV.emiCollapse = "Y";
                                aFV.EMIcoverSlider = true;
                                $('#content-emi-coverage').collapse('show');
                                coverCcorousel('EMI', 'emi-cover');
                            }

                            if(aFV.fitQuoteDetails.SuperNoClaimBonus == "Y"){
                                aFV.SuperNoClaimBonus = "Y"
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].NonMedicalExpensesWaiver == "Y"){
                                aFV.nonCollapse = "Y";
                                aFV.NONcoverSlider = true;
                                $('#content-non-coverage').collapse('show');
                                coverCcorousel('NON', 'non-cover');
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].OPDExpenses == "Y"){
                                aFV.oPDCollapse = "Y";
                                aFV.OPDcoverSlider = true;
                                $('#content-opd-coverage').collapse('show');
                                coverCcorousel('OPD' , 'opd-cover');
                            }

                            if(aFV.fitQuoteDetails.MemberDetails[j].maternity == "Y"){
                                aFV.maternity = "Y";
                            }
                        }
                    }
                    
                    aFV.healthCareWorkerDetails = aFV.fitQuoteDetails.MemberDetails[0].HealthCareWorkerDetail;
                    // loadOwlCarousel();
                    aFV.setPlPreminumObj();
                    aFV.updatePreminum();
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
    aFV.changePinCode = function (pinCode) {
        if(pinCode != undefined && pinCode.length == 6 ){
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/PinCode", {
            "PinCode": pinCode,
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    aFV.fitQuoteDetails.Zone = data.ResponseData.Zone;
                    aFV.updatePreminum();
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
                            aFV.pincode = "";
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
                aFV.sumAmounts = data.ResponseData;
            } else {

            }
        }, function (err) {

        })


    /* End of fetching sum insured data */

    /* Change gender event */

    aFV.changeGender = function (member) {
        angular.forEach(aFV.membersDetails, function (v, i) {
            if (v.RelationWithProposer == "SELF") {
                v.Gender = member.Gender;
                aFV.addUpdateMember(angular.copy(v), i - 1, v.Age);
                aFV.updatePreminum();
            } else if (v.RelationWithProposer == "SPOUSE") {
                (member.Gender == "1") ? v.Gender = "0" : v.Gender = "1";
                aFV.addUpdateMember(angular.copy(v), i - 1, v.Age);
                aFV.updatePreminum();
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

    aFV.chronicSelect = function (membersDetails) {
        platinumPED = "";
        var chronicSelectCount = 0;
        aFV.fitQuoteDetails.PolicyType = "MI"
        aFV.deleteMemberObj = [];

        $rootScope.alertConfiguration('S', "Premium has been re-calculated basis chronic disease selected", "premium_recalculated_chronic_disease_alert");

        $timeout(function () {
            var returnPED = toFormPED(membersDetails, platinumPED, chronicSelectCount);
            platinumPED = returnPED.platinumPED;
            chronicSelectCount = returnPED.chronicSelectCount;
            aFV.chronicSelectNo = chronicSelectCount;

            for (var i = 0; i < aFV.selectedMember.length; i++) {
                if (aFV.selectedMember[i].RelationType == membersDetails.RelationType) {
                    aFV.selectedMember[i].PreExistingDisease = platinumPED
                }
            }

            $timeout(function () {
                angular.element('.hide-answer').triggerHandler('click');
            }, 0);

        }, 500);
    }

    /* End of chronic condition select */

    /* Wavier of Copay Cover Logic */
    aFV.wavierCopayCover = function (param) {
        for (var i = 0; i < aFV.selectedMember.length; i++) {
            if (param == 'Y') {
                aFV.selectedMember[i].copayment = 'Y'
            } else {
                aFV.selectedMember[i].copayment = 'N'
            }
        }
        aFV.updatePreminum()
    }

    /* Wavier of Copay Cover Logic ends*/



    /* updated the Sum insured value */

    aFV.updateSumInsured = function (param, membersObj) {
        if (membersObj != "") {
            for (var i = 0; i < aFV.selectedMember.length; i++) {
                if (aFV.selectedMember[i].RelationType == membersObj.RelationType) {
                    aFV.selectedMember[i].SumInsured = param;
                }
            }
        } else {
            aFV.sumInusred = param
            for (var i = 0; i < aFV.selectedMember.length; i++) {
                aFV.selectedMember[i].SumInsured = param;
            }
        }

        if (aFV.fitQuoteDetails.PolicyType == 'FF' && aFV.sumInusred <= 300000) {
            for (var i = 0; i < aFV.selectedMember.length; i++) {

                if (aFV.selectedMember[i].SumInsured <= 300000) {
                    aFV.selectedMember[i].RoomType = 'Single'
                }
            }
        }
        else if (aFV.fitQuoteDetails.PolicyType == 'MI') {
            for (var i = 0; i < aFV.selectedMember.length; i++) {
                if (aFV.selectedMember[i].SumInsured < 1000000 && aFV.selectedMember[i].RelationType == membersObj.RelationType) {
                    aFV.selectedMember[i].ICMICoverFlag = 'N'
                }
                if (aFV.selectedMember[i].SumInsured <= 300000) {
                    aFV.selectedMember[i].RoomType = 'Single'
                }
            }
        }

        aFV.updatePreminum()
    }

    /* updated the Sum insured value Ends */

    /* Show Hide Memeber Level Sum insured */
    aFV.coverShowHide = function (param, coverName, coruselId) {
       if(coverName == "TC"){
        // if(aFV.selectedMember.length == 1){
        //     if (param == 'Y'){
        //         aFV.selectedMember[0].TravelCoverSumInsured = "10000";
        //         aFV.selectedMember[0].TravelProtect ="Y";
        //     }
        //     else{
        //         aFV.selectedMember[0].TravelCoverSumInsured = "";
        //         aFV.selectedMember[0].TravelProtect ="N";
        //     }
        //     aFV.updatePreminum();
        // }

        if (param == 'Y'){
            aFV.tc = true; 
            angular.forEach(aFV.selectedMember, function (v, i) {
                aFV.selectedMember[i].TravelCoverSumInsured = "10000";
                aFV.selectedMember[i].TravelProtect = "Y";
            })
            $('#content-tc-coverage').collapse('show');
            aFV.updatePreminum();
        }
        else{
            angular.forEach(aFV.selectedMember, function (v, i) {
                aFV.selectedMember[i].TravelCoverSumInsured = "";
                aFV.selectedMember[i].TravelProtect ="N";
            })
            aFV.tc = false;
            aFV.updatePreminum();
        }
        $timeout(function () {
            coverCcorousel('TC', coruselId);
        }, 300);

        // if (param == 'Y'){
        //     aFV.tc = true; 
        //     $('#content-tc-coverage').collapse('show');
        // }
        // else{
        //     aFV.tc = false;
        // }
        // $timeout(function () {
        //     coverCcorousel('TC', coruselId);
        // }, 300);

        // return false;
       }

       else if(coverName == "M"){
            aFV.updatePreminum();
        }

       else if(coverName == "EMI"){
        if (param == 'Y'){
            aFV.emi = true; 
            angular.forEach(aFV.selectedMember, function (v, i) {
                if(v.RelationWithProposer !="KID"){
                    aFV.selectedMember[i].EMIProtectCoverSuminsured = "10000";
                    aFV.selectedMember[i].EMIProtect = "Y";
                }
            })
            $('#content-emi-coverage').collapse('show');
            aFV.updatePreminum();
        }
        else{
            angular.forEach(aFV.selectedMember, function (v, i) {
                if(v.RelationWithProposer !="KID"){
                aFV.selectedMember[i].EMIProtectCoverSuminsured = "";
                aFV.selectedMember[i].EMIProtect = "N";
                }
            })
            aFV.emi = false;
            aFV.updatePreminum();
        }
        $timeout(function () {
            coverCcorousel('EMI', coruselId);
        }, 300);
       }
       else if(coverName == "PWC"){
        if(aFV.fitQuoteDetails.PolicyType =="FF"){
            aFV.plPreminumObj.Fit['PremiumWaiver'] = param;
            aFV.updatePreminum();
        }
        
        else{
            aFV.plPreminumObj.Fit['PremiumWaiver'] = "";
            if (param == 'Y'){
                angular.forEach(aFV.selectedMember, function (v, i) {
                    if(v.RelationWithProposer !="KID"){
                        aFV.selectedMember[i].PremiumWaiver ="Y"
                    }
                })
                aFV.updatePreminum();
            }
            else{
                angular.forEach(aFV.selectedMember, function (v, i) {
                    if(v.RelationWithProposer !="KID"){
                    aFV.selectedMember[i].PremiumWaiver ="N"
                    }
                })
                aFV.updatePreminum();
            }

            $timeout(function () {
                coverCcorousel('PWC', coruselId);
            }, 300);
            // if(aFV.selectedMember.length == 1){
            //     if (param == 'Y'){
            //         aFV.selectedMember[0].PremiumWaiver ="Y";
            //     }
            //     else{
            //         aFV.selectedMember[0].PremiumWaiver ="N";
            //     }
            //     aFV.updatePreminum();
            // }
        }
          
        }
       else if(coverName == "NON"){
        if(aFV.fitQuoteDetails.PolicyType =="FF"){
            aFV.plPreminumObj.Fit['NonMedicalExpensesWaiver'] = param;
            aFV.updatePreminum();
        }
        else{
            aFV.plPreminumObj.Fit['NonMedicalExpensesWaiver'] = "";
            if (param == 'Y'){
                aFV.non = true; 
                angular.forEach(aFV.selectedMember, function (v, i) {
                    if(v.RelationWithProposer !="KID"){
                    aFV.selectedMember[i].NonMedicalExpensesWaiver ="Y";
                    }
                })
                $('#content-non-coverage').collapse('show');
                aFV.updatePreminum();
            }
            else{
                angular.forEach(aFV.selectedMember, function (v, i) {
                    if(v.RelationWithProposer !="KID"){
                    aFV.selectedMember[i].NonMedicalExpensesWaiver ="N";
                    }
                })
                aFV.non = false;
                aFV.updatePreminum();
            }
            
            $timeout(function () {
                coverCcorousel('NON', coruselId);
            }, 300);
        }
       }
       else if(coverName == "OPD"){
            // if (param == 'Y'){
            //     aFV.opd = true; 
            //     $('#content-opd-coverage').collapse('show');
            //     if(aFV.selectedMember.length == 1){
            //         aFV.selectedMember[0].OPDExpenses ="Y";
            //         aFV.updatePreminum();
            //     }
            // }
            // else{
            //     aFV.opd = false;
            //     if(aFV.selectedMember.length == 1){
            //         aFV.selectedMember[0].OPDExpenses ="N";
            //         aFV.updatePreminum();
            //     }
            // }

            if (param == 'Y'){
                aFV.opd = true; 
                angular.forEach(aFV.selectedMember, function (v, i) {
                    aFV.selectedMember[i].OPDExpenses = "Y";
                })
                $('#content-opd-coverage').collapse('show');
                aFV.updatePreminum();
            }
            else{
                angular.forEach(aFV.selectedMember, function (v, i) {
                    aFV.selectedMember[i].OPDExpenses ="N";
                })
                aFV.opd = false;
                aFV.updatePreminum();
            }
        
        $timeout(function () {
            coverCcorousel('OPD', coruselId);
        }, 300);
       }

    }

    /* Show Hide Memeber Level Sum insured ends */




    /*Change member Level cover sum insured */

    aFV.updateCoverSumInsured = function (value, member, coverName, updateSuminsiuredFlag, i) {

        if (updateSuminsiuredFlag) {
            if (coverName == "TC"){
                if (aFV.selectedMember[i].TravelProtect =="Y"){
                    aFV.selectedMember[i].TravelCoverSumInsured = value? value: "10000"; 
                }
                else{
                    aFV.selectedMember[i].TravelCoverSumInsured = null; 
                }
            }

            if (coverName == "EMI"){
                if (value && aFV.emi){
                    aFV.selectedMember[i].EMIProtect = "Y"; 
                    aFV.selectedMember[i].EMIProtectCoverSuminsured = value.key; 
                }
                else{
                    aFV.selectedMember[i].EMIProtect = "N"; 
                    aFV.selectedMember[i].EMIProtectCoverSuminsured = null; 
                }
            }

        }
        aFV.updatePreminum();

    }

    /*Change member Level cover sum insured ends*/





    /* calculate preminum */

    aFV.calculatePremium = function () {
        aFV.updatePreminum();

    }

    /* calculate preminum Endsd*/

    aFV.changePolicyTypeOnClose = function(){
        // if(aFV.selectedMember.length <= 1){
        //     aFV.fitQuoteDetails.PolicyType = "MI"
        //     $timeout(function () {
        //         angular.element('.hide-answer').triggerHandler('click');
        //     }, 0);
        // }
        // else{
        //     aFV.fitQuoteDetails.PolicyType = "FF"
        //     $timeout(function () {
        //         angular.element('.show-answer').triggerHandler('click');
        //     }, 0);
        // }
    }



    /* Update soft details data */

    aFV.updateSoftDetails = function (op, insuredDetail, index) {

        if (op == 'AddMember') {
            aFV.initSlider = false;
            if (aFV.fitQuoteDetails.PolicyType == "FF") {
                insuredDetail.SumInsured = aFV.sumInusred;
            }
            else {
                insuredDetail.SumInsured = aFV.selectedMember[0].SumInsured;
            }
            if (insuredDetail.RelationWithProposer == 'KID' && insuredDetail.Age < 18) {
                insuredDetail.CICoverFlag = 'N';
                insuredDetail.CICoverSI = aFV.selectedMember[0].CICoverSI;
            }
            else {
                insuredDetail.CICoverFlag = 'N';
                insuredDetail.CICoverSI = aFV.selectedMember[0].CICoverSI;
            }

            if (insuredDetail.RelationWithProposer == 'KID' && insuredDetail.Age < 5) {
                insuredDetail.PACoverFlag = 'N';
            }
            else {
                insuredDetail.PACoverFlag = 'N';
            }

            if (aFV.productPlanName == 'Premier') {
                insuredDetail.CICoverFlag = 'Y';
                insuredDetail.PACoverFlag = 'Y';
            }

            //Gender: "1"
            insuredDetail.ICMICoverFlag = aFV.selectedMember[0].ICMICoverFlag;
            insuredDetail.ICMICoverSI = aFV.selectedMember[0].ICMICoverSI;

            insuredDetail.hospitalCash = aFV.selectedMember[0].hospitalCash;
            insuredDetail.hospitalCash_SI = aFV.selectedMember[0].hospitalCash_SI;

            insuredDetail.opdExpense = aFV.selectedMember[0].opdExpense;
            insuredDetail.opdExpense_SI = aFV.selectedMember[0].opdExpense_SI;

            insuredDetail.PACoverFlag = aFV.selectedMember[0].PACoverFlag;
            insuredDetail.PACoverRiskClass = aFV.selectedMember[0].PACoverRiskClass;
            insuredDetail.PACoverSI = aFV.selectedMember[0].PACoverSI;

            insuredDetail.copayment = aFV.selectedMember[0].copayment;

            insuredDetail.RoomType = aFV.roomArray[0];

            insuredDetail.PreExistingDisease = 'NCHR';
            insuredDetail.BP_YN = 'N';
            insuredDetail.Diabetes_YN = 'N';
            insuredDetail.Asthma_YN = 'N';
            insuredDetail.Cholesterol_YN = 'N';
            //RelationType: "S"
            //RelationWithProposer: "SELF"
            //SumInsured: "1000000"

        

            aFV.selectedMember.push(insuredDetail)
            aFV.calculatePremium();
            // $timeout(function(){
            //  loadOwlCarousel('ci-sum-isnured-slider');
            // },1000);

        }
        if (op == 'UpdateMember' || (op == 'DeleteMember' && insuredDetail.RelationWithProposer != 'KID')) {
            for (var i = 0; i < aFV.selectedMember.length; i++) {
                if (op == 'UpdateMember' && insuredDetail.RelationType == aFV.selectedMember[i].RelationType) {
                    aFV.selectedMember[i].Age = insuredDetail.Age
                    if (insuredDetail.Age > 65) {
                        aFV.selectedMember[i].CICoverFlag = 'N';
                        aFV.selectedMember[i].ICMICoverFlag = 'N';
                        aFV.selectedMember[i].PACoverFlag = 'N';
                    }
                }
                else if (op == 'DeleteMember' && insuredDetail.RelationType == aFV.selectedMember[i].RelationType) {
                    aFV.selectedMember.splice(i, 1)
                    aFV.initSlider = false;
                }
            }

           
            aFV.calculatePremium();
            

            // $timeout(function(){
            //     loadOwlCarousel('ci-sum-isnured-slider');
            // },300);
        }
        
        if (op == 'DeleteMember' && insuredDetail.RelationWithProposer == 'KID') {
            // aFV.initSlider = false;
            fetchQuoteDetails();
        }

        if (aFV.fitQuoteDetails.PolicyType == "FF") {
            $timeout(function () {
                angular.element('.show-answer').triggerHandler('click');
            }, 0);
        }
        else {
            $timeout(function () {
                angular.element('.hide-answer').triggerHandler('click');
            }, 0);
        }

    }

    /* End of updating soft details data */



    /* To delete particular member */

    aFV.PreferError = "You cannot delete this member. Prefered Plan is not applicable for individual."

    aFV.cKUpdateDeleteMember = function (member, ind, operation) {
        $rootScope.callGtag('click-icon-x', 'quote', 'cK-quote_plan_delete-member');
        if (aFV.selectedMember.length == 1 && operation == 'deleteMember') {
            $rootScope.alertConfiguration('E', "You cannot delete this member.", "delete_member_alert");
            return false;
        }
        if (aFV.selectedMember.length <= 2 && aFV.fitPlanName == 'prefered') {
            $rootScope.alertConfiguration('E', aFV.PreferError, "delete_member_alert");
            return false;
        }
        if (member.RelationType == 'S' && operation == 'deleteMember' && aFV.fitQuoteDetails.PolicyType == "FF") {
            $rootScope.alertConfiguration('E', "You cannot delete Self in Family Floater.", "delete_member_alert");
            return false;
        }
        for (var i = 0; i < aFV.selectedMember.length; i++) {
            if (member.RelationType == aFV.selectedMember[i].RelationType) {
                aFV.selectedMember[i].ProductCode = "FIT";
                if (operation == 'updateMember') {
                    aFV.previousAge = aFV.membersDetails[i + 1].Age
                    aFV.membersDetails[i + 1].Age = aFV.selectedMember[i].Age
                    aFV.addUpdateMember(member, ind, aFV.previousAge)
                } else {
                    aFV.deleteMember(aFV.selectedMember[i], ind);
                }

                break;
            }
        }

    }

    /* End of deleting particular member */



    /* Update Tenure */

    aFV.updateTenure = function (tenure) {
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
                    aFV.fitQuoteDetails.PolicyTenure = tenure;



                    aFV.updatePreminum();
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

    aFV.openAddMemberModel = function () {
        aFV.fetchInsuredMembers();
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

    aFV.submitplatinumQuote = function (event) {

        var errors = "<ul>";
        var errorsCount = 0;

        

        for (var i = 0; i < aFV.selectedMember.length; i++) {
            angular.forEach(aFV.selectedMember[i], function(value, key) {
                aFV.selectedMember[i][key]= ""+value;
             });
            if (aFV.fitQuoteDetails.PolicyType == 'FF' && aFV.selectedMember[i].RelationWithProposer == 'KID' && aFV.selectedMember[i].Age > 25) {
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
            else if (aFV.fitQuoteDetails.PolicyType == 'MI' && aFV.selectedMember[i].RelationWithProposer == 'KID' && aFV.selectedMember[i].Age < 5) {
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
            
        }
        event.target.disabled = false;
        event.target.innerText = "Proceed";

        var plQuoteSubmit = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Savings": true,
            "FITUpdateQuote": {

                "AFFD": "N",
                "EMPD": "N",
                "FAMD": "N",
                "MemberDetails": aFV.selectedMember,
                "PaymentType": null,
                "PlanName": aFV.fitPlanName,
                "PolicyTenure": aFV.fitQuoteDetails.PolicyTenure,
                "PolicyType": aFV.fitQuoteDetails.PolicyType,
                "SuperNoClaimBonus":aFV.SuperNoClaimBonus == "Y"?"Y":"N",
                "PremiumWaiver":aFV.pwcCollapse == "Y"?"Y":"N",
                "NonMedicalExpensesWaiver":aFV.nonCollapse  == "Y" && aFV.fitQuoteDetails.PolicyType =="FF"?"Y":"N",
                // "Zone": aFV.fitQuoteDetails.Zone,
                // "PINCode":aFV.pincode,
            }
        }

        var lemniskObj = {
            "Selected Members": aFV.selectedMember,
            "PlanName": aFV.PlanName + ' ' + aFV.productPlanName,
            "PolicyTenure": aFV.fitQuoteDetails.PolicyTenure,
            "PolicyType": aFV.fitQuoteDetails.PolicyType,
            "Premium Amount": aFV.PremiumDetail.TotalPremium
        };
        $rootScope.lemniskTrack("", "", lemniskObj);
        /*var lemniskObjPass = {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "Savings": true,
            "CKUpdateQuote": {
                "PolicyType": aFV.fitQuoteDetails.PolicyType,
                "PaymentType": "UPFRONT",
                "PolicyType": aFV.fitQuoteDetails.PolicyType,
               
                "MemberDetails": aFV.selectedMember
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

                $location.url('fit-proposer-details');

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
        if (next.$$route.controller == "plansQuoteCtrl" && current.$$route.controller == 'activFitQuoteController' && aFV.fitQuoteDetails.Source == 'DNC_HDFC_SECURITIES') {
            // Show here for your model, and do what you need**
            $location.url('pre-quote');
        }
    });

}])