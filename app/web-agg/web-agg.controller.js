/*
    
    Web Aggregator validation module
    Author : Pankaj Patil
    Date: 18-02-2019

*/


var wAApp = angular.module("wAApp", []);

wAApp.controller("webAggApp", ['$rootScope', 'appService', 'ABHI_CONFIG','$location','$routeParams', function($rootScope, appService, ABHI_CONFIG, $location,$routeParams) {

        /* Variable Inilization */

            var wA = this;
            var aS = appService;
            var passUrl;
            var goToHealthWebsite = false;

        /* End of variable inlization */


        /* Call validate IMD service */

            aS.postData(ABHI_CONFIG.apiUrl+"GEN/ValidateIMD",{
                    "IMDCode":$routeParams.imdCode
                },true,{
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function(data){
                        if(data.ResponseCode == 1){
                            if(data.ResponseData.IsIMDValid){

                                /* To check redirection URL */
                                    sessionStorage.setItem('imdCode' , data.ResponseData.IMDCode );
                                    
                                    if(data.ResponseData.IMDCode == '2115779' && $routeParams.productCode == 'DI'){
                                        passUrl = 'idfc-pasa';
                                    } else {
                                        if($routeParams.productCode == 'DI'){
                                            passUrl = 'activ-assure-pre-quote';
                                        }else if($routeParams.productCode == 'PL'){
                                            passUrl = 'activ-health-pre-quote';
                                        }else if($routeParams.productCode == 'PA'){
                                            passUrl = 'activ-secure-personal-accident-pre-quote';
                                        }else if($routeParams.productCode == 'CI'){
                                            passUrl = 'activ-secure-critical-illness-pre-quote';
                                        }else if($routeParams.productCode == 'CS'){
                                            passUrl = 'activ-secure-cancer-secure-pre-quote';
                                        }else if($routeParams.productCode == 'AC'){
                                            passUrl = 'activ-care-pre-quote';
                                        }else if($routeParams.productCode == 'CK'){
                                            passUrl = 'corona-kavach-pre-quote';
                                        }else if($routeParams.productCode == 'ST'){
                                            passUrl = 'super-health-plus-top-tp-plus-activ-assure';
                                        }else if($routeParams.productCode == 'FIT'){
                                            passUrl = 'activ-fit-pre-quote';
                                        }else{
                                            goToHealthWebsite = true
                                            //passUrl = 'activ-assure-pre-quote';
                                        }
                                    }

                                /* End of checking redirtection url */


                                /* Passing gender value */

                                    var gender;
                                    if($routeParams.gender == 'female'){
                                        gender = 0;
                                    }else if($routeParams.gender == 'male'){
                                        gender = 1
                                    }

                                /* End of passing gender value */


                                /* Call duplicate check service to log URL */

                                    var urlTail = window.location.href.split('?');
                                    aS.postData(ABHI_CONFIG.apiUrl+"GEN/DuplicateCheck",{
                                        "ProductCategory": "",
                                        "Age": "",
                                        "MobileNo": ($routeParams.mobNo) ? $routeParams.mobNo : "",
                                        "EmailID": ($routeParams.emailId) ? $routeParams.emailId : "",
                                        "IMDCode": data.ResponseData.IMDCode,
                                        "IMDSource": data.ResponseData.IMDSource,
                                        "FirstName": ($routeParams.fname)? $routeParams.fname : "",
                                        "LastName": ($routeParams.lname) ? $routeParams.lname : "",
                                        "Branch": "",
                                        "Keyword": ($routeParams.keyword) ? $routeParams.keyword : "",
                                        "AdGroup": ($routeParams.adgroup) ? $routeParams.keyword : "",
                                        "Location": "",
                                        "VK_ID": ($routeParams.vkid) ? $routeParams.vkid : "",
                                        "VK_SSID": ($routeParams.spid) ? $routeParams.spid:"",
                                        "VK_SecurityCode": ($routeParams.securitycode) ? $routeParams.securitycode : "",
                                        "PortalLeadID": "",
                                        "CRMLeadID": "",
                                        "ProName": ($routeParams.productCode) ? $routeParams.productCode : "",
                                        "ProCat": null,
                                        "Address": null,
                                        "PinCode": null,
                                        "DOB": "",
                                        "ThirdPartyURL": window.location.href,
                                        "City":"",
                                        "Income":"",
                                        "OccupationType":($routeParams.occupation) ? $routeParams.occupation : "",
                                        "Gender":(gender == 0 || gender == 1) ? gender : "",
                                    },true,{
                                        headers:{
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                        .then(function(response){
                                             if(goToHealthWebsite){
                                                window.location.href  = ABHI_CONFIG.healthWebsite + "view-all-plan?IMDCode="+data.ResponseData.IMDCode+"&source="+data.ResponseData.IMDSource
                                            }
                                            else{
                                                $location.url(passUrl+"?"+urlTail[1]+"&IMDCode="+data.ResponseData.IMDCode+"&source="+data.ResponseData.IMDSource);
                                            }
                                        })

                                /* End of duplicate check service call to log URL */

                            }else{
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Warning",
                                    "modalBodyText": "Invalid IMD Code.",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "modalCancelText": "No",
                                    "showAlertModal": true
                                }
                            }
                        }else{
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Warning",
                                "modalBodyText": data.ResponseMessage,
                                "showCancelBtn": false,
                                "modalSuccessText": "OK",
                                "modalCancelText": "No",
                                "showAlertModal": true
                            }

                        }
                    },function(err){
                    });
        
        /* End of validating IMD service Call*/
    

}]);

/* End of controller */