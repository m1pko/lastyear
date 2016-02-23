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
      dataShare.sendData($scope.lastfmuser + "@" + $scope.maxrecords + "@" + $scope.period);
    }

  };

}]);

lastyearApp.controller('lastFMAPIs', ['$scope','dataShare',
    function ($scope,dataShare) {         
         
      $scope.text = '';
      $scope.$on('data_shared',function(){
                                  var text =  dataShare.getData();
                                  var paramArray = text.split("@");
                                  lastFMAPICalls(paramArray[0],paramArray[1],paramArray[2],2015);
                                  //$scope.text = text;
        });
    }
]);

function lastFMAPICalls (lastfmuser, period, limit, year)
{
  var html = "";
  var once = 0;
  $(document).ready(function() {
      $.getJSON("http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=" + lastfmuser + "&period=" + period + "&limit=" + limit + "&api_key=8295890448112bd3f26d3bd606610fe2&format=json", function(json) {

          $.each(json.topalbums.album, function(i, item) {

            $.getJSON("http://ws.audioscrobbler.com/2.0/?method=album.getInfo&user=" + lastfmuser + "&artist=" + item.artist.name + "&album=" + item.name + "&api_key=8295890448112bd3f26d3bd606610fe2&format=json", function(json_album){

              $.each(json_album.album.tags, function(j, item_album){

                once = 0;

                $.each(item_album, function(k,item_album_child){

                  if (item_album_child.name == year && once == 0)
                  {
                    once++;
                    html += "<p><a href=" + item.url + " target='_blank'>" + item.artist.name + " - " + item.name + " - " + "Play count : " + item.playcount + " - Year : " + item_album_child.name + "</a></p>";
                    $('#topAlbumsYear').append(html);
                    html = "";
                  }

                });               
              });
            });
          });
      });
  });
}
