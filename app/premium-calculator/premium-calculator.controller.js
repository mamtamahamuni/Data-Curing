/*
	Name: Pre Quote Controller
	Author: Sunny Khattri
	Date: 25-03-2019
*/


var preCalApp = angular.module("premiumCal", []);

preCalApp.controller("premiumCal", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$timeout', '$window', function ($rootScope, appService, ABHI_CONFIG, $location, $timeout, $window) {
	var preC = this;
	var aS = appService; // appService is stored in aS variable
	preC.kidsAgeSec = false;
	var finalSubmitData = {};
	var leadCallService = 0; // As we allow lead service call thrice on failure so variable inilizae
	preC.showErrors = false;
	preC.showForward = true;
	preC.showKidsCount = false;
	preC.emailError = true;
	preC.imgUrl = "assets/images/preminum-yellow-arrow.png"
	console.log(preC.coverTo);
	preC.coverTo = ""

	$(document.body).on('click', '.dropdown-menu li a', function () {
		var textToSet = $(this).text();
		$(this).parent().parent().parent().find("button").find("span").text(textToSet);
		$(this).off('click');
	});

	/* To Fetch Categories */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
			"Name": "getcategory"
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				preC.categories = data.ResponseData; // Storaed catrgories inside preC.categories data
			}
		}, function (err) {});

	/* End of fetch catgrories */


	/* To Fetch Family Members */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
			"Name": "familyconstruct"
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				preC.familyConsturcts = data.ResponseData;
			}
		}, function (err) {});

	/* End of fetching family members */


	/* To Fetch Additional Members */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
			"Name": "additionalmembers"
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				preC.additionalMembers = data.ResponseData;
			}
		}, function (err) {});

	/* End of fetching additional members */

	$(window).scroll(function () {
		if ($(this).scrollTop() > 3780) {
			$('.move-to-top').fadeIn();
		} else {
			$('.move-to-top').fadeOut();
		}
	});


	preC.memberValues = function (val) {
		/*preC.spAge = false;
		preC.kidsCountSec =false*/

		var callfamilyConstructSubmit = true;
		preC.Cover = val.Key
		preC.Kids = 0;
		//var $this = $(this); // Stored instance of li into $this.
		console.log(val);
		preC.coverTo = val.Value
		if (val.Key == "PK") {
			preC.showKidsCount = true
			preC.selectedMembers = {};
			preC.selectedMembers = {
				"Spouse": true,
				"Kids": true
			}
		} else if (val.Key == "SP") {
			preC.selectedMembers = {};
			preC.selectedMembers = {
				"Spouse": true
			}
		} else if (val.Key == "SK") {
			preC.selectedMembers = {};
			preC.showKidsCount = true
			preC.selectedMembers = {
				"Kids": true
			}
		} else if (val.Key == "SPK") {
			preC.selectedMembers = {};
			preC.showKidsCount = true;
			preC.selectedMembers = {
				"Kids": true,
				"Spouse": true
			}
		} else {

			callfamilyConstructSubmit = false;
		}
		console.log(preC.selectedMembers)
		if (callfamilyConstructSubmit) {
			preC.familyConstructSubmit(preC.selectedMembers);
		}
		$('.q-input').removeClass('showOpt-open');
	}


	preC.familyConstrudsdsdctSubmit = function (selectedMember) {
		console.log(selectedMember);
		if (angular.isUndefined(selectedMember)) { // if selectedMember is undefined then show alert
			$rootScope.alertConfiguration('E', "Please select member", "select-member_alert");
			return false;
		}
		preC.spAge = false;
		preC.kidsCountSec = false
		preC.Kids = 0;
		angular.forEach(selectedMember, function (v, i) {
			if (v) {
				if (i == "Self") {

				} else if (i == "Spouse") {
					preC.spAge
				} else if (i == "Father") {
					preC.fAge = true;
				} else if (i == "Mother") {
					preC.mAge = true;
				} else if (i == "Father-in-law") {
					preC.filAge = true;
				} else if (i == "Mother-in-law") {
					preC.milAge = true;
				} else if (i == "Kids") {

				}


			}

		})

		$('.otherFamilyConstruct').hide().removeClass('ul-activ'); // Hiding other family construct dropdown
		$('.reg-overlay').fadeOut(); // Hiding overlay div
		$('.q-input').removeClass('showOpt-open'); // Removing showOpt-open class
	}


	preC.moveDown = function () {
		$rootScope.callGtag("click-text", "preminum-calculator", "preminum-calculator_learn-more")
		$('html, body').animate({
			scrollTop: $(".preminum-calc").offset().top + 10
		}, 1000);
	}


	preC.moveUp = function () {
		$rootScope.callGtag("click-text", "preminum-calculator", "preminum-calculator_move-to-top")
		$('html, body').animate({
			scrollTop: $(".right-side-bg-top").offset().top
		}, 1000);
	}
	/*update Kids Age */

	preC.updateKidsCount = function (val) {
		if (parseInt(val) > 0) {
			if (parseInt(val) > 4) {
				preC.kidsAgeSec = false
				$rootScope.alertConfiguration('E', "Kids Should be 4 of less than that ");
				return false;
			}

			$('html, body').animate({
				scrollTop: $(".screen-4").offset().top - 200
			}, 1000);
			preC.kidsAgeSec = true
		} else if (parseInt(val) == 0) {
			preC.kidsAgeSec = false
			$rootScope.alertConfiguration('E', "Kids count can not be zero");
			return false;
		} else {
			preC.kidsAgeSec = false;
		}

		preC.kidsObject = [];
		for (var i = 0; i < parseInt(val); i++) {
			preC.kidsObject.push({
				id: (i + 1),
				age: ""
			})
		}
	}

	/*update Kids Age Ends*/

	/* To call lead insert API */

	function leadInsertCall(data) {
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/LeadInsert", {
				"ReferenceNumber": sessionStorage.getItem('rid')
			}, false, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					/* If leadInsert service gets success then we store received leadId inside sessionStorage with name leadId */
					sessionStorage.setItem('leadId', data.ResponseData.LeadId);
				} else {
					/* 
						If leadinsert service gets failed then we call leadService util we get success
						Max attempts are 3.			
					*/
					if (leadCallService < 3) {
						++leadCallService;
						leadInsertCall();
					}
				}
			}, function (err) {});
	}

	/* End of calling lead insert API */
	preC.coversChange = function () {
		preC.showForward = true;
		$('.cover-for').addClass('showOpt-open');
		$('.q2showOpt').removeClass('hide-on-load')

	}

	preC.typeCoverChange = function () {

		$('.type-cover').addClass('showOpt-open');
		$('.q3showOpt').removeClass('hide-on-load')

	}

	preC.categoryTypeValues = function (val) {
		preC.category = val

		$('.type-cover').removeClass('showOpt-open');
	}

	function insuredDetailPush(gender, relation, relationType, age) {
		if (angular.isUndefined(age)) {
			$rootScope.alertConfiguration('E', "Please fill the correct ", "self_email_alert");
			return false;
		}

		finalSubmitData.InsuredDetail.push({
			"Gender": gender,
			"RelationWithProposer": relation,
			"RelationType": relationType,
			"Age": age,
			"ProductCode": "NA" // As product isn't purchased at this moment we are keeping productcode as NA
		})
	}


	preC.removeOverLayFalse = function () {
		if (angular.element('.type-cover').hasClass('showOpt-open')) {
			angular.element('.type-cover').removeClass('showOpt-open');
		}

	}


	/* Identifying relationwithproposer */

	function pushInsuredDetails(type) {
		/* 
			Following switch case matches type of the member and based on that calls insuredDetail function. 
			In InsuredDetailsPush function we pass 4 arguments.
			1st Argument is gender of member. 1 For Male and 0 For female
			2nd Argument is member type in capitalize case
			3rd argument is member type code which will always be uppercase
			4th Argument is age of the member which we taken from user.
		*/
		switch (type) {
			case 'SELF':
				insuredDetailPush(1, 'Self', 'S', preC.selfAge);
				break;
			case 'SPOUSE':
				insuredDetailPush(0, 'Spouse', 'SPO', preC.spouseAge);
				break;
			case 'FATHER':
				if (angular.isUndefined(preC.fatherAge)) {
					return false;
				}
				insuredDetailPush(1, 'Father', 'F', preC.fatherAge);
				break;
			case 'MOTHER':
				insuredDetailPush(0, 'Mother', 'M', preC.motherAge);
				break;
			case 'FATHER-IN-LAW':
				insuredDetailPush(1, 'Father-in-law', 'FIL', preC.fILAge);
				break;
			case 'MOTHER-IN-LAW':
				insuredDetailPush(0, 'Mother-in-law', 'MIL', preC.mILAge);
				break;
			case 'BROTHER':
				insuredDetailPush(1, 'Brother', 'BRO', preC.broAge);
				break;
			case 'SISTER-IN-LAW':
				insuredDetailPush(0, 'Sister-In-Law', 'SISL', preC.sislAge);
				break;
			case 'SISTER':
				insuredDetailPush(0, 'Sister', 'SIS', preC.sisAge);
				break;
			case 'BROTHER-IN-LAW':
				insuredDetailPush(1, 'Brother-In-Law', 'BIL', preC.bilAge);
				break;
			case 'GRANDFATHER':
				insuredDetailPush(1, 'Grandfather', 'GF', preC.gfAge);
				break;
			case 'GRANDMOTHER':
				insuredDetailPush(0, 'Grandmother', 'GM', preC.gmAge);
				break;
			case 'UNCLE':
				insuredDetailPush(1, 'Uncle', 'UN', preC.unAge);
				break;
			case 'AUNT':
				insuredDetailPush(0, 'Aunt', 'AU', preC.auAge);
				break;
			case 'SON':
				insuredDetailPush(1, 'Son', 'SO', preC.soAge);
				break;
			case 'DAUGHTER-IN-LAW':
				insuredDetailPush(0, 'Daughter-In-Law', 'DIL', preC.dilAge);
				break;
			case 'SON-IN-LAW':
				insuredDetailPush(1, 'Son-In-Law', 'SIL', preC.silAge);
				break;
			case 'DAUGHTER':
				insuredDetailPush(0, 'Daughter', 'DU', preC.duAge);
				break;
			case 'NEPHEW':
				insuredDetailPush(1, 'Nephew', 'NP', preC.npAge);
				break;
			case 'NIECE-IN-LAW':
				insuredDetailPush(0, 'Niece-In-Law', 'NIL', preC.nilAge);
				break;
			case 'NIECE':
				insuredDetailPush(0, 'Niece', 'NI', preC.niAge);
				break;
			case 'NEPHEW-IN-LAW':
				insuredDetailPush(1, 'Nephew-In-Law', 'NPL', preC.nplAge);
				break;
			case 'GRANDSON':
				insuredDetailPush(1, 'Grandson', 'GS', preC.gsAge);
				break;
			case 'GRANDDAUGHTER-IN-LAW':
				insuredDetailPush(0, 'Granddaughter-In-Law', 'GDL', preC.gdlAge);
				break;
			case 'GRANDDAUGHTER':
				insuredDetailPush(0, 'Granddaughter', 'GD', preC.gdAge);
				break;
			case 'GRANDSON-IN-LAW':
				insuredDetailPush(1, 'Grandson-In-Law', 'GSL', preC.gslAge);
				break;
			case 'KIDS':
				for (i = 0; i < preC.Kids; i++) {
					insuredDetailPush(1, 'KID', "KID" + (i + 1), preC.kidsObject[i].age);
				}
				break;
			default:
				return;
		}
	}

	/* End of identifying relationwithproposer */


	function checkAgeEntered() {
		var clickEventVal
		$('.main-selection-wrapper .screen-box').each(function (i, element) {
			//console.log($(element).hasClass('screen-Active'))
			if ($(element).hasClass('screen-Active')) {
				var activeClass = $(element).find("img")
				if(activeClass.length > 0){
					clickEventVal = "." + activeClass[1].classList[1]
				}
				
			}
			//console.log(i)
		})
		console.log(preC.Cover);
		for (let [key, value] of Object.entries(preC.selectedMembers)) {

			console.log(key, value);

			if(value){
				switch (key.toUpperCase()) {
				case 'SELF':
					if (angular.isUndefined(preC.selfAge)) {
						$rootScope.alertConfiguration('E', "Please fill the Self age", "");
						return false;
					}
					break;
				case 'SPOUSE':
					//clickEventVal = ".q-sposeAge"
					if (angular.isUndefined(preC.spouseAge)) {

						$rootScope.alertConfiguration('E', "Please fill the Spouse age", "");
						return false;
					}
					break;
				case 'FATHER':
					if (angular.isUndefined(preC.fatherAge)) {
						//clickEventVal = ".q-sposeAge"
						$rootScope.alertConfiguration('E', "Please fill the Father age", "");
						$(clickEventVal).click();


						return false;
					}
					break;
				case 'MOTHER':
					if (angular.isUndefined(preC.motherAge)) {
						//clickEventVal = ".q-fatherAge"
						$rootScope.alertConfiguration('E', "Please fill the Mother age", "");
						$(clickEventVal).click();

						return false;
					}

					break;
				case 'FATHER-IN-LAW':
					if (angular.isUndefined(preC.fILAge)) {
						//clickEventVal = ".q-motherAge"	
						$rootScope.alertConfiguration('E', "Please fill the Father in Law age", "");
						$(clickEventVal).click();

						return false;
					}

					break;
				case 'MOTHER-IN-LAW':
					if (angular.isUndefined(preC.mILAge)) {
						//clickEventVal = ".q-fILAge"
						$rootScope.alertConfiguration('E', "Please fill the Mother in Law age", "");
						$(clickEventVal).click();

						return false;
					}

					break;
				case 'KIDS':
					for (i = 0; i < parseInt(preC.Kids); i++) {
						if (angular.isUndefined(preC.kidsObject[i].age) || preC.kidsObject[i].age == null || preC.kidsObject[i].age == "") {
							//clickEventVal = ".q-mILage"
							$rootScope.alertConfiguration('E', "Please fill the Kids age", "");
							$(clickEventVal).click();
							return false;
						}

					}
					break;

			}
			}
			
		}
	}


	/* To Submit Form Data */
	// This function gets call when record doesnt exist in DB or user clicks no on duplicate check popup
	function submitFormData(event, actText) {
		finalSubmitData = {
			"ProposerDetail": {
				"ProductCategory": (angular.isUndefined(preC.category) || preC.category.Category == "") ? "HP" : preC.category.CategoryCode, // ProductCategroy user selected from first dropdown
				"Age": preC.selfAge, // Age of the proposer
				"MobileNo": preC.mobNo, // Mobile number entered by user
				"EmailId": preC.emailId, // EmailID entered by user
				"IMDSource": "Customer Portal", // Read source from the URL
				"IMDCode": "5100003", // Read Imd Code from the url
				"FirstName": preC.selfName,
				"LastName": "",
				"ThirdPartyURL": window.location.href, // Current url in browesers address bas
			},
			"InsuredDetail": [] // Insured members array
		}

		/* check ageentered */

		var w = angular.element($window);

		console.log(w.width())

		var checkAge = checkAgeEntered()
		/*if(!checkAge && w.width() < 420){
					$('html, body').animate({
    				scrollTop: $(".screen-full").offset().top-1
						}, 1000);
						return false
				}
*/


		/*  If coverfor is self, self and spouse, self spouse kids or Self Kids that time we have to push self as insuredDetail  */

		if (preC.Cover == "S" || preC.Cover == "SP" || preC.Cover == "SPK" || preC.Cover == "SK") {
			insuredDetailPush(1, 'SELF', 'S', preC.selfAge);
		}

		/*  If coverfor is self and spouse, self spouse kids or Spouse Kids that time we have to push SPOUSE as insuredDetail  */

		if (preC.Cover == "SP" || preC.Cover == "SPK" || preC.Cover == "PK") {
			insuredDetailPush(0, 'SPOUSE', 'SPO', preC.spouseAge);
		}

		/*  If coverfor is self Kids, self spouse kids or Spouse Kids that time we have to push KIDS as insuredDetail  */

		if (preC.Cover == "SK" || preC.Cover == "SPK" || preC.Cover == "PK") {

			// For loop used as max kids can be 4
			for (i = 0; i < parseInt(preC.Kids); i++) {
				insuredDetailPush(1, 'KID', "KID" + (i + 1), preC.kidsObject[i].age);
			}
		}

		/* If coverfor is different family construct or activ care then we have to push all members into insured Details whickever user selected */


		if (preC.Cover == "D" || preC.Cover == "SC") {
			angular.forEach(preC.selectedMembers, function (v, i) {
				if (preC.selectedMembers[i]) {
					pushInsuredDetails(i.toUpperCase()); // The function where we are passing type of the member
				}
			});
		}

		/*  After forming object with all required data we pass that object to PreQuote Service. */

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/PreQuote", finalSubmitData, true, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					/* 
						If success 
						then we store usertoekn and reference number received from service into sessionStorage
						and then make leadInsertCall to get leadId.
						After than we redirect user to reco page.
					*/

					sessionStorage.setItem('ut', data.ResponseData.ut);
					sessionStorage.setItem('rid', data.ResponseData.ReferenceNumber);
					leadInsertCall();
					$location.url('reco');
				} else {
					/* 
						If failure then,
						we show alert to user of failure
					*/
					$rootScope.alertConfiguration('E', data.ResponseMessage);
					event.target.disabled = false;
					event.target.innerHTML = actText;
				}
			}, function (err) {
				event.target.disabled = false;
				event.target.innerHTML = actText;
			});
	}

	/* End of submitting Form data */


	preC.submitPreminumCalForm = function (event, validForm) {
		if (!validForm) {
			preC.showErrors = true;
			return false;
		}

		$rootScope.callGtag("click-button", "preminum-calculator", "preminum-calculator_calculate")
		/*if(angular.isUndefined(preC.category)){
			$rootScope.alertConfiguration('E',"Please select category type","self_email_alert");
			return false ;
		}*/
		if (preC.coverTo == "") {
			$rootScope.alertConfiguration('E', "Please select family construct ", "self_email_alert");
			return false;
		}

		//console.log("hiiiii")

		if ((preC.Cover == "S" || preC.Cover == "SP" || preC.Cover == "SPK" || preC.Cover == "SK") && (angular.isUndefined(preC.selfAge) || preC.selfAge == "")) {
			$rootScope.alertConfiguration('E', "Please enter Self Age", "");
			return false;
		}

		/*  If coverfor is self and spouse, self spouse kids or Spouse Kids that time we have to push SPOUSE as insuredDetail  */

		if ((preC.Cover == "SP" || preC.Cover == "SPK" || preC.Cover == "PK") && (angular.isUndefined(preC.spouseAge) || preC.spouseAge == "")) {
			$rootScope.alertConfiguration('E', "Please enter Spouse Age", "self_email_alert");
			return false;
		}

		/*  If coverfor is self Kids, self spouse kids or Spouse Kids that time we have to push KIDS as insuredDetail  */

		if (preC.Cover == "SK" || preC.Cover == "SPK" || preC.Cover == "PK") {

			if (parseInt(preC.Kids) == 0) {
				$rootScope.alertConfiguration('E', "Please enter number of kids ", "");
				return false;
			}

			// For loop used as max kids can be 4


		}


		/* If coverfor is different family construct or activ care then we have to push all members into insured Details whickever user selected */


		/*  After forming object with all required data we pass that object to PreQuote Service. */

		/* To change text of Check Products button to Please wait .... */

		var actText = angular.copy(event.target.innerHTML);
		/*event.target.disabled = true;
		event.target.textContent = "Please wait.....";*/

		/* End of changing text of check products button to please wait */

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/DuplicateCheck", {
				"ProductCategory": "", // ProductCategroy user selected from first dropdown
				"Age": preC.selfAge, // Age of the proposer
				"MobileNo": preC.mobNo, // Mobile number entered by user
				"EmailId": preC.emailId, // EmailID entered by user
				"IMDSource": "Customer Portal", // Read source from the URL
				"IMDCode": "5100003", // Read Imd Code from the url
				"ThirdPartyURL": window.location.href, // Storing current URL which is present in address bar
			}, true, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(function (data) {
				if (data.ResponseCode == 1) {

					/* 
						If ResponseMessage is 'NOT_EXIST' then we will call pre-quote service
						Else we show popup asking recod already exist do you wwantto conitnue
					*/

					if (data.ResponseMessage == "NOT_EXIST") {
						submitFormData(event, actText);
					} else {
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Alert",
							"modalBodyText": data.ResponseMessage,
							"showCancelBtn": true,
							"modalSuccessText": "Yes",
							"modalCancelText": "No",
							"hideCloseBtn": true,
							"gtagPostiveFunction": "click-button, pre-quote ,pre-quote_data-save[Yes]",
							"gtagCrossFunction": "click-button, pre-quote ,pre-quote_data-save[X]",
							"gtagNegativeFunction": "click-button, pre-quote ,pre-quote_data-save[No]",
							"showAlertModal": true,
							"positiveFunction": function () {

								/* 
									If user clicks yes then we first hit service to update IMD, where we sent reference no
									which we receive from duplicate check service and  IMDCode : 5100003 and IMDSource : Customer Portal
								*/

								aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateIMD", {
										"IMDCode": "5100003",
										"IMDSource": "Customer Portal",
										"ReferenceNumber": data.ResponseData.ReferenceNumber
									}, true, {
										headers: {
											'Content-Type': 'application/json'
										}
									})
									.then(function (response) {

										if (response.ResponseCode == 1) {
											sessionStorage.setItem('ut', data.ResponseData.ut); // Store usertoken received from duplicatecheck service into session storage
											sessionStorage.setItem('rid', data.ResponseData.ReferenceNumber); // Store reference no received from duplicatecheck service into sessionstorage

											/* Service to receive crm lead id associated with existing lead id */

											aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetCRMLeadId", {
													"ReferenceNumber": data.ResponseData.ReferenceNumber
												}, false, {
													headers: {
														'Content-Type': 'application/json'
													}
												})
												.then(function (crmData) {
													sessionStorage.setItem('leadId', crmData.ResponseData.LeadId); // Store leadId receive from getcrmleadid service into sessionStorage

													/* 
														Following switch loop decides on which quote page to redirect 
														based on data received from DuplicateCheck service
													*/

													switch (data.ResponseData.ProductCode) {
														case "CS":
															/* If product code is CS then redirect to 'cs-quote' page and store 'pName' value as Activ Secure Cancer Secure inside sessioStorage*/
															sessionStorage.setItem('pName', "Activ Secure Cancer Secure");
															$location.url('cs-quote');
															break;
														case "PA":
															/* If product code is PA then redirect to 'pa-quote' page and store 'pName' value as Activ Secure Personal Accident inside sessioStorage*/
															sessionStorage.setItem('pName', "Activ Secure Personal Accident");
															$location.url('pa-quote');
															break;
														case "CI":
															/* If product code is CI then redirect to 'ci-quote' page and store 'pName' value as Activ Secure Critical Illness inside sessioStorage*/
															sessionStorage.setItem('pName', "Activ Secure Critical Illness");
															$location.url('ci-quote');
															break;
														case "PL":
															/* If product code is PL then redirect to 'platinum-quote' page and store 'pName' value as Activ Health inside sessioStorage*/
															sessionStorage.setItem('pName', "Activ Health");
															$location.url('platinum-quote');
															break;
														case "DI":
															/* If product code is DI then redirect to 'diamond-quote' page and store 'pName' value as Activ Assure inside sessioStorage*/
															sessionStorage.setItem('pName', "Activ Assure");
															$location.url('diamond-quote');
															break;
														case "AC":
															/* If product code is AC then redirect to 'activ-care-quote' page and store 'pName' value as Activ Care inside sessioStorage*/
															sessionStorage.setItem('pName', "Activ Care");
															$location.url('activ-care-quote');
															break;
													}
												}, function (err) {});

											/* End of service to receive crm lead id associated with existing lead id */

										} else {
											event.target.disabled = false;
											event.target.innerHTML = actText;
											$rootScope.alertData = {
												"modalClass": "regular-alert",
												"modalHeader": "Alert",
												"modalBodyText": "Something went wrong",
												"showCancelBtn": false,
												"modalSuccessText": "Yes",
												"showAlertModal": true,
											}
										}
									}, function (err) {
										event.target.disabled = false;
										event.target.innerHTML = actText;
									})
							},
							"negativeFunction": function () {
								submitFormData(event, actText);
							}
						}
					}
				} else {
					event.target.disabled = false;
					event.target.innerHTML = actText;
				}
			}, function (err) {
				event.target.disabled = false;
				event.target.innerHTML = actText;
			});


	}


}])