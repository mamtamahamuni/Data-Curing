/*
    
    Health & Lifestyle Controller
    Author: Sunny Khatri
    Date: -----
    Modified By: Pankaj Patil
    
*/
var iDApp = angular.module("healthStyleAppNew", []);

iDApp.controller("healthLifeStyleNew", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$location', '$timeout', 'productValidationService', function($rootScope, appService, ABHI_CONFIG, $filter, $location, $timeout, productValidationService) {


    /* Data initilization */

        var pLS = this;
        var aS = appService;
        $rootScope.hl = true;
        pLS.deletePA = false;
        pLS.showCustomization = false;
        var panCardFlag = false;
        pLS.chronicSelectNo = 0;
        pLS.organSelectedNo = 0;
        pLS.majorSelectedNo = 0;
        pLS.otherSelectedNo = 0;
        pLS.showPerAnum = false;
        pLS.healthDetailsPageType = window.location.hash.substring(3);
        var allMembers = [];
        pLS.productName = sessionStorage.getItem('pName');
        var healthRelatedQuestionsObj = {
            'organRelatedConditions' : ['Heart_YN','LungResp_YN','Digestive_YN','Kidney_YN','Brain_YN','ENT_YN'],
            'majorConditions' : ['Pregnancy_YN','Complication_YN','UnderTreatment_YN','Surgery_YN','BloodTest_YN','AnyCond_YN'],
            'otherConditions' : ['AutoImm_YN','Cancer_YN','Muscle_YN','Sex_YN','Disorder_YN','Gynac_YN','Polio_YN'],
        }
        pLS.membersListArray = [];
        pLS.insuredMembers = [];
        pLS.deleteMemberObj = [];
        pLS.allInsuredMembers = [];
        pLS.loadHelathLifestyleNew = false;
        pLS.lifeStyleNewMembers = [];
        var totalProducts;
        var deleteProductMessage = "<ul>";
        var platinumPED = new String();
        var asLifeStyleNewMembers = [];
        var lifeStyleNewMembers = [];
    /* End of Data initilization */


    /* To fetch insured members for health lifestyle questions */

        function fetchMemberedArrayList() {
            pLS.headerVal = 0;
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetHealthAndLifeStyleMembers", {
                    "ReferenceNumber": sessionStorage.getItem('rid')
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    aS.triggerSokrati(); /* Triggering Sokrati */
                    if (data.ResponseCode == 1) {
                    pLS.lifeStyleNewMembers = data.ResponseData;
                    
                    /* To Set Health&LifestyleNew Members */
                    if (sessionStorage.getItem('asLifeStyleNewMembers') != null && sessionStorage.getItem('asLifeStyleNewMembers') != 'undefined') {
                        asLifeStyleNewMembers = JSON.parse(sessionStorage.getItem('asLifeStyleNewMembers'));
                        if(asLifeStyleNewMembers.length > 0){
                            for(var i=0; i<asLifeStyleNewMembers.length; i++){
                                for(var j=0; j<data.ResponseData.length; j++){
                                    if(asLifeStyleNewMembers[i].ReferenceNumber == data.ResponseData[j].ReferenceNumber && asLifeStyleNewMembers[i].RelationType == data.ResponseData[j].RelationType){
                                        lifeStyleNewMembers.push(data.ResponseData[j]);        
                                    }
                                }
                            }
                        }
                        pLS.lifeStyleNewMembers = lifeStyleNewMembers;
                    }
                    /* To Set Health&LifestyleNew Members */

                        //angular.forEach(data.ResponseData, function(v, i) {
                        angular.forEach(pLS.lifeStyleNewMembers, function(v, i) {
                            switch (v.RelationType) {
                                case "S":
                                    pLS.insuredMembers[0] = v;
                                    break;
                                case "SPO":
                                    pLS.insuredMembers[1] = v;
                                    break;
                                case "F":
                                    pLS.insuredMembers[2] = v;
                                    break;
                                case "M":
                                    pLS.insuredMembers[3] = v;
                                    break;
                                case "FIL":
                                    pLS.insuredMembers[4] = v;
                                    break;
                                case "MIL":
                                    pLS.insuredMembers[5] = v;
                                    break;
                                case "KID1":
                                    pLS.insuredMembers[6] = v;
                                    break;
                                case "KID2":
                                    pLS.insuredMembers[7] = v;
                                    break;
                                case "KID3":
                                    pLS.insuredMembers[8] = v;
                                    break;
                                case "KID4":
                                    pLS.insuredMembers[9] = v;
                                    break;
                                case "BRO":
                                    pLS.insuredMembers[10] = v;
                                    break;
                                case "SISL":
                                    pLS.insuredMembers[11] = v;
                                    break; 
                                case "SIS":
                                    pLS.insuredMembers[12] = v;
                                    break;
                                case "BIL":
                                    pLS.insuredMembers[13] = v;
                                    break; 
                                case "GF":
                                    pLS.insuredMembers[14] = v;
                                    break;
                                case "GM":
                                    pLS.insuredMembers[15] = v;
                                    break;                
                                case "UN":
                                    pLS.insuredMembers[16] = v;
                                    break;
                                case "AU":
                                    pLS.insuredMembers[17] = v;
                                    break;    
                                default:
                                    break;
                            }
                        });
                        pLS.insuredMembers = pLS.insuredMembers.filter(Boolean);
                        if (pLS.insuredMembers.length == 0) {
                            if ($location.$$path == "/cross-sell-health-lifestyle") {
                                $location.url('cross-sell-insured-details?product='+sessionStorage.getItem('productSelctedInCross'));
                            } else if ($location.$$url == "/platinum-health-lifestyle") {
                                $location.url('platinum-insured-details');
                            } else if ($location.$$url == "/activ-care-health-lifestyle") {
                                $location.url('activ-care-insured-details');
                            } else if ($location.$$url == "/arogya-sanjeevani-health-lifestyle-new") {
                                $location.url('arogya-sanjeevani-health-lifestyle');
                            } else {
                                $location.url('rfb-insured-details');
                            }
                            return false;
                        }
                        pLS.getInsuredMemberQuestion(pLS.insuredMembers[0], pLS.headerVal);
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true,
                            "positiveFunction": function() {
                                if ($location.$$url == "/cross-sell-health-lifestyle") {
                                    $location.url('cross-sell-insured-details?product='+sessionStorage.getItem('productSelctedInCross'));
                                } else if ($location.$$url == "/platinum-health-lifestyle") {
                                    $location.url('platinum-insured-details');
                                } else if ($location.$$url == "/activ-care-health-lifestyle") {
                                    $location.url('activ-care-insured-details');
                                } else if ($location.$$url == "/arogya-sanjeevani-health-lifestyle-new") {
                                    $location.url('arogya-sanjeevani-insured-details-insured-details');
                                }   else {
                                    $location.url('rfb-insured-details');
                                }
                            }
                        }
                    }
                }, function(err) {});

        }

        fetchMemberedArrayList();

    /*  End of fetching insured members for health lifestyle questions */

        /* Pan Card Updation Service */

        pLS.getPanCardDetails = function(){
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdatePAN", {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "PAN": pLS.pan
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if (data.ResponseCode == 1) {
                    panCardFlag = true;
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Success",
                        "modalBodyText": "Pan card updated successfully ",
                        "modalSuccessText" : "OK",
                        "showAlertModal": true,
                    }
                }
            }, function(err) {
            });
        }

    /* End of Pan Card Updation */


    /* To fetch all the insured members list */

        function toFetchInsuredMembers() {
            var reqData = $rootScope.encrypt({
                "ReferenceNumber": sessionStorage.getItem('rid')
            });
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetInsuredMembers", {
                "_data": reqData
                }, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    if (data.ResponseCode == 1) {
                        if(data.ResponseData.Tenure == "1"){
                            pLS.showPerAnum = true;
                        }
                        if(data.ResponseData.IsPAN ){
                            panCardFlag = true;
                        }
                        allMembers = data.ResponseData.ProductInsuredDetail;
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {});
        }

        toFetchInsuredMembers();

    /*  End of fetching all insured members List*/


    /* To fetch get insured members questions */

        pLS.getInsuredMemberQuestion = function(insuredMember, val) {
            pLS.headerVal = val
            pLS.activeMember = insuredMember.RelationType;
            $rootScope.callGtag('click-item', 'health-lifestyle' ,'['+pLS.healthDetailsPageType+']_select-['+insuredMember.RelationType+']');
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMemberQuestions", {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "RelationType": insuredMember.RelationType,
                    "RelationWithProposer": insuredMember.RelationWithProposer
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        pLS.productArray = [];
                        pLS.insuredMemberQuestions = data.ResponseData;
                        pLS.preminumArray = pLS.insuredMemberQuestions.PremiumDetail;
                        pLS.preminumArray.TotalPremium = 0;
                        angular.forEach(pLS.preminumArray.ProductPremium,function(v,i){
                            pLS.preminumArray.TotalPremium = parseInt(pLS.preminumArray.TotalPremium) + parseInt(v.Premium);
                        });
                        if( pLS.preminumArray.TotalPremium >= 100000 ){
                            panCardFlag = true;
                        }
                        var chronicSelectCount = 0;

                        if(pLS.insuredMemberQuestions.PLQuestions != null){
                            var returnPED = toFormPED(platinumPED,chronicSelectCount);
                            pLS.platinumPolicyType = pLS.insuredMemberQuestions.PLQuestions.Policytype
                            platinumPED = returnPED.platinumPED;
                            chronicSelectCount = returnPED.chronicSelectCount; 
                        }
                        
                        angular.forEach(pLS.insuredMemberQuestions.PremiumDetail.ProductPremium, function(v, i) {
                            pLS.productArray.push(v.ProductName);
                            if (!(v.isIsPrimaryProduct) && v.ProductName == "PA") {
                                pLS.deletePA = true;
                            }
                        })
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {});
        }

    /* End of fetching get insured members questions */


    /* Function to validate member */

        function memberValidation(){
            totalProducts = allMembers.length;
            angular.forEach(allMembers,function(val,ind){
                for(var i = 0;i<val.InsuredMembers.length;i++){
                    var tempMemberDetails = angular.copy(val.InsuredMembers);
                    if(val.InsuredMembers[i].RelationType == pLS.activeMember){
                        tempMemberDetails.splice(i,1);
                        var errorStatus;
                        switch (val.ProductCode) {
                            case "PL":
                                errorStatus = productValidationService.platinumValidations(tempMemberDetails,pLS.activeMember);
                                break;
                            case "PA":
                                errorStatus = productValidationService.rFBValidations(tempMemberDetails,5,"PA",pLS.activeMember);
                                break;
                            case "CS":
                                errorStatus = productValidationService.rFBValidations(tempMemberDetails,18,"CS",pLS.activeMember);
                                break;
                            case "CI":
                                errorStatus = productValidationService.rFBValidations(tempMemberDetails,5,"CI",pLS.activeMember);
                                break;
                        }
                        if(errorStatus.invalidConstruct && !val.IsPrimaryProduct){
                            deletePrduct(val.ProductCode,val.InsuredMembers[i].RelationWithProposer);
                        }else if(val.IsPrimaryProduct && errorStatus.invalidConstruct){
                            $timeout(function(){
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Warning",
                                    "modalBodyText": "Our apologies, but we cannot offer a policy for this family combination online. You may either try a different family combination or the members may buy individual policies",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "Ok",
                                    "showAlertModal": true,
                                    "hideCloseBtn": true,
                                    "positiveFunction": function(){
                                        $location.url('platinum-quote');
                                    }
                                }
                            },500);
                        }else if(val.IsPrimaryProduct){
                            deleteMember(val.InsuredMembers[i]);
                        }
                        return false;
                    }
                }
            });
        }

    /* End of function to validate member */


    /* Function to form PED */

        function toFormPED(platinumPED,chronicSelectCount){
            var chronicParams = ['BP_YN' , 'Diabetes_YN', 'Asthma_YN', 'Cholesterol_YN'];
            for (var i = 0; i < chronicParams.length; i++) {
                if (pLS.insuredMemberQuestions.PLMemberQuestions[chronicParams[i]] == "Y") {
                    platinumPED = platinumPED + "1";
                    chronicSelectCount = chronicSelectCount + 1;
                } else {
                    platinumPED = platinumPED + "0";
                }
            }
            if(platinumPED == "0000"){
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

        pLS.chronicSelect = function(param) {
            platinumPED = "";
            var chronicSelectCount = 0;
            pLS.deleteMemberObj = [];
            $timeout(function() {
                var returnPED = toFormPED(platinumPED,chronicSelectCount);
                platinumPED = returnPED.platinumPED;
                chronicSelectCount = returnPED.chronicSelectCount;
                pLS.chronicSelectNo = chronicSelectCount;
                if (chronicSelectCount == 1 && pLS.platinumPolicyType == "FF") {
                    var displaymsg;
                    if(allMembers[0].InsuredMembers.length < 3){
                        displaymsg = "Since you’ve declared a medical condition, your proposal will be processed by our underwriting team.";
                    }else{
                        displaymsg = "Please note that since there is a member who is managing a chronic condition, you will have to buy a separate policy for the member(s). We have an elaborate Chronic Management (CM) program for such members. Do you want to continue with your journey without this member?";
                    }
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Warning",
                        "modalBodyText": displaymsg,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                        "positiveFunction": function(){
                            if(allMembers[0].InsuredMembers.length < 3){
                                getPremiumForChronicMembers(platinumPED);
                            }else{
                                memberValidation();   
                            }
                        }
                    }
                } else {
                    getPremiumForChronicMembers(platinumPED)
                }
            }, 500);
        }

    /* End of chronic condition select */


    /* To delete particular product */

        function deletePrduct(productCode,rProposer) {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/DeleteProduct", {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "ProductCode": productCode
                }, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        deleteProductMessage = deleteProductMessage + "Due to invalid product construct after removing "+rProposer+" "+$filter('productFilter')(productCode)+" has been removed.";
                        totalProducts = totalProducts - 1;
                        if(totalProducts == 0){
                            deleteProductMessage = deleteProductMessage+"</ul>";
                             $rootScope.alertConfiguration('E',deleteProductMessage , "invalid-product_alert");
                        }
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {});

        }

    /* End of delting particular product */


    /* To delete particular memberr */

        function deleteMember(member) {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/DeleteMember", {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "InsuredDetail": member
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if (data.ResponseCode == 1) {
                    pLS.insuredMembers = [];
                    fetchMemberedArrayList();
                    toFetchInsuredMembers();
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": data.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function(err) {});

        }

    /* End of delting particular member*/


    /* Get Preminum on updateing chronic Diseases */

        function getPremiumForChronicMembers(param) {
            delete pLS.preminumArray;
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "Platinum": {
                        "MemberDetails" : 
                            [  { "PreExistingDisease" : param,
                                "RelationType": pLS.insuredMembers[pLS.headerVal].RelationType,
                                "RelationWithProposer": pLS.insuredMembers[pLS.headerVal].RelationWithProposer,
                        }        ]
                        
                        
                    },
                    "Savings": false
                }, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        pLS.preminumArray = data.ResponseData;
                        pLS.preminumArray.TotalPremium = 0;
                        angular.forEach(pLS.preminumArray.ProductPremium,function(v,i){
                            pLS.preminumArray.TotalPremium = parseInt(pLS.preminumArray.TotalPremium) + parseInt(v.Premium);
                        });
                        if(pLS.preminumArray.TotalPremium >= 100000 && !panCardFlag ){
                             $('#pan-card-modal').modal({backdrop: 'static', keyboard: false});
                        }
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {});

        }

    /*Get Preminum on updateing chronic Diseases  ends*/


    /* Submit pre existing insured member questions */

        function submitInsuredMemberQuestion() {
            delete pLS.insuredMemberQuestions.PremiumDetail
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateMemberQuestions", pLS.insuredMemberQuestions, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        if (pLS.insuredMembers.length - 1 > pLS.headerVal) {
                            pLS.headerVal++;
                            $("html, body").animate({ scrollTop: $("#health-lifestyle-member-details").offset().top - 135 }, 300);
                            pLS.getInsuredMemberQuestion(pLS.insuredMembers[pLS.headerVal], pLS.headerVal);
                        } else {
                            if ($location.$$path == "/cross-sell-health-lifestyle") {
                                $location.url('cross-sell-declaration');
                            } else if ($location.$$path == "/platinum-health-lifestyle") {
                                $location.url('platinum-declaration');
                            } else if ($location.$$path == "/activ-care-health-lifestyle") {
                                $location.url('activ-care-declaration');
                            } else if ($location.$$path == "/corona-kavach-health-lifestyle") {
                                $location.url('corona-kavach-declaration');
                            } else if ($location.$$url == "/arogya-sanjeevani-health-lifestyle-new") {
                                $location.url('arogya-sanjeevani-declaration');
                            } else {
                                $location.url('rfb-declaration');
                            }
                        }
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {});

        }

    /* End of submitting pre exisitng member questions */


    /* Organ Related Select */

        pLS.healthConditionSelect = function(obj,countToUpdate){
            $timeout(function() {
                if(pLS.chronicSelectNo == 0 && pLS.organSelectedNo == 0 && pLS.majorSelectedNo == 0 && pLS.otherSelectedNo == 0){
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Warning",
                        "modalBodyText": "Since you’ve declared a medical condition, your proposal will be processed by our underwriting team.",
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                }
                pLS[countToUpdate] = 0;
                for (var i = 0; i < healthRelatedQuestionsObj[obj].length; i++) {
                    if (pLS.insuredMemberQuestions.PLMemberQuestions[healthRelatedQuestionsObj[obj][i]] == "Y") {
                        pLS[countToUpdate] = pLS[countToUpdate] + 1;
                    }
                }
            },500);
        }

    /* End of organ relates select */


    /* Update questions head */

        var platinumQuestionsFlag = 4;

        function updateHeadQuestion(questionArray, mainQuestion) {
            var updateFlag = false;
            for (var i = 0; i < questionArray.length; i++) {
                if (pLS.insuredMemberQuestions.PLMemberQuestions[questionArray[i]] == 'Y') {
                    pLS.insuredMemberQuestions.PLMemberQuestions[mainQuestion] = 'Y';
                    updateFlag = true;
                    break;
                }
            }
            if (!updateFlag) {
                platinumQuestionsFlag = platinumQuestionsFlag - 1;
                pLS.insuredMemberQuestions.PLMemberQuestions[mainQuestion] = 'N';
            }
        }

    /* End of updating questions head */

    /* Update questions head for Arogya Sanjeevani */

        // var arogyaSanjeevaniQuestionsFlag = 3;

        // function updateAsHeadQuestion(questionArray, mainQuestion) {
        //     var questionUpdateFlag = false;
        //     for (var i = 0; i < questionArray.length; i++) {
        //         if (pLS.insuredMemberQuestions.ASMemberQuestions[questionArray[i]] == 'Y') {
        //             pLS.insuredMemberQuestions.ASMemberQuestions[mainQuestion] = 'Y';
        //             questionUpdateFlag = true;
        //             break;
        //         }
        //     }
        //     if (!questionUpdateFlag) {
        //         arogyaSanjeevaniQuestionsFlag = arogyaSanjeevaniQuestionsFlag - 1;
        //         pLS.insuredMemberQuestions.ASMemberQuestions[mainQuestion] = 'N';
        //     }
        // }

    /* End of updating questions head Arogya Sanjeevani */

    /* Save question answer button event */

        pLS.saveQuestionAnswer = function(param) {
            if (pLS.insuredMemberQuestions.PLMemberQuestions != null) {
                platinumQuestionsFlag = 4;
                pLS.insuredMemberQuestions.PLMemberQuestions.PED = platinumPED;               
                updateHeadQuestion(['Diabetes_YN', 'BP_YN', 'Asthma_YN', 'Cholesterol_YN'], 'Chronic_YN');
                updateHeadQuestion(['Heart_YN', 'LungResp_YN', 'Digestive_YN', 'Kidney_YN', 'Brain_YN', 'ENT_YN'], 'OrganRelate_YN');
                updateHeadQuestion(['Pregnancy_YN', 'Complication_YN', 'UnderTreatment_YN', 'Surgery_YN', 'BloodTest_YN', 'AnyCond_YN'], 'MajorProcedure_YN');
                updateHeadQuestion(['AutoImm_YN', 'Cancer_YN', 'Muscle_YN', 'Sex_YN', 'Disorder_YN', 'Gynac_YN', 'Polio_YN' ,'ACCIDENT_INJURY_YN' , 'BIRTH_DEFECT_YN' , 'PARALYSIS_YN' , 'ANEMIA_YN'], 'OtherMajor_YN');

            }
            if (platinumQuestionsFlag == 0) {
                $rootScope.alertConfiguration('E', "Please select atleast one pre-existing diesease from Chronic/Organ Related/Major/Other Conditions." , "pre-existing-disease_alert");
                return false;
            }
            if (pLS.insuredMemberQuestions.RFBMemberQuestions != null && pLS.insuredMemberQuestions.RFBMemberQuestions.PreExistingDisease == 'Y') {
                if (pLS.insuredMemberQuestions.RFBMemberQuestions.Below60Years != 'Y' && pLS.insuredMemberQuestions.RFBMemberQuestions.RecurrentCough != 'Y' && pLS.insuredMemberQuestions.RFBMemberQuestions.ConsultDoctor != 'Y') {
                    $rootScope.alertConfiguration('E', "Please select atleast one option from yes/no questions" , "select-atleast-one_alert");
                    return false;
                }
                if (pLS.insuredMemberQuestions.RFBMemberQuestions.Below60Years == 'Y' && (pLS.insuredMemberQuestions.RFBMemberQuestions.Diseases == null || pLS.insuredMemberQuestions.RFBMemberQuestions.Diseases == "")) {
                    $rootScope.alertConfiguration('E', "Please mention dieases (Heart disease/ Stroke/ Cancer/ Diabetes/Hypertension)" ,  "disease-mention_alert");
                    return false;
                }
            }
            if(pLS.insuredMemberQuestions.ACMemberQuestions != null && 
                ((pLS.insuredMemberQuestions.ACMemberQuestions.AnyFormOfHeartDisease != "Y" )
                && (pLS.insuredMemberQuestions.ACMemberQuestions.DiabetesHighBloodPressure != "Y" )
                && (pLS.insuredMemberQuestions.ACMemberQuestions.TB != "Y" )
                && (pLS.insuredMemberQuestions.ACMemberQuestions.DiseaseOfEye != "Y" )
                && (pLS.insuredMemberQuestions.ACMemberQuestions.Cancer != "Y" )
                && (pLS.insuredMemberQuestions.ACMemberQuestions.DiseaseOfKidney != "Y" )
                && (pLS.insuredMemberQuestions.ACMemberQuestions.MentalIllness != "Y" )
                && (pLS.insuredMemberQuestions.ACMemberQuestions.DiseaseOfTheBrain != "Y" ))
                ){
                 $rootScope.alertConfiguration('E', "Please selelct atleast one answer as yes ");
                    return false;
            }
            /* Arogya Sanjeevani Validations */
            if (pLS.insuredMemberQuestions.ASMemberQuestions != null && pLS.insuredMemberQuestions.ASMemberQuestions.PreExistingDisease == 'Y'){
                if(pLS.insuredMemberQuestions.ASMemberQuestions.Suffering == 'Y' && 
                (pLS.insuredMemberQuestions.ASMemberQuestions.Nephropathy == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.MalignantHypertension == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.Retinopathy == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.RenalArtery == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.DiabeticFoot == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.Pheochromocytoma == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.Stroke == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.Aneurysm == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.PeripheralVascular == 'N'
                && pLS.insuredMemberQuestions.ASMemberQuestions.PulmonaryDisease == 'N')
                ){
                    $rootScope.alertConfiguration('E', "Please select at least one suffering condition." , "pre-existing-disease_alert");
                    return false;
                }else if(pLS.insuredMemberQuestions.ASMemberQuestions.Insured == 'Y' && (pLS.insuredMemberQuestions.ASMemberQuestions.AnyRegularMedication == 'N' && pLS.insuredMemberQuestions.ASMemberQuestions.EmploymentHealthCheck == 'N' && pLS.insuredMemberQuestions.ASMemberQuestions.Surgery == 'N')){
                    $rootScope.alertConfiguration('E', "Please select at least one regular medication condition." , "pre-existing-disease_alert");
                    return false;
                }
            }
            /*End of Arogya Sanjeevani Validations */
            submitInsuredMemberQuestion()
        }

    /* End of save question answer button event*/


    /* Redirect to back page funciton */

        pLS.backfunction = function() {
            if ($location.$$url == "/cross-sell-health-lifestyle") {
                $location.url('cross-sell-insured-details');
            } else if ($location.$$url == "/platinum-health-lifestyle") {
                $location.url('platinum-insured-details');
            }else if ($location.$$url == "/activ-care-health-lifestyle") {
                $location.url('activ-care-insured-details');
            }else if ($location.$$url == "/arogya-sanjeevani-health-lifestyle-new") {
                $location.url('arogya-sanjeevani-health-lifestyle');
            } else {
                $location.url('rfb-insured-details');
            }
        }

    /* Redirect to back page funciton ends */


}]);

/* End of Health & Lifestyle Controller  */