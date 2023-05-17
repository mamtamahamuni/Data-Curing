/*
  Name: Cross Sell Directive
  Author: Pankaj Patil
  Date: 19-06-2018
*/
var app = angular.module('crossSellQuoteDirective', []);

app.directive('crossSellQuote', ['$timeout', '$rootScope', 'appService', 'ABHI_CONFIG','productValidationService','$filter','$location', function($timeout, $rootScope, appService, ABHI_CONFIG,productValidationService,$filter,$location) {
    return {
        scope: {
            cSQ: "=cross",
        },
        restrict: 'E',
        templateUrl: "partials/cross-sell-quote.html",
        link: function(scope, element, attrs) {

            (attrs.cross == "pAC") ? scope.cSQ.rFBProductType = "pA": scope.cSQ.rFBProductType = attrs.cross;
            
            /* To fetch secondary product premiums */

                scope.cSQ.fetchPremiumsSecondary = function(){
                    appService.postData(ABHI_CONFIG.apiUrl + "GEN/GetBasePremium", {
                            "ReferenceNumber": sessionStorage.getItem('rid')
                        }, true, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(function(data) {
                            if (data.ResponseCode == 1) {
                                for (var i = 0; i < data.ResponseData.length; i++) {
                                    if (data.ResponseData[i].ProductName == 'CI') {
                                        scope.cSQ.CIPremium = data.ResponseData[i].Premium;
                                    }
                                    if (data.ResponseData[i].ProductName == 'CS') {
                                        scope.cSQ.CSPremium = data.ResponseData[i].Premium;
                                    }
                                    if (data.ResponseData[i].ProductName == 'PA') {
                                        scope.cSQ.PAPremium = data.ResponseData[i].Premium;
                                    }
                                }
                            } else {
                                $rootScope.alertConfiguration('E',"Some error ocurred.");
                            }
                        }, function(err) {

                        });
                }

                scope.cSQ.fetchPremiumsSecondary();

            /* End of fetching secondary product premiums */


            /* To check cross sell validations */

                scope.cSQ.checkCrossSellValidations = function(insuredDetail){
                    if(scope.cSQ.PA == 'Y'){
                        var pAErrorStatus = productValidationService.rFBValidations(scope.cSQ.membersDetails,5,"PA",insuredDetail.RelationType);
                        if(pAErrorStatus.invalidConstruct){
                            deleteSecondaryProduct('PA');
                            scope.cSQ.PA = 'N';
                        }
                    }
                    if(scope.cSQ.CI == 'Y'){
                        var cIErrorStatus = productValidationService.rFBValidations(scope.cSQ.membersDetails,5,"CI",insuredDetail.RelationType);
                        if(cIErrorStatus.invalidConstruct){
                            deleteSecondaryProduct('CI');
                            scope.cSQ.CI = 'N';
                        }
                    }
                    if(scope.cSQ.CS == 'Y'){
                        var cSErrorStatus = productValidationService.rFBValidations(scope.cSQ.membersDetails,18,"CS",insuredDetail.RelationType);
                        if(cSErrorStatus.invalidConstruct){
                            deleteSecondaryProduct('CS');
                            scope.cSQ.CS = 'N';
                        }
                    }
                }

            /* End of checking cross sell valdations */


            /* Click event on proceed to application */

                $('#cross-sell-panel-click').click(function(){
                    $(this).closest('.cross-sell-bg').toggleClass('csell-open');
                    if($('#Onecollapse').css('display') == "block" ){
                        $rootScope.callGtag('click-accordian','quote',$location.$$path.substring(1)+'_[proceed-to-application]_close');
                    }else{
                        $rootScope.callGtag('click-accordian','quote',$location.$$path.substring(1)+'_[proceed-to-application]_open');
                    }
                    $("html, body").animate({ scrollTop: $(document).height() }, 400);
                });

            /* End of clicing on proceed to application */


            /* To buy product */

                function buySecondaryProduct(productCode,memberList){
                    scope.cSQ[productCode+"loader"] = true;
                    appService.postData(ABHI_CONFIG.apiUrl + "GEN/BuyProduct", {
                        "ReferenceNumber": sessionStorage.getItem('rid'),
                        "ProductCode": productCode,
                        "MemberList": memberList
                    }, true, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function(data) {
                        if (data.ResponseCode == 1){
                            $rootScope.alertConfiguration('S',$filter('productFilter')(productCode)+" Product added successfully.");
                            scope.cSQ.fetchInsuredMembers();
                            scope.cSQ.calculatePremium();
                            if(scope.cSQ.PA == 'Y' || scope.cSQ.CI == 'Y' || scope.cSQ.CS == 'Y'){
                                sessionStorage.setItem('crossSell',true);
                            }
                        }else{
                            scope.cSQ[productCode] = 'N';
                            $rootScope.alertConfiguration('E',data.ResponseMessage);
                        }
                        scope.cSQ[productCode+"loader"] = false;
                    },function(err){

                    });
                }

            /* End of to buying product */


            /* Cross sell product select */

                scope.cSQ.selectCrossSellProduct = function(param,acParam){
                    if(scope.cSQ[param] == 'Y'){
                        var errorStatus;
                        switch(param){
                            case 'PA':
                                errorStatus = productValidationService.rFBValidations(scope.cSQ.membersDetails,5,"PA");
                                break;
                            case 'CI':
                                errorStatus = productValidationService.rFBValidations(scope.cSQ.membersDetails,5,"CI");
                                break;
                            case 'CS':
                                errorStatus = productValidationService.rFBValidations(scope.cSQ.membersDetails,18,"CS");
                                break;
                            default:
                            break;
                        }
                        if(param == 'PA' && !errorStatus.isSelfPresent){
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Warning",
                                "modalBodyText": "Self is Mandatory for PA",
                                "showCancelBtn": false,
                                "modalSuccessText": "Ok",
                                "showAlertModal": true,
                                "positiveFunction": function(){
                                    scope.cSQ[param] = 'N';
                                },
                            }
                        }else if(errorStatus.invalidConstruct){
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Warning",
                                "modalBodyText": "You cannot buy this product based on family construct you selected",
                                "showCancelBtn": false,
                                "modalSuccessText": "Ok",
                                "showAlertModal": true,
                                "positiveFunction": function(){
                                    scope.cSQ[param] = 'N';
                                },
                            }
                        }else{
                            buySecondaryProduct(param,errorStatus.elligibleMembers)
                        }
                    }else{
                        if(acParam){
                            deleteSecondaryProduct(param);
                        }
                        else{
                            
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Confirm",
                                "modalBodyText": "Are you sure you want to delete this product?",
                                "showCancelBtn": true,
                                "modalSuccessText": "Yes",
                                "modalCancelText" : "No",
                                "showAlertModal": true,
                                "positiveFunction": function(){
                                    deleteSecondaryProduct(param);
                                },
                                "negativeFunction": function(){
                                    scope.cSQ[param] = 'Y';
                                }
                            }
                        }
                    }
                }

            /* End of cross product select */


            /* Delete secondary product */

                function deleteSecondaryProduct(ProductCode){
                    appService.postData(ABHI_CONFIG.apiUrl + "GEN/DeleteProduct", {
                        "ReferenceNumber":sessionStorage.getItem('rid'),
                        "ProductCode": ProductCode
                    }, true, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function(data) {
                            if(data.ResponseCode == 1){
                                $rootScope.alertConfiguration('S',$filter('productFilter')(ProductCode)+" Product deleted successfully.");
                                scope.cSQ[ProductCode] = 'N';
                                scope.cSQ.calculatePremium();
                                scope.cSQ.fetchInsuredMembers();
                                if(scope.cSQ.PA != 'Y' && scope.cSQ.CI != 'Y' && scope.cSQ.CS != 'Y'){
                                    sessionStorage.setItem('crossSell',false);
                                }
                            }else{
                                $rootScope.alertConfiguration('E',"Some error occurred");
                            }
                        },function(err){

                        });
                }

            /* End of deleting secondary product */


            /* Delete member of secondary quote */
              
                scope.cSQ.checkUncheckMember = function(member,productCode,checkStatus,index){
                    var addMemberData = angular.copy(member);
                    addMemberData.ProductCode = productCode;
                    delete addMemberData['is'+productCode];
                    if(checkStatus == 'Y'){
                        var toValidateMemberConstruct = angular.copy(scope.cSQ[productCode+"Members"]);
                        toValidateMemberConstruct.push(addMemberData);
                        switch(productCode){
                            case 'PA':
                                errorStatus = productValidationService.rFBValidations(toValidateMemberConstruct,5,"PA",addMemberData.RelationType);
                                break;
                            case 'CI':
                                errorStatus = productValidationService.rFBValidations(toValidateMemberConstruct,5,"CI",addMemberData.RelationType);
                                break;
                            case 'CS':
                                errorStatus = productValidationService.rFBValidations(toValidateMemberConstruct,18,"CS",addMemberData.RelationType);
                                break;
                            default:
                            break;
                        }
                        if(errorStatus.selectedMemberError == 'Y'){
                            var errorAlert = "<ul>";
                            angular.forEach(errorStatus.allErrors,function(v,i){
                                if(v.RelationType == addMemberData.RelationType){
                                    errorAlert = errorAlert+"<li>"+v.message+"</li>";
                                }
                            });
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Error",
                                "modalBodyText": errorAlert,
                                "showCancelBtn": false,
                                "modalSuccessText": "OK",
                                "showAlertModal": true,
                                "positiveFunction": function(){
                                    member['is'+productCode] = 'N';
                                }
                            }
                        }else{
                            if(scope.cSQ.planName == "activ-Care"){
                                scope.cSQ.addUpdateDeleteACMember('AddMember', angular.copy(addMemberData))
                                    .then(function(data){
                                        scope.cSQ.fetchInsuredMembers()
                                            .then(function(data){
                                                scope.cSQ.calculatePremium();
                                                scope.cSQ.activeCareFamilyContruct = scope.cSQ.intitalACMemberList;
                                                scope.cSQ.activCareFamilyMapping()
                                            });
                                    });
                            }else{
                                scope.cSQ.addUpdateDeleteMember('AddMember', angular.copy(addMemberData));
                            }
                        }
                    }else{
                        var toValidateMemberConstruct = angular.copy(scope.cSQ[productCode+"Members"]);
                        for(var i = 0; i<toValidateMemberConstruct.length;i++){
                            if(toValidateMemberConstruct[i].RelationType == addMemberData.RelationType){
                                toValidateMemberConstruct.splice(i,1);
                                break;
                            }
                        }
                        switch(productCode){
                            case 'PA':
                                errorStatus = productValidationService.rFBValidations(toValidateMemberConstruct,5,"PA");
                                break;
                            case 'CI':
                                errorStatus = productValidationService.rFBValidations(toValidateMemberConstruct,5,"CI");
                                break;
                            case 'CS':
                                errorStatus = productValidationService.rFBValidations(toValidateMemberConstruct,18,"CS");
                                break;
                            default:
                            break;
                        }
                        if(!errorStatus.invalidConstruct){
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Warning",
                                "modalBodyText": "Are you sure you want to remove this member?",
                                "showCancelBtn": true,
                                "modalSuccessText": "Yes",
                                "modalCancelText": "No",
                                "showAlertModal": true,
                                "hideCloseBtn": true,
                                "positiveFunction": function() {
                                    if(scope.cSQ.planName == "activ-Care"){
                                        scope.cSQ.addUpdateDeleteACMember('DeleteMember',addMemberData)
                                            .then(function(data){
                                                scope.cSQ.fetchInsuredMembers()
                                                    .then(function(data){
                                                        scope.cSQ.calculatePremium();
                                                        scope.cSQ.activeCareFamilyContruct = scope.cSQ.intitalACMemberList;
                                                        scope.cSQ.activCareFamilyMapping()
                                                    });
                                            });
                                    }else{
                                        scope.cSQ.addUpdateDeleteMember('DeleteMember', addMemberData);
                                    }
                                },
                                "negativeFunction":function(){
                                    member["is"+productCode] = 'Y';
                                }
                            }
                        }else{
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Warning",
                                "modalBodyText": "After removing this member "+$filter('productFilter')(productCode)+" will also get deleted. Do you want to continue?",
                                "showCancelBtn": true,
                                "modalSuccessText": "Yes",
                                "modalCancelText": "No",
                                "showAlertModal": true,
                                "hideCloseBtn": true,
                                "positiveFunction": function() {
                                    deleteSecondaryProduct(productCode);
                                },
                                "negativeFunction":function(){
                                    member["is"+productCode] = 'Y';
                                }
                            }
                        }
                    }
                }

            /* End of deleting member of seondary quote */

        }
    };
}]);

/* End of Cross Sell Directive */