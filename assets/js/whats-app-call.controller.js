/*
	Name: whats app call Controller
	Author: Sunny Khattri
	Date: 10-09-2018
*/


var preApp = angular.module("extPreQuoteApp",[]);

preApp.controller("extPreQuote",['$rootScope','appService','ABHI_CONFIG','$location','$routeParams','productValidationService','$scope','$timeout' ,'$window',function($rootScope,appService,ABHI_CONFIG,$location,$routeParams,productValidationService,$scope,$timeout,$window){


        var aS = appService;

      
        var mobileNo = $rootScope.decrypt($routeParams.mn);
        

            $scope.btnHelpBuy = function(type){

            /* Lead form request object */

            var LeadFormdetails = {
                "CRMLeadObject":  {
                    "LEADTYPE": "DigitalCampaign",
                    "SALUTATION": "",
                    "FIRSTNAME": "",
                    "LASTNAME": "",
                    "DATEOFBIRTH": "",
                    "PortalSource": "web_portal",  
                    "INTERMEDIARYCODE": "",
                    "SOURCE": "whatsapp_click",
                    "PAN": "",
                    "PASSPORTNO": "",
                    "AADHARNO": "",
                    "DRIVINGLICENSENO": "",
                    "EMAIL": "default@portalcall.com",
                    "GENDER": "",
                    "LEADSTAGE": "",
                    "LEADSTATUS": "",
                    "LEADREFERREDBY": "",
                    "LEADREFERREDBYID": "",
                    "MOBILE": mobileNo,
                    "RESIDENTPHONE": "",
                    "ADDRESSLINE1": "",
                    "ADDRESSLINE2": "",
                    "CITY":  "",
                    "PINCODE": "",
                    "STATE": "",
                    "PREFERREDCONTACTIBLETIME": "",
                    "PREFERREDMODEOFCONTACT": "",
                    "NOTESDESCRIPTION": "",
                    "NOTESTITLE": "",
                    "ACTIVITYDESCRIPTION": "",
                    "ACTIVITYSUBECT": "",
                    "ACTIVITYTYPE": "",
                    "GCLID": "",
                    "PRODUCT": "Activ-Assure",
                    "Keyword": "",
                    "Adgroup": ""
                },
                "PortalLeadObject": {
                    "name": "",
                    "email": "",
                    "mobile": mobileNo,
                    "employeeId": "",
                    "PortalSource": "web_portal",  
                    "product": "Activ-Assure",
                    "gclid": "",
                    "source": "whatsapp_click",
                    "imdCode": "",
                    "Keyword": "",
                    "Adgroup": ""
                }
            }

            /* End of lead form request object */

               

                /*//$window.gtag('event', 'click-button' , {'event_category': 'buy-online_[enquire-now]','event_label': 'buy-online_['+eventLabel+']-'+$location.$$url })
                if(type == 'call'){
                    callCRMLeadSer(type)
                     $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "",
                                    "modalBodyText": "We have disabled this functionlity on UAT. In case you want to test same please contact on mahesh.patil4@adityabirlacapital.com",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "modalCancelText": "No",
                                    "showAlertModal": true
                                }*/
                                
                   if(type == 'call'){
                    $rootScope.showLoader = true;
                    aS.get(ABHI_CONFIG.hservicesv2+"/Click2CallAuthToken/CheckUserToken?UT=" +$routeParams.UT +'&MobileNumber='+$routeParams.mn,true,{
                                        headers:{
                                            'Content-Type': 'application/json',
                                            'p2':'website'
                                        }
                                    })
                
                        .then(function(response){
                            var res = response;
                            console.log(res)
                            callCRMLeadSer(type)
                            if(response.code == 1){
                                // /$rootScope.showAlertBox("Thank you for showing your interest. We will get in touch with you shortly. Thank You.");
                                $rootScope.showLoader = false;
                                //window.location.assign("https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/pre-quote")
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "",
                                    "modalBodyText": "Thank you for showing your interest. We will get in touch with you shortly.",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "modalCancelText": "No",
                                    "showAlertModal": true,
                                    "positiveFunction": function(){
                                           window.location.assign("https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/pre-quote")
                                        }
                                }

                                /*$('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');*/
                            }else{
                                //$rootScope.showAlertBox("There seems to be a problem. Please try again after some time."); 
                                $rootScope.showLoader = false;
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "",
                                    "modalBodyText": response.msg,
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "modalCancelText": "No",
                                    "showAlertModal": true,
                                    "positiveFunction": function(){
                                           window.location.assign("https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/pre-quote")
                                        }
                                }
                               /* $('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');*/
                            }
                          })
                    
                
                }   
                else{
                    callCRMLeadSer(type);
                }
            

                function callCRMLeadSer(type){
                        aS.postData(ABHI_CONFIG.hservicesv2+"/HealthLeadform/postLeadFormtoPortal",
                                        LeadFormdetails
                                    ,true,{
                                        headers:{
                                            'Content-Type': 'application/json'
                                        }
                                    })
                
                        .then(function(response){
                            
                            if(type == 'request'){
                            if (!angular.isUndefined(response['code']) && response['code'] == 1 && response['msg'] == "Success") {
                                window.location.assign("https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/pre-quote")
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "",
                                        "modalBodyText": "Thank you for showing your interest. We operate between 10:00am to 7:00pm. You will recieve a call within 12 hours.",
                                        "showCancelBtn": false,
                                        "modalSuccessText": "OK",
                                        "modalCancelText": "No",
                                        "showAlertModal": true
                                    }
                                  
                               /* $('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');*/
                                $rootScope.showLoader = false;
                            }else { 
                               $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "",
                                        "modalBodyText": "There seems to be a problem. Please try again after some time.",
                                        "showCancelBtn": false,
                                        "modalSuccessText": "OK",
                                        "modalCancelText": "No",
                                        "showAlertModal": true
                                    }
                               /* $('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');  */  
                                $rootScope.showLoader = false;
                            }
                        }
                        else{

                        }
                       

                    });
                }
            }

        /* End of submit form */

        /*Show Div Based On timing*/

        var today = new Date().getHours();
        var day = new Date().getDay();


        if ((today >= 10 && today < 19) && day != 0 ) {
            /*$('#alertBoxModal12').modal({backdrop: 'static', keyboard: false});*/

            $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Message",
                                    "modalBodyText": "By clicking on Call Me Now, I authorize ABHICL and associate partners to contact me through my email/call/SMS. This will override registry on the DNCR.",
                                    "showCancelBtn": false,
                                    "hideCloseBtn": true,
                                    "modalSuccessText": "Call Me Now",
                                    "modalCancelText": "No",
                                    "showAlertModal": true,
                                    "positiveFunction": function(){
                                          $scope.btnHelpBuy('call')
                                        }
                                }
        
          
        } else {
            $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Message",
                                    "modalBodyText": "By clicking on Request a Callback, I authorize ABHICL and associate partners to contact me through my email/call/SMS. This will override registry on the DNCR.",
                                    "showCancelBtn": false,
                                    "hideCloseBtn": true,
                                    "modalSuccessText": "Request a Callback",
                                    "modalCancelText": "No",
                                    "showAlertModal": true,
                                    "positiveFunction": function(){
                                         $scope.btnHelpBuy('request')
                                        }
                                }
            
        }


}])

	