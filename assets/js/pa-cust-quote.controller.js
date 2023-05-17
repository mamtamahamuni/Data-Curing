/*
	
	PA Quote Controller
	Author: Pankaj Patil
	Date: 28-06-2018

*/

var pACApp = angular.module("pACustQuote",[]);

pACApp.controller("pACustQuoteCtrl",['$rootScope', 'appService', 'ABHI_CONFIG', '$filter' , '$location', '$timeout',function($rootScope, appService, ABHI_CONFIG, $filter,  $location , $timeout){

	
	/* Data initilization */

		var pAC = this;
		var aS = appService;
		pAC.productType = "PA";
		pAC.initSlider = false;
		pAC.planName = "RFB";
		var setTTDFlag = false;
		pAC.ttd_covers = [1000,2000,3000,4000,5000,7500,10000,12500,15000,20000,25000,30000,40000,50000];
		pAC.emi_protect_covers = [50000,75000,100000,200000,300000,400000,500000];
		pAC.loan_protect_covers = [100000,200000,300000,400000,500000,600000,700000,800000,900000,1000000,1500000,2000000,2500000,3000000,4000000,5000000,10000000,15000000,20000000,50000000];
		pAC.duplicatePDL = '0';
		pAC.duplicatenNOD = '0';
		var pACalculatePremiumParams = {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"PA": {
				"PAPremiumList" : []
			}
		}

	/* End of data initilization */

	if($location.$$path == "/pa-customize-quote"){
		let paSi = {"paSi":true};
		sessionStorage.setItem("pa-si", JSON.stringify(paSi));
	}


	/* To Load Slick Slider for HCB Section and handling values */

		$('#content-hospital-cash-benefit').on('shown.bs.collapse', function () {
			$("#pa-hcb-insured-slider").owlCarousel({
				items: 4,
				navigation: true,
				navigationText: ["",""],
			});
		}); /* This event triggers we select HCB as YES */

		$('#content-hospital-cash-benefit').on('hidden.bs.collapse', function () {
			angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
				v.PDL = "0";
				v.no_of_days = "0";
				v.HCB = "N";
			});
			pAC.calculatePremium(pACalculatePremiumParams);
		}); /* This event triggers when we select HCB as no */

	/* Ending of loading slick slider */
	
	
	/* To Fetch PA Quote Details */

		pAC.fetchQuoteDetails = function(){
			var reqData = $rootScope.encrypt({
				"ReferenceNumber": sessionStorage.getItem('rid')
			});  
			aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetQuoteDetails",{
				"_data": reqData
			},true,{
				headers:{
					'Content-Type': 'application/json'
				}
			})
				.then(function(data){
					var data = JSON.parse($rootScope.decrypt(data._resp))
					if(data.ResponseCode == 1){
                        aS.triggerSokrati(); /* Triggering Sokrati */
						pAC.quoteDetails = data.ResponseData;
						pAC.tenureSelect = pAC.quoteDetails.PAQuote.PAQuoteDetails[0].TENURE;
						pAC.currentPlan = "pa"+pAC.quoteDetails.PAQuote.PAQuoteDetails[0].plan;
						pAC.hCBCollapse = pAC.quoteDetails.PAQuote.PAQuoteDetails[0].HCB;
						if(pAC.hCBCollapse == 'Y'){
							$('#content-hospital-cash-benefit').collapse('show');
						}
						pACalculatePremiumParams.PA.PAPremiumList = pAC.quoteDetails.PAQuote.PAQuoteDetails;
						var toStop = 0;
						for(var i = 0; i<pAC.quoteDetails.PAQuote.PAQuoteDetails.length;i++){
							if(pAC.EMIPCover != 'Y' && pAC.quoteDetails.PAQuote.PAQuoteDetails[i].EMIP == 'Y'){
								toStop = toStop + 1;
								pAC.EMIPCover = 'Y';
								$('#emi-protect').collapse('show');
							}
							if(pAC.LoanProtectCover != 'Y' && pAC.quoteDetails.PAQuote.PAQuoteDetails[i].EMIP == 'Y'){
								toStop = toStop + 1;
								pAC.LoanProtectCover = 'Y';
								$('#loan-protect').collapse('show');
							}
							if(pAC.TTD != 'Y' && pAC.quoteDetails.PAQuote.PAQuoteDetails[i].TTD == 'Y'){
								toStop = toStop + 1;
								pAC.TTD = 'Y';
								$('#total-disablement-div').collapse('show');
							}
							if(toStop > 2){
								break;
							}
						}
						pAC.calculatePremium();
					}else{
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Error",
							"modalBodyText": "Some error ocurred.",
							"showCancelBtn": false,
							"modalSuccessText" : "Ok",
							"showAlertModal": true
						}
					}
				},function(err){

				});
		}

		pAC.fetchQuoteDetails();

	/* End of fetching quote details */


	/* To Fetch Sum Insured Data */

		aS.getData("assets/data/sum-insured.json","",false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(data){
				if(data.ResponseCode == 1){
					pAC.sumAmounts = data.ResponseData;
				}
			},function(err){

			})

	/* End of fetching sum insured data */


	/* Change btn click in sum insured display section */

		pAC.changeSI = function(){
			$location.url('pa-quote');
		}

	/* End of change btn click in sum insured display section */


	/* Change event of daily cash limit in HCB */

		pAC.changePDL = function(cashLimit,index){
			if(cashLimit == ""){
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Hospital Cash Benefit for "+pAC.quoteDetails.PAQuote.PAQuoteDetails[index].RelationWithProposer+" has been removed.",
					"showCancelBtn": false,
					"modalSuccessText" : "Ok",
					"showAlertModal": true
				}
				pAC.quoteDetails.PAQuote.PAQuoteDetails[index].no_of_days = "";
				pAC.quoteDetails.PAQuote.PAQuoteDetails[index].HCB = "N";
				pAC.calculatePremium(pACalculatePremiumParams);
			}else{
				pAC.quoteDetails.PAQuote.PAQuoteDetails[index].HCB = "Y";
				$timeout(function(){
					var nOD = pAC.quoteDetails.PAQuote.PAQuoteDetails[index].no_of_days;
					(nOD != "" && nOD != 0 && nOD != null) ? pAC.calculatePremium(pACalculatePremiumParams) : "";
				},600);
			}
		}

	/* End of Change event of daily cash limit in HCB */


	/* To change number of days in HCB */

		pAC.changeDays = function(days,index){
			if(days == "" || days == "0"){
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Please select proper days value.",
					"showCancelBtn": false,
					"modalSuccessText" : "Ok",
					"showAlertModal": true
				}
				pAC.quoteDetails.PAQuote.PAQuoteDetails[index].HCB = "N";
				pAC.quoteDetails.PAQuote.PAQuoteDetails[index].PDL = "";
				pAC.calculatePremium(pACalculatePremiumParams);
			}else{
				angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
					if(v.PDL != "" && v.PDL != 0 && v.PDL != null){
						v.no_of_days = days;
						v.HCB = "Y";
					}
				});
				$timeout(function(){
					pAC.calculatePremium(pACalculatePremiumParams);
				},600);
			}
		}

	/* End of changing number of days in HCB */


	/* Removing Hospital Cash Benefit of Particular Member */

		pAC.removeHCB = function(member){
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Warning",
				"modalBodyText": "Are you sure you want to remove Hospital Cash Benefit for "+member.RelationWithProposer+" ?",
				"showCancelBtn": true,
				"modalSuccessText" : "Yes",
				"modalCancelText" : "No",
				"showAlertModal": true,
				"positiveFunction": function(){
					member.PDL = "";
					member.no_of_days = "";
					member.HCB = "N";
					pAC.calculatePremium(pACalculatePremiumParams);
				}
			}
		}

	/* End of removing hospital cash benefit of Particular Member */


	/* To duplicate HCB */

		pAC.duplicateHCB = function(){
			if(angular.isUndefined(pAC.duplicatePDL) || angular.isUndefined(pAC.duplicatenNOD)){
				return false;
			}
			angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
				v.PDL = pAC.duplicatePDL;
				v.no_of_days = pAC.duplicatenNOD;
				v.HCB = "Y";
			});
			pAC.calculatePremium(pACalculatePremiumParams);
		}

	/* End of duplicating HCB */


	/* To calculate premium */

		pAC.calculatePremium = function(data){
			delete pAC.quoteDetails.PremiumDetail;
			aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetPremium",pACalculatePremiumParams,false,{
				headers:{
					'Content-Type': 'application/json'
				}
			})
				.then(function(data){
					if(data.ResponseCode == 1){
						pAC.quoteDetails.PremiumDetail = data.ResponseData;
						pAC.quoteDetails.PremiumDetail.TotalPremium = 0;
                        if(!angular.isUndefined(pAC.CSPremium)){
                        	pAC.fetchPremiumsSecondary();
						}
						for(var i = 0;i<pAC.quoteDetails.PremiumDetail.ProductPremium.length;i++){
                            pAC.quoteDetails.PremiumDetail.TotalPremium = parseInt(pAC.quoteDetails.PremiumDetail.TotalPremium) + parseInt(pAC.quoteDetails.PremiumDetail.ProductPremium[i].Premium);
                           	if(pAC.quoteDetails.PremiumDetail.ProductPremium[i].ProductCode == 'CI'){
                                pAC.ciActPremium = pAC.quoteDetails.PremiumDetail.ProductPremium[i].Premium;
                            }else if(pAC.quoteDetails.PremiumDetail.ProductPremium[i].ProductCode == 'CS'){
                                pAC.csActPremium = pAC.quoteDetails.PremiumDetail.ProductPremium[i].Premium;
                            }
                        }
					}else{
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Error",
							"modalBodyText": data.ResponseMessage,
							"showCancelBtn": false,
							"modalSuccessText" : "Ok",
							"showAlertModal": true
						}
					}
				},function(err){

				});
		}

	/* End of calulating premium */


	/* Select Optional Cover */

		pAC.selectOptionalCover = function(){
			var toStop = false;
			$rootScope.callGtag('click-accordion','customize-quote','pa-cust-quote_plan['+pAC.quoteDetails.PAQuote.PAQuoteDetails[0].plan+']_optional-covers');
			for(var i = 0; i < pAC.quoteDetails.PAQuote.PAQuoteDetails.length;i++){
				if(pAC.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer == 'SELF'){
					if(pAC.quoteDetails.PAQuote.PAQuoteDetails[i].suminsured < 500001){
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Warning",
							"modalBodyText": "The sum insured should be greater than 5,00,000",
							"showCancelBtn": false,
							"modalSuccessText" : "Yes",
							"showAlertModal": true,
							"positiveFunction": function(){
								pAC.optionalCovers = 'N';
								$('#optional-covers').slideUp();
							}
						}
					}
					break;
				}
			}
			if(pAC.optionalCovers == 'Y'){
				$('#optional-covers').slideDown();
				$('html,body').animate({scrollTop: $("#optional-covers").offset().top - 300},'slow');
			}else{
				$('#optional-covers').slideUp();
			}
		}

	/* End of selcting optioanl Cover */


	/* Optional Cover change (Radio Buttons on/off) */

		pAC.optionalCoversChange = function(paramToChange,paramUpdateValue,premiumCalculate){
			angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
				v[paramToChange] = paramUpdateValue;
			});
			if(premiumCalculate){
				pAC.calculatePremium(pACalculatePremiumParams);
			}
		}

	/* End of optional cover change */


	/* To change broken bone benefits */

		pAC.changeBBB = function(val){
			angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
				v.BBB_suminsured = val;
			});
			pAC.calculatePremium(pACalculatePremiumParams);
		}

	/* End of changing broken bone benefits */


	/* To change burn benefit event */

		pAC.changeBB = function(val){
			angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
				v.BB_suminsured = val;
			});
			pAC.calculatePremium(pACalculatePremiumParams);
		}

	/* End of changing burn benefit event */


	/* To select earning member for particular member */

		pAC.selectOCEarningMembers = function(coverSumInsured,member,coverSelect,coverSumInsuredParam){
			member[coverSelect] = 'Y';
			member[coverSumInsuredParam] = coverSumInsured;
			pAC.calculatePremium(pACalculatePremiumParams);
		}

	/* End of selcting earning member for particular member */


	/* To check whether earning member is selected or not for particulr cover */

		pAC.selectEarningMember = function(member,coverSelect,coverSumInsuredParam){
			if(member.risk == "3"){
				$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Error",
							"hideCloseBtn": true,
							"modalBodyText": "Temporary & Total Disablement Optional Cover won't be applicable for your selected nature of duty.",
							"showCancelBtn": false,
							"modalSuccessText" : "Ok",
							"showAlertModal": true,
							"positiveFunction": function(){
								member[coverSelect] = 'N';
								return false;
							}
						}
			}
			if(member[coverSelect] == 'N'){
				member[coverSelect] = 'N';
				member[coverSumInsuredParam] = "0";
				pAC.calculatePremium(pACalculatePremiumParams);
			}
		}

	/* End of checking whether earning member is selected or not for particular cover */


	/* To check earning member optional cover section */

		pAC.changeEarningBenefitCover = function(coverCode,coverKey,coverSIKey){
			if(coverCode == 'N'){
				angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
					v[coverKey] = 'N';
					v[coverSIKey] = '0';
				});
				pAC.calculatePremium(pACalculatePremiumParams);
			}
		}

	/* End of checking earning member optional cover section */


	/* Function to validate earning members optional covers */

		function earningOptionalCoverValidation(member){
			var maxTtd;
			var maxLp;
			var alertError = "<ul>";
			if(member.TTD == 'Y'){
				for(var i = 0; i<pAC.ttd_covers.length;i++){
					if(pAC.ttd_covers[i] < (member.AnnualIncome * 2 /100)){
						maxTtd = pAC.ttd_covers[i];
					}else{
						break;
					}
				}
				if(member.TTD_Suminsured > maxTtd){
					alertError = alertError+"<li>Weekly benefit for Temporary & Total Disablement of "+member.RelationWithProposer+" changed to "+maxTtd+" as per annual income you entered.</li>";
				}
			}
			if(member.LP == 'Y'){
				for(var i = 0; i<pAC.loan_protect_covers.length;i++){
					if(pAC.loan_protect_covers[i] < ((member.suminsured+pAC.loan_protect_covers[i])*15)){
						maxLp = pAC.loan_protect_covers[i];
					}else{
						break;
					}
				}
				if(member.LP_Suminsured > maxLp){
					alertError = alertError+"<li>Weekly benefit for Loan Protect of "+member.RelationWithProposer+" changed to "+maxLp+" as per annual income you entered.</li>";
				}
			}
			alertError = alertError+"</ul>";
			if(alertError != "<ul></ul>"){
				$rootScope.alertConfiguration('E',alertError);
				member.TTD_Suminsured = maxTtd;
				member.LP_Suminsured = maxLp;
			}
		}

	/* End of function to validate earning member related optional covers */


	/* To manage kids sum insured */

		function manageKidsSumInsured(sum,v){
			if(parseInt(sum) < 1500000){
				v.suminsured = sum;
			}else if(parseInt(sum) < 3000000){
				v.suminsured = 1500000;
			}
		}

	/* End of managing kids sum insured */


	/* Sum Insured of user handling */

		pAC.calculateSumInsured = function(member,sum,index){
			if(sum < 3000000){
				angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
					if(v.RelationWithProposer == "KID" && sum <= 3000000){
						manageKidsSumInsured(sum,v);
					}else{
						v.suminsured = sum;
					}
				})
			}
			$timeout(function(){
				pAC.calculatePremium();
			},500);
		}

	/* End of sum insured of user handling */


	/* Annual Income Change event */

		pAC.calculateAnnualIncome = function(member){
			var chkAnnualIncome = 9999;
			if(pAC.currentPlan == "pa5"){
				chkAnnualIncome = 84000;
			}else if(pAC.currentPlan == "pa4" || pAC.CS){
				chkAnnualIncome = 42000;
			}
			if(member.AnnualIncome > chkAnnualIncome){
				member.EarningNonEarning = "Earning";
				var isProceed = true;
				var maxInsured;
				angular.forEach(pAC.sumAmounts,function(v,i){
					if(isProceed && v[pAC.currentPlan]){
						if(v.amount > (member.AnnualIncome*12)){
							isProceed = false;
						}else{
							maxInsured = i;
						}
					}
				});
				if(member.suminsured > (member.AnnualIncome*12)){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "Sum Insured eligibility is 12 times the Annual Income ("+$filter('INR')(pAC.sumAmounts[maxInsured].amount)+").",
						"showCancelBtn": false,
						"modalSuccessText" : "Ok",
						"showAlertModal": true,
						"positiveFunction": function(){
							member.suminsured = pAC.sumAmounts[maxInsured].amount;
							earningOptionalCoverValidation(member);
							if(member.RelationWithProposer == "SELF"){
								pAC.calculateSumInsured(member.RelationWithProposer,member.suminsured,member.objIndex);
							}
						}
					}
				}else if(member.suminsured != pAC.sumAmounts[maxInsured].amount){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "You are eligible for Sum Insured up to ₹​ "+$filter('INR')(pAC.sumAmounts[maxInsured].amount)+". Do you wish to continue?",
						"showCancelBtn": true,
						"modalSuccessText" : "Yes",
						"showAlertModal": true,
						"modalCancelText": "No",
						"positiveFunction": function(){
							member.suminsured = pAC.sumAmounts[maxInsured].amount;
							earningOptionalCoverValidation(member);
							pAC.calculatePremium();
						},
						"negativeFunction": function(){
							earningOptionalCoverValidation(member);
							pAC.calculatePremium();
						}
					}
				}else{
					earningOptionalCoverValidation(member);
					pAC.calculatePremium();
				}
			}else{
				member.EarningNonEarning = "Non Earning";
				var errorAlert = "<div><p class='modal-bind-text'>You are not eligible for this product based on declared income.</p></div>";
                errorAlert = errorAlert + "<ul>";
				if(pAC.currentPlan == "pa5"){
					errorAlert = errorAlert+"<li>Minimum Annual Income required for Personal Accident Plan 5 is 84,000.</li>";
				}else if(pAC.currentPlan == "pa4"){
					errorAlert = errorAlert+"<li>Minimum Annual Income required for Personal Accident Plan 4 is 42,000.</li>";
				}else{
					errorAlert = errorAlert+"<li>Minimum Annual Income required for Personal Accident Plan 1/2/3 is 9,999.</li>";
				}
				if(pAC.CI){
					errorAlert = errorAlert+"<li>Minimum Annual Income required for Critical Illness is 9,999.</li>";
				}
				if(pAC.CS){
					errorAlert = errorAlert+"<li>Minimum Annual Income required for Cancer Secure is 42,000.</li>";
				}
				errorAlert = errorAlert + "</ul>";
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": errorAlert,
					"showCancelBtn": false,
					"modalSuccessText" : "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true,
					"positiveFunction": function(){
						member.AnnualIncome = "";
					}
				}
			}
		}

	/* End of annual income change event */


	/* To Save Quote Details */

		function saveQuoteDetails(event,actText){
			var lemeiskData   = pAC.quoteDetails.PAQuote.PAQuoteDetails
            
            
            $rootScope.leminiskObj =  {
            							"memberArray" : lemeiskData,
            							"preminumObj" : pAC.quoteDetails.PremiumDetail.TotalPremium
            							}

            $rootScope.lemniskCodeExcute($location.$$path);	
            
			aS.postData(ABHI_CONFIG.apiUrl+"GEN/UpdateQuoteDetails",{
				"ReferenceNumber": sessionStorage.getItem('rid'),
				"PAUpdateQuote": {
					"PAQuoteDetails" : pAC.quoteDetails.PAQuote.PAQuoteDetails
				}
			},true,{
				headers:{
					'Content-Type': 'application/json'
				}
			})
				.then(function(data){
					if(data.ResponseCode == 1){
						if(pAC.crossSell){
	                        $location.url('cross-sell-proposer-details');
	                    }else{
	                        $location.url('rfb-proposer-details');
	                    }
					}else{
						event.target.disabled = false;
						event.target.innerHTML = actText;
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Error",
							"modalBodyText": "Some error occurred",
							"showCancelBtn": false,
							"modalSuccessText" : "Ok",
							"showAlertModal": true
						}
					}
				},function(err){
					event.target.disabled = false;
					event.target.innerHTML = actText;
				});
		}

	/* Ending of saving quote details */


	/* PA cust Quote save button event */

		pAC.pAQuoteSubmit = function(event){
			var actText = angular.copy(event.target.innerHTML);
			event.target.disabled = true;
			event.target.textContent = "Submitting...";
			var errors = "<ul>";
			var errorsCount = 0;
			var chkAnnualIncome = 9999;
			if(pAC.currentPlan == "pa5"){
				chkAnnualIncome = 84000;
			}else if(pAC.currentPlan == "pa4" || pAC.CS){
				chkAnnualIncome = 42000;
			}
			var hcbPresent = false;
			angular.forEach(pAC.quoteDetails.PAQuote.PAQuoteDetails,function(v,i){
				if(v.TTD == "Y"){
						setTTDFlag = true;
				}
				if(v.HCB == "Y"){
					hcbPresent = true;
				}
				if(v.HCB == "Y" && (v.no_of_days == "" || v.no_of_days == 0)){
					errors = errors+"<li><p>Please select No. of days of "+v.RelationWithProposer+".</p></li>";
					errorsCount = errorsCount + 1;
				}
				if(v.HCB == "Y" && (v.PDL == "" || v.PDL == 0)){
					errors = errors+"<li><p>Please select Hospital Cash Benefit of "+v.RelationWithProposer+".</p></li>";
					errorsCount = errorsCount + 1;
				}
				if(v.LP == "Y" && (v.LP_Suminsured == "" || v.LP_Suminsured == "0")){
					errors = errors+"<li><p>Please select weekly benefit of Loan Protect for "+v.RelationWithProposer+".</p></li>";
					errorsCount = errorsCount + 1;
				}
				if(v.EMIP == "Y" && (v.EMIP_Suminsured == "" || v.EMIP_Suminsured == "0")){
					errors = errors+"<li><p>Please select weekly benefit of EMI Protect for "+v.RelationWithProposer+".</p></li>";
					errorsCount = errorsCount + 1;
				}
				if(v.TTD == "Y" && (v.TTD_Suminsured == "" || v.TTD_Suminsured == "0")){
					errors = errors+"<li><p>Please select weekly benefit of Temporary & Total Disablement for "+v.RelationWithProposer+".</p></li>";
					errorsCount = errorsCount + 1;
				}
				if((v.suminsured >= 4000000 || v.EarningNonEarning == "Earning") && v.AnnualIncome < chkAnnualIncome){
					errors = errors+"<li><p>Please enter valid Annual Income of "+v.RelationWithProposer+".</p></li>";
					errorsCount = errorsCount + 1;
				}
			});
			if(pAC.hCBCollapse == 'Y' && !hcbPresent){
				errors = errors+"<li><p>Please select Hospital Cash Benefit for atleast one member.</p></li>";
				errorsCount = errorsCount + 1;
			}
			if(pAC.quoteDetails.PAQuote.PAQuoteDetails[0].BBB == 'Y' && pAC.quoteDetails.PAQuote.PAQuoteDetails[0].BBB_suminsured < 100){
				errors = errors+"<li><p>Please select broken bone benfit sum insured.</p></li>";
				errorsCount = errorsCount + 1;
			}
			if(pAC.quoteDetails.PAQuote.PAQuoteDetails[0].BB == 'Y' && pAC.quoteDetails.PAQuote.PAQuoteDetails[0].BB_suminsured < 100){
				errors = errors+"<li><p>Please select burn benfit sum insured.</p></li>";
				errorsCount = errorsCount + 1;
			}
			if(!setTTDFlag && pAC.TTD == "Y"){
				errors = errors+"<li><p>Please select valid data for TTD</p></li>";
				errorsCount = errorsCount + 1;
			}
			if(errorsCount == 0){
				saveQuoteDetails(event,actText);
			}else{
				errors = errors+"</ul>";
				event.target.disabled = false;
				event.target.innerHTML = actText;
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Errors",
					"modalBodyText": errors,
					"showCancelBtn": false,
					"modalSuccessText" : "Ok",
					"showAlertModal": true,
				}
			}
		}

	/* End of PA cust quote save button event */


	/* Redirect to back page funciton */

        pAC.backFunction = function() {
            $location.url('pa-quote');
        }

    /* Redirect to back page funciton ends */


}]);

/*

	End of controller
	PA Quote Controller
	Author: Pankaj Patil
	Date: 28-06-2018

*/