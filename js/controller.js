 //Angular Form Properties $valid, $invalid, $pristine, $dirty
var lastyearApp = angular.module('lastyearApp', []);

lastyearApp.controller('formController', function($scope) {

	// function to submit the form after all validation has occurred            
	$scope.submitForm = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) {
		  alert('our form is amazing');
		}

	};

	$scope.maxrecordsRegexp = /^(?!0)(?=100$|..$|.$)\d+$/;

});