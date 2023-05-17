var tYApp = angular.module("thankYouApp", []);

tYApp.controller("thankYou", ['$rootScope', 'appService', 'ABHI_CONFIG','$location','$sce','$timeout' , '$window', function($rootScope, appService, ABHI_CONFIG, $location,$sce,$timeout,$window) {

	/* Data Initilization */

		var tY = this;
	    var aS = appService;
	    tY.ratingArray = [0,1,2,3,4,5,6,7,8,9,10]
	    tY.selelctedRating = 0;
	    tY.easeToNavigation = 0;
	    tY.easeToUnderstanding = 0;
	    tY.improvements = ""
	    tY.showNavAndUnder = false;
	    tY.showAppointment = false;
	    tY.MEProposalNumbers = [];
	    tY.displayIframe = false;
	    tY.thankYouPageType = window.location.hash.substring(3);
	    tY.selectValue = 'Y';
	    tY.mobileNo = sessionStorage.getItem('mobNo');
		tY.IMDCode = sessionStorage.getItem('imdCode');

		const IDFCIMDCODE = "2115779";
		function isIDFCPasa() {
			tY.isIDFCPasa =  sessionStorage.getItem('imdCode') === IDFCIMDCODE ? true : false;
		}
		
		isIDFCPasa();

	    var prequoteData = JSON.parse(sessionStorage.getItem('prequoteData'));
		tY.otheroffering = [
			{"key":"Life Insurance","val":false},
			{"key":"Health Insurance","val":false},
			{"key":"Motor/Travel Insurance","val":false},
			{"key":"Mutual Funds","val":false},
			{"key":"Pension Funds","val":false},
			{"key":"Stock Broking","val":false},
			{"key":"Housing Loan","val":false},
			{"key":"Loans","val":false}
		];

	/* End of data initilization */


	/* Route Change Start */

		$rootScope.$on('$routeChangeStart', function (event, next, prev) {
	        if(angular.isUndefined(prev)){
	            return false;
	        }
	        if(prev.$$route.controller == 'thankYou' && next.$$route.controller != 'paymentDone'){
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "You are not authorized to go back.",
					"showCancelBtn": false,
					"modalSuccessText" : "Ok",
					"showAlertModal": true,
				}
				$rootScope.showWhiteLoader = false;
				event.preventDefault();
			}
	    })

	/* End of route change start */


    /* Get Thank you page details */

	    function getThankYouDetails() {
	        aS.postData(ABHI_CONFIG.apiUrl + "GEN/TY", {
	                "ReferenceNumber": sessionStorage.getItem('rid')
	            }, true, {
	                headers: {
	                    'Content-Type': 'application/json' 
	                }
	            })
	            .then(function(response) {
                    aS.triggerSokrati(); /* Triggering Sokrati */
                    
                    /* Pixel Code */

                    	var pixelCode = "<img src='https://opicle.go2cloud.org/aff_l?offer_id=5694&adv_sub="+sessionStorage.getItem('leadId');+"' width='1' height='1' />";	
						pixelCode += "<img src='https://geoadmedia.go2cloud.org/aff_l?offer_id=735&adv_sub="+sessionStorage.getItem('leadId');+"' width='1' height='1'  />";	
						$('#thank-you-page').append(pixelCode);

					/* End of pixel Code */

	                if (response.ResponseCode == 1) {
	                    tY.thankyouDetails = response.ResponseData;
	                     $rootScope.leminiskObj =  tY.thankyouDetails
            
            			$rootScope.lemniskCodeExcute();	
	                    tY.thankDetails = [];
	                    var secureProject = true;
	                    var securePresent = true;
	                    tY.rfbProjectName = new String();
	                    angular.forEach(tY.thankyouDetails.ThankyouDetails,function(v,i){
	                    	tY.gtagLabel = v.ProductName;
	                    	if(v.PolicyStatus.trim() == 'ME'){
	                    		tY.showAppointment = true;
	                    		if((v.ProductCode == 'PA' || v.ProductCode == 'CI' || v.ProductCode == 'CS') && secureProject){
	                    			tY.MEProposalNumbers.push(v.ProposalNumber);
	                    			secureProject = false;
	                    		}
	                    		if(v.ProductCode == "PL" || v.ProductCode == "FIT" ||v.ProductCode == "DI" || v.ProductCode == "AC"){
	                    			tY.MEProposalNumbers.push(v.ProposalNumber);
	                    		}
	                    	}
	                    	if(v.ProductCode == 'PL'){
	                    		v.actProductName = "Activ Health";
	                    		v.subProductName = "Platinum - "+v.PlanName;
	                    		tY.thankDetails.push(v);
	                    	}
							if(v.ProductCode == 'FIT'){
	                    		v.actProductName = "Activ Fit";
	                    		v.subProductName = "Fit - "+v.PlanName;
	                    		tY.thankDetails.push(v);
	                    	}
	                    	if(v.ProductCode == 'DI'){
	                    		v.actProductName = "Activ Assure";
	                    		v.subProductName = "Diamond";
	                    		tY.thankDetails.push(v);
	                    	}
	                    	if(v.ProductCode == 'CK'){
	                    		v.actProductName = "Corona Kavach";
	                    		v.subProductName = "COVID 19 ";
	                    		tY.thankDetails.push(v);
							}
							if(v.ProductCode == 'AS'){
	                    		v.actProductName = "Arogya Sanjeevani";
	                    		v.subProductName = "Arogya Sanjeevani";
	                    		tY.thankDetails.push(v);
	                    	}
							if(v.ProductCode == 'ST'){
	                    		v.actProductName = "Super Top up";
	                    		v.subProductName = "Super Top up";
	                    		tY.thankDetails.push(v);
	                    	}
	                    	if(v.ProductCode == 'AC'){
	                    		v.actProductName = "Activ Care";
	                    		v.subProductName = "Activ Care Senior Citizen";
	                    		tY.thankDetails.push(v);
	                    	}
	                    	if((v.ProductCode == 'PA' || v.ProductCode == 'CI' || v.ProductCode == 'CS') && securePresent){
	                    		v.actProductName = "Activ Secure";
	                    		tY.thankDetails.push(v);
	                    		securePresent = false;
	                    	}
	                    	if(v.ProductCode == 'PA'){
	                    		tY.rfbProjectName = tY.rfbProjectName + " Personal Accident ";
	                    	}
	                    	if(v.ProductCode == 'CI'){
	                    		tY.rfbProjectName = tY.rfbProjectName + " Critical Illness ";
	                    	}
	                    	if(v.ProductCode == 'CS'){
	                    		tY.rfbProjectName = tY.rfbProjectName + " Cancer Secure ";
	                    	}
	                    	if(v.ProductCode == 'ST'){
	                    		tY.rfbProjectName = tY.rfbProjectName + " Super Top Up ";
	                    	}
	                    });
						let user_details = JSON.parse(sessionStorage.getItem('userData'));
						if(user_details){
							let user ={
								name: user_details.ProductSummary[0].MemberDetails[0].Name,
								email: user_details.Email,
								mobile: user_details.MobileNumber,
								policy_type:user_details.SumInsuredType,
								intermediary_name: null,
								sum_insured:user_details.ProductSummary[0].MemberDetails[0].SumInsured,
								PolicyNumber: response.ResponseData.ThankyouDetails[0].PolicyNumber,
								ProposalNumber:response.ResponseData.ThankyouDetails[0].ProposalNumber
							}
							setTimeout(function(){ 
								litmusCode('','Issuance',user,'buy-journey-page','');
							  }, 5000);
							  sessionStorage.removeItem('userData');
						}

	                    //$('#whatsapp-modal').modal('show');
	                    console.log(tY.thankDetails)
	                } else {
	                    $location.url('payment-done');
	                }
	                if(response.ResponseData.ThankyouDetails.length != 1){
	                	tY.gtagLabel = "cross-sell"
	                }
	            }, function(err) {
	            });
	    }

		getThankYouDetails();

    /* Get Thank you page details Ends */

	// Abha id creation
	
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

	// Abha id creation

    /* Send Feedback and Rating details */

	    tY.submitFeedback = function() {
	        aS.postData(ABHI_CONFIG.apiUrl + "GEN/Feedback", {
	                "ReferenceNumber": sessionStorage.getItem('rid'),
					"Feedback":tY.improvements,
					"BuyingRating": tY.selelctedRating ,
					"NavigationRating": tY.easeToNavigation ,
					"UnderstandingRating":tY.easeToUnderstanding 
					
	            }, false, {
	                headers: {
	                    'Content-Type': 'application/json'
	                }
	            })
	            .then(function(response) {
	                if (response.ResponseCode == 1) {
	                      $rootScope.alertData = {
	                        "modalClass": "regular-alert",
	                        "modalHeader": "Success",
	                        "modalBodyText": response.ResponseMessage,
	                        "showCancelBtn": false,
	                        "modalSuccessText": "OK",
	                        "modalCancelText": "No",
	                        "showAlertModal": true,
	                    }
	                } else {
	                    $rootScope.alertData = {
	                        "modalClass": "regular-alert",
	                        "modalHeader": "Error",
	                        "modalBodyText": response.ResponseMessage,
	                        "showCancelBtn": false,
	                        "modalSuccessText": "OK",
	                        "modalCancelText": "No",
	                        "showAlertModal": true,
	                        "positiveFunction": function() {
	                            window.history.back();
	                        }
	                    }
	                }
	            }, function(err) {
	            });
	    }

    /* Send Feedback and Rating details Ends */


    /* show and hide ease to navigation and Understamnding */

    	tY.changeValue = function(val){
    		if(val < 8){
    			tY.showNavAndUnder = true
    		}else{
    			tY.showNavAndUnder = false;
    			tY.easeToNavigation = 0;
    			tY.easeToUnderstanding = 0;
    		}
    	}

    /* show and hide ease to navigation and Understamnding ends */	


    /* To book appointment */

		tY.trustSrc = function(src) {
		    return $sce.trustAsResourceUrl(src);
		}

		tY.checkAppointments = function(){
            $rootScope.callGtag('click-button', 'thank-you' ,'['+tY.thankYouPageType+']_get-appointment');
		 	if(tY.MEProposalNumbers.length > 1){
		 		$('#ppmc-modal').modal('show');
    		}else{
    			tY.bookAppointment(tY.MEProposalNumbers[0],false);
    		}
		 }

    	tY.bookAppointment = function(proposalNum,isIframe){
    		var requestObj = {
                "t": 3,
                "v": [proposalNum],
                "u": "Customer_Portal",
                "ci":"ABHI",
                "ck": ABHI_CONFIG.hAPPMCToken
            }
            $rootScope.callGtag('click-button', 'thank-you' ,'['+window.location.hash+']_book-appointment');
            aS.postData(ABHI_CONFIG.hAService+'HAAHC/GetHPUrl',requestObj, true, {
	                headers: {
	                    'Content-Type': 'application/json' 
	                }
	            })
             		.then(function(data){
             			if(data.Code == 1){
             				if(isIframe){
		    					tY.displayIframe = true;
		    					$('#ppmc-modal').modal('hide');
		    					$timeout(function(){
		    						tY.ppmcUrl = data.Data.access_url;
		    					},600);
             				}else{
             					window.open(data.Data.access_url, '_blank');
             				}
             			}
             		},function(err){

             		});
    	}

    	tY.closeIframe = function(){
	    	tY.displayIframe = false;
	    	tY.ppmcUrl = "";
    	}

    /* End of booking appointment */


    
    tY.openModelForMobileNo = function(){
    	 $window.gtag('event', 'click-button' , {'event_category': 'buy-online_thank-you','event_label': 'app_downloadModel-Open-thankyou' })
    	 $('#pan-card-modal').modal({backdrop: 'static', keyboard: false});
    }



    tY.submitMobileNo = function(){
    	 $window.gtag('event', 'click-button' , {'event_category': 'buy-online_thank-you','event_label': 'app_download-link-send-thankyou' })
    	 aS.getData('https://www.adityabirlacapital.com/healthinsurance/hservices_v2/api/registration/sendAppDownloadLink?Mobileno='+tY.mobileNo,'',true,{
                headers: {
                    'Content-Type': 'application/json' 
                }
            }).then(function(data){
            	console.log(data)
            	if(data.code == '1'){
            		$rootScope.alertConfiguration('S',data.msg);
            	}
            })
    }



    /* To optin whatsapp */

    	tY.optinWhatsapp = function(){
    		if(tY.selectValue == 'N'){
    			$('#whatsapp-modal').modal('hide');
    			return false;
    		}
    		aS.postData(ABHI_CONFIG.communicationUrl+'api/WatsApp/OptIn',{
                "MobileNumber":prequoteData.prequote.MobileNo,
                "MemberID": "",
                "Source":"PORTAL"
            },true,{
                headers: {
                    'Content-Type': 'application/json' 
                }
            }).then(function(data){
    			$('#whatsapp-modal').modal('hide');
                if(data.code = 1){
                	$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "You successfully optin for whatsapp.",
						"showCancelBtn": false,
						"modalSuccessText" : "Ok",
						"showAlertModal": true,
					}
                }else{
                	$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "Some error occurred.",
						"showCancelBtn": false,
						"modalSuccessText" : "Ok",
						"showAlertModal": true,
					}
                }
            },function(err){

            });
    	}
		tY.otherofferingSubmit = function() {	
			//   var validateCrossSell = tY.validateCrossSellData();
				var otherOfferingsVal = "";
				var otherOfferingvalue = "";
				for(var i=0;i<tY.otheroffering.length;i++){
				  if(tY.otheroffering[i].val == true){
					  otherOfferingsVal = otherOfferingsVal+ tY.otheroffering[i].key+"|";
				  }
				  otherOfferingvalue = otherOfferingsVal.slice(0,-1)
				}
				tY.acceptTermsncondition = true;
				if(otherOfferingvalue == "" && tY.acceptTermsncondition){
				  otherOfferingvalue = "Health Insurance";
				} 
			  aS.postData(ABHI_CONFIG.apiUrl + "/GEN/PushLeadToOneCRM", {
				  "ReferenceNo": sessionStorage.getItem('rid'),
				  "OtherOfferings": otherOfferingvalue
		  
			  }, true, {
				  headers: {
					  'Content-Type': 'application/json'
				  }
			  })
			  .then(function(response) {
				  if (response.ResponseCode == 1) {
					  if(tY.popupotheroffering == true){
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Success",
							"modalBodyText": "Great! Our Advisor will get in touch. Thanks.",
							"showCancelBtn": false,
							"modalSuccessText": "OK",
							"modalCancelText": "No",
							"showAlertModal": true,
							"positiveFunction": function() {
								tY.otheroffering.forEach(function(e){
									e.val = false;
								})
								tY.popupotheroffering = false;
								tY.acceptTermsncondition = false;
							}
						}
					  }	  
					  } else {
						if(tY.popupotheroffering == true){
						  $rootScope.alertData = {
							  "modalClass": "regular-alert",
							  "modalHeader": "Error",
							  "modalBodyText": response.ResponseMessage,
							  "showCancelBtn": false,
							  "modalSuccessText": "OK",
							  "modalCancelText": "No",
							  "showAlertModal": true,
							  "positiveFunction": function() {
								tY.otheroffering.forEach(function(e){
									e.val = false;
								})
								tY.popupotheroffering = false;
								tY.acceptTermsncondition = false;
							  }
						  }
					  }
					}
				  }, function(err) {
				  });
			  
		
		}
    /* End of optin whatsapp */

	/* cross sell on thank you page start */
	tY.validateCrossSellData = function(){	
		if(tY.otheroffering[0].val == true || tY.otheroffering[1].val == true || tY.otheroffering[2].val == true || tY.otheroffering[3].val == true || tY.otheroffering[4].val == true || tY.otheroffering[5].val == true || tY.otheroffering[6].val == true || tY.otheroffering[7].val == true){
			tY.popupotheroffering = true;
			tY.otherofferingSubmit();
			
		}
		else{
			$rootScope.alertConfiguration('E',"Please select atlease one product" , "cross-sell");
			
		} 
	}
	/*cross sell on thank you page end */
	/* navigate to bottom */
	tY.naviageteTOCrossSell = function(){
		$('html, body').animate({
	   'scrollTop' : $("#cross-sell-section").offset().top
   });
   }

	/* navigate to bottom */

 }]);