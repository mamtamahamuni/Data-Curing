/*
	Name: Add Member Directive
	Author: Pankaj Patil
	Date: 19-06-2018
*/

var app = angular.module('aCAddMemberDirective', []);

app.directive('acaddmember', ['$timeout', '$rootScope', 'appService', 'ABHI_CONFIG','productValidationService','$location', '$q' , function($timeout, $rootScope, appService, ABHI_CONFIG,productValidationService,$location , $q) {
    return {
        scope: {
            aaM: "=acaddctrl"
        },
        restrict: 'E', 
        templateUrl: "partials/activ-care-add-member.html",
        link: function(scope, element, attrs, $anchorScroll) {

            /* Function to map active care family construct */

                scope.aaM.activCareFamilyMapping = function(){
                    scope.aaM.aCSelectedMembers = [];
                    angular.forEach(scope.aaM.activeCareFamilyContruct,function(v,i){
                        for(var ind = 0;ind<scope.aaM.membersDetails.length;ind++){
                            if(v.RelationType == scope.aaM.membersDetails[ind].RelationType){
                                v.isSelected = true;
                                v.isAlreadyPresent = true
                                v.Gender = scope.aaM.membersDetails[ind].Gender;
                                v.Age = scope.aaM.membersDetails[ind].Age;
                                scope.aaM.aCSelectedMembers.push(v);
                                break;
                            }
                        }
                    });
                }

            /* End of function to map activ care family construct */

             
            /* To Fetch Family Members for active care */

                appService.postData(ABHI_CONFIG.apiUrl+"GEN/GetMaster",{
                    "Name":"getACRelation"
                },false,{
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function(data){
                        scope.aaM.activeCareFamilyContruct = data.ResponseData;
                        scope.aaM.activCareFamilyMapping();
                    },function(err){})

            /* End of fetching family members active care */


            /* To add/update/delete member */

                scope.aaM.addUpdateDeleteACMember = function(op, insuredDetail,event) {
                     var defer = $q.defer();
                    delete insuredDetail.newestAdded;
                    if(scope.aaM.planName == 'reco'){
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
                            defer.resolve(data);
                        }, function(err) {
                            defer.reject(err);
                        });
                        return defer.promise;
                }

            /* End of to add/delete member */


            /* select/unselect AC member */

                scope.aaM.checkACMember = function(member , param){
                    if(param){
                        angular.forEach(scope.aaM.activeCareFamilyContruct,function(v,i){
                            if(v.isSelected){
                                if(v.PairCode != member.PairCode){
                                    v.isSelected = false
                                    angular.forEach(scope.aaM.aCSelectedMembers , function(j , k){
                                        if(j.RelationType == v.RelationType ){
                                            v.isAlreadyPresent = false;
                                            scope.aaM.aCSelectedMembers.splice(k , 1);
                                        }
                                    })
                                }
                            }
                        })
                        if(angular.isUndefined( member.isAlreadyPresent) ){
                            member.isNewAdded = true;
                        }else if(!angular.isUndefined( member.isAlreadyPresent)){
                            member.isAlreadyPresent = true;
                        }
                        scope.aaM.aCSelectedMembers.push(member);
                    }else{
                        angular.forEach(scope.aaM.aCSelectedMembers , function(v ,i){
                            if(v.RelationType == member.RelationType){
                                scope.aaM.aCSelectedMembers.splice(i , 1);
                            }
                        })
                    }                    
                }

            /* End of select/unselect AC member */


            /* To Ac validations */

                scope.aaM.acValidations = function(event){
                    var errorMessages = "<ul>";
                    var errorMsg = true;
                    var toDeleteProducts = [];
                    if(scope.aaM.planName == 'activ-Care'){
                        for(var i = 0 ; i < scope.aaM.aCSelectedMembers.length ; i++){
                            if(scope.aaM.aCSelectedMembers[i].Age > 80 ){
                                $rootScope.alertConfiguration('E', "Age of "+scope.aaM.aCSelectedMembers[i].RelationWithProposer +" can not be greter then 80 ");
                                $rootScope.$apply();
                                return false;
                            }
                            if(angular.isUndefined(scope.aaM.aCSelectedMembers[i].Age) || scope.aaM.aCSelectedMembers[i].Age == ""){
                                $rootScope.alertConfiguration('E', "Please enter "+scope.aaM.aCSelectedMembers[i].RelationWithProposer +" Age");
                                $rootScope.$apply();
                                return false;
                            }
                            if(scope.aaM.aCSelectedMembers.length == 1 && scope.aaM.aCSelectedMembers[i].Age < 55 ){
                                    $rootScope.alertConfiguration('E', "Age of "+scope.aaM.aCSelectedMembers[i].RelationWithProposer +"should be greater than 55");
                                    $rootScope.$apply();
                                    return false;  
                            }
                            if(scope.aaM.aCSelectedMembers.length == 1 && scope.aaM.aCSelectedMembers[i].Age >= 55 ){
                                scope.aaM.activCareQuoteDetails.PolicyType = "MI" 
                            }
                            if(scope.aaM.aCSelectedMembers.length == 2 && scope.aaM.activCareQuoteDetails.PolicyType == "FF"  ){
                                if(scope.aaM.aCSelectedMembers[i].Age >= 55){
                                    errorMsg = false;
                                }
                            }
                            if(scope.aaM.activCareQuoteDetails.PolicyType == "MI" && scope.aaM.aCSelectedMembers[i].Age < 55){
                                 $rootScope.alertConfiguration('E', " Incase of Multi individual Each member should be above 55 ");
                                    $rootScope.$apply();
                                    return false; 
                            }
                            if(scope.aaM.activCareQuoteDetails.PolicyType == "MI" && scope.aaM.aCSelectedMembers[i].Age >= 55){
                                errorMsg = false;
                            }
                        }
                        if(errorMsg){
                            $rootScope.alertConfiguration('E', " At least one member should be above 55 ");
                            $rootScope.$apply();
                            return false; 
                        }
                        var totalCrossSellProducts = scope.aaM.activCarePreminumObj.ProductPremium.length - 1;
                    }
                    var deleteCounter = 0;
                    /*if(event){
                        event.target.disabled = true;
                        event.target.textContent = "Please wait.....";
                    }*/

                        $('#change-group-member').modal('hide');
                    var toAddUpdateDeleteMember = [];
                    var tempMember = angular.copy(scope.aaM.membersDetails).splice(1);
                    angular.forEach(tempMember , function(v, i) {
                        deleteCounter = 0;
                        for(var j = 0 ; j < scope.aaM.aCSelectedMembers.length ; j++ ){
                            if( v.RelationType == scope.aaM.aCSelectedMembers[j].RelationType){
                                deleteCounter++
                            }
                        }
                        if(deleteCounter == 0){
                            toAddUpdateDeleteMember.push({
                                'memberData': {
                                    "Gender": (v.RelationType == 'S' || v.RelationType == 'F' || v.RelationType == 'FIL' || v.RelationType == 'BRO' || v.RelationType == 'BIL' || v.RelationType == 'GF' || v.RelationType == 'UN') ? 1 : 0,
                                    "RelationWithProposer":v.RelationWithProposer,
                                    "RelationType":v.RelationType,
                                    "Age": v.Age,
                                    "ProductCode":"AC",
                                    "DOB":null
                                },
                                'operation': 'DeleteMember'
                            });
                        }
                    })
                    angular.forEach(scope.aaM.aCSelectedMembers,function(v,i){
                        for(var j = 0 ; j < scope.aaM.membersDetails.length ; j++){
                            if(scope.aaM.membersDetails[j].RelationType == v.RelationType && scope.aaM.membersDetails[j].Age != v.Age && v.isAlreadyPresent){
                                toAddUpdateDeleteMember.push({
                                    'memberData': {
                                        "Gender": (v.RelationType == 'S' || v.RelationType == 'F' || v.RelationType == 'FIL' || v.RelationType == 'BRO' || v.RelationType == 'BIL' || v.RelationType == 'GF' || v.RelationType == 'UN') ? 1 : 0,
                                        "RelationWithProposer":v.RelationWithProposer,
                                        "RelationType":v.RelationType,
                                        "Age": v.Age,
                                        "ProductCode":"AC",
                                        "DOB":null
                                    },
                                    'operation': 'UpdateMember'
                                });
                                break;
                            }else if(v.isNewAdded){
                                toAddUpdateDeleteMember.push({
                                    'memberData': {
                                        "Age": v.Age,
                                        "Gender":(v.RelationType == 'S' || v.RelationType == 'F' || v.RelationType == 'FIL' || v.RelationType == 'BRO' || v.RelationType == 'BIL' || v.RelationType == 'GF' || v.RelationType == 'UN') ? 1 : 0,
                                        "ProductCode":"AC",
                                        "RelationType":v.RelationType,
                                        "RelationWithProposer":v.RelationWithProposer
                                    },
                                    'operation': 'AddMember'
                                });
                                break;
                            }
                        }
                    });
                    if(totalCrossSellProducts != 0){
                        if(scope.aaM.PA == 'Y'){
                            var isSelfPresent = false;
                            for(var p = 0;p<scope.aaM.aCSelectedMembers.length;p++){
                                if(scope.aaM.aCSelectedMembers[p].RelationType == 'S'){
                                    isSelfPresent = true;
                                    break;
                                }
                            }
                            if(!isSelfPresent){
                                toDeleteProducts.push('PA');
                            }   
                        }
                        if(scope.aaM.CI == 'Y'){
                            var ciPrevMemberCount = 0;
                            for(var p = 0; p < scope.aaM.aCSelectedMembers.length; p++){
                                for(var j = 0; j < scope.aaM.CIMembers.length; j++){
                                    if(scope.aaM.CIMembers[j].RelationType == scope.aaM.aCSelectedMembers[p].RelationType){
                                        ciPrevMemberCount = ciPrevMemberCount + 1;
                                    }
                                }
                            }
                            if(ciPrevMemberCount == 0){
                                toDeleteProducts.push('CI');
                            }
                        }
                        if(scope.aaM.CS == 'Y'){
                            var csPrevMemberCount = 0;
                            for(var p = 0; p < scope.aaM.aCSelectedMembers.length; p++){
                                for(var j = 0; j < scope.aaM.CSMembers.length; j++){
                                    if(scope.aaM.CSMembers[j].RelationType == scope.aaM.aCSelectedMembers[p].RelationType){
                                        csPrevMemberCount = csPrevMemberCount + 1;
                                    }
                                }
                            }
                            if(csPrevMemberCount == 0){
                                toDeleteProducts.push('CS');
                            }
                        }
                    }

                    /* Function to add/update/delete member sequence handling */

                        function addUpdateDeleteSequence(){
                            var totalOpCount = toAddUpdateDeleteMember.length;
                            var messageBodyText = "<ul>";
                            angular.forEach(toAddUpdateDeleteMember,function(v,i){
                                scope.aaM.addUpdateDeleteACMember(v.operation, v.memberData,event)
                                    .then(function(apiResponse){
                                        if(apiResponse.ResponseCode == 1){
                                            if(v.operation == 'AddMember'){
                                                messageBodyText = messageBodyText + "<li>"+v.memberData.RelationWithProposer+" is added successfully.</li>";
                                            }else if(v.operation == 'UpdateMember'){
                                                messageBodyText = messageBodyText + "<li> Age of "+v.memberData.RelationWithProposer+" is updated successfully.</li>";
                                            }else if(v.operation == 'DeleteMember'){
                                               /* angular.forEach(scope.aaM.activeCareFamilyContruct , function(j ,k ){
                                                    if(j.RelationWithProposer.toLowerCase() == v.memberData.RelationWithProposer.toLowerCase()){
                                                            j.Age = ""
                                                    }
                                                })*/
                                                messageBodyText = messageBodyText + "<li>"+v.memberData.RelationWithProposer+" is deleted successfully.</li>";
                                            }
                                            totalOpCount = totalOpCount - 1;
                                            if(totalOpCount == 0){
                                                if(scope.aaM.planName == "activ-Care"){
                                                    scope.aaM.fetchInsuredMembers()
                                                        .then(function(data){
                                                            angular.forEach(toAddUpdateDeleteMember,function(val,ind){
                                                                if(val.operation == 'AddMember'){
                                                                    scope.aaM.selectedMember.push({
                                                                        "AHC": "N",
                                                                        "Age": val.memberData.Age,
                                                                        "Gender": val.memberData.Gender,
                                                                        "LSE": "N",
                                                                        "ARU": "N",
                                                                        "PPN": "N",
                                                                        "PME": "N",
                                                                        "QNH": "N",
                                                                        "RelationType": val.memberData.RelationType,
                                                                        "RelationWithProposer": val.memberData.RelationWithProposer,
                                                                        "SumInsured" : scope.aaM.sumInusred
                                                                    })
                                                                }
                                                                for(var sAS = 0; sAS < scope.aaM.selectedMember.length;sAS++){
                                                                    if(val.memberData.RelationType == scope.aaM.selectedMember[sAS].RelationType){
                                                                        if(val.operation == 'DeleteMember'){
                                                                            scope.aaM.selectedMember.splice(sAS,1);
                                                                        }else if(val.operation == 'UpdateMember'){
                                                                              scope.aaM.selectedMember[sAS].Age = val.memberData.Age;
                                                                        }
                                                                        break;
                                                                    }
                                                                }
                                                            })
                                                            messageBodyText = messageBodyText+"</ul>";
                                                            $('#change-group-member').modal('hide');
                                                            if(event != null){
                                                                event.target.disabled = false;
                                                                event.target.textContent = "Save";
                                                            }
                                                            $rootScope.alertConfiguration('S',messageBodyText);
                                                            scope.aaM.calculatePremium();
                                                            scope.aaM.activeCareFamilyContruct = scope.aaM.intitalACMemberList;
                                                            scope.aaM.activCareFamilyMapping()
                                                        });
                                                }else{
                                                    scope.aaM.fetchInsuredMembers()
                                                        .then(function(data){
                                                            scope.aaM.fetchRecoProducts();
                                                            scope.aaM.activCareFamilyMapping();
                                                            sessionStorage.removeItem('pName');
                                                            messageBodyText = messageBodyText+"</ul>";
                                                            $('#change-group-member').modal('hide');
                                                            if(event != null){
                                                                event.target.disabled = false;
                                                                event.target.textContent = "Save";
                                                            }
                                                        },function(err){

                                                        });
                                                }
                                            }
                                        }else{
                                            $rootScope.alertData = {
                                                "modalClass": "regular-alert",
                                                "modalHeader": "Alert",
                                                "modalBodyText": apiResponse.ResponseMessage,
                                                "showCancelBtn": false,
                                                "modalSuccessText": "Ok",
                                                "showAlertModal": true,
                                                "hideCloseBtn": true,
                                            }
                                            return false;
                                        }
                                    })
                            });
                        }

                    /* End of function to add/update/delete member sequece handling */

                    if(toDeleteProducts.length == 0){
                        addUpdateDeleteSequence();
                    }else{
                        var productCnt = toDeleteProducts.length;
                        for(var td = 0; td < toDeleteProducts.length;td++){
                            scope.aaM.deleteSecondaryProductACM(toDeleteProducts[td])
                                .then(function(data){
                                    if(data.ResponseCode == 1){
                                        productCnt = productCnt - 1;
                                        if(productCnt == 0){
                                            addUpdateDeleteSequence();
                                        }
                                    }else{
                                        $rootScope.alertData = {
                                            "modalClass": "regular-alert",
                                            "modalHeader": "Alert",
                                            "modalBodyText": data.ResponseMessage,
                                            "showCancelBtn": false,
                                            "modalSuccessText": "Ok",
                                            "showAlertModal": true,
                                            "hideCloseBtn": true,
                                        }
                                    }
                                });
                        }
                    }
                }

            /* End of AC validations */


            /* To delete secondary product */

                scope.aaM.deleteSecondaryProductACM = function(ProductCode){
                    var defer = $q.defer();
                    appService.postData(ABHI_CONFIG.apiUrl + "GEN/DeleteProduct", {
                        "ReferenceNumber":sessionStorage.getItem('rid'),
                        "ProductCode": ProductCode
                    }, true, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function(data) {
                            scope.aaM[ProductCode] = "N";
                            defer.resolve(data);
                        },function(err){
                            defer.reject(err);
                        });
                        return defer.promise;
                }

            /* End of deleting secondary product */


            /* Close the Active Care Model */

                scope.aaM.closeACModel =  function(){
                    scope.aaM.activeCareFamilyContruct = scope.aaM.intitalACMemberList;
                    angular.forEach(scope.aaM.activeCareFamilyContruct,function(v,i){
                        for(var ind = 0;ind<scope.aaM.membersDetails.length;ind++){
                            if(v.RelationType == scope.aaM.membersDetails[ind].RelationType){
                                v.isSelected = true;
                                v.isAlreadyPresent = true
                                v.Gender = scope.aaM.membersDetails[ind].Gender;
                                v.Age = scope.aaM.membersDetails[ind].Age;
                                scope.aaM.aCSelectedMembers.push(v);
                                break;
                            }
                            else{
                                v.isSelected = false;
                                v.Age ="";
                            }
                        }
                    });
                    $('#change-group-member').modal('hide');
                }

            /* Close the Active Care Model Ends */

        }
    };
}]);

/* End of Add Member Directive */