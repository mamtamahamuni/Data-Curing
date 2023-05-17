var aaApp = angular.module("activeAssure", []);

aaApp.controller("activeAssure", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location' , '$window' ,'$routeParams'  , function($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window , $routeParams ) {
    var aA = this;
    var aS = appService;
    aA.newSI = '';
    aA.sumInsuredIndex = 12;
    aA.hideSubmitButton = true;
    $rootScope.memberedArray = [];
    aA.stProduct = true;
    aA.productType = "diamond";
    aA.superTopUpPlan = false;
    aA.showextraSumInsuredTag = false;
    aA.superTopUpShow = true;
    aA.productSelctedInCross = 'DI'

    aA.showARUForActivAssure = false;
    aA.planName = "diamond";
    aA.RPEP = false;

    /* To fetch sum insured data */

        aS.getData("assets/data/sum-insured.json","",false,{
            headers:{
                'Content-Type': 'application/json'
            }
        })
            .then(function(data){
                if(data.ResponseCode == 1){
                    aA.SumInsuredList = data.ResponseData;
                }else{
                    
                }
            },function(err){

            })

    /* End of fetching sum insured */


    /* To fetch Quote details */

        function fetchQuoteDetails(){
            var reqData = $rootScope.encrypt({
                "ReferenceNumber": sessionStorage.getItem('rid')
            });  
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetQuoteDetails", {
                "_data": reqData
                }, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function(data) {
                        var data = JSON.parse($rootScope.decrypt(data._resp))
                        aS.triggerSokrati(); /* Triggering Sokrati */
                        if(data.ResponseCode == 1){
                            aA.diamondQuoteDetails = data.ResponseData;
                            $rootScope.leminiskObj =  data.ResponseData
            
                            $rootScope.lemniskCodeExcute();
                            aA.PremiumDetail = aA.diamondQuoteDetails.PremiumDetail;
                            if(aA.diamondQuoteDetails.Source == "DNC_deutschebank" ){
                                aA.RPEP = true;
                            }
                            else if( aA.diamondQuoteDetails.Source != "DNC_deutschebank" && aA.diamondQuoteDetails.DiamondQuote.CoverRPEP == 'Y'){
                                aA.diamondQuoteDetails.DiamondQuote.CoverRPEP = 'N';
                            }
                            if(aA.diamondQuoteDetails.STQuote ){


                                if(aA.diamondQuoteDetails.STQuote.PolicyType == 'MI'){
                                    for(var i = 0 ; i < aA.diamondQuoteDetails.STQuote.MemberDetails.length ; i++){
                                        aA.diamondQuoteDetails.STQuote.SumInsured = aA.diamondQuoteDetails.STQuote.MemberDetails[i].SumInsured;
                                        aA.diamondQuoteDetails.STQuote.Deductible = aA.diamondQuoteDetails.STQuote.MemberDetails[i].Deductible;

                                    }
                                }


                                 aA.updateSumInsuredDeductable(aA.diamondQuoteDetails.STQuote.SumInsured , aA.diamondQuoteDetails.STQuote.Deductible ,aA.diamondQuoteDetails.DiamondQuote.SI ,aA.diamondQuoteDetails.STQuote.PlanName)

                                
                            }
                            else{
                                aA.stProduct = false;
                            }
                            if(aA.diamondQuoteDetails.DiamondQuote.SI == '500000'){
                                aA.showARUForActivAssure = true;
                            }
                            aA.fetchInsuredMembers()
                            aA.calculatePremium();
                        }else{
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Error",
                                "modalBodyText": "Some error ocurred.",
                                "showCancelBtn": false,
                                "gtagPostiveFunction" : "click-button, diamond-quote , service-fails[GetQuoteDetails]",
                                "gtagCrossFunction" : "click-button,  diamond-quote ,service-fails[GetQuoteDetails]",
                                "gtagNegativeFunction" : "click-button, diamond-quote , service-fails[GetQuoteDetails]",
                                "modalSuccessText" : "Ok",
                                "showAlertModal": true
                            }
                        }
                    },function(err){

                    })
        }


        if(!angular.isUndefined($routeParams.refcode) &&  !angular.isUndefined($routeParams.userToken) ){
            sessionStorage.setItem('rid' , $routeParams.refcode  )
            sessionStorage.setItem('ut' , $routeParams.userToken  )
            fetchQuoteDetails();
        }
        else{
            fetchQuoteDetails();
        }

        

    /* End of fetching quote details */


    /* To trigger pixel Code */

        var pixelCode = "<img src='http://www.intellectads.co.in/track/conversion.asp?cid=1150&conversionType=1&key="+sessionStorage.getItem('leadId')+"&opt1=&opt2=&opt3=' height='1' width='1' />";
        pixelCode += "<img src='//ad.admitad.com/r?campaign_code=f01707dad6&action_code=1&payment_type=lead&response_type=img&uid=&tariff_code=1&order_id="+sessionStorage.getItem('leadId')+"&position_id=&currency_code=&position_count=&price=&quantity=&product_id=' width='1' height='1' alt=''>";
        pixelCode += "<iframe src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub="+sessionStorage.getItem('leadId')+"' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
        pixelCode += "<img src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub="+sessionStorage.getItem('leadId')+"' width='1' height='1' />";
        pixelCode += "<iframe src='https://adclickzone.go2cloud.org/aff_l?offer_id=496&adv_sub="+sessionStorage.getItem('leadId')+"' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
        pixelCode += "<iframe src='https://apoxymedia.net/p.ashx?o=74&e=8&t="+sessionStorage.getItem('leadId')+"' height='1' width='1' frameborder='0'></iframe>";
        pixelCode += "<img src='https://opicle.go2cloud.org/aff_l?offer_id=5694&adv_sub="+sessionStorage.getItem('leadId')+"' width='1' height='1' />"; 
        $(".cross-sell-bg").append(pixelCode);

    /* End of triggering pixel code */


    /* To calculate premium */

        aA.calculatePremium = function (){
            delete aA.PremiumDetail;

            if(aA.stProduct){

                if(aA.diamondQuoteDetails.STQuote.MemberDetails.length > 1)
                {
                       aA.diamondQuoteDetails.STQuote.PolicyType = "FF"
                }
                else{
                    aA.diamondQuoteDetails.STQuote.PolicyType = "MI"

                }

                var diPreminumObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings":true,
                "Diamond": {
                    "SI": aA.diamondQuoteDetails.DiamondQuote.SI,
                    "CoverARU": aA.diamondQuoteDetails.DiamondQuote.CoverARU,
                    "CoverSNCB": aA.diamondQuoteDetails.DiamondQuote.CoverSNCB,
                    "CoverURSI": aA.diamondQuoteDetails.DiamondQuote.CoverURSI,
                    "CoverRPEP": aA.diamondQuoteDetails.DiamondQuote.CoverRPEP
                },
                 "ST": aA.diamondQuoteDetails.STQuote
           }

            }
            else{
                var diPreminumObj = {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "Savings":true,
                    "Diamond": {
                        "SI": aA.diamondQuoteDetails.DiamondQuote.SI,
                        "CoverARU": aA.diamondQuoteDetails.DiamondQuote.CoverARU,
                        "CoverSNCB": aA.diamondQuoteDetails.DiamondQuote.CoverSNCB,
                        "CoverURSI": aA.diamondQuoteDetails.DiamondQuote.CoverURSI,
                        "CoverRPEP": aA.diamondQuoteDetails.DiamondQuote.CoverRPEP
                    }

                }
            }
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", diPreminumObj , false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    if(data.ResponseCode == 1){
                        aA.PremiumDetail = data.ResponseData;
                        aA.PremiumDetail.TotalPremium = 0;
                        
                        angular.forEach(aA.PremiumDetail.ProductPremium ,function(v, i){
                            if(parseInt(v.Premium) <= 0 ){
                                aA.hideSubmitButton = false;
                            }
                        })
                        aA.savingForTwoYears = data.ResponseData.TenureSavings.TotalTwoYearSaving; 
                        aA.savingForThreeYears = data.ResponseData.TenureSavings.TotalThreeYearSaving;   
                        if(!angular.isUndefined(aA.CSPremium)){
                            aA.fetchPremiumsSecondary();
                        }
                        for(var i = 0;i<aA.PremiumDetail.ProductPremium.length;i++){
                            aA.PremiumDetail.TotalPremium = parseInt(aA.PremiumDetail.TotalPremium) + parseInt(aA.PremiumDetail.ProductPremium[i].Premium);
                            if(aA.PremiumDetail.ProductPremium[i].ProductCode == 'PA'){
                                aA.paActPremium = aA.PremiumDetail.ProductPremium[i].Premium;
                            }else if(aA.PremiumDetail.ProductPremium[i].ProductCode == 'CI'){
                                aA.ciActPremium = aA.PremiumDetail.ProductPremium[i].Premium;
                            }else if(aA.PremiumDetail.ProductPremium[i].ProductCode == 'CS'){
                                aA.csActPremium = aA.PremiumDetail.ProductPremium[i].Premium;
                            }
                        }
                         incrementedSumInsured( aA.diamondQuoteDetails.DiamondQuote.SI , aA.sumInsuredIndex)
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": "Some error ocurred.",
                            "gtagPostiveFunction" : "click-button, diamond-quote , service-fails[GetPremium]",
                            "gtagCrossFunction" : "click-button,  diamond-quote ,service-fails[GetPremium]",
                            "gtagNegativeFunction" : "click-button, diamond-quote , service-fails[GetPremium]",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                },function(err){

                });
        }

    /* End of calculating premium */
    

    /* Calculate premium based on action on UI */

        aA.calculateDIPremium = function(SI , val){
            aA.diamondQuoteDetails.DiamondQuote.SI = SI;
            


           /* if(SI == 500000 = 'Y'                aA.superTopUpPlan = true;
            }
            else{
                aA.superTopUpPlan = false;   
            }*/

            if(SI == 500000){
                aA.showARUForActivAssure = true;
            }else{
                aA.showARUForActivAssure = false;
            }

            if(SI == 400000 ){
                aA.diamondQuoteDetails.DiamondQuote.CoverSNCB = 'Y'
            }

            if(SI != 500000 && (aA.diamondQuoteDetails.DiamondQuote.CoverARU == 'Y')) {
                
                aA.diamondQuoteDetails.DiamondQuote.CoverARU = 'N';
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "Any room upgrade is only available on Sum Insured of 5 Lakh ",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true
                }
            }
            if(aA.stProduct){
                aA.updateSumInsuredDeductable(aA.diamondQuoteDetails.STQuote.SumInsured , aA.diamondQuoteDetails.STQuote.Deductible ,aA.diamondQuoteDetails.DiamondQuote.SI , "Plan B")
            }
            else{
                aA.calculatePremium();
            }
            

            aA.sumInsuredIndex = val;
           

        }

    /* End of calculate premium based on action on UI */

    function incrementedSumInsured( SI , val){
        aA.newSI = '';

        for(var i = 0 ; i < aA.SumInsuredList.length ; i ++){
            if(aA.SumInsuredList[i].DIAMOND &&  ( parseInt(aA.SumInsuredList[i].amount) > parseInt(SI) )){
                aA.newSI = aA.SumInsuredList[i].amount
                break;
            }
        }

        if(aA.newSI == ''){
            aA.showextraSumInsuredTag = false;
        }
        else{
            aA.showextraSumInsuredTag =true;
            var diPreminumObj = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "Savings":true,
                "Diamond": {
                    "SI": aA.newSI,
                    "CoverARU": aA.diamondQuoteDetails.DiamondQuote.CoverARU,
                    "CoverSNCB": aA.diamondQuoteDetails.DiamondQuote.CoverSNCB,
                    "CoverURSI": aA.diamondQuoteDetails.DiamondQuote.CoverURSI,
                    "CoverRPEP": aA.diamondQuoteDetails.DiamondQuote.CoverRPEP
                }
           }
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", diPreminumObj , false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    if(data.ResponseCode == 1){

                        aA.newPreminum = data.ResponseData.TotalPremium;


                    }
                })

              }  

    } 

    /* add Update delete Member in Super top up array */


        aA.addUpdateDeleteStMember = function( op , memberDetails, index){
                    aA.memberArraySt = [];
                    if(op == "AddMember" && memberDetails.Age < 65 && aA.stProduct){
                        memberDetails.ProductCode = "ST"; 
                        memberDetails.Deductible = aA.diamondQuoteDetails.STQuote.Deductible 
                        memberDetails.SumInsured = aA.diamondQuoteDetails.STQuote.SumInsured 
                    

                            appService.postData(ABHI_CONFIG.apiUrl + "GEN/" + op, {
                                    "ReferenceNumber": sessionStorage.getItem('rid'),
                                    "InsuredDetail": memberDetails
                                }, true, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(function(data) {
                                            delete memberDetails.ProductCode
                                      
                                            aA.diamondQuoteDetails.STQuote.MemberDetails.push(memberDetails)    

                                            aA.calculatePremium();
                                        
                                       
                                })
                            }
                        else if( (op == "AddMember" || op == "UpdateMember") && memberDetails.Age < 65 && !aA.stProduct ){
                            if(memberDetails.RelationType == 'S' || memberDetails.RelationType == 'SPO'){
                                

                                for(var i = 0 ; i < aA.membersDetails.length ;  i++){
                                        if(aA.membersDetails[i].RelationType != 'PROPOSER' && aA.membersDetails[i].Age <= 45){

                                            aA.memberArraySt.push(aA.membersDetails[i].RelationType)
                                        }
                                    }

                                    aA.stProduct = true;



                                           
                                                aA.buySecondaryProductSt('ST' , aA.memberArraySt , 'Di' , '')
                                            
                                            
                            }
                        }    
                         else if(op == "UpdateMember"){
                                    
                                    for(var i = 0 ; i < aA.diamondQuoteDetails.STQuote.MemberDetails.length ; i++ ){
                                        if(memberDetails.RelationType == aA.diamondQuoteDetails.STQuote.MemberDetails[i].RelationType){
                                            aA.diamondQuoteDetails.STQuote.MemberDetails[i].Age = memberDetails.Age

                                        }
                                    }    
                                         aA.calculatePremium();
                                   
                                } 
                                else{
                                    for(var i = 0 ; i < aA.diamondQuoteDetails.STQuote.MemberDetails.length ; i++ ){
                                        if(memberDetails.RelationType == aA.diamondQuoteDetails.STQuote.MemberDetails[i].RelationType){
                                            aA.diamondQuoteDetails.STQuote.MemberDetails.splice(i , 1);

                                        }
                                    }  
                                    // aA.calculatePremium();
                                    fetchQuoteDetails();
                                }

            

        }

    /* add Update delete Member in Super top up array */    


    /* super Top up Sum insured and deductable calculation */


        aA.updateSumInsuredDeductable = function(siOfSuperTopUp , deductableOfSuperTopUp ,siOfDiamond ,stPlanName){
         

            if(stPlanName == 'Plan A'){
                aA.diamondQuoteDetails.STQuote.PlanName = stPlanName; 
                aA.diamondQuoteDetails.STQuote.SumInsured = siOfSuperTopUp;
                aA.diamondQuoteDetails.STQuote.Deductible = deductableOfSuperTopUp
                aA.diamondQuoteDetails.DiamondQuote.SI = siOfDiamond
                if(siOfSuperTopUp == "9500000"){
                        aA.planAValue = '1'
                }
                else if(siOfSuperTopUp == "9000000"){
                        aA.planAValue = '2'
                }
                else{
                    aA.planAValue = '3'
                }
            }
            else{
                    if(siOfSuperTopUp == '4000000' || siOfSuperTopUp == '9000000'){
                        deductableOfSuperTopUp = '1000000'
                        aA.diamondQuoteDetails.STQuote.SumInsured = siOfSuperTopUp;
                        aA.diamondQuoteDetails.STQuote.Deductible = deductableOfSuperTopUp
                         aA.diamondQuoteDetails.DiamondQuote.SI = '1000000'
                    }
                    if(siOfSuperTopUp == '9500000' ){
                        aA.diamondQuoteDetails.STQuote.SumInsured = siOfSuperTopUp;
                        aA.diamondQuoteDetails.STQuote.Deductible = deductableOfSuperTopUp
                        aA.diamondQuoteDetails.DiamondQuote.SI = '500000'
                    }
                    if(siOfDiamond == '500000' && siOfSuperTopUp == ""){
                        aA.diamondQuoteDetails.STQuote.SumInsured = "9500000";
                        aA.diamondQuoteDetails.STQuote.Deductible = '500000'
                        aA.diamondQuoteDetails.DiamondQuote.SI = siOfDiamond
                    }
                    if(siOfDiamond == '1000000'  && siOfSuperTopUp == ""){
                        aA.diamondQuoteDetails.STQuote.SumInsured = "9000000";
                        aA.diamondQuoteDetails.STQuote.Deductible = '1000000'
                        aA.diamondQuoteDetails.DiamondQuote.SI = siOfDiamond
                    }

                    
                     aA.planAValue = '0'
                
            }

           

            for(var i = 0 ; i <  aA.diamondQuoteDetails.STQuote.MemberDetails.length ; i++){
                aA.diamondQuoteDetails.STQuote.MemberDetails[i].SumInsured = aA.diamondQuoteDetails.STQuote.SumInsured;
                aA.diamondQuoteDetails.STQuote.MemberDetails[i].Deductible = aA.diamondQuoteDetails.STQuote.Deductible;

            }
            aA.calculatePremium();



           
            }
        
        /* super Top up Sum insured and deductable calculation ends*/


    /* To change tenure */

        aA.changeTenure = function(){
            $rootScope.callGtag('click-radio', 'quote' ,'diamond-quote_tenure-['+aA.diamondQuoteDetails.DiamondQuote.Tenure+']');
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateTenure", {
                "Tenure": aA.diamondQuoteDetails.DiamondQuote.Tenure,
                "ReferenceNumber": sessionStorage.getItem('rid')
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if (data.ResponseCode == 1 && aA.stProduct) {
                    aA.diamondQuoteDetails.STQuote.PolicyTenure =  aA.diamondQuoteDetails.DiamondQuote.Tenure
                    aA.calculatePremium();
                } else if (data.ResponseCode == 1 ) {
                    aA.calculatePremium();
                }else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": data.ResponseMessage,
                        "gtagPostiveFunction" : "click-button, diamond-quote , service-fails[UpdateTenure]",
                        "gtagCrossFunction" : "click-button,  diamond-quote ,service-fails[UpdateTenure]",
                        "gtagNegativeFunction" : "click-button, diamond-quote , service-fails[UpdateTenure]",
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function(err) {
            });
        }

    /* End of changing tenure */


    /* To save diamond quote */

        aA.submitDiamondQuote = function(event){
            $rootScope.quoteAmount =  aA.PremiumDetail.TotalPremium 
            for(var i = 0 ; i < aA.membersDetails.length ; i++){
                if(aA.membersDetails[i].RelationType != "PROPOSER" ){
                    $rootScope.memberedArray.push({
                        'RelationType' : aA.membersDetails[i].RelationType,
                        'Age' : aA.membersDetails[i].Age
                    })
                }
            }
             var lemeiskData   = { "DIUpdateQuote": {
                    "SI": aA.diamondQuoteDetails.DiamondQuote.SI,
                    "preminumObj": aA.PremiumDetail.TotalPremium,
                    "CoverARU": aA.diamondQuoteDetails.DiamondQuote.CoverARU,
                    "CoverSNCB": aA.diamondQuoteDetails.DiamondQuote.CoverSNCB,
                    "CoverURSI": aA.diamondQuoteDetails.DiamondQuote.CoverURSI,
                    "CoverRPEP": aA.diamondQuoteDetails.DiamondQuote.CoverRPEP,
                     "memberArray": aA.membersDetails,
                },
                 "ReferenceNumber": sessionStorage.getItem('rid') };
            
            $rootScope.leminiskObj =  lemeiskData
            
            $rootScope.lemniskCodeExcute();
            event.target.disabled = true;
            event.target.innerText = "Proceeding...";
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", {
                "DIUpdateQuote": {
                    "SI": aA.diamondQuoteDetails.DiamondQuote.SI,
                    "CoverARU": aA.diamondQuoteDetails.DiamondQuote.CoverARU,
                    "CoverSNCB": aA.diamondQuoteDetails.DiamondQuote.CoverSNCB,
                    "CoverURSI": aA.diamondQuoteDetails.DiamondQuote.CoverURSI,
                    "CoverRPEP": aA.diamondQuoteDetails.DiamondQuote.CoverRPEP
                },
                "STUpdateQuote": aA.diamondQuoteDetails.STQuote,
                "ReferenceNumber": sessionStorage.getItem('rid')
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                event.target.disabled = false;
                event.target.innerText = "Proceed";
                if (response.ResponseCode == 1) {
                    if(aA.crossSell){
                        if(aA.CI == 'Y'){
                            aA.productSelctedInCross = aA.productSelctedInCross+'-CI'
                        }if(aA.PA == 'Y'){
                             aA.productSelctedInCross = aA.productSelctedInCross+'-PA'
                        }if(aA.CS == 'Y'){
                             aA.productSelctedInCross = aA.productSelctedInCross+'-CS'
                        }
                        sessionStorage.setItem('productSelctedInCross' ,  aA.productSelctedInCross)

                        $location.url('cross-sell-proposer-details?products='+ aA.productSelctedInCross);
                    }else{
                        $location.url('diamond-proposer-details');
                    }
                }else{
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": "Some error occurred!",
                        "gtagPostiveFunction" : "click-button, diamond-quote , service-fails[UpdateQuoteDetails]",
                        "gtagCrossFunction" : "click-button,  diamond-quote ,service-fails[UpdateQuoteDetails]",
                        "gtagNegativeFunction" : "click-button, diamond-quote , service-fails[UpdateQuoteDetails]",
                        "showCancelBtn": false,
                        "modalSuccessText" : "Ok",
                        "showAlertModal": true,
                    }
                }
            }, function(err) {
                event.target.disabled = false;
                event.target.innerText = "Proceed";
            }); 
        }

    /* End of saving diamond quote */
    
}])