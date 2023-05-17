/*
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/


var preApp = angular.module("preQuoteApp",[]);

preApp.controller("preQuoteApp",['$rootScope','appService','ABHI_CONFIG','$location','$routeParams',function($rootScope,appService,ABHI_CONFIG,$location,$routeParams){
	
	/* Variable Initilization */

		var pQA = this; // Current controller scope is stored in pQA
		var aS = appService; // appService is stored in aS variable
		pQA.categories = []; // To stored catgrories data
		pQA.familyConsturcts = []; // To store family construct
		var leadCallService = 0; // As we allow lead service call thrice on failure so variable inilizae
		pQA.additionalMembers = []; // To store additional members
	    pQA.preQuote = {}; // Pre quote data object
	    var IMDCodeURL ;
	    var sourceImd ;
	    pQA.showBuyBtn = true;
	    var fname ;
	    var lname ; 
        sessionStorage.removeItem('pageNoSeq'); // Removed pageNoSeq value from sessionStorage
        sessionStorage.removeItem('lastRouteVisted'); // Removed lastRouteVisited value from sessionStorage
        sessionStorage.removeItem('pName'); // Removed pName value from sessionStorage
        sessionStorage.removeItem('preExeDis'); // Removed preExeDis value from sessionStorage
        sessionStorage.removeItem('ut'); // Removed ut value from sessionStorage
        sessionStorage.removeItem('leadId'); // Removed ut value from sessionStorage

        /* 
        	If reference no is present in sessionStorage then we check prequotedata and map that data with prequotre object.
			If prequote data is not present then we clear sessionstorage.
			If its present then we mapp data as shown in else loop
       	*/

       		if(!angular.isUndefined($routeParams.imdcode) ) {
				toValidateIMD($routeParams.imdcode)
			}
			


				/* 
		To validate IMD 
		In following function we are validating IMDCode which we received from queryparams
	*/

		function toValidateIMD(imdCode){
			aS.postData(ABHI_CONFIG.apiUrl+"GEN/ValidateIMD",{
				"IMDCode":imdCode
			},true,{
				headers:{
					'Content-Type': 'application/json'
				}
			})
				.then(function(data){
					if(data.ResponseCode == 1){
						if(data.ResponseData.IsIMDValid){
							/* 
								IF IMD is valid  then we are mapping mobile no and email id received from queryparams
								with scope MovileNo and EmailId variable. 
							*/
						}else{
							/* If invalid IMD then we are showing alert */
							pQA.showBuyBtn = false;
							$rootScope.alertData = {
			                    "modalClass": "regular-alert",
			                    "modalHeader": "Warning",
			                    "modalBodyText": "Invalid IMD Code.",
			                    "showCancelBtn": false,
			                    "modalSuccessText": "OK",
			                    "modalCancelText": "No",
			                    "showAlertModal": true
			                }
						}
					}else{
						/* If invalid IMD then we are showing alert */
						pQA.showBuyBtn = false;
						$rootScope.alertData = {
		                    "modalClass": "regular-alert",
		                    "modalHeader": "Warning",
		                    "modalBodyText": data.ResponseMessage,
		                    "showCancelBtn": false,
		                    "modalSuccessText": "OK",
		                    "modalCancelText": "No",
		                    "showAlertModal": true
		                }

					}
				},function(err){
				});
		}

	/* ENd of validating IMD */
       	if($location.$$path =="/new-pre-quote"){
       			console.log($routeParams)
       				pQA.preQuote.MobileNo = $routeParams.mobNo;
					pQA.preQuote.EmailId = $routeParams.emailId;
					IMDCodeURL = (!angular.isUndefined($routeParams.imdcode)) ? $routeParams.imdcode : "5100003" ;
					sourceImd = (!angular.isUndefined($routeParams.source)) ? $routeParams.source : "Customer Portal" ;
					fname = (!angular.isUndefined($routeParams.fname)) ? $routeParams.fname : "" ;
					lname = (!angular.isUndefined($routeParams.lname)) ? $routeParams.lname : "" ;
       	}
       	else{
       		IMDCodeURL = "5100003"
       		sourceImd = "Customer Portal"
       	}

		if(sessionStorage.getItem('rid')){
			var prequoteData = JSON.parse(sessionStorage.getItem('prequoteData'));
			if(prequoteData == null){
				sessionStorage.clear();
			}else{
				sessionStorage.setItem('continueJourney', 'Y');
				pQA.preQuote = prequoteData.prequote;
				pQA.coverTo = prequoteData.coverTo;
				pQA.kidsObject = prequoteData.kidsObject;
				pQA.selectCategory = prequoteData.selectCategory;
				pQA.selectedMembers = prequoteData.selectedMembers;
			}
		}

	/* End of variable inilization */


	/* To Fetch Categories */

		aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMaster",{
			"Name":"getcategory"
		},false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(data){
				if(data.ResponseCode == 1){
					pQA.categories = data.ResponseData; // Storaed catrgories inside pQA.categories data
				}
			},function(err){});

	/* End of fetch catgrories */


	/* To Fetch Family Members for active care */

		aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMaster",{
			"Name":"getACRelation"
		},false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
            .then(function(data){
                pQA.activeCareFamilyContruct = data.ResponseData; // Stored active care family construct inside pQA.activeCareFamilyContruct variable
            },function(err){})

	/* End of fetching family members active care */


	/* To Fetch Family Members */

		aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMaster",{
			"Name":"familyconstruct"
		},false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(data){
				if(data.ResponseCode == 1){
					pQA.familyConsturcts = data.ResponseData;
				}
			},function(err){
			});

	/* End of fetching family members */


	/* To Fetch Additional Members */

		aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMaster",{
			"Name":"additionalmembers"
		},false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(data){
				if(data.ResponseCode == 1){
					pQA.additionalMembers = data.ResponseData;
				}
			},function(err){
			});

	/* End of fetching additional members */


	/* To call lead insert API */

		function leadInsertCall(data){
			aS.postData(ABHI_CONFIG.apiUrl+"GEN/LeadInsert",{
				"ReferenceNumber": sessionStorage.getItem('rid')
			},false,{
				headers:{
					'Content-Type': 'application/json'
				}
			})
				.then(function(data){
					if(data.ResponseCode == 1){
						/* If leadInsert service gets success then we store received leadId inside sessionStorage with name leadId */
						sessionStorage.setItem('leadId',data.ResponseData.LeadId);
					}else{
						/* 
							If leadinsert service gets failed then we call leadService util we get success
							Max attempts are 3.			
						*/
						if(leadCallService < 3){
							++leadCallService;
							leadInsertCall();
						}
					}
				},function(err){
				});
		}

	/* End of calling lead insert API */


	/* 
		Function to push insured members in insuredDetails object 
		This function is written to push members data inside insuredDetails object
	*/

		var finalSubmitData = {};
		function insuredDetailPush(gender,relation,relationType,age){
			finalSubmitData.InsuredDetail.push({
				"Gender": gender,
				"RelationWithProposer": relation,
				"RelationType":relationType,
				"Age":age,
				"ProductCode": "NA" // As product isn't purchased at this moment we are keeping productcode as NA
			})
		}

	/* End of function to push insured members in insuredDetails object */


	/* Identifying relationwithproposer */

		function pushInsuredDetails(type){
			/* 
				Following switch case matches type of the member and based on that calls insuredDetail function. 
				In InsuredDetailsPush function we pass 4 arguments.
				1st Argument is gender of member. 1 For Male and 0 For female
				2nd Argument is member type in capitalize case
				3rd argument is member type code which will always be uppercase
				4th Argument is age of the member which we taken from user.
			*/
			switch(type) {
			    case 'SELF':
			   		insuredDetailPush(1,'Self','S',pQA.preQuote.Age);
			        break;
			    case 'SPOUSE':
			   		insuredDetailPush(0,'Spouse','SPO',pQA.preQuote.spouseAge);
			        break;
			    case 'FATHER':
			   		insuredDetailPush(1,'Father','F',pQA.preQuote.fatherAge);
			        break;
			    case 'MOTHER':
			   		insuredDetailPush(0,'Mother','M',pQA.preQuote.motherAge);
			        break;
			    case 'FATHER-IN-LAW':
			   		insuredDetailPush(1,'Father-in-law','FIL',pQA.preQuote.fILAge);
			        break;
			    case 'MOTHER-IN-LAW':
			    	insuredDetailPush(0,'Mother-in-law','MIL',pQA.preQuote.mILAge);
			        break;
			    case 'BROTHER':
			    	insuredDetailPush(1,'Brother','BRO',pQA.preQuote.broAge);
			        break;
			    case 'SISTER-IN-LAW':
			    	insuredDetailPush(0,'Sister-In-Law','SISL',pQA.preQuote.sislAge);
			        break;  
			    case 'SISTER':
			    	insuredDetailPush(0,'Sister','SIS',pQA.preQuote.sisAge);
			        break;
			    case 'BROTHER-IN-LAW':
			    	insuredDetailPush(1,'Brother-In-Law','BIL',pQA.preQuote.bilAge);
			        break; 
			    case 'GRANDFATHER':
			    	insuredDetailPush(1,'Grandfather','GF',pQA.preQuote.gfAge);
			        break;
			    case 'GRANDMOTHER':
			    	insuredDetailPush(0,'Grandmother','GM',pQA.preQuote.gmAge);
			        break;
			    case 'UNCLE':
			    	insuredDetailPush(1,'Uncle','UN',pQA.preQuote.unAge);
			        break;
			    case 'AUNT':
			    	insuredDetailPush(0,'Aunt','AU',pQA.preQuote.auAge);
			        break; 
			    case 'SON':
			    	insuredDetailPush(1,'Son','SO',pQA.preQuote.soAge);
			        break;
			    case 'DAUGHTER-IN-LAW':
			    	insuredDetailPush(0,'Daughter-In-Law','DIL',pQA.preQuote.dilAge);
			        break;
			    case 'SON-IN-LAW':
			    	insuredDetailPush(1,'Son-In-Law','SIL',pQA.preQuote.silAge);
			        break;
			    case 'DAUGHTER':
			    	insuredDetailPush(0,'Daughter','DU',pQA.preQuote.duAge);
			        break;
			     case 'NEPHEW':
			    	insuredDetailPush(1,'Nephew','NP',pQA.preQuote.npAge);
			        break;
			    case 'NIECE-IN-LAW':
			    	insuredDetailPush(0,'Niece-In-Law','NIL',pQA.preQuote.nilAge);
			        break;
			    case 'NIECE':
			    	insuredDetailPush(0,'Niece','NI',pQA.preQuote.niAge);
			        break;
			    case 'NEPHEW-IN-LAW':
			    	insuredDetailPush(1,'Nephew-In-Law','NPL',pQA.preQuote.nplAge);
			        break;
			     case 'GRANDSON':
			    	insuredDetailPush(1,'Grandson','GS',pQA.preQuote.gsAge);
			        break;
			    case 'GRANDDAUGHTER-IN-LAW':
			    	insuredDetailPush(0,'Granddaughter-In-Law','GDL',pQA.preQuote.gdlAge);
			        break;
			     case 'GRANDDAUGHTER':
			    	insuredDetailPush(0,'Granddaughter','GD',pQA.preQuote.gdAge);
			        break;
			    case 'GRANDSON-IN-LAW':
			    	insuredDetailPush(1,'Grandson-In-Law','GSL',pQA.preQuote.gslAge);
			        break;                                                           
			     case 'KIDS':
				     for(i = 0; i < pQA.preQuote.Kids; i++){
						insuredDetailPush(1,'KID',"KID"+(i+1),pQA.kidsObject[i].age);
					}
			        break;
			    default:
			    return;
			}
		}

	/* End of identifying relationwithproposer */


	/* To Submit Form Data */
		// This function gets call when record doesnt exist in DB or user clicks no on duplicate check popup
		function submitFormData(event,actText){
			finalSubmitData = {
				"ProposerDetail":{
					"ProductCategory": pQA.preQuote.ProductCategory, // ProductCategroy user selected from first dropdown
					"Age": pQA.preQuote.Age, // Age of the proposer
					"MobileNo": "6000000000", // Mobile number entered by user
					"EmailId": "sarthak@test.com", // EmailID entered by user
					"IMDSource":sourceImd, // Read source from the URL
					"IMDCode": IMDCodeURL, // Read Imd Code from the url
					"FirstName": fname,
					"LastName": lname,
					"ThirdPartyURL": window.location.href, // Current url in browesers address bas
				},
				"InsuredDetail":[] // Insured members array
			}

			/*  If coverfor is self, self and spouse, self spouse kids or Self Kids that time we have to push self as insuredDetail  */

			if(pQA.preQuote.Cover == "S" || pQA.preQuote.Cover == "SP" || pQA.preQuote.Cover == "SPK" || pQA.preQuote.Cover == "SK"){
				insuredDetailPush(1,'SELF','S',pQA.preQuote.Age);
			}

			/*  If coverfor is self and spouse, self spouse kids or Spouse Kids that time we have to push SPOUSE as insuredDetail  */

			if(pQA.preQuote.Cover == "SP" || pQA.preQuote.Cover == "SPK" || pQA.preQuote.Cover == "PK"){
				insuredDetailPush(0,'SPOUSE','SPO',pQA.preQuote.spouseAge);
			}

			/*  If coverfor is self Kids, self spouse kids or Spouse Kids that time we have to push KIDS as insuredDetail  */

			if(pQA.preQuote.Cover == "SK" || pQA.preQuote.Cover == "SPK" || pQA.preQuote.Cover == "PK"){

				// For loop used as max kids can be 4
				for(i = 0; i < pQA.preQuote.Kids; i++){
					insuredDetailPush(1,'KID',"KID"+(i+1),pQA.kidsObject[i].age);
				}
			}

			/* If coverfor is different family construct or activ care then we have to push all members into insured Details whickever user selected */

			if(pQA.preQuote.Cover == "D" || pQA.preQuote.Cover == "SC" ){
				angular.forEach(pQA.selectedMembers,function(v,i){
					if(pQA.selectedMembers[i]){
						pushInsuredDetails(i.toUpperCase()); // The function where we are passing type of the member
					}
				});
			}

			/*  After forming object with all required data we pass that object to PreQuote Service. */

			aS.postData(ABHI_CONFIG.apiUrl+"GEN/PreQuote",finalSubmitData,true,{
				headers:{
					'Content-Type': 'application/json'
				}
			})
				.then(function(data){
					if(data.ResponseCode == 1){
						/* 
							If success 
							then we store usertoekn and reference number received from service into sessionStorage
							and then make leadInsertCall to get leadId.
							After than we redirect user to reco page.
						*/

						sessionStorage.setItem('ut',data.ResponseData.ut);
						sessionStorage.setItem('rid',data.ResponseData.ReferenceNumber);
						//leadInsertCall();
						$location.url('reco');
					}else{
						/* 
							If failure then,
							we show alert to user of failure
						*/
						$rootScope.alertConfiguration('E',data.ResponseMessage);
						event.target.disabled = false;
						event.target.innerHTML = actText;
					}
				},function(err){
					event.target.disabled = false;
					event.target.innerHTML = actText;
				});
		}

	/* End of submitting Form data */


	/* To check products */

		pQA.checkProducts = function(event){

			/* To change text of Check Products button to Please wait .... */

				var actText = angular.copy(event.target.innerHTML);
				event.target.disabled = true;
				event.target.textContent = "Please wait.....";

			/* End of changing text of check products button to please wait */


			/* 
				Pre Quote Data storing in sessionStorage
				We are storing following data in sessionstorage so that when user goes from pre quote page to some another page and then
				from there he visits pre quote page again then his/her pre quota data shoud be pre populated

			*/

				var preQuoteData = {
					'selectCategory' : pQA.selectCategory,
					'coverTo' : pQA.coverTo,
					'prequote': pQA.preQuote,
					'kidsObject': pQA.kidsObject,
					'selectedMembers': pQA.selectedMembers
				}
				sessionStorage.setItem('prequoteData',JSON.stringify(preQuoteData));

			/* End of storing pre quote data in sessionStorage */

			submitFormData(event,actText);


			/* 
				To call duplicatecheck service so that we can check whether emailid and mobile no
				which user entered is present in database of not.

			*/

				}

	/* End of checking products */

}]);

/*	
	End of controller
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/