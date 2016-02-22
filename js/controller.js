 //Angular Form Properties $valid, $invalid, $pristine, $dirty
var lastyearApp = angular.module('lastyearApp', []);

lastyearApp.factory('dataShare',function($rootScope){
  var service = {};
  service.data = false;
  service.sendData = function(data){
      this.data = data;
      $rootScope.$broadcast('data_shared');
  };
  service.getData = function(){
    return this.data;
  };
  return service;
});

lastyearApp.controller('formController', ['$scope','dataShare',function($scope,dataShare) {

  $scope.maxrecordsRegexp = /^(?!0)(?=100$|..$|.$)\d+$/;

  // function to submit the form after all validation has occurred            
  $scope.submitForm = function(isValid) {

    // check to make sure the form is completely valid
    if (isValid) {
      alert('our form is amazing');
      dataShare.sendData($scope.lastfmuser + "-" + $scope.maxrecords + "-" + $scope.period);
    }

  };

}]);

lastyearApp.controller('lastFMAPIs', ['$scope','dataShare',
    function ($scope,dataShare) {         
         
      $scope.text = '';
      $scope.$on('data_shared',function(){
                                  var text =  dataShare.getData();    
                                  $scope.text = text;
        });
    }
]);
