
/*
    Name: Insured Details Page Controller
    Author: Pankaj Patil
    Date: 01/08/2018    
*/

var iDApp = angular.module("insuredDetailsApp", []);

iDApp.controller("insuredDetails", ['$rootScope', 'appService', 'ABHI_CONFIG','$location', '$timeout','$filter','productValidationService', function($rootScope, appService, ABHI_CONFIG, $location, $timeout,$filter,productValidationService) {


    /* Variable Initilization */

        var rID = this; // Current Controller Instance
        var aS = appService; // app service instance
        rID.heightWeightMandatory = true; // denoting height and weight are mandotory or not. true - yes -- false - no
        rID.insuredMembers = []; // Storing all Insured members list. Use for showing insured details member in header tab
        var panCardFlag = true; // Flag for checking pan card is mandory or not.
        rID.productName= sessionStorage.getItem('pName'); // Getting primary product name form sessionstorage
        rID.insuredDetailsPageType = window.location.hash.substring(3); //Check type of insured details page
        var Risk_class; // Variable to store risk class value
        var insuredMemberDetails; // Storing all insured members with respect to selected products.
        rID.showPerAnum = false;
        var projectPlans = {}; // To store project plans
        var calculatePremiumParams; // To store calculate premium service parameters.
        var currentActiveMember; // Stors current active member in this variable
        rID.currentActiveMemberGender = "1"; // Stors current active member gender in this variable
        var curActMember = {}; // Complete object of current active member 
        var validMemberOfAC = false;
        var fIDQ = 0; // To store insured member details load sequennce.
        var currentPlan;
        rID.stProductAvail = false;
        var deleteOptionalCover = false; // To store current plan of project.
        var primaryProduct; // To store primary product
        var selfObj = new Object(); // Self object.
        var insuredObj = new Object(); // Insured membe object
        var insuredCurrentMember = new Object(); // To store current insured membe robject
        var activeRelationToProposer ;
        var ttd_covers = [1000,2000,3000,4000,5000,7500,10000,12500,15000,20000,25000,30000,40000,50000]; // TTD cover data
        var emi_protect_covers = [50000,75000,100000,200000,300000,400000,500000]; // EMi Cover list
        var loan_protect_covers = [100000,200000,300000,400000,500000,600000,700000,800000,900000,1000000,1500000,2000000,2500000,3000000,4000000,5000000,10000000,15000000,20000000,50000000]; // Loan cover list
        rID.hideSubmitButton = true;

        if(rID.productName == 'Activ Care'){
            rID.AC = true;
        }

        const IDFCIMDCODE = "2115779";

        function isIDFCPasa() {
            rID.isIDFCPasa =  sessionStorage.getItem('imdCode') === IDFCIMDCODE ? true : false;
        }
    
        isIDFCPasa();
        rID.PADirect = false;
        if(sessionStorage.getItem("pa-si") != null){
            rID.PADirect = true;
        }

    /* End of variable Initilization */   


    /* To Fetch Insured Members */

        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });
        
        console.log("GetInsuredMembers Request");
        console.log(reqData);

        aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetInsuredMembers",{
                "_data": reqData,
            },true,{
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    console.log("GetInsuredMembers Response");
                    console.log(data);

                    aS.triggerSokrati(); /* Triggering Sokrati */
                    if(data.ResponseCode == 1){
                        if(data.ResponseData.Tenure == "1"){
                            rID.showPerAnum = true;
                        }
                        insuredMemberDetails = data.ResponseData.ProductInsuredDetail;
                        rID.totalProducts = insuredMemberDetails.length;

                        /* Check for Gender */
                    for (var i = 0; i < insuredMemberDetails[0].InsuredMembers.length; i++) {
                        if (insuredMemberDetails[0].InsuredMembers[i].Gender != "1") {
                            rID.isAllMemberMale = false;
                        }
                    }
                    
                        /* To store primary products insuredMembers */

                            for(var i = 0; i < insuredMemberDetails.length; i++){
                                if(insuredMemberDetails[i].IsPrimaryProduct){
                                    primaryProduct = insuredMemberDetails[i].ProductCode;
                                    rID.insuredMembers = insuredMemberDetails[i].InsuredMembers.slice(1);
                                    break;
                                }
                            }

                        /* End of storing primary products insuredMembers */

                        /* To fetch insured member details for first member */
                        fetchInsuredDetails(rID.insuredMembers[0].Gender, rID.insuredMembers[0].RelationType,rID.insuredMembers[0].RelationWithProposer,true);
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": "Some error ocurred.",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                },function(err){

                });

    /* End of fetching insured members */


    /* To decide active member */

        function decideActiveMember(ProductInsuredDetail,calculatePremiumSubParam,rFBType){
            for(var i = 0;i < ProductInsuredDetail.length; i++){
                if(ProductInsuredDetail[i].ProductCode == rFBType){
                    calculatePremiumParams[rFBType][calculatePremiumSubParam] = ProductInsuredDetail[i].InsuredMembers;
                    projectPlans[rFBType+"Plan"] = ProductInsuredDetail[i].Plan;
                    for(var j = 0; j<calculatePremiumParams[rFBType][calculatePremiumSubParam].length;j++){
                        if(calculatePremiumParams[rFBType][calculatePremiumSubParam][j].RelationType == 'PROPOSER' || calculatePremiumParams[rFBType][calculatePremiumSubParam][j].RelationType == 'S'){
                            selfObj[rFBType] = calculatePremiumParams[rFBType][calculatePremiumSubParam][j];
                        }
                        if(calculatePremiumParams[rFBType][calculatePremiumSubParam][j].RelationType == rID.activeMember){
                            currentActiveMember = calculatePremiumParams[rFBType][calculatePremiumSubParam][j];
                            curActMember[rFBType] = calculatePremiumParams[rFBType][calculatePremiumSubParam][j];
                        }
                    }
                    break;
                }
            }
        }

    /* End of decidinga active member */

        /* fetch quote details  */
                    function getQuoteDetails(){
                        var reqData = $rootScope.encrypt({
                            "ReferenceNumber": sessionStorage.getItem('rid')
                        });
        
                        console.log("GetQuoteDetails Request");
                        console.log(reqData);
                
                            aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetQuoteDetails",{
                                "_data": reqData,
                               
                            },{
                                headers:{
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function(data){
                                    var data = JSON.parse($rootScope.decrypt(data._resp))
                                    console.log("GetQuoteDetails Response");
                                    console.log(data);

                                    if(rID.PL){
                                        rID.quoteDetailOfProduct = data.ResponseData.PlatinumQuote;
                                        for(var i = 0 ; i < rID.quoteDetailOfProduct.MemberDetails.length ; i++){
                                            if(rID.activeMember == rID.quoteDetailOfProduct.MemberDetails[i].RelationType && rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y'){
                                                    rID.isPAForActiveMemeber = true;
                                            }
                                        }
                                    }
                                })

                    }

    /* fetch quote details  */


       /* fetch quote details  */
                    function UpdateQuoteDetails(){

                            aS.postData(ABHI_CONFIG.apiUrl+"GEN/UpdateQuoteDetails",{
                                "ReferenceNumber": sessionStorage.getItem('rid'),
                                "PLUpdateQuote" : rID.quoteDetailOfProduct
                               
                            },{
                                headers:{
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function(data){
                                    if(rID.PL){
                                        //rID.quoteDetailOfProduct = data.ResponseData.PlatinumQuote;
                                         calculatePremium();
                                    }
                                })

                    }

    /* fetch quote details  */


    /* To decide current member and his product type */

        function decideProductsOfCurrentMember(currentMemberData){
            delete rID.PA;
            delete rID.CI;
            delete rID.CS;
            activeRelationToProposer = currentMemberData.MemberDetail.RelationWithProposer;
            for(var i = 0; i < insuredMemberDetails.length; i++){
                insuredObj[insuredMemberDetails[i].ProductCode] = insuredMemberDetails[i].InsuredMembers;
                for(var j = 0; j<insuredMemberDetails[i].InsuredMembers.length;j++){
                    if(insuredMemberDetails[i].InsuredMembers[j].RelationType == currentMemberData.MemberDetail.RelationType){
                        rID[insuredMemberDetails[i].ProductCode] = true;
                        insuredCurrentMember[insuredMemberDetails[i].ProductCode] = insuredMemberDetails[i].InsuredMembers[j];
                        checkAgeDiff(rID.insuredDetails.MemberDetail.DOB, null) 
                        break;                        
                    }
                }
            }
        }

    /* End of deciding current member and his product type */


    /* To fetch insured details */

        function fetchInsuredDetails(Gender, RelationType,RelationWithProposer,flag){
            var reqData = $rootScope.encrypt({
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "RelationType":RelationType,
                "RelationWithProposer":RelationWithProposer
            });    
        
            console.log("GetMemberDetails Request");
            console.log({"ReferenceNumber": sessionStorage.getItem('rid'),
            "RelationType":RelationType,
            "RelationWithProposer":RelationWithProposer});

            aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMemberDetails",{
                "_data": reqData
            },flag,{
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    console.log("GetMemberDetails Response");
                    console.log(data);

                    if(data.ResponseCode == 1){
                        rID.insuredDetails = data.ResponseData; // Stored insured member response data
                        if(rID.insuredDetails.PremiumDetail.ProductPremium.ProductName == "FIT"){
                            rID.FIT = true;
                        }
                        rID.FirstName = rID.insuredDetails.MemberDetail.FirstName;
                        rID.LastName = rID.insuredDetails.MemberDetail.LastName;
                        rID.insuredDetails.PremiumDetail.TotalPremium = 0; // Inilize premium to 0
                        rID.imdcode = rID.insuredDetails.MemberDetail.IMdCode;

                        /* Premium calulation by calculating primums of all prducts */

                            angular.forEach(rID.insuredDetails.PremiumDetail.ProductPremium,function(v,i){
                                rID.insuredDetails.PremiumDetail.TotalPremium = parseInt(rID.insuredDetails.PremiumDetail.TotalPremium) + parseInt(v.Premium);
                                 if(parseInt(v.Premium) <= 0 ){
                                        rID.hideSubmitButton = false;
                                    }
                            });
                           

                        /* End of premium calculation */


                        /* User date of birth mapping */

                            if(rID.insuredDetails.MemberDetail.DOB != null){
                                var userDateOfBirth = rID.insuredDetails.MemberDetail.DOB.split('-');
                                rID.currentActiveMemberGender = Gender;
                                rID.activeMember = RelationType;
                                if(userDateOfBirth.length > 0){
                                   rID.day = userDateOfBirth[2];
                                   rID.month = userDateOfBirth[1];
                                   rID.year = userDateOfBirth[0];
                                   rID.DOB = userDateOfBirth[2]+"-"+userDateOfBirth[1]+"-"+userDateOfBirth[0];
                                }
                            }

                        /* End of user date of birth mapping */

                        if(rID.AC && rID.insuredDetails.MemberDetail.PolicyType == "FF" && rID.insuredDetails.MemberDetail.DOB != null && rID.insuredDetails.MemberDetail.DOB != ""  && rID.insuredDetails.MemberDetail.Age > 55){
                            validMemberOfAC = true;
                        }
                        if(rID.AC && rID.insuredDetails.MemberDetail.PolicyType == "MI" && rID.insuredDetails.MemberDetail.DOB != null && rID.insuredDetails.MemberDetail.DOB != ""  && (rID.insuredDetails.MemberDetail.Age < 55 || rID.insuredDetails.MemberDetail.Age > 80)){
                            rID.day = "";
                            rID.month = "";
                            rID.year = "";
                            rID.DOB = "";
                           
                        }

                        /* If current member is self then he has to be earning */
                        if(rID.insuredDetails.MemberDetail.RelationType == 'S'){
                            rID.insuredDetails.MemberDetail.EarningNonEarning = "Earning";
                        }

                        fetchInsuredDetailQuestions(rID.insuredMembers[fIDQ]); // Fetch member questions
                        calculatePremiumParams = {
                            "ReferenceNumber": sessionStorage.getItem('rid')
                        } // Inilized calculate premimum param
                        decideProductsOfCurrentMember(rID.insuredDetails); // To decide applicable products to current member

                        /* Based on selection or product inilize activ member and parameter for calculate premium service */

                            if(rID.PA){
                                rID.nOD = rID.insuredDetails.MemberDetail.NatureOfDuty;
                                calculatePremiumParams.PA = {};
                                decideActiveMember(rID.insuredDetails.ProductInsuredDetail,'PAPremiumList','PA');
                                rID.Designation = curActMember.PA.Designation;
                            }
                            if(rID.CI){
                                rID.nOD = rID.insuredDetails.MemberDetail.NatureOfDuty;
                                calculatePremiumParams.CI = {};
                                decideActiveMember(rID.insuredDetails.ProductInsuredDetail,'CIPremiumList','CI');
                                rID.Designation = curActMember.CI.Designation;
                            }
                            if(rID.CS){
                                rID.nOD = rID.insuredDetails.MemberDetail.NatureOfDuty;
                                calculatePremiumParams.CS = {};
                                decideActiveMember(rID.insuredDetails.ProductInsuredDetail,'CSPremiumList','CS');
                                rID.Designation = curActMember.CS.Designation;
                            }
                            if(rID.PL){
                                getQuoteDetails();
                                rID.nOD = rID.insuredDetails.MemberDetail.NatureOfDuty;
                                rID.Designation = rID.insuredDetails.MemberDetail.Designation;
                               calculatePremiumParams.Platinum = {
                                    "MemberDetails" : rID.insuredMembers
                               };
                            }
                            if(rID.DI){
                              // calculatePremiumParams.Diamond = {};
                               calculatePremiumParams.Diamond = {
                                    "MemberDetails" : rID.insuredMembers
                               };
                            }
                            if(rID.AC){
                               calculatePremiumParams.AC = {
                                    "MemberDetails" : rID.insuredMembers
                               };
                            }
                            
                        /* End of Based on selection or product inilize activ member and parameter for calculate premium service */


                        /* If primary product is PA and no cross sell and user didnt opt for HCB then height weight is not mandatory */

                            if(insuredMemberDetails.length == 1 && primaryProduct == 'PA' && rID.insuredDetails.MemberDetail.HCB == 'N'){
                                rID.heightWeightMandatory = false;
                            }

                        /* End of If primary product is PA and no cross sell and user didnt opt for HCB then height weight is not mandatory */

                        if(primaryProduct == 'PA'){
                            fetchUpdateQuoteDetails(true)
                        }

                        /* To decided sum insured of all members if user already entered annual income */

                            if(rID.insuredDetails.MemberDetail.AnnualIncome > 0 && (rID.PA || rID.CI || rID.CS)){
                                rID.calculateAnnualIncome(rID.insuredDetails.MemberDetail.AnnualIncome);
                            }

                        /* End of deciding sum insured of all members */

                            rID.diagnosisDay = "";
                            rID.diagnosisMonth = "";
                            rID.diagnosisYear = "";
                            rID.consultationDay = "";
                            rID.consultationMonth = "";
                            rID.consultationYear = "";
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": "Some error ocurred.",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                    if(rID.insuredDetails.ProductInsuredDetail != null){
                        for(var i = 0; i< rID.insuredDetails.ProductInsuredDetail.length; i++){
                            if(rID.insuredDetails.ProductInsuredDetail[i].ProductCode == "PA"){
                                for(var j=0; j<rID.insuredDetails.ProductInsuredDetail[i].InsuredMembers.length;j++){
                                    if(rID.insuredDetails.ProductInsuredDetail[i].InsuredMembers[j].SumInsured == null)
                                    {
                                        if(rID.insuredDetails.ProductInsuredDetail[i].InsuredMembers[j].RelationWithProposer == "KID"){
                                            rID.insuredDetails.ProductInsuredDetail[i].InsuredMembers[j].SumInsured = 1000000;
                                        }else{
                                            rID.insuredDetails.ProductInsuredDetail[i].InsuredMembers[j].SumInsured = 1500000;
                                        }
                                    }
                                }
                            }
                        }
                    }
                },function(err){

                });
        }

    /* End of fetching insured details */


    /* fetch quote details */
        function fetchUpdateQuoteDetails(param){
            if(param){
                var reqData = $rootScope.encrypt({
                    "ReferenceNumber": sessionStorage.getItem('rid')
                });  
        
                console.log("GetQuoteDetails Request");
                console.log(reqData);

                aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetQuoteDetails",{
                    "_data": reqData
                    },true,{
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function(data){
                            var data = JSON.parse($rootScope.decrypt(data._resp))
                            console.log("GetQuoteDetails Response");
                            console.log(data);

                            rID.quoteDetails = data.ResponseData.PAQuote ;
                            //console.log(rID.quoteDetails)
                        })

            }
            else{
                     angular.forEach( rID.quoteDetails.PAQuoteDetails , function( v ,i ){
                            v.BB_suminsured = "0",
                            v.BB_suminsured =  "0",
                            v.BBB_suminsured =  "0",
                            v.TTD =  "N",
                            v.TTD_Suminsured =  "0",
                            v.BBB =  "N",
                            v.CB =  "N",
                            v.BB =  "N",
                            v.AS =  "N",
                            v.EMIP =  "N",
                            v.EMIP_Suminsured =  "0",
                            v.LP =  "N",
                            v.LP_Suminsured =  "0",
                            v.WWEAS =  "N",
                            v.HCIP =  "N",
                            v.HCNIP =  "N",
                            v.HCB =  "N",
                            v.PDL =  "0",
                            v.no_of_days =  "0"
                            
                     })
                     //console.log(rID.quoteDetails.PAQuoteDetails )
                    aS.postData(ABHI_CONFIG.apiUrl+"GEN/UpdateQuoteDetails",{
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "PAUpdateQuote": {
                        "PAQuoteDetails" : rID.quoteDetails.PAQuoteDetails
                    }
                    },true,{
                        headers:{
                            'Content-Type': 'application/json'
                            }
                        })
                        .then(function(data){

                        })          
            }
        }

    /* fetch quote details End*/

    /* email hint text logic */
        $(function (){
        var info = $('.info');

        $('#insuredMemberEmailId').mailtip({
          onselected: function (mail){
            rID.insuredDetails.MemberDetail.Email = mail;
          }
        });
      });
    /* email hint text logic ends*/   


    /* To Fetch insured details questions */

        function fetchInsuredDetailQuestions(insuredMembers){
            var reqData = $rootScope.encrypt({
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "RelationType":insuredMembers.RelationType,
                "RelationWithProposer":insuredMembers.RelationWithProposer
            });
        
            console.log("GetMemberQuestions Request");
            console.log(reqData);
    
            aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMemberQuestions",{
                "_data": reqData
            },true,{
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    console.log("GetMemberQuestions Response");
                    console.log(data);

                    if(data.ResponseCode == 1){
                        rID.insuredMemberQuestions = data.ResponseData;
                        // rID.insuredMemberQuestions.PLMemberQuestions.Terminal_illness_YN = 'Y';
                        // rID.insuredMemberQuestions.PLMemberQuestions.Have_u_diagnosed_YN = 'Y';

                        /* If primary product is diamond then mapping rfb and diamond questionarrie data */

                            if(primaryProduct == 'DI' && insuredMemberDetails.length > 1){
                                if(rID.CI || rID.CS){
                                    rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity = rID.insuredMemberQuestions.DIMemberQuestions.AlcoholQuantity;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity = rID.insuredMemberQuestions.DIMemberQuestions.GuthkaQuantity;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.IsSmokeAlcohol = rID.insuredMemberQuestions.DIMemberQuestions.IsSmokeAlcohol;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.OtherName = rID.insuredMemberQuestions.DIMemberQuestions.OtherName;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.OtherQuantity = rID.insuredMemberQuestions.DIMemberQuestions.OtherQuantity;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreExisitingPolicy = rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreviousBenefitCover = rID.insuredMemberQuestions.DIMemberQuestions.PreviousBenefitCover;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreviousClaimRejectDetail = rID.insuredMemberQuestions.DIMemberQuestions.PreviousClaimRejectDetail;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreviousClaimRejected = rID.insuredMemberQuestions.DIMemberQuestions.PreviousClaimRejected;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreviousExistingSI = rID.insuredMemberQuestions.DIMemberQuestions.PreviousExistingSI;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreviousPolicyClaim = rID.insuredMemberQuestions.DIMemberQuestions.PreviousPolicyClaim;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreviousPolicyNumber = rID.insuredMemberQuestions.DIMemberQuestions.PreviousPolicyNumber;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity = rID.insuredMemberQuestions.DIMemberQuestions.SmokeQuantity;
                                }
                            }

                        /* End of mapping of rfb and diamond questionarrie data */


                         if(primaryProduct == 'CK' && rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE == 'Y' && ( rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE_START_END_DATE != null || rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE_START_END_DATE != '') ){
                             var dateVal = rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE_START_END_DATE.split('to')
                             rID.selfISolationStartDate = dateVal[0]
                             rID.selfISolationEndDate = dateVal[1]
                        }

                        if(rID.insuredMemberQuestions.STMemberQuestions != null){
                                rID.stProductAvail = true;
                        }
                        else{
                             rID.stProductAvail = false;
                        }

                        if(rID.FIT){
                            rID.insuredMemberQuestions.DIMemberQuestions = {};
                            rID.insuredMemberQuestions.DIMemberQuestions['AlcoholQuantity'] = rID.insuredMemberQuestions.FITMemberQuestions.AlcoholQuantity;
                            rID.insuredMemberQuestions.DIMemberQuestions['GuthkaQuantity'] = rID.insuredMemberQuestions.FITMemberQuestions.GuthkaQuantity;
                            rID.insuredMemberQuestions.DIMemberQuestions['SmokeQuantity'] = rID.insuredMemberQuestions.FITMemberQuestions.SmokeQuantity;
                            rID.insuredMemberQuestions.DIMemberQuestions['OtherName'] = rID.insuredMemberQuestions.FITMemberQuestions.OtherName;
                            rID.insuredMemberQuestions.DIMemberQuestions['OtherQuantity'] = rID.insuredMemberQuestions.FITMemberQuestions.OtherQuantity;

                            rID.insuredMemberQuestions.PLMemberQuestions = {};
                            rID.insuredMemberQuestions.PLMemberQuestions['PreviousPolicyNumber'] = rID.insuredMemberQuestions.FITMemberQuestions.PreviousPolicyNumber;
                            rID.insuredMemberQuestions.PLMemberQuestions['PreviousBenefitCover'] = rID.insuredMemberQuestions.FITMemberQuestions.PreviousBenefitCover;
                            rID.insuredMemberQuestions.PLMemberQuestions['PreviousExistingSI'] = rID.insuredMemberQuestions.FITMemberQuestions.PreviousExistingSI;
                            rID.insuredMemberQuestions.PLMemberQuestions['PreviousClaimRejectDetail'] = rID.insuredMemberQuestions.FITMemberQuestions.PreviousClaimRejectDetail;
                            rID.insuredMemberQuestions.PLMemberQuestions['PreviousInsurer'] = rID.insuredMemberQuestions.FITMemberQuestions.PreviousInsurer;

                        }



                        /* If primary product is platinum then mapping RFB and platinum questionarrie data */

                            if(primaryProduct == 'PL' && insuredMemberDetails.length > 1){
                                if(rID.CI || rID.CS){
                                    rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity = (rID.insuredMemberQuestions.PLMemberQuestions.AlcoholQunatity * 7);
                                    rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity = (rID.insuredMemberQuestions.PLMemberQuestions.TobbacoQuantity * 7);
                                    rID.insuredMemberQuestions.RFBMemberQuestions.IsSmokeAlcohol = rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco;
                                    rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity = (rID.insuredMemberQuestions.PLMemberQuestions.SmokeQunatity * 7);
                                    rID.insuredMemberQuestions.RFBMemberQuestions.PreExistingDisease = rID.insuredMemberQuestions.PLMemberQuestions.PreExistingDisease;


                                }
                            }

                        /* End of mapping rfb and platinum questionarrie data */

                        /* Last Consultation Date mapping */
                        if(primaryProduct == 'PL')
                        {
                            if(rID.insuredMemberQuestions.PLMemberQuestions.TILastConsultation_Date != null){
                                var TILastConsultation_Date = rID.insuredMemberQuestions.PLMemberQuestions.TILastConsultation_Date.split('-');
                                if(TILastConsultation_Date.length > 0){
                                rID.TIconsultationDay = TILastConsultation_Date[2];
                                rID.TIconsultationMonth = TILastConsultation_Date[1];
                                rID.TIconsultationYear = TILastConsultation_Date[0];
                                rID.TILastConsultation_Date = TILastConsultation_Date[2]+"-"+TILastConsultation_Date[1]+"-"+TILastConsultation_Date[0];
                                }
                            }
                            if(rID.insuredMemberQuestions.PLMemberQuestions.DGLastConsultation_Date != null){
                                var DGLastConsultation_Date = rID.insuredMemberQuestions.PLMemberQuestions.DGLastConsultation_Date.split('-');
                                if(DGLastConsultation_Date.length > 0){
                                rID.DGconsultationDay = DGLastConsultation_Date[2];
                                rID.DGconsultationMonth = DGLastConsultation_Date[1];
                                rID.DGconsultationYear = DGLastConsultation_Date[0];
                                rID.DGLastConsultation_Date = DGLastConsultation_Date[2]+"-"+DGLastConsultation_Date[1]+"-"+DGLastConsultation_Date[0];
                                }
                            }
                        }

                        if(primaryProduct == 'DI')
                        {
                            if(rID.insuredMemberQuestions.DIMemberQuestions.TILastConsultation_Date != null){
                                var TILastConsultation_Date = rID.insuredMemberQuestions.DIMemberQuestions.TILastConsultation_Date.split('-');
                                if(TILastConsultation_Date.length > 0){
                                rID.TIconsultationDay = TILastConsultation_Date[2];
                                rID.TIconsultationMonth = TILastConsultation_Date[1];
                                rID.TIconsultationYear = TILastConsultation_Date[0];
                                rID.TILastConsultation_Date = TILastConsultation_Date[2]+"-"+TILastConsultation_Date[1]+"-"+TILastConsultation_Date[0];
                                }
                            }

                            if(rID.insuredMemberQuestions.DIMemberQuestions.DGLastConsultation_Date != null){
                                var DGLastConsultation_Date = rID.insuredMemberQuestions.DIMemberQuestions.DGLastConsultation_Date.split('-');
                                if(DGLastConsultation_Date.length > 0){
                                rID.DGconsultationDay = DGLastConsultation_Date[2];
                                rID.DGconsultationMonth = DGLastConsultation_Date[1];
                                rID.DGconsultationYear = DGLastConsultation_Date[0];
                                rID.DGLastConsultation_Date = DGLastConsultation_Date[2]+"-"+DGLastConsultation_Date[1]+"-"+DGLastConsultation_Date[0];
                                }
                            }
                            
                            if(rID.insuredMemberQuestions.DIMemberQuestions.PPLastConsultation_Date != null){
                                var PPLastConsultation_Date = rID.insuredMemberQuestions.DIMemberQuestions.PPLastConsultation_Date.split('-');
                                if(PPLastConsultation_Date.length > 0){
                                rID.PPconsultationDay = PPLastConsultation_Date[2];
                                rID.PPconsultationMonth = PPLastConsultation_Date[1];
                                rID.PPconsultationYear = PPLastConsultation_Date[0];
                                rID.PPLastConsultation_Date = PPLastConsultation_Date[2]+"-"+PPLastConsultation_Date[1]+"-"+PPLastConsultation_Date[0];
                                }
                            }
                        }

                        if(primaryProduct == 'AC')
                        {
                            if(rID.insuredMemberQuestions.ACMemberQuestions.TILastConsultation_Date != null){
                                var TILastConsultation_Date = rID.insuredMemberQuestions.ACMemberQuestions.TILastConsultation_Date.split('-');
                                if(TILastConsultation_Date.length > 0){
                                rID.TIconsultationDay = TILastConsultation_Date[2];
                                rID.TIconsultationMonth = TILastConsultation_Date[1];
                                rID.TIconsultationYear = TILastConsultation_Date[0];
                                rID.TILastConsultation_Date = TILastConsultation_Date[2]+"-"+TILastConsultation_Date[1]+"-"+TILastConsultation_Date[0];
                                }
                            }

                            if(rID.insuredMemberQuestions.ACMemberQuestions.DGLastConsultation_Date != null){
                                var DGLastConsultation_Date = rID.insuredMemberQuestions.ACMemberQuestions.DGLastConsultation_Date.split('-');
                                if(DGLastConsultation_Date.length > 0){
                                rID.DGconsultationDay = DGLastConsultation_Date[2];
                                rID.DGconsultationMonth = DGLastConsultation_Date[1];
                                rID.DGconsultationYear = DGLastConsultation_Date[0];
                                rID.DGLastConsultation_Date = DGLastConsultation_Date[2]+"-"+DGLastConsultation_Date[1]+"-"+DGLastConsultation_Date[0];
                                }
                            }
                            
                            if(rID.insuredMemberQuestions.ACMemberQuestions.SDLast_consultation_date != null){
                                var SDLast_consultation_date = rID.insuredMemberQuestions.ACMemberQuestions.SDLast_consultation_date.split('-');
                                if(SDLast_consultation_date.length > 0){
                                rID.SDconsultationDay = SDLast_consultation_date[2];
                                rID.SDconsultationMonth = SDLast_consultation_date[1];
                                rID.SDconsultationYear = SDLast_consultation_date[0];
                                rID.SDLast_consultation_date = SDLast_consultation_date[2]+"-"+SDLast_consultation_date[1]+"-"+SDLast_consultation_date[0];
                                }
                            }
                            
                            if(rID.insuredMemberQuestions.ACMemberQuestions.BXconsultation_date != null){
                                var BXconsultation_date = rID.insuredMemberQuestions.ACMemberQuestions.BXconsultation_date.split('-');
                                if(BXconsultation_date.length > 0){
                                rID.BXconsultationDay = BXconsultation_date[2];
                                rID.BXconsultationMonth = BXconsultation_date[1];
                                rID.BXconsultationYear = BXconsultation_date[0];
                                rID.BXconsultation_date = BXconsultation_date[2]+"-"+BXconsultation_date[1]+"-"+BXconsultation_date[0];
                                }
                            }
                        }
                        /* End of Last Consultation Date mapping */                        

                        /* Date of Diagnosis mapping */
                        if(primaryProduct == 'PL')
                        {
                            if(rID.insuredMemberQuestions.PLMemberQuestions.TIDate_of_Diagnosis != null){
                                var TIDate_of_Diagnosis = rID.insuredMemberQuestions.PLMemberQuestions.TIDate_of_Diagnosis.split('-');
                                if(TIDate_of_Diagnosis.length > 0){
                                rID.TIdiagnosisDay = TIDate_of_Diagnosis[2];
                                rID.TIdiagnosisMonth = TIDate_of_Diagnosis[1];
                                rID.TIdiagnosisYear = TIDate_of_Diagnosis[0];
                                rID.TIDate_of_Diagnosis = TIDate_of_Diagnosis[2]+"-"+TIDate_of_Diagnosis[1]+"-"+TIDate_of_Diagnosis[0];
                                }
                            }
                            if(rID.insuredMemberQuestions.PLMemberQuestions.DGDate_of_Diagnosis != null){
                                var DGDate_of_Diagnosis = rID.insuredMemberQuestions.PLMemberQuestions.DGDate_of_Diagnosis.split('-');
                                if(DGDate_of_Diagnosis.length > 0){
                                rID.DGdiagnosisDay = DGDate_of_Diagnosis[2];
                                rID.DGdiagnosisMonth = DGDate_of_Diagnosis[1];
                                rID.DGdiagnosisYear = DGDate_of_Diagnosis[0];
                                rID.DGDate_of_Diagnosis = DGDate_of_Diagnosis[2]+"-"+DGDate_of_Diagnosis[1]+"-"+DGDate_of_Diagnosis[0];
                                }
                            }
                        }

                        if(primaryProduct == 'DI')
                        {
                            if(rID.insuredMemberQuestions.DIMemberQuestions.TIDate_of_Diagnosis != null){
                                var TIDate_of_Diagnosis = rID.insuredMemberQuestions.DIMemberQuestions.TIDate_of_Diagnosis.split('-');
                                if(TIDate_of_Diagnosis.length > 0){
                                rID.TIdiagnosisDay = TIDate_of_Diagnosis[2];
                                rID.TIdiagnosisMonth = TIDate_of_Diagnosis[1];
                                rID.TIdiagnosisYear = TIDate_of_Diagnosis[0];
                                rID.TIDate_of_Diagnosis = TIDate_of_Diagnosis[2]+"-"+TIDate_of_Diagnosis[1]+"-"+TIDate_of_Diagnosis[0];
                                }
                            }
                            if(rID.insuredMemberQuestions.DIMemberQuestions.DGDate_of_Diagnosis != null){
                                var DGDate_of_Diagnosis = rID.insuredMemberQuestions.DIMemberQuestions.DGDate_of_Diagnosis.split('-');
                                if(DGDate_of_Diagnosis.length > 0){
                                rID.DGdiagnosisDay = DGDate_of_Diagnosis[2];
                                rID.DGdiagnosisMonth = DGDate_of_Diagnosis[1];
                                rID.DGdiagnosisYear = DGDate_of_Diagnosis[0];
                                rID.DGDate_of_Diagnosis = DGDate_of_Diagnosis[2]+"-"+DGDate_of_Diagnosis[1]+"-"+DGDate_of_Diagnosis[0];
                                }
                            }

                            if(rID.insuredMemberQuestions.DIMemberQuestions.PPDate_of_Diagnosis != null){
                                var PPDate_of_Diagnosis = rID.insuredMemberQuestions.DIMemberQuestions.PPDate_of_Diagnosis.split('-');
                                if(PPDate_of_Diagnosis.length > 0){
                                rID.PPdiagnosisDay = PPDate_of_Diagnosis[2];
                                rID.PPdiagnosisMonth = PPDate_of_Diagnosis[1];
                                rID.PPdiagnosisYear = PPDate_of_Diagnosis[0];
                                rID.PPDate_of_Diagnosis = PPDate_of_Diagnosis[2]+"-"+PPDate_of_Diagnosis[1]+"-"+PPDate_of_Diagnosis[0];
                                }
                            }
                            
                        }

                        if(primaryProduct == 'AC')
                        {
                            if(rID.insuredMemberQuestions.ACMemberQuestions.TIDate_of_Diagnosis != null){
                                var TIDate_of_Diagnosis = rID.insuredMemberQuestions.ACMemberQuestions.TIDate_of_Diagnosis.split('-');
                                if(TIDate_of_Diagnosis.length > 0){
                                rID.TIdiagnosisDay = TIDate_of_Diagnosis[2];
                                rID.TIdiagnosisMonth = TIDate_of_Diagnosis[1];
                                rID.TIdiagnosisYear = TIDate_of_Diagnosis[0];
                                rID.TIDate_of_Diagnosis = TIDate_of_Diagnosis[2]+"-"+TIDate_of_Diagnosis[1]+"-"+TIDate_of_Diagnosis[0];
                                }
                            }
                            if(rID.insuredMemberQuestions.ACMemberQuestions.DGDate_of_Diagnosis != null){
                                var DGDate_of_Diagnosis = rID.insuredMemberQuestions.ACMemberQuestions.DGDate_of_Diagnosis.split('-');
                                if(DGDate_of_Diagnosis.length > 0){
                                rID.DGdiagnosisDay = DGDate_of_Diagnosis[2];
                                rID.DGdiagnosisMonth = DGDate_of_Diagnosis[1];
                                rID.DGdiagnosisYear = DGDate_of_Diagnosis[0];
                                rID.DGDate_of_Diagnosis = DGDate_of_Diagnosis[2]+"-"+DGDate_of_Diagnosis[1]+"-"+DGDate_of_Diagnosis[0];
                                }
                            }

                            if(rID.insuredMemberQuestions.ACMemberQuestions.SDDate_diagnosis != null){
                                var SDDate_diagnosis = rID.insuredMemberQuestions.ACMemberQuestions.SDDate_diagnosis.split('-');
                                if(SDDate_diagnosis.length > 0){
                                rID.SDdiagnosisDay = SDDate_diagnosis[2];
                                rID.SDdiagnosisMonth = SDDate_diagnosis[1];
                                rID.SDdiagnosisYear = SDDate_diagnosis[0];
                                rID.SDDate_diagnosis = SDDate_diagnosis[2]+"-"+SDDate_diagnosis[1]+"-"+SDDate_diagnosis[0];
                                }
                            }

                            if(rID.insuredMemberQuestions.ACMemberQuestions.BXDate_diagnosis != null){
                                var BXDate_diagnosis = rID.insuredMemberQuestions.ACMemberQuestions.BXDate_diagnosis.split('-');
                                if(BXDate_diagnosis.length > 0){
                                rID.BXdiagnosisDay = BXDate_diagnosis[2];
                                rID.BXdiagnosisMonth = BXDate_diagnosis[1];
                                rID.BXdiagnosisYear = BXDate_diagnosis[0];
                                rID.BXDate_diagnosis = BXDate_diagnosis[2]+"-"+BXDate_diagnosis[1]+"-"+BXDate_diagnosis[0];
                                }
                            }
                            
                        }
                        /* Date of Diagnosis mapping */

                        /* End date of Hospitalization mapping */
                        if(primaryProduct == 'PL')
                        {
                            if(rID.insuredMemberQuestions.PLMemberQuestions.TIENDDate_Hopitlzn != null){
                                var TIENDDate_Hopitlzn = rID.insuredMemberQuestions.PLMemberQuestions.TIENDDate_Hopitlzn.split('-');
                                if(TIENDDate_Hopitlzn.length > 0){
                                rID.TIendDay = TIENDDate_Hopitlzn[2];
                                rID.TIendMonth = TIENDDate_Hopitlzn[1];
                                rID.TIendYear = TIENDDate_Hopitlzn[0];
                                rID.TIENDDate_Hopitlzn = TIENDDate_Hopitlzn[2]+"-"+TIENDDate_Hopitlzn[1]+"-"+TIENDDate_Hopitlzn[0];
                                }
                            }
                        }

                        if(primaryProduct == 'DI')
                        {
                            if(rID.insuredMemberQuestions.DIMemberQuestions.TIENDDate_Hopitlzn != null){
                                var TIENDDate_Hopitlzn = rID.insuredMemberQuestions.DIMemberQuestions.TIENDDate_Hopitlzn.split('-');
                                if(TIENDDate_Hopitlzn.length > 0){
                                rID.TIendDay = TIENDDate_Hopitlzn[2];
                                rID.TIendMonth = TIENDDate_Hopitlzn[1];
                                rID.TIendYear = TIENDDate_Hopitlzn[0];
                                rID.TIENDDate_Hopitlzn = TIENDDate_Hopitlzn[2]+"-"+TIENDDate_Hopitlzn[1]+"-"+TIENDDate_Hopitlzn[0];
                                }
                            }
                        }

                        if(primaryProduct == 'AC')
                        {
                            if(rID.insuredMemberQuestions.ACMemberQuestions.TIENDDate_Hopitlzn != null){
                                var TIENDDate_Hopitlzn = rID.insuredMemberQuestions.ACMemberQuestions.TIENDDate_Hopitlzn.split('-');
                                if(TIENDDate_Hopitlzn.length > 0){
                                rID.TIendDay = TIENDDate_Hopitlzn[2];
                                rID.TIendMonth = TIENDDate_Hopitlzn[1];
                                rID.TIendYear = TIENDDate_Hopitlzn[0];
                                rID.TIENDDate_Hopitlzn = TIENDDate_Hopitlzn[2]+"-"+TIENDDate_Hopitlzn[1]+"-"+TIENDDate_Hopitlzn[0];
                                }
                            }
                        }
                        /* End date of Hospitalization mapping */

                        /* Start date of Hospitalization mapping */
                        if(primaryProduct == 'PL')
                        {
                            if(rID.insuredMemberQuestions.PLMemberQuestions.TISTRTDate_Hospitlzn != null){
                                var TISTRTDate_Hospitlzn = rID.insuredMemberQuestions.PLMemberQuestions.TISTRTDate_Hospitlzn.split('-');
                                if(TISTRTDate_Hospitlzn.length > 0){
                                rID.TIstartDay = TISTRTDate_Hospitlzn[2];
                                rID.TIstartMonth = TISTRTDate_Hospitlzn[1];
                                rID.TIstartYear = TISTRTDate_Hospitlzn[0];
                                rID.TISTRTDate_Hospitlzn = TISTRTDate_Hospitlzn[2]+"-"+TISTRTDate_Hospitlzn[1]+"-"+TISTRTDate_Hospitlzn[0];
                                }
                            }
                        }
                        
                        if(primaryProduct == 'DI')
                        {
                            if(rID.insuredMemberQuestions.DIMemberQuestions.TISTRTDate_Hospitlzn != null){
                                var TISTRTDate_Hospitlzn = rID.insuredMemberQuestions.DIMemberQuestions.TISTRTDate_Hospitlzn.split('-');
                                if(TISTRTDate_Hospitlzn.length > 0){
                                rID.TIstartDay = TISTRTDate_Hospitlzn[2];
                                rID.TIstartMonth = TISTRTDate_Hospitlzn[1];
                                rID.TIstartYear = TISTRTDate_Hospitlzn[0];
                                rID.TISTRTDate_Hospitlzn = TISTRTDate_Hospitlzn[2]+"-"+TISTRTDate_Hospitlzn[1]+"-"+TISTRTDate_Hospitlzn[0];
                                }
                            }
                        }
                        
                        if(primaryProduct == 'AC')
                        {
                            if(rID.insuredMemberQuestions.ACMemberQuestions.TISTRTDate_Hospitlzn != null){
                                var TISTRTDate_Hospitlzn = rID.insuredMemberQuestions.ACMemberQuestions.TISTRTDate_Hospitlzn.split('-');
                                if(TISTRTDate_Hospitlzn.length > 0){
                                rID.TIstartDay = TISTRTDate_Hospitlzn[2];
                                rID.TIstartMonth = TISTRTDate_Hospitlzn[1];
                                rID.TIstartYear = TISTRTDate_Hospitlzn[0];
                                rID.TISTRTDate_Hospitlzn = TISTRTDate_Hospitlzn[2]+"-"+TISTRTDate_Hospitlzn[1]+"-"+TISTRTDate_Hospitlzn[0];
                                }
                            }
                        }
                        /* Start date of Hospitalization mapping */

                        /* Expected date of delivery mapping */
                        if(primaryProduct == 'DI')
                        {
                            if(rID.insuredMemberQuestions.DIMemberQuestions.Date_of_delivery != null){
                                var Date_of_delivery = rID.insuredMemberQuestions.DIMemberQuestions.Date_of_delivery.split('-');
                                if(Date_of_delivery.length > 0){
                                rID.PREGNANT_Day = Date_of_delivery[2];
                                rID.PREGNANT_Month = Date_of_delivery[1];
                                rID.PREGNANT_Year = Date_of_delivery[0];
                                rID.Date_of_delivery = Date_of_delivery[2]+"-"+Date_of_delivery[1]+"-"+Date_of_delivery[0];
                                }
                            }
                        }
                        /* Expected date of delivery mapping */

                        // /* Date of Diagnosis rID.insuredMemberQuestions.PLMemberQuestions.Date_of_Diagnosis*/
                        // if(rID.insuredMemberQuestions.PLMemberQuestions.Date_of_Diagnosis != "" && rID.insuredMemberQuestions.PLMemberQuestions.Date_of_Diagnosis != "1900-01-01"){
                        //     diagnosisDate = rID.insuredMemberQuestions.PLMemberQuestions.Date_of_Diagnosis.replace(/\//g, "-").split("-");
                        //     if(diagnosisDate.length > 0){
                        //         rID.diagnosisDay = diagnosisDate[2];
                        //         rID.diagnosisMonth = diagnosisDate[1];
                        //         rID.diagnosisYear = diagnosisDate[0];
                        //         rID.Date_of_Diagnosis = diagnosisDate[2]+"-"+diagnosisDate[1]+"-"+diagnosisDate[0];
                        //     }                            
                        // }
                        // /* End of Date of Diagnosis */

                        // /* Last Consultation date */
                        // if(rID.insuredMemberQuestions.PLMemberQuestions.Last_Consultation_Dat != "" && rID.insuredMemberQuestions.PLMemberQuestions.Last_Consultation_Dat != "1900-01-01"){
                        //     consultationDate = rID.insuredMemberQuestions.PLMemberQuestions.Last_Consultation_Dat.replace(/\//g, "-").split("-");
                        //     if(consultationDate.length > 0){
                        //         rID.consultationDay = consultationDate[2];
                        //         rID.consultationMonth = consultationDate[1];
                        //         rID.consultationYear = consultationDate[0];
                        //         rID.Last_Consultation_Dat = consultationDate[2]+"-"+consultationDate[1]+"-"+consultationDate[0];
                        //     }                            
                        // }
                        // /* End of Last Consultation date */
                        //console.log(rID)
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": "Some error ocurred.",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                },function(err){

                });
        }

    /* End of fetching insured details questions */


    /* To fetch nature of duty */

        aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMaster",{
            "Name":"getNatureOfDuty"
        },false,{
            headers:{
                'Content-Type': 'application/json'
            }
        })
            .then(function(data){
                if(data.ResponseCode == 1){
                    rID.natureDfDuty = data.ResponseData;
                }
            },function(err){
            });

    /* End of fetching nature of duty */


    /* To Fetch Sum Insured Data */

        aS.getData("assets/data/sum-insured.json","",false,{
            headers:{
                'Content-Type': 'application/json'
            }
        })
            .then(function(data){
                if(data.ResponseCode == 1){
                    rID.sumAmounts = data.ResponseData;
                }
            },function(err){

            })

    /* End of fetching sum insured data */


    /* To change insured tab */

        rID.changeInsuredMember = function(index){
            fIDQ = index;
            //activeRelationToProposer =   rID.insuredMembers[index].RelationWithProposer;
            $rootScope.callGtag('click-item', 'insured-details' ,'['+rID.insuredDetailsPageType+']_select-['+rID.insuredMembers[index].RelationType+']');
            fetchInsuredDetails(rID.insuredMembers[index].Gender, rID.insuredMembers[index].RelationType,rID.insuredMembers[index].RelationWithProposer,true);
        }

    /* End of changing insured tab */

    /* go to previous Member */
        rID.goToPreviousMemeber = function(){
            fIDQ = fIDQ - 1;
            if(fIDQ >= 0 ) {
                     $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 80 }, 300);
                    fetchInsuredDetails(rID.insuredMembers[fIDQ].Gender, rID.insuredMembers[fIDQ].RelationType,rID.insuredMembers[fIDQ].RelationWithProposer,true);
            }
            else{
                rID.backfunction();
            }
        }

    /* go to previous Member  ends*/


    /* To change ID type */

        rID.changeIdType = function(idType){
            rID.insuredDetails.MemberDetail.IdNumber = "";
            if(idType == 'Aadhar Enrollment Number'){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "I confirm that in terms of rules under PMLA, I will provide my Aadhar details to the Company within 6 months of start of the insurance policy, failing which no transaction including claims, refund, endorsement etc. shall be allowed on the policy.",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true
                }
            }
        }

    /* End of changing ID type */

     /* verify Date */
        rID.verifyDate = function(dateVal , dateValueKey){
            var dateSplitArray = dateVal.split('/')


            if(new Date(dateSplitArray[1]+"/"+dateSplitArray[0]+"/"+dateSplitArray[2]) > new Date()){
                 rID.insuredMemberQuestions.CKMemberQuestions[dateValueKey] = '';
                $rootScope.alertConfiguration('E',"Enter a valid Date", "Date error");  
            }
            
            if(dateSplitArray[1] == 2 && dateSplitArray[0] > 29 ){
                rID.insuredMemberQuestions.CKMemberQuestions[dateValueKey] = '';
                $rootScope.alertConfiguration('E',"Enter a valid Date", "Date error");       
            }
            else if( dateSplitArray[0] > 31  || dateSplitArray[1] > 12){
                rID.insuredMemberQuestions.CKMemberQuestions[dateValueKey] = '';
                $rootScope.alertConfiguration('E',"Enter a valid Date", "Date error");       
            }
            else if(dateSplitArray[2] != '2020'){
                rID.insuredMemberQuestions.CKMemberQuestions[dateValueKey] = '';
                $rootScope.alertConfiguration('E',"Enter a valid year", "Date error"); 
            }
        }

         rID.verifyDateNew = function(dateVal , dateValueKey ,val){
            var dateSplitArray = dateVal.split('/')
           
            
            
            if(dateSplitArray[1] == 2 && dateSplitArray[0] > 29 ){
                rID[dateValueKey] = '';
                $rootScope.alertConfiguration('E',"Enter a valid Date", "Date error"); 
                return false;      
            }
            else if( dateSplitArray[0] > 31  || dateSplitArray[1] > 12){
                rID[dateValueKey] = '';
                $rootScope.alertConfiguration('E',"Enter a valid Date", "Date error");   
                return false;       
            }
            else if(dateSplitArray[2] != '2020'){
                rID[dateValueKey] = '';
                $rootScope.alertConfiguration('E',"Enter a valid year", "Date error"); 
                return false;   

            }
             if(val == 'start'){
                startDate = new Date(dateSplitArray[1]+"/"+dateSplitArray[0]+"/"+dateSplitArray[2])
             }
             if( val == 'end'){
                endDate = new Date(dateSplitArray[1]+"/"+dateSplitArray[0]+"/"+dateSplitArray[2])
             }
             if( startDate != '' && endDate != ''){
                if(endDate < startDate){
                        rID[dateValueKey] = '';
                         $rootScope.alertConfiguration('E',"End date should be greater than start date", "Date error");
                         return false;   
                    } 
                else if(startDate > new Date()){
                        rID.selfISolationStartDate = '';
                         $rootScope.alertConfiguration('E',"Start Date cannot be future date", "Date error");
                         return false;   
                    }     
                }
        }
    /* verify Date ends */


    /* Change of gender for member. Premium gets recalculated only in case of platinum and cancer secure */

        rID.changeGender = function(code,gender){
            if(rID.PL){
                for(var i =0 ; i < rID.insuredMembers.length ; i++){
                        if(rID.insuredMembers[i].RelationType == rID.insuredMembers[fIDQ].RelationType){
                            rID.insuredMembers[i].Gender = code
                        }
                    }
                    calculatePremiumParams.Platinum = {
                                    'MemberDetails': rID.insuredMembers
                                };

                    calculatePremium(calculatePremiumParams);
                                $rootScope.alertConfiguration('S',"Premium has been recalculated based on the Gender selected", rID.activeMember+"_premium_recalculated_dob_alert");            


            }
            if(rID.CS){
                curActMember.CS.gender = code;   
            }
            if(rID.PL || rID.CS){
                calculatePremium();
            }
        }

    /* End of change of gender of member */


    /* To Calulate Premium */

        function calculatePremium(data){
            delete rID.insuredDetails.PremiumDetail;
            aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetPremium",calculatePremiumParams,false,{
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(function(response){
                    if(response.ResponseCode == 1){
                        rID.insuredDetails.PremiumDetail = response.ResponseData;
                        if(response.ResponseData.ProductPremium[0].Suminsured != null){
                            rID.insuredDetails.MemberDetail.Suminsured = response.ResponseData.ProductPremium[0].Suminsured
                        }
                        rID.insuredDetails.PremiumDetail.TotalPremium = 0;
                        angular.forEach(rID.insuredDetails.PremiumDetail.ProductPremium,function(v,i){
                            rID.insuredDetails.PremiumDetail.TotalPremium = parseInt(rID.insuredDetails.PremiumDetail.TotalPremium) + parseInt(v.Premium);
                            if(parseInt(v.Premium) <= 0 ){
                                        rID.hideSubmitButton = false;
                                    }
                        });
                        if(rID.insuredDetails.PremiumDetail.TotalPremium >= 100000 && !rID.insuredDetails.IsPAN){
                            if(panCardFlag){
                                $('#pan-card-modal').modal({backdrop: 'static', keyboard: false});
                            }
                            panCardFlag = false
                        }
                    }else{
                        $rootScope.alertConfiguration('E',response.ResponseMessage);
                    }
                },function(err){

                });
        }

    /* End of calulating premium */


    /* Pan Card Updation Service */

        rID.getPanCardDetails = function(){
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdatePAN", {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "PAN": rID.pan
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if (data.ResponseCode == 1) {
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


    /* Productwise age validation */    

        function productWiseAgeValidtion(age , param){
            //var errorStatus = new Object();
             var errorStatus = param == null ? {} : new Object() ;
            var allErrors = new String();
            if(rID.PL){
                insuredCurrentMember.PL.Age = age;
                errorStatus.PL = productValidationService.platinumValidations(insuredObj.PL,insuredCurrentMember.PL.RelationType , rID.insuredDetails.MemberDetail.PolicyType);
                if(errorStatus.PL.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Activ Health eligibility Related Errors</h4>";
                    var pLUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.PL.allErrors,function(v,i){
                        if(insuredCurrentMember.PL.RelationType == v.RelationType){
                            pLUL = pLUL + "<li>"+v.message+"</li>";
                        }
                    });
                    pLUL = pLUL + "</ul>";
                    if(pLUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + pLUL;
                    }
                }
            }
            if(rID.FIT){
                insuredCurrentMember.FIT.Age = age;
                errorStatus.FIT = productValidationService.activFitValidations(insuredObj.FIT,insuredCurrentMember.FIT.RelationType , rID.insuredDetails.MemberDetail.PolicyType);
                if(errorStatus.FIT.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Activ Health eligibility Related Errors</h4>";
                    var pLUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.FIT.allErrors,function(v,i){
                        if(insuredCurrentMember.FIT.RelationType == v.RelationType){
                            pLUL = pLUL + "<li>"+v.message+"</li>";
                        }
                    });
                    pLUL = pLUL + "</ul>";
                    if(pLUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + pLUL;
                    }
                }
            }
            if(rID.DI){
                insuredCurrentMember.DI.Age = age;
                errorStatus.DI = productValidationService.diamondValidations(insuredObj.DI,insuredCurrentMember.DI.RelationType);
                if(errorStatus.DI.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Activ Assure eligibility Related Errors</h4>";
                    var dIUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.DI.allErrors,function(v,i){
                        if(insuredCurrentMember.DI.RelationType == v.RelationType){
                                dIUL = dIUL + "<li>"+v.message+"</li>";
                            }
                    });
                    dIUL = dIUL + "</ul>";
                    if(dIUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + dIUL;
                    }
                    
                }
            }
            if(rID.PA){
                insuredCurrentMember.PA.Age = age;
                errorStatus.PA = productValidationService.rFBValidations(insuredObj.PA,5,"PA",insuredCurrentMember.PA.RelationType);
                if(errorStatus.PA.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Personal Accident eligibility Related Errors</h4>";
                    var pAUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.PA.allErrors,function(v,i){
                        if(insuredCurrentMember.PA.RelationType == v.RelationType){    
                                pAUL = pAUL + "<li>"+v.message+"</li>";
                            }
                    });
                    pAUL = pAUL + "</ul>";
                    if(pAUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + pAUL;
                    }
                }
            }
            if(rID.CI){
                insuredCurrentMember.CI.Age = age;
                (projectPlans.CIPlan == 3) ? errorStatus.CI = productValidationService.rFBValidations(insuredObj.CI,18,"CI",insuredCurrentMember.CI.RelationType) : errorStatus.CI = productValidationService.rFBValidations(insuredObj.CI,5,"CI",insuredCurrentMember.CI.RelationType);
                if(errorStatus.CI.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Critical Illness eligibility Related Errors</h4>";
                    var cIUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.CI.allErrors,function(v,i){
                        if(insuredCurrentMember.CI.RelationType == v.RelationType){      
                                cIUL = cIUL + "<li>"+v.message+"</li>";
                            }    
                    });
                    cIUL = cIUL + "</ul>";
                    if(cIUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + cIUL;
                    }
                }
            }
            if(rID.CS){
                insuredCurrentMember.CS.Age = age;
                errorStatus.CS = productValidationService.rFBValidations(insuredObj.CS,18,"CS",insuredCurrentMember.CS.RelationType);
                if(errorStatus.CS.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Cancer Secure eligibility Related Errors</h4>";
                    var cSUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.CS.allErrors,function(v,i){
                        if(insuredCurrentMember.CS.RelationType == v.RelationType){ 
                                    cSUL = cSUL + "<li>"+v.message+"</li>";
                                }    
                    });
                    cSUL = cSUL + "</ul>";
                     if(cSUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + cSUL;
                    }
                }
            }
            if(rID.CK){
                insuredCurrentMember.CK.Age = age;
                errorStatus.CK = productValidationService.cKValidations(insuredObj.CK,18,"CS",insuredCurrentMember.CK.RelationType , rID.insuredDetails.MemberDetail.PolicyType);
                if(errorStatus.CK.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Corona Kavach eligibility Related Errors</h4>";
                    var cSUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.CK.allErrors,function(v,i){
                        if(insuredCurrentMember.CK.RelationType == v.RelationType){ 
                                    cSUL = cSUL + "<li>"+v.message+"</li>";
                                }    
                    });
                    cSUL = cSUL + "</ul>";
                     if(cSUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + cSUL;
                    }
                }
            }
            if(rID.AS){
                insuredCurrentMember.AS.Age = age;
                errorStatus.AS = productValidationService.arogyaSanjeevaniValidations(insuredObj.AS,25,"AS",insuredCurrentMember.AS.RelationType , rID.insuredDetails.MemberDetail.PolicyType);
                if(errorStatus.AS.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Arogya Sanjeevani eligibility Related Errors</h4>";
                    var cSUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.AS.allErrors,function(v,i){
                        if(insuredCurrentMember.AS.RelationType == v.RelationType){ 
                                    cSUL = cSUL + "<li>"+v.message+"</li>";
                                }    
                    });
                    cSUL = cSUL + "</ul>";
                     if(cSUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + cSUL;
                    }
                }
            }
            if(rID.AC && insuredCurrentMember.AC){
             insuredCurrentMember.AC.Age = age;
                errorStatus.AC = productValidationService.activCareValidations(insuredObj.AC,insuredCurrentMember.AC.RelationType);
                if(errorStatus.AC.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Activ Care eligibility Related Errors</h4>";
                    var aCUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.AC.allErrors,function(v,i){
                        if(insuredCurrentMember.AC.RelationType == v.RelationType){ 
                                aCUL = aCUL + "<li>"+v.message+"</li>";
                            }    
                    });
                    aCUL = aCUL + "</ul>";
                     if(aCUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + aCUL;
                    }
                }
            }
            if(allErrors.length > 0){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Errors",
                    "modalBodyText": allErrors,
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function(){
                        rID.day = "";
                        rID.month = "";
                        rID.year = "";
                        rID.DOB = "";
                    }
                }
                return false;
            }else{
                return true;
            }
        }

    /* End of productwise age validation */


    /* Age difference validation */

        function checkAgeDiff(date,param){
            var userDate = new Date(date);
            var currentDate = new Date();
            var dateDiff = currentDate - userDate;
            var userAge = Math.floor((dateDiff/1000) / (60*60*24*365.25));
            var noOfDays = Math.floor((dateDiff/1000) / (60*60*24));    
            if(userAge == -1  && activeRelationToProposer == "KID" &&  (rID.productName == "Activ Assure" || rID.productName == "Activ Health" || rID.productName == "Arogya Sanjeevani") ){
                    $rootScope.alertConfiguration('E',activeRelationToProposer+" age cannot be future date "); 
                        rID.day = "";
                        rID.month = "";
                        rID.year = "";
                        rID.DOB = "";

                return false;
            }
            if(noOfDays <  91 && activeRelationToProposer == "KID"  && (rID.productName == "Activ Assure" || rID.productName == "Activ Health" || rID.productName == "Arogya Sanjeevani")  ){
                    $rootScope.alertConfiguration('E',activeRelationToProposer+" age Should be greater then 90 days "); 
                        rID.day = "";
                        rID.month = "";
                        rID.year = "";
                        rID.DOB = "";

                return false;
            }  
            if(userAge >  65 && rID.stProductAvail) {

                $rootScope.alertConfiguration('E',activeRelationToProposer+" age Should be less than 65 years "); 
                        rID.day = "";
                        rID.month = "";
                        rID.year = "";
                        rID.DOB = "";

                return false;

            }  
            var updatePremium = false;
            if(!productWiseAgeValidtion(userAge , param)){
                return false;
            }
            if(rID.DI && rID.insuredDetails.MemberDetail.RelationWithProposer == "KID" && userAge > 25){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "KIDS above 25 years can buy an Individual Policy.",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function(){
                        rID.day = "";
                        rID.month = "";
                        rID.year = "";
                        rID.DOB = "";
                    }
                }
                return false;
            }
            if(rID.PA || rID.CI || rID.CS){
                if(userAge != rID.insuredDetails.MemberDetail.AGE){
                    updatePremium = true;
                    rID.insuredMembers[fIDQ].AGE = userAge;
                    angular.forEach(rID.insuredDetails.ProductInsuredDetail,function(v,i){
                        for(var i = 0;i<v.InsuredMembers.length;i++){
                            if(v.InsuredMembers[i].RelationType == rID.insuredMembers[fIDQ].RelationType){
                                v.InsuredMembers[i].AGE = userAge;
                            }
                        }
                    });
                }
            }
            if(rID.CK){
                if(userAge != rID.insuredDetails.MemberDetail.Age){
                    updatePremium = true;
                    rID.insuredMembers[fIDQ].AGE = userAge;
                    for(var i =0 ; i < rID.insuredMembers.length ; i++){
                        if(rID.insuredMembers[i].RelationType == rID.insuredMembers[fIDQ].RelationType){
                            rID.insuredMembers[i].Age = userAge
                        }
                    }
                    calculatePremiumParams.CK = {
                                    'MemberDetails': rID.insuredMembers
                                };

                    calculatePremium(calculatePremiumParams);
                                $rootScope.alertConfiguration('S',"Premium has been recalculated based on the date of birth selected", rID.activeMember+"_premium_recalculated_dob_alert");            


                }
            }
            if(rID.AS){
                if(userAge != rID.insuredDetails.MemberDetail.Age){
                    updatePremium = true;
                    rID.insuredMembers[fIDQ].AGE = userAge;
                    for(var i =0 ; i < rID.insuredMembers.length ; i++){
                        if(rID.insuredMembers[i].RelationType == rID.insuredMembers[fIDQ].RelationType){
                            rID.insuredMembers[i].Age = userAge
                        }
                    }
                    calculatePremiumParams.AS = {
                        'MemberDetails': rID.insuredMembers
                    };

                    calculatePremium(calculatePremiumParams);
                    $rootScope.alertConfiguration('S',"Premium has been recalculated based on the date of birth selected", rID.activeMember+"_premium_recalculated_dob_alert");            

                }
            }
            if(rID.PL){
                if(userAge != rID.insuredDetails.MemberDetail.Age){
                    updatePremium = true;
                    rID.insuredMembers[fIDQ].AGE = userAge;
                    for(var i =0 ; i < rID.insuredMembers.length ; i++){
                        if(rID.insuredMembers[i].RelationType == rID.insuredMembers[fIDQ].RelationType){
                            rID.insuredMembers[i].Age = userAge
                        }
                    }
                    calculatePremiumParams.Platinum = {
                                    'MemberDetails': rID.insuredMembers
                                };

                    calculatePremium(calculatePremiumParams);
                                $rootScope.alertConfiguration('S',"Premium has been recalculated based on the date of birth selected", rID.activeMember+"_premium_recalculated_dob_alert");            


                }
            }
            if(rID.FIT){
                    updatePremium = true;
                    rID.insuredMembers[fIDQ].AGE = userAge;
                    for(var i =0 ; i < rID.insuredMembers.length ; i++){
                        if(rID.insuredMembers[i].RelationType == rID.insuredMembers[fIDQ].RelationType){
                            rID.insuredMembers[i].Age = userAge
                        }
                    }
                    calculatePremiumParams.Fit = {
                                    'MemberDetails': rID.insuredMembers
                                };

                    calculatePremium(calculatePremiumParams);
                                $rootScope.alertConfiguration('S',"Premium has been recalculated based on the date of birth selected", rID.activeMember+"_premium_recalculated_dob_alert");            
            }
            if( rID.DI){
                if(userAge != rID.insuredDetails.MemberDetail.Age){
                    updatePremium = true;
                    rID.insuredMembers[fIDQ].AGE = userAge;
                    for(var i =0 ; i < rID.insuredMembers.length ; i++){
                        if(rID.insuredMembers[i].RelationType == rID.insuredMembers[fIDQ].RelationType){
                            rID.insuredMembers[i].Age = userAge
                        }
                    }
                    calculatePremiumParams.Diamond = {
                                    'MemberDetails': rID.insuredMembers
                                };

                    calculatePremium(calculatePremiumParams);
                                $rootScope.alertConfiguration('S',"Premium has been recalculated based on the date of birth selected", rID.activeMember+"_premium_recalculated_dob_alert");            


                }
            }
            if(rID.AC && userAge != "NaN" && !angular.isUndefined(calculatePremiumParams.AC)){
                if(rID.insuredDetails.MemberDetail.PolicyType == 'MI' && ( userAge < 55  || userAge > 80) ){
                        rID.day = "";
                        rID.month = "";
                        rID.year = "";
                        rID.DOB = "";
                    $rootScope.alertConfiguration('E',"Incase of Multi-individual age should be greater than 55 and less than 80 "); 
                    return false;
                }
                angular.forEach(calculatePremiumParams.AC.MemberDetails , function(v, i ){
                    if(v.RelationType == rID.activeMember){
                        v.Age = userAge
                    }
                })
                calculatePremium(calculatePremiumParams);
                $rootScope.alertConfiguration('S',"Premium has been recalculated based on the date of birth selected", rID.activeMember+"_premium_recalculated_dob_alert"); 
            }
            rID.insuredDetails.MemberDetail.AGE = userAge;
            if(updatePremium && (rID.CI || rID.CS || rID.PL || rID.DI || rID.AS)){
                calculatePremium(calculatePremiumParams);
                $rootScope.alertConfiguration('S',"Premium has been recalculated based on the date of birth selected", rID.activeMember+"_premium_recalculated_dob_alert");
            }
            if(userAge > 45 && rID.PL){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "Since age of one of the insured members exceeds 45 years, your proposal will be processed by our underwriting team.",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true
                }
            }
        }

    /* End of age difference validation */


    /* Formation of DOB */

        rID.changeDate = function(day,month,year) {
            rID.DOB = day+"-"+month+"-"+year;
            rID.insuredDetails.MemberDetail.DOB = year+"-"+month+"-"+day;
            $timeout(function(){
                if(rID.insuredForm.dob.$valid && year.length == 4){
                    checkAgeDiff(rID.insuredDetails.MemberDetail.DOB , "");
                }
            },100);
        }

    /* End of formation of DOB */

    /* Formation of Disease date */

    rID.diseaseDate = function(day,month,year, modelName) {
        if(rID.PL)
        {        
            if(modelName == 'TILastConsultation_Date'){
                rID.TILastConsultation_Date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.PLMemberQuestions.TILastConsultation_Date = year+"-"+month+"-"+day;
            }
            if(modelName == 'TIDate_of_Diagnosis'){
                rID.TIDate_of_Diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.PLMemberQuestions.TIDate_of_Diagnosis = year+"-"+month+"-"+day;
            }
            if(modelName == 'TIENDDate_Hopitlzn'){
                rID.TIENDDate_Hopitlzn = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.PLMemberQuestions.TIENDDate_Hopitlzn = year+"-"+month+"-"+day;
            }
            if(modelName == 'TISTRTDate_Hospitlzn'){
                rID.TISTRTDate_Hospitlzn = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.PLMemberQuestions.TISTRTDate_Hospitlzn = year+"-"+month+"-"+day;
            }

            if(modelName == 'DGLastConsultation_Date'){
                rID.DGLastConsultation_Date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.PLMemberQuestions.DGLastConsultation_Date = year+"-"+month+"-"+day;
            }
            if(modelName == 'DGDate_of_Diagnosis'){
                rID.DGDate_of_Diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.PLMemberQuestions.DGDate_of_Diagnosis = year+"-"+month+"-"+day;
            }
        }


        if(rID.DI)
        {
            if(modelName == 'TILastConsultation_Date'){
                rID.TILastConsultation_Date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.TILastConsultation_Date = year+"-"+month+"-"+day;
            }
            if(modelName == 'TIDate_of_Diagnosis'){
                rID.TIDate_of_Diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.TIDate_of_Diagnosis = year+"-"+month+"-"+day;
            }
            if(modelName == 'TIENDDate_Hopitlzn'){
                rID.TIENDDate_Hopitlzn = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.TIENDDate_Hopitlzn = year+"-"+month+"-"+day;
            }
            if(modelName == 'TISTRTDate_Hospitlzn'){
                rID.TISTRTDate_Hospitlzn = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.TISTRTDate_Hospitlzn = year+"-"+month+"-"+day;
            }

            if(modelName == 'DGLastConsultation_Date'){
                rID.DGLastConsultation_Date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.DGLastConsultation_Date = year+"-"+month+"-"+day;
            }
            if(modelName == 'DGDate_of_Diagnosis'){
                rID.DGDate_of_Diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.DGDate_of_Diagnosis = year+"-"+month+"-"+day;
            }

            if(modelName == 'Date_of_delivery'){
                rID.Date_of_delivery = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.Date_of_delivery = year+"-"+month+"-"+day;
            }
            if(modelName == 'PPDate_of_Diagnosis'){
                rID.PPDate_of_Diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.PPDate_of_Diagnosis = year+"-"+month+"-"+day;
            }
            if(modelName == 'PPLastConsultation_Date'){
                rID.PPLastConsultation_Date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.DIMemberQuestions.PPLastConsultation_Date = year+"-"+month+"-"+day;
            }
        }


        if(rID.AC)
        {
            if(modelName == 'TILastConsultation_Date'){
                rID.TILastConsultation_Date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.TILastConsultation_Date = year+"-"+month+"-"+day;
            }
            if(modelName == 'TIDate_of_Diagnosis'){
                rID.TIDate_of_Diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.TIDate_of_Diagnosis = year+"-"+month+"-"+day;
            }
            if(modelName == 'TIENDDate_Hopitlzn'){
                rID.TIENDDate_Hopitlzn = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.TIENDDate_Hopitlzn = year+"-"+month+"-"+day;
            }
            if(modelName == 'TISTRTDate_Hospitlzn'){
                rID.TISTRTDate_Hospitlzn = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.TISTRTDate_Hospitlzn = year+"-"+month+"-"+day;
            }

            if(modelName == 'DGLastConsultation_Date'){
                rID.DGLastConsultation_Date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.DGLastConsultation_Date = year+"-"+month+"-"+day;
            }
            if(modelName == 'DGDate_of_Diagnosis'){
                rID.DGDate_of_Diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.DGDate_of_Diagnosis = year+"-"+month+"-"+day;
            }
            
            if(modelName == 'SDDate_diagnosis'){
                rID.SDDate_diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.SDDate_diagnosis = year+"-"+month+"-"+day;
            }
            if(modelName == 'SDLast_consultation_date'){
                rID.SDLast_consultation_date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.SDLast_consultation_date = year+"-"+month+"-"+day;
            }
            if(modelName == 'BXDate_diagnosis'){
                rID.BXDate_diagnosis = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.BXDate_diagnosis = year+"-"+month+"-"+day;
            }
            if(modelName == 'BXconsultation_date'){
                rID.BXconsultation_date = day+"-"+month+"-"+year;
                rID.insuredMemberQuestions.ACMemberQuestions.BXconsultation_date = year+"-"+month+"-"+day;
            }
        }
        //console.log("rID");
        //console.log(rID);
    }

    /* End of formation of Disease date */


    /* Manage Sum Insured of members */

        function manageSumInsuredOfProduct(productCode,insuredMembers,maxSumInsured,currentProductPlan,currentMember){
            for(var i = 0;i<insuredMembers.length;i++){
                if(insuredMembers[i].EarningNonEarning != "Earning" && (angular.isUndefined(currentMember) || insuredMembers[i].RelationType == currentMember)){
                    if((insuredMembers[i].RelationWithProposer == "SPOUSE" && (insuredMembers[i].Designation != 'Under Graduate' || productCode == "PA")) || insuredMembers[i].RelationWithProposer == "PROPOSER"){                        
                        insuredMembers[i].SumInsured = maxSumInsured;
                    }else if(insuredMembers[i].RelationWithProposer == "FATHER" || insuredMembers[i].RelationWithProposer == "MOTHER" || insuredMembers[i].RelationWithProposer == "FATHER-IN-LAW" || insuredMembers[i].RelationWithProposer == "MOTHER-IN-LAW" || (insuredMembers[i].RelationWithProposer == "SPOUSE" && insuredMembers[i].Designation == 'Under Graduate')){
                        if(productCode == "PA"){
                            insuredMembers[i].SumInsured = maxSumInsured;
                        }else{
                            var parentsSI = angular.copy(parseInt(maxSumInsured/2));
                            if(parentsSI > 1000000){
                               insuredMembers[i].SumInsured = 1000000;
                            }else if(parentsSI < 500000 && (currentProductPlan == 'ci3' || currentProductPlan == 'CS')){
                               insuredMembers[i].SumInsured = 500000;
                            }else if(maxSumInsured == 1500000){
                               insuredMembers[i].SumInsured = 700000;
                            }else if(maxSumInsured == 900000){
                               insuredMembers[i].SumInsured = 400000;
                            }else if(maxSumInsured == 700000){
                               insuredMembers[i].SumInsured = 300000;
                            }else if(maxSumInsured == 500000){
                               insuredMembers[i].SumInsured = 200000;
                            }else if(maxSumInsured == 300000 || maxSumInsured == 200000 || maxSumInsured == 100000){
                               insuredMembers[i].SumInsured = 100000;
                            }else{
                               insuredMembers[i].SumInsured = parentsSI;
                            }
                        }
                    }else if(insuredMembers[i].RelationWithProposer == "KID"){
                        if(productCode == "PA"){
                            if(maxSumInsured < 1500000){
                                insuredMembers[i].SumInsured = maxSumInsured;
                            }else if(maxSumInsured > 1500000){
                                insuredMembers[i].SumInsured = 1500000;
                            }
                        }else if(productCode == "CI"){
                            if(maxSumInsured >= 3000000){
                                insuredMembers[i].SumInsured = 1500000;
                            }else if(maxSumInsured == 2500000 || maxSumInsured == 2000000){
                                insuredMembers[i].SumInsured = 1000000;
                            }else if(maxSumInsured == 1500000){
                                insuredMembers[i].SumInsured = 700000;
                            }else if(maxSumInsured == 1000000){
                                insuredMembers[i].SumInsured = 500000;
                            }else if(maxSumInsured < 1000000 && maxSumInsured > 500000 && currentProductPlan == 'ci3'){
                                insuredMembers[i].SumInsured = 500000;
                            }else if((maxSumInsured == 900000 || maxSumInsured == 800000) && currentProductPlan != 'ci3'){
                                insuredMembers[i].SumInsured = 400000;
                            }else if((maxSumInsured == 700000 || maxSumInsured == 600000) && currentProductPlan != 'ci3'){
                                insuredMembers[i].SumInsured = 300000;
                            }else if((maxSumInsured == 500000 || maxSumInsured == 400000) && currentProductPlan != 'ci3'){
                                insuredMembers[i].SumInsured = 200000;
                            }else if((maxSumInsured == 300000 || maxSumInsured == 200000 || maxSumInsured == 100000) && currentProductPlan != 'ci3'){
                                insuredMembers[i].SumInsured = 100000;
                            }
                        }else if(productCode == "CS"){
                            if(maxSumInsured < 1500000 && maxSumInsured >= 500000){
                                insuredMembers[i].SumInsured = 500000;
                            }else if(maxSumInsured < 3000000 && maxSumInsured > 1500000){
                                insuredMembers[i].SumInsured = 1000000;
                            }else{
                                insuredMembers[i].SumInsured = 1500000;
                            }
                        }
                    }
                }
            };
        };

    /* End of managing sum insured of members */


    /* Function to validate earning members optional covers */

        function earningOptionalCoverValidation(member){
            var maxTtd;
            var maxLp;
            var alertError = "<ul>";
            if(rID.insuredDetails.MemberDetail.TTD == 'Y'){
                for(var i = 0; i<ttd_covers.length;i++){
                    if(ttd_covers[i] < (rID.insuredDetails.MemberDetail.AnnualIncome * 2 /100)){
                        maxTtd = ttd_covers[i];
                    }else{
                        break;
                    }
                }
                if(rID.insuredDetails.MemberDetail.TTD_Suminsured > maxTtd){
                    alertError = alertError+"<li>Weekly benefit for Temporary & Total Disablement of "+member.RelationWithProposer+" changed to "+maxTtd+" as per annual income you entered.</li>";
                }
            }
            if(rID.insuredDetails.MemberDetail.LP == 'Y'){
                for(var i = 0; i<loan_protect_covers.length;i++){
                    if(loan_protect_covers[i] < ((rID.insuredDetails.MemberDetail.suminsured+loan_protect_covers[i])*15)){
                        maxLp = loan_protect_covers[i];
                    }else{
                        break;
                    }
                }
                if(rID.insuredDetails.MemberDetail.LP_Suminsured > maxLp){
                    alertError = alertError+"<li>Weekly benefit for Loan Protect of "+member.RelationWithProposer+" changed to "+maxLp+" as per annual income you entered.</li>";
                }
            }
            alertError = alertError+"</ul>";
            if(alertError != "<ul></ul>"){
                $rootScope.alertConfiguration('E',alertError);
                member.TTD_Suminsured = maxTtd;
                rID.insuredDetails.MemberDetail.TTD_Suminsured = maxTtd;
                member.LP_Suminsured = maxLp;
                rID.insuredDetails.MemberDetail.TTD_Suminsured = maxLp;
            }
        }

    /* End of function to validate earning member related optional covers */
    var xyz = false;
    /* validate PA optional covers */
         function validatePAOptionalCover(memberDetails ,  productInsDetails){
            var actMember ;
            var actMemberAnnualInc 
                angular.forEach(productInsDetails , function(v , i ){
                    if(v.ProductCode == "PA"){
                        for(var i = 0 ; i < v.InsuredMembers.length ; i ++ ){
                            if(v.InsuredMembers[i].RelationType == memberDetails.RelationType){
                                actMember = memberDetails.RelationType
                                actMemberAnnualInc = v.InsuredMembers[i].AnnualIncome;
                            }
                        }
                    }
                })
                if( parseInt(memberDetails.AnnualIncome) < parseInt(actMemberAnnualInc) && memberDetails.RelationType == "S" && memberDetails.AnnualIncome < 50000){
                    deleteOptionalCover = true;
                }
                else if( memberDetails.AnnualIncome < actMemberAnnualInc  && memberDetails.RelationType != "S"  && rID.insuredDetails.MemberDetail.TTD == "Y"){
                    $rootScope.alertData = {
                                            "modalClass": "regular-alert",
                                            "modalHeader": "Success",
                                            "modalBodyText": "As per the entered annual income you optional cover TTD will be removed ",
                                            "showCancelBtn": true,
                                            "modalSuccessText" : "Yes",
                                            "showAlertModal": true,
                                            "modalCancelText": "No",
                                            "positiveFunction" : function(){
                                                rID.insuredDetails.MemberDetail.TTD = "N",
                                                rID.insuredDetails.MemberDetail.TTD_Suminsured =  ""
                                            }
                                           }
                                           return true; 
                }

         }
    /* validate PA optional covers Ends */




    /* To change Annual Income */ 

        rID.calculateAnnualIncome = function(annualIncome){
            var chkAnnualIncome = 24999;
            if(rID.PA && projectPlans.PAPlan == 5){
                chkAnnualIncome = 84000;
            }else if(rID.CS || (rID.PA && projectPlans.PAPlan == 4) || (rID.CI && projectPlans.CIPlan == 3)){
                chkAnnualIncome = 42000;
            }
            if(rID.productName == "Activ Secure Personal Accident"){
                if(validatePAOptionalCover(rID.insuredDetails.MemberDetail , rID.insuredDetails.ProductInsuredDetail)){
                return false
                }
            }
            
            var isPrimaryProductPresent = false;
            if(annualIncome > chkAnnualIncome){
                rID.insuredDetails.MemberDetail.EarningNonEarning = "Earning";
                var selectedRFBProducts = (rID.insuredDetails.ProductInsuredDetail != null) ? rID.insuredDetails.ProductInsuredDetail.length : 0;                
                var errorAlert = "<ul>";
                angular.forEach(rID.insuredDetails.ProductInsuredDetail,function(v,i){
                    selectedRFBProducts = selectedRFBProducts - 1;
                    for(var i = 0;i<v.InsuredMembers.length;i++){
                        if(v.InsuredMembers[i].RelationType == currentActiveMember.RelationType || (v.InsuredMembers[i].RelationType == 'PROPOSER' && angular.isUndefined(curActMember[v.ProductCode]) && currentActiveMember.RelationType == 'S')){
                            v.InsuredMembers[i].EarningNonEarning = "Earning";
                            v.InsuredMembers[i].AnnualIncome = annualIncome;
                            var currentPlan;
                            if(v.ProductCode != "CS"){
                                currentPlan = v.ProductCode.toLowerCase()+v.Plan;
                            }else{
                                currentPlan = "CS";
                            } 
                            var isProceed = true;
                            var maxInsured;
                            angular.forEach(rID.sumAmounts,function(val,ind){
                                if(isProceed && val[currentPlan]){
                                    if(val.amount > (annualIncome*12)){
                                        isProceed = false;
                                    }else{
                                        maxInsured = ind;
                                    }
                                }
                            });
                            if(v.InsuredMembers[i].SumInsured > (annualIncome*12)){
                                v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(rID.sumAmounts[maxInsured].amount)+") for "+$filter('productFilter')(v.ProductCode)+".</li>";
                                if(v.InsuredMembers[i].RelationType == "S"){
                                    manageSumInsuredOfProduct(v.ProductCode,v.InsuredMembers,rID.sumAmounts[maxInsured].amount,currentPlan);
                                    if(v.ProductCode == "PA"){
                                        earningOptionalCoverValidation(v.InsuredMembers[i]);
                                    }
                                }else{
                                    calculatePremium();
                                }
                            }else{
                                if(primaryProduct == v.ProductCode){
                                    isPrimaryProductPresent = true;
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "Success",
                                        "modalBodyText": "Basis your declared income, you can raise your Sum Insured to ₹​ "+$filter('INR')(rID.sumAmounts[maxInsured].amount)+" for "+$filter('productFilter')(v.ProductCode)+", do you wish to set your Sum Insured to ₹​"+$filter('INR')(rID.sumAmounts[maxInsured].amount)+"?",
                                        "showCancelBtn": true,
                                        "modalSuccessText" : "Yes",
                                        "showAlertModal": true,
                                        "modalCancelText": "No",
                                        "positiveFunction": function(){
                                            v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                            // rID.insuredDetails.MemberDetail.Suminsured = rID.sumAmounts[maxInsured].amount;
                                            if(v.ProductCode == "PA"){
                                                earningOptionalCoverValidation(v.InsuredMembers[i]);
                                            }
                                            if(rID.insuredDetails.ProductInsuredDetail.length > 1){
                                                errorAlert = errorAlert + "</ul>";
                                                calculatePremium();
                                                if(errorAlert != "<ul></ul>"){
                                                    $timeout(function(){
                                                        $rootScope.alertData = {
                                                            "modalClass": "regular-alert",
                                                            "modalHeader": "Alert",
                                                            "modalBodyText": errorAlert,
                                                            "showCancelBtn": false,
                                                            "modalSuccessText" : "Ok",
                                                            "showAlertModal": true
                                                        }
                                                    },400);
                                                }
                                            }else{
                                                calculatePremium();
                                            }
                                        },
                                        "negativeFunction": function(){
                                            if(v.ProductCode == "PA"){
                                                earningOptionalCoverValidation(v.InsuredMembers[i]);
                                                calculatePremium();
                                            }
                                        }
                                    }
                                }else{
                                    if(v.InsuredMembers[i].RelationType == "F" || v.InsuredMembers[i].RelationType == "M" || v.InsuredMembers[i].RelationType == "FIL" || v.InsuredMembers[i].RelationType == "MIL"){
                                        if(v.ProductCode == "CI" || v.ProductCode == "CS"){
                                            if(rID.sumAmounts[maxInsured].amount >= 1000000){
                                                v.InsuredMembers[i].SumInsured = 1000000;
                                                errorAlert = errorAlert + "<li>Maximum Sum Insured for "+$filter('productFilter')(v.ProductCode)+" product based on entered annual income is 10,00,000.</li>";
                                            }else{
                                                 v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(rID.sumAmounts[maxInsured].amount)+") for "+$filter('productFilter')(v.ProductCode)+".</li>";
                                            }
                                        }else{
                                            if(rID.sumAmounts[maxInsured].amount >= 3000000){
                                                v.InsuredMembers[i].SumInsured = 1500000;
                                                errorAlert = errorAlert + "<li>Maximum Sum Insured for "+$filter('productFilter')(v.ProductCode)+" product based on entered annual income is 15,00,000.</li>";
                                            }else{
                                                 v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(rID.sumAmounts[maxInsured].amount)+") for "+$filter('productFilter')(v.ProductCode)+".</li>";
                                            }
                                        }
                                    }else if(v.InsuredMembers[i].RelationWithProposer == "KID"){
                                        if(v.ProductCode == "CI" || v.ProductCode == "CS"){
                                            if(rID.sumAmounts[maxInsured].amount >= 1000000){
                                                v.InsuredMembers[i].SumInsured = 1000000;
                                                errorAlert = errorAlert + "<li>Maximum Sum Insured for "+$filter('productFilter')(v.ProductCode)+" product based on entered annual income is 10,00,000.</li>";
                                            }else{
                                                v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(rID.sumAmounts[maxInsured].amount)+") for "+$filter('productFilter')(v.ProductCode)+".</li>";
                                            }
                                        }else{
                                            if(rID.sumAmounts[maxInsured].amount >= 1500000){
                                                v.InsuredMembers[i].SumInsured = 1000000;
                                                errorAlert = errorAlert + "<li>Maximum Sum Insured for "+$filter('productFilter')(v.ProductCode)+" product based on entered annual income is 15,00,000.</li>";
                                            }else{
                                                v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(rID.sumAmounts[maxInsured].amount)+") for "+$filter('productFilter')(v.ProductCode)+".</li>";
                                            }
                                        }
                                        
                                    }else{
                                        if(v.ProductCode == "CI" || v.ProductCode == "CS"){
                                            if(rID.sumAmounts[maxInsured].amount >= 2500000){
                                                v.InsuredMembers[i].SumInsured = 2500000;
                                                errorAlert = errorAlert + "<li>Maximum Sum Insured for "+$filter('productFilter')(v.ProductCode)+" product based on entered annual income is 25,00,000.</li>";
                                            }else{
                                                v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(rID.sumAmounts[maxInsured].amount)+") for "+$filter('productFilter')(v.ProductCode)+".</li>";
                                            }
                                        }else{
                                            if(rID.sumAmounts[maxInsured].amount >= 3000000){
                                                v.InsuredMembers[i].SumInsured = 1500000;
                                                errorAlert = errorAlert + "<li>Maximum Sum Insured for "+$filter('productFilter')(v.ProductCode)+" product based on entered annual income is 15,00,000.</li>";
                                            }else{
                                                v.InsuredMembers[i].SumInsured = rID.sumAmounts[maxInsured].amount;
                                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(rID.sumAmounts[maxInsured].amount)+") for "+$filter('productFilter')(v.ProductCode)+".</li>";
                                            }
                                        }
                                    }
                                    if(v.InsuredMembers[i].RelationType == "S"){
                                        manageSumInsuredOfProduct(v.ProductCode,v.InsuredMembers,v.InsuredMembers[i].SumInsured,currentPlan);
                                    }
                                }
                            }
                            break;
                        }
                    }
                });
                if(selectedRFBProducts == 0 && !isPrimaryProductPresent){
                    errorAlert = errorAlert + "</ul>";
                    calculatePremium();
                    if(errorAlert != "<ul></ul>"){
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": errorAlert,
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                }
            }else{
                var errorAlert = "<div><p class='modal-bind-text'>You are not eligible for this product based on declared income.</p></div>";
                errorAlert = errorAlert + "<ul>";
                if(rID.PA && projectPlans.PAPlan == 5){
                    errorAlert = errorAlert+"<li>Minimum Annual Income required for Personal Accident Plan 5 is 84,000.</li>";
                }else if(rID.PA && projectPlans.PAPlan == 4){
                    errorAlert = errorAlert+"<li>Minimum Annual Income required for Personal Accident Plan 4 is 42,000.</li>";
                }else if(rID.PA){
                    errorAlert = errorAlert+"<li>Minimum Annual Income required for Personal Accident Plan 1/2/3 is 25,000.</li>";
                }
                if(rID.CI && projectPlans.CIPlan == 3){
                    errorAlert = errorAlert+"<li>Minimum Annual Income required for Critical Illness Plan 3 is 42,000.</li>";
                }else if(rID.CI){
                    errorAlert = errorAlert+"<li>Minimum Annual Income required for  Critical Illness Plan 1/2 is 25,000.</li>";
                }
                if(rID.CS){
                    errorAlert = errorAlert+"<li>Minimum Annual Income required for Cancer Secure is 42,000.</li>";
                }
                errorAlert = errorAlert + "</ul>";
                errorAlert = errorAlert + "<div><p class='modal-bind-text'>Do you want to change Annual Income ?</p></div>";
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Warning",
                    "modalBodyText": errorAlert,
                    "showCancelBtn": true,
                    "modalSuccessText" : "Yes",
                    "modalCancelText" : "No",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function(){
                        rID.insuredDetails.MemberDetail.AnnualIncome = "";
                    },
                    "negativeFunction": function(){
                        rID.insuredDetails.MemberDetail.AnnualIncome = "";
                        $location.url(rID.quotePage);
                    }
                }
            }
        }

    /* End of changing annual income */


    /* To select pre-existing-dieases */

        rID.preExiDis = function(setValue){
            sessionStorage.setItem('preExeDis',setValue);
            $rootScope.preExeDisease = setValue;
        }

    /* End of selecting pre-existing dieases */


    /* Nature of duty functionality */

        /* To Open Nature of Duty Dropdown */

            rID.openDropdown = function(){
                $('.nature-of-duty').addClass('open');
            }

        /* End of opening nayure of duty dropdown */
        
        $(document).click(function(event) { 
            if(!$(event.target).closest('.dropdown ').length) {
                if($('.nature-of-duty').hasClass('open')) {
                    $('.nature-of-duty').removeClass('open');
                }
            } 
        });

        /* Nature of duty search function */

            rID.textSearch = function(){
                rID.nODCopy = angular.copy(rID.nOD);
            }

        /* End of nature of duty search function */


        /* Nature of duty selection event */

            rID.selectNOD = function(natureDfDuty){
                rID.insuredDetails.MemberDetail.NatureOfDuty = natureDfDuty.Nature_Of_Duty;
                rID.nOD = natureDfDuty.Nature_Of_Duty;
                rID.nODCopy = "";
                $('.nature-of-duty').removeClass('open');
                Risk_class = natureDfDuty.Risk_class;
                if(rID.PL && natureDfDuty.Risk_class != 4){
                    for(var i = 0; i < rID.quoteDetailOfProduct.MemberDetails.length ; i++){
                       if( rID.quoteDetailOfProduct.MemberDetails[i].RelationType == rID.activeMember && !rID.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID')){
                             rID.quoteDetailOfProduct.MemberDetails[i].PACoverRiskClass = natureDfDuty.Risk_class ;
                       }
                    }
                     UpdateQuoteDetails();
                }
                if(natureDfDuty.Risk_class == 4){
                     if(rID.PL){
                        
                            for(var i = 0; i < rID.quoteDetailOfProduct.MemberDetails.length ; i++){

                                if(rID.quoteDetailOfProduct.PlanName != 'Platinum - Premiere'){
                                    if(rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && rID.quoteDetailOfProduct.MemberDetails[i].RelationType == rID.activeMember && !rID.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
                                        
                                            $rootScope.alertData = {
                                                    "modalClass": "regular-alert",
                                                    "modalHeader": "Alert",
                                                    "modalBodyText": "Based on your profession selection, PA is not available for this member",
                                                    "showCancelBtn": false,
                                                    "gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                                                    "gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
                                                    "gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                                                    "modalSuccessText": "Ok",
                                                    "showAlertModal": true,
                                                    "positiveFunction": function(){
                                                        rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag = 'N';
                                                        UpdateQuoteDetails();
                                                    }

                                                }
                                                $rootScope.$apply();
                                                return false;
                                    }
                                    else if(rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && rID.quoteDetailOfProduct.MemberDetails[i].RelationType == rID.activeMember && rID.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
                                            rID.quoteDetailOfProduct.MemberDetails[i].PACoverSI = '500000';
                                    }

                                }
                                else if(rID.quoteDetailOfProduct.PlanName == 'Platinum - Premiere'){
                                    if(rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && rID.quoteDetailOfProduct.MemberDetails[i].RelationType == rID.activeMember && !rID.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
                                        $rootScope.alertData = {
                                                    "modalClass": "regular-alert",
                                                    "modalHeader": "Alert",
                                                    "modalBodyText": "Based on your profession selection, PA is not available for this member",
                                                    "showCancelBtn": false,
                                                    "gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                                                    "gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
                                                    "gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                                                    "modalSuccessText": "Ok",
                                                    "showAlertModal": true,
                                                    "positiveFunction": function(){
                                                        rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag = 'N';
                                                        UpdateQuoteDetails();
                                                    }

                                                }
                                                $rootScope.$apply();
                                                return false;
                                    }
                                    
                                }
                            }
                        
                        
                            
                        
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": "You are not elligible to buy policy as selected Nature of Duty is of Risk Type 4.",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true,
                            "positiveFunction": function(){
                                rID.nOD = ""
                            }
                        }   
                    }
                }else if(natureDfDuty.Risk_class == 3 && rID.PA && rID.insuredDetails.MemberDetail.TTD == 'Y'){
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Warning",
                        "modalBodyText": "Temporary & Total Disablement Optional Cover won't be applicable for your selected nature of duty. Are you sure you want to continue?",
                        "showCancelBtn": true,
                        "modalSuccessText": "Yes",
                        "modalCancelText": "No",
                        "showAlertModal": true,
                        "positiveFunction": function(){
                            curActMember.PA.TTD = "N";
                            curActMember.PA.TTD_Suminsured = 0;
                            rID.insuredDetails.MemberDetail.TTD_Suminsured = 0;
                            rID.insuredDetails.MemberDetail.TTD = "N";
                            curActMember.PA.risk = natureDfDuty.Risk_class;
                            curActMember.PA.RiskType = natureDfDuty.Risk_class;
                            calculatePremium();
                            $rootScope.alertConfiguration('S',"Premium recalculated based on selected Nature of Duty." , "premium_recalculated_nature-of-duty_alert");
                        },
                        "negativeFunction": function(){
                            rID.insuredDetails.MemberDetail.NatureOfDuty = "";
                            rID.nOD = "";
                            rID.nODCopy = "";
                            curActMember.PA.risk = "";
                            curActMember.PA.RiskType = "";
                            calculatePremium();
                            $rootScope.alertConfiguration('S',"Premium recalculated based on selected Nature of Duty.",'premium_recalculated_nature-of-duty_alert');
                        }
                    }
                }
                if(!(natureDfDuty.Risk_class == 3 && rID.insuredDetails.MemberDetail.TTD == 'Y') && natureDfDuty.Risk_class != 4 && rID.PA){
                    curActMember.PA.risk = natureDfDuty.Risk_class;
                    curActMember.PA.RiskType = natureDfDuty.Risk_class;
                    calculatePremium();
                    $rootScope.alertConfiguration('S',"Premium recalculated based on selected Nature of Duty." , "premium_recalculated_nature-of-duty_alert");
                }
            }

        /* End of nature od duty selection event */


        /* Reset NOD search */

            rID.resetNodSearch = function(){
                $timeout(function(){
                    rID.nOD = angular.copy(rID.insuredDetails.MemberDetail.NatureOfDuty);
                    rID.nODCopy = "";
                },2000);
            }

        /* End of resetting NOD search */

    /* End of nature of duty functionality */


    /* Non Earning occupation select */

        rID.nonEarningOccupation = function(occupation,gender){
            if(gender == 1 && occupation == 'Housewife'){
                occupation = 'Househusband';
            }
            if(rID.insuredDetails.MemberDetail.RelationType != 'SPO'){
                rID.insuredDetails.MemberDetail.Designation = "NA";
            }
            if( (occupation == 'Housewife' || occupation == 'Retired' || occupation == 'Unemployed' || occupation == 'STUDENT') && rID.PL && rID.quoteDetailOfProduct.PlanName == 'Platinum - Premiere' ){
                $rootScope.alertData = {
                                                    "modalClass": "regular-alert",
                                                    "modalHeader": "Note",
                                                    "modalBodyText": "If you are not an earning member maximum eligibility for Personal Accident sum insured will be 30 Lakh for adult members and 10 Lakh for kids ",
                                                    "showCancelBtn": false,
                                                    "hideCloseBtn":true,
                                                    "gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                                                    "gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
                                                    "gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
                                                    "modalSuccessText": "Ok",
                                                    "showAlertModal": true,
                                                    "positiveFunction": function(){
                                                        for(var i = 0; i < rID.quoteDetailOfProduct.MemberDetails.length ; i++){
                                                                if(rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && rID.quoteDetailOfProduct.MemberDetails[i].RelationType == rID.activeMember && !rID.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
                                                                    rID.quoteDetailOfProduct.MemberDetails[i].PACoverSI = '3000000';
                                                                }
                                                                else if(rID.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && rID.quoteDetailOfProduct.MemberDetails[i].RelationType == rID.activeMember && rID.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
                                                                        rID.quoteDetailOfProduct.MemberDetails[i].PACoverSI = '1000000';
                                                                }
                                                            }
                                                        UpdateQuoteDetails();
                                                    }

                                                }
                                                $rootScope.$apply();
                                                return false;
                
            }
            rID.insuredDetails.MemberDetail.NatureOfDuty = occupation;
        }

    /* End of non earning occupation select */


    /* Function to show non-earning sum insured alert */

        function nonEarningSumInsuredAlert(memberDetail){
            var errorAlert = "<ul>";
            if(rID.PA){
                errorAlert = errorAlert + "<li>As "+memberDetail.RelationWithProposer+" is not earning, its Sum Insured is set to "+$filter('INR')(curActMember.PA.SumInsured)+" for "+$filter('productFilter')("PA")+".</li>";
            }
            if(rID.CI){
                errorAlert = errorAlert + "<li>As "+memberDetail.RelationWithProposer+" is not earning, its Sum Insured is set to "+$filter('INR')(curActMember.CI.SumInsured)+" for "+$filter('productFilter')("CI")+".</li>";
            }
            if(rID.CS){
                errorAlert = errorAlert + "<li>As "+memberDetail.RelationWithProposer+" is not earning, its Sum Insured is set to "+$filter('INR')(curActMember.CS.SumInsured)+" for "+$filter('productFilter')("CS")+".</li>";
            }
            $timeout(function(){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Warning",
                    "modalBodyText": errorAlert,
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true
                }
            },500);
        }

    /* End of function to show non-earning sum insured alert */


    /* Change Earning Status click event */

        rID.changeEarningStatus = function(memberDetail,earningStatus){
            if(memberDetail.RelationWithProposer == "SELF" && earningStatus == "Non Earning"){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Warning",
                    "modalBodyText": "Self must be earning.",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                    "positiveFunction": function(){
                        memberDetail.EarningNonEarning = "Earning";
                    }
                }
            }else{
                if(rID.PA){
                    curActMember.PA.EarningNonEarning = earningStatus;
                    curActMember.PA.AnnualIncome = "0";
                }
                if(rID.CI){
                    curActMember.CI.EarningNonEarning = earningStatus;
                    curActMember.CI.AnnualIncome = "0";
                }
                if(rID.CS){
                    curActMember.CS.EarningNonEarning = earningStatus;
                    curActMember.CS.AnnualIncome = "0";
                }
                memberDetail.EarningNonEarning = earningStatus;
                if(earningStatus == "Earning"){
                    return false;
                }
                angular.forEach(rID.insuredDetails.ProductInsuredDetail,function(v,i){
                    for(var i = 0;i<v.InsuredMembers.length;i++){
                        if(v.InsuredMembers[i].RelationType == "S"){
                            var currentPlan;
                            if(v.ProductCode != "CS"){
                                currentPlan = v.ProductCode.toLowerCase()+v.Plan;
                            }else{
                                currentPlan = "CS";
                            }
                            var maxSumAmount;
                            (v.InsuredMembers[i].SumInsured > 3000000) ? maxSumAmount = 3000000 : maxSumAmount = v.InsuredMembers[i].SumInsured;
                            manageSumInsuredOfProduct(v.ProductCode,v.InsuredMembers,maxSumAmount,currentPlan,memberDetail.RelationType);
                            break;
                        }
                    }
                });
                if(rID.PA && earningStatus == "Non Earning" && (memberDetail.TTD == "Y" || memberDetail.LoanProtect == "Y" || memberDetail.EMIProtect == "Y")){
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Warning",
                        "modalBodyText": "If you select earning status as non earning for "+memberDetail.RelationWithProposer+" then TTD, Loan Protect and EMI Protect benefit will be removed. Do you want to continue?",
                        "showCancelBtn": true,
                        "modalSuccessText" : "Yes",
                        "modalCancelText" : "No",
                        "showAlertModal": true,
                        "positiveFunction": function(){
                            curActMember.PA.LP = "N";
                            curActMember.PA.LP_Suminsured = "0";
                            curActMember.PA.EMIP = "N";
                            curActMember.PA.EMIP_Suminsured = "0";
                            curActMember.PA.TTD = "N";
                            curActMember.PA.TTD_Suminsured = "N";
                            memberDetail.TTD = "N";
                            memberDetail.TTD_Suminsured = 0;
                            memberDetail.EMIProtect = "N";
                            memberDetail.LoanProtect = "N";
                            memberDetail.EMIAmount = "0";
                            memberDetail.EMIProtectAccountNumber = "";
                            memberDetail.LoanProtectAccountNumber = "";
                            memberDetail.AnnualIncome = 0;
                            memberDetail.Occupation = "";
                            memberDetail.Designation = "";
                            memberDetail.NatureOfDuty = "";
                            rID.nOD = angular.copy(memberDetail.NatureOfDuty);
                            rID.nODCopy = "";
                            memberDetail.EarningNonEarning = earningStatus;
                            calculatePremium();
                            nonEarningSumInsuredAlert(memberDetail);
                        }
                    }
                }else{
                    memberDetail.AnnualIncome = 0;
                    memberDetail.Occupation = "";
                    memberDetail.Designation = "";
                    memberDetail.NatureOfDuty = "";
                    rID.nOD = angular.copy(rID.insuredDetails.MemberDetail.NatureOfDuty);
                    rID.nODCopy = "";
                    memberDetail.EarningNonEarning = earningStatus;
                    calculatePremium();
                    nonEarningSumInsuredAlert(memberDetail);
                }
            }
        }

    /* End of change earning stus click event */


    /* To manage graduate related sum insured */

        function handleGraduateRelatedSumInsured(selfSumInsured,productCode,plan,status){
            var sI = parseInt(selfSumInsured/2);
            var isProceed = true;
            var maxInsured;
            var cPlan;
            (productCode == "CI")? cPlan = productCode.toLowerCase()+plan : cPlan = "CS";
            angular.forEach(rID.sumAmounts,function(v,i){
                if(isProceed && v[cPlan]){
                    if(v.amount > sI){
                        isProceed = false;
                    }else{
                        maxInsured = i;
                    }
                }
            });
            if(status == "Under Graduate"){
                if(angular.isUndefined(maxInsured) && (productCode == "CS" || cPlan == "ci3")){
                    sI = 500000;
                }else if(angular.isUndefined(maxInsured) && productCode == "CI"){
                    sI = 100000;
                }else{
                    (rID.sumAmounts[maxInsured].amount > 3000000) ? sI = 3000000 : sI = rID.sumAmounts[maxInsured].amount;
                }
                (productCode == "CI") ? curActMember.CI.SumInsured = sI : curActMember.CS.SumInsured = sI;
                showSumInsured = showSumInsured + "<li>Maximum sum insured for "+status+" in case of "+$filter('productFilter')(productCode)+" is "+$filter('INR')(sI)+".</li>";
            }else{
                (selfSumInsured >= 3000000) ? sI = 3000000 : sI = selfSumInsured;
                (productCode == "CI") ? curActMember.CI.SumInsured = sI : curActMember.CS.SumInsured = sI;
                showSumInsured = showSumInsured + "<li>Maximum sum insured for "+status+" in case of "+$filter('productFilter')(productCode)+" is "+$filter('INR')(sI)+".</li>";
            }
            totalProductsToCheck = totalProductsToCheck - 1;
            if(totalProductsToCheck == 0){
                showSumInsured = showSumInsured + "</ul>";
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Success",
                    "modalBodyText": showSumInsured,
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function(){
                        calculatePremium(calculatePremiumParams);
                    }
                }
            }
        }

    /* End of manging graduate related sum insured */


    /* Change gratuation select click event */

        var showSumInsured;
        var totalProductsToCheck = 0;
        rID.changeGraduationStatus = function(status){
            var isSelfThere = false;
            totalProductsToCheck = 0;
            if(rID.CI){
                totalProductsToCheck = totalProductsToCheck + 1;
            }
            if(rID.CS){
                totalProductsToCheck = totalProductsToCheck + 1;
            }
            showSumInsured = "<ul>";
            if(rID.CI){
                 handleGraduateRelatedSumInsured(selfObj.CI.SumInsured,'CI',projectPlans.CIPlan,status);
            }
            if(rID.CS){
                handleGraduateRelatedSumInsured(selfObj.CS.SumInsured,'CS',projectPlans.CSPlan,status);
            }
        }

    /* End of gratuaion select click event */


     /* To validate smoke questions */

        function validateSmokeQuestion(questionObj){
            var returnVal = "<ul>";
            var isAnyCondition = 0;
            if(rID.insuredMemberQuestions[questionObj].AlcoholQuantity == "" || rID.insuredMemberQuestions[questionObj].AlcoholQuantity == null || rID.insuredMemberQuestions[questionObj].AlcoholQuantity == 0){
                returnVal = returnVal + "<li>Please fill valid Alcohol Quantity.</li>";
                ++isAnyCondition;
            }
            if(rID.insuredMemberQuestions[questionObj].SmokeQuantity == "" || rID.insuredMemberQuestions[questionObj].SmokeQuantity == null || rID.insuredMemberQuestions[questionObj].SmokeQuantity == 0){
                ++isAnyCondition;
                returnVal = returnVal + "<li>Please fill valid Smoke Quantity.</li>";
            }
            if(rID.insuredMemberQuestions[questionObj].GuthkaQuantity == "" || rID.insuredMemberQuestions[questionObj].GuthkaQuantity == null || rID.insuredMemberQuestions[questionObj].GuthkaQuantity == 0){
                ++isAnyCondition;
                returnVal = returnVal + "<li>Please fill valid Guthka Quantity.</li>";
            }
            if(rID.insuredMemberQuestions[questionObj].OtherName == "" || rID.insuredMemberQuestions[questionObj].OtherName == null && rID.insuredMemberQuestions[questionObj].OtherQuantity != 0){
                returnVal = returnVal + "<li>Please fill valid Other Name.</li>";
                ++isAnyCondition;
            }else{
                if(rID.insuredMemberQuestions[questionObj].OtherQuantity == "" || rID.insuredMemberQuestions[questionObj].OtherQuantity == null || rID.insuredMemberQuestions[questionObj].OtherQuantity == 0){
                    ++isAnyCondition;
                     returnVal = returnVal + "<li>Please fill valid Other Quantity.</li>";
                }
            }
            if(rID.insuredMemberQuestions[questionObj].OtherQuantity != 0 && (rID.insuredMemberQuestions[questionObj].OtherName == "" || rID.insuredMemberQuestions[questionObj].OtherName == null)){
               returnVal = returnVal + "<li>Please fill valid Other Name.</li>";
               return returnVal
            }
            if(isAnyCondition == 4){
                return returnVal;
            }else{
                return "<ul>";
            }
        }

        function validateSmokeQuestionActCare(questionObj){
            var returnVal = "<ul>";
            var isAnyCondition = 0;
            if( (rID.insuredMemberQuestions[questionObj].AlcoholQuantity == "" || rID.insuredMemberQuestions[questionObj].AlcoholQuantity == null || rID.insuredMemberQuestions[questionObj].AlcoholQuantity == 0) && (rID.insuredMemberQuestions[questionObj].SmokeQuantity == "" || rID.insuredMemberQuestions[questionObj].SmokeQuantity == null || rID.insuredMemberQuestions[questionObj].SmokeQuantity == 0) && (rID.insuredMemberQuestions[questionObj].GuthkaQuantity == "" || rID.insuredMemberQuestions[questionObj].GuthkaQuantity == null || rID.insuredMemberQuestions[questionObj].GuthkaQuantity == 0) && (rID.insuredMemberQuestions[questionObj].OtherName == "" || rID.insuredMemberQuestions[questionObj].OtherName == null) && ((rID.insuredMemberQuestions[questionObj].OtherQuantity == "" || rID.insuredMemberQuestions[questionObj].OtherQuantity == null || rID.insuredMemberQuestions[questionObj].OtherQuantity == 0)) ){
                $rootScope.alertConfiguration('E',"Please fill proposer Smoke/Alcohol or tabaco ");
                return false;
            }
            if((rID.insuredMemberQuestions[questionObj].OtherQuantity == "" || rID.insuredMemberQuestions[questionObj].OtherQuantity == null || rID.insuredMemberQuestions[questionObj].OtherQuantity == 0) && rID.insuredMemberQuestions[questionObj].OtherName  ){
                $rootScope.alertConfiguration('E',"Please fill propoer Other Quantity ");
                return false;
            }
            if((rID.insuredMemberQuestions[questionObj].OtherName == "" || rID.insuredMemberQuestions[questionObj].OtherName == null ) &&  rID.insuredMemberQuestions[questionObj].OtherQuantity != 0  &&  rID.insuredMemberQuestions[questionObj].OtherQuantity){
                $rootScope.alertConfiguration('E',"Please fill propoer Other name ");
                return false;
            }

            else{
                return true
            }
            
        }

    /* End of validateing smoke questions */


    /* To Submit Questions */

        function submitQuestions(event,actText){
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateMemberQuestions",rID.insuredMemberQuestions, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data) {
                    if(data.ResponseCode == '1'){
                        fIDQ = fIDQ + 1; /* Increase member count */

                        /* To check whether member data updated is of last member or not */

                            if(fIDQ == rID.insuredMembers.length){
                                /* We call GetHealthAndLifeStyleMembers api to check whether we have any member with preexisting conditions or not */
                                aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetHealthAndLifeStyleMembers", {
                                    "ReferenceNumber": sessionStorage.getItem('rid')
                                }, false, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then(function(data) {

                                        /* If yes then we redirect user to health-lifestyle page */
                                        if(data.ResponseCode == 1){
                                            if($location.$$path == "/cross-sell-insured-details"){
                                                $location.url('cross-sell-health-lifestyle?product='+sessionStorage.getItem('productSelctedInCross'));
                                            }else{
                                                if(rID.PA || rID.CI || rID.CS){
                                                    $location.url('rfb-health-lifestyle');
                                                }else if(rID.PL){
                                                    $location.url('platinum-health-lifestyle');
                                                }else if(rID.DI){
                                                    $location.url('diamond-declaration');
                                                }else if(rID.AC){
                                                    $location.url('activ-care-health-lifestyle');
                                                }else if(rID.CK){
                                                    $location.url('corona-kavach-health-lifestyle');
                                                }else if(rID.AS){
                                                    $location.url('arogya-sanjeevani-health-lifestyle');
                                                }
                                                else if(rID.FIT){
                                                    $location.url('fit-health-lifestyle');
                                                }
                                            }
                                        /* If no then we redirect user to declaration page */
                                        }else if(data.ResponseCode == 2){
                                            if($location.$$path == "/cross-sell-insured-details")  {
                                                $location.url('cross-sell-declaration?product='+sessionStorage.getItem('productSelctedInCross'));
                                            }else if($location.$$url == "/platinum-insured-details") {
                                                $location.url('platinum-declaration');
                                            }else if($location.$$url == "/diamond-insured-details") {
                                                $location.url('diamond-declaration');
                                            }else if($location.$$url == "/activ-care-insured-details") {
                                                $location.url('activ-care-declaration');
                                            }else if($location.$$url == "/corona-kavach-insured-details") {
                                                $location.url('corona-kavach-declaration');
                                            }else if($location.$$url == "/arogya-sanjeevani-insured-details") {
                                                $location.url('arogya-sanjeevani-declaration');
                                            }else if($location.$$url == "/fit-insured-details") {
                                                $location.url('fit-declaration');
                                            }else{
                                                $location.url('rfb-declaration');
                                            } 
                                        }else{
                                            event.target.disabled = false;
                                            event.target.innerHTML = actText;
                                            $rootScope.alertConfiguration('E',data.ResponseMessage);
                                        }
                                    },function(err){
                                        event.target.disabled = false;
                                        event.target.innerHTML = actText;
                                    });
                            }else{
                                /* If not last member then we fetch data of next insured member */
                                event.target.disabled = false;
                                event.target.innerHTML = actText;
                                $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                                rID.TIconsultationDay = '';
                                rID.TIconsultationMonth = '';
                                rID.TIconsultationYear = '';
                                rID.TIdiagnosisDay = '';
                                rID.TIdiagnosisMonth = '';
                                rID.TIdiagnosisYear = '';
                                rID.TIstartDay = '';
                                rID.TIstartMonth = '';
                                rID.TIstartYear = '';
                                rID.TIendDay = '';
                                rID.TIendMonth = '';
                                rID.TIendYear = '';

                                rID.DGconsultationDay = '';
                                rID.DGconsultationMonth = '';
                                rID.DGconsultationYear = '';
                                rID.DGdiagnosisDay = '';
                                rID.DGdiagnosisMonth = '';
                                rID.DGdiagnosisYear = '';

                                rID.PREGNANTDay = '';
                                rID.PREGNANTMonth = '';
                                rID.PREGNANTYear = '';
                                rID.PPdiagnosisDay = '';
                                rID.PPdiagnosisMonth = '';
                                rID.PPdiagnosisYear = '';
                                rID.PPconsultationDay = '';
                                rID.PPconsultationMonth = '';
                                rID.PPconsultationYear = '';

                                fetchInsuredDetails(rID.insuredMembers[fIDQ].Gender, rID.insuredMembers[fIDQ].RelationType,rID.insuredMembers[fIDQ].RelationWithProposer,true);
                            }

                        /* End of checking member data updated is of last member or not */
                    }else{
                        $rootScope.alertConfiguration('E',data.ResponseMessage);
                    }
                },function(err){
                    event.target.disabled = false;
                    event.target.innerHTML = actText;
                });
        }        

    /* End of submitting questions */


    /* To Validate profession details */

        function professionDetailsValidation(){
            var errorAlert = "<ul>";
            var gtagLabelAlert = ""
            if(rID.insuredDetails.MemberDetail.EarningNonEarning == "Earning"){
                if(rID.insuredDetails.MemberDetail.AnnualIncome < 24999){
                    errorAlert = errorAlert+"<li>Please fill proper Annual Income.</li>";
                    gtagLabelAlert = "annual-income_alert"
                }
                if(rID.insuredDetails.MemberDetail.Occupation == ""){
                     errorAlert = errorAlert+"<li>Please select occupation.</li>";
                     gtagLabelAlert = "occupation_alert"
                }
                if(rID.Designation == "" && !rID.PL){
                     errorAlert = errorAlert+"<li>Please enter designation.</li>"
                     gtagLabelAlert = "designation_alert";
                }
                if(rID.insuredDetails.MemberDetail.NatureOfDuty == ""){
                     errorAlert = errorAlert+"<li>Please select nature of duty.</li>"
                     gtagLabelAlert = "nature-of-duty_alert";
                }
            }else{
                rID.insuredDetails.MemberDetail.EarningNonEarning == "Non Earning";
                if(rID.insuredDetails.MemberDetail.Occupation == ""){
                     errorAlert = errorAlert+"<li>Please select occupation.</li>";
                }
                if(rID.insuredDetails.MemberDetail.RelationType == "SPO" && rID.Designation == ""){
                     errorAlert = errorAlert+"<li>Please select education.</li>";
                } 
            }
            if(rID.PA){
                curActMember.PA.Designation = rID.Designation;
            }
            if(rID.CI){
                curActMember.CI.Designation = rID.Designation;
            }
            if(rID.CS){
                curActMember.CS.Designation = rID.Designation;
            }
            if(rID.PL ){
                rID.insuredDetails.MemberDetail.Designation = rID.Designation;
            }
            errorAlert = errorAlert+"</ul>";
            if(errorAlert != "<ul></ul>"){
                $rootScope.alertConfiguration('E',errorAlert , rID.activeMember+"_"+gtagLabelAlert);
                return true;
            }else{
                return false;
            }
        }

    /* End of validating profession details */


        rID.updateStartAndEndDate = function(){

                if(rID.selfISolationStartDate.length == 10 && rID.selfISolationEndDate.length == 10){
                    rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE_START_END_DATE = rID.selfISolationStartDate +"to"+ rID.selfISolationEndDate;
                }
    }



    /* future Date check */
        rID.futureDateCheck = function(paramDate){
            var newDate = paramDate.split('/')

            if(new Date(newDate[1]+'/'+newDate[0]+'/'+newDate[2]) < new Date()){
                if (rID.PL){
                    rID.insuredMemberQuestions.PLMemberQuestions.PREGNANT_DATE = "";
                } 
                    
                if (rID.DI) {
                    rID.insuredMemberQuestions.DIMemberQuestions.Date_of_delivery = "";
                }
                    
                    $rootScope.alertConfiguration('E',"Please enter a future date", "Date error"); 
            }
        }
    /* Future Date Check ends */


    /* verify Corona KAvach Question */

            function verifyCkQuestion(){
                var returnVal = "<ul>";
                    
                if(rID.insuredMemberQuestions.CKMemberQuestions.COUGH_FEVER == 'Y' && ( rID.insuredMemberQuestions.CKMemberQuestions.COUGH_FEVER_Details == '' || rID.insuredMemberQuestions.CKMemberQuestions.COUGH_FEVER_Details == null )) {
                    returnVal = returnVal + "<li>Please fill valid Cough fever details.</li>";
                }
                if(rID.insuredMemberQuestions.CKMemberQuestions.COVID_POSITIVE == 'Y' && (rID.insuredMemberQuestions.CKMemberQuestions.COVID_POSITIVE_DATE_TEST_DONE == '' || rID.insuredMemberQuestions.CKMemberQuestions.COVID_POSITIVE_DATE_TEST_DONE == null )) {
                    returnVal = returnVal + "<li>Please fill valid Covid postive date test.</li>";
                }
                if(rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE == 'Y' && ( rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE_START_END_DATE == '' || rID.insuredMemberQuestions.CKMemberQuestions.PAST_SELF_ISOLATE_START_END_DATE == null  )) {
                    returnVal = returnVal + "<li>Please fill past self isolate date.</li>";
                }
                if(rID.insuredMemberQuestions.CKMemberQuestions.ANY_TRAVELLING_HISTORY == 'Y' && (rID.insuredMemberQuestions.CKMemberQuestions.bt1via1qwwkc2ssfu0sy7c6qhr8e4curh64j8vglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mcr8flLED == '' || rID.insuredMemberQuestions.CKMemberQuestions.bt1via1qwwkc2ssfu0sy7c6qhr8e4curh64j8vglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mglc0pz0mcr8flLED == null)) {
                    returnVal = returnVal + "<li>Please fill valid Travel history .</li>";
                }
                if(rID.insuredMemberQuestions.CKMemberQuestions.UNDERGONE_ANY_INVESTIGATION == 'Y' && (rID.insuredMemberQuestions.CKMemberQuestions.UNinECzXwZ8Ph5K9tsHhRoCHHyobVnSxJ4j == '' || rID.insuredMemberQuestions.CKMemberQuestions.UNinECzXwZ8Ph5K9tsHhRoCHHyobVnSxJ4j == null ) ) {
                    returnVal = returnVal + "<li>Please fill valid investigation details.</li>";
                }
                if(rID.insuredMemberQuestions.CKMemberQuestions.ANY_DECLINE_CANCELLED_POLICY == 'Y' && (rID.insuredMemberQuestions.CKMemberQuestions.ANY_DECLINE_CANCELLED_POLICY_DETAILS == '' || rID.insuredMemberQuestions.CKMemberQuestions.ANY_DECLINE_CANCELLED_POLICY_DETAILS == null) ) {
                    returnVal = returnVal + "<li>Please fill valid Decline policy Details.</li>";
                }
                if(rID.insuredMemberQuestions.CKMemberQuestions.DIRECT_CONTACT_WITH_COVID_PATIENT == 'Y' && (rID.insuredMemberQuestions.CKMemberQuestions.DIRECT_CONTACT_WITH_COVID_PATIENT_DATE_OF_CONTACT == '' || rID.insuredMemberQuestions.CKMemberQuestions.DIRECT_CONTACT_WITH_COVID_PATIENT_DATE_OF_CONTACT == null) ) {
                    returnVal = returnVal + "<li>Please fill valid direct contact with Covid Patient.</li>";
                }

            

                if(returnVal != "<ul>"){
                        $rootScope.alertData = {
                                            "modalClass": "regular-alert",
                                            "modalHeader": "Error",
                                            "modalBodyText": returnVal + "</ul>",
                                            "showCancelBtn": false,
                                            "modalSuccessText" : "OK",
                                            "showAlertModal": true,
                                            
                                            
                                            
                                           }
                                         return true  
                }
                
            
            }
    /* verify corona kavach question ends */


    /* To Submit insured details data */

        rID.submitForm = function(event,validForm){
            rID.showErrors = false;

             if(!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(rID.insuredDetails.MemberDetail.Email)) && (rID.AC || rID.AS)){
               $rootScope.alertConfiguration('E',"Please enter a valid email id");
               $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 80 }, 300);
                return false;
            }
            /* Following if block checks whether all required fields are filled by user or not */

                if(!validForm){
                    rID.showErrors = true;
                    $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                    $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
                    return false;
                }

            /* End of block to check required form fields */

            var regex = /^[A-Za-z0-9 ]+$/
            if($("input[name='firstname']").val() != '')
            {
                var isFirstNameValid = regex.test($("input[name='firstname']").val());
                if (!isFirstNameValid) {
                    $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                    $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
                    return false;
                } 
            }
            
            if($("input[name='middlename']").val() != '')
            {
                var isMiddleNameValid = regex.test($("input[name='middlename']").val());
                if (!isMiddleNameValid) {
                    $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                    $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
                    return false;
                } 
            }

            if($("input[name='lastname']").val() != '')
            {
                var isLastNameValid = regex.test($("input[name='lastname']").val());
                if (!isLastNameValid) {
                    $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                    $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
                    return false;
                } 
            }

            /* Check Risk Class of user */
            
                if(Risk_class == 4 && !rID.PL){
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": "You are not elligible to buy policy as selected Nature of Duty is of Risk Class 4",
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                    return false;
                }

            /* End of checking of Risk class of user */

             if( rID.CK){
                    if(verifyCkQuestion() ){

                        return false;
                    }
                    
                    }


            /* User height field validation */

                if(rID.insuredDetails.MemberDetail.HeightFt < 1 && rID.heightWeightMandatory){
                    $rootScope.alertConfiguration('E',"Please enter proper height" , rID.activeMember+"_height_alert");
                    return false;
                }

            /* End of validating height of user */

            if(deleteOptionalCover){
                 $rootScope.alertData = {
                                            "modalClass": "regular-alert",
                                            "modalHeader": "Success",
                                            "modalBodyText": "As Self Annual income is less than 50,000 </br> so all the optional cover from the selected members will be removed ",
                                            "showCancelBtn": true,
                                            "modalSuccessText" : "Yes",
                                            "showAlertModal": true,
                                            "modalCancelText": "No",
                                            "positiveFunction" : function(){
                                               fetchUpdateQuoteDetails(false);
                                               deleteOptionalCover = false;
                                               rID.submitForm(event,validForm)
                                            },
                                            "negativeFunction" : function(){
                                                rID.insuredDetails.MemberDetail.AnnualIncome = ""
                                            }
                                           }
                                           return false;
                
            }



            /* Platinum V3 age validation 
            removal of PA CI and ICMI Cover basis of Age above 65 */

            if(rID.insuredDetails.MemberDetail.AGE > 65 && (rID.insuredDetails.MemberDetail.CICoverFlag == 'Y' || rID.insuredDetails.MemberDetail.PACoverFlag == 'Y' || rID.insuredDetails.MemberDetail.ICMICoverFlag == 'Y')){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "Personal accident and Critical Illness and International coverage are avilable only below 65 years",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Yes",
                    "modalCancelText" : "No",
                    "showAlertModal": true,
                    "positiveFunction": function(){
                        rID.insuredDetails.MemberDetail.CICoverFlag = 'N' 
                        rID.insuredDetails.MemberDetail.PACoverFlag = 'N' 
                        rID.insuredDetails.MemberDetail.ICMICoverFlag = 'N'
                        rID.submitForm(event,validForm)
                    },
                    
                }
                return false;
            }

            /* Ends Platinum V3 age validation 
            removal of PA CI and ICMI Cover basis of Age above 65 */


            /* User weight field validation */

                if(rID.insuredDetails.MemberDetail.Weight < 1 && rID.heightWeightMandatory){
                    $rootScope.alertConfiguration('E',"Please enter proper weight" , rID.activeMember+"_weight_alert");
                    return false;
                }

            /* End of user weight field validation */

             if(rID.ST && rID.insuredMemberQuestions.DIMemberQuestions.PreExistingDisease == 'Y' ){
                    rID.insuredMemberQuestions.STMemberQuestions.PreExistingDisease = 'Y' 




                    /*var bmiVal = rID.calucuteBMI();
                    
                    if(bmiVal < 14 || bmiVal > 33 || rID.insuredMemberQuestions.DIMemberQuestions.PreExistingDisease == 'Y' || rID.insuredMemberQuestions.DIMemberQuestions.IsSmokeAlcohol == 'Y' || rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy == 'Y'  ){
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": "Based on your declaration, you are not eligible to opt for this product  ",
                            "hideCloseBtn":true,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            
                            "showAlertModal": true,
                            "positiveFunction" : function(){
                                               $location.url('pre-quote')
                                            },
                            
                        }
                         return false;
                       
                    }*/
                }

            /* Validate the Dob entered by the user on the basis of product  */
                        var userDate = new Date(rID.insuredDetails.MemberDetail.DOB);
                        var currentDate = new Date();
                        var dateDiff = currentDate - userDate;
                        var userAge = Math.floor((dateDiff/1000) / (60*60*24*365.25));
                        var updatePremium = false;   

                         if(!productWiseAgeValidtion(userAge , null)){
                            return false;
                        }   

            /* Validate the Dob entered by the user on the basis of product  ends*/

            
            /* Validating income related details. Applicable only in case of RFB products i.e. PA, CI or CS */

                if(rID.PA || rID.CI || rID.CS || (rID.PL && rID.insuredDetails.MemberDetail.PACoverFlag == 'Y')){
                    if(professionDetailsValidation()){
                        return false;
                    }
                }

            /* End of Validating income related details.*/


            /* validte Memebers for the Active Care Age Validation  */

                /*if(rID.AC && !validMemberOfAC && (fIDQ == rID.insuredMembers.length - 1) && rID.insuredDetails.MemberDetail.PolicyType == "FF" ){
                    $rootScope.alertConfiguration('E',"Incase of Family floter Atleast one member should be above 55");
                        return false;
                }*/

            /*validte Memebers for the Active Care Age Validation  ends* /


            /* Disabling Save and Continue btn */

                var actText = angular.copy(event.target.innerHTML);
                event.target.disabled = true;
                event.target.textContent = "Saving...";

            /* End of disabling save and continue button */

            var questionValidate = "<ul>"; // Question Validate flag set to true for first instance.

            /* Diamond Smoke Alcohol Question and pre existing disease questions validations */

                if(rID.DI){
                    (rID.insuredMemberQuestions.DIMemberQuestions.IsSmokeAlcohol == 'Y') ? questionValidate = validateSmokeQuestion('DIMemberQuestions') : "";
                    (rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy == null || rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy == "") ? rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy = 'N' : "";
                }

            /* End of Diamond Smoke Alcohol Question and pre existing disease questions validations */


            if(rID.stProductAvail){
                                    rID.insuredMemberQuestions.STMemberQuestions.AlcoholQuantity = rID.insuredMemberQuestions.DIMemberQuestions.AlcoholQuantity;
                                    rID.insuredMemberQuestions.STMemberQuestions.GuthkaQuantity = rID.insuredMemberQuestions.DIMemberQuestions.GuthkaQuantity;
                                    rID.insuredMemberQuestions.STMemberQuestions.IsSmokeAlcohol = rID.insuredMemberQuestions.DIMemberQuestions.IsSmokeAlcohol;
                                    rID.insuredMemberQuestions.STMemberQuestions.OtherName = rID.insuredMemberQuestions.DIMemberQuestions.OtherName;
                                    rID.insuredMemberQuestions.STMemberQuestions.OtherQuantity = rID.insuredMemberQuestions.DIMemberQuestions.OtherQuantity;
                                    rID.insuredMemberQuestions.STMemberQuestions.PreExisitingPolicy = rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy;
                                    rID.insuredMemberQuestions.STMemberQuestions.PreviousBenefitCover = rID.insuredMemberQuestions.DIMemberQuestions.PreviousBenefitCover;
                                    rID.insuredMemberQuestions.STMemberQuestions.PreviousClaimRejectDetail = rID.insuredMemberQuestions.DIMemberQuestions.PreviousClaimRejectDetail;
                                    rID.insuredMemberQuestions.STMemberQuestions.PreviousClaimRejected = rID.insuredMemberQuestions.DIMemberQuestions.PreviousClaimRejected;
                                    rID.insuredMemberQuestions.STMemberQuestions.PreviousExistingSI = rID.insuredMemberQuestions.DIMemberQuestions.PreviousExistingSI;
                                    rID.insuredMemberQuestions.STMemberQuestions.PreviousPolicyClaim = rID.insuredMemberQuestions.DIMemberQuestions.PreviousPolicyClaim;
                                    rID.insuredMemberQuestions.STMemberQuestions.PreviousPolicyNumber = rID.insuredMemberQuestions.DIMemberQuestions.PreviousPolicyNumber;
                                    rID.insuredMemberQuestions.STMemberQuestions.SmokeQuantity = rID.insuredMemberQuestions.DIMemberQuestions.SmokeQuantity;
                                }

            /* Corona Kavach Smoke Alcohol Question and pre existing disease questions validations */

                if(rID.CK){
                    (rID.insuredMemberQuestions.CKMemberQuestions.IsSmokeAlcohol == 'Y') ? questionValidate = validateSmokeQuestion('CKMemberQuestions') : "";

                    
                    
                }

            /* End of Corona Kavach Smoke Alcohol Question and pre existing disease questions validations */

            /* Arogya Sanjeevani Smoek Alcohol Question questions validations */
            if(rID.AS){
                (rID.insuredMemberQuestions.ASMemberQuestions.IsSmokeAlcohol == 'Y') ? questionValidate = validateSmokeQuestion('ASMemberQuestions') : "";    
            }
            /* End of Arogya Sanjeevani Smoek Alcohol Question questions validations */


            /* Active Care Smoke Alcohol Question and pre existing disease questions validations */

                if(rID.AC){
                    if(rID.insuredMemberQuestions.ACMemberQuestions.IsSmokeAlcohol == 'Y') 
                    {
                        var ismokeVal =  validateSmokeQuestionActCare('ACMemberQuestions') ;
                        if(!ismokeVal){
                            event.target.disabled = false;
                            event.target.innerHTML = actText;
                            return ismokeVal
                        }
                    }
                    (rID.insuredMemberQuestions.ACMemberQuestions.PreExisitingPolicy == null || rID.insuredMemberQuestions.ACMemberQuestions.PreExisitingPolicy == "") ? rID.insuredMemberQuestions.ACMemberQuestions.PreExisitingPolicy = 'N' : "";
                }

            /* End of Active Care Smoke Alcohol Question and pre existing disease questions validations */


            /* RFB level smoke alcohol and pre existing disease question validation */

                if((rID.PA && rID.insuredDetails.MemberDetail.HCB == 'Y') || rID.CI || rID.CS){
                    (rID.insuredMemberQuestions.RFBMemberQuestions.IsSmokeAlcohol == 'Y') ? questionValidate = validateSmokeQuestion('RFBMemberQuestions') : ""; // To validate RFB smoke data validation

                    /* If diamond is present with RFB then mapping diamond smoke alchol question data as per RFB value */

                        if(rID.DI){
                            rID.insuredMemberQuestions.DIMemberQuestions.IsSmokeAlcohol = rID.insuredMemberQuestions.RFBMemberQuestions
                            .IsSmokeAlcohol;
                            rID.insuredMemberQuestions.DIMemberQuestions.AlcoholQuantity = rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity;
                            rID.insuredMemberQuestions.DIMemberQuestions.SmokeQuantity = rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity;
                            rID.insuredMemberQuestions.DIMemberQuestions.GuthkaQuantity =  rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity;
                            rID.insuredMemberQuestions.DIMemberQuestions.OtherName = rID.insuredMemberQuestions.RFBMemberQuestions.OtherName;
                            rID.insuredMemberQuestions.DIMemberQuestions.OtherQuantity = rID.insuredMemberQuestions.RFBMemberQuestions.OtherQuantity;
                            rID.insuredMemberQuestions.DIMemberQuestions.PreExistingDisease = rID.insuredMemberQuestions.RFBMemberQuestions.PreExistingDisease;
                        }

                    /* End of diamond mapping data in case of RFB */

                    /* If Active Care is present with RFB then mapping Active Care smoke alchol question data as per RFB value */

                        if(rID.AC){
                            rID.insuredMemberQuestions.ACMemberQuestions.IsSmokeAlcohol = rID.insuredMemberQuestions.RFBMemberQuestions
                            .IsSmokeAlcohol;
                            rID.insuredMemberQuestions.ACMemberQuestions.AlcoholQuantity = rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity;
                            rID.insuredMemberQuestions.ACMemberQuestions.SmokeQuantity = rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity;
                            rID.insuredMemberQuestions.ACMemberQuestions.GuthkaQuantity =  rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity;
                            rID.insuredMemberQuestions.ACMemberQuestions.OtherName = rID.insuredMemberQuestions.RFBMemberQuestions.OtherName;
                            rID.insuredMemberQuestions.ACMemberQuestions.OtherQuantity = rID.insuredMemberQuestions.RFBMemberQuestions.OtherQuantity;
                            rID.insuredMemberQuestions.ACMemberQuestions.PreExistingDisease = rID.insuredMemberQuestions.RFBMemberQuestions.PreExistingDisease;
                        }

                    /* End of Active Care mapping data in case of RFB */


                    /* If platinum is present with RFB then mapping platinum smoke alchol question data as per RFB value */

                        if(rID.PL){

                            /* Mapping platinum Alcohol related data as per RFB alcohol data  */

                                if(rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity != null && rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity != "" && rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity != 0){
                                    rID.insuredMemberQuestions.PLMemberQuestions.AlcoholFlag = 'Y';
                                    rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco = 'Y';

                                    /* As for RFB we are taking values for week basis, and platinum we store by day basis then we divide rfb alchol value by 7 to get platinum value. If after dividing by 7 we gets 0 then we consider that value as 1 */
                                    rID.insuredMemberQuestions.PLMemberQuestions.AlcoholQunatity = Math.round(rID.insuredMemberQuestions.RFBMemberQuestions.AlcoholQuantity / 7);
                                    if(rID.insuredMemberQuestions.PLMemberQuestions.AlcoholQunatity == 0){
                                        rID.insuredMemberQuestions.PLMemberQuestions.AlcoholQunatity = "1";
                                    }
                                    if(rID.insuredMemberQuestions.PLMemberQuestions.AlcoholDuration == 0 || rID.insuredMemberQuestions.PLMemberQuestions.AlcoholDuration == "" || rID.insuredMemberQuestions.PLMemberQuestions.AlcoholDuration == null){
                                        questionValidate = questionValidate + "<li>Please fill valid alcohol duration.</li>";
                                    }
                                }else{
                                    rID.insuredMemberQuestions.PLMemberQuestions.AlcoholQunatity = 0;
                                    rID.insuredMemberQuestions.PLMemberQuestions.AlcoholDuration = 0;
                                    rID.insuredMemberQuestions.PLMemberQuestions.AlcoholFlag = 'N';
                                }

                            /* End of Mapping platinum Alcohol related data as per RFB alcohol data  */


                            /* Mapping platinum smoke related data as per RFB smoke data */

                                if(rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity != null && rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity != "" && rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity != 0){
                                    rID.insuredMemberQuestions.PLMemberQuestions.SmokeFlag = 'Y';
                                    rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco = 'Y';  
                                    /* As for RFB we are taking values for week basis, and platinum we store by day basis then we divide rfb smoke value by 7 to get platinum value. If after dividing by 7 we gets 0 then we consider that value as 1 */                  
                                    rID.insuredMemberQuestions.PLMemberQuestions.SmokeQunatity = Math.round(rID.insuredMemberQuestions.RFBMemberQuestions.SmokeQuantity / 7);
                                    if(rID.insuredMemberQuestions.PLMemberQuestions.SmokeQunatity == 0){
                                        rID.insuredMemberQuestions.PLMemberQuestions.SmokeQunatity = "1";
                                    }
                                    if(rID.insuredMemberQuestions.PLMemberQuestions.SmokeDuration == 0 || rID.insuredMemberQuestions.PLMemberQuestions.SmokeDuration == "" || rID.insuredMemberQuestions.PLMemberQuestions.SmokeDuration == null){
                                       questionValidate = questionValidate + "<li>Please fill valid smoke duration.</li>";
                                    }
                                }else{
                                    rID.insuredMemberQuestions.PLMemberQuestions.SmokeQunatity = 0;
                                    rID.insuredMemberQuestions.PLMemberQuestions.SmokeDuration = 0;
                                    rID.insuredMemberQuestions.PLMemberQuestions.SmokeFlag = 'N';
                                }

                            /* End of Mapping platinum smoke related data as per RFB smoke data */


                            /* Mapping platinum guthka/tobacco related data as per RFB gutakha data */

                                if(rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity != null && rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity != "" && rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity != 0){
                                    rID.insuredMemberQuestions.PLMemberQuestions.TobbacoFlag = 'Y';
                                    rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco = 'Y';
                                    /* As for RFB we are taking values for week basis, and platinum we store by day basis then we divide rfb smoke value by 7 to get platinum value. If after dividing by 7 we gets 0 then we consider that value as 1 */                              
                                    rID.insuredMemberQuestions.PLMemberQuestions.TobbacoQuantity = Math.round(rID.insuredMemberQuestions.RFBMemberQuestions.GuthkaQuantity / 7);
                                    if(rID.insuredMemberQuestions.PLMemberQuestions.TobbacoQuantity == 0){
                                        rID.insuredMemberQuestions.PLMemberQuestions.TobbacoQuantity = "1";
                                    }
                                    if(rID.insuredMemberQuestions.PLMemberQuestions.TobbacoDuration == 0 || rID.insuredMemberQuestions.PLMemberQuestions.TobbacoDuration == "" || rID.insuredMemberQuestions.PLMemberQuestions.TobbacoDuration == null){
                                        questionValidate = questionValidate + "<li>Please fill valid tobacco duration.</li>";
                                    }
                                }else{
                                    rID.insuredMemberQuestions.PLMemberQuestions.TobbacoDuration = 0;
                                    rID.insuredMemberQuestions.PLMemberQuestions.TobbacoQuantity = 0;
                                    rID.insuredMemberQuestions.PLMemberQuestions.TobbacoFlag = 'N';
                                }

                            /* End of mapping platinum guthaka/tobacco related data as per RFB tobacco data */


                            /* If after mapping we get tobbacoflag, smokeflag, alcoholflag values gets 'N' then we make  'IsSmokeAlcoholTobbaco' flag of platinum to 'N' as well */
                            if(rID.insuredMemberQuestions.PLMemberQuestions.TobbacoFlag == 'N' && rID.insuredMemberQuestions.PLMemberQuestions.SmokeFlag == 'N' && rID.insuredMemberQuestions.PLMemberQuestions.AlcoholFlag == 'N'){
                                rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco = 'N';
                            }

                            /* Mapping platinum pre existing disease value as per RFB pre-existing disease value */

                            rID.insuredMemberQuestions.PLMemberQuestions.PreExistingDisease = rID.insuredMemberQuestions.RFBMemberQuestions.PreExistingDisease;
                        }

                    /* End of platinum is present with RFB */
                }

            /* End of RFB level smoke alcohol and pre existing disease question validation */


            /* Only platinum buy journey validation and cross sell of platinum with RFB-PA only */

                if(!(rID.PA && rID.insuredDetails.MemberDetail.HCB == 'Y') && !rID.CI && !rID.CS && rID.PL){
                    if(rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco == 'Y'){
                        var iFlag = true;

                        /* Validate tobbaco related data */
                        if(rID.insuredMemberQuestions.PLMemberQuestions.TobbacoFlag == 'Y' && (rID.insuredMemberQuestions.PLMemberQuestions.TobbacoQuantity == 0 || rID.insuredMemberQuestions.PLMemberQuestions.TobbacoQuantity == '')  ){
                            questionValidate = questionValidate + "<li>Please fill valid tobacco quanitity </li>";
                            iFlag = false;
                        }
                        /* Validate alcohol related data */
                        if(rID.insuredMemberQuestions.PLMemberQuestions.AlcoholFlag == 'Y' && ( rID.insuredMemberQuestions.PLMemberQuestions.AlcoholQunatity == 0 || rID.insuredMemberQuestions.PLMemberQuestions.AlcoholQunatity == '') ){
                            questionValidate = questionValidate + "<li>Please fill valid Alcohol quanitity </li>";
                            iFlag = false;
                        }
                        /* Validate smoke related data */
                        if(rID.insuredMemberQuestions.PLMemberQuestions.SmokeFlag == 'Y' && (rID.insuredMemberQuestions.PLMemberQuestions.SmokeQunatity == '' || rID.insuredMemberQuestions.PLMemberQuestions.SmokeQunatity == 0) ){
                            questionValidate = questionValidate + "<li>Please fill valid Smoke quanitity </li>";
                            iFlag = false;
                        }
                        /*validate others question */
                        if(rID.insuredMemberQuestions.PLMemberQuestions.OtherFlag == 'Y' && (rID.insuredMemberQuestions.PLMemberQuestions.OtherName == '' || rID.insuredMemberQuestions.PLMemberQuestions.OtherName == null || rID.insuredMemberQuestions.PLMemberQuestions.OtherQuantity == 0 || rID.insuredMemberQuestions.PLMemberQuestions.OtherQuantity == '') ){
                            questionValidate = questionValidate + "<li>Please fill valid Other name and duration combination.</li>";
                            iFlag = false;
                        }

                        if(iFlag){
                            //questionValidate = questionValidate + "<li>Please select atleast one condition from smoke/alcohol and tobacco.</li>";
                            rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco == 'N';
                        }
                    }
                }

            /* End of Only platinum buy journey validation and cross sell of platinum with RFB-PA only */


            /* Platinum Smoke/acholo related validation popup */
             /* Platinum Smoke/acholo related validation popup */
                questionValidate = questionValidate + "</ul>"
                if((rID.PL && rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco == 'Y' && rID.insuredMemberQuestions.PLMemberQuestions.TobbacoFlag != 'Y' && rID.insuredMemberQuestions.PLMemberQuestions.AlcoholFlag != 'Y' && rID.insuredMemberQuestions.PLMemberQuestions.SmokeFlag != 'Y' && rID.insuredMemberQuestions.PLMemberQuestions.OtherFlag != 'Y') || (questionValidate != "<ul></ul>")){
                    questionValidate =( questionValidate == "<ul></ul>")?   "Please fill valid smoke/tobacco or consumes alcohol value ": questionValidate;
                    $rootScope.alertConfiguration('E',questionValidate , rID.activeMember+"_smoke-alcohol_alert");
                    event.target.disabled = false;
                    event.target.innerHTML = actText;
                    return false;
                }

            /* End of Platinum Smoke/acholo related validation popup */



            /* Diamond pre existing policy question validation */

                if(rID.DI && rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy == 'Y'){
                    if(rID.insuredMemberQuestions.DIMemberQuestions.PreviousPolicyNumber == "" || rID.insuredMemberQuestions.DIMemberQuestions.PreviousBenefitCover == '' || rID.insuredMemberQuestions.DIMemberQuestions.PreviousExistingSI < 1){
                        $rootScope.alertConfiguration('E',"Please fill proper pre-existing policy questions data." , rID.activeMember+"_pre-existing-policy_alert");
                        event.target.disabled = false;
                        event.target.innerHTML = actText;
                        return false;
                    }
                }

            /* End of Diamond pre existing policy question validation */


            /* Active Care  pre existing policy question validation */

                if(rID.AC && rID.insuredMemberQuestions.ACMemberQuestions.PreviousExisting == 'Y'){
                    if(rID.insuredMemberQuestions.ACMemberQuestions.InsurerName == "" || angular.isUndefined(rID.insuredMemberQuestions.ACMemberQuestions.InsurerName) ||  rID.insuredMemberQuestions.ACMemberQuestions.InsurerName == null){
                        $rootScope.alertConfiguration('E',"Please fill proper InsurerName");
                        event.target.disabled = false;
                        event.target.innerHTML = actText;
                        return false;
                    }
                }

            /* End of Active Care  pre existing policy question validation */


            /* RFB pre existing policy question data validation */

                if(rID.PA || rID.CI || rID.CS){
                    if(rID.insuredMemberQuestions.RFBMemberQuestions.PreExisitingPolicy == 'Y' && (rID.insuredMemberQuestions.RFBMemberQuestions.PreviousPolicyNumber == "" || rID.insuredMemberQuestions.RFBMemberQuestions.PreviousBenefitCover == '' || rID.insuredMemberQuestions.RFBMemberQuestions.PreviousExistingSI < 1)){
                        $rootScope.alertConfiguration('E',"Please fill proper pre-existing policy questions data." , rID.activeMember+"_pre-existing-policy_alert");
                        event.target.disabled = false;
                        event.target.innerHTML = actText;
                        return false;
                    }
                    (rID.insuredMemberQuestions.RFBMemberQuestions.PreExisitingPolicy == null || rID.insuredMemberQuestions.RFBMemberQuestions.PreExisitingPolicy == "") ? rID.insuredMemberQuestions.RFBMemberQuestions.PreExisitingPolicy = 'N' : "";

                    /* In case of diamond product with RFB map diamond pre existing policy question data */

                        if(rID.DI){
                            rID.insuredMemberQuestions.DIMemberQuestions.PreExisitingPolicy = rID.insuredMemberQuestions.RFBMemberQuestions.PreExisitingPolicy;
                            rID.insuredMemberQuestions.DIMemberQuestions.PreviousPolicyNumber = rID.insuredMemberQuestions.RFBMemberQuestions.PreviousPolicyNumber;
                            rID.insuredMemberQuestions.DIMemberQuestions.PreviousBenefitCover = rID.insuredMemberQuestions.RFBMemberQuestions.PreviousBenefitCover;
                            rID.insuredMemberQuestions.DIMemberQuestions.PreviousExistingSI = rID.insuredMemberQuestions.RFBMemberQuestions.PreviousExistingSI;
                            rID.insuredMemberQuestions.DIMemberQuestions.PreviousPolicyClaim = rID.insuredMemberQuestions.RFBMemberQuestions.PreviousPolicyClaim;
                            rID.insuredMemberQuestions.DIMemberQuestions.PreviousClaimRejected = rID.insuredMemberQuestions.RFBMemberQuestions.PreviousClaimRejected;
                            rID.insuredMemberQuestions.DIMemberQuestions.PreviousClaimRejectDetail = rID.insuredMemberQuestions.RFBMemberQuestions.PreviousClaimRejectDetail;
                        }

                    /* End of diamond product with RFB mapping of data */
                }

            /* End of RFB pre existing policy question data */


            /* Platinum declined insurance policy data validation */
            
                if(rID.PL && rID.insuredMemberQuestions.PLMemberQuestions.DeclinePolicy == 'Y' && (rID.insuredMemberQuestions.PLMemberQuestions.DeclineProductName == "" || rID.insuredMemberQuestions.PLMemberQuestions.DeclineCompanyName == "")){
                    $rootScope.alertConfiguration('E',"Please fill proper declined insurance policy data.");
                    return false;
                }

            /* End of platinum declined insurance policy data validation */

            
            /* Activ Care pre existing policy validation */

                if(rID.AC && rID.insuredMemberQuestions.ACMemberQuestions.PreviousPolicyClaim == 'Y' && rID.insuredMemberQuestions.ACMemberQuestions.InsurerName == ""){
                    $rootScope.alertConfiguration('E',"Please enter insurer name of previous existing policy.");
                    return false;
                }

            /* End of activ care pre existing polci validation */
            
            /* Update Session storage mobile no. in case of any changes */     

               var mobNo = sessionStorage.getItem('mobNo');
                
                if(mobNo != rID.insuredDetails.MemberDetail.MobileNo && rID.insuredDetails.MemberDetail.RelationType == 'S'){
                    sessionStorage.setItem('mobNo' , rID.insuredDetails.MemberDetail.MobileNo )
                }

            /* Update Session storage mobile no. in case of any changes ends*/   

            /* Arogya Sanjeevani Member Annual Income Set to Zero */
            if(rID.AS){
                rID.insuredDetails.MemberDetail.AnnualIncome = 0;
            }
            /* End  of Arogya Sanjeevani Member Annual Income Set to Zero */

            var lemeiskData   = angular.copy(rID.insuredDetails);
            delete lemeiskData.MemberDetail.MobileNo
            
            delete lemeiskData.MemberDetail.IdNumber
            delete lemeiskData.MemberDetail.DOB
            //delete lemeiskData.MemberDetail.AGE
            $rootScope.leminiskObj =  lemeiskData
            $rootScope.lemniskCodeExcute()     

            
        var lemniskObj = { 
            "First name":rID.insuredDetails.MemberDetail.FirstName,
            "Last name":rID.insuredDetails.MemberDetail.LastName,
            "DOB":rID.insuredDetails.MemberDetail.DOB,
            "Self Age":rID.insuredDetails.MemberDetail.MobileNo,
            "Whats app number":rID.insuredDetails.MemberDetail.WhatsAppNumber,
            "Annual income":rID.insuredDetails.MemberDetail.AnnualIncome,
            "Occupation":rID.insuredDetails.MemberDetail.Occupation,
            "Height":rID.insuredDetails.MemberDetail.HeightFt + "ft. " + rID.insuredDetails.MemberDetail.HeightInch + "inch",
            "Weight":rID.insuredDetails.MemberDetail.Weight,
            "Premium Amount":rID.insuredDetails.PremiumDetail.TotalPremium,
            // "IsSmokeAlcoholTobbaco":rID.insuredMemberQuestions.PLMemberQuestions.IsSmokeAlcoholTobbaco,
            // "PreExistingDisease":rID.insuredMemberQuestions.PLMemberQuestions.PreExistingDisease,
            // "ANY_SURGERY_DONE":rID.insuredMemberQuestions.PLMemberQuestions.ANY_SURGERY_DONE,
            // "PreExisitingPolicy":rID.insuredMemberQuestions.PLMemberQuestions.PreExisitingPolicy
        };
        $rootScope.lemniskTrack("","", lemniskObj);

            /* Update member details API calling */
                // rID.insuredDetails.MemberDetail.FirstName = rID.FirstName;
                // rID.insuredDetails.MemberDetail.LastName = rID.LastName;

                var reqData = $rootScope.encrypt({
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "MemberDetail": rID.insuredDetails.MemberDetail,
                    "ProductInsuredDetail": rID.insuredDetails.ProductInsuredDetail
                });
        
                console.log("UpdateMemberDetails Request");
                console.log(reqData);
        
                aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateMemberDetails", {
                    "_data": reqData
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function(data) {
                        var data = JSON.parse($rootScope.decrypt(data._resp))
                        console.log("UpdateMemberDetails Response");
                        console.log(data);

                        if(data.ResponseCode == '1'){
                            /* Update insured question data */
                            submitQuestions(event,actText);
                        }else{
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Error",
                                "modalBodyText": data.ResponseMessage,
                                "showCancelBtn": false,
                                "modalSuccessText": "OK",
                                "modalCancelText": "No",
                                "showAlertModal": true
                            }
                            event.target.disabled = false;
                            event.target.innerHTML = actText;
                        } 
                    },function(err){
                        event.target.disabled = false;
                        event.target.innerHTML = actText;
                    });

            /* End of update member details calling */

        }

    /* End of submitting insured details data */


    /* Redirect to back page funciton */

        rID.backfunction= function(){
            if($location.$$path == "/cross-sell-insured-details")  {
                $location.url('cross-sell-proposer-details?product='+sessionStorage.getItem('productSelctedInCross'));
            }
            else if($location.$$url == "/platinum-insured-details") {
                $location.url('platinum-proposer-details');
            }
            else if($location.$$url == "/diamond-insured-details") {
                $location.url('diamond-proposer-details');
            }
            else if($location.$$url == "/activ-care-insured-details") {
                $location.url('activ-care-proposer-details');
            }
            else if($location.$$url == "/arogya-sanjeevani-insured-details") {
                $location.url('arogya-sanjeevani-proposer-details');
            }
            else{
                $location.url('rfb-proposer-details');
            } 
        }

    /* Redirect to back page funciton ends */    

    // window.addEventListener('beforeunload', function (e) {
    //     aS.getData(ABHI_CONFIG.apiUrl + "gen/GetallSurveyQuestions", "", false, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(function (data) {
    //             if (data.ResponseCode == 1) {
    //                 rID.quiz = data.ResponseData;
    //             }
    //         }, function (err) {
    
    //         })

    //     e.preventDefault();
    //     e.returnValue = '';
    //     // confirm("do u want to close the browser");
    //     $('#customer-concern').modal({ backdrop: 'static', keyboard: false });
    // });
    /** customer concern end **/

    // rID.saveQuesAns = function(){
    //     var QuestionObj = {}
    //     QuestionObj = rID.quiz.Result
    //     var AnswerObject = rID.answer;
    //     var questionAnsObj = {
    //         "questionAnsObj": {
    //             "ReferenceNumber": sessionStorage.getItem('rid'),
    //             "QuestionObject":
    //             {
    //                 QuestionObj
    //             },
    //             "AnswerObject":
    //             {
    //                 AnswerObject
    //             }
    //         }
    //     }
    //     aS.postData(ABHI_CONFIG.apiUrl + "gen/SaveQueAnsWRTCustomer",  questionAnsObj, true, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then(function (data) {
    //         if (data.ResponseCode == '1') {
    //             $rootScope.alertData = {
    //                 "modalClass": "regular-alert",
    //                 "modalHeader": "Alert",
    //                 "modalBodyText": data.ResponseMessage,
    //                 "showCancelBtn": false,
    //                 "modalSuccessText": "Ok",
    //                 "showAlertModal": true,
    //                 "hideCloseBtn": true,
    //                 "positiveFunction": function () {
    //                     rID.answer1 = "";
    //                     rID.answer2 = "";
    //                     $('#customer-concern').modal('hide');

    //                 }
    //             }
    //         }else{
    //             $rootScope.alertData = {
    //                 "modalClass": "regular-alert",
    //                 "modalHeader": "Alert",
    //                 "modalBodyText": data.ResponseMessage,
    //                 "showCancelBtn": false,
    //                 "modalSuccessText": "Ok",
    //                 "showAlertModal": true
    //             }
    //         }  
    //     });
    // }

}]);


/* Aadhar card enter directive */

    iDApp.directive('aadharCard',function($timeout){
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                ngModelCtrl.$parsers.push(function (val) {
                    if (val === undefined || val === null) {
                        val = '';
                    }
                    var clean = val.toString().replace(/\D/g, "").split(/(?:([\d]{4}))/g).filter(function (s) {
                                  return s.length > 0;
                                }).join("-");
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });
                element.bind('keypress', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 101 || code === 32 || code === 109 || code === 45) {
                        e.preventDefault();
                    }
                });
            }
        };
    });

/* End of Aadhar card enter directive */


/* Height-Weight Directive */

    iDApp.directive('heightWeight',function($timeout){
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                ngModelCtrl.$parsers.push(function (val) {
                    if (val === undefined || val === null) {
                        val = '';
                    }
                    if(attrs.heightWeight == "feet"){
                        var clean = val.toString().replace(/[^0-7]+/g, '');
                    }else if(attrs.heightWeight == "inch"){
                        var clean = val.toString().replace(/[^0-9]+/g, '');
                        if(clean > 11){
                            clean = 11;
                        }
                    }else if(attrs.heightWeight == "weight"){
                        var clean = val.toString().replace(/[^0-9]+/g, '');
                         if(clean > 199){
                            clean = 199;
                        }
                    }
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });
                element.bind('keypress', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 101 || code === 32 || code === 109 || code === 45) {
                        e.preventDefault();
                    }
                });
            }
        };
    });

/* End of height-weight directive */


/* Aadhar Enrollment no. enter directive */

    iDApp.directive('aadharEnroll', function($timeout) {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                 element.bind('keypress', function(e) {
                    var key = e.charCode || e.keyCode || 0;
                     var text = $(this); 
                     if (key !== 8 && key !== 9 && (key <= 65 && key <= 90)) {
                        if (text.val().length === 4) {
                            text.val(text.val() + '-');
                        }
                        if (text.val().length === 10) {
                            text.val(text.val() + '-');
                        }
                     }
                     else{
                        return false;
                     }
                     return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
                   
                });
            }
        };
    });

/* End of Aadhar Enrollment no. enter directive */

/**
 * Mail autocomplete
 * Author: nuintun
 * $(selector).mailtip({
 *   mails: [], // mails
 *   onselected： function(mail){}, // callback on selected
 *   width: 'auto', // popup tip's width
 *   offsetTop: -1, // offset top relative default position
 *   offsetLeft: 0, // offset left relative default position
 *   zIndex: 10 // popup tip's z-index
 * });
 */

'use strict';

(function ($){
  // invalid email char test regexp
  var INVALIDEMAILRE = /[^\u9fa5_a-zA-Z0-9]/;
  // is support oninput event
  var hasInputEvent = 'oninput' in document.createElement('input');
  // is ie 9
  var ISIE9 = /MSIE 9.0/i.test(window.navigator.appVersion || window.navigator.userAgent);

  /**
   * is a number
   * @param value
   * @returns {boolean}
   */
  function isNumber(value){
    return typeof value === 'number' && isFinite(value);
  }

  /**
   * create popup tip
   * @param input
   * @param config
   * @returns {*}
   */
  function createTip(input, config){
    var tip = null;

    // only create tip and binding event once
    if (!input.data('data-mailtip')) {
      var wrap = input.parent();

      // set parent node position
      !/absolute|relative/i.test(wrap.css('position')) && wrap.css('position', 'relative');
      // off input autocomplete
      input.attr('autocomplete', 'off');

      var offset = input.offset();
      var wrapOffset = wrap.offset();

      tip = $('<ul class="mailtip" style="display: none; float: none; '
        + 'position:absolute; margin: 0; padding: 0; z-index: '
        + config.zIndex + '"></ul>');

      // insert tip after input
      input.after(tip);

      // set tip style
      tip.css({
        top: offset.top - wrapOffset.top + input.outerHeight() + config.offsetTop,
        left: offset.left - wrapOffset.left + config.offsetLeft,
        width: config.width === 'input' ? input.outerWidth() - tip.outerWidth() + tip.width() : config.width
      });

      // when width is auto, set min width equal input width
      if (config.width === 'auto') {
        tip.css('min-width', input.outerWidth() - tip.outerWidth() + tip.width());
      }

      // binding event
      tip.on('mouseenter mouseleave click', 'li', function (e){
        var selected = $(this);

        switch (e.type) {
          case 'mouseenter':
            selected.addClass('hover');
            break;
          case 'click':
            var mail = selected.attr('title');

            input.val(mail).focus();
            config.onselected.call(input[0], mail);
            break;
          case 'mouseleave':
            selected.removeClass('hover');
            break;
          default:
            break;
        }
      });

      // when on click if the target element not input, hide tip
      $(document).on('click', function (e){
        if (e.target === input[0]) return;

        tip.hide();
      });

      input.data('data-mailtip', tip);
    }

    return tip || input.data('data-mailtip');
  }

  /**
   * create mail list item
   * @param value
   * @param mails
   * @returns {*}
   */
  function createItems(value, mails){
    var mail;
    var domain;
    var items = '';
    var atIndex = value.indexOf('@');
    var hasAt = atIndex !== -1;

    if (hasAt) {
      domain = value.substring(atIndex + 1);
      value = value.substring(0, atIndex);
    }

    for (var i = 0, len = mails.length; i < len; i++) {
      mail = mails[i];

      if (hasAt && mail.indexOf(domain) !== 0) continue;

      items += '<li title="' + value + '@' + mail
        + '" style="margin: 0; padding: 0; float: none;"><p>'
        + value + '@' + mail + '</p></li>';
    }

    // active first item
    return items.replace('<li', '<li class="active"');
  }

  /**
   * change list active state
   * @param tip
   * @param up
   */
  function changeActive(tip, up){
    var itemActive = tip.find('li.active');

    if (up) {
      var itemPrev = itemActive.prev();

      itemPrev = itemPrev.length ? itemPrev : tip.find('li:last');
      itemActive.removeClass('active');
      itemPrev.addClass('active');
    } else {
      var itemNext = itemActive.next();

      itemNext = itemNext.length ? itemNext : tip.find('li:first');
      itemActive.removeClass('active');
      itemNext.addClass('active');
    }
  }

  /**
   * toggle tip
   * @param tip
   * @param value
   * @param mails
   */
  function toggleTip(tip, value, mails){
    var atIndex = value.indexOf('@');
    var newValue = value + '@'

    // if user enter @then only show the email ids hints

    if(value.indexOf('@') != -1){

    // if input text is empty or has invalid char or begin with @ or more than two @, hide tip
        if (!value
          || atIndex === 0
          || atIndex !== value.lastIndexOf('@')
          ) {
          tip.hide();
        } else {
          var items = createItems(value, mails);

          // if has match mails show tip
          if (items) {
            tip.html(items).show();
          } else {
            tip.hide();
          }
        }
    }else{
        tip.hide();
    }
  }

  /**
   * exports
   * @param config
   * @returns {*}
   */
  $.fn.mailtip = function (config){
    var defaults = {
      mails: [
        'gmail.com', 'rediffmail.com',       
        'hotmail.com', 'yahoo.com', 'yahoo.co.in'
      ],
      onselected: $.noop,
      width: 'auto',
      offsetTop: -1,
      offsetLeft: 0,
      zIndex: 10
    };

    config = $.extend({}, defaults, config);
    config.zIndex = isNumber(config.zIndex) ? config.zIndex : defaults.zIndex;
    config.offsetTop = isNumber(config.offsetTop) ? config.offsetTop : defaults.offsetTop;
    config.offsetLeft = isNumber(config.offsetLeft) ? config.offsetLeft : defaults.offsetLeft;
    config.onselected = $.isFunction(config.onselected) ? config.onselected : defaults.onselected;
    config.width = config.width === 'input' || isNumber(config.width) ? config.width : defaults.width;

    return this.each(function (){
      // input
      var input = $(this);
      // tip
      var tip = createTip(input, config);

      // binding key down event
      input.on('keydown', function (e){
        // if tip is visible do nothing
        if (tip.css('display') === 'none') return;

        switch (e.keyCode) {
          // backspace
          case 8:
            // shit! ie9 input event has a bug, backspace do not trigger input event
            if (ISIE9) {
              input.trigger('input');
            }
            break;
          // tab
          case 9:
            tip.hide();
            break;
          // up
          case 38:
            e.preventDefault();
            changeActive(tip, true);
            break;
          // down
          case 40:
            e.preventDefault();
            changeActive(tip);
            break;
          // enter
          case 13:
            e.preventDefault();

            var mail = tip.find('li.active').attr('title');

            input.val(mail).focus();
            tip.hide();
            config.onselected.call(this, mail);
            break;
          default:
            break;
        }
      });

      // binding input or propertychange event
      if (hasInputEvent) {
        input.on('input', function (){
          toggleTip(tip, this.value, config.mails);
        });
      } else {
        input.on('propertychange', function (e){
          if (e.originalEvent.propertyName === 'value') {
            toggleTip(tip, this.value, config.mails);
          }
        });
      }

      // shit! ie9 input event has a bug, backspace do not trigger input event
      if (ISIE9) {
        input.on('keyup', function (e){
          if (e.keyCode === 8) {
            toggleTip(tip, this.value, config.mails);
          }
        });
      }
    });
  };
}(jQuery));

