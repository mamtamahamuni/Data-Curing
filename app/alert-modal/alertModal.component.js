
// Source: alertModal.component.js
app.directive('alertcontainer', ['$timeout', function($timeout){
	function Controller($scope, $rootScope){
		var aD = this;
		$rootScope.alertData = {
			"showAlertModal" : false
		}
		$rootScope.$watch("alertData",function(n,o){
			if(n.showAlertModal){
				aD.alertData = $rootScope.alertData;
				$('#alertBoxModal').modal({backdrop: 'static', keyboard: false});
			}else{
				$('#alertBoxModal').modal("hide");
			}
		})

		aD.closeModal = function(){
			$rootScope.alertData.showAlertModal = false;
			if(!angular.isUndefined(aD.alertData.gtagCrossFunction)){
				var crossGtag = aD.alertData.gtagCrossFunction.split(',');
				$rootScope.callGtag(crossGtag[0] , crossGtag[1] , crossGtag[2]);
			}
		}

		aD.successFunction = function(){
			if(!angular.isUndefined(aD.alertData.positiveFunction)){
				aD.alertData.positiveFunction();
			}
			if(!angular.isUndefined(aD.alertData.gtagPostiveFunction)){
				var postiveGtag = aD.alertData.gtagPostiveFunction.split(',')
				$rootScope.callGtag(postiveGtag[0] , postiveGtag[1] , postiveGtag[2])
			}
		}

		aD.errorFunction = function(){
			if(!angular.isUndefined(aD.alertData.negativeFunction)){
				aD.alertData.negativeFunction();
			}
			if(!angular.isUndefined(aD.alertData.gtagNegativeFunction)){
					var negativeGtag = aD.alertData.gtagNegativeFunction.split(',')
					$rootScope.callGtag(negativeGtag[0] , negativeGtag[1] , negativeGtag[2])
			}
		}

		// $('#alertBoxModal').on('hidden.bs.modal', function() {
		// 	if(aD.alertData){
	 //            $timeout(function(){
	 //            	if(!angular.isUndefined(aD.alertData.negativeFunction)){
		// 				aD.errorFunction();
		// 			}
		// 			if(!angular.isUndefined(aD.alertData.positiveFunction)){
		// 				aD.successFunction();
		// 			}
	 //            },300);
		// 	}
  //       })
	}


	return {
		scope: "=",
		controller: Controller,
		controllerAs: "aD",
		restrict: 'E', 
		templateUrl: 'partials/alertModal.component.html',
		link: function($scope, iElm, iAttrs, controller) {
		}
	};
}]);
