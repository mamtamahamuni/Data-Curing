
/*
    Name: Insured Details Page Controller
    Author: Pankaj Patil
    Date: 01/08/2018    
*/

var tDApp = angular.module("travellerDetailsApp", []);

tDApp.controller("travellerDetails", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$scope', '$timeout', '$filter', 'productValidationService', function ($rootScope, appService, ABHI_CONFIG, $location, $scope, $timeout, $filter, productValidationService) {


    /* Variable Initilization */
    var tID = this; // Current Controller Instance
    var aS = appService; // app service instance
    tID.insuredMembers = [{
        "RelationWithProposer": "Member 1",
        "RelationType": "Member1"
    }]; // Storing all Insured members list. Use for showing insured details member in header tab
    tID.insuredMemberDetails=[];
    tID.currentActiveMember = 1;
    tID.activeMember = 'Member'+tID.currentActiveMember;
    tID.CountryofTravel = '';
    tID.today = new Date();
    tID.TripStartDate = {
        value: new Date(tID.today)
    };
    tID.TripEndDate = {
        value: new Date('00-00-0000')
    }; 
    tID.SumInsured = '50000';
    tID.Relation = (tID.currentActiveMember == 1) ? 'Self' : '';
    tID.FirstName = '';
    tID.MiddleName = '';
    tID.LastName = '';
    tID.Address = '';
    tID.Pincode = '';
    tID.City = '';
    tID.State = '';
    tID.EmailID = '';
    tID.dobDay = '';
    tID.dobMonth = '';
    tID.dobYear = '';
    tID.DOB = '';
    tID.MobileNo = '';
    tID.Gender = '';
    tID.PassportNumber = '';
    tID.TravelDuration = 0;
    tID.MaxTravelDuration = false;
    tID.MaxDate = tID.TripStartDate.value + 27;
    tID.UniqueID = '';
    tID.TotalPremium = 0;
    tID.NomineeRelation = '';
    tID.NomineeName = '';
    tID.memberDetailsContainer = true;
    tID.memberPayment = true;
    var insuredMemberDetails; // Storing all insured members with respect to selected products.
    var calculatePremiumParams; // To store calculate premium service parameters.
    var currentActiveMember; // Stors current active member in this variable
    var curActMember = {}; // Complete object of current active member 
    tID.hideSubmitButton = true;
    /* End of variable Initilization */
    
    /* Add Travel Member */
    tID.addMember = function (event) {
        if (tID.insuredMembers.length >= 10) {
            $('#addMember').text('Maximum Member Limit Exceed');
        } else{
            tID.insuredMembers.push({
                "RelationWithProposer": "Member " + (tID.insuredMembers.length + 1),
                "RelationType": "Member" + (tID.insuredMembers.length + 1)
            });
            tID.calculatePremium();
        }

        console.log(tID.insuredMembers);
    }

    /* To change insured tab */
    tID.changeInsuredMember = function (index) {
        fIDQ = index;
        //activeRelationToProposer =   tID.insuredMembers[index].RelationWithProposer;
        $rootScope.callGtag('click-item', 'insured-details', '[' + tID.insuredDetailsPageType + ']_select-[' + tID.insuredMembers[index].RelationType + ']');
        //fetchInsuredDetails(tID.insuredMembers[index].Gender, tID.insuredMembers[index].RelationType, tID.insuredMembers[index].RelationWithProposer, true);
    }
    /* End of changing insured tab */

    /* go to previous Member */
    tID.goToPreviousMemeber = function () {
        fIDQ = fIDQ - 1;
        if (fIDQ >= 0) {
            $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 80 }, 300);
            //fetchInsuredDetails(tID.insuredMembers[fIDQ].Gender, tID.insuredMembers[fIDQ].RelationType, tID.insuredMembers[fIDQ].RelationWithProposer, true);
            }
            else {
                tID.backfunction();
            }
        }
    /* go to previous Member  ends*/

     /* To Calulate Premium */
     tID.calculatePremium = function() {
        aS.postData(ABHI_CONFIG.apiUrl + "Vodafone/GetVodafonePremium", {
            "MemberCount":tID.insuredMembers.length,
            "SumInsured":tID.SumInsured,
            "Duration":tID.TravelDuration
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            console.log(response);
            if (response.ResponseCode == 1) {
                tID.TotalPremium = response.ResponseData.Premium;
            } else {
                $rootScope.alertConfiguration('E', response.ResponseMessage);
            }
        }, function (err) {
    
        });
    }
    /* End of calulating premium */

    tID.changeTravelDateSD = function(date, param){
        
        if(date.value == undefined && param == 'Start Date'){
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Trip Start Date can not be a past date.",
                "showCancelBtn": false,
                "modalSuccessText": "OK",
                "showAlertModal": true,
                "hideCloseBtn": true,
                "positiveFunction": function () {
                    tID.TripStartDate = {
                        value: new Date(tID.today)
                    };
                }
            };
        } else{
            tID.TripEndDate = {
                value: new Date(tID.TripStartDate.value)
            };
            tID.CalculateTravelDuration(date.value, tID.TripEndDate.value)
        }
    }

    tID.changeTravelDateED = function(date, param){
        
        if(date.value == undefined && param == 'End Date'){
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Alert",
                "modalBodyText": "Trip End Date can not be a past date.",
                "showCancelBtn": false,
                "modalSuccessText": "OK",
                "showAlertModal": true,
                "hideCloseBtn": true,
                "positiveFunction": function () {
                    tID.TripEndDate = {
                        value: new Date(tID.TripStartDate.value)
                    };
                }
            };
        } else{
            tID.CalculateTravelDuration(tID.TripStartDate.value, date.value)
        }
    }

    tID.CalculateTravelDuration = function(startDate, endDate){
      if(tID.CountryofTravel != '' && tID.CountryofTravel != null && tID.CountryofTravel != undefined){
        console.log("Travel Date: " + startDate + " : " + endDate);
    
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
        var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));

        tID.TravelDuration = parseInt(diffDays) +1;
        if(tID.TravelDuration <= 28){
            tID.calculatePremium();
        } else{
            tID.MaxTravelDuration = true;
            tID.TotalPremium = 0;
        }
        console.log("tID.MaxDate: " + tID.MaxDate)
      }
    }

    /* Formation of DOB */
    tID.changeDate = function (day, month, year, param) {
        tID.DOB = day + "-" + month + "-" + year;
    }
    /* End of formation of DOB */

    /* Redirect to next tab function */
    tID.nextfunction = function (event, validForm) {
        tID.showErrors = false;

            if (!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test)) {
            $rootScope.alertConfiguration('E', "Please enter a valid email id");
            $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 80 }, 300);
            return false;
        }
        /* Following if block checks whether all required fields are filled by user or not */

        if (!validForm) {
            tID.showErrors = true;
            $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
            $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
            return false;
        }

        /* End of block to check required form fields */
        
        var regex = /^[A-Za-z0-9 ]+$/
        if ($("input[name='FirstName']").val() != '') {
            var isFirstNameValid = regex.test($("input[name='firstname']").val());
            if (!isFirstNameValid) {
                $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
                return false;
            }
        }

        if ($("input[name='MiddleName']").val() != '') {
            var isMiddleNameValid = regex.test($("input[name='middlename']").val());
            if (!isMiddleNameValid) {
                $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
                return false;
            }
        }
        
        if ($("input[name='LastName']").val() != '') {
            var isLastNameValid = regex.test($("input[name='lastname']").val());
            if (!isLastNameValid) {
                $("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 135 }, 300);
                $rootScope.alertConfiguration('E', "Please fill valid data", "valid_data_alert");
                return false;
            }
        }

        tID.insuredMemberDetails.push({
            "Relation":tID.Relation, 
            "FullName":tID.FirstName + ' ' + tID.MiddleName + ' ' + tID.LastName,
            "Address":tID.Address,
            "Pincode":tID.Pincode,
            "City":tID.City,
            "State":tID.State,
            "EmailID":tID.EmailID,
            "DOB":tID.DOB,
            "MobileNo":tID.MobileNo,
            "Gender":tID.Gender,
            "PassportNumber":tID.PassportNumber,
            "SumInsured":tID.SumInsured,
            "TravelDuration":tID.TravelDuration,
            "TripStartDate":tID.TripStartDate.value,
            "TripEnddate":tID.TripEndDate.value,
            "CountryofTravel":tID.CountryofTravel,
            "UniqueID":tID.UniqueID,
            "NomineeRelation": tID.NomineeRelation,
            "NomineeName": tID.NomineeName
        });

        tID.clearForm();

        if(tID.insuredMembers.length == tID.currentActiveMember){
            aS.postData(ABHI_CONFIG.apiUrl + "Vodafone/SaveTravelDetails", {
                "Memberdetails":tID.insuredMemberDetails
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                console.log(response);
                if (response.ResponseCode == 1) {
                    tID.memberDetailsContainer = false;
                    tID.memberPayment = true;
                } else {
                    $rootScope.alertConfiguration('E', response.ResponseMessage);
                }
            }, function (err) {
    
            });
        }
    }
    /* Redirect to next tab ends */

    /* Redirect to back page funciton */
    tID.backfunction = function () {
        if(tID.currentActiveMember > 0 && tID.insuredMembers.length >= tID.currentActiveMember){
            tID.currentActiveMember--;
            tID.activeMember = 'Member'+tID.currentActiveMember;
        }
    }
    /* Redirect to back page funciton ends */

    /* Change Pincode and update State and City  Details */
    tID.changePincode = function (validPincode, param) {
        if (validPincode) {
            tID.City = "";
            tID.State = "";
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/Pincode", {
                "Pincode": tID.Pincode,
                "Productcode": 'FIT'
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    tID.City = data.ResponseData.City;
                    tID.State = data.ResponseData.State;
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
                            tID.Pincode = "";
                        }
                    }
                }
            }, function (err) {
            });
        }
    }
    /* End of change Pincode and update State and City  Details */

    /* clear form */
    tID.clearForm = function(){
        if(tID.insuredMembers.length > tID.currentActiveMember){
            tID.currentActiveMember++;
        
            tID.activeMember = 'Member'+tID.currentActiveMember;

            tID.Relation = '';
            //tID.NomineeRelation = '';
            tID.FirstName = '';
            tID.MiddleName = '';
            tID.LastName = '';
            // tID.Address = '';
            // tID.Pincode = '';
            // tID.City = '';
            // tID.State = '';
            tID.EmailID = '';
            tID.dobDay = '';
            tID.dobMonth = '';
            tID.dobYear = '';
            tID.DOB = '';
            tID.MobileNo = '';
            tID.Gender = '';
            tID.PassportNumber = '';
            tID.UniqueID = '';
            // tID.NomineeRelation = '';
            // tID.NomineeName = '';
        }
        console.log(tID.insuredMemberDetails);
    }
}]);

