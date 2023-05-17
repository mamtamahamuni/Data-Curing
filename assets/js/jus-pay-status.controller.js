var jpApp = angular.module("juspayApp", []);

jpApp.controller("juspayController", ['$scope','$routeParams', function ($scope, $routeParams) {
    if($routeParams.status){
        $scope.status = $routeParams.status
    }
    else{
        $scope.status = ""
    }

}])