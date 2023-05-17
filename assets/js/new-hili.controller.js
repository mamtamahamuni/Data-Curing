/*
	Name: Ext-Pre Quote Controller
	Author: Pankaj Patil
	Date: 10-09-2018
*/


var preApp = angular.module("extPreQuoteApp",[]);

preApp.controller("hiliController",['$rootScope','appService','ABHI_CONFIG','$location','$routeParams','productValidationService','$scope','$timeout' ,'$window',function($rootScope,appService,ABHI_CONFIG,$location,$routeParams,productValidationService,$scope,$timeout,$window){

		var ePQA = this;
		var aS = appService;
		ePQA.consent = true;
		console.log(window.location.href)

		/*get pre populated Value from life insurance service by passing refernce number to service*/
		function getPageData(param){
				aS.postData(ABHI_CONFIG.apiUrl +"gen/GetLifeInsuranceData",{
					 "LifeRefNo": param
					},true,{
						headers:{
							'Content-Type': 'application/json'
						}
					})
				.then(function(data){
					console.log(data)
					ePQA.hiLiData = data.ResponseData;
					/*var tableValue = '<table align="center" border="0" cellpadding="6" cellspacing="0" class="table"> <tbody> <tr> <td bgcolor="#C5252F" style="font-weight:bold; color:#fff;" valign="bottom">Fields</td> <td bgcolor="#C5252F" style="font-weight:bold; color:#fff;" valign="bottom">Value</td> </tr> <tr> <td align="left" style="font-weight:bold;" valign="top">Name</td> <td align="left" colspan="2" valign="top">'+data.ResponseData.FirstName +' '+data.ResponseData.LastName+'</td> </tr> <tr> <td align="left" style="font-weight:bold;" valign="top">Date Of Birth</td> <td align="left" colspan="2" valign="top">'+data.ResponseData.DOB+'</td> </tr> <tr> <td align="left" style="font-weight:bold;" valign="top">Gender</td> <td align="left" colspan="2" valign="top">'+data.ResponseData.Gender +'</td> </tr> <tr> <td align="left" style="font-weight:bold;" valign="top">Mobile</td> <td align="left" colspan="2" valign="top">'+data.ResponseData.Mobile+'</td> </tr> <tr> <td align="left" style="font-weight:bold;" valign="top">Email</td> <td align="left" colspan="2" valign="top">'+data.ResponseData.Email+'</td> </tr> <tr> <td align="left" style="font-weight:bold;" valign="top">PinCode </td> <td align="left" colspan="2" valign="top">'+data.ResponseData.PinCode+'</td> </tr> <tr> <td align="left" style="font-weight:bold;" valign="top">PanNumber </td> <td align="left" colspan="2" valign="top">'+data.ResponseData.PanNumber+'</td> </tr> <!-- <tr><td bgcolor="#694743" colspan="4" style="color:#fff; font-weight:bold;">I. &nbsp; Basic Covers</td></tr> --> </tbody></table>'*/
					$('#alertBoxModal1').modal({backdrop: 'static', keyboard: false});
				},function(err){
				});
		}
	/* het pre populated data from life insurance serice ends */

	if(!angular.isUndefined($routeParams.lifeRefNo)){
		
	}

		

		

		ePQA.clickToPrefill = function(param){
			if(param == '1'){
				getPageData($routeParams.lifeRefNo.toString())
				//window.location.href =  'https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/activ-assure-pre-quote?lifeRefNo='+$routeParams.lifeRefNo+"&source="+$routeParams.source
			}else{
				window.location.href =  'https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/activ-assure-pre-quote?source='+$routeParams.source
			}
		}
		ePQA.navigateProductPage = function(param){
			if(param == '1'){
				//getPageData($routeParams.lifeRefNo.toString())
				window.location.href =  'https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/activ-assure-pre-quote?lifeRefNo='+$routeParams.lifeRefNo+"&source="+$routeParams.source
			}else{
				window.location.href =  'https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/#!/activ-assure-pre-quote?source='+$routeParams.source
			}
		}


	

}]);

/*	
	End of controller
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/