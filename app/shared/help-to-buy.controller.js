// Source: help-to-buy.controller.js
/*
    
    Name: Help to buy through call us button
    Author: Sunny Khattri
    Date: 12/09/2019

*/
app.controller('help-to-buy', function ($scope,appService, $location,  $rootScope,$window,$route,ABHI_CONFIG, $sce) {
        
        $scope.chkAuth = true;
        var aS = appService; // appService is stored in aS variable
        var defaultProductName = "Activ-Assure";
        
        //CTA toggle for buy and renewal    
var renewalPaths = [
    "/renewal-renew-policy",
    "/group-renew-landing'",
    "/new-renewal-landing",
    "/renewal-view-member-landing",
    "/renewal-edit-member-landing",
    "/renewal-edit-optional-covers",
    "/renewal-view-member-add-user",
    "/renewal-edit-nominee-details-landing",
    "/renewal-increase-policy-tenure-landing",
    "/renewal-increase-sum-insured-landing",
    "/renewal-upgrade-zone-landing",
    "/renewal-change-address-details",
    "/new-renewal-renew-thank-you",
    "/part-payment-thank-you",
    "/counter-offer-thank-you"
];


$rootScope.$on('$routeChangeSuccess', function (e, newLocation, oldLocation) {
    $scope.renewalCPTOCRM = false;
    var path = $location.path();
    console.log(path);
        if (renewalPaths.indexOf(path) > -1) {
            $scope.renewalCPTOCRM = true;
            $scope.headerTextCall = $sce.trustAsHtml("For renewal of policy-Kindly share your details");
        } else if (!$scope.renewalCPTOCRM) {
            $scope.headerTextCall = $sce.trustAsHtml("This channel is for buying assistance. <br>For service query please call 1800-270-7000");
        }
});
// SMITA toggle end

        /*Show Div Based On timing*/

        var today = new Date().getHours();
        var day = new Date().getDay();
        if (today >= 10 && today < 19) {
           $scope.showCall = true;
           $scope.showMail = false;
           /*$scope.showMail = true;
           $scope.showCall = false;*/
        } else {
            $scope.showMail = true;
           $scope.showCall = false;
        }

        /*Show Div Based On timing*/

        /* To open help us popup form */

            $('.helpus').click(function () {
                var mobNo = sessionStorage.getItem('mobNo');
                
                if(!angular.isUndefined(mobNo)){
                    $scope.authmob.MOBILE =  mobNo;
                    $scope.auth.MOBILE =  mobNo;
                }
                $(this).hide('slow');
                $('.shadow_bg').css('display', 'block');
                $('.helpusslide').show('slow');
            });

        /* To close help us popup form */

       
        /* To close help us popup form */

            $('.shadow_bg').click(function () {
                $(this).fadeOut();
                $('.helpusslide').hide('slow');
                $('.helpus').show('slow');
            });



        /* End of close help us popup form */

        $scope.closeBox = function() {
            $(".shadow_bg").fadeOut(),
            $(".helpusslide").hide("slow"),
            $(".helpus").show("slow")
            $window.gtag('event', 'click-icon' , {'event_category': 'buy-online_[enquire-now]','event_label': 'buy-online_[cross-icon]-'+$location.$$url })
        }

        $scope.gotoPageGAParam=function(cat , gaParam){
            //alert("hello")
            //console.log("header function called ")
            $window.gtag('event', cat , {'event_category': 'buy-online_[enquire-now]','event_label': 'buy-online_['+gaParam+']'+$location.$$url })
        }

        /* Intialized auth scope to empty values */
        $scope.auth = {
            'FIRSTNAME' : '',
            'MOBILE' : '',
            'CITY' : '',
            'PREFERREDCONTACTIBLETIME' : ''
        };

        $scope.authmob = {
            'FIRSTNAME' : '',
            'MOBILE' : ''
        };


       /**
        * 
        * @param {*} name 
        * @param {*} mobile 
        * This is to submit renewal for generating lead in ubona via CRM from ESB
        */

        function SubmitRenewlaLead(name, mobile) {
            var APIURL = "https://mtpre.adityabirlahealth.com/healthinsurance/buy-insurance-online/obServicesV2/api/Renew/ScheduleCall";
            aS.postData(APIURL,
                {
                    "FirstName": name,
                    "Mobile": mobile
                }
                , true)
                .then(function (response) {
                    if (response.ResponseCode == 1) {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "",
                            "modalBodyText": response.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
        
                        $('.shadow_bg').fadeOut();
                        $('.helpusslide').hide('slow');
                        $('.helpus').show('slow');
                        $rootScope.showLoader = false;
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "",
                            "modalBodyText": "There seems to be a problem. Please try again after some time.",
                            "showCancelBtn": false,
                            "modalSuccessText": "OK",
                            "modalCancelText": "No",
                            "showAlertModal": true
                        }
                        $('.shadow_bg').fadeOut();
                        $('.helpusslide').hide('slow');
                        $('.helpus').show('slow');
                        $rootScope.showLoader = false;
                    }
                });
        }
        

            $scope.btnHelpBuy = function(data,formErr,type , eventLabel){
                console.log($scope.renewalCPTOCRM )
                if($scope.renewalCPTOCRM) {
                    SubmitRenewlaLead(data.FIRSTNAME,data.MOBILE );
                } else {               
                var productName = sessionStorage.getItem('productCrmName');
                
                        if(!angular.isUndefined(productName) && productName != null){
                            defaultProductName = productName
                        }

            /* Lead form request object */

                var LeadFormdetails = {
                    "CRMLeadObject":  {
                        "LEADTYPE": "DigitalCampaign",
                        "SALUTATION": "",
                        "FIRSTNAME": data.FIRSTNAME,
                        "LASTNAME": "",
                        "DATEOFBIRTH": "",
                        "INTERMEDIARYCODE": "",
                        "SOURCE": "web_callback",
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
                        "MOBILE": data.MOBILE,
                        "RESIDENTPHONE": "",
                        "ADDRESSLINE1": "",
                        "ADDRESSLINE2": "",
                        "CITY": data.CITY,
                        "PINCODE": "",
                        "STATE": "",
                        "PREFERREDCONTACTIBLETIME": data.PREFERREDCONTACTIBLETIME,
                        "PREFERREDMODEOFCONTACT": "",
                        "NOTESDESCRIPTION": "",
                        "NOTESTITLE": "",
                        "ACTIVITYDESCRIPTION": "",
                        "ACTIVITYSUBECT": "",
                        "ACTIVITYTYPE": "",
                        "GCLID": "",
                        "PRODUCT": defaultProductName,
                        "Keyword": "",
                        "Adgroup": ""
                    },
                    "postLeadPortalData": {
                        "name": "",
                        "email": "default@portalcall.com",
                        "mobile": data.MOBILE,
                        "employeeId": "",
                        "product": defaultProductName,
                        "gclid": "",
                        "source": "web_callback",
                        "imdCode": "",
                        "Keyword": "",
                        "Adgroup": ""
                    }
                }

            /* End of lead form request object */

                $scope.showErrors = false;
                //$rootScope.showLoader = true;
                if(formErr){
                    $scope.showErrors = true;
                    $rootScope.showLoader = false;
                    return false; 
                }

                if(!$scope.chkAuth){
                    $rootScope.showLoader = false;
                    $rootScope.showAlertBox("Please accept terms!");   
                    return false;
                }

                $window.gtag('event', 'click-button' , {'event_category': 'buy-online_[enquire-now]','event_label': 'buy-online_['+eventLabel+']-'+$location.$$url })
               if(type == 'call'){
                    $rootScope.showLoader = true;
                    callCRMLeadSer(type)
                    /*aS.postData(ABHI_CONFIG.apiUrl+"/GEN/ClickToCall" ,
                                        {
                                            "customerNumber" : data.MOBILE,
                                           // "source":"ivr:54461" [[Optional, By default ivr:54461 will get passed]]
                                        }

                                    ,true,{
                                        headers:{
                                            'Content-Type': 'application/json'
                                        }
                                    })
                
                        .then(function(response){
                            var res = response;
                            console.log(res)
                            callCRMLeadSer(type)
                            if(response.ResponseCode == 1){
                                // /$rootScope.showAlertBox("Thank you for showing your interest. We will get in touch with you shortly. Thank You.");
                                $rootScope.showLoader = false;
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "",
                                    "modalBodyText": "Thank you for showing your interest. We will get in touch with you shortly.",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "modalCancelText": "No",
                                    "showAlertModal": true
                                }

                                $('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');
                            }else{
                                //$rootScope.showAlertBox("There seems to be a problem. Please try again after some time."); 
                                $rootScope.showLoader = false;
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "",
                                    "modalBodyText": "There seems to be a problem. Please try again after some time.",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "modalCancelText": "No",
                                    "showAlertModal": true
                                }
                                $('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');
                            }
                          })*/
                    
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
                            
                            
                            if (!angular.isUndefined(response['code']) && response['code'] == 1 && response['msg'] == "Success") {
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "",
                                        "modalBodyText": "Thank you for showing your interest. Our executive will get in touch with you soon.",
                                        "showCancelBtn": false,
                                        "modalSuccessText": "OK",
                                        "modalCancelText": "No",
                                        "showAlertModal": true
                                    }
                                  
                                $('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');
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
                                $('.shadow_bg').fadeOut();
                                $('.helpusslide').hide('slow');
                                $('.helpus').show('slow');    
                                $rootScope.showLoader = false;
                            }
                        
                        
                       

                    });
                }

                } 
            }

        /* End of submit form */
    })

/*
    
    End of code    
    Name: Help to buy through call us button
    Author: Sunny Khattri
    Date: 12/09/2017

*/