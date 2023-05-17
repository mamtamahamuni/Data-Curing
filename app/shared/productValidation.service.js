// Source: productValidation.service.js
/* 
	
	Module :- Product Validation Service
	Author: Pankaj Patil
	Date: 30-07-2018	

*/

app.service('productValidationService',['$http',function($http){

	var pVS = this;
	pVS.errorFlag;

	/* To verify Age */

		function verifyAge(member,members,returnObj){
			angular.forEach(members,function(v,i){
				if(v.RelationWithProposer != member.RelationWithProposer){
					if(member.RelationWithProposer == "SELF" && (v.RelationWithProposer == 'FATHER' || v.RelationWithProposer == 'MOTHER' || v.RelationWithProposer == 'FATHER-IN-LAW' || v.RelationWithProposer == 'MOTHER-IN-LAW' || v.RelationWithProposer == 'GRANDFATHER' || v.RelationWithProposer == 'GRANDMOTHER') && member.Age >= v.Age){
						returnObj.allErrors.push({
							RelationType: member.RelationType,
							RelationWithProposer: member.RelationWithProposer,
							message: "SELF age cannot be greater than "+v.RelationWithProposer
						});
						pVS.errorFlag = true;
					}
					if(member.RelationWithProposer == "SPOUSE" && (v.RelationWithProposer == 'FATHER' || v.RelationWithProposer == 'MOTHER' || v.RelationWithProposer == 'FATHER-IN-LAW' || v.RelationWithProposer == 'MOTHER-IN-LAW' || v.RelationWithProposer == 'GRANDFATHER' || v.RelationWithProposer == 'GRANDMOTHER') && member.Age >= v.Age){
						returnObj.allErrors.push({
							RelationType: member.RelationType,
							RelationWithProposer: member.RelationWithProposer,
							message: "SPOUSE age cannot be greater than "+v.RelationWithProposer
						});
						pVS.errorFlag = true;
					}
					if((member.RelationWithProposer == 'FATHER' || member.RelationWithProposer == 'MOTHER' || member.RelationWithProposer == 'FATHER-IN-LAW' || member.RelationWithProposer == 'MOTHER-IN-LAW' || member.RelationWithProposer == 'GRANDFATHER' || member.RelationWithProposer == 'GRANDMOTHER') && (v.RelationWithProposer == 'SELF' || v.RelationWithProposer == 'SPOUSE') && member.Age <= v.Age){
						returnObj.allErrors.push({
							RelationType: member.RelationType,
							RelationWithProposer: member.RelationWithProposer,
							message: member.RelationWithProposer+" age cannot be less than "+v.RelationWithProposer
						});
						pVS.errorFlag = true;
					}
					if((member.RelationWithProposer == "KID" || member.RelationWithProposer == "GRANDSON" || member.RelationWithProposer == "GRANDDAUGHTER" || member.RelationWithProposer == "SON-IN-LAW" || member.RelationWithProposer == "DAUGHTER-IN-LAW" || member.RelationWithProposer == "NEPHEW" || member.RelationWithProposer == "NIECE" ) && (v.RelationWithProposer == 'SELF' || v.RelationWithProposer == 'SPOUSE') && member.Age >= v.Age){
						returnObj.allErrors.push({
							RelationType: member.RelationType,
							RelationWithProposer: member.RelationWithProposer,
							message: member.RelationWithProposer+" age cannot be greater than "+v.RelationWithProposer
						});
						pVS.errorFlag = true;
					}
				}
			})
		}

	/* End of verifying age */

	/* To Verify Parent & Parent-In-Law Present */	
	function verifyParentAndPInLawPresent(membersObjWithoutProposer,selectedMember,policyType,returnObj){
		var lastMember = membersObjWithoutProposer[membersObjWithoutProposer.length - 1];
		var invlidMember = false;
		for(var i=0; i < membersObjWithoutProposer.length-1; i++){
			
			if ( (lastMember.RelationType == 'F' || lastMember.RelationType == 'M') && (membersObjWithoutProposer[i].RelationType == 'FIL' || membersObjWithoutProposer[i].RelationType == 'MIL') && !invlidMember){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: lastMember.RelationType,
					RelationWithProposer: lastMember.RelationWithProposer,
					message: "Invalid family construct. Parents & Parents-In-Laws not allowed together for Arogya Sanjeevani Product with Family Floater policy type."
				});
				invlidMember = true;
			}
			else if ( (lastMember.RelationType == 'FIL' || lastMember.RelationType == 'MIL') && (membersObjWithoutProposer[i].RelationType == 'F' || membersObjWithoutProposer[i].RelationType == 'M') && !invlidMember){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: lastMember.RelationType,
					RelationWithProposer: lastMember.RelationWithProposer,
					message: "Invalid family construct. Parents & Parents-In-Laws not allowed together for Arogya Sanjeevani Product with Family Floater policy type."
				});
				invlidMember = true;
			}
			if(!angular.isUndefined(selectedMember) && !pVS.errorFlag){
				returnObj.selectedMemberError = "N";
			}
			else if(!angular.isUndefined(selectedMember) && pVS.errorFlag){
				returnObj.selectedMemberError = "Y";
			}
		}
	}
	/* End of To Verify Parent & Parent-In-Law Present */


	/* Platinum Validations */

		pVS.platinumValidations = function(memberObj,selectedMember ,policyType){
			var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
			var returnObj = {
				allErrors: [],
				isSelfPresent: false,
				childExcceedLimit: false,
				isProductElligible: true,
				elligibleMembers: [],
				notElligibleMembers: [],
				invalidConstruct: true,
				selectedMemberError: 'Y',
				individualSelectionError: false
			}
			var childCount = 0;
			var planName = angular.isUndefined(sessionStorage.getItem('plPlan')) ? '' : sessionStorage.getItem('plPlan')
			var maxAge  = (planName != 'Premier') ? 150 : 65;
			var minAge =  (planName == 'Essential') ? 55 : 18;
			angular.forEach(membersObjWithoutProposer,function(v,i){
				pVS.errorFlag = false;
				if(v.RelationWithProposer == "SELF"){
					returnObj.isSelfPresent = true;
				}
				if(v.Age > maxAge ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be greater than "+maxAge
					});
				}
				if(v.RelationWithProposer != 'KID' && v.Age < minAge){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be less than "+minAge
					});
				}
				if(v.RelationWithProposer == "KID"){
					if(v.Age > 25 && policyType == 'FF'){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be greater than 25"
						});
					}else if( v.noOfDays <= 91 && policyType == 'FF'  ){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be less than 91 days in case of Family Floater policy type"
						});
					}else if((v.Age <= 4 || v.Age > 25) && policyType == 'MI'){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should be greater than 5 and less than 25 in multi-individual policy type"
						});
					}else{
						childCount++;
						verifyAge(v,membersObjWithoutProposer,returnObj);
					}
				}
				if(v.RelationWithProposer != "KID"){
					verifyAge(v,membersObjWithoutProposer,returnObj);
				}
				if(v.RelationWithProposer != "SELF" && v.RelationWithProposer != "SPOUSE" && v.RelationWithProposer != "KID" && v.RelationWithProposer != "FATHER" && v.RelationWithProposer != "MOTHER" && v.RelationWithProposer != "FATHER-IN-LAW" && v.RelationWithProposer != "MOTHER-IN-LAW" && v.RelationWithProposer != "BROTHER" && v.RelationWithProposer != "SISTER" && v.RelationWithProposer != "GRANDFATHER" && v.RelationWithProposer != "GRANDMOTHER" && v.RelationWithProposer != "GRANDSON" && v.RelationWithProposer != "GRANDDAUGHTER" && v.RelationWithProposer != "SON-IN-LAW" && v.RelationWithProposer != "DAUGHTER-IN-LAW" && v.RelationWithProposer != "BROTHER-IN-LAW" && v.RelationWithProposer != "SISTER-IN-LAW" && v.RelationWithProposer != "NEPHEW" && v.RelationWithProposer != "NIECE" ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" is not covered for platinum product"
					});
				}
				if( (v.RelationWithProposer == "FATHER" || v.RelationWithProposer == "MOTHER" || v.RelationWithProposer == "FATHER-IN-LAW" || v.RelationWithProposer == "MOTHER-IN-LAW" || v.RelationWithProposer == "BROTHER" || v.RelationWithProposer == "SISTER" || v.RelationWithProposer == "GRANDFATHER" || v.RelationWithProposer == "GRANDMOTHER" || v.RelationWithProposer == "GRANDSON" || v.RelationWithProposer == "GRANDDAUGHTER" || v.RelationWithProposer == "SON-IN-LAW" || v.RelationWithProposer == "DAUGHTER-IN-LAW" || v.RelationWithProposer == "BROTHER-IN-LAW" || v.RelationWithProposer == "SISTER-IN-LAW" || v.RelationWithProposer == "NEPHEW" || v.RelationWithProposer == "NIECE") && policyType == 'FF' ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" is not allowed for Platinum Product with Family Floater policy type"
					});
				}
				if(pVS.errorFlag){
					returnObj.isProductElligible = false;
					returnObj.notElligibleMembers.push(v);
				}else{
					returnObj.elligibleMembers.push(v.RelationType);
				}				
				if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
					returnObj.selectedMemberError = "N";
				}
			});

			var familyConstruct = new String();
			var isProductProper = false;
			for(var i = 0; i<returnObj.elligibleMembers.length;i++){
				var member = returnObj.elligibleMembers[i];
				familyConstruct = familyConstruct + member;
				if(member == "S" || member == "SPO"){
					isProductProper = true;
					returnObj.invalidConstruct = false;
				}
			}

			if(familyConstruct == "FM" || familyConstruct == "FILMIL"){
				isProductProper = true;
				returnObj.invalidConstruct = false;
			}

			/*if(!isProductProper){
				returnObj.invalidConstruct = true;
				returnObj.isProductElligible = false;
				returnObj.individualSelectionError = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "This combination of family construct does not exist. Please select proper family construct."
				});
			}*/

			/*if(returnObj.elligibleMembers.length == 1 && !returnObj.isSelfPresent){
				returnObj.invalidConstruct = true;
				returnObj.isProductElligible = false;
				returnObj.individualSelectionError = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "Individual Family Construct exists only for Self."
				});
			}*/

			if(childCount > 3){
				returnObj.childExcceedLimit = true;
				returnObj.isProductElligible = false;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "Maximum 3 kids are allowed"
				});
			}

			return returnObj;
		}	

	/* End of platinum validations */


	/* Diamond Validations */

		pVS.diamondValidations = function(memberObj,selectedMember , policyType){
			var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
			var returnObj = {
				allErrors: [],
				isSelfPresent: false,
				childExcceedLimit: false,
				isProductElligible: true,
				elligibleMembers: [],
				notElligibleMembers: [],
				invalidConstruct: false,
				selectedMemberError: 'Y',
				individualSelectionError: false
			}
			var childCount = 0;
			var maxAge = 99;

			if(membersObjWithoutProposer.length > 6 ){

				returnObj.invalidConstruct = true;
				returnObj.isProductElligible = false;
				returnObj.individualSelectionError = true;
				returnObj.allErrors.push({
					RelationType: membersObjWithoutProposer[membersObjWithoutProposer.length -1].RelationType,
					RelationWithProposer: "ProductRelated",
					message: "Max 6 members are only allowed"
				});
				return returnObj
				
			}
			angular.forEach(membersObjWithoutProposer,function(v,i){
				pVS.errorFlag = false;
				if(v.RelationWithProposer == "SELF"){
					returnObj.isSelfPresent = true;
				}
				

				if(v.Age > maxAge ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be greater than "+maxAge
					});
				}

				if((v.RelationWithProposer == "SELF" || v.RelationWithProposer == "SPOUSE") && v.Age < 18){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be less than 18"
					});
				}

				/*if(v.RelationWithProposer != "SELF" && v.RelationWithProposer != "SPOUSE" && v.RelationWithProposer != "KID"){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" is not covered for diamond product"
					});
				}*/

				if( (v.RelationWithProposer == "FATHER" || v.RelationWithProposer == "MOTHER" || v.RelationWithProposer == "FATHER-IN-LAW" || v.RelationWithProposer == "MOTHER-IN-LAW" || v.RelationWithProposer == "BROTHER" || v.RelationWithProposer == "SISTER" || v.RelationWithProposer == "GRANDFATHER" || v.RelationWithProposer == "GRANDMOTHER" || v.RelationWithProposer == "GRANDSON" || v.RelationWithProposer == "GRANDDAUGHTER" || v.RelationWithProposer == "SON-IN-LAW" || v.RelationWithProposer == "DAUGHTER-IN-LAW" || v.RelationWithProposer == "BROTHER-IN-LAW" || v.RelationWithProposer == "SISTER-IN-LAW" || v.RelationWithProposer == "NEPHEW" || v.RelationWithProposer == "NIECE") && policyType == 'FF' ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" is not allowed for Diamond Product with Family Floater policy type"
					});
				}

				if(v.RelationWithProposer == "KID"){
					if( (v.Age > 25 || v.Age < 5) && policyType == 'MI'  ){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be less than 5 in case of multi-individual"
						});
					}else if(v.Age > 25 && policyType == 'FF'){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be greater than 25 in case of Family Floater policy type"
						});
					}else{
						childCount++;
						verifyAge(v,membersObjWithoutProposer,returnObj);
					}
				}
				if(v.RelationWithProposer != "KID"){
					verifyAge(v,membersObjWithoutProposer,returnObj);
				}
				
				if(pVS.errorFlag){
					returnObj.isProductElligible = false;
					returnObj.notElligibleMembers.push(v);
				}else{
					returnObj.elligibleMembers.push(v.RelationType);
				}
				if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
					returnObj.selectedMemberError = "N";
				}

			});
			
			if(childCount > 4){
				returnObj.childExcceedLimit = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "Maximum 3 kids are allowed"
				});
			}

			if(!returnObj.isSelfPresent && policyType == 'FF'){
				returnObj.invalidConstruct = true;
				returnObj.isProductElligible = false;
				returnObj.individualSelectionError = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "Individual Family Construct exists only for Self."
				});
			}

			return returnObj;
		}	

	/* End of Diamond validations */

	
	/*  ST Validations */

	pVS.STValidations = function(memberObj,selectedMember , policyType){
		var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
		var returnObj = {
			allErrors: [],
			isSelfPresent: false,
			childExcceedLimit: false,
			isProductElligible: true,
			elligibleMembers: [],
			notElligibleMembers: [],
			invalidConstruct: false,
			selectedMemberError: 'Y',
			individualSelectionError: false
		}
		var childCount = 0;
		var maxAge = 65;
		var minAge = 5;

		if(membersObjWithoutProposer.length > 6 ){

			returnObj.invalidConstruct = true;
			returnObj.isProductElligible = false;
			returnObj.individualSelectionError = true;
			returnObj.allErrors.push({
				RelationType: membersObjWithoutProposer[membersObjWithoutProposer.length -1].RelationType,
				RelationWithProposer: "ProductRelated",
				message: "Max 6 members are only allowed"
			});
			return returnObj
			
		}
		angular.forEach(membersObjWithoutProposer,function(v,i){
			pVS.errorFlag = false;
			if(v.RelationWithProposer == "SELF"){
				returnObj.isSelfPresent = true;
			}
			

			if(v.Age > maxAge ){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: "Age of "+v.RelationWithProposer+" should not be greater than "+maxAge+ " years"
				});
			}

			if(v.Age < minAge && policyType == 'MI'){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: "Age of "+v.RelationWithProposer+" should not be less than "+minAge+ " years"
				});
			}

			if((v.RelationWithProposer == "SELF" || v.RelationWithProposer == "SPOUSE") && v.Age < 18){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: "Age of "+v.RelationWithProposer+" should not be less than 18 years"
				});
			}

			/*if(v.RelationWithProposer != "SELF" && v.RelationWithProposer != "SPOUSE" && v.RelationWithProposer != "KID"){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: v.RelationWithProposer+" is not covered for diamond product"
				});
			}*/

			if( (v.RelationWithProposer == "FATHER" || v.RelationWithProposer == "MOTHER" || v.RelationWithProposer == "FATHER-IN-LAW" || v.RelationWithProposer == "MOTHER-IN-LAW" || v.RelationWithProposer == "BROTHER" || v.RelationWithProposer == "SISTER" || v.RelationWithProposer == "GRANDFATHER" || v.RelationWithProposer == "GRANDMOTHER" || v.RelationWithProposer == "GRANDSON" || v.RelationWithProposer == "GRANDDAUGHTER" || v.RelationWithProposer == "SON-IN-LAW" || v.RelationWithProposer == "DAUGHTER-IN-LAW" || v.RelationWithProposer == "BROTHER-IN-LAW" || v.RelationWithProposer == "SISTER-IN-LAW" || v.RelationWithProposer == "NEPHEW" || v.RelationWithProposer == "NIECE") && policyType == 'FF' ){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: v.RelationWithProposer+" is not allowed for Diamond Product with Family Floater policy type"
				});
			}

			if(v.RelationWithProposer == "KID"){
				if( ( v.Age < 5) && policyType == 'MI'  ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationType+" should not be less than 5 years in case of multi-individual"
					});
				}else if(v.Age > 25 && policyType == 'FF'  ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationType+" should not be greater than 25 years in case of Family Floater policy type"
					});
				}else if( v.noOfDays <= 91 && policyType == 'FF'  ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationType+" should not be less than 91 days in case of Family Floater policy type"
					});
				}else{
					childCount++;
					verifyAge(v,membersObjWithoutProposer,returnObj);
				}
			}
			if(v.RelationWithProposer != "KID"){
				verifyAge(v,membersObjWithoutProposer,returnObj);
			}

			if(pVS.errorFlag){
				returnObj.isProductElligible = false;
				returnObj.notElligibleMembers.push(v);
			}else{
				returnObj.elligibleMembers.push(v.RelationType);
			}
			if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
				returnObj.selectedMemberError = "N";
			}

		});
		
		if(childCount > 4){
			returnObj.childExcceedLimit = true;
			returnObj.allErrors.push({
				RelationType: '',
				RelationWithProposer: "ProductRelated",
				message: "Maximum 3 kids are allowed"
			});
		}

		if(!returnObj.isSelfPresent && policyType == 'FF'){
			returnObj.invalidConstruct = true;
			returnObj.isProductElligible = false;
			returnObj.individualSelectionError = true;
			returnObj.allErrors.push({
				RelationType: '',
				RelationWithProposer: "ProductRelated",
				message: "Individual Family Construct exists only for Self."
			});
		}

		return returnObj;
	}	

	/*  ST Validations */


		/* Diamond + ST Validations */

		pVS.diamondSTValidations = function(memberObj,selectedMember){
			var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
			var returnObj = {
				allErrors: [],
				isSelfPresent: false,
				childExcceedLimit: false,
				isProductElligible: true,
				elligibleMembers: [],
				notElligibleMembers: [],
				invalidConstruct: false,
				selectedMemberError: 'Y',
				individualSelectionError: false
			}
			var childCount = 0;
			angular.forEach(membersObjWithoutProposer,function(v,i){
				pVS.errorFlag = false;
				if(v.RelationWithProposer == "SELF"){
					returnObj.isSelfPresent = true;
				}
				if((v.RelationWithProposer == "SELF" || v.RelationWithProposer == "SPOUSE" || v.RelationWithProposer == "KID") && v.Age > 65){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be greater than 65"
					});
				}

				if((v.RelationWithProposer == "SELF" || v.RelationWithProposer == "SPOUSE") && v.Age < 18){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be less than 18"
					});
				}

				if(v.RelationWithProposer != "SELF" && v.RelationWithProposer != "SPOUSE" && v.RelationWithProposer != "KID"){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" is not covered for diamond product"
					});
				}

				if(v.RelationWithProposer == "KID"){
					if(v.Age > 25){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be greater than 25"
						});
					}
					else{
						childCount++;
						verifyAge(v,membersObjWithoutProposer,returnObj);
					}
				}
				
				if(pVS.errorFlag){
					returnObj.isProductElligible = false;
					returnObj.notElligibleMembers.push(v);
				}else{
					returnObj.elligibleMembers.push(v.RelationType);
				}
				if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
					returnObj.selectedMemberError = "N";
				}

			});
			
			if(childCount > 4){
				returnObj.childExcceedLimit = true;
				returnObj.isProductElligible = false;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "Maximum 4 kids are allowed"
				});
			}

			if(returnObj.elligibleMembers.length == 1 && !returnObj.isSelfPresent){
				returnObj.invalidConstruct = true;
				returnObj.isProductElligible = false;
				returnObj.individualSelectionError = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "Individual Family Construct exists only for Self."
				});
			}

			return returnObj;
		}	

	/* End of Diamond + ST validations */


	/* RFB Validations */

		pVS.rFBValidations = function(memberObj,ageLimit,productCode,selectedMember){
			var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
			var returnObj = {
				allErrors: [],
				isSelfPresent: false,
				childExcceedLimit: false,
				isProductElligible: true,
				elligibleMembers : [],
				notElligibleMembers : [],
				invalidConstruct: true,
				selectedMemberError: 'Y',
				individualSelectionError: false
			}
			var childCount = 0;
			angular.forEach(membersObjWithoutProposer,function(v,i){
				pVS.errorFlag = false;
				if(v.RelationWithProposer == "SELF"){
					returnObj.isSelfPresent = true;
				}
				if(v.Age > 65){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be greater than 65"
					});
				}
				if(v.RelationWithProposer != 'KID' && v.Age < 18){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be less than 18"
					});
				}
				if(v.RelationWithProposer == "KID"){
					childCount++;
					if(v.Age < ageLimit){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be less than "+ageLimit
						});
					}
				}
				
					verifyAge(v,membersObjWithoutProposer,returnObj);
				
				if(pVS.errorFlag){
					returnObj.isProductElligible = false;
					returnObj.notElligibleMembers.push(v);
				}else{
					returnObj.elligibleMembers.push(v.RelationType);
				}
				if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
					returnObj.selectedMemberError = "N";
				}
			});
			if(childCount > 4){
				returnObj.childExcceedLimit = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: 'ProductRelated',
					message: "Maximum 4 kids are allowed"
				});
			}
			for(var i = 0; i<returnObj.elligibleMembers.length;i++){
				var member = returnObj.elligibleMembers[i];
				if(member == 'S' || member == 'SPO' || member == 'F' || member == 'M' || member == 'FIL' || member == 'MIL'){
					returnObj.invalidConstruct = false;
				}
			}
			if(productCode == 'PA' && !returnObj.isSelfPresent){
				returnObj.isPANotElligible = true;
				returnObj.isProductElligible = false;
				returnObj.invalidConstruct = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: 'ProductRelated',
					message: "Self is Mandatory for PA"
				});
			}
			return returnObj;
		}	

	/* End of RFB validations */

	/* Corona Kavach Validations */

		pVS.cKValidations = function(memberObj,ageLimit,productCode,selectedMember , policyType){
			var membersObjWithoutProposer = memberObj;
			var returnObj = {
				allErrors: [],
				isSelfPresent: false,
				childExcceedLimit: false,
				isProductElligible: true,
				elligibleMembers : [],
				notElligibleMembers : [],
				invalidConstruct: true,
				selectedMemberError: 'Y',
				individualSelectionError: false
			}
			var childCount = 0;
			angular.forEach(membersObjWithoutProposer,function(v,i){
				pVS.errorFlag = false;
				if(v.RelationWithProposer == "SELF"){
					returnObj.isSelfPresent = true;
				}
				if(v.Age > 65){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be greater than 65"
					});
				}
				if(v.RelationWithProposer != 'KID' && v.Age < 18){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be less than 18"
					});
				}
				if(v.RelationWithProposer == "KID"){
					/*childCount++;*/
					if(v.Age < 5 && policyType == 'MI') {
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be less than 5 in case of multi-individual"
						});
					}
					if(v.Age > 25){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be greater than 25"
						});
					}else{
						childCount++;
						verifyAge(v,membersObjWithoutProposer,returnObj);
					}
				}
				if(v.RelationWithProposer != "KID"){
					verifyAge(v,membersObjWithoutProposer,returnObj);
				}
				if(pVS.errorFlag){
					returnObj.isProductElligible = false;
					returnObj.notElligibleMembers.push(v);
				}else{
					returnObj.elligibleMembers.push(v.RelationType);
				}
				if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
					returnObj.selectedMemberError = "N";
				}
			});
			if(childCount > 4){
				returnObj.childExcceedLimit = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: 'ProductRelated',
					message: "Maximum 4 kids are allowed"
				});
			}
			for(var i = 0; i<returnObj.elligibleMembers.length;i++){
				var member = returnObj.elligibleMembers[i];
				if(member == 'S' || member == 'SPO' || member == 'F' || member == 'M' || member == 'FIL' || member == 'MIL'){
					returnObj.invalidConstruct = false;
				}
			}
			if(productCode == 'PA' && !returnObj.isSelfPresent){
				returnObj.isPANotElligible = true;
				returnObj.isProductElligible = false;
				returnObj.invalidConstruct = true;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: 'ProductRelated',
					message: "Self is Mandatory for PA"
				});
			}
			return returnObj;
		}	

	/* End of Corona Kavach validations */

	/* Arogya Sanjeevani validations */

	pVS.arogyaSanjeevaniValidations = function(memberObj,ageLimit,productCode,selectedMember,policyType){
		
		var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
		
		var returnObj = {
			allErrors: [],
			isSelfPresent: false,
			childExcceedLimit: false,
			isProductElligible: true,
			elligibleMembers : [],
			notElligibleMembers : [],
			invalidConstruct: true,
			selectedMemberError: 'Y',
			individualSelectionError: false
		}

		var childCount = 0;
		angular.forEach(membersObjWithoutProposer,function(v,i){
			pVS.errorFlag = false;
			if(v.RelationWithProposer == "SELF"){
				returnObj.isSelfPresent = true;
			}
			if(v.Age > 65){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: "Age of "+v.RelationWithProposer+" should not be greater than 65"
				});
			}
			if(v.RelationWithProposer != 'KID' && v.Age < 18){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: "Age of "+v.RelationWithProposer+" should not be less than 18"
				});
			}
			if(v.RelationWithProposer == "KID"){

				if(v.Age > 25){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationType+" should not be greater than 25"
					});
				}else{
					childCount++;
					verifyAge(v,membersObjWithoutProposer,returnObj);
				}
			}
			/*
			if( (v.RelationWithProposer == "FATHER" || v.RelationWithProposer == "MOTHER" || v.RelationWithProposer == "FATHER-IN-LAW" || v.RelationWithProposer == "MOTHER-IN-LAW") && policyType == 'FF' ){
				pVS.errorFlag = true;
				returnObj.allErrors.push({
					RelationType: v.RelationType,
					RelationWithProposer: v.RelationWithProposer,
					message: v.RelationWithProposer+" is not allowed for Arogya Sanjeevani Product with Family Floater policy type"
				});
			} 
			*/
			if(v.RelationWithProposer != "KID"){
				verifyAge(v,membersObjWithoutProposer,returnObj);
			}
			
			if(pVS.errorFlag){
				returnObj.isProductElligible = false;
				returnObj.notElligibleMembers.push(v);
			}else{
				returnObj.elligibleMembers.push(v.RelationType);
			}
			if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
				returnObj.selectedMemberError = "N";
			}
		});

		if(childCount > 4){
			returnObj.childExcceedLimit = true;
			returnObj.allErrors.push({
				RelationType: '',
				RelationWithProposer: 'ProductRelated',
				message: "Maximum 4 kids are allowed"
			});
		}

		if((selectedMember == 'F' || selectedMember == 'M' || selectedMember == 'FIL' || selectedMember == 'MIL') && policyType == 'FF'){
			verifyParentAndPInLawPresent(membersObjWithoutProposer,selectedMember,policyType,returnObj);
		}

		for(var i = 0; i<returnObj.elligibleMembers.length;i++){
			var member = returnObj.elligibleMembers[i];
			if(member == 'S' || member == 'SPO' || member == 'F' || member == 'M' || member == 'FIL' || member == 'MIL'){
				returnObj.invalidConstruct = false;
			}
		}
		
		return returnObj;
	}	

	/* End of Arogya Sanjeevani validations */
	
	/* Active care Validations */

		pVS.activCareValidations = function(memberObj,relationType){
			var proposerAge = angular.copy(memberObj[0].Age);
			var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
			var returnObj = {
				allErrors: [],
				isSelfPresent: false,
				childExcceedLimit: false,
				isProductElligible: true,
				elligibleMembers : [],
				notElligibleMembers : [],
				invalidConstruct: true,
				selectedMemberError: 'Y',
				individualSelectionError: false
			}
			var memberRelation = "";
			var validAgeFlag = false;
			angular.forEach(membersObjWithoutProposer,function(v,i){
				if(v.RelationWithProposer == 'SELF'){
					proposerAge = v.Age;
					returnObj.isSelfPresent = true;
				}
				memberRelation = memberRelation + v.RelationWithProposer.toLowerCase();
				if(parseInt(v.Age) < 55){
					if(membersObjWithoutProposer.length < 2){
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationWithProposer+" should not be less than 55"
						});
					}
				}else{
					validAgeFlag = true;
				}
				if(parseInt(v.Age) > 80){
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be greater than 80"
					});
				}
				if((v.RelationType == 'F' || v.RelationType == 'M' || v.RelationType == 'FIL' || v.RelationType == 'MIL' || v.RelationType == 'GF' || v.RelationType == 'GM') && v.Age < proposerAge ){
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" age cannot be less than Proposer/Self"
					});
					pVS.errorFlag = true;

				}
			});
			if(!(memberRelation == "selfspouse" || memberRelation == "fathermother" || memberRelation == "father-in-lawmother-in-law" || memberRelation == "brothersister-in-law" || memberRelation == "sisterbrother-in-law" || memberRelation == "grandfathergrandmother" || memberRelation == "uncleaunt" || memberRelation == "sondaughter-in-law" || memberRelation == "daughterson-in-law" || memberRelation == "nephewniece-in-law" || memberRelation == "niecenephew-in-law" || memberRelation == "grandsongranddaughter-in-law" || memberRelation == "granddaughtergrandson-in-law" || memberRelation == "spouseself" || memberRelation == "motherfather" || memberRelation == "mother-in-lawfather-in-law" || memberRelation == "sister-in-lawbrother" || memberRelation == "brother-in-lawsister" || memberRelation == "grandmothergrandfather" || memberRelation == "auntuncle" || memberRelation == "daughter-in-lawson" || memberRelation == "son-in-lawdaughter" || memberRelation == "niece-in-lawnephew" || memberRelation == "nephew-in-lawniece" || memberRelation == "granddaughter-in-lawgrandson" || memberRelation == "grandson-in-lawgranddaughter") && membersObjWithoutProposer.length > 1){
				returnObj.isProductElligible = false;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: 'ProductRelated',
					message: "Invalid family construct. Only Spouses are allowed to select."
				});
			}

			if(!validAgeFlag && membersObjWithoutProposer.length > 1){
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: 'ProductRelated',
					message: "Atleaset one member should have age above 55."
				});
			}
			if(membersObjWithoutProposer.length > 2){
				returnObj.isProductElligible = false;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: 'ProductRelated',
					message: "Maximum 2 members are allowed. Please delete "+(membersObjWithoutProposer.length - 2)+" member/s."
				});
			}
			return returnObj;
		}

	/* End of Active care validations */
	
	/* Active Fit Validations */

		pVS.activFitValidations = function(memberObj,relationType){
			var membersObjWithoutProposer = angular.copy(memberObj).splice(1);
			var returnObj = {
				allErrors: [],
				isSelfPresent: false,
				childExcceedLimit: false,
				isProductElligible: true,
				elligibleMembers: [],
				notElligibleMembers: [],
				invalidConstruct: true,
				selectedMemberError: 'N',
				individualSelectionError: false
			}
			var childCount = 0;
			var planName = angular.isUndefined(sessionStorage.getItem('plPlan')) ? '' : sessionStorage.getItem('plPlan')
			var maxAge  = 45;
			var minAge =  18;
			angular.forEach(membersObjWithoutProposer,function(v,i){
				pVS.errorFlag = false;
				if(v.RelationWithProposer == "SELF"){
					returnObj.isSelfPresent = true;
				}
				if(v.Age > maxAge ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be greater than "+maxAge
					});
				}
				if((v.RelationWithProposer != 'KID' && v.RelationWithProposer !="GRANDSON" && v.RelationWithProposer != "GRANDDAUGHTER") && v.Age < minAge){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: "Age of "+v.RelationWithProposer+" should not be less than "+minAge
					});
				}
				if(v.RelationWithProposer == "KID" || v.RelationWithProposer == "GRANDSON" || v.RelationWithProposer == "GRANDDAUGHTER" ){
					if(v.Age > 25 && membersObjWithoutProposer.length > 1){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should not be greater than 25"
						});
					}else if((v.Age <= 4 || v.Age > 25) && membersObjWithoutProposer.length == 1){
						pVS.errorFlag = true;
						returnObj.allErrors.push({
							RelationType: v.RelationType,
							RelationWithProposer: v.RelationWithProposer,
							message: "Age of "+v.RelationType+" should be greater than 5 and less than 25 in multi-individual policy type"
						});
					}else{
						childCount++;
						verifyAge(v,membersObjWithoutProposer,returnObj);
					}
				}
				if(v.RelationWithProposer != "KID"){
					verifyAge(v,membersObjWithoutProposer,returnObj);
				}
				if(v.RelationWithProposer != "SELF" && v.RelationWithProposer != "SPOUSE" && v.RelationWithProposer != "KID" && v.RelationWithProposer != "FATHER" && v.RelationWithProposer != "MOTHER" && v.RelationWithProposer != "FATHER-IN-LAW" && v.RelationWithProposer != "MOTHER-IN-LAW" && v.RelationWithProposer != "BROTHER" && v.RelationWithProposer != "SISTER" && v.RelationWithProposer != "GRANDFATHER" && v.RelationWithProposer != "GRANDMOTHER" && v.RelationWithProposer != "GRANDSON" && v.RelationWithProposer != "GRANDDAUGHTER" && v.RelationWithProposer != "SON-IN-LAW" && v.RelationWithProposer != "DAUGHTER-IN-LAW" && v.RelationWithProposer != "SON" && v.RelationWithProposer != "DAUGHTER" && v.RelationWithProposer != "BROTHER-IN-LAW" && v.RelationWithProposer != "SISTER-IN-LAW" && v.RelationWithProposer != "NEPHEW" && v.RelationWithProposer != "NIECE" ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" is not covered for Activ Fit product"
					});
				}
				if( (v.RelationWithProposer == "FATHER" || v.RelationWithProposer == "MOTHER" || v.RelationWithProposer == "FATHER-IN-LAW" || v.RelationWithProposer == "MOTHER-IN-LAW" || v.RelationWithProposer == "BROTHER" || v.RelationWithProposer == "SISTER" || v.RelationWithProposer == "GRANDFATHER" || v.RelationWithProposer == "GRANDMOTHER" || v.RelationWithProposer == "GRANDSON" || v.RelationWithProposer == "GRANDDAUGHTER" || v.RelationWithProposer == "SON-IN-LAW" || v.RelationWithProposer == "DAUGHTER-IN-LAW" || v.RelationWithProposer == "BROTHER-IN-LAW" || v.RelationWithProposer == "SISTER-IN-LAW" || v.RelationWithProposer == "NEPHEW" || v.RelationWithProposer == "NIECE") && membersObjWithoutProposer.length > 1 ){
					pVS.errorFlag = true;
					returnObj.allErrors.push({
						RelationType: v.RelationType,
						RelationWithProposer: v.RelationWithProposer,
						message: v.RelationWithProposer+" is not allowed for Activ Fit Product with Family Floater policy type"
					});
				}
				if(pVS.errorFlag){
					returnObj.isProductElligible = false;
					returnObj.notElligibleMembers.push(v);
				}else{
					returnObj.elligibleMembers.push(v.RelationType);
				}				
				// if(!angular.isUndefined(selectedMember) && v.RelationType == selectedMember && !pVS.errorFlag){
				// 	returnObj.selectedMemberError = "N";
				// }
			});

			var familyConstruct = new String();
			var isProductProper = false;
			for(var i = 0; i<returnObj.elligibleMembers.length;i++){
				var member = returnObj.elligibleMembers[i];
				familyConstruct = familyConstruct + member;
				if(member == "S" || member == "SPO"){
					isProductProper = true;
					returnObj.invalidConstruct = false;
				}
			}

			if(familyConstruct == "FM" || familyConstruct == "FILMIL"){
				isProductProper = true;
				returnObj.invalidConstruct = false;
			}

			if(childCount > 4){
				returnObj.childExcceedLimit = true;
				returnObj.isProductElligible = false;
				returnObj.allErrors.push({
					RelationType: '',
					RelationWithProposer: "ProductRelated",
					message: "Maximum 4 kids are allowed"
				});
			}

			return returnObj;
		}

	/* End of Active Fit validations */

}]);


/*  End of Product Validation Service */