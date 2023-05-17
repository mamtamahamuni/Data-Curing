/*
    Name: Add Member Directive
    Author: Pankaj Patil
    Date: 19-06-2018
*/
var app = angular.module('addMemberDirective', []);

app.directive('addmember', ['$timeout', '$rootScope', 'appService', 'ABHI_CONFIG', 'productValidationService', '$location', '$q', function($timeout, $rootScope, appService, ABHI_CONFIG, productValidationService, $location, $q) {
            return {
                scope: {
                    aM: "=addctrl"
                },
               
                restrict: 'E',
                templateUrl: "partials/add-member.html",
                link: function(scope, element, attrs, $anchorScroll) {
                    
                    var membersCopy;
                    var childCount = 0;
                    scope.aM.membersSelected = "";
                    var productCode;

                    /* Add Member Modal Event */

                    $('#add-new-member-web').on('show.bs.modal', function(e) {
                        scope.aM.allErrors = scope.aM.allErrors;
                    })

                    /* End of add member modal event */


                    /* Manage selected member of cross sell products*/

                    // Activ Fit Member
                    var policyType;
                    if(scope.aM.fitQuoteDetails){
                        policyType = scope.aM.fitQuoteDetails.PolicyType
                    }
                    // Activ Fit Member

                    function mapProductInsuredMembers(arrayParam, paramTrue, quoteObj) {
                        scope.aM[quoteObj] = [];
                        for (var i = 0; i < scope.aM.membersDetails.length; i++) {
                            for (var j = 0; j < scope.aM[arrayParam].length; j++) {
                                if (scope.aM.membersDetails[i].RelationType == scope.aM[arrayParam][j].RelationType) {
                                    scope.aM.membersDetails[i][paramTrue] = 'Y';
                                    break;
                                }
                            }
                            if (scope.aM.membersDetails[i].RelationType == "PROPOSER" || scope.aM.membersDetails[i].RelationType == 'S' || scope.aM.membersDetails[i].RelationType == 'SPO') {
                                scope.aM[quoteObj][i] = {
                                    "suminsured": (paramTrue == 'isPA') ? "1500000" : "2500000",
                                    "AnnualIncome": ""
                                };
                            } else if (scope.aM.membersDetails[i].RelationType == 'F' || scope.aM.membersDetails[i].RelationType == 'M' || scope.aM.membersDetails[i].RelationType == 'FIL' || scope.aM.membersDetails[i].RelationType == 'MIL') {
                                scope.aM[quoteObj][i] = {
                                    "suminsured": (paramTrue == 'isPA') ? "1500000" : "1000000",
                                    "AnnualIncome": ""
                                };
                            } else {
                                scope.aM[quoteObj][i] = {
                                    "suminsured": (paramTrue == 'isPA') ? "1500000" : "1000000",
                                    "AnnualIncome": ""
                                };
                            }
                        }
                    }

                    /* End of manging selected member of cross sell products */


                    /* To fetch insured members */

                    scope.aM.fetchInsuredMembers = function() {
                        var defer = $q.defer();
                        childCount = 0;
                        var reqData = $rootScope.encrypt({
                            "ReferenceNumber": sessionStorage.getItem('rid')
                        });
                
                        appService.postData(ABHI_CONFIG.apiUrl + "GEN/GetInsuredMembers", {
                                "_data": reqData
                            }, true, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(function(data) {
                                    scope.aM.membersSelected = "";
                                    childCount = 0;
                                    scope.aM.crossSell = false;
                                    var data = JSON.parse($rootScope.decrypt(data._resp))
                                    if (data.ResponseCode == 1) {
                                        var userSelected = [];
                                        defer.resolve(data);
                                        angular.forEach(data.ResponseData.ProductInsuredDetail, function(val, ind) {
                                            if (val.IsPrimaryProduct || val.ProductCode == "NA") {
                                                productCode = val.ProductCode;
                                                scope.aM.membersDetails = val.InsuredMembers;
                                                membersCopy = angular.copy(val.InsuredMembers);
                                            } else {
                                                scope.aM.crossSell = true;
                                                scope.aM[val.ProductCode] = 'Y';
                                                scope.aM[val.ProductCode + "Members"] = val.InsuredMembers;
                                            }
                                        });
                                        if (scope.aM.planName != 'reco') {
                                                /*if (scope.aM.productType == "diamond") {
                                                    if (scope.aM.diamondQuoteDetails.DiamondQuote.SI == 500000 && scope.aM.membersDetails.length == 2) {
                                                        scope.aM.calculateDIPremium(700000)
                                                    }
                                                }*/
                                                if (scope.aM.productType == "platinum") {
                                                    if (scope.aM.platinumQuoteDetails.PlatinumQuote.SI == 500000 && scope.aM.membersDetails.length == 2) {
                                                        scope.aM.calculatePlatPremium(600000)
                                                    }
                                                }
                                                if (scope.aM.crossSell) {
                                                    if (scope.aM.PA == 'Y') {
                                                        mapProductInsuredMembers('PAMembers', 'isPA', 'PAQuoteDetails')
                                                    }
                                                    if (scope.aM.CI == 'Y') {
                                                        mapProductInsuredMembers('CIMembers', 'isCI', 'CIQuoteDetails')
                                                    }
                                                    if (scope.aM.CS == 'Y') {
                                                        mapProductInsuredMembers('CSMembers', 'isCS', 'CSQuoteDetails')
                                                    }
                                                }

                                            }

                                            /* Modal Member list configuration */

                                            scope.aM.membersList = {
                                                "membersSelected": "",
                                                "kidsCount": "",
                                                "members": [{
                                                        "memberType": "SELF",
                                                        "isSelected": false,
                                                        "display": true
                                                    },
                                                    {
                                                        "memberType": "SPOUSE",
                                                        "isSelected": false,
                                                        "display": true
                                                    },
                                                    {
                                                        "memberType": "FATHER",
                                                        "isSelected": false,
                                                        "display":  (!scope.aM.stProduct && !policyType) ||  (policyType != 'FF' && scope.aM.planName == "FIT") ? true : false
                                                    },
                                                    {
                                                        "memberType": "MOTHER",
                                                        "isSelected": false,
                                                        "display":  (!scope.aM.stProduct && !policyType) ||  (policyType != 'FF' && scope.aM.planName == "FIT")? true : false
                                                    },
                                                    {
                                                        "memberType": "FATHER-IN-LAW",
                                                        "isSelected": false,
                                                        "display": policyType != 'FF' && scope.aM.planName == "FIT"?true:false //(scope.aM.productType == "diamond"  ) ? false : true
                                                    },
                                                    {
                                                        "memberType": "MOTHER-IN-LAW",
                                                        "isSelected": false,
                                                        "display": policyType != 'FF' && scope.aM.planName == "FIT"?true:false //(scope.aM.productType == "diamond") ? false : true
                                                    },
                                                    {
                                                        "memberType": "KID",
                                                        "isSelected": false,
                                                        "display": true
                                                    },
                                                    {
                                                        "memberType": "BROTHER",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum" || (scope.aM.productType == "diamond" && !scope.aM.stProduct )) || policyType == 'MI' ? true : false
                                                    },
                                                    {
                                                        "memberType": "SISTER",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum" || (scope.aM.productType == "diamond" && !scope.aM.stProduct )) || policyType == 'MI'? true : false
                                                    },
                                                    {
                                                        "memberType": "GRANDFATHER",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") ? true : false
                                                    },
                                                    {
                                                        "memberType": "GRANDMOTHER",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") ? true : false
                                                    },
                                                    {
                                                        "memberType": "GRANDSON",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI' ? true : false
                                                    },
                                                    {
                                                        "memberType": "GRANDDAUGHTER",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI'? true : false
                                                    },
                                                    {
                                                        "memberType": "SON",
                                                        "isSelected": false,
                                                        "display": policyType != 'FF' && scope.aM.planName == "activ fit"? true : false
                                                    },
                                                    {
                                                        "memberType": "DAUGHTER",
                                                        "isSelected": false,
                                                        "display": policyType != 'FF' && scope.aM.planName == "activ fit"? true : false
                                                    },
                                                    {
                                                        "memberType": "SON-IN-LAW",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI'? true : false
                                                    },
                                                    {
                                                        "memberType": "DAUGHTER-IN-LAW",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI' ? true : false
                                                    },
                                                    {
                                                        "memberType": "BROTHER-IN-LAW",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI'? true : false
                                                    },
                                                    {
                                                        "memberType": "SISTER-IN-LAW",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI' ? true : false
                                                    },
                                                    {
                                                        "memberType": "NEPHEW",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI'? true : false
                                                    },
                                                    {
                                                        "memberType": "NIECE",
                                                        "isSelected": false,
                                                        "display": (scope.aM.planName == "platinum") || policyType == 'MI'? true : false
                                                    }
                                                ]
                                            }

                                            /* End of modal member list configuration */

                                            angular.forEach(scope.aM.membersDetails, function(v, i) {
                                                if (v.RelationWithProposer == "SELF") {
                                                    scope.aM.membersList.members[0].isSelected = true;
                                                    scope.aM.membersList.members[0].newestAdded = false;
                                                    userSelected.push("Self");
                                                } else if (v.RelationWithProposer == "SPOUSE") {
                                                    scope.aM.membersList.members[1].isSelected = true;
                                                    scope.aM.membersList.members[1].newestAdded = false;
                                                    userSelected.push("Spouse");
                                                } else if (v.RelationWithProposer == "FATHER") {
                                                    scope.aM.membersList.members[2].isSelected = true;
                                                    scope.aM.membersList.members[2].newestAdded = false;
                                                    userSelected.push("Father");
                                                } else if (v.RelationWithProposer == "MOTHER") {
                                                    scope.aM.membersList.members[3].isSelected = true;
                                                    scope.aM.membersList.members[3].newestAdded = false;
                                                    userSelected.push("Mother");
                                                } else if (v.RelationWithProposer == "FATHER-IN-LAW") {
                                                    scope.aM.membersList.members[4].isSelected = true;
                                                    scope.aM.membersList.members[4].newestAdded = false;
                                                    userSelected.push("Father-In-Law");
                                                } else if (v.RelationWithProposer == "MOTHER-IN-LAW") {
                                                    scope.aM.membersList.members[5].isSelected = true;
                                                    scope.aM.membersList.members[5].newestAdded = false;
                                                    userSelected.push("Mother-In-Law");
                                                } else if (v.RelationWithProposer == "KID") {
                                                    childCount = childCount + 1;
                                                }
                                            });

                                            if (childCount == 3 && productCode == "PL") {
                                                scope.aM.membersList.members[6].isSelected = true;
                                            } else if (childCount == 4 && scope.aM.stProduct) {
                                                scope.aM.membersList.members[6].isSelected = true;
                                            } else if (childCount == 4) {
                                                scope.aM.membersList.members[6].isSelected = true;
                                            }

                                            if (childCount == 0) {
                                                if (userSelected.length > 1) {
                                                    var lastMember = userSelected[userSelected.length - 1];
                                                    userSelected.splice(userSelected.length - 1, 1);
                                                    scope.aM.membersSelected = userSelected.toString() + " & " + lastMember;
                                                } else {
                                                    scope.aM.membersSelected = userSelected[0];
                                                }
                                            } else {
                                                scope.aM.membersSelected = userSelected.toString() + " & " + childCount + " Kids";
                                            }
                                        } else {
                                            defer.reject(data);
                                            $rootScope.alertData = {
                                                "modalClass": "regular-alert",
                                                "modalHeader": "Error",
                                                "modalBodyText": data.ResponseMessage,
                                                "showCancelBtn": false,
                                                "modalSuccessText": "OK",
                                                "modalCancelText": "No",
                                                "showAlertModal": true
                                            }
                                        }
                                    },
                                    function(err) {
                                        defer.reject(err);
                                    });
                                return defer.promise;
                            }

                        scope.aM.fetchInsuredMembers();

                        /* End of fetching insured members */


                        /* To select members */

                        scope.aM.selectMember = function(data) {
                            var gender = "0";
                            var relationType;
                            var prevEmpty = false;
                            var memberName;
                            for (var m = 0; m < scope.aM.membersDetails.length; m++) {
                                if (scope.aM.membersDetails[m].Age == "") {
                                    prevEmpty = true;
                                    memberName = scope.aM.membersDetails[m].RelationWithProposer;
                                    break;
                                }
                            }
                            if (prevEmpty) {
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Alert",
                                    "modalBodyText": "Please enter age of " + memberName + " to add in product construct.",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "Ok",
                                    "showAlertModal": true,
                                }
                                return false;
                            }
                            switch (data.memberType) {
                                case "SELF":
                                    scope.aM.membersList.members[0].isSelected = true;
                                    relationType = "S";
                                    gender = 1;
                                    break;
                                case "SPOUSE":
                                    scope.aM.membersList.members[1].isSelected = true;
                                    relationType = "SPO";
                                    gender = 0;
                                    break;
                                case "FATHER":
                                    scope.aM.membersList.members[2].isSelected = true;
                                    relationType = "F";
                                    gender = 1;
                                    break;
                                case "MOTHER":
                                    scope.aM.membersList.members[3].isSelected = true;
                                    relationType = "M";
                                    gender = 0;
                                    break;
                                case "FATHER-IN-LAW":
                                    scope.aM.membersList.members[4].isSelected = true;
                                    relationType = "FIL";
                                    gender = 1;
                                    break;
                                case "MOTHER-IN-LAW":
                                    scope.aM.membersList.members[5].isSelected = true;
                                    relationType = "MIL";
                                    gender = 0;
                                    break;
                                case "BROTHER":
                                    scope.aM.membersList.members[6].isSelected = true;
                                    relationType = "BRO";
                                    gender = 1;
                                    break;
                                case "SISTER":
                                    scope.aM.membersList.members[7].isSelected = true;
                                    relationType = "SIS";
                                    gender = 0;
                                    break;
                                case "GRANDFATHER":
                                    scope.aM.membersList.members[8].isSelected = true;
                                    relationType = "GF";
                                    gender = 1;
                                    break; 
                                case "GRANDSON":
                                    scope.aM.membersList.members[9].isSelected = true;
                                    relationType = "GSON";
                                    gender = 1;
                                    break;
                                case "GRANDMOTHER":
                                    scope.aM.membersList.members[10].isSelected = true;
                                    relationType = "GM";
                                    gender = 0;
                                    break;
                                case "GRANDDAUGHTER":
                                    scope.aM.membersList.members[11].isSelected = true;
                                    relationType = "GDAU";
                                    gender = 0;
                                    break;  
                                 case "SON-IN-LAW":
                                    scope.aM.membersList.members[12].isSelected = true;
                                    relationType = "SONL";
                                    gender = 1;
                                    break;  
                                case "DAUGHTER-IN-LAW":
                                    scope.aM.membersList.members[13].isSelected = true;
                                    relationType = "DIL";
                                    gender = 0;
                                    break;
                                case "SON":
                                    scope.aM.membersList.members[12].isSelected = true;
                                    relationType = "SO";
                                    gender = 1;
                                    break;  
                                case "DAUGHTER":
                                    scope.aM.membersList.members[13].isSelected = true;
                                    relationType = "DU";
                                    gender = 0;
                                    break;
                                 case "BROTHER-IN-LAW":
                                    scope.aM.membersList.members[13].isSelected = true;
                                    relationType = "BIL";
                                    gender = 1;
                                    break;  
                                 case "SISTER-IN-LAW":
                                    scope.aM.membersList.members[14].isSelected = true;
                                    relationType = "SISL";
                                    gender = 0;
                                    break;  
                                 case "NEPHEW":
                                    scope.aM.membersList.members[15].isSelected = true;
                                    relationType = "NEP";
                                    gender = 1;
                                    break;
                                case "NIECE":
                                    scope.aM.membersList.members[16].isSelected = true;
                                    relationType = "NIE";
                                    gender = 0;
                                    break;          


                                case "KID":
                                    gender = 1;
                                    childCount = childCount + 1;
                                    relationType = "KID" + childCount;
                                    if (childCount == attrs.childcount) {
                                        scope.aM.membersList.members[17].isSelected = true;
                                    }
                                    break;
                            }
                            scope.aM.membersDetails.push({
                                "Age": "",
                                "Gender": gender,
                                "ProductCode": productCode,
                                "RelationType": relationType,
                                "RelationWithProposer": data.memberType,
                                "newestAdded": true
                            })
                            $timeout(function() {
                                $(".member-table").animate({
                                    scrollTop: $('.member-table')[0].scrollHeight
                                }, 300);
                            }, 300);
                        }

                        /* End of selecting member */


                        /* To Add/Update/Delete Member */

                        scope.aM.addUpdateDeleteMember = function(op, insuredDetail, index) {
                            delete insuredDetail.newestAdded;
                            if (scope.aM.planName == 'reco') {
                                insuredDetail.ProductCode = 'NA';
                            }
                           
                            appService.postData(ABHI_CONFIG.apiUrl + "GEN/" + op, {
                                    "ReferenceNumber": sessionStorage.getItem('rid'),
                                    "InsuredDetail": insuredDetail
                                }, true, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then(function(data) {
                                    if (data.ResponseCode == 1) {
                                        scope.aM.fetchInsuredMembers();
                                        if (scope.aM.planName == "diamond") {
                                            /*if(scope.aM.stProduct &&  (op == 'AddMember' || op == 'UpdateMember' || op == 'DeleteMember')){
                                                scope.aM.addUpdateDeleteStMember(op, insuredDetail, index)
                                            }else{
                                                scope.aM.calculatePremium();
                                            }
                                            scope.aM.checkCrossSellValidations(insuredDetail);*/
                                            if(index != null ){
                                             scope.aM.updateSoftDetails(op, insuredDetail, index);
                                            }
                                            else{
                                                scope.aM.calculatePremium();
                                            }
                                        } else if (scope.aM.planName == "platinum" || scope.aM.planName == "activ fit") {
                                            scope.aM.updateSoftDetails(op, insuredDetail, index);
                                            /*scope.aM.calculatePremium();
                                            scope.aM.checkCrossSellValidations(insuredDetail);*/
                                        }else if (scope.aM.planName == "corona-kavach") {
                                            scope.aM.updateSoftDetails(op, insuredDetail, index);
                                            //scope.aM.calculatePremium();
                                            //scope.aM.checkCrossSellValidations(insuredDetail);
                                        } else if (scope.aM.planName == "arogya-sanjeevani") {
                                            scope.aM.updateSoftDetails(op, insuredDetail, index);
                                        } else if (scope.aM.planName == "RFB") {
                                            if (index != null && $location.$$path != '/pa-customize-quote') {
                                                scope.aM.updateSoftDetails(op, insuredDetail, index);
                                            } else {
                                                scope.aM.calculatePremium();
                                            }
                                            scope.aM.checkCrossSellValidations(insuredDetail);
                                        } else if (scope.aM.planName == "reco") {
                                            scope.aM.fetchRecoProducts(false);
                                        }
                                        var successText;
                                        if (op == "AddMember") {
                                            $rootScope.alertConfiguration('S', insuredDetail.RelationWithProposer + " added successfully.");
                                        } else if (op == "UpdateMember") {
                                            $rootScope.alertConfiguration('S', insuredDetail.RelationWithProposer + " updated successfully.");
                                        } else if (op == "DeleteMember") {
                                            $rootScope.alertConfiguration('S', insuredDetail.RelationWithProposer + " deleted successfully.");


                                        }
                                    }
                                }, function(err) {

                                });
                        }

                        /* End of add/update/delete member */


                        /* To delete particular member */

                        scope.aM.deleteMemberDir = function(memberDetails, index) {
                            if (scope.aM.membersDetails.length == 2) {
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Alert",
                                    "modalBodyText": "You cannot delete this member!",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "Ok",
                                    "showAlertModal": true,
                                }
                            }else if(memberDetails.ProductCode == "DI" && memberDetails.RelationWithProposer == "SELF"){
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Alert",
                                    "modalBodyText": "'Self' is a mandatory. If you delete this member then your selected family construct will become invalid.",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "Ok",
                                    "showAlertModal": true,
                                }
                            }else if(scope.aM.planName == "activ fit" && scope.aM.fitPlanName == 'prefered' && scope.aM.selectedMember.length <= 2){
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Alert",
                                    "modalBodyText": scope.aM.PreferError,
                                    "showCancelBtn": false,
                                    "modalSuccessText": "Ok",
                                    "showAlertModal": true,
                                }
                            }
                             else {
                                if (scope.aM.planName == "reco") {
                                    scope.aM.addUpdateDeleteMember('DeleteMember', memberDetails, index);
                                } else {
                                    scope.aM.deleteMember(memberDetails, index);
                                }
                            }
                        }

                        scope.aM.deleteMember = function(memberDetails, index) {
                            if (!memberDetails.newestAdded) {
                                var tempMemberDetails = angular.copy(scope.aM.membersDetails);
                                for (var i = 0; i < scope.aM.membersDetails.length; i++) {
                                    if (scope.aM.membersDetails[i].RelationType == memberDetails.RelationType) {
                                        tempMemberDetails.splice(i, 1);
                                        break;
                                    }
                                }
                                var errorStatus={};
                                
                                switch (memberDetails.ProductCode) {
                                    case "PL":
                                        errorStatus = productValidationService.platinumValidations(tempMemberDetails, memberDetails.RelationType);
                                        break;
                                    case "DI":
                                       if(angular.isUndefined(scope.aM.diamondQuoteDetails)){
                                            errorStatus = productValidationService.diamondValidations(tempMemberDetails, memberDetails.RelationType , '');
                                         }
                                            else{
                                                errorStatus = productValidationService.diamondValidations(tempMemberDetails, memberDetails.RelationType , scope.aM.diamondQuoteDetails.PolicyType);
                                            }
                                    case "PA":
                                        errorStatus = productValidationService.rFBValidations(tempMemberDetails, 5, "PA", memberDetails.RelationType);
                                        break;
                                    case "NA":
                                            errorStatus = productValidationService.rFBValidations(tempMemberDetails, 5, "NA", memberDetails.RelationType);
                                        break;
                                    case "CS":
                                        errorStatus = productValidationService.rFBValidations(tempMemberDetails, 18, "CS", memberDetails.RelationType);
                                        break;
                                    case "CI":
                                        (scope.aM.currentPlan == "ci3") ? errorStatus = productValidationService.rFBValidations(tempMemberDetails, 5, "CI", memberDetails.RelationType): errorStatus = productValidationService.rFBValidations(tempMemberDetails, 5, "CI", memberDetails.RelationType);
                                        break;
                                    case "CK":
                                        if(angular.isUndefined(scope.aM.coronaKavachQuoteDetails)){
                                            errorStatus = productValidationService.cKValidations(scope.aM.membersDetails, 18, "CS", memberDetails.RelationType , "");
                                        }
                                        else{
                                            errorStatus = productValidationService.cKValidations(scope.aM.membersDetails, 18, "CS", memberDetails.RelationType , scope.aM.coronaKavachQuoteDetails.PolicyType);
                                        }
                                        break;
                                    case "AS":
                                        errorStatus = productValidationService.arogyaSanjeevaniValidations(tempMemberDetails, 25, "AS", memberDetails.RelationType);
                                        break;    
                                }
                                if (errorStatus.invalidConstruct) {
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "Alert",
                                        "modalBodyText": "If you delete this member then your selected family construct will become invalid. Do you still want to delete this member ?",
                                        "showCancelBtn": true,
                                        "modalSuccessText": "Yes",
                                        "modalCancelText": "No",
                                        "showAlertModal": true,
                                        "positiveFunction": function() {
                                            scope.aM.addUpdateDeleteMember('DeleteMember', memberDetails, index);
                                            $location.url('pre-quote');
                                            $('#add-new-member-web').modal('hide');
                                        }
                                    }
                                } else {
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "Alert",
                                        "modalBodyText": "Are you sure you want to remove this member?",
                                        "showCancelBtn": true,
                                        "modalSuccessText": "Yes",
                                        "modalCancelText": "No",
                                        "showAlertModal": true,
                                        "positiveFunction": function() {
                                            if (scope.aM.crossSell) {
                                                if (scope.aM.PA && (scope.aM.PAMembers.length < 2 || memberDetails.RelationWithProposer == 'SELF')) {
                                                    deleteSecondaryProductAM('PA');
                                                    scope.aM['PA'] = 'N';
                                                }
                                                if (scope.aM.CI && scope.aM.CIMembers.length < 2) {
                                                    deleteSecondaryProductAM('CI');
                                                    scope.aM['CI'] = 'N';
                                                }
                                                if (scope.aM.CS && scope.aM.CSMembers.length < 2) {
                                                    deleteSecondaryProductAM('CS');
                                                    scope.aM['CS'] = 'N';
                                                }
                                            }
                                            delete memberDetails.isCI;
                                            delete memberDetails.isCS;
                                            delete memberDetails.isPA;
                                            scope.aM.addUpdateDeleteMember('DeleteMember', memberDetails, index);
                                        }
                                    }
                                }
                            } else {
                                angular.forEach(scope.aM.membersList.members, function(v, i) {
                                    if (v.memberType == memberDetails.RelationWithProposer) {
                                        v.isSelected = false;
                                    }
                                });
                                if (memberDetails.RelationWithProposer == 'KID') {
                                    childCount = childCount - 1;
                                }
                                scope.aM.membersDetails.splice(index, 1);
                            }
                        }

                        /* End of deleting particular member */


                        /* To update/add member */

                        scope.aM.addUpdateMember = function(details, index, prevAge) {
                            if (scope.aM.planName == 'reco') {
                                details.ProductCode = scope.aM.recoBuyProduct;
                            }
                            if (isNaN(details.Age)) {
                                details.Age = 0;
                            }
                            var errorStatus = new Object();
                            errorStatus.selectedMemberError = 'N';
                            switch (details.ProductCode) {
                                case "PL":
                                    if(angular.isUndefined(scope.aM.platinumQuoteDetails)){
                                        errorStatus = productValidationService.platinumValidations(scope.aM.membersDetails, details.RelationType , "");
                                    }
                                    else{
                                        errorStatus = productValidationService.platinumValidations(scope.aM.membersDetails, details.RelationType , scope.aM.platinumQuoteDetails.PolicyType);
                                    }
                                    break;
                                case "FIT":
                                    if(angular.isUndefined(scope.aM.fitQuoteDetails)){
                                        errorStatus = productValidationService.activFitValidations(scope.aM.membersDetails, details.RelationType , "");
                                    }
                                    else{
                                        errorStatus = productValidationService.activFitValidations(scope.aM.membersDetails, details.RelationType , scope.aM.fitQuoteDetails.PolicyType);
                                    }
                                    break;
                                case "DI":
                                    if(angular.isUndefined(scope.aM.diamondQuoteDetails)){
                                        errorStatus = productValidationService.diamondValidations(scope.aM.membersDetails, details.RelationType , "");
                                    }
                                    else{
                                        if(scope.aM.stProduct){
                                            errorStatus = productValidationService.diamondSTValidations(scope.aM.membersDetails, details.RelationType);
                                         }
                                        else{
                                            errorStatus = productValidationService.diamondValidations(scope.aM.membersDetails, details.RelationType , scope.aM.diamondQuoteDetails.PolicyType);
                                        }                                        
                                    }
                                    break;
                                case "PA":
                                    errorStatus = productValidationService.rFBValidations(scope.aM.membersDetails, 5, "PA", details.RelationType);
                                    break;
                                case "CS":
                                    errorStatus = productValidationService.rFBValidations(scope.aM.membersDetails, 18, "CS", details.RelationType);
                                    break;
                                case "CI":
                                    (scope.aM.currentPlan == "ci3") ? errorStatus = productValidationService.rFBValidations(scope.aM.membersDetails, 18, "CI", details.RelationType): errorStatus = productValidationService.rFBValidations(scope.aM.membersDetails, 5, "CI", details.RelationType);
                                    break;
                                 case "CK":
                                    if(angular.isUndefined(scope.aM.coronaKavachQuoteDetails)){
                                        errorStatus = productValidationService.cKValidations(scope.aM.membersDetails, 18, "CS", details.RelationType , "");
                                    }
                                    else{
                                        errorStatus = productValidationService.cKValidations(scope.aM.membersDetails, 18, "CS", details.RelationType , scope.aM.coronaKavachQuoteDetails.PolicyType);
                                    }
                                    break;
                                case "AS":
                                    if(angular.isUndefined(scope.aM.arogyaSanjeevaniQuoteDetails)){
                                        errorStatus = productValidationService.arogyaSanjeevaniValidations(scope.aM.membersDetails, 25, "AS", details.RelationType, "");
                                    }
                                    else{
                                        errorStatus = productValidationService.arogyaSanjeevaniValidations(scope.aM.membersDetails, 25, "AS", details.RelationType, scope.aM.arogyaSanjeevaniQuoteDetails.PolicyType);
                                    }
                                    break;    
                            }
                            if (errorStatus.selectedMemberError == 'N') {
                                details.newestAdded ? scope.aM.addUpdateDeleteMember('AddMember', angular.copy(details), index) : scope.aM.addUpdateDeleteMember('UpdateMember', angular.copy(details), index);
                            } else {
                                var errorAlert = "<ul>";
                                angular.forEach(errorStatus.allErrors, function(v, i) {
                                    if (v.RelationType == details.RelationType) {
                                        errorAlert = errorAlert + "<li>" + v.message + "</li>";
                                    }
                                });
                                errorAlert = errorAlert + "</ul>";
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Error",
                                    "modalBodyText": errorAlert,
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "showAlertModal": true,
                                    "positiveFunction": function() {
                                        var isPresent = false;
                                        for (var i = 0; i < membersCopy.length; i++) {
                                            if (details.RelationType == membersCopy[i].RelationType) {
                                                details.Age = membersCopy[i].Age;
                                                isPresent = true;
                                                break;
                                            }
                                        }
                                        if (!isPresent) {
                                            details.Age = "";
                                        }
                                    }
                                }
                            }
                        };

                        /* End of update/add member */

                        /* update MEmeber call on Blur */
                        scope.aM.updateMemeberAge = function(details, index, prevAge) {
                            if (angular.isUndefined(details.newestAdded)) {
                                scope.aM.addUpdateMember(details, index, prevAge)
                            }
                            console.log()
                        }
                        /* update member call on the blur ends*/


                        /* Modal Hidden Event */

                        $('#add-new-member-web').on('hidden.bs.modal', function() {
                            childCount = 0;
                            delete scope.aM.allErrors;
                            scope.aM.allowAdd = attrs.allowadd;
                            scope.aM.fetchInsuredMembers();
                        })

                        /* End of modal hidden event */


                        /* To delete secondary product */

                        function deleteSecondaryProductAM(ProductCode) {
                            appService.postData(ABHI_CONFIG.apiUrl + "GEN/DeleteProduct", {
                                    "ReferenceNumber": sessionStorage.getItem('rid'),
                                    "ProductCode": ProductCode
                                }, true, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then(function(data) {

                                });
                        }

                        /* End of deleting secondary product */


                        /* Close Add Member modal */

                        function closeModalFunction() {
                            var showAlert = "<ul>";
                            angular.forEach(scope.aM.membersDetails, function(v, i) {
                                if (v.Age == "") {
                                    showAlert = showAlert + "<li>Please enter age of " + v.RelationWithProposer + ".</li>";
                                }
                            });
                            showAlert = showAlert + "</ul>";
                            if (showAlert != "<ul></ul>") {
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Alert",
                                    "modalBodyText": showAlert,
                                    "showCancelBtn": false,
                                    "modalSuccessText": "OK",
                                    "showAlertModal": true
                                }
                            } else {
                                $("#add-new-member-web").modal('hide');
                            }

                            if(scope.aM.changePolicyTypeOnClose){
                                scope.aM.changePolicyTypeOnClose();
                            }
                        }

                        scope.aM.closeAddMemberModal = function() {
                            $rootScope.callGtag('quote', 'click-button', $location.$$path.substring(1) + '_add-edit-members-close');
                            closeModalFunction();
                        }

                        scope.aM.modalClosebtn = function() {
                            $rootScope.callGtag('quote', 'click-icon', $location.$$path.substring(1) + '_add-edit-members-x');
                            closeModalFunction();
                        }

                        /* End of closeing */

                        /*add buy Product Service */

                            scope.aM.buySecondaryProductSt = function(productCode , memberedArray ,primaryProductCode, redirection) {
                                    //scope.cSQ[productCode+"loader"] = true;
                                        appService.postData(ABHI_CONFIG.apiUrl + "GEN/BuyProduct", {
                                            "ReferenceNumber": sessionStorage.getItem('rid'),
                                            "ProductCode": productCode,
                                            "MemberList": memberedArray
                                        }, true, {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                        .then(function(data) {
                                            if (data.ResponseCode == 1){
                                                $timeout(function(){
                                                    if(redirection != ""){
                                                            $location.url(redirection);
                                                    }
                                                    
                                                },200);
                                            //scope.cSQ[productCode+"loader"] = false;}
                                         }
                                        }),function(err){

                                        };

                            }


                        /*add buy Product Service */
                        
                    }
                };
            }]);

        /* End of Add Member Directive */