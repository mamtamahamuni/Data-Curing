/*
    Delcaration Page Controller
    Author: 
    Date: 06-08-2018
*/
var iDApp = angular.module("delcarationApp", []);

iDApp.controller("declarationCtrl", ['$rootScope','$http', 'appService', 'ABHI_CONFIG', '$filter', '$location', '$timeout', '$window', '$routeParams', function ($rootScope, $http, appService, ABHI_CONFIG, $filter, $location, $timeout, $window, $routeParams) {

    /* Variable Inilization */

    var dLC = this;
    var aS = appService;
    $rootScope.proceedPayment = false;
    dLC.validEmail = true;
    dLC.downArrow = false;
    dLC.downArrowDec = false;
    dLC.otpSendText = "OTP Send Sucessfully ";
    dLC.resendButtonText = false;
    dLC.validMobile = true;
    dLC.policyTypeVal = ""
    dLC.isPAPresent = false;
    dLC.emailEdit = false;
    dLC.mobNoEdit = false;
    dLC.otpButton = "send-OTP"
    dLC.showPerAnum = false;
    dLC.DIQuestions = null;
    dLC.verifyOTPSuccess = false;

    dLC.PLQuestions = null;
    dLC.FitQuestions = null;
    dLC.RFBQuestions = null;
    dLC.customizePa = 'pa-customize-quote';
    dLC.productName = sessionStorage.getItem('pName');
    dLC.otherProduct = [];
    dLC.primaryCovers = [];
    dLC.hasEIA = 'N';
    dLC.indianNational = 'N';
    dLC.uninsurableOcc = 'Y';
    dLC.EverDeclinedFlag = 'N';
    dLC.paDeclarationFlag = 'N';
    dLC.goGreen = 'Y';
    dLC.HardCopy = 'N';
    dLC.isChecked
    dLC.radioOption = "";

    dLC.showDeclarationSection = true; // added to skip KYC

    if ($rootScope.citipresent) { // added for select payment mode
        dLC.pgPaymentMode = null;
    } else {
        dLC.pgPaymentMode = 'emandate_normal';
        dLC.isChecked = true;
    }

    // SMITA OPEN T&C 
    dLC.tcAgreed = false;
    dLC.showTerms = function () {
        $location.url("terms-conditions");
        //window.open("http://localhost:3000/#!/terms-conditions","_blank");
    }
    //SMITA OPEN T&C END

    dLC.downArrowDec = true;
    $('#delcaration-text').slideUp();
    var prequoteData = JSON.parse(sessionStorage.getItem('prequoteData'));
  
    
    function loadOwlCarousel(idName) {
        dLC.initSlider = true;
        $timeout(function () {
            $("#" + idName).owlCarousel({
                items: 3,
                margin:16,
                navigation: true,
                navigationText: ["", ""],
            });
        }, 300);
    }

    /* End of variable inilization */

    


    /* Exit intent popup */ 
    const CookieService = {

        setCookie(name, value, days) {
            let expires = '';
    
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
    
            document.cookie = name + '=' + (value || '')  + expires + ';';
        },
    
        getCookie(name) {
            const cookies = document.cookie.split(';');
    
            for (const cookie of cookies) {
                if (cookie.indexOf(name + '=') > -1) {
                    return cookie.split('=')[1];
                }
            }
    
            return null;
        }
    }
    // Wrap the setTimeout into an if statement
    getSurveyQuestions();
if (!CookieService.getCookie('exitIntentShown')) {
    setTimeout(() => {
        document.addEventListener('mouseout', mouseEvent);
        document.addEventListener('keydown', exit);
    }, 10_000);
}

const mouseEvent = e => {
    const shouldShowExitIntent = 
        !e.toElement && 
        !e.relatedTarget &&
        e.clientX > 250 &&
        e.clientY < 10;

    if (shouldShowExitIntent) {
        document.removeEventListener('mouseout', mouseEvent);
        document.querySelector('.exit-intent-popup').classList.add('visible');
        
        // Set the cookie when the popup is shown to the user
        CookieService.setCookie('exitIntentShown', true, 1);
    }
};

    document.addEventListener('mouseout', mouseEvent);

    const exit = e => {
        const shouldExit =
            [...e.target.classList].includes('exit-intent-popup') || // user clicks on mask
            e.target.className === 'close' || // user clicks on the close icon
            e.keyCode === 27; // user hits escape
    
        if (shouldExit) {
            document.querySelector('.exit-intent-popup').classList.remove('visible');
        }
    };
    
    document.querySelector('.exit-intent-popup').addEventListener('click', exit);   
    
    /* End Exit intent popup */

    /* Fetch survey questions */

    function getSurveyQuestions() {
        aS.getData(ABHI_CONFIG.apiUrl + "GEN/GetallSurveyQuestions", {}, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (response.ResponseCode == 1) {
                dLC.surveyQuestions = response.ResponseData;
                angular.forEach(dLC.surveyQuestions, function(value, key) {
                    value.Options = value.Options.split(','); 
                });
                //console.log(dLC.surveyQuestions);
            } else {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": response.ResponseMessage,
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true,
                    "positiveFunction": function () {
                        window.history.back();
                    }
                }
            }
        }, function (err) {
        });
    }

    /* End of fetch survey questions */

    dLC.UpdateFITInsuredVitals = function() {
        if($routeParams.party_id && $routeParams.proposal_no && $routeParams.token){
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateFITInsuredVitals", 
        {
            "FIT_InsuredMemberVitalRequests":[{
            "ReferenceNo":sessionStorage.getItem('rid'),
            "MemberID": $routeParams.party_id,
            "ProposalNumber":$routeParams.proposal_no,
            "AuthToken":$routeParams.token
            }]
        }
        , true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (response.ResponseCode == 1) {
                dLC.checkMembersForDiscount($routeParams.party_id, $routeParams.is_discounted, "IsUpfrontDiscount", true);

            } else {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": response.ResponseMessage,
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true,
                    "positiveFunction": function () {
                        window.history.back();
                    }
                }
            }
        }, function (err) {
        });
        }
    }

    dLC.testResult = false;

    dLC.checkMembersForDiscount = function(partyId, value , keyname , flag){
        let checkdone = 0;
        angular.forEach(dLC.selectedMember, function (v, i) {
            if(v.PartyID == partyId){
                if(keyname == 'IsUpfrontDiscount'){
                    v[keyname] = value == false || value == 'false'?'N':'Y';
                }else{
                    v[keyname] = value == false || value == 'false'?false:true;
                }
                v['isTest'] = true;
            }
           
            if(v['isTest'] == false){
                checkdone++
            }
            if(dLC.selectedMember.length == i+1){
                dLC.takeTest = checkdone > 0?true:false;
                if(!dLC.takeTest){
                    dLC.testResult = true;
                }
            }
        })

        if(flag){

            aS.postData(ABHI_CONFIG.apiUrl + "GEN/IsTestTaken", {
                "ReferenceNo":sessionStorage.getItem('rid'),
    
                "MemberID":partyId,
    
                "IstestTaken":"Y",
    
                "Remark":keyname == "IsUpfrontDiscount"?"Test taken":"Skip test"
            }, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if($routeParams.party_id && $routeParams.proposal_no && $routeParams.token && keyname == "IsUpfrontDiscount"){
                    getSummary();
                } 
            }, function (err) {
            });
        }
    }

    dLC.UpdateFITInsuredVitals();

    // dLC.healthDiscountCheck = function(member, i){

    //     if(member.healthDiscount){
    //         var reqTestToken = {
    //             method: 'POST',
    //             url: "https://wellnesslayerapis.adityabirlahealth.com/tyk/a2b40563-cfe8-4a59-8b68-4de2173520d7/",
    //             data: {
    //                 "party_id": member.PartyID, // string
    //                 "proposal_no": sessionStorage.getItem('QuoteNumber') // string
    //             },
    //             headers: {
    //                         "Authorization": sessionStorage.getItem('careflixToken'), // string; you can get this token from the above create token API
    //                         "Content-Type": "application/json"
    //                     }    
    //         };
      
    //         $http(reqTestToken)
    //         .then(function (rec) {
    //             // console.log("healthDiscountCheck", rec);
    //             let PartID = rec.data.data.party_id;
    //             // dLC.checkMembersForDiscount(PartID, rec.data.data.is_discounted , "isDiscount", false)
                
    //         }, function (err) {
    //         });                        
    //     }
    // }

    dLC.skipTest= function(member, i) {
        // member["healthDiscount"]= false;
        // dLC.selectedMember[i]= member;
        dLC.checkMembersForDiscount(member.PartyID, false , "healthDiscount", true)
    }

    dLC.testProceed = function(member) {
        let memberdata = member
        var reqTestToken = {
            method: 'POST',
            url: "https://wellnesslayerapis.adityabirlahealth.com/tyk/a7233c08-9be5-4f46-ab27-c1aa93c2330b/",
            data: {
                "source": "customer-portal" // string
            },
            headers: {
                        "username": "513a0531c70cf969ddb5cb8a0bf17cd1", // string
                        "password": "d957fce0-3fee-44fe-ae9b-34f117faa279", // string
                        "Content-Type": "application/json"
                    }      
        };
  
        $http(reqTestToken)
        .then(function (rec) {
            if(rec.status == 200){
                let proposal_no = sessionStorage.getItem('QuoteNumber');
                let token = rec.data.journeys.jwt;
                let heightArr = member.Height.split(".");
                let DOB_M = member.DOB.split("/");
                let feet=0;
                let inh=0;
                member.DOB = DOB_M[2]+"-"+DOB_M[1]+"-"+DOB_M[0]
                if(heightArr[0]){
                    feet = parseInt(heightArr[0]) * 30.48
                }
                if(heightArr[1]){
                    inh = parseInt(heightArr[1]) * 2.54
                }
                member.Height = feet + inh;
                if(!member.mobileno){
                    member.mobileno = dLC.summaryDetails.MobileNumber
                }

                if(!member.Email){
                    member.Email = dLC.summaryDetails.Email;
                }
                member.Gender = member.Gender == "M"?"Male": "Female"
                sessionStorage.setItem('careflixToken',token);
                let url = window.location.protocol+"//"+window.location.host+"/#!/fit-declaration"
                if(url == "http://127.0.0.1:8082/#!/fit-declaration"){
                window.location = "https://mtpre.adityabirlahealth.com/execute/journey/3d9c7575-a594-4505-90b6-5922baa08c48?token="+token+"&party_id="+member.PartyID+"&proposal_no="+proposal_no+"&portal_redirection_url=http://127.0.0.1:8082&dob="+member.DOB+"&mobile_no="+member.mobileno+"&gender="+member.Gender+"&first_name="+member.FirstName+"&email="+member.Email+"&last_name="+member.LastName+"&height="+member.Height+"&weight="+member.Weight+"&source=customer-portal"
                }
                else{
                window.location = "https://mtpre.adityabirlahealth.com/execute/journey/3d9c7575-a594-4505-90b6-5922baa08c48?token="+token+"&party_id="+member.PartyID+"&proposal_no="+proposal_no+"&portal_redirection_url=https://mtpre.adityabirlahealth.com/healthinsurance/buy-insurance-online&dob="+member.DOB+"&mobile_no="+member.mobileno+"&gender="+member.Gender+"&first_name="+member.FirstName+"&email="+member.Email+"&last_name="+member.LastName+"&height="+member.Height+"&weight="+member.Weight+"&source=customer-portal"
                }
                // window.location = "https://mtpre.adityabirlahealth.com/execute/journey/3d9c7575-a594-4505-90b6-5922baa08c48?token="+token+"&party_id="+member.PartyID+"&proposal_no="+proposal_no+"&portal_redirection_url="+url+"&dob="+member.DOB+"&mobile_no="+member.mobileno+"&gender="+member.Gender+"&first_name="+member.FirstName+"&email="+member.Email+"&last_name="+member.LastName+"&height="+member.Height+"&weight="+member.Weight+"&source=customer-portal"
            }

        }, function (err) {
        });
    }

    /* Radio selection change */
    dLC.radioChange = function(currentId, value) {
        //console.log(currentId + " :: "+ value);
        if(value.toLowerCase() == "other"){
            $("#txtOther" + currentId).show();
        }else{
            $("#txtOther" + currentId).hide();
        }
    };
    /* End of Radio selection change */
    
    /* Submit survey */
    dLC.submitSurveyData = function(event) {
        const elements = document.querySelectorAll('.liQuestionAns');
        const questionArray = [];
        const answerArray = [];
        $('.liQuestionAns').each(function(){
            let elType = $(this).attr('type');
            let seq = $(this).attr('seq');
            var qArray = [];
            qArray[0] = $(this).attr('for');
            qArray[1] = $(this).find('.lblQuestion').text().trim();
            questionArray.push(qArray);
            let radVal = $(this).find("input:radio[name='questionOption" + seq + "']:checked").val().replace(/_/g,' ').trim();
            let ans = (elType == 'Radio') ? (radVal.toLowerCase() == 'other') ? $('#txtOther' + seq).val() : radVal : 
                      (elType == 'CheckBox') ? $(this).find('.dv-answer input:checked').map(function () { return this.value.trim(); }).get():
                      (elType == 'Textbox') ? $(this).find('.form-control').val().trim() :                      
                      (elType == 'Multiline') ? $(this).find('.form-control').val().trim() :
                      "";
            var aArray = [];
            aArray[0] = $(this).attr('for');
            aArray[1] = ans+"";
            answerArray.push(aArray);
        });

        surveySubmitData = {
            "ReferenceNumber":sessionStorage.getItem('rid'),
            "QuestionObject": arr2obj(questionArray),
            "AnswerObject": arr2obj(answerArray)
        }
        //console.log(surveySubmitData);
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/SaveQueAnsWRTCustomer", surveySubmitData, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
        .then(function (response) {
            if (response.ResponseCode == 1) {
                $(".dv-questions").hide();
                $(".dv-thankYou").show();
            } else {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": response.ResponseMessage,
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true,
                    "positiveFunction": function () {
                        window.history.back();
                    }
                }
            }
        }, function (err) {
        });
    }
    /* End of Submit survey */

    /* Clear Survey Form */
    dLC.clearSurveyData = function(event){
        const elements = document.querySelectorAll('.liQuestionAns');
        let seq = $(this).attr('seq');
        $('.liQuestionAns').each(function(){
            $(this).find("input:radio").prop('checked',false);
            $(this).find('.dv-answer input[type="checkbox"]').prop('checked',false);
            ($(this).find('.form-control').length > 0) ? $(this).find('.form-control').val("") : '';
            ($(this).find('.form-control').length > 0) ? $(this).find('.form-control').val("") : '';
        });
    }
    /* End Clear Survey Form */

    /* Convert Array to Object */
    // THis function took array as paramenter
    function arr2obj(arr) {
        return arr.reduce(
            (acc, curr) => {
                  
                // Extract the key and the value
                let key = curr[0];
                let value = curr[1];
      
                // Assign key and value
                // to the accumulator
                acc[key] = value;
      
                // Return the accumulator
                return acc;
            },
      
            // Initialize with an empty object
            {}
        );
    }
    /* End of Convert Array to Object */

    /* Slide Down Question and Ans Div */

    dLC.slideDownQuestion = function () {
        dLC.showEIASection = false;
        dLC.downArrow = false;
        $('#memberedQuestionDeclaration').slideDown();
    }

    /* End of slide down question and ans div */

    /* check Citi flow Or not */
    if (sessionStorage.getItem('rid').includes("CT")) {
        dLC.citiFlow = true;
    }
    /* check Citi flow Or not ends*/


    /* Show error model on the question */

    dLC.showRestrictModal = function (ans, param) {
        $rootScope.alertData = {
            "modalClass": "regular-alert",
            "modalHeader": "Warning",
            "modalBodyText": "The policy cannot be bought online. Please contact our call center or the nearest branch for assistance",
            "showCancelBtn": false,
            "modalSuccessText": "OK",
            "modalCancelText": "No",
            "hideCloseBtn": true,
            "showAlertModal": true,
            "positiveFunction": function () {
                dLC[param] = ans;
            }
        }
    }

    /* End of show error modal on the question */

    


    /* Fetch Summary details */
    dLC.takeTest = false;
    dLC.ShowCoupon = false;

    dLC.disProceedForDiscount = 'N';
    dLC.disProceed = 'Y';
    function getSummary() {
        $rootScope.showLoader1 = true;
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetSummary", {
             "ReferenceNumber": sessionStorage.getItem('rid')
        }, true, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                aS.triggerSokrati(); /* Triggering Sokrati */
                if (response.ResponseCode == 1) {      
                    
                    sessionStorage.setItem('userData', JSON.stringify(response.ResponseData));
                    dLC.summaryDetails = response.ResponseData;                        

                    dLC.selectedMember = dLC.summaryDetails.ProductSummary[0].MemberDetails;
                    let checkdone = 0;
                    let checkMD = 0;

                    /* Check for KYC Status and provided DOB with Kyc DOB */
                    dLC.IsKYC = dLC.summaryDetails.IsEKYC;

                    if(dLC.IsKYC != null){
                        var kycCompletedArray = ['manually-approved', 'auto-approved', 'needs review', 'manually_approved', 'auto_approved', 'needs_review', 'success'];
                        var kycNotCompletedArray = ['auto-declined', 'manually-declined','auto_declined', 'manually_declined'];
                        //user-cancelled
                        //error
                        kycCompletedArray.forEach((status) => {
                            console.log("status : " + status);
                            if(status == dLC.IsKYC){
                                dLC.showDeclarationSection = true;
                                dLC.downArrowDec = false;
                                dLC.iSKycCompleted = true;
                                dLC.iSKycSuccess = true;
                            }
                        });
                        kycNotCompletedArray.forEach((status) => {
                            console.log("status : " + status);
                            if(status == dLC.IsKYC){
                                dLC.showDeclarationSection = true;
                                dLC.downArrowDec = false;
                                dLC.iSKycNotCompleted = true;
                            }
                        });
                    }
                    
                    console.log("dLC.IsKYC : " + dLC.IsKYC + " :: " + "dLC.iSKycCompleted" + " : " + dLC.iSKycCompleted);

                    if(dLC.iSKycSuccess == true)
                    {             
                        if(sessionStorage.getItem("KycDOB") != null)    
                        {                                   
                            var kycDOBResult = sessionStorage.getItem("KycDOB").split('/'); // date comes in dd/mm/yyyy
                            var newkycDOBResult = kycDOBResult[1] + '/' + kycDOBResult[0] + '/' + kycDOBResult[2]; // convert date into mm/dd/yyyy
                            var kycDOB = new Date(newkycDOBResult);
                            var formDOB = new Date(dLC.selectedMember[0].PropDOB); 
                            console.log(kycDOB + " : " + formDOB + " : " + dLC.iSKycSuccess);
                            var kycMsg = "Hi " + dLC.selectedMember[0].Name + ", <br /> Your \"DATE OF BIRTH\" is not matching with the provided document in KYC.";
                            if(kycDOB.getFullYear() != '1900')
                            {
                                if(kycDOB.getFullYear() != formDOB.getFullYear() && kycDOB.getDate() != formDOB.getDate() && kycDOB.getMonth() != formDOB.getMonth())
                                {
                                    // $rootScope.alertData = 
                                    // {
                                    //     "modalClass": "regular-alert",
                                    //     "modalHeader": "Error",
                                    //     "modalBodyText": kycMsg,
                                    //     "showCancelBtn": false,
                                    //     "modalSuccessText": "OK",
                                    //     "modalCancelText": "No",
                                    //     "showAlertModal": true,
                                    //     "positiveFunction": function () {
                                    //         window.location.href = ABHI_CONFIG.healthWebsite;
                                    //     }
                                    // }
                                }
                            }
                        }
                    }
                    
                    // sessionStorage.removeItem("KycStatus"); // Remove Kyc Status
                    // sessionStorage.removeItem("KycDOB"); // Remove DOB found in Kyc

                    /* Check for KYC Status and provided DOB with Kyc DOB Ends */

                    angular.forEach(dLC.selectedMember, function (v, i) {
                        if(v.Relation != "KID" && parseInt(v.Age) <= 45 && parseInt(v.Age) >= 18){
                            v["healthDiscount"]= true;
                            v["isTest"]= v['IstestTaken']== "Y"?true:false;
                        }
                        else{
                            
                            v["healthDiscount"]= false;
                        }


                        if((!v['isTest'] || v['isTest'] == '') && v.Relation != "KID"){
                            checkdone++
                        }
                        if(v.IsUpfrontDiscount == 'Y'){
                            checkMD++;
                        }
                        if(dLC.selectedMember.length == i+1 && dLC.summaryDetails.ProductSummary[0].ProductName == "Activ Fit"){
                            dLC.takeTest = checkdone > 0 && dLC.summaryDetails.ProductSummary[0].UpfrontDiscountApplicable == 'Y'?true:false;
                            if(!dLC.takeTest && dLC.summaryDetails.ProductSummary[0].UpfrontDiscountApplicable == 'Y'){
                            // dLC.takeTest = checkdone > 0?true:false;
                            // if(!dLC.takeTest){
                                dLC.testResult = true;
                                $timeout(function () {
                                    loadOwlCarousel('ci-sum-isnured-slider11');
                                }, 300);
                            }
                            if((!dLC.takeTest && dLC.summaryDetails.ProductSummary[0].ProductName == "Activ Fit") || ($routeParams.party_id && $routeParams.proposal_no && $routeParams.token)){
                                dLC.agreeClick();
                                dLC.disTestProceed();
                            }

                            if(checkMD <= 0){
                                dLC.ShowCoupon = true;
                                sessionStorage.setItem('fitWellnessCoupon', dLC.ShowCoupon)
                            }
                            else{
                                dLC.ShowCoupon = false;
                                sessionStorage.removeItem('fitWellnessCoupon')
                            }
                        }
                        
                        
                        // dLC.healthDiscountCheck(v, i);
                        
                    });
                    
                    sessionStorage.setItem('QuoteNumber', dLC.summaryDetails.ProductSummary[0].QuoteNumber)
                    
                    dLC.totalPremium = 0;
                    dLC.AddonGSTPremium = dLC.memberedQuestion.PremiumDetail.AddonGSTPremium;
                    if (dLC.summaryDetails.Tenure == "1") {
                        dLC.showPerAnum = true;
                    }
                    angular.forEach(dLC.summaryDetails.ProductSummary, function (v, i) {
                        dLC.totalPremium = parseInt(v.Premium) + dLC.totalPremium;
                        if (v.IsPrimary) {
                            if (v.ProductName == "Activ Care Senior Citizen") {
                                dLC.policyTypeVal = v.PolicyType
                            }
                            if (v.ProductName == "Activ Assure") {
                                dLC.policyTypeVal = v.PolicyType
                            }
                            dLC.primaryProduct = v;
                            dLC.primaryCovers = dLC.primaryProduct.MemberDetails[0].Covers.split(',');
                        } else {
                            dLC.otherProduct.push(v);
                        }
                        if (v.ProductName == 'Activ Secure Personal Accident') {
                            dLC.isPAPresent = true;
                        }
                        if (v.ProductName == 'Activ Assure') {
                            dLC.isDiamondPresent = true;
                        }
                        if (v.ProductName == 'Activ Health') {
                            dLC.isPlatinumPresent = true;
                        }
                        if (v.ProductName == 'Activ Secure Personal Accident' || v.ProductName == 'Activ Secure Critical Illness' || v.ProductName == 'Activ Secure Cancer Secure') {
                            dLC.isRFBPresent = true;
                        }
                    });
                    if (dLC.summaryDetails.ProductSummary.length == 1) {
                        dLC.pageUrl = dLC.primaryProduct.ProductName;
                    }
                    else {
                        dLC.pageUrl = "cross-sell"
                    }
                    $rootScope.showLoader1 = false;
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": response.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true,
                        "positiveFunction": function () {
                            window.history.back();
                        }
                    }
                    $rootScope.showLoader1 = false;
                }
            }, function (err) {
            });
    }

    dLC.disTestProceed = function(){
        dLC.disProceedForDiscount = dLC.disProceed;
        if(dLC.disProceedForDiscount == "Y"){
            $timeout(function () {
                loadOwlCarousel('ci-sum-isnured-slider11');
            }, 300);
        }
        else[
            dLC.takeTest = false
        ]
    }


    

    /* End of fetch summary details */


    /* Get declarartion page Questions details */

    function getDeclarartionMemberedQuestion() {
        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "RelationType": "D",
            "RelationWithProposer": "D"
        });

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMemberQuestions", {
            "_data": reqData
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                var response = JSON.parse($rootScope.decrypt(response._resp))
                if (response.ResponseCode == 1) {
                    dLC.memberedQuestion = response.ResponseData;
                    if (dLC.memberedQuestion.DIQuestions) {
                        dLC.DIQuestions = dLC.memberedQuestion.DIQuestions;
                        dLC.goGreen = dLC.memberedQuestion.DIQuestions.GoGreen;
                        dLC.EverDeclinedFlag = dLC.memberedQuestion.DIQuestions.EverDeclinedFlag;
                        dLC.RegisterToEIAFlag = dLC.memberedQuestion.DIQuestions.RegisterToEIAFlag;
                        dLC.EIA_YN = dLC.memberedQuestion.DIQuestions.RegisterToEIAFlag;
                        dLC.EIAAccountYN = dLC.memberedQuestion.DIQuestions.EIAAccountFlag;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.DIQuestions.EIAAccountNo;
                        dLC.EIAWith = dLC.memberedQuestion.DIQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.DIQuestions.CreateEIAFlag;
                    }
                    if (dLC.memberedQuestion.CKQuestions) {
                        dLC.CKQuestions = dLC.memberedQuestion.CKQuestions;
                        dLC.goGreen = dLC.memberedQuestion.CKQuestions.GoGreen;
                        dLC.HardCopy = dLC.memberedQuestion.CKQuestions.HardCopy;
                        dLC.WhatsApp_Channel = dLC.memberedQuestion.CKQuestions.WhatsApp_Channel;
                        dLC.EverDeclinedFlag = dLC.memberedQuestion.CKQuestions.EverDeclinedFlag;
                        dLC.RegisterToEIAFlag = dLC.memberedQuestion.CKQuestions.RegisterToEIAFlag;
                        dLC.EIA_YN = dLC.memberedQuestion.CKQuestions.RegisterToEIAFlag;
                        dLC.EIAAccountYN = dLC.memberedQuestion.CKQuestions.EIAAccountFlag;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.CKQuestions.EIAAccountNo;
                        dLC.EIAWith = dLC.memberedQuestion.CKQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.CKQuestions.CreateEIAFlag;
                    }
                    if (dLC.memberedQuestion.ASQuestions) {
                        dLC.ASQuestions = dLC.memberedQuestion.ASQuestions;
                        dLC.goGreen = dLC.memberedQuestion.ASQuestions.GoGreen;
                        //dLC.HardCopy = dLC.memberedQuestion.ASQuestions.HardCopy;
                        //dLC.RegisterToEIAFlag = dLC.memberedQuestion.ASQuestions.RegisterToEIAFlag;
                        dLC.EIA_YN = dLC.memberedQuestion.ASQuestions.EIA_YN;
                        dLC.EIAAccountYN = dLC.memberedQuestion.ASQuestions.EIAAccountYN;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.ASQuestions.EIAAccountNumber;
                        dLC.EIAWith = dLC.memberedQuestion.ASQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.ASQuestions.ApplyEIA_YN;
                        dLC.ForeignOrigin = dLC.memberedQuestion.ASQuestions.ForeignOrigin;
                    }
                    if (dLC.memberedQuestion.STQuestions) {
                        dLC.STQuestions = dLC.memberedQuestion.STQuestions;
                        dLC.STMemberQuestions = dLC.memberedQuestion.STMemberQuestions
                        dLC.ForeignOrigin = dLC.memberedQuestion.STQuestions.ForeignOrigin;
                        dLC.goGreen = dLC.memberedQuestion.STQuestions.GoGreen;
                        dLC.EIA_YN = dLC.memberedQuestion.STQuestions.RegisterToEIAFlag;
                        dLC.EIAAccountYN = dLC.memberedQuestion.STQuestions.EIAAccountFlag;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.STQuestions.EIAAccountNo;
                        dLC.EIAWith = dLC.memberedQuestion.STQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.STQuestions.CreateEIAFlag;
                    }
                    if (dLC.memberedQuestion.FITQuestions) {
                        dLC.FitQuestions = dLC.memberedQuestion.FITQuestions;
                        dLC.goGreen = dLC.memberedQuestion.FITQuestions.GoGreen;
                        dLC.EverDeclinedFlag = dLC.memberedQuestion.FITQuestions.EverDeclinedFlag;
                        dLC.EIA_YN = dLC.memberedQuestion.FITQuestions.EIA_YN;
                        dLC.EIAAccountYN = dLC.memberedQuestion.FITQuestions.EIAAccountYN;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.FITQuestions.EIAAccountNumber;
                        dLC.EIAWith = dLC.memberedQuestion.FITQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.FITQuestions.ApplyEIA_YN;
                        var userDateOfBirth = (dLC.memberedQuestion.FITQuestions.CP_PolStartDate != undefined) ? dLC.memberedQuestion.FITQuestions.CP_PolStartDate.split('-') : "";
                        if (userDateOfBirth.length > 0) {
                            dLC.day = userDateOfBirth[2];
                            dLC.month = userDateOfBirth[1];
                            dLC.year = userDateOfBirth[0];
                            dLC.DOB = userDateOfBirth[2] + "-" + userDateOfBirth[1] + "-" + userDateOfBirth[0];
                        }
                    }
                    if (dLC.memberedQuestion.PLQuestions) {
                        dLC.PLQuestions = dLC.memberedQuestion.PLQuestions;
                        dLC.goGreen = dLC.memberedQuestion.PLQuestions.GoGreen;
                        dLC.EverDeclinedFlag = dLC.memberedQuestion.PLQuestions.EverDeclinedFlag;
                        dLC.EIA_YN = dLC.memberedQuestion.PLQuestions.RegisterToEIAFlag;
                        dLC.EIAAccountYN = dLC.memberedQuestion.PLQuestions.EIAAccountFlag;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.PLQuestions.EIAAccountNo;
                        dLC.EIAWith = dLC.memberedQuestion.PLQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.PLQuestions.CreateEIAFlag;
                        var userDateOfBirth = (dLC.memberedQuestion.PLQuestions.CP_PolStartDate != undefined) ? dLC.memberedQuestion.PLQuestions.CP_PolStartDate.split('-') : "";
                        if (userDateOfBirth.length > 0) {
                            dLC.day = userDateOfBirth[2];
                            dLC.month = userDateOfBirth[1];
                            dLC.year = userDateOfBirth[0];
                            dLC.DOB = userDateOfBirth[2] + "-" + userDateOfBirth[1] + "-" + userDateOfBirth[0];
                        }
                    }
                    if (dLC.memberedQuestion.RFBQuestions) {
                        dLC.RFBQuestions = dLC.memberedQuestion.RFBQuestions;
                        dLC.RFBMemberQuestions = dLC.memberedQuestion.RFBMemberQuestions
                        dLC.ForeignOrigin = dLC.memberedQuestion.RFBQuestions.ForeignOrigin;
                        dLC.goGreen = dLC.memberedQuestion.RFBQuestions.GoGreen;
                        dLC.EIA_YN = dLC.memberedQuestion.RFBQuestions.EIA_YN;
                        dLC.EIAAccountYN = dLC.memberedQuestion.RFBQuestions.EIAAccountYN;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.RFBQuestions.EIAAccountNumber;
                        dLC.EIAWith = dLC.memberedQuestion.RFBQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.RFBQuestions.ApplyEIA_YN;
                    }
                    if (dLC.memberedQuestion.ACQuestions) {
                        dLC.ACQuestions = dLC.memberedQuestion.ACQuestions;
                        dLC.ACMemberQuestions = dLC.memberedQuestion.ACMemberQuestions
                        dLC.ForeignOrigin = dLC.memberedQuestion.ACQuestions.ForeignOrigin;
                        dLC.goGreen = dLC.memberedQuestion.ACQuestions.GoGreen;
                        dLC.EIA_YN = dLC.memberedQuestion.ACQuestions.EIA_YN;
                        dLC.EIAAccountYN = dLC.memberedQuestion.ACQuestions.EIAAccountYN;
                        dLC.EIAAccountNumber = dLC.memberedQuestion.ACQuestions.EIAAccountNumber;
                        dLC.EIAWith = dLC.memberedQuestion.ACQuestions.EIAWith;
                        dLC.ApplyEIA_YN = dLC.memberedQuestion.ACQuestions.ApplyEIA_YN;
                    }
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": response.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function (err) {
            });
    }

    /* End of get declarartion page Questions details */


    /* Formation of DOB */

    dLC.changeDate = function (day, month, year) {
        dLC.policyStartDate = day + "-" + month + "-" + year;
        dLC.memberedQuestion.PLQuestions.CP_PolStartDate = year + "-" + month + "-" + day;
    }

    /* End of formation of DOB */


    /* Submit declarartion page Questions details */

    dLC.submitDeclarartionMemberedQuestion = function (event) {
        // if(dLC.summaryDetails.ProductSummary[0].ProductName != "Activ Fit"){

        if (dLC.PLQuestions && dLC.memberedQuestion.PLQuestions.ClaimPolicy == 'Y' && (dLC.memberedQuestion.PLQuestions.CP_InsurName == '' || dLC.memberedQuestion.PLQuestions.CP_PolStartDate == '' || dLC.memberedQuestion.PLQuestions.CP_PolicyNo == '' || dLC.memberedQuestion.PLQuestions.CP_SI == '')) {
            $rootScope.alertConfiguration('E', "Please select proper claim retail health insurance data.");
            dLC.slideDownQuestion();
            $("html, body").animate({ scrollTop: $("#declaration-summary-details").offset().top + 135 }, 300);
            return false;
        }

        if (dLC.EIA_YN == 'Y' && dLC.EIAAccountYN == 'Y' && (dLC.EIAAccountNumber == '' || dLC.EIAWith == '')) {
            $rootScope.alertConfiguration('E', "Please select proper EIA Account data.");
            $("html, body").animate({ scrollTop: $("#eIAAccount").offset().top - 100 }, 300);
            return false;
        }
        if (event.target.value == "Resend OTP") {
            dLC.resendButtonText = true;
        }
        event.target.value = "Saving Ans";
        event.target.disabled = true;
        if (dLC.DIQuestions) {
            setDiamondPlatinumActivCareVal('di')
        }
        if (dLC.PLQuestions) {
            setDiamondPlatinumActivCareVal('pl')
        }
        if (dLC.FitQuestions) {
            setDiamondPlatinumActivCareVal('fit')
        }
        if (dLC.STQuestions) {
            setDiamondPlatinumActivCareVal('st')
        }
        if (dLC.ACQuestions) {
            setDiamondPlatinumActivCareVal('ac')
        }
        if (dLC.CKQuestions) {
            setDiamondPlatinumActivCareVal('ck')
        }
        if (dLC.ASQuestions) {
            setDiamondPlatinumActivCareVal('as')
        }
        if (dLC.RFBQuestions) {
            setRfbVal();
        }

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateMemberQuestions", {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "RelationType": "D",
            "RelationWithProposer": "D",
            "DIMemberQuestions": null,
            "PLMemberQuestions": null,
            "ACMemberQuestions": dLC.ACMemberQuestions,
            "CKMemberQuestions": dLC.memberedQuestion.CKMemberQuestions,
            "ASMemberQuestions": dLC.memberedQuestion.ASMemberQuestions,
            "FITMemberQuestions": dLC.memberedQuestion.FITMemberQuestions,
            "FitQuestions": dLC.FitQuestions,
            "ACQuestions": dLC.ACQuestions,
            "RFBMemberQuestions": dLC.RFBMemberQuestions,
            "DIQuestions": dLC.DIQuestions,
            "STMemberQuestions": dLC.STMemberQuestions,
            "CKQuestions": dLC.CKQuestions,
            "STQuestions": dLC.STQuestions,
            "PLQuestions": dLC.PLQuestions,
            "RFBQuestions": dLC.RFBQuestions,
            "ASQuestions": dLC.ASQuestions
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (response.ResponseCode == 1) {
                    dLC.sendOTP(event)
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": response.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true,
                        "positiveFunction": function () {
                            event.target.value = "Send OTP";
                            event.target.disabled = false;
                        }
                    }
                }
            }, function (err) {
            });
        // }
        // else{
        //     dLC.sendOTP(event);
        // }
    }

    /* End of Submit declarartion page Questions details */


    /* Return Diamond and platinum object question answers   */

    function setDiamondPlatinumActivCareVal(val) {
        if (val == 'di') {
            dLC.DIQuestions.GoGreen = dLC.goGreen;
            dLC.DIQuestions.EverDeclinedFlag = dLC.EverDeclinedFlag;
            dLC.DIQuestions.RegisterToEIAFlag = dLC.EIA_YN;
            dLC.DIQuestions.EIAAccountFlag = dLC.EIAAccountYN;
            dLC.DIQuestions.EIAAccountNo = dLC.EIAAccountNumber;
            dLC.DIQuestions.EIAWith = dLC.EIAWith;
            dLC.DIQuestions.CreateEIAFlag = dLC.ApplyEIA_YN;
        } else if (val == 'ac') {
            dLC.ACQuestions.GoGreen = dLC.goGreen;
            dLC.ACQuestions.EverDeclinedFlag = dLC.EverDeclinedFlag;
            dLC.ACQuestions.RegisterToEIAFlag = dLC.EIA_YN;
            dLC.ACQuestions.EIAAccountFlag = dLC.EIAAccountYN;
            dLC.ACQuestions.EIAAccountNo = dLC.EIAAccountNumber;
            dLC.ACQuestions.EIAWith = dLC.EIAWith;
            dLC.ACQuestions.CreateEIAFlag = dLC.ApplyEIA_YN;
        } else if (val == 'ck') {
            dLC.CKQuestions.GoGreen = dLC.goGreen;
            dLC.CKQuestions.HardCopy = dLC.HardCopy;
            dLC.CKQuestions.WhatsApp_Channel = dLC.WhatsApp_Channel;
            dLC.CKQuestions.EverDeclinedFlag = dLC.EverDeclinedFlag;
            dLC.CKQuestions.RegisterToEIAFlag = dLC.EIA_YN;
            dLC.CKQuestions.EIAAccountFlag = dLC.EIAAccountYN;
            dLC.CKQuestions.EIAAccountNo = dLC.EIAAccountNumber;
            dLC.CKQuestions.EIAWith = dLC.EIAWith;
            dLC.CKQuestions.CreateEIAFlag = dLC.ApplyEIA_YN;
        } else if (val == 'as') {
            dLC.ASQuestions.GoGreen = dLC.goGreen;
            dLC.ASQuestions.EIA_YN = dLC.EIA_YN;
            dLC.ASQuestions.EIAAccountYN = dLC.EIAAccountYN;
            dLC.ASQuestions.EIAAccountNumber = dLC.EIAAccountNumber;
            dLC.ASQuestions.EIAWith = dLC.EIAWith;
            dLC.ASQuestions.ApplyEIA_YN = dLC.ApplyEIA_YN;
            dLC.ASQuestions.ForeignOrigin = dLC.ForeignOrigin;
        } else if (val == 'st') {
            dLC.STQuestions.GoGreen = dLC.goGreen;
            dLC.STQuestions.EverDeclinedFlag = dLC.EverDeclinedFlag;
            dLC.STQuestions.RegisterToEIAFlag = dLC.EIA_YN;
            dLC.STQuestions.EIAAccountFlag = dLC.EIAAccountYN;
            dLC.STQuestions.EIAAccountNo = dLC.EIAAccountNumber;
            dLC.STQuestions.EIAWith = dLC.EIAWith;
            dLC.STQuestions.CreateEIAFlag = dLC.ApplyEIA_YN;
        } 
        else if (val == 'fit') {
            dLC.FitQuestions.GoGreen = dLC.goGreen;
            dLC.FitQuestions.EverDeclinedFlag = dLC.EverDeclinedFlag;
            dLC.FitQuestions.RegisterToEIAFlag = dLC.EIA_YN;
            dLC.FitQuestions.EIAAccountFlag = dLC.EIAAccountYN;
            dLC.FitQuestions.EIAAccountNo = dLC.EIAAccountNumber;
            dLC.FitQuestions.EIAWith = dLC.EIAWith;
            dLC.FitQuestions.CreateEIAFlag = dLC.ApplyEIA_YN;
        }
        else {
            dLC.PLQuestions.GoGreen = dLC.goGreen;
            dLC.PLQuestions.EverDeclinedFlag = dLC.EverDeclinedFlag;
            dLC.PLQuestions.RegisterToEIAFlag = dLC.EIA_YN;
            dLC.PLQuestions.EIAAccountFlag = dLC.EIAAccountYN;
            dLC.PLQuestions.EIAAccountNo = dLC.EIAAccountNumber;
            dLC.PLQuestions.EIAWith = dLC.EIAWith;
            dLC.PLQuestions.CreateEIAFlag = dLC.ApplyEIA_YN;
        }
    }

    /* Return Diamond and platinum object question answers ends  */


    /* Return RFB object question  answers  */

    function setRfbVal() {
        dLC.RFBQuestions.ForeignOrigin = dLC.ForeignOrigin;
        dLC.RFBQuestions.GoGreen = dLC.goGreen;
        dLC.RFBQuestions.EIA_YN = dLC.EIA_YN;
        dLC.RFBQuestions.EIAAccountYN = dLC.EIAAccountYN;
        dLC.RFBQuestions.EIAAccountNumber = dLC.EIAAccountNumber;
        dLC.RFBQuestions.EIAWith = dLC.EIAWith;
        dLC.RFBQuestions.ApplyEIA_YN = dLC.ApplyEIA_YN;
    }

    /* Return Diamond and platinum object question  answers ends  */


    /* Event to see Declaration  */

    dLC.slideDownDeclaration = function () {
        dLC.showEIASection = false;
        dLC.downArrowDec = false;
        $('#delcaration-text').slideDown();
    }

    /* End of event to see declaration */


    /* Change PA declaration section */

    dLC.paDeclaration = function (ans) {
        if (ans == 'Y') {
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Warning",
                "modalBodyText": "Please contact the call center or the nearest branch for assistance !",
                "showCancelBtn": false,
                "hideCloseBtn": true,
                "modalSuccessText": "Ok",
                "showAlertModal": true,
                "positiveFunction": function () {
                    dLC.paDeclarationFlag = 'N';
                }
            }
        }
    }

    /* End of change of PA declarations section */


    /* Delaration agree Click Event */

    dLC.agreeClick = function () {
        var lemeiskData = {
            "page": window.location.href,
            "product": dLC.primaryProduct

        }


        $rootScope.leminiskObj = lemeiskData

        $rootScope.lemniskCodeExcute();
        dLC.showEIASection = true;
        dLC.downArrow = true;
        dLC.downArrowDec = true;
        $('#delcaration-text').slideUp();
        $('#memberedQuestionDeclaration').slideUp();
        // dLC.checkPaymentMode();

    }

    /* End of decalration click event */




    /* Update Email and Mobile call to service  */

    function updateEmailMobile(obj, service) {
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/" + service, obj, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (response.ResponseCode == 1) {
                    dLC.emailEdit = false;
                    dLC.mobNoEdit = false;
                    dLC.verifyOTPSuccess = false
                    if (service == 'UpdateMobile') {
                        /* Update Session storage mobile no. in case of any changes */

                        var mobNo = sessionStorage.getItem('mobNo');

                        if (mobNo != obj.Mobile) {
                            sessionStorage.setItem('mobNo', obj.Mobile)
                        }

                        /* Update Session storage mobile no. in case of any changes ends*/
                        prequoteData.prequote.MobileNo = obj.Mobile;
                        sessionStorage.setItem('prequoteData', JSON.stringify(prequoteData));
                    }
                    if (service == 'UpdateEmail') {
                        prequoteData.prequote.EmailId = obj.Email;
                        sessionStorage.setItem('prequoteData', JSON.stringify(prequoteData));
                    }

                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": response.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function (err) {
            });

    }

    /* Update Email and Mobile call to service ends */


    /*Update Email */

    dLC.updateEmail = function (val) {
        if (/^[_a-zA-Z0-9_.\-]+(\.[_a-zA-Z0-9_.\-]+)*@[a-zA-Z_.\-0-9-]+(\.[a-zA-Z_.\-0-9-]+)*(\.[a-zA-Z]{2,4})$/.test(val)) {
            dLC.validEmail = true;
            var obj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Email": val
            }
            updateEmailMobile(obj, 'UpdateEmail')
        } else {
            dLC.validEmail = false;
            dLC.showEIASection = false;
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Please enter a valid Email no.",
                "showCancelBtn": false,
                "modalSuccessText": "OK",
                "modalCancelText": "No",
                "showAlertModal": true
            }
        }
    }

    /*Update Email Ends*/


    /*Update Mobile */

    dLC.updateMobile = function (val) {
        if (/^[6789]\d{9}$/.test(val)) {
            dLC.validMobile = true;
            var obj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Mobile": val
            }
            updateEmailMobile(obj, 'UpdateMobile')
        } else {
            dLC.validMobile = false;
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Please enter a valid mobile no.",
                "showCancelBtn": false,
                "modalSuccessText": "OK",
                "modalCancelText": "No",
                "showAlertModal": true
            }
        }
    }

    /*Update Mobile Ends*/


    /*Request otp*/

    dLC.sendOTP = function (event) {
        event.target.value = "Sending";
        event.target.disabled = true;
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/RequestOTP", {
            "ReferenceNumber": sessionStorage.getItem('rid')
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                event.target.disabled = false;
                if (response.ResponseCode == 1) {
                    event.target.value = "Resend OTP";
                    if (dLC.resendButtonText) {
                        dLC.otpSendText = "OTP Re-send Sucessfully ";
                    }
                    dLC.otpButton = "resend-Otp";

                    /* $rootScope.alertData = {
                         "modalClass": "regular-alert",
                         "modalHeader": "Success",
                         "modalBodyText": response.ResponseMessage,
                         "gtagPostiveFunction" : "click-button,declaration,"+dLC.pageUrl+"_OTP-send-[OK]",
                         "gtagCrossFunction" : "click-button,declaration,"+dLC.pageUrl+"_OTP-send-[X]",
                         "gtagNegativeFunction" : "click-button,declaration,"+dLC.pageUrl+"_OTP-send-[NO]",
                         "showCancelBtn": false,
                         "modalSuccessText": "OK",
                         "modalCancelText": "No",
                         "showAlertModal": true
                     }*/
                } else {
                    event.target.value = "Send OTP";
                    event.target.disabled = false;
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": response.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function (err) {
            });
    }

    /*Request otp ends */


    /* Verify otp */

    dLC.verifyOTP = function (val, event) {
        if (val == undefined || val == "") {
            $rootScope.alertConfiguration('E', "Please enter valid OTP.");
            return false;
        }

        //SMITA T&C Changes
        if((!dLC.tcAgreed && dLC.pgPaymentMode == 'JP_ emandate') || (!dLC.tcAgreed && dLC.pgPaymentMode == 'JP_Enach')) {
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "T&C",
                "modalBodyText": "Kindly click on T&C to proceed further.",
                "showCancelBtn": false,
                "modalSuccessText": "Close",
                "modalCancelText": "No",
                "showAlertModal": true,  
            }
            return;
        } 
        //SMITA T&C Changes ends  

        if (dLC.verifyOTPSuccess && dLC.pgPaymentMode == 'cards') {
            //pgRequest(event);
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Success",
                "modalBodyText": "Premium payment will be allowed on same credit card only ",
                "showCancelBtn": false,
                "gtagPostiveFunction": "click-button,declaration,OTP-verified-[OK]",
                "gtagCrossFunction": "click-button,declaration,OTP-verified-[X]",
                "gtagNegativeFunction": "click-button,declaration,OTP-verified-[NO]",
                "modalSuccessText": "Proceed",
                "modalCancelText": "No",
                "showAlertModal": true,
                "positiveFunction": function () {
                    pgRequest(event);
                    event.target.innerText = "Proceed To Payment";
                    event.target.disabled = false;
                }
            }
        } else if (dLC.verifyOTPSuccess) {
            pgRequest(event);
        } else {
            event.target.innerText = "Verifying....";
            event.target.disabled = true;
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/VerifyOTP", {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "OTP": val
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    if (response.ResponseCode == 1) {
                        if(aS.checksome(val) == response.ResponseData.Token){
                            dLC.verifyOTPSuccess = true

                        if (dLC.pgPaymentMode == 'cards') {
                            event.target.innerText = "Prceed to Payment";
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Success",
                                "modalBodyText": "Premium payment will be allowed on same credit card only ",
                                "showCancelBtn": false,
                                "gtagPostiveFunction": "click-button,declaration,OTP-verified-[OK]",
                                "gtagCrossFunction": "click-button,declaration,OTP-verified-[X]",
                                "gtagNegativeFunction": "click-button,declaration,OTP-verified-[NO]",
                                "modalSuccessText": "Proceed",
                                "modalCancelText": "Cancel",
                                "showAlertModal": true,
                                "positiveFunction": function () {
                                    pgRequest(event);
                                    event.target.innerText = "Proceed To Payment";
                                    event.target.disabled = false;
                                }
                            }
                        }
                        else {
                            pgRequest(event);
                            event.target.innerText = "Proceed To Payment";
                            event.target.disabled = false;
                        }
                        }
                        else{
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Error",
                                "modalBodyText": "Entered OTP is incorrect",
                                "showCancelBtn": false,
                                "modalSuccessText": "OK",
                                "modalCancelText": "No",
                                "showAlertModal": true
                            }
                            event.target.innerText = "Verify and Pay";
                            event.target.disabled = false;
                        }

                        
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": response.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                        event.target.innerText = "Verify and Pay";
                        event.target.disabled = false;
                    }
                }, function (err) {
                    event.target.innerText = "Verify and Pay";
                    event.target.disabled = false;
                });
        }
    }

    /*Verify otp ends */


    dLC.openTermCondition = function () {
        $('#payment-model').modal('toggle')
    }

    /* check payment mode */
    dLC.checkPaymentMode = function () {
        if (dLC.isChecked) {
            dLC.pgPaymentMode = "emandate_normal";
        } else {
            dLC.pgPaymentMode = "normal";
        }
    }
    /* check payment mode end */
    /*Payment gateway Request */

    function pgRequest(event) {
        /*if(dLC.pgPaymentMode == ''){
            $('#payment-model').modal('toggle')
            return false;
        }*/


        var gId = document.cookie.split(";").find(function (element) { return element.includes("_gid") }).split("=")[1];
        $http.defaults.headers.common['client-gid'] = gId;

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/PGRequest", {
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "PaymentType": dLC.pgPaymentMode
        }, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                //event.target.innerText = "Proceed to Payment";
                //event.target.disabled = false;
                if (response.ResponseCode == 1) {
                    $rootScope.proceedPayment = true;
                    if (response.ResponseData == "CITI_API") {
                        $location.url("citi-payment-page");
                    }
                    else {
                        window.location.href = response.ResponseData;
                    }

                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": response.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function (err) {
            });
    }

    /*Payment gateway Request ends */

    /* Change Pg payment Mode */
    dLC.changePgPaymentMode = function (param) {
        $('#payment-model').modal('toggle')
    }



    /* Proceed to payment */

    dLC.proceedToPayment = function (event) {
        event.target.innerText = "Proceeding....";
        event.target.disabled = true;
        pgRequest(event);
    }

    /* End of proceeding to payment */

    /*Function calling*/
    dLC.callGetSummary= function(){
        if(!$routeParams.party_id && !$routeParams.proposal_no && !$routeParams.token){
            getSummary();
        }
    }

    dLC.callGetSummary();


    getDeclarartionMemberedQuestion();

    /*Function calling Ends*/
    
    // window.addEventListener('beforeunload', function (e) {
    //     aS.getData(ABHI_CONFIG.apiUrl + "gen/GetallSurveyQuestions", "", false, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(function (data) {
    //             if (data.ResponseCode == 1) {
    //                 dLC.quiz = data.ResponseData;
    //             }
    //         }, function (err) {
    
    //         })

    //     e.preventDefault();
    //     e.returnValue = '';
    //     $('#customer-concern').modal({ backdrop: 'static', keyboard: false });
        
    // });
    /** customer concern end **/
    dLC.saveQuesAns = function(){
        var QuestionObj = {}
        QuestionObj = dLC.quiz.Result
        var AnswerObject = dLC.answer;
        var questionAnsObj = {
            "questionAnsObj": {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "QuestionObject":
                {
                    QuestionObj
                },
                "AnswerObject":
                {
                    AnswerObject
                }
            }
        }
        aS.postData(ABHI_CONFIG.apiUrl + "gen/SaveQueAnsWRTCustomer",  questionAnsObj, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (data) {
            if (data.ResponseCode == '1') {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": data.ResponseMessage,
                    "showCancelBtn": false,
                    "modalSuccessText": "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function () {
                        dLC.answer1 = "";
                        dLC.answer2 = "";
                        $('#customer-concern').modal('hide');
                    }
                }
            }else{
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": data.ResponseMessage,
                    "showCancelBtn": false,
                    "modalSuccessText": "Ok",
                    "showAlertModal": true,
                    "positiveFunction": function () {
                        dLC.answer1 = "";
                        dLC.answer2 = "";
                        $('#customer-concern').modal('hide');
                    }
                }
            }  
        });
    }

    /* e-KYC */
    dLC.kycClick = function () {
        aS.getData(ABHI_CONFIG.apiUrl + "GEN/GetEKYCURL?RefernceNo=" + sessionStorage.getItem('rid') ,"",true, {
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (response.ResponseCode == 1) {
                /*Function calling*/
                dLC.callGetSummary= function(){
                    if(!$routeParams.party_id && !$routeParams.proposal_no && !$routeParams.token){
                        getSummary();
                    }
                }
                dLC.validEmail = false;
                dLC.showDeclarationSection = true;
                dLC.showEIASection = false;
                dLC.showPaymentSection = false;
                if(response.ResponseData.URL != null && response.ResponseData.URL != undefined){
                    window.location.href = response.ResponseData.URL;
                } else{                    
                    sessionStorage.setItem('TransactionID',response.ResponseData.TransactionID);
                }
            } else {
                dLC.callGetSummary= function(){
                    if(!$routeParams.party_id && !$routeParams.proposal_no && !$routeParams.token){
                        getSummary();
                    }
                }
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": response.ResponseMessage,
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true
                }
            }
        }, function (err) {
        
        });
    }
    /* e-KYC Ends */

}]);

/* End of Declaration controller sendOTP */