'use strict';
var customerProfileApp = angular.module('customerProfileApp', []);

customerProfileApp.controller("customer-profile", ['$scope', 'ABHI_CONFIG', 'appService', '$timeout', '$window', '$rootScope', '$location', '$sessionStorage', 'RenewService', '$routeParams', function ($scope, ABHI_CONFIG, appService, $timeout, $window, $rootScope, $location, $sessionStorage, RenewService, $routeParams) {
    var cP = this;
    var aS = appService;
    cP.cpDetails = {};
    //if encpted value able to dect by function it will work else it will work on pn
    // if($routeParams.pn){
        var policyNumberDec = $rootScope.decrypt($routeParams.pn.replace(' ', '+'));
            console.log(`pn after dec ${policyNumberDec}`);
    // }else
    // {
    //     policyNumberDec = "26-22-8657821-00"
    // }

    var policyNumberRoute = policyNumberDec ? policyNumberDec : $routeParams.pn;
    
    cP.profile = {
        policyNumber: policyNumberRoute,
        noProfileData: false,
        noProfileMessage: '',
        email: '',
        mobile: '',
        enterOTP: false,
        enterEmailOTP: false,
        enterMobileOTP: false,
        otpValue: '',
        verifyOTPMessage: '',
        requestOTPMessage: '',
        updateMessage: '',
        enableEmail: false,
        enableMobile: false,
        enableSubmit: false,
        enableSubmitEmail: false
    }

    getCustomerData();

    function getCustomerData() {
        aS.postData(ABHI_CONFIG.apiUrl + "Renew/GetMobEmailID",
            {
                "PolicyNumber": cP.profile.policyNumber // "21-22-0196365-00"
            }, true,)
            .then((respData) => {
                if (respData.ResponseCode == 0) {
                    cP.profile.noProfileData = true;
                    cP.profile.noProfileMessage = respData.ResponseMessage;
                    // $rootScope.alertData = {
                    //     "modalClass": "regular-alert",
                    //     "modalHeader": "Alert",
                    //     "modalBodyText": respData.ResponseMessage,
                    //     "showCancelBtn": false,
                    //     "modalSuccessText": "Ok",
                    //     "showAlertModal": true,
                    //     "hideCloseBtn": true
                    // }
                } else {
                    cP.profile.noProfileData = false;
                    cP.cpDetails = respData.ResponseData;
                }
            });
    };

    cP.toggleConfigs = function (form, type, clear) {
        //clean passed flags
        cP.profile = {
            policyNumber: policyNumberRoute,
            email: '',
            mobile: '',
            enterOTP: false,
            enterEmailOTP: false,
            enterMobileOTP: false,
            otpValue: '',
            verifyOTPMessage: '',
            requestOTPMessage: '',
            updateMessage: '',
            enableEmail: false,
            enableMobile: false,
            enableSubmit: false,
            enableSubmitEmail: false
        }

        if (type === 'email') {
            cP.profile.enableEmail = true;
            cP.profile.enableMobile = false;
        }

        if (type === 'mobile') {
            cP.profile.enableMobile = true;
            cP.profile.enableEmail = false;
        }

        if (clear) {
            cP.profile.enableMobile = false;
            cP.profile.enableEmail = false;
        }
    }

    cP.sendOTP = function (form, type) {

        let mobVerification = "";
        let emailVerification = "";
        let email = "";
        let mobile = "";

        if (cP.profile.mobile != "" && cP.profile.mobile !== cP.cpDetails.MobileNumber) {
            mobVerification = "Y";
            mobile = cP.profile.mobile;
            email = cP.cpDetails.EmailID;
        }

        if (cP.profile.email != "" && cP.profile.email !== cP.cpDetails.EmailID) {
            emailVerification = "Y";
            mobile = cP.cpDetails.MobileNumber;
            email = cP.profile.email;
        };

        let configs = {
            "ReferenceNumber": cP.cpDetails.ReferenceNumber,
            "PolicyNumber": cP.profile.policyNumber,
            "MobileNumber": mobile,
            "EmailID": email,
            "MobVerification": mobVerification,
            "EmailVerification": emailVerification
        }

        aS.postData(ABHI_CONFIG.apiUrl + "renew/RequestOTPForEmailMobVerification", configs, true)
            .then((respData) => {
                if (respData.ResponseCode == 0) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": respData.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true
                    }
                } else if (respData.ResponseCode == 1) {
                    if (type === 'email') {
                        cP.profile.enterEmailOTP = true;
                    }

                    if (type === 'mobile') {
                        cP.profile.enterMobileOTP = true;
                    }

                    cP.profile.requestOTPMessage = respData.ResponseData.ErrorMessage;
                }
            });
    };

    cP.verifyOTP = function (form, type) {
        let mobVerification = "";
        let emailVerification = "";

        if (cP.profile.mobile != "" && cP.profile.mobile !== cP.cpDetails.MobileNumber) {
            mobVerification = "Y"
        }
        if (cP.profile.email != "" && cP.profile.email !== cP.cpDetails.EmailID) {
            emailVerification = "Y"
        };

        let configs = {
            "ReferenceNumber": cP.cpDetails.ReferenceNumber,
            "PolicyNumber": cP.profile.policyNumber,
            "MobileNumber": cP.profile.mobile,
            "EmailID": cP.profile.email,
            "EmailVerification": emailVerification,
            "MobVerification": mobVerification,
            "OTP": cP.profile.otpValue
        }

        aS.postData(ABHI_CONFIG.apiUrl + "renew/VerifyOTPForEmailMobVerification",
            configs, true,)
            .then((respData) => {
                cP.profile.requestOTPMessage = "";
                cP.profile.verifyOTPMessage = respData.ResponseData;
                if (respData.ResponseData !== "Entered OTP is incorrect") {

                    if (type === 'email') {
                        cP.profile.enableSubmitEmail = true;
                        cP.profile.enableSubmit = false;
                    }

                    if (type === 'mobile') {
                        cP.profile.enableSubmit = true;
                        cP.profile.enableSubmitEmail = false;
                    }
                }
            });
    };

    cP.submitDetailsWithNoChanges = function () {
        let updateData = {
            "ReferenceNumber": cP.cpDetails.ReferenceNumber,
            "PolicyNumber": cP.profile.policyNumber,
            "MobileNumber": cP.cpDetails.MobileNumber,
            "EmailID": cP.cpDetails.EmailID,
            "MobUpdate": "N",
            "EmailUpdate": "N"
        }

        aS.postData(ABHI_CONFIG.apiUrl + "Renew/UpdateMobEmailID",
            updateData, true,)
            .then((respData) => {
                if (respData.ResponseCode == 1) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalBodyText": "Thank you for your confirmation.",
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                        "positiveFunction": function() {
                            //while production deployment need to update prod url
                            //PROD 
                           // $window.location.href = "https://www.adityabirlacapital.com/healthinsurance/homepage"; 
                            $window.location.href = "https://mtpre.adityabirlahealth.com/healthinsurance/homepage"; 
						}

                    }
                }
            });

    }

    cP.submitCustomerDetails = function () {
        let mobVerification = "";
        let emailVerification = "";
        let email = "";
        let mobile = "";

        if (cP.profile.mobile != "" && cP.profile.mobile !== cP.cpDetails.MobileNumber) {
            mobVerification = "Y";
            mobile = cP.profile.mobile;
            email = cP.cpDetails.EmailID;
        }

        if (cP.profile.email != "" && cP.profile.email !== cP.cpDetails.EmailID) {
            emailVerification = "Y";
            mobile = cP.cpDetails.MobileNumber;
            email = cP.profile.email;
        };

        let updateData = {
            "ReferenceNumber": cP.cpDetails.ReferenceNumber,
            "PolicyNumber": cP.profile.policyNumber,
            "MobileNumber": mobile,
            "EmailID": email,
            "MobUpdate": mobVerification,
            "EmailUpdate": emailVerification
        }

        aS.postData(ABHI_CONFIG.apiUrl + "Renew/UpdateMobEmailID",
            updateData, true,)
            .then((respData) => {
                if (respData.ResponseCode == 1) {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Details updated successfully",
                        "modalBodyText": respData.ResponseData.ErrorMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                        "positiveFunction": function () {
                            getCustomerData();

                            cP.profile = {
                                policyNumber: policyNumberRoute,
                                email: '',
                                mobile: '',
                                enterOTP: false,
                                otpValue: '',
                                verifyOTPMessage: '',
                                requestOTPMessage: '',
                                updateMessage: '',
                                enableEmail: false,
                                enableMobile: false
                            }
                        },
                    }
                }
            });
    }

}]);