var acApp = angular.module("activCareQuoteApp", []);

acApp.controller("activCareQuoteApp", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$q', function($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $q) {
    
    /* Data Inilization */

        var cK = this;
        var aS = appService;
        cK.plantp = "fal"
        cK.planName = "corona-kavach"
        cK.validForm = true;
        cK.productSelctedInCross = 'AC'
        var planNameArray = ["Standard", "Classic", "Premier"]
        var goingOn = false;
        cK.showCrossSell = false;
        var insuredMemberDetails;
        cK.roomUpgradeText = "";
        cK.initSlider = false;
        cK.sumInusred = ""
        cK.selectedMember = [];
        cK.tempUNSelectedMembersForTwo = []
        cK.tempUNSelectedMembers = [];

    /* End of data inilization */


    function loadOwlCarousel(){
            cK.initSlider = true;
            $timeout(function(){
                $(".cK-carousel").owlCarousel({
                    items: 2,
                    navigation: true,
                    navigationText: ["",""],
                });
            },300);
        }

    $(document).ready(function() {

        $('.show-answer').on('click', function() {
            if (cK.selectedMember.length == 1) {
                $rootScope.alertConfiguration('E', "Family floater is only applicable for two members ");
                $rootScope.$apply();
                return false;
            }
            cK.coronaKavachQuoteDetails.PolicyType = "FF"
            for (var i = 0; i < cK.selectedMember.length; i++) {
                if (cK.selectedMember[i].BaseCoverFlag == "Y") {
                    cK.oCBProductLevel('Y', 'BaseCoverFlag')
                }
                if (cK.selectedMember[i].QNH == "Y") {
                    cK.oCBProductLevel('Y', 'QNH')
                }
                if (cK.selectedMember[i].LSE == "Y") {
                    cK.oCBProductLevel('Y', 'LSE')
                }
                if (cK.selectedMember[i].PME == "Y") {
                    cK.oCBProductLevel('Y', 'PME')
                }
                if (cK.selectedMember[i].AHC == "Y") {
                    cK.oCBProductLevel('Y', 'AHC')
                }
                if (cK.selectedMember[i].IsHealthCareWorker == "Y") {
                    cK.oCBProductLevel('Y', 'IsHealthCareWorker')
                }
            }
            loadOwlCarousel();
            cK.updatePreminum();
        });

        $('.hide-answer').on('click', function() {
            cK.coronaKavachQuoteDetails.PolicyType = "MI"
            
                for (var i = 0; i < cK.selectedMember.length; i++) {
                    if(cK.selectedMember[i].RelationWithProposer == 'KID' && cK.selectedMember[i].Age < 5){
                        $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Error",
                                "modalBodyText": "Incase Of Multi-Individual age of Kid should be 5 or above",
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
                    
            
            
            
            for (var i = 0; i < cK.selectedMember.length; i++ ) {
                if (cK.selectedMember[i].QNH == "Y") {
                    cK.QNH = 'Y';
                }
                if (cK.selectedMember[i].LSE == "Y") {
                    cK.LSE = 'Y';
                }
                if (cK.selectedMember[i].PME == "Y") {
                    cK.PME = 'Y';
                }
                if (cK.selectedMember[i].AHC == "Y") {
                    cK.AHC = 'Y';
                }
                if (cK.selectedMember[i].BaseCoverFlag == "Y") {
                    cK.BaseCoverFlag = 'Y';
                }
                if (cK.selectedMember[i].IsHealthCareWorker == "Y") {
                    cK.IsHealthCareWorker = 'Y';
                    cK.HealthCareWorkerDetail = cK.healthCareWorkerDetails;
                }
            }
                loadOwlCarousel();
            cK.updatePreminum()
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
                cK.intitalACMemberList = data.ResponseData;
                cK.activeCareFamilyContruct = data.ResponseData;
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
                        cK.coronaKavachQuoteDetails = data.ResponseData.CKQuote;
                        $rootScope.leminiskObj =  data.ResponseData;
                        $rootScope.lemniskCodeExcute();
                        cK.activCarePreminumObj = data.ResponseData.PremiumDetail;
                        cK.selectedMember = cK.coronaKavachQuoteDetails.MemberDetails;
                        var planNameInt = parseInt(cK.coronaKavachQuoteDetails.PlanType);

                        cK.showCoronaKavachTenure = (cK.coronaKavachQuoteDetails.PolicyTenure == '1')?'3.5 month':(cK.coronaKavachQuoteDetails.PolicyTenure == '2')?'6.5 month':'9.5 month'
                        /**/
                        
                        cK.planNameVal = planNameArray[planNameInt - 1];
                        if(cK.coronaKavachQuoteDetails.PolicyType == "FF") {
                            $timeout(function() {
                                angular.element('.show-answer').triggerHandler('click');
                            }, 0);
                            cK.sumInusred = cK.coronaKavachQuoteDetails.MemberDetails[0].SumInsured;
                            for (var j = 0; j < cK.coronaKavachQuoteDetails.MemberDetails.length; j++) {
                                cK.coronaKavachQuoteDetails.MemberDetails[j]
                                if (cK.coronaKavachQuoteDetails.MemberDetails[j].SumInsured > cK.sumInusred) {
                                    cK.sumInusred = cK.coronaKavachQuoteDetails.MemberDetails[j].SumInsured
                                }
                            }
                        }else {
                            $timeout(function() {
                                angular.element('.hide-answer').triggerHandler('click');
                            }, 0);
                            cK.sumInusred = cK.coronaKavachQuoteDetails.MemberDetails[0].SumInsured;
                            for (var j = 0; j < cK.coronaKavachQuoteDetails.MemberDetails.length; j++) {
                                if (cK.coronaKavachQuoteDetails.MemberDetails[j].SumInsured > cK.sumInusred) {
                                    cK.sumInusred = cK.coronaKavachQuoteDetails.MemberDetails[j].SumInsured
                                }
                            }
                        }
                        cK.healthCareWorkerDetails = cK.coronaKavachQuoteDetails.MemberDetails[0].HealthCareWorkerDetail;
                        loadOwlCarousel();
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
                    cK.sumAmounts = data.ResponseData;
                } else {

                }
            }, function(err) {

            })


    /* End of fetching sum insured data */




    
    /* updated the Sum insured value */

        cK.updateSumInsured = function(param, membersObj) {
            if (membersObj != "") {
                for (var i = 0; i < cK.selectedMember.length; i++) {
                    if (cK.selectedMember[i].RelationType == membersObj.RelationType) {
                        cK.selectedMember[i].SumInsured = param;
                    }
                }
            } else {
                cK.sumInusred = param
                for (var i = 0; i < cK.selectedMember.length; i++) {
                    cK.selectedMember[i].SumInsured = param;
                }
            }
            cK.updatePreminum()
        }

    /* updated the Sum insured value Ends */


    /* calculate preminum */

        cK.calculatePremium = function() {
            cK.updatePreminum();
            
        }

    /* calculate preminum Endsd*/



    /* Update soft details data */

        cK.updateSoftDetails = function(op, insuredDetail, index){

            if(op == 'AddMember' ){
                cK.initSlider = false;
                if(cK.coronaKavachQuoteDetails.PolicyType == "FF"){
                    insuredDetail.SumInsured = cK.sumInusred;
                }
                else{
                    insuredDetail.SumInsured = cK.selectedMember[0].SumInsured
                }
                insuredDetail.IsHealthCareWorker = cK.IsHealthCareWorker;
                insuredDetail.HealthCareWorkerDetail = cK.healthCareWorkerDetails;
                insuredDetail.BaseCoverFlag = cK.BaseCoverFlag;

                cK.selectedMember.push(insuredDetail)
                cK.calculatePremium ();
                $timeout(function(){
                    loadOwlCarousel();
                },300);
            }
            if(op == 'UpdateMember' || (op == 'DeleteMember' && insuredDetail.RelationWithProposer != 'KID') ){
                for(var i = 0 ; i < cK.selectedMember.length ; i++){
                    if(op == 'UpdateMember' && insuredDetail.RelationType == cK.selectedMember[i].RelationType){
                           cK.selectedMember[i].Age =  insuredDetail.Age
                    }
                    else if(op == 'DeleteMember' && insuredDetail.RelationType == cK.selectedMember[i].RelationType){
                        cK.selectedMember.splice(i ,1)
                        cK.initSlider = false;
                    }
                }
                if(cK.selectedMember.length == 1){
                    cK.coronaKavachQuoteDetails.PolicyType = "MI"
                }
                cK.calculatePremium ();
                $timeout(function(){
                    loadOwlCarousel();
                },300);
            }
            if (op == 'DeleteMember' && insuredDetail.RelationWithProposer == 'KID'){
                cK.initSlider = false;
                fetchQuoteDetails(); 
            }
            cK.fetchInsuredMembers();
            cK.calculatePremium ();
        }

    /* End of updating soft details data */



    /* To delete particular member */

        cK.cKUpdateDeleteMember = function(member,ind , operation){
            $rootScope.callGtag('click-icon-x','quote','cK-quote_plan_delete-member');
            if(cK.selectedMember.length == 1 && operation == 'deleteMember'){
                $rootScope.alertConfiguration('E',"You cannot delete this member.", "delete_member_alert");
                return false;
            }
            for(var i = 0; i < cK.selectedMember.length;i++){
                if(member.RelationType == cK.selectedMember[i].RelationType){
                    cK.selectedMember[i].ProductCode = 'CK';
                    if(operation == 'updateMember'){
                        cK.previousAge = cK.membersDetails[i+1].Age
                        cK.membersDetails[i+1].Age = cK.selectedMember[i].Age
                        cK.addUpdateMember(member,ind , cK.previousAge)
                    }else{
                        cK.deleteMember(cK.selectedMember[i],ind);
                    }
                    
                    break;
                }
            }
        }

    /* End of deleting particular member */

    /* updated the Preminum value */

        cK.updatePreminum = function() {
            /*angular.forEach(cK.selectedMember, function(v, i) {
                if (v.RelationType == "S" || v.RelationType == "SPO" || v.RelationType == "F" || v.RelationType == "M" || v.RelationType == "FIL" || v.RelationType == "MIL") {
                    cK.showCrossSell = true;
                }
            })*/
            /*if (cK.coronaKavachQuoteDetails.PolicyType == "FF") {
                if (cK.selectedMember[0].SumInsured > cK.selectedMember[1].SumInsured) {
                    cK.selectedMember[1].SumInsured = cK.selectedMember[0].SumInsured;
                    cK.sumInusred = cK.selectedMember[1].SumInsured;
                } else if (cK.selectedMember[0].SumInsured < cK.selectedMember[1].SumInsured) {
                    cK.selectedMember[0].SumInsured = cK.selectedMember[1].SumInsured;
                    cK.sumInusred = cK.selectedMember[0].SumInsured;
                }
            }*/
            var acPreminumObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "CK": {
                    
                    "PolicyTenure": cK.coronaKavachQuoteDetails.PolicyTenure,
                    "PolicyType": cK.coronaKavachQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    
                    "MemberDetails": cK.selectedMember
                }
            }

            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", acPreminumObj, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        cK.activCarePreminumObj.TotalPremium = 0
                        cK.activCarePreminumObj.TotalPremium = data.ResponseData.TotalPremium;
                        cK.activCarePreminumObj.ProductPremium = data.ResponseData.ProductPremium
                        cK.PremiumDetail = data.ResponseData
                        //cK.fetchPremiumsSecondary()
                        for (var i = 0; i < cK.selectedMember.length; i++) {
                                if (cK.selectedMember[i].QNH == "N") {
                                    cK.QNH = 'N';
                                }
                                if (cK.selectedMember[i].LSE == "N") {
                                    cK.LSE = 'N';
                                }
                                if (cK.selectedMember[i].PME == "N") {
                                    cK.PME = 'N';
                                }
                                if (cK.selectedMember[i].AHC == "N") {
                                    cK.AHC = 'N';
                                }
                                if (cK.selectedMember[i].BaseCoverFlag == "N") {
                                    cK.BaseCoverFlag = 'N';
                                }
                                if (cK.selectedMember[i].IsHealthCareWorker == "N") {
                                    cK.IsHealthCareWorker = 'N';
                                }
                            }
                        for (var i = 0; i < cK.PremiumDetail.ProductPremium.length; i++) {
                            cK.PremiumDetail.TotalPremium = parseInt(cK.PremiumDetail.TotalPremium) + parseInt(cK.PremiumDetail.ProductPremium[i].Premium);
                            if (cK.PremiumDetail.ProductPremium[i].ProductCode == 'PA') {
                                cK.paActPremium = cK.PremiumDetail.ProductPremium[i].Premium;
                            } else if (cK.PremiumDetail.ProductPremium[i].ProductCode == 'CI') {
                                cK.ciActPremium = cK.PremiumDetail.ProductPremium[i].Premium;
                            } else if (cK.PremiumDetail.ProductPremium[i].ProductCode == 'CS') {
                                cK.csActPremium = cK.PremiumDetail.ProductPremium[i].Premium;
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

        cK.updateTenure = function(tenure) {
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
                        cK.coronaKavachQuoteDetails.PolicyTenure = tenure;

                        cK.showCoronaKavachTenure = (tenure == '1')?'3.5 month':(tenure == '2')?'6.5 month':'9.5 month'
                        
                        cK.updatePreminum();
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

        cK.openAddMemberModel = function() {
            cK.fetchInsuredMembers();
            $('#change-group-member').modal({
                backdrop: 'static',
                keyboard: false
            });
        }

    /* End of opening add member modal */
    

 


    /* Modify Optional Care cover Benefits */

        cK.oCBMemberLevel = function(param, val, coverName) {
            var anyMemberIsPresent = false;
            if (val == 'Y') {
                for (var i = 0; i < cK.selectedMember.length; i++) {
                    if (cK.selectedMember[i].RelationWithProposer == param.RelationWithProposer) {
                        cK.selectedMember[i][coverName] = val
                    }
                }
                cK[coverName] = 'Y'
            } else {
                for (var i = 0; i < cK.selectedMember.length; i++) {
                    if (cK.selectedMember[i].RelationWithProposer == param.RelationWithProposer) {
                        cK.selectedMember[i][coverName] = val
                    }
                }
                angular.forEach(cK.selectedMember, function(v, i) {
                    if (v[coverName] == 'Y')
                        anyMemberIsPresent = true;
                })
                if (anyMemberIsPresent) {
                    cK[coverName] = 'Y'
                } else {
                    cK[coverName] = 'N'
                }
            }
            cK.updatePreminum();
        }

    /* Modify Optional Care cover Benefits Ends*/


    /* Modify Optional care Benefits at Product Level */

        cK.oCBProductLevel = function(param, coverName , $event) {
            /*console.log(event.keyCode)
            if(event.keyCode == 32){
                return false ;
            }*/
            if(coverName == 'IsHealthCareWorker'){

                if (param == 'Y') {
                    for (var i = 0; i < cK.selectedMember.length; i++) {
                        cK.selectedMember[i][coverName] = 'Y'
                        cK.selectedMember[i].HealthCareWorkerDetail = cK.healthCareWorkerDetails
                    }
                    cK[coverName] = 'Y'
                } else {
                    cK.healthCareWorkerDetails = '';
                    for (var i = 0; i < cK.selectedMember.length; i++) {
                        cK.selectedMember[i][coverName] = 'N'
                        cK.selectedMember[i].HealthCareWorkerDetail = ''
                    }
                }
            }
            else{
                if (param == 'Y') {
                    for (var i = 0; i < cK.selectedMember.length; i++) {
                        cK.selectedMember[i][coverName] = 'Y'
                    }
                    cK[coverName] = 'Y'
                } else {
                    for (var i = 0; i < cK.selectedMember.length; i++) {
                        cK.selectedMember[i][coverName] = 'N'
                    }
                }
            }
            
            cK.updatePreminum()
            
        }

    /* Modify Optional care Benefits at Product Level Ends*/


    /* Submit Activ Care Quote */

        cK.submitActivCareQuote = function(event) {
            for(var  i = 0  ; i < cK.selectedMember.length ; i++){
                if(cK.selectedMember[i].Age > 80){
                    $rootScope.alertConfiguration('E', "Age of "+cK.selectedMember[i].RelationWithProposer + " cannot be greater than 80");
                        $rootScope.$apply();
                        return false;
                }
            }

            /*if(cK.coronaKavachQuoteDetails.MemberDetails[0].IsHealthCareWorker == 'Y' && cK.healthCareWorkerDetails == ''){
                $rootScope.alertConfiguration('E', "Please enter the value for the health care worker ");
                        $rootScope.$apply();
                        return false;
            }*/
            event.target.disabled = false;
            event.target.innerText = "Proceed";
            
            var cKSubmitQuoteObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "CKUpdateQuote": {
                    "PolicyType": cK.coronaKavachQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "PolicyType": cK.coronaKavachQuoteDetails.PolicyType,
                   
                    "MemberDetails": cK.selectedMember
                }
            }
            var lemniskObjPass = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings": true,
                "CKUpdateQuote": {
                    "PolicyType": cK.coronaKavachQuoteDetails.PolicyType,
                    "PaymentType": "UPFRONT",
                    "PolicyType": cK.coronaKavachQuoteDetails.PolicyType,
                   
                    "MemberDetails": cK.selectedMember
                }
            }

            var lemeiskData   = lemniskObjPass
            
            $rootScope.leminiskObj =  lemeiskData
            
            $rootScope.lemniskCodeExcute();
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", cKSubmitQuoteObj, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {

                if (response.ResponseCode == 1) {
                    
                        $location.url('corona-kavach-proposer-details');
                    
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