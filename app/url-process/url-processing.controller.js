var uPApp = angular.module("urlProcessApp", []);

uPApp.controller("urlProcess", ['$rootScope', 'appService', 'ABHI_CONFIG','$location','$routeParams','$sessionStorage', function($rootScope, appService, ABHI_CONFIG, $location,$routeParams,$sessionStorage) {

    var uP = this;
    var aS = appService;
    uP.declarationP;

    /* call crm and click to call api */

    function callCrmClickToCall(){
        {ReferenceNumber="",ProductCode=""}
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/ChatBotLeadInsert", {
                                            "ReferenceNumber": uP.refNo,
                                            "ProductCode" : uP.ProductCode
                                        }, false, {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                            .then(function(responseData) {
                                                
                                            })
    }

    /* call crm and click to call api  ends */

        
    /* URL processing Login */
    uP.callGetSummeryInDeclaration = function() {
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/ContinueJourney", {
            "URLKey": $routeParams.urlKey
    }, false, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(data) {
        if (data.ResponseCode == 1) {
            uP.refNo = data.ResponseData.ReferenceNumber;
            uP.ProductCode = data.ResponseData.PrimaryProduct;
            sessionStorage.setItem('rid',data.ResponseData.ReferenceNumber);
            sessionStorage.setItem('ut',data.ResponseData.ut);
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetCRMLeadId", {
                    "ReferenceNumber": data.ResponseData.ReferenceNumber
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(crmData) {
                if(crmData.ResponseCode == 1){
                    sessionStorage.setItem('leadId',crmData.ResponseData.LeadId);
                }else{
                    sessionStorage.setItem('leadId',null);
                }
                switch(data.ResponseData.PrimaryProduct){
                    case "DI":
                        sessionStorage.setItem('pName',"Activ Assure");
                        sessionStorage.setItem('productCrmName' , "Activ-Assure")
                    break;
                    case "CS":
                        sessionStorage.setItem('pName',"Activ Secure Cancer Secure");
                        sessionStorage.setItem('productCrmName' , "Activ-Secure-CS");
                    break;
                    case "PA":
                        sessionStorage.setItem('pName',"Activ Secure Personal Accident");
                        sessionStorage.setItem('productCrmName' , "Activ-Secure-PA");
                    break;
                    case "CI":
                        sessionStorage.setItem('pName',"Activ Secure Critical Illness");
                        sessionStorage.setItem('productCrmName' , "Activ-Secure-CI");
                    break;
                    case "PL":
                        sessionStorage.setItem('pName',"Activ Health");
                        sessionStorage.setItem('productCrmName' , "Activ Health");
                    break;
                    case "AC":
                        sessionStorage.setItem('pName',"Activ Care");
                        sessionStorage.setItem('productCrmName' , "Activ-care");
                    break;

                    case "CFR":
                        $sessionStorage.counterOfferDetails = {
                            "ProposalMobNumber":data.ResponseData.MobileNumber,
                            "ProposalNumber":data.ResponseData.ProposerNumber
                        };
                        $sessionStorage.refNo = data.ResponseData.ReferenceNumber;
                    break;
                    default:
                    break;
                }
                if((data.ResponseData.PageDrop.match(/cross-sell/g)) != null){
                    sessionStorage.setItem('crossSell',true);
                }
                aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetHealthAndLifeStyleMembers", {
                        "ReferenceNumber": sessionStorage.getItem('rid')
                    }, false, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function(response) {
                            if(response.ResponseCode == 1){
                                sessionStorage.setItem('preExeDis',true);
                            }else{
                                sessionStorage.setItem('preExeDis',false);
                            }
                            $rootScope.sendSmsBtn = false;
                            $.getJSON('https://jsonip.com?callback=?', function(data) {
                                if((data.ip.match(/103.68.199/g) || []).length > 0 || (data.ip.match(/203.77.177/g) || []).length > 0){
                                    sessionStorage.setItem('sendSMS','1');
                                    $rootScope.sendSmsBtn = true;
                                }
                            }); 
                            if(data.ResponseData.PageDrop == 'paymentResponse'){
                                aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPaymentID", {
                                    "ReferenceNumber": sessionStorage.getItem('rid')
                                }, false, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then(function(responseData) {
                                        if(responseData.ResponseCode == 1){
                                            $location.url(data.ResponseData.PageDrop+"?id="+responseData.ResponseData.PaymentId);  
                                        }else{
                                        }
                                    },function(err){
                                        
                                    })
                            }else{
                                if($routeParams.fromWebSite == 'chatbot'){
                                    $rootScope.alertData = {
                                                "modalClass": "regular-alert",
                                                "modalHeader": "Authorization",
                                                "modalBodyText": "I authorize ABHICL and associate partners to contact me through my email/call/SMS. This will override registry on the DNCR.",
                                                "showCancelBtn": false,
                                                "modalSuccessText": "I Authorize",
                                                "modalCancelText": "No",
                                                "hideCloseBtn" : true,
                                                "showAlertModal": true,
                                                "positiveFunction": function() {
                                                    callCrmClickToCall()
                                                        $location.url(data.ResponseData.PageDrop);    
                                                        
                                                }
                                            }
                                }
                                else{
                                    let getDeclaration = data.ResponseData.PageDrop.split('-')
                                    if(getDeclaration[getDeclaration.length-1] != "declaration"){
                                        $location.url(data.ResponseData.PageDrop);    
                                    }
                                    else{
                                        uP.declarationP = data.ResponseData.PageDrop;
                                    }
                                }
                            }
                        },function(err){});

                },function(err){

                })
        } else {
            $location.url('/pre-quote');    
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": data.ResponseMessage + " Try same combination of Email and Mobile no.",
                "showCancelBtn": false,
                "modalSuccessText": "OK",
                "modalCancelText": "No",
                "showAlertModal": true
            }
        }
    }, function(err) {
    });
    }

    uP.callGetSummeryInDeclaration();

    function navigateToURL() {
        $rootScope.showLoader = true;
        wait(5000);  //seconds in milliseconds 1sec = 1000ms

        /* redirect from e-KYC Start */
        sessionStorage.setItem("eTransactionId", $routeParams.transactionId);
        if($routeParams.transactionId && $routeParams.status)
        {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/EkycResult", {
                "ReferenceNumber": sessionStorage.getItem('rid'),
                "transactionId": sessionStorage.getItem('eTransactionId')
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                // uP.callGetSummeryInDeclaration();
                $location.url(uP.declarationP);  
                //debugger;
                sessionStorage.removeItem("KycStatus");
                sessionStorage.removeItem("KycDOB");
                sessionStorage.setItem("KycDOB", null);
                sessionStorage.setItem("KycStatus", "Fail");  

                // {"ResponseCode":1,"ResponseData":{"Updateflag":"1","Kycstatus":"SUCCESS","CKYCNo":"40047621629746","ProposalPanNumber":"","PropFName":"Ravikant","PropMName":"Ramashray","PropLName":"Gaud","ProposerFullName":"","PropDOB":"5/26/1984 12:00:00 AM","PropAdharNum":"","Address1":"KEM-854-2/6 'C'Ward Ramdev","Address2":"Chawl Prem Nagar Opp Hanuman","Address3":"Temple Badruddin Tayyabaji Marg Mumbai","city":"Mumbai","state":"MH","country":"IN","CoresAddSameAsPermanentAdd":"N","corresaddress1":"KEM-854-2/6 'C'Ward Ramdev","corresaddress2":"Chawl Prem Nagar Opp Hanuman","corresaddress3":"Temple Badruddin Tayyabaji Marg Mumbai","correscity":"Mumbai","corresstate":"MH","correscountry":"IN"},"ResponseMessage":"Success."}

                if(response.ResponseCode == 1){
                    sessionStorage.setItem("KycStatus", response.ResponseData.Kycstatus); 
                    sessionStorage.setItem("KycDOB", response.ResponseData.PropDOB); 
                    //console.log("KYC Status : " + sessionStorage.getItem("KycStatus"));                                                   
                }else{
                    
                }
            },function(err){});
        }

        

        /* redirect from e-KYC Ends */
       
        
    }

    /* URL processing Login  */

    /* wait function */ 
    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
            end = new Date().getTime();
        }
    }
    /* wait function end */ 

    navigateToURL();

}]);

/* End of controller */