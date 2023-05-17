/*
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/


var preApp = angular.module("preQuoteApp",[]);

preApp.controller("preQuoteApp",['$rootScope','appService','ABHI_CONFIG','$location','$routeParams' , '$scope' , '$window',function($rootScope,appService,ABHI_CONFIG,$location,$routeParams , $scope, $window){
	
	/* Variable Initilization */

		var pQA = this; // Current controller scope is stored in pQA
		
		var aS = appService; // appService is stored in aS variable
		pQA.categories = []; // To stored catgrories data
		pQA.familyConsturcts = []; // To store family construct
		var leadCallService = 0; // As we allow lead service call thrice on failure so variable inilizae
		pQA.additionalMembers = []; // To store additional members
	    pQA.preQuote = {}; // Pre quote data object
	    var IMDCodeURL ;
	    var sourceImd ;
	    pQA.showBuyBtn = true;
	    var fname ;
	    var lname ;
	    var referCode ;
        sessionStorage.removeItem('pageNoSeq'); // Removed pageNoSeq value from sessionStorage
        sessionStorage.removeItem('lastRouteVisted'); // Removed lastRouteVisited value from sessionStorage
        sessionStorage.removeItem('pName'); // Removed pName value from sessionStorage
        sessionStorage.removeItem('preExeDis'); // Removed preExeDis value from sessionStorage
        sessionStorage.removeItem('ut'); // Removed ut value from sessionStorage
        sessionStorage.removeItem('leadId'); // Removed ut value from sessionStorage

        /* 
        	If reference no is present in sessionStorage then we check prequotedata and map that data with prequotre object.
			If prequote data is not present then we clear sessionstorage.
			If its present then we mapp data as shown in else loop
       	*/

       		if(!angular.isUndefined($routeParams.imdcode) ) {
				toValidateIMD($routeParams.imdcode)
			}
			


			$(document).ready(function() {
				$('.accordion-toggle1').click(function() {
					$('.accordion-toggle1').parent().css('background-color', '#ffffff');
					$('.accordion-toggle1').parent().parent().removeClass('panel-heading');
					$('.accordion-toggle1').parent().css('padding', '20px 19px 20px 17px');
					$('.accordion-toggle1').parent().css('border-radius', '4px');
					if ($(this).hasClass('collapsed')) {
						$(this).parent().css('background-color', '#f1f3f6');
					} else {
						$(this).parent().css('background-color', '#ffffff');
					}
				});
			});


				/* 
		To validate IMD 
		In following function we are validating IMDCode which we received from queryparams
	*/
		if(!angular.isUndefined($routeParams.ReferalCode )){
			 referCode = $routeParams.ReferalCode;
		}

	/* fetch refer friend Details */

		 aS.getData(ABHI_CONFIG.hservicesv2 +'/ReferAFriend/showReferenceDetails?ReferalCode=' + $rootScope.encryptWithoutString(referCode) ,"",true, {
                
                    'Content-Type': 'application/json',
                		'p2' : 'website'
            })
                .then(function(data){
                   var response = JSON.parse($rootScope.decrypt(data._resp))

                   pQA.responseData = response.data;
                   if(response.code == 1 ){

                   }
                   else{
                   		$rootScope.alertData = {
		                    "modalClass": "regular-alert",
		                    "modalHeader": "Hi ",
		                    "modalBodyText": "Due to some technocal Issue we are unable to fetch your details but still you can proceed ",
		                    "showCancelBtn": false,
		                    "modalSuccessText" : "Ok",
		                    "gtagPostiveFunction" : "click-button, refer-friend , refer-friend-Consent-OK",
		                    "showAlertModal": true,
		                    "hideCloseBtn" : true,
		                	}	
                   }
                  
                },function(err){

                })

    /* fetch refer friend Details ends */        

    /* fetch refer friend Details */
    	function genrateLeadService(val){
    		 $("html, body").animate({ scrollTop: $("#refer-freiend-new").height() + 10 }, 300);
    		 $rootScope.mobileNORefer= pQA.MobileNo;
    		 $location.url(val)
		 	aS.getData(ABHI_CONFIG.hservicesv2 +'/ReferAFriend/getReferenceDetails?ReferalCode=' + $rootScope.encryptWithoutString(referCode) ,"",false, {
               
                    'Content-Type': 'application/json',
                    'p2' : 'website'
                
            })
                .then(function(data){
                   var response = JSON.parse($rootScope.decrypt(data._resp))

                   if(response.code == 1){
                   	pQA.MobileNo = response.data.RefereeMobileNumber
                   	
                   }
                },function(err){

                })
        }


 	/* navigate to product Pages */

 		pQA.getQuotePageNav = function(val){
 			 pQA.MobileNo = pQA.responseData.RefereeMobileNumber

                   /*if(response.code == 1 && angular.isUndefined($rootScope.ShowPopUp) ){*/
                   	$rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Hi "+pQA.responseData.RefereeName,
                    "modalBodyText": "I authorize ABHICL and associate partners to contact me through my email/call/SMS. This will override registry on the DNCR.",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "gtagPostiveFunction" : "click-button, refer-friend , refer-friend-Consent-OK",
                    "showAlertModal": true,
                    "hideCloseBtn" : true,
                    "positiveFunction": function(){
                                        genrateLeadService(val);
                                        //$rootScope.ShowPopUp = false;
                                    }
                	}	
                   	
                  /* }*/
 			
 			
 			 //$window.location.href = window.location.origin +"/#!/"+ val+'?mobNo='+pQA.MobileNo
 			 //$window.location.href = window.location.origin +"buy-online-health-v2/"+ val+'?mobNo='+pQA.MobileNo

 		}
 		if($window.screen.height < 800 ){
				
		                //return false;
			}

}]);

/*	
	End of controller
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/


