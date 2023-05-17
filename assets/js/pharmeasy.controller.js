'use strict';
var pharmeasyApp = angular.module('pharmeasyApp', []);

pharmeasyApp.controller("pharmeasy-update", ['$scope', 'ABHI_CONFIG', 'appService', '$timeout', '$window', '$rootScope', '$location', '$sessionStorage', 'RenewService', '$routeParams', function ($scope, ABHI_CONFIG, appService, $timeout, $window, $rootScope, $location, $sessionStorage, RenewService, $routeParams) {
    var pe = this;
    var aS = appService;

    pe.profile = {
        enterMobileOTP: false,
        enableSubmit: true,
        showThankyou: false,
        showPeForm: false
    }



    pe.changeDate = function (day, month, year) {
        pe.profile.DOB = day + "-" + month + "-" + year;
    }

    pe.changePinCode = function (validPinCode, param) {
        if (validPinCode) {
            pe.profile.City = "";
            pe.profile.CustState = "";
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/PinCode", {
                "PinCode": pe.profile.pinCode
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (data) {
                    if (data.ResponseCode == 1) {
                        pe.profile.city = data.ResponseData.City;
                        pe.profile.state = data.ResponseData.State;
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "Ok",
                            "showAlertModal": true,
                            "hideCloseBtn": true,
                            "positiveFunction": function () {
                                pe.profile.pinCode = "";
                                pe.profile.city = "";
                                pe.profile.state = "";
                            }
                        }
                    }
                });
        } else {
            pe.profile.city = "";
            pe.profile.state = "";
        }
    }

    pe.nomineeRel = [{
        "key": "Spouse",
        "val": "Spouse"
    },
    {
        "key": "Mother",
        "val": "Mother"
    },
    {
        "key": "Father",
        "val": "Father"
    },
    {
        "key": "Son",
        "val": "Son"
    },
    {
        "key": "Daughter",
        "val": "Daughter"
    },
    {
        "key": "Other",
        "val": "Other"
    },];


    pe.sendOTP = function (form) {


        let configs = {
            "MobileNumber": pe.profile.mobile
        }

        aS.postData(ABHI_CONFIG.apiUrl + "Renew/RenewRequestOTP", configs, true,
            {
                'x-ob-bypass': 1
            })
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
                    pe.profile.enterMobileOTP = true;
                    pe.profile.requestOTPMessage = respData.ResponseMessage;
                }
            });
    };

    pe.verifyOTP = function (form, type) {
        let configs = {
            "OTP": pe.profile.otpValue,
            "MobileNumber": pe.profile.mobile
        };

        aS.postData(ABHI_CONFIG.apiUrl + "Renew/RenewVerifyOTP",
            configs, true, {
            'x-ob-bypass': 1
        })
            .then((respData) => {
                pe.profile.requestOTPMessage = respData.ResponseMessage;

                if (respData.ResponseCode == 1) {
                    pe.profile.showPeForm = true;
                } else if (respData.ResponseData !== "Entered OTP is expired or is inactive") {
                    pe.profile.enableSubmit = true;
                    pe.profile.enableSubmitEmail = false;
                }
            });
    };

    pe.submitpharmeasyForm = function () {
        let updateData = {
            "FirstName": pe.profile.firstName,
            "MiddleName": pe.profile.middleName,
            "LastName": pe.profile.lastName,
            "DOB": pe.profile.DOB,
            "mobilenumber": pe.profile.mobile,
            "pincode": pe.profile.pinCode,
            "nomineeName": pe.profile.nomineeName,
            "NomineeRelation": pe.profile.nomineeRelation,
            "Address": `${pe.profile.addressLine} ,${pe.profile.city}, ${pe.profile.state}`
        };

        aS.postData(ABHI_CONFIG.apiUrl + "PHARMEASY/SavePharmeasyRecord",
            updateData, true,)
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
                    pe.profile.showThankyou = true;
                }
            });
    }

}]);
