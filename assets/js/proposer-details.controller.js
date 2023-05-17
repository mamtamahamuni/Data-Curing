/*

    Name: Proposer Details
    Author: Pankaj Patil
    Date: 02/07/2018

*/
var pDApp = angular.module("proposerDetailsApp", []);

pDApp.controller("proposerDetailsCtrl", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$timeout', 'productValidationService', '$filter', function ($rootScope, appService, ABHI_CONFIG, $location, $timeout, productValidationService, $filter) {

    /* Data Initilization */

    var pDC = this;
    var aS = appService;
    var pVS = productValidationService;
    pDC.idTypeVal = "";
    var proposerAge;
    pDC.showAnnualIncome = false;
    pDC.showOtherId = false;
    pDC.hideSubmitButton = true;
    pDC.showPerAnum = false;
    var projectPlans = {};
    pDC.insuredMembers = [];
    var zoneVal = "";
    pDC.productName = sessionStorage.getItem('pName');
    pDC.productCode = "";
    pDC.isValidateAge = true;
    pDC.showmaritalStatus = true;
    pDC.stProductAvail = false;
    pDC.proposerDetailsPageType = window.location.hash.substring(3);
    var calculatePremiumParams = {
        "ReferenceNumber": sessionStorage.getItem('rid')
    };
    var selfObj = {};
    var proposerObj = {};
    var productInsuredMembers = [];
    pDC.impnote = true;

    const IDFCIMDCODE = "2115779";

    function isIDFCPasa() {
        pDC.isIDFCPasa =  sessionStorage.getItem('imdCode') === IDFCIMDCODE ? true : false;
    }

    isIDFCPasa();
    
    if (pDC.productName == "Activ Assure") {
        pDC.DI = true;
        pDC.productSelected = 'DI'
        calculatePremiumParams.Diamond = {
            'MemberDetails': []
        };
    } else if (pDC.productName == "Activ Health") {
        pDC.PL = true;
        pDC.productSelected = 'PL'
        calculatePremiumParams.Platinum = {
            'MemberDetails': []
        };
    } else if (pDC.productName == "Activ Fit" || sessionStorage.getItem('lastRouteVisted') == "fit-proposer-details") {
        console.log(pDC.productName, "proposer Product name");
        pDC.FIT = true;
        pDC.productSelected = 'PL'
 

        calculatePremiumParams.Fit = {
            'MemberDetails': []
        };
    }else if (pDC.productName == "Corona Kavach") {
        pDC.CK = true;
        pDC.productSelected = "CK"
        calculatePremiumParams.CK = {
            'MemberDetails': []
        };
    } else if (pDC.productName == "Arogya Sanjeevani") {
        pDC.AS = true;
        pDC.productSelected = "AS"
        calculatePremiumParams.AS = {
            'MemberDetails': []
        };
    } else if (pDC.productName == "Activ Care") {
        pDC.AC = true;
        calculatePremiumParams.AC = {
            'MemberDetails': []
        };
    }

    /* End of data initilization */

    /* Nominee relationship dropdown */

    pDC.nomineeRel = [{
        "key": "Spouse",
        "val": "Spouse"
    }, {
        "key": "Son",
        "val": "Son"
    }, {
        "key": "Daughter",
        "val": "Daughter"
    }, {
        "key": "Mother",
        "val": "Mother"
    }, {
        "key": "Father",
        "val": "Father"
    }, {
        "key": "Mother-In-Law",
        "val": "Mother-In-Law"
    }, {
        "key": "Father-In-Law",
        "val": "Father-In-Law"
    }, {
        "key": "Brother",
        "val": "Brother"
    }, {
        "key": "Sister",
        "val": "Sister"
    }, {
        "key": "Grandfather",
        "val": "Grandfather"
    }, {
        "key": "Grandmother",
        "val": "Grandmother"
    }, {
        "key": "Grandson",
        "val": "Grandson"
    }, {
        "key": "Granddaughter",
        "val": "Granddaughter"
    }, {
        "key": "Son in-law",
        "val": "Son in-law"
    }, {
        "key": "Daughter in-law",
        "val": "Daughter in-law"
    }, {
        "key": "Brother in-law",
        "val": "Brother in-law"
    }, {
        "key": "Sister in-law",
        "val": "Sister in-law"
    }, {
        "key": "Nephew",
        "val": "Nephew"
    }, {
        "key": "Niece",
        "val": "Niece"
    }]

    /* End of nominee relationship dropdown */


    /* Annual Income Dropdown */

    pDC.annulaIncomeDrop = [{
        "key": "500000",
        "val": "Up to 5 Lakhs"
    }, {
        "key": "1000000",
        "val": "5 Lakhs to 10 Lakhs"
    }, {
        "key": "2000000",
        "val": "10 Lakhs to 20 Lakhs"
    }, {
        "key": "2500000",
        "val": ">20 Lakhs"
    }]

    /* End of Annual Income Dropdown */


    /* Educational qualification Dropdown */

    pDC.educationalQualificationDrop = [{
        "key": "Below Matric",
        "val": "Below Matric"
    }, {
        "key": "Matric",
        "val": "Matric"
    }, {
        "key": "Graduate",
        "val": "Graduate"
    }, {
        "key": "Post Graduate",
        "val": "Post Graduate"
    }, {
        "key": "Diploma",
        "val": "Diploma"
    }, {
        "key": "Professional",
        "val": "Professional"
    }, {
        "key": "Others",
        "val": "Others"
    }]



    /* End of Educational qualification Dropdown */

    /* Occupation Dropdown */

    pDC.occupationDrop = [{
        "PL": true,
        "CK": true,
        "AS": true,
        "key": "O107",
        "val": "Govt. Employee"
    }, {
        "PL": true,
        "CK": true,
        "AS": true,
        "key": "O002",
        "val": "Private Service"
    }, {
        "PL": true,
        "CK": true,
        "key": "O109",
        "val": "Business"
    }, {
        "AS": true,
        "key": "O103",
        "val": "Business"
    }, /*{
            "PL":true,
            "CK":true,
            "AS":true,
            "key": "O095",
            "val": "Professional"
        },*/ {
        "PL": false,
        "AS": true,
        "key": "O004",
        "val": "Housewife"
    }, {
        "PL": false,
        "CK": true,
        "AS": true,
        "key": "O005",
        "val": "Retired"
    }, {
        "CK": true,
        "key": "O111",
        "val": "Other"
    }, {
        "AS": true,
        "key": "O009",
        "val": "Others"
    }, {
        "PL": false,
        "key": "O015",
        "val": "Architects"
    }, {
        "PL": true,
        "key": "O052",
        "val": "Employee"
    }, {
        "PL": false,
        "key": "O557",
        "val": "CA"
    }, {
        "PL": false,
        "key": "O558",
        "val": "Business"
    }, {
        "PL": true,
        "key": "O559",
        "val": "Doctor"
    }, {
        "PL": true,
        "key": "O560",
        "val": "Lawyer"
    }, {
        "PL": true,
        "key": "O561",
        "val": "Other"
    }]



    /* End of Occupation Dropdown */


    /* To fetch quote details */

    pDC.fetchProposerDetails = function (flag) {
        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });

        console.log("GetProposerDetails Request");
        console.log({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetProposerDetails", {
            "_data": reqData
        }, flag, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                var data = JSON.parse($rootScope.decrypt(data._resp))
                console.log("GetProposerDetails Response");
                console.log(data);
                aS.triggerSokrati(); /* Triggering Sokrati */
                if (data.ResponseCode == 1) {
                    pDC.proposerDetails = data.ResponseData;
                    pDC.proposerDetails.PremiumDetail.TotalPremium = 0;
                    pDC.proposerDetails.ProposerDetail.IdNumber;

                    pDC.productCode = pDC.proposerDetails.PremiumDetail.ProductPremium[0].ProductCode;

                    if( pDC.isIDFCPasa && !pDC.proposerDetails.ProposerDetail.AddressLine2) {
                        var address = pDC.proposerDetails.ProposerDetail.AddressLine1.split("#");
                        pDC.proposerDetails.ProposerDetail.AddressLine1 = address[0];
                        console.log(address);
                        pDC.proposerDetails.ProposerDetail.AddressLine2 = address[1];
                    }
                    
                    pDC.IMDCode = pDC.proposerDetails.ProposerDetail.IMDCode;
                    pDC.idTypeVal = pDC.proposerDetails.ProposerDetail.IdType;
                    var userDateOfBirth = (pDC.proposerDetails.ProposerDetail.DOB == null) ? "" : pDC.proposerDetails.ProposerDetail.DOB.split('-');
                    if (userDateOfBirth.length > 0) {
                        pDC.day = userDateOfBirth[2];
                        pDC.month = userDateOfBirth[1];
                        pDC.year = userDateOfBirth[0];
                        pDC.DOB = userDateOfBirth[2] + "-" + userDateOfBirth[1] + "-" + userDateOfBirth[0];
                        pDC.dbDate = userDateOfBirth[1] + "-" + userDateOfBirth[2] + "-" + userDateOfBirth[0];
                    }
                    if (pDC.proposerDetails.ProposerDetail.Gender == "1") {
                        pDC.proposerDetails.ProposerDetail.Salutation = 'Mr';
                    } else if (pDC.proposerDetails.ProposerDetail.Gender == "0") {
                        pDC.proposerDetails.ProposerDetail.Salutation = 'Ms';
                    }

                    if (pDC.productName == "Activ Assure") {
                        (pDC.proposerDetails.ProposerDetail.IsSelf == 1) ? pDC.DI = true : "";
                    } else if (pDC.productName == "Activ Health") {
                        (pDC.proposerDetails.ProposerDetail.IsSelf == 1) ? pDC.PL = true : "";
                    } else if (pDC.productName == "Activ Care") {
                        (pDC.proposerDetails.ProposerDetail.IsSelf == 1) ? pDC.AC = true : "";
                    }
                    if (pDC.proposerDetails.ProposerDetail.Zone != null) {
                        // var zoneIntial = pDC.proposerDetails.ProposerDetail.Zone.split("Z00");
                        // zoneVal = zoneIntial[1]
                        zoneVal = pDC.proposerDetails.ProposerDetail.Zone; 
                    }
                    if (pDC.proposerDetails.ProposerDetail.PinCode != "" || pDC.proposerDetails.ProposerDetail.PinCode != "") {
                        if(pDC.proposerDetails.ProposerDetail.Zone != null){
                            pDC.changePinCode(pDC.proposerDetails.ProposerDetail.Zone, true);
                        } else{
                            pDC.changePinCode(pDC.proposerDetails.ProposerDetail.PinCode, true);
                        }
                    }
                    if (pDC.proposerDetails.ProductInsuredDetail != null) {
                        angular.forEach(pDC.proposerDetails.ProductInsuredDetail, function (v, i) {
                            calculatePremiumParams[v.ProductCode] = {};
                            pDC[v.ProductCode] = true;
                            projectPlans[v.ProductCode + "Plan"] = v.Plan;
                            calculatePremiumParams[v.ProductCode][v.ProductCode + "PremiumList"] = v.InsuredMembers;
                            for (var i = 0; i < v.InsuredMembers.length; i++) {
                                if (v.InsuredMembers[i].RelationWithProposer == "PROPOSER") {
                                    proposerObj[v.ProductCode] = v.InsuredMembers[i];
                                    proposerAge = v.InsuredMembers[i].Age;
                                }
                                if (v.InsuredMembers[i].RelationWithProposer == "SELF") {
                                    selfObj[v.ProductCode] = v.InsuredMembers[i];
                                }
                            }
                        });
                        (pDC.proposerDetails.ProposerDetail.IsSelf != 1 && pDC.proposerDetails.ProposerDetail.IsSelf != 'Y') ? pDC.showAnnualIncome = true : "";
                    }
                    var userDate = new Date(pDC.dbDate);
                    var currentDate = new Date();
                    var dateDiff = currentDate - userDate;
                    var userAge = Math.floor((dateDiff / 1000) / (60 * 60 * 24 * 365.25));
                    if (pDC.proposerDetails.ProposerDetail.PolicyType == "MI" && pDC.proposerDetails.ProposerDetail.IsSelf == 1) {
                        if (userAge > 80 || userAge < 55) {
                            pDC.day = "";
                            pDC.month = "";
                            pDC.year = "";
                            pDC.DOB = ""
                            $("#insuredDetailsClick").removeClass('active');
                            $("#hAndL").removeClass('active')
                            $("#decl").removeClass('active')
                        }
                    }
                    angular.forEach(pDC.proposerDetails.PremiumDetail.ProductPremium, function (v, i) {
                        pDC.proposerDetails.PremiumDetail.TotalPremium = parseInt(pDC.proposerDetails.PremiumDetail.TotalPremium) + parseInt(v.Premium);
                        if (parseInt(v.Premium) <= 0) {
                            pDC.hideSubmitButton = false;
                        }
                    });
                    fetchInsuredMemeberDetails();
                    if (parseInt(pDC.proposerDetails.PremiumDetail.TotalPremium) >= 100000) {
                        pDC.proposerDetails.ProposerDetail.IdNumber = (pDC.proposerDetails.ProposerDetail.PanNo != "") ? pDC.proposerDetails.ProposerDetail.PanNo : "";
                        pDC.proposerDetails.ProposerDetail.IdType = "Pan Card"
                        pDC.showOtherId = true;
                    }
                } else {
                    $rootScope.alertConfiguration('E', data.ResponseMessage);
                }
            }, function (err) {
            });
    }

    pDC.fetchProposerDetails(true);

    /* End of fetching quote details */

    /* email hint text logic */
    $(function () {
        var info = $('.info');

        $('#proposeremailID').mailtip({
            onselected: function (mail) {
                pDC.proposerDetails.ProposerDetail.Email = mail;
            }
        });
    });
    /* email hint text logic ends*/

    /* Change Aadhar Status */

    pDC.changeAadharStatus = function (type) {
        if (pDC.idTypeVal != type) {
            pDC.proposerDetails.ProposerDetail.IdNumber = ""
            pDC.idTypeVal = type;
        }
    }

    /* End of change aadhar status */


    /* Mobile number change in case of activ care product */

    pDC.changeMobile = function () {
        if (pDC.proposerDetails.ProposerDetail.WhatsAppNo == "" && pDC.productName == "Activ Care") {
            pDC.proposerDetails.ProposerDetail.WhatsAppNo = angular.copy(pDC.proposerDetails.ProposerDetail.MobileNo);
        }
    }

    /* End of mobile number change in case of activ care product */


    /* To fetch Sum Insureds */

    aS.getData("assets/data/sum-insured.json", "", false, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            if (data.ResponseCode == 1) {
                pDC.sumAmounts = data.ResponseData;
            }
        }, function (err) {

        })

    /* End of fetching sum insureds */


    /* To fetch insured members */

    function fetchInsuredMemeberDetails() {
        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });
        console.log("GetInsuredMembers Request");
        console.log({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetInsuredMembers", {
            "_data": reqData
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                var data = JSON.parse($rootScope.decrypt(data._resp))
                console.log("GetInsuredMembers Response");
                console.log(data);
                if (data.ResponseCode == 1) {
                    var userAge;
                    if (data.ResponseData.Tenure == "1") {
                        pDC.showPerAnum = true;
                    }
                    productInsuredMembers = data.ResponseData.ProductInsuredDetail;
                    if (pDC.DOB != "undefined-undefined-") {
                        checkAgeDiff(pDC.DOB);
                    }
                    for (var i = 0; i < productInsuredMembers.length; i++) {
                        if (productInsuredMembers[i].ProductCode == 'ST') {
                            pDC.stProductAvail = true;
                        }
                    }
                    if (pDC.productName == "Activ Care") {
                        for (var i = 0; i < data.ResponseData.ProductInsuredDetail.length; i++) {
                            if (data.ResponseData.ProductInsuredDetail[i].ProductCode == 'AC') {
                                for (var j = 0; j < data.ResponseData.ProductInsuredDetail[i].InsuredMembers.length; j++) {
                                    if (data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "PROPOSER") {
                                        proposerAge = data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].Age
                                        var userDate = new Date(pDC.dbDate);
                                        var currentDate = new Date();
                                        var dateDiff = currentDate - userDate;
                                        userAge = Math.floor((dateDiff / 1000) / (60 * 60 * 24 * 365.25));
                                        if (userAge != proposerAge) {
                                            pDC.day = "";
                                            pDC.month = "";
                                            pDC.year = "";
                                            pDC.DOB = ""
                                        }
                                    }

                                    calculatePremiumParams.AC.MemberDetails.push(data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j]);
                                    if (pDC.proposerDetails.ProposerDetail.IsSelf == '1' && data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "SPO") {
                                        pDC.showmaritalStatus = false;
                                    }
                                    if ((data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "FIL" || data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "MIL" || data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "F" || data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "M" || data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "GF" || data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationType == "GM") && proposerAge > data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].Age) {
                                        $rootScope.alertConfiguration('E', "Self age cannot be greater " + data.ResponseData.ProductInsuredDetail[i].InsuredMembers[j].RelationWithProposer);
                                        pDC.day = "";
                                        pDC.month = "";
                                        pDC.year = "";
                                        pDC.DOB = ""
                                    }
                                }
                                break;
                            }
                        }
                        //console.log(calculatePremiumParams);
                    }
                } else {
                    $rootScope.alertConfiguration('E', data.ResponseMessage);
                }
            }, function (err) {
            });
    }

    /* End of fetching insured members */


    /* To Calulate Premium */

    function calculatePremium(data) {
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", calculatePremiumParams, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (response.ResponseCode == 1) {
                    pDC.proposerDetails.PremiumDetail = response.ResponseData;
                    pDC.proposerDetails.PremiumDetail.TotalPremium = 0;
                    angular.forEach(pDC.proposerDetails.PremiumDetail.ProductPremium, function (v, i) {
                        pDC.proposerDetails.PremiumDetail.TotalPremium = parseInt(pDC.proposerDetails.PremiumDetail.TotalPremium) + parseInt(v.Premium);
                        if (parseInt(v.Premium) <= 0) {
                            pDC.hideSubmitButton = false;
                        }

                    });
                    
                    if (parseInt(pDC.proposerDetails.PremiumDetail.TotalPremium) >= 100000 && pDC.proposerDetails.ProposerDetail.IdType != "Pan Card") {
                        pDC.proposerDetails.ProposerDetail.IdType = "Pan Card"
                        pDC.proposerDetails.ProposerDetail.IdNumber ? pDC.proposerDetails.PremiumDetail.PanNo : ""
                        pDC.showOtherId = true;
                    }
                    else {
                        pDC.showOtherId = false;
                    }
                } else {
                    $rootScope.alertConfiguration('E', response.ResponseMessage);
                }
            }, function (err) {

            });
    }

    /* End of calulating premium */


    /* Productwise age validation */

    function productWiseAgeValidation(age) {
        var showAlert = "<ul>";
        var primaryPLDIMembers;
        angular.forEach(productInsuredMembers, function (v, i) {
            if (v.ProductCode == "PL") {
                var minAgeValidation = 20;
                primaryPLDIMembers = v.InsuredMembers.length;
                (pDC.proposerDetails.ProposerDetail.IsSelf == 1) ? minAgeValidation = 18 : "";
                var maxAgeForPL = pDC.proposerDetails.ProposerDetail.PlanType == 'Premiere' ? 65 : 150;
                if (pDC.proposerDetails.ProposerDetail.PlanType == 'Essential' && pDC.proposerDetails.ProposerDetail.IsSelf == 1) {
                    minAgeValidation = 55
                }
                if (age > maxAgeForPL || age < minAgeValidation) {
                    showAlert = showAlert + "<li>For Activ Health Product Proposer age should be greater than or equal to " + minAgeValidation + " and less than or equal to " + maxAgeForPL + "</li>";
                    pDC.day = ""
                    pDC.month = ""
                    pDC.year = ""
                    return false;
                }
            }
            if (v.ProductCode == "FIT") {
                var minAgeValidation = 20;
                primaryPLDIMembers = v.InsuredMembers.length;
                (pDC.proposerDetails.ProposerDetail.IsSelf == 1) ? minAgeValidation = 18 : "";
                var maxAgeForPL = pDC.proposerDetails.ProposerDetail.PlanType == 'Premiere' ? 65 : 150;
                if (pDC.proposerDetails.ProposerDetail.PlanType == 'Essential' && pDC.proposerDetails.ProposerDetail.IsSelf == 1) {
                    minAgeValidation = 55
                }
                if (age > maxAgeForPL || age < minAgeValidation) {
                    showAlert = showAlert + "<li>For Activ Health Product Proposer age should be greater than or equal to " + minAgeValidation + " and less than or equal to " + maxAgeForPL + "</li>";
                    pDC.day = ""
                    pDC.month = ""
                    pDC.year = ""
                    return false;
                }
            }
            if (v.ProductCode == "DI") {
                primaryPLDIMembers = v.InsuredMembers.length;
                if (age > 99 || age < 18) {
                    showAlert = showAlert + "<li>For Activ Assure Product Proposer age should be greater than or equal to 18 and less than or equal to 99</li>";
                }
            }
            if (v.ProductCode == "PA" || v.ProductCode == "CI" || v.ProductCode == "CS") {
                if (age > 65 || age < 18) {
                    showAlert = showAlert + "<li>For Activ Secure Product Proposer age should be greater than or equal to 18 and less than or equal to 65</li>";
                }
            }
            if (v.ProductCode == "CK") {
                if (age > 65 || age < 18) {
                    showAlert = showAlert + "<li>For Corona Kavach Product Proposer age should be greater than or equal to 18 and less than or equal to 65</li>";
                }
            }
            if (v.ProductCode == "AS") {
                if (pDC.proposerDetails.ProposerDetail.IsSelf != 1 && (age < 18 || age > 80)) {
                    showAlert = showAlert + "<li>For Arogya Sanjeevani Product Proposer age should be greater than or equal to 18 and less than or equal to 80.</li>";
                } else if (pDC.proposerDetails.ProposerDetail.IsSelf == 1 && (age < 18 || age > 65)) {
                    showAlert = showAlert + "<li>For Arogya Sanjeevani Product Proposer age should be greater than or equal to 18 and less than or equal to 65.</li>";
                }
            }
            if (v.ProductCode == "AC") {
                if (pDC.proposerDetails.ProposerDetail.IsSelf != 1 && (age < 18 || age > 80)) {
                    showAlert = showAlert + "<li>For Activ Care Product Proposer age should be greater than or equal to 18 and less than or equal to 80.</li>";
                } else if (pDC.proposerDetails.ProposerDetail.IsSelf != 1 && (age > 18 || age < 80)) {
                    for (var i = 0; i < v.InsuredMembers.length; i++) {
                        if ((v.InsuredMembers[i].RelationType == "FIL" || v.InsuredMembers[i].RelationType == "MIL" || v.InsuredMembers[i].RelationType == "F" || v.InsuredMembers[i].RelationType == "M" || v.InsuredMembers[i].RelationType == "GF" || v.InsuredMembers[i].RelationType == "GM") && (age > v.InsuredMembers[i].Age)) {
                            showAlert = showAlert + "<li>Age of proposer should be less than Parents</li>";
                            pDC.day = ""
                            pDC.month = ""
                            pDC.year = ""
                            return false;
                        }
                    }
                }
                else {
                    var atleastOneAboveRequired = false;
                    var acErrorMsg = pDC.proposerDetails.ProposerDetail.PolicyType == 'FF' ? "<li>For Family Floater policy type atleast one member should be above 55 to 80 </li>" : "<li>For Multi-individual prodcut type the age of each members hould be above 55 and less than 80 </li>"
                    if (age < 55 && pDC.proposerDetails.ProposerDetail.PolicyType == 'FF') {
                        for (var i = 1; i < v.InsuredMembers.length; i++) {
                            if (v.InsuredMembers[i].Age > 55 && v.InsuredMembers[i].RelationType != 'S') {
                                atleastOneAboveRequired = true;
                                break;
                            }
                        }
                    } else if (age >= 55 && pDC.proposerDetails.ProposerDetail.PolicyType == 'FF') {
                        atleastOneAboveRequired = true;
                    }
                    if (pDC.proposerDetails.ProposerDetail.PolicyType == 'MI' && age >= 55) {
                        atleastOneAboveRequired = true;

                    }
                    if (!atleastOneAboveRequired || age > 80) {
                        showAlert = showAlert + acErrorMsg;
                        pDC.day = ""
                        pDC.month = ""
                        pDC.year = "";
                        pDC.DOB = ""
                    }
                }
            }
        });
        showAlert = showAlert + "</ul>";
        var rObj = {
            "primaryPLDIMembers": primaryPLDIMembers,
            "showAlert": showAlert
        }
        return rObj;
    }

    /* End of productwise age validation */


    /* Age difference validation */

    function checkAgeDiff(date) {
        var userDate = new Date(date);
        var currentDate = new Date();
        var dateDiff = currentDate - userDate;
        var userAge = Math.floor((dateDiff / 1000) / (60 * 60 * 24 * 365.25));
        var updatePremium = false;
        pDC.isValidateAge = true;
        var dOBValidateData = productWiseAgeValidation(userAge);
        if (dOBValidateData.showAlert != "<ul></ul>") {
            pDC.isValidateAge = false;
            $rootScope.alertConfiguration('E', dOBValidateData.showAlert, "proposer_DOB_alert");
            return false;
        }
        if ((pDC.CI || pDC.CS) && !pDC.showAnnualIncome) {
            if (userAge != proposerAge) {
                updatePremium = true;
                angular.forEach(pDC.proposerDetails.ProductInsuredDetail, function (v, i) {
                    for (var i = 0; i < v.InsuredMembers.length; i++) {
                        if (v.InsuredMembers[i].RelationType == "S" || v.InsuredMembers[i].RelationType == "PROPOSER") {
                            v.InsuredMembers[i].AGE = userAge;
                        }
                    }
                });
            }
        }
        if (pDC.DI) {
            // Age validation for Diamond + Super Top up 
            if (productInsuredMembers.length > 1) {
                if (productInsuredMembers[1].ProductCode == "ST") {
                    for (var i = 0; i < productInsuredMembers[1].InsuredMembers.length; i++) {
                        if (userAge > 65) {
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Alert",
                                "modalBodyText": "Age of " + productInsuredMembers[1].InsuredMembers[i].RelationWithProposer + " should not be greater than 65.",
                                "showCancelBtn": false,
                                "modalSuccessText": "Ok",
                                "showAlertModal": true
                            }
                            pDC.isValidateAge = false;
                            return false;
                        }
                    }
                }
            }
            for (var i = 0; i < productInsuredMembers[0].InsuredMembers.length; i++) {
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S" || productInsuredMembers[0].InsuredMembers[i].RelationType == "PROPOSER") {
                    productInsuredMembers[0].InsuredMembers[i].Age = userAge;
                }
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S") {
                    updatePremium = true;
                }
            }
            calculatePremiumParams.Diamond = {
                'MemberDetails': productInsuredMembers[0].InsuredMembers
            };
        } else if (pDC.AC) {
            if (userAge != proposerAge) {

                for (var i = 0; i < calculatePremiumParams.AC.MemberDetails.length; i++) {
                    if (calculatePremiumParams.AC.MemberDetails[i].RelationType == "S" || calculatePremiumParams.AC.MemberDetails[i].RelationType == "PROPOSER") {
                        calculatePremiumParams.AC.MemberDetails[i].Age = userAge;
                    }
                    if (calculatePremiumParams.AC.MemberDetails[i].RelationType == "S") {
                        updatePremium = true;
                    }
                }
            }
        }
        else if (pDC.FIT) {
            for (var i = 0; i < productInsuredMembers[0].InsuredMembers.length; i++) {
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S" || productInsuredMembers[0].InsuredMembers[i].RelationType == "PROPOSER") {
                    productInsuredMembers[0].InsuredMembers[i].Age = userAge;
                }
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S") {
                    updatePremium = true;
                }
            }
            calculatePremiumParams.Fit = {
                'MemberDetails': productInsuredMembers[0].InsuredMembers
            };

        }
        else if (pDC.PL) {
            for (var i = 0; i < productInsuredMembers[0].InsuredMembers.length; i++) {
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S" || productInsuredMembers[0].InsuredMembers[i].RelationType == "PROPOSER") {
                    productInsuredMembers[0].InsuredMembers[i].Age = userAge;
                }
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S") {
                    updatePremium = true;
                }
            }
            calculatePremiumParams.Platinum = {
                'MemberDetails': productInsuredMembers[0].InsuredMembers
            };

        }
        else if (pDC.CK) {
            for (var i = 0; i < productInsuredMembers[0].InsuredMembers.length; i++) {
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S" || productInsuredMembers[0].InsuredMembers[i].RelationType == "PROPOSER") {
                    productInsuredMembers[0].InsuredMembers[i].Age = userAge;
                }
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S") {
                    updatePremium = true;
                }
            }
            calculatePremiumParams.CK = {
                'MemberDetails': productInsuredMembers[0].InsuredMembers
            };

        }
        else if (pDC.AS) {
            for (var i = 0; i < productInsuredMembers[0].InsuredMembers.length; i++) {
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S" || productInsuredMembers[0].InsuredMembers[i].RelationType == "PROPOSER") {
                    productInsuredMembers[0].InsuredMembers[i].Age = userAge;
                }
                if (productInsuredMembers[0].InsuredMembers[i].RelationType == "S") {
                    updatePremium = true;
                }
            }
            calculatePremiumParams.AS = {
                'MemberDetails': productInsuredMembers[0].InsuredMembers
            };

        }

        if (userAge > 45 && pDC.FIT && updatePremium){
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Age of insured members should not exceeds 45 years.",
                "showCancelBtn": false,
                "modalSuccessText": "Ok",
                "showAlertModal": true
            }

            pDC.day = "";
            pDC.month = "";
            pDC.year = "";
            pDC.DOB = "";
            return false;
        }
        pDC.proposerDetails.ProposerDetail.AGE = userAge;
        if (updatePremium && (pDC.CI || pDC.CS || pDC.PL || pDC.FIT || pDC.DI || pDC.CK || pDC.AC || pDC.AS) && !pDC.showAnnualIncome) {
            calculatePremium(calculatePremiumParams);
            $rootScope.alertConfiguration('S', "Premium has been recalculated based on the date of birth selected", "premium_recalculated_dob_alert");
        }
        if (userAge > 45 && pDC.PL && !pDC.showAnnualIncome) {
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Since age of one of the insured members exceeds 45 years, your proposal will be processed by our underwriting team.",
                "showCancelBtn": false,
                "modalSuccessText": "Ok",
                "showAlertModal": true
            }
        }
    }

    /* End of age difference validation */


    /* Formation of DOB */

    pDC.changeDate = function (day, month, year) {
        pDC.DOB = day + "-" + month + "-" + year;
        pDC.proposerDetails.ProposerDetail.DOB = year + "-" + month + "-" + day;
        $timeout(function () {
            if (pDC.proposerDetailsForm.dob.$valid && year.toString().length == 4) {
                checkAgeDiff(pDC.proposerDetails.ProposerDetail.DOB);
            }
        }, 300);
    }

    /* End of formation of DOB */


    /* Get updated Prenium on age and salutation change */

    pDC.calculatePremium = function (data) {
        delete pDC.proposerDetails.PremiumDetail;
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", calculatePremiumParams, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (response.ResponseCode == 1) {
                    pDC.proposerDetails.PremiumDetail = response.ResponseData;
                    if (parseInt(pDC.proposerDetails.PremiumDetail.TotalPremium) >= 100000 && pDC.proposerDetails.ProposerDetail.IdType != "Pan Card") {
                        pDC.proposerDetails.ProposerDetail.IdType = "PAN Card"
                        pDC.proposerDetails.ProposerDetail.IdNumber = ""
                        pDC.showOtherId = true;
                    }
                    else {
                        pDC.showOtherId = false;
                    }
                } else {
                    $rootScope.alertConfiguration('E', response.ResponseMessage);
                }
            }, function (err) {
            });
    }

    /* Get updated Prenium on age and salutation change */


    /* Change Pincode and update State and City  Details */

    pDC.changePinCode = function (validPinCode, param) {
        if (validPinCode) {
            pDC.proposerDetails.ProposerDetail.City = "";
            pDC.proposerDetails.ProposerDetail.CustState = "";
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/PinCode", {
                "PinCode": pDC.proposerDetails.ProposerDetail.PinCode,
                "Productcode": pDC.productCode
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (data) {
                    if (data.ResponseCode == 1) {
                        pDC.proposerDetails.ProposerDetail.City = data.ResponseData.City;
                        pDC.proposerDetails.ProposerDetail.CustState = data.ResponseData.State;
                        if (pDC.productName == "Activ Health") {
                            var newZone = data.ResponseData.Zone.split("Z00");
                            var oldZone = pDC.proposerDetails.ProposerDetail.Zone.split("Z00");
                            if (parseInt(oldZone[1]) >= parseInt(newZone[1])) {
                                if (angular.isUndefined(param)) {
                                    zoneVal = data.ResponseData.Zone;
                                    calculatePremiumParams.Platinum.Zone = zoneVal;
                                    pDC.calculatePremium();
                                }
                                else {
                                    // pDC.proposerDetails.ProposerDetail.PinCode = ""
                                    // pDC.proposerDetails.ProposerDetail.City = "";
                                    // pDC.proposerDetails.ProposerDetail.CustState = ""
                                }
                            }
                            else {
                                zoneVal = pDC.proposerDetails.ProposerDetail.Zone;
                                calculatePremiumParams.Platinum.Zone = zoneVal;
                                pDC.calculatePremium();
                            }
                        }
                    } else {
                        // $rootScope.alertConfiguration('E',data.ResponseMessage);
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "Ok",
                            "showAlertModal": true,
                            "hideCloseBtn": true,
                            "positiveFunction": function () {
                                pDC.proposerDetails.ProposerDetail.PinCode = "";
                            }
                        }

                    }
                }, function (err) {
                });
        }
    }

    /* End of change Pincode and update State and City  Details */


    /* Change of Salutaion */

    pDC.changeSalutation = function (gender, salutation) {
        pDC.proposerDetails.ProposerDetail.Gender = gender;
        var toCallPremium = false;
        if (pDC.PL) {
            angular.forEach(productInsuredMembers[0].InsuredMembers, function (v, i) {
                if (v.RelationType == "PROPOSER" || v.RelationType == "S") {
                    v.Gender = gender
                }
                else {
                    if (salutation == "Mrs" || salutation == "Ms" || salutation == 'Ms/Other') {
                        v.Gender = "1"
                    } else {
                        v.Gender = "0"
                    }
                }


            })
            calculatePremiumParams.Platinum = {
                'MemberDetails': productInsuredMembers[0].InsuredMembers
            };
            toCallPremium = true;
        }
        if (pDC.CS) {
            proposerObj.CS.gender = gender;
            if (!pDC.showAnnualIncome) {
                selfObj.CS.gender = gender;
            }
        }
        if (pDC.AC && pDC.proposerDetails.ProposerDetail.IsSelf == "1") {
            angular.forEach(calculatePremiumParams.AC.MemberDetails, function (v, i) {
                if (v.RelationType == "PROPOSER" || v.RelationType == "S") {
                    v.Gender = gender
                }
                else {
                    if (salutation == "Mrs" || salutation == "Ms") {
                        v.Gender = "1"
                    } else {
                        v.Gender = "0"
                    }
                }
            })
            toCallPremium = true;
        }
        if (toCallPremium || pDC.CS) {
            $rootScope.alertConfiguration('S', "Premium has been recalculated based on the selected salutation.");
            calculatePremium();
        }
    }

    /* End of change of salutation */


    /* Manage Sum Insured of members */

    function manageSumInsuredOfProduct(productCode, insuredMembers, maxSumInsured, currentProductPlan) {
        for (var i = 0; i < insuredMembers.length; i++) {
            if (insuredMembers[i].EarningNonEarning != "Earning") {
                if ((insuredMembers[i].RelationWithProposer == "SPOUSE" && (insuredMembers[i].Designation != 'Under Graduate' || productCode == "PA")) || insuredMembers[i].RelationWithProposer == "PROPOSER") {
                    insuredMembers[i].SumInsured = maxSumInsured;
                } else if (insuredMembers[i].RelationWithProposer == "FATHER" || insuredMembers[i].RelationWithProposer == "MOTHER" || insuredMembers[i].RelationWithProposer == "FATHER-IN-LAW" || insuredMembers[i].RelationWithProposer == "MOTHER-IN-LAW" || (insuredMembers[i].RelationWithProposer == "SPOUSE" && insuredMembers[i].Designation == 'Under Graduate')) {
                    if (productCode == "PA") {
                        insuredMembers[i].SumInsured = maxSumInsured;
                    } else {
                        var parentsSI = angular.copy(maxSumInsured / 2);
                        if (parentsSI > 1000000) {
                            insuredMembers[i].SumInsured = 1000000;
                        } else if (parentsSI < 500000 && (currentProductPlan == 'ci3' || currentProductPlan == 'CS')) {
                            insuredMembers[i].SumInsured = 500000;
                        } else if (maxSumInsured == 1500000) {
                            insuredMembers[i].SumInsured = 700000;
                        } else if (maxSumInsured == 900000) {
                            insuredMembers[i].SumInsured = 400000;
                        } else if (maxSumInsured == 700000) {
                            insuredMembers[i].SumInsured = 300000;
                        } else if (maxSumInsured == 500000) {
                            insuredMembers[i].SumInsured = 200000;
                        } else if (maxSumInsured == 300000 || maxSumInsured == 200000 || maxSumInsured == 100000) {
                            insuredMembers[i].SumInsured = 100000;
                        } else {
                            insuredMembers[i].SumInsured = parentsSI;
                        }
                    }
                } else if (insuredMembers[i].RelationWithProposer == "KID") {
                    if (productCode == "PA") {
                        if (maxSumInsured < 1500000) {
                            insuredMembers[i].SumInsured = maxSumInsured;
                        } else if (maxSumInsured > 1500000) {
                            insuredMembers[i].SumInsured = 1500000;
                        }
                    } else if (productCode == "CI") {
                        if (maxSumInsured >= 3000000) {
                            insuredMembers[i].SumInsured = 1500000;
                        } else if (maxSumInsured == 2500000 || maxSumInsured == 2000000) {
                            insuredMembers[i].SumInsured = 1000000;
                        } else if (maxSumInsured == 1500000) {
                            insuredMembers[i].SumInsured = 700000;
                        } else if (maxSumInsured == 1000000) {
                            insuredMembers[i].SumInsured = 500000;
                        } else if (maxSumInsured < 1000000 && maxSumInsured > 500000 && currentProductPlan == 'ci3') {
                            insuredMembers[i].SumInsured = 500000;
                        } else if ((maxSumInsured == 900000 || maxSumInsured == 800000) && currentProductPlan != 'ci3') {
                            insuredMembers[i].SumInsured = 400000;
                        } else if ((maxSumInsured == 700000 || maxSumInsured == 600000) && currentProductPlan != 'ci3') {
                            insuredMembers[i].SumInsured = 300000;
                        } else if ((maxSumInsured == 500000 || maxSumInsured == 400000) && currentProductPlan != 'ci3') {
                            insuredMembers[i].SumInsured = 200000;
                        } else if ((maxSumInsured == 300000 || maxSumInsured == 200000 || maxSumInsured == 100000) && currentProductPlan != 'ci3') {
                            insuredMembers[i].SumInsured = 100000;
                        }
                    } else if (productCode == "CS") {
                        if (maxSumInsured < 1500000 && maxSumInsured > 500000) {
                            insuredMembers[i].SumInsured = 500000;
                        } else if (maxSumInsured < 3000000 && maxSumInsured > 1500000) {
                            insuredMembers[i].SumInsured = 1000000;
                        } else {
                            insuredMembers[i].SumInsured = 1500000;
                        }
                    }
                }
            }
        };
    };

    /* End of managing sum insured of members */


    /* To change Annual Income */

    pDC.calculateAnnualIncome = function (annualIncome) {
        var chkAnnualIncome = 9999;
        if (pDC.CS || (pDC.CI && projectPlans.CIPlan == 3)) {
            chkAnnualIncome = 42000;
        }
        if (annualIncome > chkAnnualIncome) {
            pDC.proposerDetails.ProposerDetail.EarningNonEarning = "Earning";
            var selectedRFBProducts = pDC.proposerDetails.ProductInsuredDetail.length;
            var errorAlert = "<ul>";
            angular.forEach(pDC.proposerDetails.ProductInsuredDetail, function (v, i) {
                selectedRFBProducts = selectedRFBProducts - 1;
                if (v.ProductCode != "PA") {
                    for (var i = 0; i < v.InsuredMembers.length; i++) {
                        if (v.InsuredMembers[i].RelationType == "PROPOSER") {
                            v.InsuredMembers[i].EarningNonEarning = "Earning";
                            v.InsuredMembers[i].AnnualIncome = annualIncome;
                            var currentPlan;
                            if (v.ProductCode != "CS") {
                                currentPlan = v.ProductCode.toLowerCase() + v.Plan;
                            } else {
                                currentPlan = "CS";
                            }
                            var isProceed = true;
                            var maxInsured;
                            angular.forEach(pDC.sumAmounts, function (val, ind) {
                                if (isProceed && val[currentPlan]) {
                                    if (val.amount > (annualIncome * 12)) {
                                        isProceed = false;
                                    } else {
                                        maxInsured = ind;
                                    }
                                }
                            });
                            if (v.InsuredMembers[i].SumInsured > (annualIncome * 12)) {
                                v.InsuredMembers[i].SumInsured = pDC.sumAmounts[maxInsured].amount;
                                manageSumInsuredOfProduct(v.ProductCode, v.InsuredMembers, pDC.sumAmounts[maxInsured].amount, currentPlan);
                                errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income (" + $filter('INR')(pDC.sumAmounts[maxInsured].amount) + ") for " + $filter('productFilter')(v.ProductCode) + ".</li>";
                            } else {
                                if (pDC.sumAmounts[maxInsured].amount >= 2500000) {
                                    v.InsuredMembers[i].SumInsured = 2500000;
                                    errorAlert = errorAlert + "<li>Maximum Sum Insured for " + $filter('productFilter')(v.ProductCode) + " product based on entered annual income is 25,00,000.</li>";
                                } else {
                                    v.InsuredMembers[i].SumInsured = pDC.sumAmounts[maxInsured].amount;
                                    errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income (" + $filter('INR')(pDC.sumAmounts[maxInsured].amount) + ") for " + $filter('productFilter')(v.ProductCode) + ".</li>";
                                }
                                if (v.InsuredMembers[i].RelationType == "S") {
                                    manageSumInsuredOfProduct(v.ProductCode, v.InsuredMembers, v.InsuredMembers[i].SumInsured, currentPlan);
                                }
                            }
                            break;
                        }
                    }
                }
            });
            if (selectedRFBProducts == 0) {
                errorAlert = errorAlert + "</ul>";
                calculatePremium();
                if (errorAlert != "<ul></ul>") {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": errorAlert,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true
                    }
                }
            }
        } else {
            var errorAlert = "<ul><li>You are not eligible for this product based on declared income.</li>";
            if (pDC.CI && projectPlans.CIPlan == 3) {
                errorAlert = errorAlert + "<li>Minimum Annual Income required for Critical Illness Plan 3 is 42,000.</li>";
            } else if (pDC.CI) {
                errorAlert = errorAlert + "<li>Minimum Annual Income required for Critical Illness Plan 1/2 is 9,999.</li>";
            }
            if (pDC.CS) {
                errorAlert = errorAlert + "<li>Minimum Annual Income required for Cancer Secure is 42,000.</li>";
            }
            errorAlert = errorAlert + "</ul>";
            errorAlert = errorAlert + "<div><p class='modal-bind-text'>Do you want to change Annual Income ?</p></div>";
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Warning",
                "modalBodyText": errorAlert,
                "showCancelBtn": true,
                "modalSuccessText": "Yes",
                "modalCancelText": "No",
                "showAlertModal": true,
                "hideCloseBtn": true,
                "positiveFunction": function () {
                    pDC.proposerDetails.ProposerDetail.AnnualIncome = "";
                },
                "negativeFunction": function () {
                    pDC.proposerDetails.ProposerDetail.AnnualIncome = "";
                    $location.url(pDC.quotePage);
                }
            }
        }
    }

    /* End of changing annual income */


    /* Submitting proposer details form */

    $rootScope.radioChecked = function() {	
        console.log(pDC.impnote)  
        if(!pDC.impnote){
            pDC.impnote = false;
        }else{
            pDC.impnote = true;
        }
      }

    pDC.submitProposerDetails = function (validForm, event) {

        

        if (!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(pDC.proposerDetails.ProposerDetail.Email)) && pDC.AC) {
            $rootScope.alertConfiguration('E', "Please enter a valid email id");
            $("html, body").animate({ scrollTop: $("#proposal-nominee-details").offset().top - 135 }, 300);
            return false;
        }

        if (!validForm) {
            pDC.showErrors = true;
            $("html, body").animate({ scrollTop: $("#proposal-nominee-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
            return false;
        }
        if (pDC.proposerDetails.ProposerDetail.IdType == "" || pDC.proposerDetails.ProposerDetail.Salutation == "" || pDC.proposerDetails.ProposerDetail.GSTType == "" || pDC.proposerDetails.ProposerDetail.NomineeRelation == "" || (pDC.proposerDetails.ProposerDetail.MaritualStatus == "" && pDC.AC) || (pDC.proposerDetails.ProposerDetail.Nationality == "" && pDC.FIT)) {
            pDC.showErrors = true;
            $("html, body").animate({ scrollTop: $("#proposal-nominee-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
            return false;
        }
        /*--------- Professional Detials Validation for Arogya Sanjeevani, Platinum & Corona Kavach ----------*/
        if ((pDC.AS || pDC.CK || pDC.PL) && (pDC.proposerDetails.ProposerDetail.AnnualIncome == '' || pDC.proposerDetails.ProposerDetail.AnnualIncome == 0 || pDC.proposerDetails.ProposerDetail.Occupation == '' || pDC.proposerDetails.ProposerDetail.Qualification == '')) {
            pDC.showErrors = true;
            $("html, body").animate({ scrollTop: $("#proposal-nominee-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
            return false;
        }
        if (pDC.stProductAvail && pDC.proposerDetails.ProposerDetail.AnnualIncome == '') {
            pDC.showErrors = true;
            $("html, body").animate({ scrollTop: $("#proposal-nominee-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
            return false;
        }
        if (pDC.impnote == false) {
            pDC.showErrors = true;
            $("html, body").animate({ scrollTop: $("#impnote").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E', "Please confirm AML/KYC consent to go ahead in the application", "valid_data_alert");
            return false;
        }
        /*--------- End of Professional Detials Validation for Arogya Sanjeevani, Platinum & Corona Kavach ---------*/
        if (!pDC.isValidateAge) {
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Due to invalid age based on DOB entered by you, we will not be able to process your form. DO you want to alter your product selection and member construct?",
                "showCancelBtn": true,
                "modalSuccessText": "Yes",
                "modalCancelText": "No",
                "showAlertModal": true,
                "positiveFunction": function () {
                    $location.url(pDC.quotePage);
                },
                "negativeFunction": function () {
                    pDC.day = "";
                    pDC.month = "";
                    pDC.year = "";
                    pDC.DOB = "";
                }
            }
            return false;
        }

        if (pDC.proposerDetails.ProposerDetail.IdType == "Pan Card") {
            pDC.proposerDetails.ProposerDetail.PanNo = pDC.proposerDetails.ProposerDetail.IdNumber;
        } else {
            //pDC.proposerDetails.ProposerDetail.PanNo = ""; //removed because as per IRDA rules we have fetch PAN no. for all the proposer
        }
        var actText = angular.copy(event.target.innerHTML);
        pDC.proposerDetails.ProposerDetail.Zone = zoneVal;
        event.target.disabled = true;
        event.target.textContent = "Saving...";
        delete pDC.proposerDetails.ProposerDetail.MaxAge;
        /* Update Session storage mobile no. in case of any changes */

        var mobNo = sessionStorage.getItem('mobNo');

        if (mobNo != pDC.proposerDetails.ProposerDetail.MobileNo) {
            sessionStorage.setItem('mobNo', pDC.proposerDetails.ProposerDetail.MobileNo)
        }

        /* Update Session storage mobile no. in case of any changes ends*/

        var lemeiskData = angular.copy(pDC.proposerDetails)
        delete lemeiskData.ProposerDetail.MobileNo
        delete lemeiskData.ProposerDetail.WhatsAppNo
        delete lemeiskData.ProposerDetail.NomineeContact
        delete lemeiskData.ProposerDetail.IdNumber
        delete lemeiskData.ProposerDetail.DOB
        delete lemeiskData.ProposerDetail.IdNumber
        //delete lemeiskData.ProposerDetail.AGE
        $rootScope.leminiskObj = lemeiskData
        $rootScope.lemniskCodeExcute()


        var lemniskObj = {
            "Sum insured": pDC.proposerDetails.ProposerDetail.SumInsured,
            "Salutation": pDC.proposerDetails.ProposerDetail.Salutation,
            "First name": pDC.proposerDetails.ProposerDetail.FirstName,
            "Last name": pDC.proposerDetails.ProposerDetail.LastName,
            "DOB": pDC.proposerDetails.ProposerDetail.DOB,
            "Whats app number": pDC.proposerDetails.ProposerDetail.MobileNo,
            "Marital status": pDC.proposerDetails.ProposerDetail.MaritualStatus,
            "Annual income": pDC.proposerDetails.ProposerDetail.AnnualIncome,
            "Occupation": pDC.proposerDetails.ProposerDetail.Occupation,
            "Pin code": pDC.proposerDetails.ProposerDetail.PinCode,
            "Gender": pDC.proposerDetails.ProposerDetail.Gender,
            "Premium Amount": pDC.proposerDetails.PremiumDetail.TotalPremium
        };
        $rootScope.lemniskTrack("", "", lemniskObj);

        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "ProposerDetail": pDC.proposerDetails.ProposerDetail,
            "ProductInsuredDetail": pDC.proposerDetails.ProductInsuredDetail
        });
        
        console.log("UpdateProposerDetails Request");
        console.log({
            "ReferenceNumber": sessionStorage.getItem('rid'),
            "ProposerDetail": pDC.proposerDetails.ProposerDetail,
            "ProductInsuredDetail": pDC.proposerDetails.ProductInsuredDetail
        });

        aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateProposerDetails", {
            "_data": reqData
        }, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                var data = JSON.parse($rootScope.decrypt(data._resp));
                console.log("UpdateProposerDetails Response");
                console.log(data);
                if (data.ResponseCode == '1') {
                    if ($location.$$path == "/cross-sell-proposer-details") {
                        $location.url('cross-sell-insured-details?product=' + sessionStorage.getItem('productSelctedInCross'));
                    } else {
                        if (pDC.productName == "Activ Assure") {
                            $location.url('diamond-insured-details');
                        } else if (pDC.productName == "Activ Health") {
                            $location.url('platinum-insured-details');
                        } else if (pDC.productName == "Activ Care") {
                            $location.url('activ-care-insured-details');
                        } else if (pDC.productName == "Corona Kavach") {
                            $location.url('corona-kavach-insured-details');
                        } else if (pDC.productName == "Arogya Sanjeevani") {
                            $location.url('arogya-sanjeevani-insured-details');
                        } else if (pDC.FIT) {
                            $location.url('fit-insured-details');
                        } else {
                            $location.url('rfb-insured-details');
                        }
                    }
                } else {
                    event.target.disabled = false;
                    event.target.innerHTML = actText;
                    $("html, body").animate({ scrollTop: $("#proposal-nominee-details").offset().top - 135 }, 300);
                    $rootScope.alertConfiguration('E', data.ResponseMessage);
                }
            }, function (err) {
                event.target.disabled = false;
                event.target.innerHTML = actText;
            });

    }

    /* End of submitting proposer details form */

    /** customer concern **/
    // window.addEventListener('beforeunload', function (e) {
    //     if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    //         $('#customer-concern').modal('hide');
    //       } else {
    //         aS.getData(ABHI_CONFIG.apiUrl + "gen/GetallSurveyQuestions", "", false, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //             .then(function (data) {
    //                 if (data.ResponseCode == 1) {
    //                     pDC.quiz = data.ResponseData;
    //                 }
    //             }, function (err) {
    
    //             })
    //         e.preventDefault();
    //         e.returnValue = '';
    //         $('#customer-concern').modal({ backdrop: 'static', keyboard: false });
    //       }
    // });
    /** customer concern end **/

    // pDC.saveQuesAns = function () {
    //     var QuestionObj = {}
    //     QuestionObj = pDC.quiz
    //     var AnswerObject = pDC.answer;
    //     var questionAnsObj = {
    //         "questionAnsObj": {
    //             "ReferenceNumber": sessionStorage.getItem('rid'),
    //             "QuestionObject":
    //             {
    //                 QuestionObj
    //             },
    //             "AnswerObject":
    //             {
    //                 AnswerObject
    //             }
    //         }
    //     }
    //     aS.postData(ABHI_CONFIG.apiUrl + "gen/SaveQueAnsWRTCustomer", questionAnsObj, true, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(function (data) {
    //             if (data.ResponseCode == '1') {
    //                 $rootScope.alertData = {
    //                     "modalClass": "regular-alert",
    //                     "modalHeader": "Alert",
    //                     "modalBodyText": data.ResponseMessage,
    //                     "showCancelBtn": false,
    //                     "modalSuccessText": "Ok",
    //                     "showAlertModal": true,
    //                     "hideCloseBtn": true,
    //                     "positiveFunction": function () {
    //                         pDC.answer = "";
    //                         $('#customer-concern').modal('hide');

    //                     }
    //                 }
    //             } else {
    //                 $rootScope.alertData = {
    //                     "modalClass": "regular-alert",
    //                     "modalHeader": "Alert",
    //                     "modalBodyText": data.ResponseMessage,
    //                     "showCancelBtn": false,
    //                     "modalSuccessText": "Ok",
    //                     "showAlertModal": true
    //                 }
    //             }
    //         });
    // }

}]);

/* End of controller */


/* Aadhar card enter directive */

pDApp.directive('aadharCard', function ($timeout) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                if (val === undefined || val === null) {
                    val = '';
                }
                var clean = val.toString().replace(/\D/g, "").split(/(?:([\d]{4}))/g).filter(function (s) {
                    return s.length > 0;
                }).join("-");
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function (e) {
                var code = e.keyCode || e.which;
                if (code === 101 || code === 32 || code === 109 || code === 45) {
                    e.preventDefault();
                }
            });
        }
    };
});

/* End of Aadhar card enter directive */


/* Aadhar Enrollment no. enter directive */

pDApp.directive('aadharEnrollaa', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                if (val === undefined || val === null) {
                    val = '';
                }
                ngModelCtrl.$setViewValue(val);
                ngModelCtrl.$render();
                return val;
            });
            element.bind('keypress', function (evt) {
                var text = $(this);
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if (charCode >= 48 && charCode <= 57) {
                    if (text.val().length === 4) {
                        text.val(text.val() + '-');
                    }
                    if (text.val().length === 10) {
                        text.val(text.val() + '-');
                    }
                }
                else {
                    evt.preventDefault();
                }
            });
        }
    };
});

/* End of Aadhar Enrollment no. enter directive */




/**
 * Mail autocomplete
 * Author: nuintun
 * $(selector).mailtip({
 *   mails: [], // mails
 *   onselected： function(mail){}, // callback on selected
 *   width: 'auto', // popup tip's width
 *   offsetTop: -1, // offset top relative default position
 *   offsetLeft: 0, // offset left relative default position
 *   zIndex: 10 // popup tip's z-index
 * });
 */

'use strict';

(function ($) {
    // invalid email char test regexp
    var INVALIDEMAILRE = /[^\u9fa5_a-zA-Z0-9]/;
    // is support oninput event
    var hasInputEvent = 'oninput' in document.createElement('input');
    // is ie 9
    var ISIE9 = /MSIE 9.0/i.test(window.navigator.appVersion || window.navigator.userAgent);

    /**
     * is a number
     * @param value
     * @returns {boolean}
     */
    function isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    /**
     * create popup tip
     * @param input
     * @param config
     * @returns {*}
     */
    function createTip(input, config) {
        var tip = null;

        // only create tip and binding event once
        if (!input.data('data-mailtip')) {
            var wrap = input.parent();

            // set parent node position
            !/absolute|relative/i.test(wrap.css('position')) && wrap.css('position', 'relative');
            // off input autocomplete
            input.attr('autocomplete', 'off');

            var offset = input.offset();
            var wrapOffset = wrap.offset();

            tip = $('<ul class="mailtip" style="display: none; float: none; '
                + 'position:absolute; margin: 0; padding: 0; z-index: '
                + config.zIndex + '"></ul>');

            // insert tip after input
            input.after(tip);

            // set tip style
            tip.css({
                top: offset.top - wrapOffset.top + input.outerHeight() + config.offsetTop,
                left: offset.left - wrapOffset.left + config.offsetLeft,
                width: config.width === 'input' ? input.outerWidth() - tip.outerWidth() + tip.width() : config.width
            });

            // when width is auto, set min width equal input width
            if (config.width === 'auto') {
                tip.css('min-width', input.outerWidth() - tip.outerWidth() + tip.width());
            }

            // binding event
            tip.on('mouseenter mouseleave click', 'li', function (e) {
                var selected = $(this);

                switch (e.type) {
                    case 'mouseenter':
                        selected.addClass('hover');
                        break;
                    case 'click':
                        var mail = selected.attr('title');

                        input.val(mail).focus();
                        config.onselected.call(input[0], mail);
                        break;
                    case 'mouseleave':
                        selected.removeClass('hover');
                        break;
                    default:
                        break;
                }
            });

            // when on click if the target element not input, hide tip
            $(document).on('click', function (e) {
                if (e.target === input[0]) return;

                tip.hide();
            });

            input.data('data-mailtip', tip);
        }

        return tip || input.data('data-mailtip');
    }

    /**
     * create mail list item
     * @param value
     * @param mails
     * @returns {*}
     */
    function createItems(value, mails) {
        var mail;
        var domain;
        var items = '';
        var atIndex = value.indexOf('@');
        var hasAt = atIndex !== -1;

        if (hasAt) {
            domain = value.substring(atIndex + 1);
            value = value.substring(0, atIndex);
        }

        for (var i = 0, len = mails.length; i < len; i++) {
            mail = mails[i];

            if (hasAt && mail.indexOf(domain) !== 0) continue;

            items += '<li title="' + value + '@' + mail
                + '" style="margin: 0; padding: 0; float: none;"><p>'
                + value + '@' + mail + '</p></li>';
        }

        // active first item
        return items.replace('<li', '<li class="active"');
    }

    /**
     * change list active state
     * @param tip
     * @param up
     */
    function changeActive(tip, up) {
        var itemActive = tip.find('li.active');

        if (up) {
            var itemPrev = itemActive.prev();

            itemPrev = itemPrev.length ? itemPrev : tip.find('li:last');
            itemActive.removeClass('active');
            itemPrev.addClass('active');
        } else {
            var itemNext = itemActive.next();

            itemNext = itemNext.length ? itemNext : tip.find('li:first');
            itemActive.removeClass('active');
            itemNext.addClass('active');
        }
    }

    /**
     * toggle tip
     * @param tip
     * @param value
     * @param mails
     */
    function toggleTip(tip, value, mails) {
        var atIndex = value.indexOf('@');
        var newValue = value + '@'

        // if user enter @then only show the email ids hints

        if (value.indexOf('@') != -1) {

            // if input text is empty or has invalid char or begin with @ or more than two @, hide tip
            if (!value
                || atIndex === 0
                || atIndex !== value.lastIndexOf('@')
            ) {
                tip.hide();
            } else {
                var items = createItems(value, mails);

                // if has match mails show tip
                if (items) {
                    tip.html(items).show();
                } else {
                    tip.hide();
                }
            }
        } else {
            tip.hide();
        }
    }

    /**
     * exports
     * @param config
     * @returns {*}
     */
    $.fn.mailtip = function (config) {
        var defaults = {
            mails: [
                'gmail.com', 'rediffmail.com',
                'hotmail.com', 'yahoo.com', 'yahoo.co.in'
            ],
            onselected: $.noop,
            width: 'auto',
            offsetTop: -1,
            offsetLeft: 0,
            zIndex: 10
        };

        config = $.extend({}, defaults, config);
        config.zIndex = isNumber(config.zIndex) ? config.zIndex : defaults.zIndex;
        config.offsetTop = isNumber(config.offsetTop) ? config.offsetTop : defaults.offsetTop;
        config.offsetLeft = isNumber(config.offsetLeft) ? config.offsetLeft : defaults.offsetLeft;
        config.onselected = $.isFunction(config.onselected) ? config.onselected : defaults.onselected;
        config.width = config.width === 'input' || isNumber(config.width) ? config.width : defaults.width;

        return this.each(function () {
            // input
            var input = $(this);
            // tip
            var tip = createTip(input, config);

            // binding key down event
            input.on('keydown', function (e) {
                // if tip is visible do nothing
                if (tip.css('display') === 'none') return;

                switch (e.keyCode) {
                    // backspace
                    case 8:
                        // shit! ie9 input event has a bug, backspace do not trigger input event
                        if (ISIE9) {
                            input.trigger('input');
                        }
                        break;
                    // tab
                    case 9:
                        tip.hide();
                        break;
                    // up
                    case 38:
                        e.preventDefault();
                        changeActive(tip, true);
                        break;
                    // down
                    case 40:
                        e.preventDefault();
                        changeActive(tip);
                        break;
                    // enter
                    case 13:
                        e.preventDefault();

                        var mail = tip.find('li.active').attr('title');

                        input.val(mail).focus();
                        tip.hide();
                        config.onselected.call(this, mail);
                        break;
                    default:
                        break;
                }
            });

            // binding input or propertychange event
            if (hasInputEvent) {
                input.on('input', function () {
                    toggleTip(tip, this.value, config.mails);
                });
            } else {
                input.on('propertychange', function (e) {
                    if (e.originalEvent.propertyName === 'value') {
                        toggleTip(tip, this.value, config.mails);
                    }
                });
            }

            // shit! ie9 input event has a bug, backspace do not trigger input event
            if (ISIE9) {
                input.on('keyup', function (e) {
                    if (e.keyCode === 8) {
                        toggleTip(tip, this.value, config.mails);
                    }
                });
            }
        });
    };
}(jQuery));


