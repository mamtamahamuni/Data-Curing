/*
    
    Reco Controller
    Author: Sunny Khattri
    Date: 18-06-2018

*/

var recoApp = angular.module("recoQuoteApp", []);

recoApp.controller("recoQuoteApp", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$location', '$timeout','productValidationService','$routeParams', '$window' , function($rootScope, appService, ABHI_CONFIG, $filter, $location, $timeout,productValidationService,$routeParams, $window ) {

    /* Data Initilization */
        $rootScope.isMobileLayout=false;
        var rC = this; // Stored the current controller scope
        rC.showSlickSlider = false; // Variable that addresses whether to show slick slider or not
        rC.modalShow = false; // Variable that decides whether to open modal or not.
        rC.planName = "reco"; // Stored planName as reco over here
        var aS = appService; // Instance of appService inside aS
        var pVS = productValidationService; // Instance of productValidationService inside pVS
        var membersCount;
        rC.isMoneyToolFlow = false;
        rC.showMoreFaq = 4;
        var leadCallService = 0;

        if(sessionStorage.getItem("pa-si")){
            sessionStorage.removeItem("pa-si");
        }

    /* End of data initilization */


    /* To call lead insert API */

        function leadInsertCall(data){
            aS.postData(ABHI_CONFIG.apiUrl+"GEN/LeadInsert",{
                "ReferenceNumber": sessionStorage.getItem('rid')
            },false,{
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    if(data.ResponseCode == 1){
                        sessionStorage.setItem('leadId',data.ResponseData.LeadId);
                    }else{
                        if(leadCallService < 3){
                            ++leadCallService;
                            leadInsertCall();
                        }
                    }
                },function(err){
                });
        }

    /* End of calling lead insert API */

   

    /* clcik to call to be intiated after 15 sec of page load */

    var today = new Date().getHours();
        var day = new Date().getDay();
        if ((today >= 10 && today < 19) && day != 0 ) {
           

           // $timeout($rootScope.clickToCallAlone(), 10000);
        }


    /* clcik to call functionality ends */

        /* To buy product */

                function buySecondaryProduct(productCode,memberList){
                    rC.memberArraySt = [];
                    var buySecProduct = false;
                     sessionStorage.setItem('crossSell',true);
                    if(productCode == 'ST'){
                        for(var i = 0 ; i < memberList.length ;  i++){
                            if(memberList[i].RelationType != 'PROPOSER' && memberList[i].Age <= 65){

                                rC.memberArraySt.push(memberList[i].RelationType)
                            }
                        }
                    }


                    for(var i = 0 ; i < rC.memberArraySt.length ; i ++){
                            var member = rC.memberArraySt[i]
                            if(member == 'S'  || member == 'SPO' ){
                                buySecProduct = true;
                            }
                    }

                    if(buySecProduct){
                        rC.buySecondaryProductSt(productCode , rC.memberArraySt , 'Di' , 'diamond-stp-quote')
                    }
                    else{

                        $location.url("diamond-quote");

                    }
                    /*//scope.cSQ[productCode+"loader"] = true;
                    appService.postData(ABHI_CONFIG.apiUrl + "GEN/BuyProduct", {
                        "ReferenceNumber": sessionStorage.getItem('rid'),
                        "ProductCode": productCode,
                        "MemberList": rC.memberArraySt
                    }, true, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function(data) {
                        if (data.ResponseCode == 1){
                            $timeout(function(){
                                $location.url("diamond-quote");
                            },200);
                        //scope.cSQ[productCode+"loader"] = false;}
                     }
                    }),function(err){

                    };*/
                }

                

     /* End of to buying product */


    /* To check moneytool flow */

        if($routeParams.ReferenceNo && $routeParams.ut){
            rC.isMoneyToolFlow = true;
            sessionStorage.setItem('ut',$routeParams.ut);
            sessionStorage.setItem('rid',$routeParams.ReferenceNo);
            leadInsertCall();
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/ExtraMember", {
                "ReferenceNumber": sessionStorage.getItem('rid')
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if(data.ResponseCode == 1 && data.ResponseData != ''){
                    var members = data.ResponseData.split(',');
                    var p = "<p style='color: #c7222a;padding-bottom: 20px'>None of our plans cover these relations :";
                    for(var i = 0 ;i<members.length;i++){
                        if(i < members.length - 1){
                            p = p + "<span class='member-span'> "+members[i].toLowerCase()+"</span>,";
                        }else{
                            p = p + "<span class='member-span'> "+members[i].toLowerCase()+".</span>";
                        }
                    }
                    p = p + "</p>";
                    p = p + "<p>We have removed them so that you may check available plans for remaining relations.</p>";
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": p,
                        "showCancelBtn": false,
                        "modalSuccessText": "Proceed",
                        "showAlertModal": true
                    }
                }
            },function(err){

            });
        }else{
            if(sessionStorage.getItem('pName') && sessionStorage.getItem('continueJourney') != 'Y'){
                $location.url('pre-quote');
                return false;
            }
        }
        sessionStorage.removeItem('continueJourney');

    /* End of checking moneytool flow */


    /* Scroll to top functionality */

        $(window).scroll(function(){
            if($location.$$path == '/reco' && $('.faq-section').length){
                if ($(window).scrollTop() >= $('.faq-section').offset().top){
                    $('.reco-scroll-btn').fadeIn();
                }else{
                    $('.reco-scroll-btn').fadeOut();
                }
            }
        });

        $('.reco-scroll-btn').on('click',function(){
            $("html, body").animate({ scrollTop: 180 }, 300);
        });

    /* End of scroll to top functionality */


    /* To instantiate slider */

        function instantiateSlider() {
            rC.showSlickSlider = true;
            $timeout(function(){
                $('.slider').slick({
                    slidesToShow: 3,
                    infinite: false,
                    arrows: true,
                    responsive: [{
                        breakpoint: 1240,
                        settings: {
                            arrows: true,
                            slidesToShow: 2,
                            mobileFirst:true,
                            focusOnSelect:true
                        }
                    },{
                        breakpoint: 580,
                        settings: {
                            arrows: true,
                            centerMode: true,
                            slidesToShow: 1,
                            mobileFirst:true,
                            focusOnSelect:true
                        }
                    }]
                });
            },300);
        }

    /* End of instantiating slider */


    /* To Fetch Products */

        rC.fetchRecoProducts = function(flag) {
            rC.productDetails = [];
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetRecoProducts", {
                    "ReferenceNumber": sessionStorage.getItem('rid')
                }, flag, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    let UserData = {};
                    if(!JSON.parse(sessionStorage.getItem("prequoteData"))){
                        UserData = {
                            prequote:{
                                Age : rC.UserData.prequote.Age
                            }
                        }
                    }
                    else{
                        UserData = JSON.parse(sessionStorage.getItem("prequoteData"))
                    }  
                    aS.triggerSokrati(); /* Triggering Sokrati */
                    if (data.ResponseCode == 1) {
                        var responseDateReco = data.ResponseData ;
                        let fitArr = [];
                        let plArr = [];
                        let otherArr = [];
                        //let UserData = JSON.parse(sessionStorage.getItem("prequoteData"))
                            for(var i = 0 ; i < responseDateReco.length ; i++){
                                if(responseDateReco[i].ProductCode == 'PL'){
                                    plArr.push(responseDateReco[i]);
                                }
                                if(responseDateReco[i].ProductCode == 'FIT'){
                                    fitArr.push(responseDateReco[i]);
                                }
                                if(responseDateReco[i].ProductCode != 'PL' && responseDateReco[i].ProductCode != 'FIT' && responseDateReco[i].ProductCode != 'ST'){
                                    otherArr.push(responseDateReco[i]);
                                }
                                if(responseDateReco[i].ProductCode == 'ST'){
                                    rC.stproductPresent = true;
                                    rC.stSumInsured = responseDateReco[i-1].Premium +" + "+ responseDateReco[i].Premium
                                    rC.stPreminum = parseInt(responseDateReco[i-1].Premium) + parseInt(responseDateReco[i].Premium)
                                    otherArr.push(responseDateReco[i]);
                                    //responseDateReco[i-1].newProduct = responseDateReco[i]
                                    //responseDateReco.splice(i , 1);                                   
                                }
                            }

                            // When age is >25 and <=35 then Activ Fit product will display as featured product 
                            if(parseInt(UserData.prequote.Age) <= 35 && parseInt(UserData.prequote.Age) > 25){
                                responseDateReco = fitArr.concat(plArr, otherArr);
                            }
                            // When age is >35 and <=45 then Activ Fit product will display in product slider
                            if(parseInt(UserData.prequote.Age) <= 45 && parseInt(UserData.prequote.Age) > 35){
                                responseDateReco = plArr.concat(fitArr, otherArr);
                            }
                            // When age is >45 the Activ Fit product will not display - remove from the product array
                            // if(parseInt(UserData.prequote.Age) > 45){
                            //     responseDateReco = plArr.concat(otherArr);
                            // }
                            
                        rC.productDetails = [];
                        if(rC.isMoneyToolFlow){
                            var productNum = 0;
                            for( var i = 0;i<responseDateReco.length;i++){
                                if(responseDateReco[i].ProductCode == 'PL' || responseDateReco[i].ProductCode == 'DI'){
                                    productNum = productNum + 1;
                                    rC.productDetails.push(responseDateReco[i]);
                                }
                                if(productNum == 2){
                                    break;
                                }
                            }
                            rC.productDetails.reverse();
                        }
                        
                        else{
                            rC.productDetails = responseDateReco;
                        }
                        if(rC.productDetails.length > 2){
                            instantiateSlider();
                        }
                        fetchFAQ(rC.productDetails[0].ProductCode);
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "gtagPostiveFunction" : "click-button, reco , service-fails[GetRecoProducts]",
                            "gtagCrossFunction" : "click-button,  reco ,service-fails[GetRecoProducts]",
                            "gtagNegativeFunction" : "click-button, reco , service-fails[GetRecoProducts]",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {
                });
        }

        rC.fetchRecoProducts(true);

    /* End of fetching reco products */


    rC.openCovidDetaislModel = function(){
        $('#payment-model').modal('toggle')
    }
    rC.closeCovidDetaislModel = function(){
        $('#payment-model').modal('toggle')
    }



    /* To fetch faqs */

        function fetchFAQ(productCode){
            aS.getData("assets/data/"+productCode+"-faq.json","",false, {
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    rC.productFaqs = data;
                },function(err){

                })
        }

    /* End of fetching faqs */


    /* Function to call gtag events */

            rC.callGtagReco = function(event,event_category,event_label,eventKey){
                if(eventKey.target.innertText == "Policy Wording"){

                }
                else if(eventKey.target.innertText == "Product Brochure"){

                }else{
                    $window.gtag('event', event, {'event_category': event_category ,'event_label':event_label });
                }
            }

    /* End of function to call gtag events */

    /* Function to buy product */

        function buyProduct(ProductCode,event) {
            var lemeiskData   = {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "ProductCode": ProductCode
            }
            $rootScope.leminiskObj =  lemeiskData
            
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/BuyProduct", {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "ProductCode": ProductCode == 'ST' ? 'DI' : ProductCode
            }, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if (data.ResponseCode == 1) {
                    $rootScope.lemniskCodeExcute($location.$$path)
                    if (ProductCode == "DI") {
                        sessionStorage.setItem('pageNoSeq', 2);
                        $timeout(function(){
                            $location.url("diamond-quote");
                        },200);
                    }else if(ProductCode == "ST"){
                         buySecondaryProduct('ST' , rC.membersDetails)
                    } else if (ProductCode == "CS") {
                        sessionStorage.setItem('pageNoSeq', 2);
                        $timeout(function(){
                            $location.url("cs-quote");
                        },200);
                    } else if (ProductCode == "CK") {
                        sessionStorage.setItem('pageNoSeq', 2);
                        $timeout(function(){
                            $location.url("corona-kavach-quote");
                        },200);
                    } else if (ProductCode == "AS") {
                        sessionStorage.setItem('pageNoSeq', 2);
                        $timeout(function(){
                            $location.url("arogya-sanjeevani-quote");
                        },200);
                    } else {
                        $location.url('plans');
                    }
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": data.ResponseMessage,
                        "showCancelBtn": false,
                        "gtagPostiveFunction" : "click-button, reco , service-fails[BuyProduct]",
                        "gtagCrossFunction" : "click-button,  reco ,service-fails[BuyProduct]",
                        "gtagNegativeFunction" : "click-button, reco , service-fails[BuyProduct]",
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            }, function(err) {
            });
        }

    /* End of function to buy products */

    $rootScope.CreateABHAID =  function (){
        $window.location.href = 'https://mtpre.adityabirlahealth.com/healthinsurance/abha/create-abha-id';
    }

    $("#ci-sum-isnured-slider11").owlCarousel({
            autoPlay: 4000,
            stopOnHover: true,
            slideSpeed: 300,
            paginationSpeed: 600,
            items: 1,
            itemsDesktop : false,
            itemsDesktopSmall : false,
            itemsTablet: false,
            itemsMobile : false
    });


    /* Select Particular product */

        rC.selectProduct = function(product,event) {
            var eve = event;
            if(eve.target.localName == "a"){
                return false
            }
            if(eve.target.localName == "span"){
                return false
            }
            if(rC.membersDetails.length < 1){
                return false;
            }
            rC.recoBuyProduct = product.ProductCode;
            switch(product.ProductCode){
                case "DI":
                    sessionStorage.setItem('pName',"Activ Assure");
                    sessionStorage.setItem('productCrmName' , "Activ-Assure")
                    rC.productType = "diamond";
                    rC.allErrors = pVS.diamondValidations(rC.membersDetails);
                break;
                case "CK":
                    sessionStorage.setItem('pName',"Corona Kavach");
                    sessionStorage.setItem('productCrmName' , "Corona-Kavach")
                    rC.productType = "CK";
                    rC.allErrors = pVS.cKValidations(rC.membersDetails,25,product.ProductCode);
                break;
                case "ST":
                    sessionStorage.setItem('pName',"Activ Assure");
                    sessionStorage.setItem('productCrmName' , "Activ-Assure")
                    rC.productType = "diamond";
                    rC.allErrors = pVS.diamondSTValidations(rC.membersDetails);
                break;
                case "CS":
                    sessionStorage.setItem('pName',"Activ Secure Cancer Secure");
                    sessionStorage.setItem('productCrmName' , "Activ-Secure-CS" )
                    rC.productType = "CS";
                    rC.allErrors = pVS.rFBValidations(rC.membersDetails,18,product.ProductCode);
                break;
                case "PA":
                    sessionStorage.setItem('pName',"Activ Secure Personal Accident");
                    sessionStorage.setItem('productCrmName' , "Activ-Secure-PA")
                    rC.productType = "PA";
                    rC.allErrors = pVS.rFBValidations(rC.membersDetails,5,product.ProductCode);
                break;
                case "CI":
                    sessionStorage.setItem('pName',"Activ Secure Critical Illness");
                    sessionStorage.setItem('productCrmName' , "Activ-Secure-CI")
                    rC.productType = "CI";
                    rC.allErrors = pVS.rFBValidations(rC.membersDetails,5,product.ProductCode);
                break;
                case "PL":
                    sessionStorage.setItem('pName',"Activ Health");
                    sessionStorage.setItem('productCrmName' , "Activ Health")
                    rC.productType = "platinum";
                    rC.allErrors = pVS.platinumValidations(rC.membersDetails);
                break;
                case "AC":
                    sessionStorage.setItem('pName',"Activ Care");
                    sessionStorage.setItem('productCrmName' , "Activ-care")
                    rC.productType = "AC";
                    rC.allErrors = pVS.activCareValidations(rC.membersDetails);
                break;
                case "AS":
                    sessionStorage.setItem('pName',"Arogya Sanjeevani");
                    sessionStorage.setItem('productCrmName' , "Arogya-Sanjeevani")
                    rC.productType = "AS";
                    rC.allErrors = pVS.arogyaSanjeevaniValidations(rC.membersDetails,25,product.ProductCode);
                break;
                case "FIT":
                    sessionStorage.setItem('pName',"Activ Fit");
                    sessionStorage.setItem('productCrmName' , "Activ-Fit")
                    rC.productType = "FIT";
                    rC.allErrors = pVS.activFitValidations(rC.membersDetails,25,product.ProductCode);
                break;
            }

            var lemniskObj = {
                "Product": sessionStorage.getItem('productCrmName') 
            };
            $rootScope.lemniskTrack("", "", lemniskObj);

            if(rC.allErrors.individualSelectionError){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": (rC.allErrors.elligibleMembers.length == 1) ? "Individual Family Construct exists only for Self. Please change your family construct." : "This combination of family construct does not exist. Please select proper family construct.",
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true,
                    "positiveFunction": function(){
                        $location.url('pre-quote');
                    }
                }
                $rootScope.$apply();
                return false;
            }
            if(rC.allErrors.isProductElligible){
                if(product.Premium == 0){
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": "Some Error Occurred! Please try after some time!",
                        "showCancelBtn": false,
                        "modalSuccessText": "OK",
                        "modalCancelText": "No",
                        "showAlertModal": true,
                        "positiveFunction": function(){
                            $location.url('pre-quote');
                        }
                    }
                }else{
                    buyProduct(product.ProductCode);
                }
            }else{
                rC.fetchInsuredMembers()
                    .then(function(data){
                        rC.activCareFamilyMapping();
                        sessionStorage.removeItem('pName');
                        eve.target.disabled = false;
                        eve.target.innertText = "Buy";
                        if(product.ProductCode == 'AC'){
                            $('#change-group-member').modal('show');
                        }else{
                            $('#add-new-member-web').modal('show');
                        }
                    },function(err){

                    });
            }
        }

        $(document).on('click','.slider-btn',function(e){
            rC.selectProduct($(this).data('json'),e);
        });

    /* End of selecting particular product */


}]);


/*
    
    End of Reco Controller
    Reco Controller
    Author: Sunny Khattri
    Date: 16-06-2018

*/