/**
	Module: VIL Raise Controller
	Author: Pandurang Sarje
	Date: 12-01-2021
**/

'use strict';

var vRApp = angular.module("vilRaiseApp",[]);

vRApp.controller("vil-raise", ['$scope', '$rootScope', '$sessionStorage', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$http', '$q', function($scope, $rootScope, $sessionStorage, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $http, $q) {

    /* Page Redirection When $sessionStorage.coiDetails Not Available */

    if($sessionStorage.coiDetails == null || $sessionStorage.coiDetails == 'undefined'){
        $location.url('vil-login');
        return false;
    }
    
    /* End of Page Redirection When $sessionStorage.coiDetails Not Available */
    
    
    /* Data Inilization */

    var aS = appService;
    $scope.coiDetails = $sessionStorage.coiDetails[0];
    $scope.filesUploadError = false;
    $scope.claimDetails = {
        "Email": "",
        "PinCode": "",
        "State": "",
        "Diagnosis": "",
        "Date_of_Admission": "",
        "Date_of_Discharge": "",
        "NonICU_Days": "",
        "ICU_Days": "",
        "Claim_Amount" : "",
        "IFSC":"",
        "BankName": "",
        "BranchName": "",
        "Idtype": "",
        "Aadhar_Number": "",
        "PAN_Number": "", 
        "claim_no": ""
    }

    /* End of Data Inilization */

    /* To validate document file */

    $(document).ready(function(){
        $('input[type="file"]').change(function(){
            var $this =  $(this);
            var index = $this.val().lastIndexOf('.');
            var fileExtention = $this.val().substring(index, $this.val().length);
            if(fileExtention == '.pdf' || fileExtention == '.png' || fileExtention == '.jpg'){
                if($this.prop('files')[0].size > 5242880){
                    $(this).val('');
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": 'File size should be less than 5 MB',
                        "showCancelBtn": false,
                        "modalSuccessText" : "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn" : true
                    }
                    $rootScope.$apply();
                }
            }else{
                $(this).val('');
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": 'Only .pdf, .png and .jpg file formats are allowed.',
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn" : true
                }
                $rootScope.$apply();
            }
        });
    });

    /* End of To validate document file */

    /* Function To Upload Files */

    function uploadFiles(documentFile, claimNumber){

        var defer = $q.defer(); // this a promise object

        var reader = new FileReader();
        
        reader.onload = function(e){
            var imageContent = btoa(e.target.result.toString());  

            var documentObject = {
                'ClaimNumber': claimNumber,
                'DocumentId': 'ServiceRequest',
                'SharedPath': '',
                'FileName': documentFile.files[0].name,
                'FileContent': imageContent,
                'ByteArray':'',
                'DataClassParam':[{'DocSearchParamId':'COINumber','Value': $scope.coiDetails.HBCOINumber },{'DocSearchParamId':'ClaimNumber','Value':claimNumber}]
            }
      
            aS.postData(ABHI_CONFIG.hservicesv2 + "/Hospicash/UploadDocument", {
                "_data": $rootScope.encrypt(documentObject)
               
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
                    console.log('File Uploaded Successfully');
                    defer.resolve(data);
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
        };
        reader.readAsBinaryString(documentFile.files[0]); // to file read file 
        
        return defer.promise; 
    }
    
    /* End of Function To Upload Files */
    
    /* To Change Pincode and update State and City  Details */

    $scope.changePinCode = function(validPinCode) {

        if(validPinCode){
            
            $http.defaults.headers.common['p1'] = '';
            $http.defaults.headers.common['p2'] = 'bzi6xdEQmDTdRGUzsF99Cw=='; //website
            $http.defaults.headers.common['p3'] = '76mOIGX9yoXJcn9AvqJG3Q=='; //app version 5.5
            $http.defaults.headers.common['p4'] = 'JTPdpgaOfcnB62c3kAoWKQ=='; // health website

            var apiUrl = ABHI_CONFIG.hservicesv2 + "/Hospicash/CheckPinCode";

            aS.getData(apiUrl + '?Pincode=' + $rootScope.encryptWithoutString($scope.claimDetails.PinCode), "",
            false, {
                headers: {
                    'Content-Type': ' application/json; charset=utf-8',
                    'x-client-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                    'x-abhi-api-key' : 'BFA9AF04-696E-4EFD-BD4E-EED9F6CCDBF5',
                    'x-abhi-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                    'X-NewRelic-ID' :'VgcHVlRaDBACU1lTDgQPV1U='
                }
            })
            .then(function(data) {
                var response = JSON.parse($rootScope.decrypt(data._resp));

                if (response.code == 1) {
                    $scope.pinCodeDetails = response.data;
                    $scope.claimDetails.State = $scope.pinCodeDetails.State;
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": 'No Data Found For Entered Pincode',
                        "showCancelBtn": false,
                        "modalSuccessText" : "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn" : true,
                        "positiveFunction": function(){
                            $scope.claimDetails.PinCode = "";
                            $scope.claimDetails.State = "";
                        }
                    }
                    
                }
            }, function(err) {
            });
        }
    }

    /* End of To Change Pincode and update State and City  Details */
    
    /* To Get Bank Details From IFSC Code  */

    $scope.getBankDetails = function(validIFSC) {

        if(validIFSC){
            
            $http.defaults.headers.common['p1'] = '';
            $http.defaults.headers.common['p2'] = 'bzi6xdEQmDTdRGUzsF99Cw==';
            $http.defaults.headers.common['p3'] = '76mOIGX9yoXJcn9AvqJG3Q==';
            $http.defaults.headers.common['p4'] = 'JTPdpgaOfcnB62c3kAoWKQ==';

            var apiUrl = ABHI_CONFIG.hservicesv2 + "/Hospicash/GetAllBankDetails";

            aS.getData(apiUrl + '?IFSCCode=' + $rootScope.encryptWithoutString($scope.claimDetails.IFSC), "",
            false, {
                headers: {
                    'Content-Type': ' application/json; charset=utf-8',
                    'x-client-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                    'x-abhi-api-key' : 'BFA9AF04-696E-4EFD-BD4E-EED9F6CCDBF5',
                    'x-abhi-token' : 'F7F80011-987C-4EC5-BB01-452547F4FA47',
                    'X-NewRelic-ID' :'VgcHVlRaDBACU1lTDgQPV1U='
                }
            })
            .then(function(data) {
                var response = JSON.parse($rootScope.decrypt(data._resp));

                if (response.code == 1) {
                    $scope.BankDetails = response.data;
                    $scope.claimDetails.BankName = $scope.BankDetails.BankName;
                    $scope.claimDetails.BranchName = $scope.BankDetails.BranchName;
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": 'No Data Found For Entered IFSC Code',
                        "showCancelBtn": false,
                        "modalSuccessText" : "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn" : true,
                        "positiveFunction": function(){
                            $scope.claimDetails.IFSC = "";
                            $scope.claimDetails.BankName = "";
                            $scope.claimDetails.BranchName = "";
                        }
                    }
                    
                }
            }, function(err) {
            });
        }
    }

    /* End of To Get Bank Details From IFSC Code  */

    /* To Register Claim */
    $scope.registerClaim = function(validForm,event) {

        /* Email Validation */
        if(!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.claimDetails.Email))){
            $("html, body").animate({ scrollTop: $("#vil-claim-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E',"Please enter a valid email id");
            return false;
            }
        /* End of Email Validation */

        /* Form Validation */
        if(!validForm){
            $scope.showErrors = true;
            $("html, body").animate({ scrollTop: $("#vil-claim-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E',"Please fill valid data", "valid_data_alert");
            return false;
        }
        /* End of Form Validation */

        /* Claim Amount Validation */
        if($scope.claimDetails.Claim_Amount == 0) {
            $("html, body").animate({ scrollTop: $("#vil-claim-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E',"Please enter valid Claim Amount");
            return false;
        }
        /* End of Claim Amount Validation */

        /* Date of Admission & Date of Discharge Validations */
        var dateOfAdmission = $scope.claimDetails.Date_of_Admission.split('/');
        var newdateOfAdmission = dateOfAdmission[2] + '/' + dateOfAdmission[1] + '/' + dateOfAdmission[0];
        var dateOfAdmission1 = dateOfAdmission[2]+''+dateOfAdmission[1]+''+ dateOfAdmission[0];

        var dateofDischarge = $scope.claimDetails.Date_of_Discharge.split('/');
        var newdateofDischarge = dateofDischarge[2] + '/' + dateofDischarge[1] + '/' + dateofDischarge[0]; 
        var dateofDischarge1 = dateofDischarge[2]+''+dateofDischarge[1]+''+dateofDischarge[0];

        var hospitalizedDays = (dateofDischarge1 - dateOfAdmission1) + 1;

        if(hospitalizedDays <= 0){
            $("html, body").animate({ scrollTop: $("#vil-claim-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E',"Date of Discharge should not be less than Date of Admission");
            return false;
        }else if(hospitalizedDays >= 1){
            if((+$scope.claimDetails.ICU_Days + +$scope.claimDetails.NonICU_Days) != hospitalizedDays){
                $("html, body").animate({ scrollTop: $("#vil-claim-details").offset().top - 135 }, 300);
                $rootScope.alertConfiguration('E',"Total of ICU Days & Non ICU Days doesn't match with hospitalized duration");
                return false;
            }
        }
        /* End of Date of Admission & Date of Discharge Validations */

        /* ID Type Validation */
        if($scope.claimDetails.Idtype == '') {
            $scope.showErrors = true;
            $("html, body").animate({ scrollTop: $("#vil-claim-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E',"Please select ID Type");
            return false;
        }
        /* End of ID Type Validation */

        /* Documents Validation */
        var dischargeCard = document.getElementById('dischargecard');
        var hospitalBill = document.getElementById('hospitalbill');
        var idProof = document.getElementById('idproof');
        var cheque = document.getElementById('cheque');

        if(dischargeCard.files.length == 0 && idProof.files.length == 0 && cheque.files.length == 0){
            $rootScope.alertConfiguration('E',"Please upload documents files");
            return false;
        }else if(dischargeCard.files.length == 0){
            $rootScope.alertConfiguration('E',"Please upload hospital discharge card file");
            return false;
        }else if(idProof.files.length == 0){
            $rootScope.alertConfiguration('E',"Please upload government id file");
            return false;
        }else if(cheque.files.length == 0){
            $rootScope.alertConfiguration('E',"Please upload cancelled cheque file");
            return false;
        }

        if($scope.claimDetails.ICU_Days > 1 && hospitalBill.files.length == 0){
            $rootScope.alertConfiguration('E',"Please upload hospital bill file");
            return false;
        }
        /* End of Documents Validation */

        /* To Get Today Date */
        var today = new Date();
        var todayMonth = today.getMonth() + 1;
        if(todayMonth < 10){
          todayMonth = "0"+(today.getMonth() + 1);
        }
        var todayDay = today.getDate();
        if(todayDay < 10){
          todayDay = "0"+today.getDate();
        }
        var TodayDate = today.getFullYear()+"/"+todayMonth+"/"+todayDay;
        /* End of To Get Today Date */

        /* To Call Register Claim Api */

        var claimObject = {
            "policy_Number": $scope.coiDetails.HBCOINumber,
            "Pincode": $scope.claimDetails.PinCode,
            "member_Code": "",
            "Claim_Intimation_Through": "Email",       
            "Claim_Intimation_Source": "Individual/Sender",
            "Claim_Type": "Reimbursement",
            "Loss_Code": "42154101", 
            "Diagnosis": $scope.claimDetails.Diagnosis, 
            "Date_of_Admission": newdateOfAdmission, 
            "Date_of_Discharge": newdateofDischarge, 
            "Time_of_Admission": "00:00", 
            "Time_of_Discharge": "00:00", 
            "Claim_Amount": $scope.claimDetails.Claim_Amount, 
            "Remarks": "Vodafone Hospicash", 
            "Refrence_Number": "",
            "System_source_Code": "Vodafone",
            "mode": "CREATE",                              
            "documentRecivedate": TodayDate,
            "claim_no": "",
            "email_id": $scope.claimDetails.Email,
            "no_ofdayin_nonIcu": $scope.claimDetails.NonICU_Days,
            "no_ofdayin_Icu": $scope.claimDetails.ICU_Days,
            "pan_no": $scope.claimDetails.PAN_Number.toUpperCase(),
            "Bank_Name": $scope.claimDetails.BankName,
            "Bank_Branch_Name": $scope.claimDetails.BranchName,
            "IFSC_Code": $scope.claimDetails.IFSC,
            "adhaar_no": $scope.claimDetails.Aadhar_Number       
        }

        $http.defaults.headers.common['p1'] = '';
        $http.defaults.headers.common['p2'] = 'bzi6xdEQmDTdRGUzsF99Cw==';
        $http.defaults.headers.common['p3'] = '76mOIGX9yoXJcn9AvqJG3Q==';
        $http.defaults.headers.common['p4'] = 'JTPdpgaOfcnB62c3kAoWKQ==';

        aS.postData(ABHI_CONFIG.hservicesv2 + "/Hospicash/RegisterClaims", {
            "_data": $rootScope.encrypt(claimObject)
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
                $scope.registrationDetails = response.data;
                if($scope.registrationDetails.Claim_Number == null){
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": 'Oops!! Something went wrong. Please try again later.',
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn": true,
                    }
                }
                else if($scope.registrationDetails.Claim_Number != null){
                    uploadFiles(dischargeCard, $scope.registrationDetails.Claim_Number).then(function (data){
                        uploadFiles(idProof, $scope.registrationDetails.Claim_Number).then(function (data){
                            uploadFiles(cheque, $scope.registrationDetails.Claim_Number).then(function (data){
                                if(hospitalBill.files.length > 0){
                                    uploadFiles(hospitalBill, $scope.registrationDetails.Claim_Number).then(function (data){
                                        $rootScope.alertData = {
                                            "modalClass": "regular-alert",
                                            "modalHeader": "Alert",
                                            "modalBodyText": 'Your claim registration is successful.<br>Your claim Id is : '+$scope.registrationDetails.Claim_Number,
                                            "showCancelBtn": false,
                                            "modalSuccessText": "Ok",
                                            "showAlertModal": true,
                                            "hideCloseBtn": true,
                                            "positiveFunction": function () {
                                                $location.url('vil-login');
                                            }
                                        }
                                    })
                                }else{
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "Alert",
                                        "modalBodyText": 'Your claim registration is successful.<br>Your claim Id is : '+$scope.registrationDetails.Claim_Number,
                                        "showCancelBtn": false,
                                        "modalSuccessText": "Ok",
                                        "showAlertModal": true,
                                        "hideCloseBtn": true,
                                        "positiveFunction": function () {
                                            $location.url('vil-login');
                                        }
                                    }
                                }            
                            })
                        })                     
                    })
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

        /*End of To Call Register Claim Api */
    }
    /* End of To Register Claim */

}]);


/* Aadhar card enter directive */

vRApp.directive('aadharCard', function($timeout) {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function(val) {
                if (val === undefined || val === null) {
                    val = '';
                }
                var clean = val.toString().replace(/\D/g, "").split(/(?:([\d]{4}))/g).filter(function(s) {
                    return s.length > 0;
                }).join("-");
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function(e) {
                var code = e.keyCode || e.which;
                if (code === 101 || code === 32 || code === 109 || code === 45) {
                    e.preventDefault();
                }
            });
        }
    };
});

/* End of Aadhar card enter directive */