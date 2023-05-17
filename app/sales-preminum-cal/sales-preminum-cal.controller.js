var acApp = angular.module("salePreminumCalApp", []);

acApp.controller("salePreminumCalQuote", ['$scope', '$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$window', '$q', function ($scope, $rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $window, $q) {

    /* Data Inilization */
    var sampleObject = {
        name: 'angularjs',
        value: 1
    };



    var sPC = this;
    var aS = appService;
    sPC.CoverSNCB = 'N';
    sPC.CoverURSI = 'N';
    sPC.CoverARU = 'N';
    sPC.diamondSI = '1000000'
    sPC.platinumSI = '1000000'
    sPC.DIPolicyType = 'MI';
    sPC.PLPolicyType = "MI";
    sPC.updatePolicyType = false;
    sPC.updateAssurePolice = false;
    sPC.STPolicyType = 'MI';
    sPC.SuperTopUpSI = '1000000';
    // sPC.PaCoverFlag ='1';
    // sPC.CiCoverFlag ='1';
    // sPC.CiCoverFlag ='1';
    sPC.hideTimer = false;
	sPC.thankYou = true;

    sPC.hypertension = 0;
    sPC.diabetes = 0;
    sPC.asthma = 0;
    sPC.hyperlipidemia = 0;
    sPC.ChronicArray = ['hypertension', 'diabetes', 'asthma', 'hyperlipidemia'];

    /* To fetch sum insured data */

    aS.getData("assets/data/sum-insured.json", "", false, { // appservice. getData
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            if (data.ResponseCode == 1) {
                sPC.SumInsuredList = data.ResponseData;
            } else {

            }
        }, function (err) {

        })

    /* End of fetching sum insured */
        $(window).on('load', function() {
        $('#pif-solution').modal('show');
		sPC.thankYou = true;
		sPC.step1 = false;
    });
	sPC.showmodel = function(){
		sPC.thankYou = false;
		sPC.step1 = true;
    }
    /* To Fetch Family Members for active care */

    aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
        "Name": "getACRelation"
    }, true, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            sPC.initialMemberListArray = data.ResponseData;
            sPC.memberListArray = data.ResponseData;
            sPC.memberListArray.splice(2, 0, {
                "RelationType": "KID4", "RelationWithProposer": "KID", "Gender": "1",
                "activeAssureSelectedValue": "No",
                "activeHealthSelectedValue": "No",
                "activeAssurePlusSuperTopup": "No",
            })
            sPC.memberListArray.splice(2, 0, {
                "RelationType": "KID3", "RelationWithProposer": "KID", "Gender": "1",
                "activeAssureSelectedValue": "No",
                "activeHealthSelectedValue": "No",
                "activeAssurePlusSuperTopup": "No",
            })
            sPC.memberListArray.splice(2, 0, {
                "RelationType": "KID2", "RelationWithProposer": "KID", "Gender": "1",
                "activeAssureSelectedValue": "No",
                "activeHealthSelectedValue": "No",
                "activeAssurePlusSuperTopup": "No",
            })
            sPC.memberListArray.splice(2, 0, {
                "RelationType": "KID1", "RelationWithProposer": "KID", "Gender": "1",
                "activeAssureSelectedValue": "No",
                "activeHealthSelectedValue": "No",
                "activeAssurePlusSuperTopup": "No",

            })
            for (var i = 0; i < sPC.memberListArray.length; i++) {
                switch (sPC.memberListArray[i].RelationWithProposer.toUpperCase()) {
                    case 'SELF':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"
                        break;
                    case 'SPOUSE':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'FATHER':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'MOTHER':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'FATHER-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'MOTHER-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'BROTHER':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'SISTER-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'SISTER':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'BROTHER-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'GRANDFATHER':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'GRANDMOTHER':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'UNCLE':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'AUNT':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'SON':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'DAUGHTER-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'SON-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'DAUGHTER':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'NEPHEW':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'NIECE-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'NIECE':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'NEPHEW-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'GRANDSON':
                        sPC.memberListArray[i]['Gender'] = '1';
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'GRANDDAUGHTER-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"

                        break;
                    case 'GRANDDAUGHTER':
                        sPC.memberListArray[i]['Gender'] = '0'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"
                        break;
                    case 'GRANDSON-IN-LAW':
                        sPC.memberListArray[i]['Gender'] = '1'
                        sPC.memberListArray[i]['activeAssureSelectedValue'] = "No"
                        sPC.memberListArray[i]['activeHealthSelectedValue'] = "No"
                        break;
                    case 'KID':

                        break;
                    default:
                    // return;
                }
            }
            console.log(sPC.memberListArray)
        }, function (err) { })



    /* End of fetching family members active care */

    sPC.prepareData = {
        Diamond: null,
        Platinum: null,
        SuperTopup: null
    }
    sPC.MemberDetailsObj = function (param, $index) {
        if (sPC.prepareData.Platinum == null || sPC.prepareData.Platinum.MemberDetails.length == 0) {
            $rootScope.alertConfiguration('E', "Please select atleat one member", "");
            sPC[param] = 'N'
        }
        for (var i = 0; i < sPC.prepareData.Platinum.MemberDetails.length; i++) {
            if (i === $index) {
                sPC.prepareData.Platinum.MemberDetails[i].PaCoverFlag = param.PaCoverFlag
                sPC.prepareData.Platinum.MemberDetails[i].CiCoverFlag = param.CiCoverFlag
                sPC.prepareData.Platinum.MemberDetails[i].IcmiCoverFlag = param.IcmiCoverFlag
                sPC.getPremiumCal();
            }
        }

    }

    sPC.addDeleteMembers = function (action, columnName, index, memberDetail) {
        sPC.validateUserAge(memberDetail);
        if (action == 'update' && (sPC.memberListArray[index]['activeAssureSelectedValue'] == "No" && sPC.memberListArray[index]['activeHealthSelectedValue'] == "No")) {
            return false;
        }

        if (memberDetail.Age == undefined || memberDetail.Age == "") {
            // $rootScope.alertConfiguration('E', "Please enter " + memberDetail.RelationWithProposer + " Age", "");
            /* delete platinum member from row  */
            if(sPC.prepareData.Platinum != null){
            var ageIndex = sPC.prepareData.Platinum.MemberDetails.findIndex(e => e.Age === memberDetail.Age);
            if (ageIndex > -1) {
                sPC.prepareData.Platinum.MemberDetails.splice(ageIndex, 1);
               }       
        
            sPC.prepareData.Platinum.MemberDetails.forEach(function (e) {
                if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                    sPC.updatePolicyType = false;
                } else {
                    sPC.updatePolicyType = true;
                }
            })
        }
        if(sPC.prepareData.Diamond != null){
            var ageIndex = sPC.prepareData.Diamond.MemberDetails.findIndex(e => e.Age === memberDetail.Age);
            if (ageIndex > -1) {
                sPC.prepareData.Diamond.MemberDetails.splice(ageIndex, 1);
               }        
            sPC.prepareData.Diamond.MemberDetails.forEach(function (e) {
                if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                    sPC.updateAssurePolice = false;
                } else {
                    sPC.updateAssurePolice = true;
                }
            });
            if (columnName == 'activeAssure') {
                sPC.memberListArray[index]['activeHealthSelectedValue'] = "No";
            } else {
                sPC.memberListArray[index]['activeAssureSelectedValue'] = "No";
            }
            if(sPC.prepareData.Diamond.MemberDetails.length <= 1){
                sPC.DIPolicyType = "MI"
            }       
        }
            if (columnName == 'activeAssure') {
                sPC.memberListArray[index]['activeAssureSelectedValue'] = "No";
            } else {
                sPC.memberListArray[index]['activeHealthSelectedValue'] = "No";
            }
          

           
            sPC.getPremiumCal();
        } else {
            if (memberDetail.Age < 18 && memberDetail.RelationWithProposer != "KID") {
                $rootScope.alertConfiguration('E', "Please enter " + memberDetail.RelationWithProposer + " Age greater than 18", "select-member_alert");
                sPC.memberListArray[index]['Age'] = "";
                sPC.memberListArray[index]['activeAssureSelectedValue'] = "No";
                sPC.memberListArray[index]['activeHealthSelectedValue'] = "No";
            } else {
                if (sPC.ageOfMember === " " || sPC.ageOfMember === undefined) {

                } else {
                    sPC.validateAge = sPC.ageOfMember.some(e => e.Age <= 3);
                    if (sPC.validateAge) {
                        sPC.prepareData.Platinum.MemberDetails.forEach(function (e) {
                            if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                                sPC.PLPolicyType = "FF";
                                sPC.updatePolicyType = false;
                            } else {
                                $rootScope.alertData = {
                                    "modalClass": "regular-alert",
                                    "modalHeader": "Confirm",
                                    "modalBodyText": e.RelationWithProposer + " "+"is not allowed in family flooter",
                                    "showCancelBtn": false,
                                    "modalSuccessText": "Yes",
                                    "modalCancelText": "No",
                                    "showAlertModal": true,
                                    "hideCloseBtn": true,
                                    "positiveFunction": function () {
                                        sPC.PLPolicyType = "MI";
                                        sPC.validateAge = false;
                                            sPC.updatePolicyType = true;
                                        const index = sPC.prepareData.Platinum.MemberDetails.findIndex(item =>item.Age <=3);
                                        if (index > -1) {
                                            if (columnName == 'activeAssure') {
                                                sPC.prepareData.Platinum.MemberDetails[index]['activeAssureSelectedValue'] = "No";
                                            } else {
                                                sPC.prepareData.Platinum.MemberDetails[index]['activeHealthSelectedValue'] = "No";
                                            }
                                            sPC.prepareData.Platinum.MemberDetails.splice(index, 1);
                                            if (sPC.prepareData.SuperTopup != null)
                                                sPC.prepareData.SuperTopup.MemberDetails.splice(index, 1);
                                                 
                                        }
                                       
                                    },
                                }                             
                            }
                        })
                    } 
                }

                if (columnName == 'activeAssure' || memberDetail.activeAssureSelectedValue == '') {
                    if (sPC.prepareData.Diamond == null || angular.isUndefined(sPC.prepareData.Diamond.MemberDetails) || sPC.prepareData.Diamond.MemberDetails.length == 0) {
                        sPC.prepareData.Diamond = {
                            PolicyType: "MI",
                            SI: sPC.diamondSI,
                            CoverARU: sPC.CoverARU,
                            CoverSNCB: sPC.CoverSNCB,
                            CoverURSI: sPC.CoverURSI,
                            MemberDetails: []
                        };
                    }
                  
                    if (memberDetail.activeAssureSelectedValue == 'Yes') {
                        memberDetail.SumInsured = sPC.diamondSI;
                        memberDetail.CoverARU = "N",
                        memberDetail.CoverSNCB = "N",
                        memberDetail.CoverURSI = "N",
                        //var newMemeber = angular.copy(memberDetail)
                        sPC.prepareData.Diamond.MemberDetails.push(memberDetail)
                        if (sPC.prepareData.SuperTopup != null) {
                            sPC.prepareData.SuperTopup.MemberDetails.push(memberDetail)
                        }
                        // sPC.prepareData.Diamond.PolicyType = (sPC.prepareData.Diamond.MemberDetails.length > 1) ? 'FF' : 'MI';
                        sPC.DIPolicyType = sPC.prepareData.Diamond.PolicyType
                        sPC.prepareData.Diamond.MemberDetails.forEach(function (e) {
                            if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                                sPC.updateAssurePolice = false;
                            } else {
                                sPC.updateAssurePolice = true;
                            }
                        });
                    } else {
                        const index = sPC.prepareData.Diamond.MemberDetails.findIndex(item => item.OrderRank == memberDetail.OrderRank);
                        if (index > -1) {
                            sPC.prepareData.Diamond.MemberDetails.splice(index, 1);
                            if (sPC.prepareData.SuperTopup != null)
                                sPC.prepareData.SuperTopup.MemberDetails.splice(index, 1);
                        }

                        sPC.prepareData.Diamond.MemberDetails.forEach(function (e) {
                            if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                                sPC.updateAssurePolice = false;
                            } else {
                                sPC.updateAssurePolice = true;
                            }
                        });
                    }
                }
                if (columnName == 'activeHealth') {
                    if (sPC.prepareData.Platinum == null || angular.isUndefined(sPC.prepareData.Platinum.MemberDetails) || sPC.prepareData.Platinum.MemberDetails.length == 0) { // angular.isUndefined it return true if it have value as undefind else return false
                        sPC.prepareData.Platinum = {
                            PolicyType: "MI",
                            Zone: "Z002",
                            MemberDetails: [],

                        }
                    }

                    if (memberDetail.activeHealthSelectedValue == 'Yes') {
                        memberDetail.SumInsured = sPC.platinumSI;
                        memberDetail.PreExistingDisease = "NCHR";
                        memberDetail.hypertension = '0';
                        memberDetail.asthma = '0';
                        memberDetail.hyperlipidemia = '0'
                        memberDetail.diabetes = '0';
                        memberDetail.RoomType = "Single";
                        memberDetail.PaCoverFlag = 'N';
                        memberDetail.CiCoverFlag = 'N';
                        memberDetail.IcmiCoverFlag = 'N';
                   

                        // var validateAge = ageOfMember.some(function(e){
                        //     if(e.Age <=3){
                        //         sPC.PLPolicyType = "FF";
                        //     }else{
                        //         sPC.PLPolicyType = "MI";
                        //     }
                        // });
                        //var newMemeber = angular.copy(memberDetail)
                        sPC.prepareData.Platinum.MemberDetails.push(memberDetail)
                        sPC.ageOfMember = sPC.prepareData.Platinum.MemberDetails;
                        sPC.validateAge = sPC.ageOfMember.some(e => e.Age <= 3);
                        if (sPC.validateAge) {
                            sPC.prepareData.Platinum.MemberDetails.forEach(function (e) {
                                if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                                    sPC.PLPolicyType = "FF";
                                    sPC.updatePolicyType = false;
                                } else {
                                    $rootScope.alertData = {
                                        "modalClass": "regular-alert",
                                        "modalHeader": "Confirm",
                                        "modalBodyText": e.RelationWithProposer + " "+"is not allowed in family flooter",
                                        "showCancelBtn": false,
                                        "modalSuccessText": "Yes",
                                        "modalCancelText": "No",
                                        "showAlertModal": true,
                                        "hideCloseBtn": true,
                                        "positiveFunction": function () {
                                            sPC.PLPolicyType = "MI";
                                            sPC.validateAge = true;
                                            sPC.updatePolicyType = false;
                                            const index = sPC.prepareData.Platinum.MemberDetails.findIndex(item => item.Age <=3);
                                           
                                            if (index > -1) {
                                                if (columnName == 'activeAssure') {
                                                    sPC.prepareData.Platinum.MemberDetails[index]['activeAssureSelectedValue'] = "No";
                                                } else {
                                                    sPC.prepareData.Platinum.MemberDetails[index]['activeHealthSelectedValue'] = "No";
                                                }
                                                sPC.prepareData.Platinum.MemberDetails.splice(index, 1);
                                                if (sPC.prepareData.SuperTopup != null)
                                                    sPC.prepareData.SuperTopup.MemberDetails.splice(index, 1);
                                                    
                                            }
                                           
                                        },
                                    }                             
                                }
                            })
                        }
                        // sPC.prepareData.Platinum.MemberDetails.forEach(function (e) {
                        //     if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                        //         sPC.updatePolicyType = false;
                        //     } else {
                        //         sPC.updatePolicyType = true;
                        //     }
                        // })
                        sPC.checkFamilyMember = sPC.prepareData.Platinum.MemberDetails.some(e => e.RelationWithProposer == "Mother"||e.RelationWithProposer == "Father"||e.RelationWithProposer=="Brother"||e.RelationWithProposer=="Father-in-law"||e.RelationWithProposer=="Mother-in-law"||e.RelationWithProposer =="Grandmother"||e.RelationWithProposer =="Grandfather"||e.RelationWithProposer == "Sister");
                       if(sPC.checkFamilyMember){
                        sPC.updatePolicyType = true;
                       }else{
                        sPC.updatePolicyType = false;
                       }
                    } else {
                        const index = sPC.prepareData.Platinum.MemberDetails.findIndex(item => item.OrderRank == memberDetail.OrderRank);
                        if (index > -1) {
                            sPC.prepareData.Platinum.MemberDetails.splice(index, 1);
                            if (sPC.prepareData.SuperTopup != null)
                                sPC.prepareData.SuperTopup.MemberDetails.splice(index, 1);
                        }
                        sPC.prepareData.Platinum.MemberDetails.forEach(function (e) {
                            if (e.RelationWithProposer == "Self" || e.RelationWithProposer == "Spouse" || e.RelationWithProposer == "KID") {
                                sPC.updatePolicyType = false;
                            } else {
                                sPC.updatePolicyType = true;
                            }
                        })
                    }
                }
                if (columnName == 'superTopUp') {
                    sPC.prepareData.SuperTopup = {
                        PolicyType: "MI",
                        SI: sPC.diamondSI,

                        MemberDetails: []
                    };
                }
                sPC.getPremiumCal();

            }
        }
    }

    sPC.ageValidation = function (memberDetail) {
        if (memberDetail.activeAssureSelectedValue === 'Yes' && memberDetail.activeHealthSelectedValue === 'Yes') {
            sPC.addDeleteMembers('addDelete', 'activeAssure', $index, memberVal);
            sPC.addDeleteMembers('addDelete', 'activeHealth', $index, memberVal);
        }
    }
    // sPC.ageValidation = function(memberDetail){
    //     if (memberDetail.Age !='') {
    //         return false;
    //     }
    //     else{
    //         const index = sPC.prepareData.Diamond.MemberDetails.findIndex(item => item.OrderRank == memberDetail.OrderRank);
    //         if (index > -1) {
    //             sPC.prepareData.Diamond.MemberDetails.splice(index, 1);
    //             sPC.prepareData.SuperTopup.MemberDetails.splice(index, 1);
    //         }
    //     }
    //   }

    sPC.updateChronicDiseaseFlag = function (memberObj, index) {
        var platinumChronicFlag = ''
        for (var i = 0; i < sPC.ChronicArray.length; i++) {
            if (memberObj[sPC.ChronicArray[i]] == 1) {
                platinumChronicFlag = platinumChronicFlag + '1'
            }
            else {
                platinumChronicFlag = platinumChronicFlag + '0'
            }
        }
        if (platinumChronicFlag == "0000") {
            sPC.prepareData.Platinum.MemberDetails[index].PreExistingDisease = "NCHR";
        } else {
            sPC.prepareData.Platinum.MemberDetails[index].PreExistingDisease = platinumChronicFlag;
        }

        sPC.getPremiumCal();
    }
    sPC.updateOptionalCover = function (param , index) {
        if (sPC.prepareData.Diamond == null || sPC.prepareData.Diamond.MemberDetails.length == 0 || sPC.preminumDetailsObj == null) {
            $rootScope.alertConfiguration('E', "Please select atleat one member", "");
            sPC.CoverARU = "N";
            sPC.CoverSNCB = "N";
            sPC.CoverURSI = "N";
        }
        if(sPC.DIPolicyType == "FF"){
            sPC.prepareData.Diamond.CoverARU = sPC.CoverARU;
            sPC.prepareData.Diamond.CoverSNCB = sPC.CoverSNCB;
            sPC.prepareData.Diamond.CoverURSI = sPC.CoverURSI;
            sPC.getPremiumCal();
        } else if(sPC.DIPolicyType == "MI" && angular.isObject(param)){
            for(var i=0; i<=sPC.prepareData.Diamond.MemberDetails.length; i++){
                sPC.prepareData.Diamond.MemberDetails[index].CoverARU = param.CoverARU;
                sPC.prepareData.Diamond.MemberDetails[index].CoverSNCB = param.CoverSNCB;
                sPC.prepareData.Diamond.MemberDetails[index].CoverURSI = param.CoverURSI;
               
            }
            sPC.getPremiumCal();
        }else{
            for(var i=0; i<sPC.prepareData.Diamond.MemberDetails.length; i++){
                sPC.prepareData.Diamond.MemberDetails[i].CoverARU = sPC.CoverARU;
                sPC.prepareData.Diamond.MemberDetails[i].CoverSNCB = sPC.CoverSNCB;
                sPC.prepareData.Diamond.MemberDetails[i].CoverURSI = sPC.CoverURSI
                sPC.prepareData.Diamond.PolicyType = "MI";
               
            }
            sPC.getPremiumCal();
        }
 
    }

    sPC.updateAssurePolicytype = function (val) {
        if (sPC.prepareData.Diamond == null || sPC.prepareData.Diamond.MemberDetails.length == 0 || sPC.preminumDetailsObj == null) {
            $rootScope.alertConfiguration('E', "Please select atleat one member", "");
            // sPC[param] = 'N'
        }else if(sPC.prepareData.Diamond.MemberDetails.length <= 1){
            sPC.DIPolicyType = "MI"
        }else{
            sPC.prepareData.Diamond.PolicyType = sPC.DIPolicyType;
        }
       

        sPC.getPremiumCal()
    }

    sPC.updateSumInsuredVal = function (productName, memberDetail) {
        if (productName == "Diamond") {
            for (var i = 0; i < sPC.prepareData.Diamond.MemberDetails.length; i++) {
                sPC.prepareData.Diamond.MemberDetails[i].SumInsured = sPC.diamondSI
            }
            sPC.prepareData.Diamond.SI = sPC.diamondSI
        }
        if (productName == 'platinum') {
            for (var i = 0; i < sPC.prepareData.Platinum.MemberDetails.length; i++) {
                if (sPC.PLPolicyType == 'FF') {
                    sPC.prepareData.Platinum.MemberDetails[i].SumInsured = sPC.platinumSI
                }
                else {
                    if (sPC.prepareData.Platinum.MemberDetails[i].RelationWithProposer == memberDetail.RelationWithProposer) {
                        sPC.prepareData.Platinum.MemberDetails[i].SumInsured = memberDetail.SumInsured
                    }
                }
            }
        }
        if (productName == 'ST') {
            if (sPC.diamondSI != "1000000") {
                sPC.diamondSI = "1000000";
            }
            sPC.prepareData.SuperTopup = { MemberDetails: [], PolicyType: "MI" };
            var diObj;
            for (var i = 0; i < sPC.prepareData.Diamond.MemberDetails.length; i++) {
                diObj = '';
                diObj = angular.copy(sPC.prepareData.Diamond.MemberDetails[i]);
                sPC.prepareData.SuperTopup.MemberDetails.push(diObj);
                sPC.prepareData.SuperTopup.MemberDetails[i].SumInsured = sPC.superTopUpSI;
                sPC.prepareData.SuperTopup.MemberDetails[i].Deductible = sPC.stDeductable;
                if (sPC.superTopUpSI === '9500000') {
                    sPC.diamondSI = '500000';
                    sPC.prepareData.Diamond.MemberDetails[i].SumInsured = sPC.diamondSI;
                    sPC.prepareData.Diamond.SI = sPC.diamondSI;
                }
                sPC.prepareData.Diamond.MemberDetails[i].SumInsured = sPC.diamondSI;
                sPC.prepareData.Diamond.SI = sPC.diamondSI;

                sPC.prepareData.Diamond.CoverARU = "No";
                sPC.prepareData.Diamond.CoverSNCB = "No";
                sPC.prepareData.Diamond.CoverURSI = "No";
            }
        }

        sPC.getPremiumCal();

    }

    sPC.resetSuparTopUP = function () {
        sPC.superTopUpSI = "";
        sPC.stDeductable = "";
    }
    sPC.updatePolicytype = function () {
        if (sPC.prepareData.Platinum == null || sPC.prepareData.Platinum.MemberDetails.length == 0 || sPC.preminumDetailsObj == null) {
            $rootScope.alertConfiguration('E', "Please select atleat one member", "");
            // sPC[param] = 'N'
        }
        sPC.prepareData.Platinum.PolicyType = sPC.PLPolicyType;
        var memberList = sPC.prepareData.Platinum.MemberDetails;
        if (sPC.prepareData.Platinum.PolicyType == "FF") {
            memberList.forEach(function (e) {
                e.hypertension = "0";
                e.diabetes = "0";
                e.asthma = "0";
                e.hyperlipidemia = "0";
                e.PreExistingDisease = "NCHR";
                e.SumInsured = "1000000";
            })
        }
        // if(sPC.prepareData.Platinum.PolicyType =="FF"){
        //     for(var i=0;i<sPC.prepareData.Platinum.MemberDetails.length; i++){
        //        sPC.prepareData.Platinum.MemberDetails[i].hypertension = "0";
        //        sPC.prepareData.Platinum.MemberDetails[i].diabetes = "0";
        //        sPC.prepareData.Platinum.MemberDetails[i].asthma = "0";
        //        sPC.prepareData.Platinum.MemberDetails[i].hyperlipidemia = "0";

        //     }

        //    } 
        // $rootScope.alertData = {
        //     "modalClass": "regular-alert",
        //     "modalHeader": "Confirm",
        //     "modalBodyText": e.RelationWithProposer +"is not allowed in Family Flooter",
        //     "showCancelBtn": false,
        //     "modalSuccessText": "Yes",
        //     "modalCancelText": "No",
        //     "showAlertModal": true,
        //     "hideCloseBtn": true,
        //     "positiveFunction": function () {
        //         sPC.PLPolicyType = "MI";
        //     },
        // }
        sPC.getPremiumCal()
    }

    sPC.getPremiumCal = function () {
        var data = sPC.preparedata_(sPC.prepareData)
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremiumCalculator", data, true, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (data) {
            if(data.ResponseCode == "1"){
            sPC.preminumDetailsObj = data.ResponseData;
            if (sPC.preminumDetailsObj.SuperTopup == " " || sPC.preminumDetailsObj.SuperTopup == null || sPC.preminumDetailsObj == null) {
            }
            else {
                sPC.superTopupValidation();
            }
        }else{
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": data.ResponseMessage,
                "showCancelBtn": false,
                "modalSuccessText": "Ok",
                "showAlertModal": true,
                "hideCloseBtn": true
            }
        }
        })
    }

    sPC.superTopupValidation = function () {
        if (sPC.preminumDetailsObj.SuperTopup != " " || sPC.preminumDetailsObj.SuperTopup != null) {
            sPC.sumActivSuperTopup = parseInt(sPC.preminumDetailsObj.Diamond[0].Premium) + parseInt(sPC.preminumDetailsObj.SuperTopup[0].Premium);
            sPC.sumActivSuperTopup1 = parseInt(sPC.preminumDetailsObj.Diamond[1].Premium) + parseInt(sPC.preminumDetailsObj.SuperTopup[1].Premium);
            sPC.sumActivSuperTopup2 = parseInt(sPC.preminumDetailsObj.Diamond[2].Premium) + parseInt(sPC.preminumDetailsObj.SuperTopup[2].Premium);
            sPC.sumTenureSaving = parseInt(sPC.preminumDetailsObj.Diamond[1].TenureSaving) + parseInt(sPC.preminumDetailsObj.SuperTopup[1].TenureSaving);
            sPC.sumTenureSaving = parseInt(sPC.preminumDetailsObj.Diamond[2].TenureSaving) + parseInt(sPC.preminumDetailsObj.SuperTopup[2].TenureSaving);
        }
    }
    sPC.preparedata_ = function (values) {
        var data = [];
        if (values.Diamond != null && values.Diamond.MemberDetails.length > 0) {
            angular.forEach(values.Diamond.MemberDetails, function (value, key) {
                if (value.Age == "") {
                    delete values.Diamond.MemberDetails[key];
                }
            });
        }
        if (values.Platinum != null) {
            angular.forEach(values.Platinum.MemberDetails, function (value, key) {
                if (value.Age == "") {
                    delete values.Platinum.MemberDetails[key];
                }

            });
        }
        return values;
    }


    sPC.validateUserAge = function (memberDetail) {
        for (var i = 0; i < sPC.memberListArray.length - 1; i++) {
            if (sPC.memberListArray[i].RelationWithProposer != memberDetail.RelationWithProposer) {
                if (memberDetail.RelationWithProposer == "Self" && (sPC.memberListArray[i].RelationWithProposer == 'Father' || sPC.memberListArray[i].RelationWithProposer == 'Mother' || sPC.memberListArray[i].RelationWithProposer == 'Father-in-law' || sPC.memberListArray[i].RelationWithProposer == 'Mother-in-law' || sPC.memberListArray[i].RelationWithProposer == 'Grandfather' || sPC.memberListArray[i].RelationWithProposer == 'Grandmother') && memberDetail.Age > sPC.memberListArray[i].Age) {
                    $rootScope.alertConfiguration('E', "Self age cannot be greater than " + sPC.memberListArray[i].RelationWithProposer, "");
                    memberDetail.Age = "";
                }

                if (memberDetail.RelationWithProposer == "Spouse" && (sPC.memberListArray[i].RelationWithProposer == 'Father' || sPC.memberListArray[i].RelationWithProposer == 'Mother' || sPC.memberListArray[i].RelationWithProposer == 'Father-in-law' || sPC.memberListArray[i].RelationWithProposer == 'Mother-in-law' || sPC.memberListArray[i].RelationWithProposer == 'Grandfather' || sPC.memberListArray[i].RelationWithProposer == 'Grandmother') && memberDetail.Age > sPC.memberListArray[i].Age) {
                    $rootScope.alertConfiguration('E', "Spouse age cannot be greater than " + sPC.memberListArray[i].RelationWithProposer, "");
                    memberDetail.Age = "";
                }

                if ((memberDetail.RelationWithProposer == 'Father' || memberDetail.RelationWithProposer == 'Mother' || memberDetail.RelationWithProposer == 'Father-in-law' || memberDetail.RelationWithProposer == 'Mother-in-law' || memberDetail.RelationWithProposer == 'Grandfather' || memberDetail.RelationWithProposer == 'Grandmother') && (sPC.memberListArray[i].RelationWithProposer == 'Self' || sPC.memberListArray[i].RelationWithProposer == 'Spouse') && memberDetail.Age < sPC.memberListArray[i].Age) {
                    $rootScope.alertConfiguration('E', memberDetail.RelationWithProposer + " age cannot be less than " + sPC.memberListArray[i].RelationWithProposer, "");
                    memberDetail.Age = "";
                }

                if ((memberDetail.RelationWithProposer == "KID") && (sPC.memberListArray[i].RelationWithProposer == 'Self' || sPC.memberListArray[i].RelationWithProposer == 'Spouse') && parseInt(memberDetail.Age) > parseInt(sPC.memberListArray[i].Age)) {
                    $rootScope.alertConfiguration('E', memberDetail.RelationType + " age cannot be greater than " + sPC.memberListArray[i].RelationWithProposer, "")
                    memberDetail.Age = "";
                }
            }

        }
    }

}])