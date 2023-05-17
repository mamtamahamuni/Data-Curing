'use strict';
var productDetailApp = angular.module('productDetailApp', []);

productDetailApp.controller("product-details", ['$scope', 'ABHI_CONFIG', 'appService', '$timeout', '$window', '$rootScope', '$location', '$sessionStorage', 'RenewService', '$routeParams', function ($scope, ABHI_CONFIG, appService, $timeout, $window, $rootScope, $location, $sessionStorage, RenewService, $routeParams) {

    sessionStorage.removeItem('rid'); // Removed pName value from sessionStorage
    sessionStorage.removeItem('ut'); // Removed ut value from sessionStorage

    var pD = this;
    var aS = appService;
    pD.productDetail = {}
    pD.channelName = ['Branch', 'DAD', 'HNI', 'Omni', 'PCG', 'Franchisee', 'IFA', 'Remisser', 'MOFSL (Others)'];
    pD.channel = "Branch";
    pD.patnerCodeFlag = true;
    pD.productDetail.patnerCode = '0';
    pD.productDetail.bankAccountNumber = '';
    pD.productDetail.loanAccountNumber = '';
    pD.imdcode = $routeParams.IMDCode;
    pD.IMDCode = pD.imdcode;
    pD.imdSource = $routeParams.source;
    pD.name = replaceDecryptIDFC($routeParams.fname) + ' ' + replaceDecryptIDFC($routeParams.lname);
    pD.si = replaceDecryptIDFC($routeParams.SumInsured);


    idfcQuote();

    function idfcQuote() {
        pD.coverTo = 'Self';
        pD.idfcIMDCode = replaceOnlyDecryptIDFC($routeParams.IMD);
        pD.idfcIMDSource = replaceOnlyDecryptIDFC($routeParams.SourceName);

        pD.idfcFname = replaceOnlyDecryptIDFC($routeParams.fname);
        pD.idfcLname = replaceOnlyDecryptIDFC($routeParams.lname);
        pD.idfcAddr1 = replaceOnlyDecryptIDFC($routeParams.addr1);
        pD.idfcAddr2 = replaceOnlyDecryptIDFC($routeParams.addr2);
        pD.idfcPincode = replaceOnlyDecryptIDFC($routeParams.Pincode);
        pD.idfcDOB = replaceOnlyDecryptIDFC($routeParams.DOB);
        pD.idfcSI = replaceOnlyDecryptIDFC($routeParams.SumInsured);
        pD.idfcPAN = replaceOnlyDecryptIDFC($routeParams.pan);
        pD.idfcMobileNo = replaceOnlyDecryptIDFC($routeParams.mobNo);
        pD.idfcMobileNo = pD.idfcMobileNo.slice(-10);
		let paramEmailId = replaceDecryptIDFC($routeParams.emailId); 
        pD.idfcEmailId = (paramEmailId == "") ? 'test123@abhi.com' : paramEmailId;

        pD.idfcGender = replaceOnlyDecryptIDFC($routeParams.Gender);
        pD.idfcGender = (pD.idfcGender.toLowerCase() == 'f') ? 0 : 1;
        pD.idfcNname = replaceOnlyDecryptIDFC($routeParams.nname);
        pD.idfcNmob = replaceOnlyDecryptIDFC($routeParams.nmob);
        pD.idfcUcic = replaceOnlyDecryptIDFC($routeParams.ucic);
        pD.idfcNrel = replaceOnlyDecryptIDFC($routeParams.nrel);

        pD.idfcEduQualification = replaceOnlyDecryptIDFC($routeParams.EduQualification);
        pD.idfcOccupation = replaceOnlyDecryptIDFC($routeParams.Occupation);
        if (pD.idfcOccupation) {
            if (pD.idfcOccupation.includes("Salaried")) {
                pD.idfcOccupation = 'Salaried';
            } else {
                pD.idfcOccupation = 'Self- employed';
            }
        }
        if (pD.idfcNrel.toLowerCase() == 'wife' || pD.idfcNrel.toLowerCase() == 'husband') {
            pD.idfcNrel = 'Spouse';
        }


        sessionStorage.setItem('idfcSI', pD.idfcSI);
        sessionStorage.setItem('imdCode', pD.idfcIMDCode)
        sessionStorage.setItem('imdSource', pD.idfcIMDSource)

        var today = new Date();
        var todayMonth = today.getMonth() + 1;
        if (todayMonth < 10) {
            todayMonth = "0" + (today.getMonth() + 1);
        }
        var todayDay = today.getDate();
        if (todayDay < 10) {
            todayDay = "0" + today.getDate();
        }

        var expDate = pD.idfcDOB.trim().split('-');
        var PolicyExpDate = expDate[0] + "/" + expDate[1] + "/" + expDate[2];

        //change date formate to DD/MM/YYYY
        pD.idfcDOB = PolicyExpDate;

        var m = today.getMonth() - expDate[1];
        var insuredPersonAge = today.getFullYear() - expDate[2];
        if (m < 0 || (m === 0 && today.getDate() < expDate[0])) {
            insuredPersonAge--;
        }

        pD.Age = insuredPersonAge;


        // this need to handle conditionally 
        pD.productName = "Activ-Assure";
        pD.ProductCategory = "HP";
        pD.productShortCode = "DI";
        pD.productType = "diamond";
        sessionStorage.setItem('pName', "Activ Assure");

        console.log("DOB = " + pD.idfcDOB +
            " :: fname = " + pD.idfcFname +
            " :: lname = " + pD.idfcLname +
            " :: addr1 = " + pD.idfcAddr1 +
            " :: addr2 = " + pD.idfcAddr2 +
            " :: Gender = " + pD.gender +
            " :: Pincode = " + pD.idfcPincode +
            " :: SumInsured = " + pD.idfcSI +
            " :: mobNo = " + pD.idfcMobileNo +
            " :: emailId = " + pD.idfcEmailId +
            " :: pan = " + pD.idfcPAN +
            " :: IMD = " + pD.idfcIMDCode +
            " :: SourceName = " + pD.idfcIMDSource +
            " :: productCode = " + "DI");

        callPreQuote();
    }


    function callPreQuote() {
        var configs = {
            "ProposerDetail": {
                "ProductCategory": pD.ProductCategory,
                "Age": pD.Age,
                "MobileNo": pD.idfcMobileNo,
                "EmailId": pD.idfcEmailId,
                "IMDSource": pD.idfcIMDSource,
                "IMDCode": pD.idfcIMDCode,
                "FirstName": pD.idfcFname,
                "LastName": pD.idfcLname,
                "ThirdPartyURL": window.location.href,
                "Branch": "",
                "Location": "",
                "PortalLeadID": "",
                "CRMLeadID": "",
                "ProCat": null,
                "Address": pD.idfcAddr1 + "#" + pD.idfcAddr2,
                "PinCode": pD.idfcPincode, //pincode blank 
                "SI_DI": pD.idfcSI,
                "DOB": pD.idfcDOB,
                "PanNumber": pD.idfcPAN,
                "ProductCode": pD.productShortCode,
                "City": "",
                "Income": "",
                "OccupationType": pD.idfcOccupation,
                "EducationQualification": pD.idfcEduQualification,
                "lemniskId": sessionStorage.getItem('lemniskIdVal'),
                "ReferenceID": "",
                "WhatsappConsent": "Y",
                "NomineeName": pD.idfcNname,
                "NomineeRelation": pD.idfcNrel,
                "NomineeMobileNumber": pD.idfcNmob,
                "UCIC": pD.idfcUcic,
                "Gender": pD.idfcGender,                
            },
            "InsuredDetail": [
                {
                    "Gender": pD.idfcGender,
                    "RelationWithProposer": "SELF",
                    "RelationType": "S",
                    "Age": pD.Age,
                    "ProductCode": "NA"
                }
            ]

        };

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/PreQuote", configs, true)
            .then((respData) => {
                if (respData.ResponseCode == 1) {
                    sessionStorage.setItem('ut', respData.ResponseData.ut);
                    sessionStorage.setItem('rid', respData.ResponseData.ReferenceNumber);
                    sessionStorage.setItem('newJourney', true);
                    buyProduct(respData.ResponseData);
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": respData.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Yes",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            })

    }

    function buyProduct(dataObj) {
        var dataObj = {
            "ReferenceNumber": dataObj.ReferenceNumber,
            "ProductCode": pD.productShortCode
        }
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/BuyProduct", dataObj, true)
            .then((respData) => {
                if (respData.ResponseCode == 1) {
                    var payloadObj = {
                        "ReferenceNumber": respData.ResponseData,
                        "Savings": true,
                        "Diamond": {
                            "PolicyTenure": "1",
                            "PolicyType": "MI",
                            "PaymentType": "UPFRONT",
                            "EMPD": null,
                            "AFFD": null,
                            "FAMD": null,
                            "MemberDetails": [{
                                "SumInsured": pD.idfcSI,
                                "COVER_RPEP_FLAG": "N",
                                "COVER_AHB_FLAG": "N",
                                "COVER_AHP_SI": "0",
                                "COVER_CHB_FLAG": "N",
                                "COVER_CHB_SI": "0",
                                "COVER_SNCB_FLAG": "N",
                                "COVER_SNCB_SI": "0",
                                "COVER_URSI_FLAG": "N",
                                "COVER_URSI_SI": "0",
                                "COVER_ARU_FLAG": "N",
                                "Age": pD.Age,
                                "Gender": pD.gender,
                                "RelationType": "S",
                                "RelationWithProposer": "SELF",
                                "Future_Secure_YN": "N",
                                "Reduction_4Yrs_to_2Yrs_YN": "N",
                                "Reduction_4Yrs_to_1Yrs_YN": "N",
                                "Reduction_3Yrs_to_2Yrs_YN": "N",
                                "Reduction_3Yrs_to_1Yrs_YN": "N",
                                "Vaccine_Cover_YN": "N",
                                "Vaccine_Cover_SI": "0",
                                "Tele_OPD_consultation_YN": "N"
                            }]
                        }
                    };

                    getPreminum(payloadObj)

                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": respData.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Yes",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            });
    }

    function getPreminum(payloadObj) {
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", payloadObj, true)
            .then((respData) => {
                if (respData.ResponseCode == 1) {
                    pD.IDFCPreminum = respData.ResponseData.ProductPremium[0].Premium;
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": respData.ResponseMessage,
                        "showCancelBtn": false,
                        "modalSuccessText": "Yes",
                        "modalCancelText": "No",
                        "showAlertModal": true
                    }
                }
            })

    }

    pD.sendQuotePage = function () {
        sessionStorage.setItem('pageNoSeq', 2);
        $timeout(function () {
            $location.url("diamond-quote");
        }, 200);
    }

    //space replace logic update for mutile
    function replaceOnlyDecryptIDFC(param) {
        if (param) {
            var decypt = param.split(' ').join('+');
            return $rootScope.decrypt(decypt);
        } else {
            return "";
        }
    }

    function replaceDecryptIDFC(param, isINR) {
        if (param) {
            var decypt = param.split(' ').join('+');
            var input = $rootScope.decrypt(decypt);
            // return function (input) {
            if (!isNaN(input) && input != null) {
                var result = input.toString().split('.');
                var lastThree = result[0].substring(result[0].length - 3);
                var otherNumbers = result[0].substring(0, result[0].length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                if (result.length > 1) {
                    output += "." + result[1];
                }
                return output;
            } else {
                return input;
            }
            // }
        } else {
            return "";
        }
    }

    pD.getMOSFLData = function (branchName, location, key) {
        if (key == 'LOC') {
            pD.locationName = ''; pD.location = '';
            pD.partnerCode = ''; pD.partnerCodes = '';
            pD.spCode = ''; pD.spCodes = '';
            pD.employeeCode = ''; pD.employeeCodes = '';
            pD.smCode = ''; pD.smCodes = ''; pD.productDetail.smCode = '';
        }
        if (key == 'PC') {
            pD.partnerCode = ''; pD.partnerCodes = '';
            pD.spCode = ''; pD.spCodes = '';
            pD.employeeCode = ''; pD.employeeCodes = '';
            pD.smCode = ''; pD.smCodes = ''; pD.productDetail.smCode = '';
        }
        if (key == 'SP') {
            pD.spCode = ''; pD.spCodes = '';
            pD.employeeCode = ''; pD.employeeCodes = '';
            pD.smCode = ''; pD.smCodes = ''; pD.productDetail.smCode = '';
        }
        if (key == 'EMP') {
            pD.employeeCode = ''; pD.employeeCodes = '';
            pD.smCode = ''; pD.smCodes = ''; pD.productDetail.smCode = '';
            $('#txtsmCode').val('');
        }
        aS.postData(ABHI_CONFIG.apiUrl + "agent/GetMOFSLData", {
            "BranchName": branchName,
            "Location": location,
            "Key": key
        }, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    if (key == 'LOC') {
                        pD.locationName = data.ResponseData.Responsedata;
                    }
                    if (key == 'PC') {
                        pD.partnerCodes = data.ResponseData.Responsedata;
                    }
                    if (key == 'SP') {
                        pD.spCodes = data.ResponseData.Responsedata;
                    }
                    if (key == 'EMP') {
                        pD.employeeCodes = data.ResponseData.Responsedata;
                    }
                } else {

                }
            }, function (err) {

            });
    }

    pD.getSPCode = function () {
        aS.postData(ABHI_CONFIG.apiUrl + "agent/GetMOFSLData", {
            "BranchName": pD.channel,
            "Location": "",
            "Key": "LOC"
        }, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    pD.spCode = data.ResponseData;
                    pD.openDropdown()
                } else {

                }
            }, function (err) {

            });
    }
    pD.getSMCode = function () {
        pD.smCode = ''; pD.smCodes = ''; pD.productDetail.smCode = '';
        $('#txtsmCode').val('');
        aS.getData(ABHI_CONFIG.apiUrl + "agent/GetallABHISMCODES", true,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    pD.smCodes = data.ResponseData;
                    //pD.abhiSMDropdown();
                } else {

                }
            }, function (err) {

            });
    }
    pD.openDropdown = function () {
        // document.getElementByClassName('product-detail-list').style.display = 'inline';
        //$('.product-detail-list').css("display", "block");
    }
    // pD.closeDropdown = function() {
    //     $('.product-detail-list').css("display", "none");
    // }
    pD.abhiSMDropdown = function () {
        // document.getElementByClassName('product-detail-list').style.display = 'inline';
        $('.abhi-sm-code').css("display", "block");
    }
    pD.selectedSPcode = function (spcode) {
        pD.productDetail.spCode = spcode.IntermediaryName;
        pD.productDetail.abhispCode = spcode.SPCODE;
        $('.product-detail-list').css("display", "none");
    }
    pD.selectedSMcode = function (smcode) {
        pD.productDetail.smCode = smcode.ABHISMName;
        pD.productDetail.abhiSMcode = smcode.ABHISMCode;
        $('.abhi-sm-code').css("display", "none");
    }
    pD.abhiPatnerCode = function (channelName) {
        if (channelName == "Branch" || channelName == "DAD" || channelName == "PWM" || channelName == "HNI" || channelName == "Omni" || channelName == "PCG" || channelName == "Prime") {
            pD.productDetail.patnerCode = '0';
            pD.patnerCodeFlag = true;
        } else {
            pD.patnerCodeFlag = false;
            pD.productDetail.patnerCode = ' ';
        }
    }

    //This will disable the Button by default.
    pD.IsLoanAccountDisabled = false;
    pD.IsBankAccountDisabled = false;

    pD.EnableDisableBAN = function ($event) {
        //If TextBox has value, the Button will be enabled else vice versa.
        pD.IsBankAccountDisabled = $event.currentTarget.value.length > 0;
    }

    pD.EnableDisableLAN = function ($event) {
        //If TextBox has value, the Button will be enabled else vice versa.
        pD.IsLoanAccountDisabled = $event.currentTarget.value.length > 0;
    }

    pD.ValidatePAN = function ($event) {
        var txtPANCard = $event.currentTarget.value;
        var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
        if (regex.test(txtPANCard.toUpperCase())) {
            return true;
        } else {
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Error",
                "modalBodyText": "Please enter PAN Number",
                "showCancelBtn": false,
                "modalSuccessText": "OK",
                "showAlertModal": true,
            }
            $event.currentTarget.value = '';
            return false
        }
    }

    pD.filterValue = function ($event) {
        if (isNaN(String.fromCharCode($event.keyCode))) {
            $event.preventDefault();
        }
        // pD.IsLoanAccountDisabled = (pD.productDetail.bankAccountNumber.length > 0) ? true : false;
        // pD.IsBankAccountDisabled = (pD.productDetail.loanAccountNumber.length > 0) ? true : false;
    };

    pD.buyProduct = function (productName) {
        pD.productDetail.channelName = pD.channel;
        pD.productDetail.location = pD.location;
        pD.productDetail.abhispCode = pD.spCode;
        pD.productDetail.spCode = pD.spCode;
        pD.productDetail.partnerCode = pD.partnerCode;
        pD.productDetail.employeeCode = pD.employeeCode;
        pD.productDetail.abhiSMcode = pD.smCode;
        (sessionStorage.setItem('productDetail', JSON.stringify(pD.productDetail)));
        // Validation form For Motilal Oswal
        if (pD.IMDCode == '2112349') {
            if (pD.productDetail.spCode == "" || pD.productDetail.spCode == undefined || pD.productDetail.spCode == null) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Please select SP code",
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "showAlertModal": true,
                }
                return false
            } else if (pD.productDetail.employeeCode == "" || pD.productDetail.employeeCode == undefined) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Please enter employee code.",
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "showAlertModal": true,
                }
                return false
            } else if (pD.smCode == "" || pD.smCode == undefined || pD.smCode == null) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Please select SM code.",
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "showAlertModal": true,
                }
                return false
            }
            // else if (!((pD.productDetail.employeeCode.length === 7 && pD.productDetail.employeeCode.startsWith('RM') || pD.productDetail.employeeCode.startsWith('rm')) || (pD.productDetail.employeeCode.length === 5 && (/\b\d{5}\b/g).test(pD.productDetail.employeeCode)))) {
            //     $rootScope.alertData = {
            //         "modalClass": "regular-alert",
            //         "modalHeader": "Error",
            //         "modalBodyText": "enter valid Employee code.",
            //         "showCancelBtn": false,
            //         "modalSuccessText": "OK",
            //         "showAlertModal": true,
            //     }
            //     return false
            // }
        }

        // Validation form for DCB Bank
        if (pD.IMDCode == '2101599') {
            if ((pD.productDetail.bankAccountNumber == "" || pD.productDetail.bankAccountNumber == undefined || pD.productDetail.bankAccountNumber == null)
                && (pD.productDetail.loanAccountNumber == "" || pD.productDetail.loanAccountNumber == undefined || pD.productDetail.loanAccountNumber == null)) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Please enter DCB Bank Savings / Current / Overdraft / Term Deposit Account Number OR Loan Account Number",
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "showAlertModal": true,
                }
                return false
            } else if (pD.productDetail.pANNumber == "" || pD.productDetail.pANNumber == undefined) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Please enter PAN Number",
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "showAlertModal": true,
                }
                return false
            } else if (pD.productDetail.sourcingEmployeeID == "" || pD.productDetail.sourcingEmployeeID == undefined || pD.productDetail.sourcingEmployeeID == null) {
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Error",
                    "modalBodyText": "Please enter Employee ID",
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "showAlertModal": true,
                }
                return false
            }
        }
        switch (productName) {
            case 'Activ Assured Diamond':
                $location.url('activ-assure-pre-quote?fname=&lname=&emailId=&mobNo=&dob=&productCode=DI&IMDCode=' + pD.imdcode + '&source=' + pD.imdSource);
                break;
            case 'Activ Care':
                $location.url('activ-care-pre-quote?fname=&lname=&emailId=&mobNo=&dob=&productCode=DI&IMDCode=' + pD.imdcode + '&source=' + pD.imdSource);
                break;
            case 'Activ Secure Personal Accident':
                $location.url('activ-secure-personal-accident-pre-quote?fname=&lname=&emailId=&mobNo=&dob=&productCode=DI&IMDCode=' + pD.imdcode + '&source=' + pD.imdSource);
                break;
            case 'Activ Secure Critical Illness':
                $location.url('activ-secure-critical-illness-pre-quote?fname=&lname=&emailId=&mobNo=&dob=&productCode=DI&IMDCode=' + pD.imdcode + '&source=' + pD.imdSource);
                break;
            case 'Activ Secure Cancer Secure':
                $location.url('activ-secure-cancer-secure-pre-quote?fname=&lname=&emailId=&mobNo=&dob=&productCode=DI&IMDCode=' + pD.imdcode + '&source=' + pD.imdSource);
                break;
            case 'Activ Health Platinum':
                $location.url('activ-health-pre-quote?fname=&lname=&emailId=&mobNo=&dob=&productCode=DI&IMDCode=' + pD.imdcode + '&source=' + pD.imdSource);
                break;
            default:
                break;
        }
    }
    pD.redirectToRenew = function () {
        $location.url('renewal-renew-policy');
    }
}]);