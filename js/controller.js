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
  $scope.yearsrangeRegexp = /^201[5-9]$/;

  //$scope.items = ['overall','7day','1month','3month','6month','12month'];
  //$scope.items.selected = $scope.items[0].value;

  // function to submit the form after all validation has occurred            
  $scope.submitForm = function(isValid) {

    // check to make sure the form is completely valid
    if (isValid) {
      dataShare.sendData($scope.lastfmuser + "@" + $scope.maxrecords + "@" + $scope.period + "@" + $scope.year);
    }

    $scope.buttonState = true;

    $scope.lastfmuser = "";
    $scope.maxrecords = "";
    $scope.period = "";
    $scope.year = "";

  };

  $scope.isFormShowing = true;
  $scope.isListShowing = false;

  $scope.hideForm = function () {
    //If DIV is hidden it will be visible and vice versa.
    $scope.isFormShowing = false;
    $scope.isListShowing = true;
    $scope.userForm.lastfmuser.$touched = false;

  };
  $scope.hideList = function () {
    //If DIV is hidden it will be visible and vice versa.
    $scope.isFormShowing = true;
    $scope.isListShowing = false;
    $scope.buttonState = false;

    $scope.year = "";
    $scope.lastfmuser = "";
    $scope.maxrecords = "";
    $scope.period = "";

  };

  $scope.deleteDivContent = function()
                          {
                            var divElem = angular.element(document.querySelector('#topAlbumsYear'));
                            divElem.empty();
                          };



}]);

lastyearApp.controller('lastFMAPIs', ['$scope','dataShare',
    function ($scope,dataShare) {         
         
      $scope.text = '';
      $scope.$on('data_shared',function(){
                                  var text =  dataShare.getData();
                                  var paramArray = text.split("@");
                                  lastFMAPICalls(paramArray[0],paramArray[1],paramArray[2],paramArray[3]);
                                  //var divElem = angular.element(document.querySelector('#topAlbumsYear'));
                                  //alert(divElem.t);
                                  //divElem.text == ""
                                  //if (divElem.text == "")
                                  //{
                                  //  $('#topAlbumsYear').append("<p>Nothing to list...</p>");
                                  //}
      });
      
    }
]);

lastyearApp.controller('footerNotes', ['$scope', function ($scope) {

  var separator = " - ";
  var startYear = "2016";
  var currentYear = new Date().getFullYear();

  if (startYear.localeCompare(currentYear) == 0)
  {
    $scope.yearsInBusiness = startYear;
  }
  else
  {
    $scope.yearsInBusiness = startYear + separator + currentYear;
  }

}]);

function lastFMAPICalls (lastfmuser, limit, period, year)
{
  var html = "";
  var once, global_once, album_iterator = 0;
  var data_boo = false;
  var albumArray = [];
  $(document).ready(function() {
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=" + lastfmuser + "&period=" + period + "&limit=" + limit + "&api_key=8295890448112bd3f26d3bd606610fe2&format=json", function(json) {

        $.each(json.topalbums.album, function(i, item) {

          //alert(item.image);

          $.getJSON("http://ws.audioscrobbler.com/2.0/?method=album.getInfo&user=" + lastfmuser + "&artist=" + item.artist.name + "&album=" + item.name + "&api_key=8295890448112bd3f26d3bd606610fe2&format=json", function(json_album){

            $.each(json_album.album.tags, function(j, item_album){

              once = 0;

              $.each(item_album, function(k,item_album_child){

                if (item_album_child.name == year && once == 0)
                {
                  once++;
                  global_once++;
                  data_boo = true;

                  //lazy initialization
                  if (!albumArray[album_iterator])
                  {
                    albumArray[album_iterator] = [];
                  }

                  albumArray[album_iterator][0] = item.name;
                  albumArray[album_iterator][1] = item.artist.name;
                  albumArray[album_iterator][2] = item.url;
                  albumArray[album_iterator][3] = item.playcount;
                  album_iterator++;
                  
                  html += "<center><p><a href=" + item.url + " target='_blank'>" + item.artist.name + " - " + item.name + " - " + "Play count : " + item.playcount + "</a></p></center>";
                  $('#topAlbumsYear').append(html);
                  html = "";

                }

              });               
            });
          });
        });
    });

    if (!data_boo && global_once > 0)
    {
      $('#topAlbumsYear').append("<p>Nothing to list...</p>");
    }

  });

}
