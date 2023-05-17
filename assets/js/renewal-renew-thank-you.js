/**   
	Module: Renewal Renew Thank You Page Controller (This module is end of Renew Journey where Renewed Policy Details (New Policy Number, Policy Start Date, etc) are shown & user can download the receipt of payment done.)
	Author: Pandurang Sarje 
  Date: 11-07-2020
**/

'use strict';

var renewApp = angular.module('renewModule', []);

renewApp.controller("renewal-renew-thank-you", ['ABHI_CONFIG', '$scope', '$timeout', '$window', '$rootScope', '$location', '$sessionStorage', 'RenewService', '$routeParams', function (ABHI_CONFIG, $scope, $timeout, $window, $rootScope, $location, $sessionStorage, RenewService, $routeParams) {

  /*---- Page Redirection When $sessionStorage.refNo Not Available ----*/

	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

  /*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
  
  /*---- Data Inilization ----*/

  $scope.renewDetails = [];
  $scope.otheroffering = [
    {"key":"Life Insurance","val":false},
    {"key":"Health Insurance","val":false},
    {"key":"Motor/Travel Insurance","val":false},
    {"key":"Mutual Funds","val":false},
    {"key":"Pension Funds","val":false},
    {"key":"Stock Broking","val":false},
    {"key":"Housing Loan","val":false},
    {"key":"Loans","val":false}
     ];

  /*---- End of  Data Inilization ----*/

  /*---------------------- To fetch Thank You Details ---------------------------*/
  $scope.PartPay=false;
  $scope.fetchThankyouDetails = function () {
    $scope.tyBody = {
      "ReferenceNo": $sessionStorage.refNo,
      "PolicyNumber": $sessionStorage.policyNo
    };
if($location.path() == '/part-payment-thank-you'){
  $scope.ty_api= "https://mtpre.adityabirlahealth.com/PartPayment/api/PartPayment/TY"
}
else if($location.path() == '/counter-offer-thank-you'){
  $scope.ty_api= ABHI_CONFIG.apiUrl+"CFRAcceptReject/TY";
  $scope.offerDetails =  JSON.parse(sessionStorage.getItem('counterOfferDetails'));
  $scope.tyBody = {
    "ReferenceNo": $sessionStorage.refNo,
    "ProposalNumber": $scope.offerDetails[0].proposalNo
  };
}
else{
  $scope.ty_api= ABHI_CONFIG.apiUrl+"Renew/TY";
}
    RenewService.postData($scope.ty_api,  $scope.tyBody,
        true
      )
      .then(function (data) {
        if (data.ResponseCode == 1) {
          $scope.thankYouPage = data.ResponseData;
          if($location.path() == '/part-payment-thank-you'){
            $scope.thankYouPage.Premium= $scope.thankYouPage.Amount;
            $scope.thankYouPage['ReceiptNo']= $scope.thankYouPage.ReceiptId;
            $scope.renewDetails.push($scope.thankYouPage);
            $scope.PartPay=true;
          }
          else if($location.path() == '/counter-offer-thank-you'){
            // $scope.thankYouPage.Premium= $scope.thankYouPage.Amount;
            // $scope.thankYouPage['ReceiptNo']= $scope.thankYouPage.ReceiptId;
            // $scope.renewDetails.push($scope.thankYouPage);
            // $scope.PartPay=true;
            return;
          }
          else{
            $scope.renewDetails = data.ResponseData.ThankyouDetails;
            $scope.autodebit = data.ResponseData.ThankyouDetails[0].Autodebit;
          }
          $scope.newDateFormat = new Date($scope.renewDetails[0].PolicyStartDate);

          let user_details = JSON.parse(sessionStorage.getItem('userData'));
          if(user_details){
            let user ={
              name: user_details.NameOfTheProposer,
              email: user_details.Email,
              mobile: user_details.Mobile,
              policy_type:user_details.SumInsuredType,
              intermediary_name: null,
              sum_insured:user_details.InsuredMembers[0].SumInsured,
              PolicyNumber:user_details.PolicyNumber
            }
            setTimeout(function(){
              litmusCode('','Renewal',user,'renewal_renew_page','');
            }, 5000)
            sessionStorage.removeItem('userData')
          }
          omniDropOff();
        } else if (data.ResponseCode == 0) {
          let errMsg = $location.path() != '/counter-offer-thank-you'?"<h4 style='pointer-events:visible;'>We have received your payment. Reach on <a href='mailto:Care.healthinsurance@adityabirlacapital.com'>care.healthinsurance@adityabirlacapital.com</a> or call <a href='tel:1800-270-7000'>1800-270-2700</a>. Reference Number: "+$sessionStorage.refNo+"</h4>":"Oops! Something went wrong. Please contact your nearest ABHI branch or call our toll free number 1800-270-7000 for quick assistance"
          $rootScope.alertData = {
            "modalClass": "regular-alert",
            "modalHeader": "Alert",
            "modalBodyText": errMsg,
            "showCancelBtn": false,
            "modalSuccessText": "Ok",
            "showAlertModal": true,
            "hideCloseBtn": true
          }
        }
      })
  }

  $scope.fetchThankyouDetails();

  /*---------------------- End of To fetch Thank You Details ---------------------------*/

  /*---------------------- To Download Receipt ---------------------------*/

  $scope.downloadReceipt = function () {
    var currentdate = new Date();
    var month = currentdate.getMonth() + 1;
    if (month < 10) {
      month = "0" + (currentdate.getMonth() + 1);
    }
    var day = currentdate.getDate();
    if (day < 10) {
      day = "0" + currentdate.getDate();
    }
    var year = currentdate.getFullYear();
    var newcurrentDate = month + '/' + day + '/' + year;

    var newCreatedDate = $scope.renewDetails[0].PolicyStartDate;

    var data = {
      "TemplateId": "F0D23CF1AC1B4BAD8C66",
      "Token": ABHI_CONFIG.templateGenerationToken,
      "TemplateData": [{
          "Key": "AMOUNT",
          "Value": $scope.renewDetails[0].Premium
        },
        {
          "Key": "RECEIPTNUMBER",
          "Value": $scope.renewDetails[0].ReceiptNo
        },
        {
          "Key": "INSTRUMENTNUMBER",
          "Value": $scope.renewDetails[0].InstrumentNumber
        },
        {
          "Key": "DATE",
          "Value": newcurrentDate
        },
        {
          "Key": "PROPOSERNAME",
          "Value": $scope.renewDetails[0].FirstName + ' ' + $scope.renewDetails[0].LastName
        },
        {
          "Key": "PAYMENTMODE",
          "Value": $scope.renewDetails[0].ModeOfPayment
        },
        {
          "Key": "BANKNAME",
          "Value": ""
        },
        {
          "Key": "POLICYNUMBER",
          "Value": $scope.renewDetails[0].PolicyNumber
        },
        {
          "Key": "PROPOSALNUMBER",
          "Value": $scope.renewDetails[0].ProposalNumber
        },
        {
          "Key": "CURRENTDATE",
          "Value": newcurrentDate
        },
        {
          "Key": "FINANCIALYEAR",
          "Value": $scope.renewDetails[0].FinancialYear
        }
      ],
      "TemplateKey": [],
      "TemplateDataPassed": true
    }

    RenewService.postData(ABHI_CONFIG.templateGenerationUrl+"Template/GenerateTemplate",
      data, true
    )
    .then(function (data) {
      if (data.ResponseCode == 1) {
        var URLToPDF = data.ResponseData.FileURL;
        var fileName = $scope.renewDetails[0].PolicyNumber;
        saveAs(URLToPDF, fileName);
      } else {
        $rootScope.alertData = {
          "modalClass": "regular-alert",
          "modalHeader": "Alert",
          "modalBodyText": 'There seems to be a problem. Please try again after some time.',
          "showCancelBtn": false,
          "modalSuccessText": "Ok",
          "showAlertModal": true,
          "hideCloseBtn": true
        }
      }
    })
  }

  /*---------------------- End of To Download Receipt --------------------*/

  /*---------------------- Omnni Channel Drop off Event ---------------------------*/

  function omniDropOff() {

    RenewService.postData(ABHI_CONFIG.apiUrl+"OmniChannel/RenewDropoff", {
          "ReferrenceNo": $sessionStorage.refNo,
          "PageName": "new-renewal-renew-thank-you"
        },
        true
      )
      .then(function (data) {
        if (data.ResponseCode == 1) {
          $sessionStorage.omniDropOffThnakYou = true;
        }
      })

  }

  /*----------------------  Omnni Channel Drop off Event Ends ---------------------------*/

  /*----------- To block navigating back from renew thank you page --------------*/

  $rootScope.$on('$routeChangeStart', function (e, newLocation, oldLocation) {
    if(angular.isUndefined(oldLocation)){
      return false;
    }
    if(oldLocation.$$route.originalPath == '/new-renewal-renew-thank-you' && newLocation.$$route.originalPath == '/renewPaymentProcess'){
      $rootScope.alertData = {
        "modalClass": "regular-alert",
        "modalHeader": "Alert",
        "modalBodyText": 'You are not authorized to go back.',
        "showCancelBtn": false,
        "modalSuccessText": "Ok",
        "showAlertModal": true,
        "hideCloseBtn": true
      }
      $rootScope.showWhiteLoader = false;
      e.preventDefault();
    }
  })
  
  /*----------- End of To block navigating back from renew thank you page -----------*/

    /* cross sell for thank you page start */
    $scope.naviageteTOCrossSell = function(){
      $('html, body').animate({
       'scrollTop' : $("#cross-sell-section").offset().top
      });
      }
      $scope.validateCrossSellData = function(){	
        if($scope.otheroffering[0].val == true || $scope.otheroffering[1].val == true || $scope.otheroffering[2].val == true || $scope.otheroffering[3].val == true || $scope.otheroffering[4].val == true || $scope.otheroffering[5].val == true || $scope.otheroffering[6].val == true || $scope.otheroffering[7].val == true){
          $scope.popupotheroffering = true;
          $scope.otherofferingSubmit();
          
        }
        else{
          $rootScope.alertConfiguration('E',"Please select atlease one product" , "cross-sell");
          
        } 
      }
       
      $scope.otherofferingSubmit = function() {	
        //   var validateCrossSell = tY.validateCrossSellData();
          var otherOfferingsVal = "";
          var otherOfferingvalue = "";
          for(var i=0;i<$scope.otheroffering.length;i++){
            if($scope.otheroffering[i].val == true){
              otherOfferingsVal = otherOfferingsVal+ $scope.otheroffering[i].key+"|";
            }
            otherOfferingvalue = otherOfferingsVal.slice(0,-1)
          }
          $scope.acceptTermsncondition = true;
          if(otherOfferingvalue == "" && $scope.acceptTermsncondition){
            otherOfferingvalue = "Health Insurance";
          } 
          RenewService.postData(ABHI_CONFIG.apiUrl + "/GEN/PushLeadToOneCRM", {
            "ReferenceNo": $sessionStorage.refNo,
            "OtherOfferings": otherOfferingvalue
        
          }, true, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(function(response) {
            if (response.ResponseCode == 1) {
              if($scope.popupotheroffering == true){
              $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Success",
                "modalBodyText": "Great! Our Advisor will get in touch. Thanks.",
                "showCancelBtn": false,
                "modalSuccessText": "OK",
                "modalCancelText": "No",
                "showAlertModal": true,
                "positiveFunction": function() {
                  $scope.otheroffering.forEach(function(e){
                    e.val = false;
                  })
                  $scope.popupotheroffering = false;
                  $scope.acceptTermsncondition = false;
                }
              }
              }	  
              } else {
              if($scope.popupotheroffering == true){
                $rootScope.alertData = {
                  "modalClass": "regular-alert",
                  "modalHeader": "Error",
                  "modalBodyText": response.ResponseMessage,
                  "showCancelBtn": false,
                  "modalSuccessText": "OK",
                  "modalCancelText": "No",
                  "showAlertModal": true,
                  "positiveFunction": function() {
                    $scope.otheroffering.forEach(function(e){
                    e.val = false;
                  })
                  $scope.popupotheroffering = false;
                  $scope.acceptTermsncondition = false;
                  }
                }
              }
            }
            }, function(err) {
            });
          
      
      }
    /* cross sell for thank u page end */


  /* feedback submit  */
  $scope.selectStar = function (value) {
    $scope.rateValue = value;
    };

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
        
  $scope.submitReview = function(){

    //console.log("$scope.rateValue" + $scope.rateValue + "$scope.description" + $scope.description)
    

    if( $scope.rateValue == undefined || $scope.rateValue == null ){
        //$rootScope.showAlertBox("Please provide your feedback.");
        $rootScope.alertConfiguration('E',"Please provide rate value." , "feedback");
    }
    if( $scope.description == undefined || $scope.description == null){
        //$rootScope.showAlertBox("Please provide your feedback.");
         $rootScope.alertConfiguration('E',"Please provide description." , "feedback");
        return;
    }

    var submitData = {
        "rating": $scope.rateValue,
        "Description": $scope.description,
        "ReferenceNo": $sessionStorage.refNo,
    }
    //RenewService.postData('insertRenewFeedback', submitData).
    RenewService.postData("https://www.adityabirlacapital.com/healthinsurance/hServices/api/RenewalPolicy/insertRenewFeedback", submitData,
        true
      ).
    then(function (response)
    {
        if(response.data == true){
            //$rootScope.showAlertBox("Thanks for submitting your feedback!");
             $rootScope.alertConfiguration('S',"Thanks for submitting your feedback." , "feedback");
            $scope.feedbackalert=true
            $scope.description = '';
            $scope.rateValue = "";
            
        }
        else {
           // $rootScope.showAlertBox("There seems to be a problem. Please try again after some time.");
            $rootScope.alertConfiguration('E',"There seems to be a problem. Please try again after some time." , "feedback");
            $scope.description = '';
            $scope.rateValue = "";
        }
    });
}

$scope.feedbackclose =function(){
    $location.url("home");
}
  /* feedback submit end  */  

}]);