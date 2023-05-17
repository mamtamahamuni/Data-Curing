/**
	Module: VIL Login Controller
	Author: Pandurang Sarje
	Date: 12-01-2021
**/

'use strict';

var vLApp = angular.module("vilLoginApp",[]);

vLApp.controller("vil-login", ['$scope', '$rootScope', '$sessionStorage', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$http' , '$q', function($scope, $rootScope, $sessionStorage, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $http, $q) {

    /*----- To delete existing login data ---*/
    
    if($sessionStorage.coiDetails != null || $sessionStorage.coiDetails != 'undefined'){
        delete $sessionStorage.coiDetails;
    }

    /*----- End of To delete existing login data ---*/
    
    /* Data Inilization */

    var aS = appService;
    $scope.OTPValue = '';
    $scope.OTPSent = false; 
    $scope.OTPText = 'Otp Send Successfully';
    $scope.errorCaptcha = false;
    $scope.enteredCaptcha = '';

    /* End of Data Inilization */

    /* Intialization of auth scope */

	$scope.auth = {
        'certificateNumber' : '',
        'txtMobileNumber' : ''
	};

    /* End of Intialization of auth scope */

    /* To reomove spaces from string */

    function removeSpaces(string) {
        return string.split(' ').join('');
    }

    /* End of To reomove spaces from string */
    
    /* To Generate Captcha Code */

    $scope.GenerateCaptcha = function() {
        var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        var i;
        var code = "";
        for (i = 0; i < 6; i++) {
            code = code + alpha[Math.floor(Math.random() * alpha.length)] + " ";
        }
        $scope.mainCaptcha = code;
    }
    
    $scope.GenerateCaptcha();

    /* End of To Generate Captcha Code */

    /* To Validate Captcha Code */

    $scope.ValidateCaptcha = function () {
        $rootScope.showLoader = true;
        var string1 = removeSpaces($scope.mainCaptcha);
        var string2 = removeSpaces($scope.enteredCaptcha.toUpperCase());
        if (string1 == string2) {
            $rootScope.showLoader = false;
            $scope.errorCaptcha = false;
            return true;
        }
        else {
            $rootScope.showLoader = false;
            $scope.errorCaptcha = true;
            return false;
        }
    }

	/* End of To Validate Captcha Code */

    /* To validate user entered details & to get COI*/

    $scope.validateDetails = function (auth, form) {
        if (form.txtMobileNumber.$error.pattern) {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Invalid Mobile Number",
				"modalBodyText": "Please enter valid mobile number.",
				"showCancelBtn": false,
				"modalSuccessText": "Close",
				"showAlertModal": true,
				"hideCloseBtn": true
            }
        } else {
            if (!form.$$success.parse || form.$$success.parse.length < 3) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Insufficient details",
					"modalBodyText": "Please provide all details.",
					"showCancelBtn": false,
					"modalSuccessText": "Close",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
			} else {
        
                var inputs = $(".vil-form .form-control");
				var ind = 0;
				for (var i = 0; i < inputs.length; i++) {
					if ($(inputs[i]).val() == '') {
						ind = ind + 1;
					}
				}
				if (ind >= 1) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Insufficient details",
						"modalBodyText": "Please provide all details.",
						"showCancelBtn": false,
						"modalSuccessText": "Close",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
					return false;
				}

                var isValidCaptccha = $scope.ValidateCaptcha();

                if(!isValidCaptccha){
					return false;
                }

                var coiObject = {

                    "COINumber":auth.certificateNumber,
                    "Mobile_No":auth.txtMobileNumber

                };

                $http.defaults.headers.common['p1'] = '';
                $http.defaults.headers.common['p2'] = 'bzi6xdEQmDTdRGUzsF99Cw=='; // encrypted for app/website
                $http.defaults.headers.common['p3'] = '76mOIGX9yoXJcn9AvqJG3Q==';
                $http.defaults.headers.common['p4'] = 'JTPdpgaOfcnB62c3kAoWKQ==';

                aS.postData(ABHI_CONFIG.hservicesv2 + "/Hospicash/GetCOI", {
                    "_data": $rootScope.encrypt(coiObject)
                }, true, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'x-client-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                        'x-abhi-api-key' : 'BFA9AF04-696E-4EFD-BD4E-EED9F6CCDBF5',
                        'x-abhi-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                        'X-NewRelic-ID' :'VgcHVlRaDBACU1lTDgQPV1U='
                    }
                })
                .then(function (data) {
                    var response = JSON.parse($rootScope.decrypt(data._resp));
                        
                    if (response.code == 1){
                        $scope.coiDetails = response.data.COIDetails;
                        $sessionStorage.coiDetails = $scope.coiDetails;
                        $scope.userMobileNo = $scope.coiDetails[0].Mobile_No;
                        //$location.url('vil-raise-track');
                        $scope.generateOTP();
                    } else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": 'Please enter correct COI and mobile number combination.',
                            "showCancelBtn": false,
                            "modalSuccessText": "Ok",
                            "showAlertModal": true,
                            "hideCloseBtn": true
                        }
                    }
                    
                }, function (err) {

                })

            }
        }
    }
    
    /* To validate user entered details & to get COI*/

    /* Function To Generate OTP */

    $scope.generateOTP = function (resendOtp){
    
        if($scope.coiDetails != null && $scope.coiDetails != 'undefined' && $scope.userMobileNo != null && $scope.userMobileNo != 'undefined'){
            
            $http.defaults.headers.common['p1'] = '';
            $http.defaults.headers.common['p2'] = 'bzi6xdEQmDTdRGUzsF99Cw==';
    
            var encryptedOTP = $rootScope.encrypt($scope.userMobileNo);
    
            aS.getData(ABHI_CONFIG.hservicesv2 + "/Token/GenerateOTPNew?mobileNo=" +encryptedOTP, "", 
            true, {
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8',
                    'x-abhi-api-key' : 'ZMsJVnVxxjL4CYxDBRBH',
                    'x-abhi-token' : 'V2kpIQwOsP2mroTNZhRk',
                    'Accept' : 'application/json;charset=utf-8',
                    'x-client-token': '',
                    'userToken': ''
                }
            })
            .then(function (data) {
                var response = JSON.parse($rootScope.decrypt(data._resp));
                    
                if (response.code == 1){
                    $scope.OTPSent = true;
                    if(resendOtp) {
                        $scope.OTPText = 'Otp Re-Send Successfully';
                    }
                } else{
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": 'Oops!! Something went wrong. Please try again later.',
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                }
                
            }, function (err) {
    
            })
        }

    }
    
    /* End of Function To Generate OTP */

    /* To Validate Otp */
    
    $scope.validateOTP = function (OTPValue, form){

      if(form.otpvalue.$error.pattern || form.otpvalue.$error.minlength){
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Invalid OTP",
                "modalBodyText": 'Plase Enter Valid OTP.',
                "showCancelBtn": false,
                "modalSuccessText": "Ok",
                "showAlertModal": true,
                "hideCloseBtn": true
            }      
    } else {
        if (!form.$$success.parse || form.$$success.parse.length < 1) {
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Insufficient details",
                "modalBodyText": "Please enter OTP",
                "showCancelBtn": false,
                "modalSuccessText": "Close",
                "showAlertModal": true,
                "hideCloseBtn": true
            }
        } else {

            var inputs = $(".vil-form-otp .form-control");
            var ind = 0;
            for (var i = 0; i < inputs.length; i++) {
                if ($(inputs[i]).val() == '') {
                    ind = ind + 1;
                }
            }
            if (ind >= 1) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Insufficient details",
                    "modalBodyText": "Please enter OTP",
                    "showCancelBtn": false,
                    "modalSuccessText": "Close",
                    "showAlertModal": true,
                    "hideCloseBtn": true
                }
                return false;
            }

            $http.defaults.headers.common['p1'] = '';
            $http.defaults.headers.common['p2'] = 'bzi6xdEQmDTdRGUzsF99Cw==';
    
            var encryptedOTP = $rootScope.encryptWithoutString(OTPValue);
            var encryptedMobNo = $rootScope.encryptWithoutString($scope.userMobileNo);

            aS.getData(ABHI_CONFIG.hservicesv2 + "/Token/VerifyToken?OTP=" +encryptedOTP+ '&mobNo=' + encryptedMobNo, "", 
            true, {
                headers: {
                    'p1': '', 
                    'p2': 'bzi6xdEQmDTdRGUzsF99Cw=='
                }
            })
            .then(function (data) {
                var response = JSON.parse($rootScope.decrypt(data._resp));
                    
                if (response.code == 1){
                    $location.url('vil-raise-track');
                } else{
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": 'OTP is Invalid.',
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                        "positiveFunction": function(){
                            window.location.reload();
                        }
                    }
                }
                
            }, function (err) {
    
            })

        }
     }

    } 
    /* To Validate Otp */

    /*To Speak Catcha Code */

    $('#speak').click(function(){
        var text = $('#mainCaptcha').val();
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[0];
        msg.rate = 0.1;
        msg.pitch = 0;
        msg.text = text;
        msg.onend = function(e) {
            console.log('Finished in ' + event.elapsedTime + ' seconds.');
        };
        speechSynthesis.speak(msg);
    })

   /*End of To Speak Catcha Code */

}]);