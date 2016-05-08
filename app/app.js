var app = angular.module('app', ['ngRoute', 'ngCookies', 'ui.bootstrap','angularUtils.directives.dirPagination','firebase','ui.router','cfp.loadingBar','luegg.directives','imageResizer']);

app.run(function ($rootScope,$location,$cookieStore) {

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        

          if($cookieStore.get('StaffInfo').currentLoggedIn.email){


            $rootScope.accountInfo = $cookieStore.get('AccountInfo');
            $location.path('/main');
           
          }

          else if($cookieStore.get('StaffInfo').currentLoggedIn.email === undefined){
              $location.path('/login');
          }
                     
  });



});

app.config(function($stateProvider, $urlRouterProvider,paginationTemplateProvider,cfpLoadingBarProvider,$compileProvider) {

    cfpLoadingBarProvider.includeSpinner = false;
    paginationTemplateProvider.setPath('bower_components/angular-utils-pagination/dirPagination.tpl.html');
     $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);
    $urlRouterProvider.otherwise("/login")

    $stateProvider

        .state('login',{
            url:"/login",
            templateUrl:'templates/log.html'
        })
        .state('main',{

            url:"/main",
            templateUrl:'templates/main.html',
            controller:'MainCtrl',
            resolve:{
                validate: function ($rootScope,$cookieStore){
                    if(!$cookieStore.get('StaffInfo')){
                      $location.path('/login');
                    }
                }
            }
        })
        .state('main.home',{

            url:'/home',
            templateUrl:'templates/content/home.html'
        })
        .state('main.post',{
            url:"/post",
            templateUrl:"templates/content/post.html"
        })
        .state('main.update',{
            url:'/newsupdate',
            templateUrl:"templates/content/upnews.html"
        })

        .state('main.traffic',{
          url:'/traffic',
          templateUrl:"templates/content/traffic.html",
          controller:"TrafficCtrl"
        })

        .state('main.archivenews',{
          url:'/archivenews',
          templateUrl:"templates/content/archivenews.html",
          controller:"ArchiveCtrl"
        })

        .state('main.jobs',{
          url:'/jobs',
          templateUrl:"templates/content/jobs.html"
        })
        .state('main.accounts',{
          url:'/accounts',
          templateUrl:"templates/content/accounts.html",
          controller:"AccountCtrl"
        })
        .state('main.events',{
          url:'/events',
          templateUrl:'templates/content/events.html'
        })
        .state('main.programs',{
          url:'/program',
          templateUrl:'templates/content/program.html'
        })
        .state('main.feedback',{
          url:'/feedback',
          templateUrl:'templates/content/feedback.html',
          controller:"FeedbackCtrl"
        })
        .state('main.mobilecontent',{
          url:'/mobilecontent',
          templateUrl:'templates/content/mobcon.html'
        })
        .state('main.mobilecontent.about',{
            url:'/about',
            templateUrl:'templates/content/about.html',
            controller:'AboutCtrl'
        })
        .state('main.mobilecontent.tourism', {
            url:'/tourism',
            templateUrl:'templates/content/tourattract.html',
            controller:'TourismCtrl'
        })
        .state('main.mobilecontent.officials', {
          url:"/officials",
          templateUrl:'templates/content/officials.html',
          controller:'OfficialsCtrl'
        })
        .state('main.mobilecontent.hotline', {
          url:"/hotline",
          templateUrl:'templates/content/hotline.html',
          controller:'HotlineCtrl'
        })
        .state('main.mobilecontent.business', {
          url:"/business",
          templateUrl:'templates/content/business.html',
          controller:'BusinessCtrl'
        })

        .state('main.content', {
          url:"/content",
          templateUrl:'templates/content/archivecontent.html'
        })
        .state('main.settings', {
            url:"/settings",
            templateUrl:'templates/content/settings.html',
            controller:'SettingsCtrl'
        })
        .state('main.accounts.accountlist', {
          url:"/accountlist",
          templateUrl:'templates/content/accountlist.html',
          controller:'AccountListCtrl'
        })
        .state('main.chat',{
          url:"/chat",
          templateUrl:'templates/content/chat.html'
        })

        .state('main.flood',{
          url:"/flood",
          templateUrl:'templates/content/flood.html',
          controller:'FloodCtrl'
        })

        .state('main.incident',{
          url:"/incident",
          templateUrl:'templates/content/incidentreport.html',
          controller:'IncidentCtrl'
        })
        .state('main.print', {
          url:"/print",
          templateUrl:'templates/content/print.html',
          controller:'PrintCtrl'
        })
        ;




});

app.value('loader', {show: false});
/*
app.controller('MainCtrl', function($scope, $routeSegment, loader) {

    $scope.$routeSegment = $routeSegment;
    $scope.loader = loader;

    $scope.$on('routeSegmentChange', function() {
        loader.show = false;
    })
});
*/


app.controller('LoginCtrl', ['$scope','$firebaseAuth','$location','$stateParams','$modal','$cookies','cfpLoadingBar','AuthenticationService','$timeout',function ($scope,$firebaseAuth,$location,$modal,$stateParams,$cookies,cfpLoadingBar,AuthenticationService,$timeout) {
var ref = new Firebase("https://marilenewsdatabase.firebaseio.com");
     var loginObj = $firebaseAuth(ref);

    $scope.loginAccount = function (event){
        cfpLoadingBar.start();
    $scope.loginError = false;
    event.preventDefault();

    var email = $scope.account.email;
    var password = $scope.account.pass;
    var accountStatus = "";

      var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo").orderByChild("Email").equalTo(email);

      ref2.on("child_added", function (snapshot){
          accountStatus = snapshot.val().Status;
            if(accountStatus == "Active"){
              isActive();
            }
            else if(accountStatus == "Inactive"){
              alert("Account is already Deactivated!");
              cfpLoadingBar.complete();
            }
      });


    function isActive() {
        Firebase.enableLogging(true);
        Firebase.INTERNAL.forceWebSockets();
    
    ref.authWithPassword({
            email: email,
            password: password
        }, function(error, authData) {
  if (error) {
    alert(error);
    cfpLoadingBar.complete();
  } else {
    AuthenticationService.setCredentials(email,authData);

     AuthenticationService.getAccountInformation(email);

          console.log("Authenticated successfully with payload:", authData);
      cfpLoadingBar.complete();
  
    $location.path('/main');
    

  
  }
});
    }


}

    $scope.resetPassword = function (email){

        $scope.account.email = "";
    
               var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo").orderByChild("Email").equalTo(email);

                ref3.on("child_added", function (snapshot){
                var accStatus = snapshot.val().Status;
            if(accStatus == "Active"){
              isActive();
            }
            else if(accStatus == "Inactive"){
              alert("Account is already Deactivated!");
              cfpLoadingBar.complete();
            }
      });

      function isActive(){

        var ref = new Firebase("https://marilenewsdatabase.firebaseio.com");
           ref.resetPassword({
            email: email
          }, function(error) {
            if (error) {
             switch (error.code) {
                case "INVALID_USER":
                  alert("The specified user account does not exist.");
               break;
               default:
                  alert("Error resetting password:", error);
             }
         } else {
                  alert("Password reset email sent successfully!");
                  $modal.close();
     }
});

      }

}

}]);

app.controller("MainCtrl", function (AuthenticationService,$scope,$rootScope,$timeout,$cookieStore,$state,cfpLoadingBar){


$timeout(function() {
     $scope.currentActiveAccountEmail = $cookieStore.get('StaffInfo').currentLoggedIn.email;
      var lname= $cookieStore.get('AccountInfo').val.Lastname;
      var fname = $cookieStore.get('AccountInfo').val.Firstname;
      var initial = $cookieStore.get('AccountInfo').val.Initial;
      if(initial){
          initial = initial+"."
      }
      else{
        initial = "";
      }
      $rootScope.currentActiveAccountName = lname+", "+fname+" "+initial;
    
      $scope.currentAccountStatus = $cookieStore.get('AccountInfo').val.Type;

    }, 500);
    $scope.clearData = function (){
        AuthenticationService.clearCredentials();
    }

    $scope.showPost = function () {
      cfpLoadingBar.complete();
      $state.go('main.post');
    }


    $scope.showTraffic = function () {
        cfpLoadingBar.complete();
      $state.go('main.traffic');
    }

    $scope.showUpdate = function (){
        cfpLoadingBar.complete();
      $state.go('main.update');
    }

     $scope.showMobileContent = function (){
        cfpLoadingBar.complete();
      $state.go('main.mobilecontent');
    }

    $scope.showHome = function () {
        cfpLoadingBar.complete();
      $state.go('main.home');
    }

    $scope.showFeedback = function () {
        cfpLoadingBar.complete();
      $state.go('main.feedback');
    }

    $scope.showJobs = function () {
        cfpLoadingBar.complete();
      $state.go('main.jobs');
    }
    $scope.showEvents = function () {
        cfpLoadingBar.complete();
      $state.go('main.events');
    }
      $scope.showPrograms = function () {
        cfpLoadingBar.complete();
      $state.go('main.programs');
    }
    $scope.showArchive = function () {
      cfpLoadingBar.complete();
      $state.go('main.archivenews');
    }
    $scope.showAccount = function () {
        cfpLoadingBar.complete();
      $state.go('main.accounts');
    }

    $scope.showSettings = function () {
        cfpLoadingBar.complete();
      $state.go('main.settings');
    }

    $scope.showAccountList = function () {
        cfpLoadingBar.complete();
      $state.go('main.accounts.accountlist');
    }

    $scope.showAbout = function () {
        cfpLoadingBar.complete();
          $state.go('main.mobilecontent.about');
    }
    $scope.showBusiness = function () {
        cfpLoadingBar.complete();
      $state.go('main.mobilecontent.business');
    }
    $scope.showOfficials = function () {
        cfpLoadingBar.complete();
      $state.go('main.mobilecontent.officials')
    }
    $scope.showHotline = function () {
        cfpLoadingBar.complete();
      $state.go('main.mobilecontent.hotline');
    }
    $scope.showTouristAttraction = function () {
        cfpLoadingBar.complete();
      $state.go('main.mobilecontent.tourism');
    }
   
    $scope.showFloodUpdate = function () {
      cfpLoadingBar.complete();
      $state.go('main.flood');
    }
    $scope.showIncidentReport = function () {
      cfpLoadingBar.complete();
      $state.go('main.incident');
    }
    $scope.showInteractiveChat = function () {
      cfpLoadingBar.complete();
      $state.go('main.chat');
    }
    $state.go('main.home');

    
});


app.controller("EventCtrl", function ($scope,$firebase,$modal,$cookieStore,cfpLoadingBar){
      
  cfpLoadingBar.start();

    $scope.eventlist = [];
    $scope.inactive = [];


    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Events/").orderByChild("Status").equalTo("Active");

    var objData = $firebase(ref);

    $scope.eventlist = objData.$asArray();


    var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Events/").orderByChild("Status").equalTo("Inactive");

    var objData1 = $firebase(ref2);

    $scope.inactive = objData1.$asArray();

  
    $scope.showEventModal = function (){
  
      var dataValue = {
          type:"new",
          obj:{}

      };

        console.log(1);
        var modalInstance = $modal.open({
               templateUrl: 'EventModal.html',
               controller:'EventInstanceCtrl',
          resolve:{
            eventContent: function (){
                  return dataValue;
            }
        }
      });
    }



      $scope.inactiveEvent = function (eventObject) {

          var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Events/"+eventObject.$id);

                 ref3.set({"EventTitle":eventObject.EventTitle,"Description":eventObject.Description,"EventDate":eventObject.EventDate
                  ,"Place":eventObject.Place,"DatePosted":eventObject.DatePosted,"Image":eventObject.Image,"Email":eventObject.Email,"Status":"Inactive"});

      }

       $scope.activeEvent = function (eventObject) {

          var ref4 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Events/"+eventObject.$id);

                 ref4.set({"EventTitle":eventObject.EventTitle,"Description":eventObject.Description,"EventDate":eventObject.EventDate
                  ,"Place":eventObject.Place,"DatePosted":eventObject.DatePosted,"Image":eventObject.Image,"Email":eventObject.Email,"Status":"Active"});

      }


      $scope.editEvents = function (events){

        var dataValue = {
          type:"edit",
          obj:events

      };
        var modalInstance = $modal.open({
               templateUrl: 'EventModal.html',
               controller:'EventInstanceCtrl',
          resolve:{
            eventContent: function (){
                  return dataValue;
            }
        }
      });
    }
});

app.controller("EventInstanceCtrl", function ($scope,$modalInstance,$firebase,eventContent,$cookieStore){
  $scope.events = {};
    $scope.def = {};
  var currentStatus = "";
  if(eventContent.type == "edit"){
    $scope.events.description = eventContent.obj.Description;
    $scope.events.location = eventContent.obj.Place;
    $scope.events.name = eventContent.obj.EventTitle;
    $scope.events.datetime = eventContent.obj.Date;
    $scope.events.contact = eventContent.obj.ContactNo;

    $scope.events.image = eventContent.obj.Image;
    $scope.def.image= eventContent.obj.Image;
    currentStatus = "edit";

  }
  else{
    currentStatus = "new";
  }

     var defaultImage = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");

       defaultImage.on("value", function (snapshot){
          def = snapshot.val();
          $scope.def.image = snapshot.val();
         $scope.dummy.images[0] =  $scope.def.image;
            
       });


 var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();


  

  $scope.saveEvents = function (){

    var ampm = $scope.events.time.getHours() >= 12 ? 'PM' : 'AM';
    var hr = $scope.events.time.getHours() % 12;
     hr =  hr ?  hr : 12;
    var minString = "";

    var eventMonth = $scope.events.date.getMonth()+1;
    var eventDay = $scope.events.date.getDate();
    var eventYear = $scope.events.date.getFullYear();



    var monthWord = ['January','February','March','April','May',
  'June','July','August','September','October','November',
  'December'];
  var daysArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  if(eventMonth<0){
    eventMonth = 0;
  }
  else{
    eventMonth = Math.abs(eventMonth-1);
  }
      var monthString = monthWord[eventMonth];
  


      if($scope.events.time.getMinutes()<10){
          minString="0"+$scope.events.time.getMinutes().toString();
      }
      else{
       minString= $scope.events.time.getMinutes().toString();
      }

      if(currentStatus == "new"){
        

           var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Events/");
            var eventPostRef =  ref.push({});
       var eventObject = {"EventTitle":$scope.events.name,"Description":$scope.events.description,"EventDate":eventMonth+"/"+eventDay+"/"+eventYear+"-"+hr+":"+minString+" "+ampm
                  ,"Place":$scope.events.location,"DatePosted":month+"/"+day+"/"+year,"Email":$cookieStore.get('StaffInfo').currentLoggedIn.email,"Status":"Active","ContactNo":$scope.events.contact,
                  "ServerTime":Firebase.ServerValue.TIMESTAMP,"DateString":monthString+" "+eventDay+","+eventYear};
        eventPostRef.setWithPriority(eventObject,0 - Date.now());
         var eventImage = eventPostRef.key();
        var imageRef2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/EventImage");
        imageRef2.child(eventImage).set({"Image":$scope.dummy.images[0]})

        alert("Event has been added!");
     



      }
      else if(currentStatus == "edit"){
          var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Events/"+eventContent.obj.$id);


          ref.set({"EventTitle":$scope.events.name,"Description":$scope.events.description,"EventDate":eventMonth+"/"+eventDay+"/"+eventYear+"-"+hr+":"+minString+" "+ampm
                  ,"Place":$scope.events.location,"DatePosted":month+"/"+day+"/"+year,"Email":$cookieStore.get('StaffInfo').currentLoggedIn.email,"Status":"Active",ContactNo:$scope.events.contact});

         var eventImage = ref.key();
        var imageRef2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/EventImage");
        imageRef2.child(imageRef2).set({"Image":$scope.dummy.images[0]})
          alert("updated successfully!");
      }
       
        $modalInstance.close();
  }


  $scope.closeEventModal = function (){
      $modalInstance.close();
  }
});

app.controller("JobsCtrl",function ($firebase,$scope,$modal,$cookieStore,cfpLoadingBar){
      cfpLoadingBar.start();
      $scope.joblist = [];
      $scope.inactive = [];
      var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Jobs/").orderByChild("Status").equalTo("Active");
      var objData = $firebase(ref);

      $scope.joblist = objData.$asArray();

      var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Jobs/").orderByChild("Status").equalTo("Inactive");
      var objData2 = $firebase(ref2);

      $scope.inactive = objData2.$asArray();
      
      console.log($scope.joblist);


      $scope.hideJobs = function (jobObject) {
          var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Jobs/");
            ref3.child(jobObject.$id).set({Position:jobObject.Position, Company:jobObject.Company,Qualifications:jobObject.Qualifications,
                PlaceOfInterview:jobObject.PlaceOfInterview,DateOfInterview:jobObject.DateOfInterview,DatePosted:jobObject.DatePosted, Email:jobObject.Email,"Status":"Inactive"});

      }

      $scope.showJobs = function (jobObject){
        var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Jobs/");
            ref3.child(jobObject.$id).set({Position:jobObject.Position, Company:jobObject.Company,Qualifications:jobObject.Qualifications,
                PlaceOfInterview:jobObject.PlaceOfInterview,DateOfInterview:jobObject.DateOfInterview,DatePosted:jobObject.DatePosted, Email:jobObject.Email,"Status":"Active"});

      }

     $scope.openModal = function (){
    var dataValue = {
          type:"new",
          obj:{}

      };
    var modalInstance = $modal.open({

      templateUrl: 'NewJobs.html',
      controller:'JobsIntanceCtrl',
        resolve: {
      jobsContent: function () {
          return dataValue;
        }
      }
    });
  
}

 $scope.editJobs = function (jobs){

   var dataValue = {
          type:"edit",
          obj:jobs

      };

        var modalInstance = $modal.open({

          templateUrl:'NewJobs.html',
          controller:'JobsIntanceCtrl',
          resolve:{
            jobsContent: function (){
                  return dataValue;
            }
          }
        });
    }

  $scope.removeJobs = function (jobsID){
        var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Jobs/"+jobsID);

        ref.remove();
  }

});

app.controller('JobsIntanceCtrl',function ($scope,$firebase,$modalInstance,jobsContent,$cookieStore){

    $scope.jobs = {};
  var currentDate = new Date()
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

      if(jobsContent.type == "edit"){
        console.log(jobsContent.obj.Status);
          $scope.jobs.company = jobsContent.obj.Company;
          $scope.jobs.qualification = jobsContent.obj.Qualifications;
          $scope.jobs.position = jobsContent.obj.Position;
          $scope.jobs.location = jobsContent.obj.PlaceOfInterview;
          $scope.jobs.interview = jobsContent.obj.DateOfInterview;
          $scope.jobs.status = jobsContent.obj.Status;
       
           $scope.jobs.contact = jobsContent.obj.ContactNo;
        
         


      }


      $scope.saveJobs = function (){

     var ampm = $scope.jobs.interviewtime.getHours() >= 12 ? 'PM' : 'AM';
      var hr = $scope.jobs.interviewtime.getHours() % 12;
     hr =  hr ?  hr : 12;
    var minString = "";

    var month = $scope.jobs.interviewdate.getMonth()+1;
    var day = $scope.jobs.interviewdate.getDate();
    var year = $scope.jobs.interviewdate.getFullYear();


      if($scope.jobs.interviewtime.getMinutes()<10){
          minString="0"+$scope.jobs.interviewtime.getMinutes().toString();
      }
      else{
       minString= $scope.jobs.interviewtime.getMinutes().toString();
      }

        if(jobsContent.type == "new"){
      var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Jobs/");
          ref.push({"Position":$scope.jobs.position,
            "Company":$scope.jobs.company,
            "Qualifications":$scope.jobs.qualification,
            "PlaceOfInterview":$scope.jobs.location,
            "DateOfInterview":month+"/"+day+"/"+year+"-"+hr+":"+minString+" "+ampm,
            "DatePosted":month+"/"+day+"/"+year,
            "Email":$cookieStore.get('StaffInfo').currentLoggedIn.email,
            "Status":"Active",
             "ContactNo":$scope.jobs.contact});
        
          alert("save successfully!");

          $modalInstance.close();
        }
        else if(jobsContent.type == "edit"){
        
              var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Jobs/");
              ref.child(jobsContent.obj.$id).set({Position:$scope.jobs.position, Company:$scope.jobs.company,Qualifications:$scope.jobs.qualification,
                PlaceOfInterview:$scope.jobs.location,DateOfInterview:month+"/"+day+"/"+year+"-"+hr+":"+minString+" "+ampm,DatePosted:jobsContent.obj.DatePosted, Email:$cookieStore.get('StaffInfo').currentLoggedIn.email,"Status": $scope.jobs.status,ContactNo:$scope.jobs.contact});
              alert("Update Successfully!");


          $modalInstance.close();
        }
       
      }

   $scope.closeModal = function (){
      $modalInstance.close();
  }
});


  
app.controller('PostCtrl',['$firebase','$scope','$cookies','cfpLoadingBar','$rootScope','$cookieStore','$state',function ($firebase,$scope,$cookies,cfpLoadingBar,$rootScope,$cookieStore,$state){

 

  $scope.config = {
    width: 300,
    height: 300,
    quality: 0.1
  };

  $scope.dummy = {};
  $scope.def = {};
  var def = "";
  
  cfpLoadingBar.start();


      var defaultImage = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");

       defaultImage.on("value", function (snapshot){
          def = snapshot.val();
          $scope.def.image = snapshot.val();
         $scope.dummy.images[0] = def;
            cfpLoadingBar.complete();
       });

  

    $scope.postNews = function (image){

       var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var days  = currentDate.getDay();

  var minString = "";
  var monthW = ['January','February','March','April','May',
  'June','July','August','September','October','November',
  'December'];
  var daysArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

   var con = confirm("Are you sure?");

   if(con == true){


      var minString = "";
         $scope.news.image = image;


    var monthIndex = month-1;

      if(monthIndex <0){
        monthIndex = 0;
      }
      alert(days);
    var dayIndex = days-1;

    if(dayIndex<0){
      dayIndex = 0;
    }

      var monthString = monthW[monthIndex];
      var dayString = daysArray[days];

         var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/");
     
   
        var string = $scope.news.image;
     var timeStamp = Firebase.ServerValue.TIMESTAMP;

        var newPostRef =  ref.push({});
        var refObj = {"Title":$scope.news.title,
             "Description":$scope.news.desc,
             "DatePosted":monthString+" "+date+", "+year+" "+dayString,
              "ServerTime":Firebase.ServerValue.TIMESTAMP,
             "Status":"Active",
             "Email":$cookieStore.get('StaffInfo').currentLoggedIn.email};
       
        newPostRef.setWithPriority(refObj,0 - Date.now());
         
         console.log(newPostRef.name());
         var newsImage = newPostRef.key();
         var saveImage = new Firebase("https://marilenewsdatabase.firebaseio.com/News/NewsImage");
         saveImage.child(newsImage).set({"Image":string});

         alert("News has been posted!");

         $scope.news.title = "";
         $scope.news.desc = "";
 
         $scope.dummy.images[0]= def;
    
       

    }
}


}]);

app.controller("NewsList",['$firebase','$scope','UpdateNewsInfo','$modal','cfpLoadingBar','$cookieStore',function ($firebase,$scope,UpdateNewsInfo,$modal,cfpLoadingBar,$cookieStore){
    cfpLoadingBar.start();
    $scope.currentPage = 1;
    $scope.dummy = {};
    $scope.newscontent={};
    $scope.def = {};
    var def = {};
    $scope.MonthYear = {};
      $scope.itemList3 = [];
      $scope.currentID=0;
      $scope.SelectedMonthYear = "";

     var currentDate = new Date();
      var month = currentDate.getMonth() + 1;
     var year = currentDate.getFullYear();
    var monthW = ['January','February','March','April','May',
  'June','July','August','September','October','November',
  'December'];


    var monthIndex = month-1;

      if(monthIndex <0){
        monthIndex = 0;
      }


    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+year+" - "+month+" ("+monthW[monthIndex]+")").orderByChild("Status").equalTo("Active");

    var objData = $firebase(ref);

    var obj = objData.$asArray();

    $scope.newslist = obj;
    console.log($scope.newslist);

     var ref1 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+year+" - "+month+" ("+monthW[monthIndex]+")").orderByChild("Status").equalTo("Inactive");

    var objData1 = $firebase(ref1);

    var obj1 = objData1.$asArray();

    $scope.InactiveNewslist = obj1;




    $scope.pageChangeHandler = function(num) {
  
  };

  $scope.displayData = function (title,desc,id,image){
       UpdateNewsInfo.setData(title,desc,id,image);
    
  };

  $scope.openModal = function (news){
 var newsContent = {
        news:news
    };
  
    var modalInstance = $modal.open({
   
      templateUrl: 'myModalContent.html',
      controller:'ModalInstanceCtrl',
      resolve: {
       newsContent: function () {
          return newsContent;
        }
      }
    });
    
}


  $scope.hideNews = function (news){
     var refNews = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+year+" - "+month+" ("+monthW[monthIndex]+")");
    refNews.child(news.$id).set({Title:news.Title,Description:news.Description,
      DatePosted:news.DatePosted,Image:news.Image,Status:"Inactive",Email:news.Email});
    alert("news has been hide!");
  }

  $scope.ActivateNews = function (news){
    var refNews = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+year+" - "+month+" ("+monthW[monthIndex]+")");
    refNews.child(news.$id).set({Title:news.Title,Description:news.Description,
      DatePosted:news.DatePosted,Image:news.Image,Status:"Active",Email:news.Email});
    alert("news has been activated!");
  }



}]);


app.controller('TrafficCtrl', function ($scope,$firebase,$modal,cfpLoadingBar,$cookieStore){

  cfpLoadingBar.start();

    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Traffic");

    var trafficObject = $firebase(ref);

    var trafficArray = trafficObject.$asArray();

    $scope.trafficList = trafficArray;


     $scope.openModal = function (type){

    var modalInstance = $modal.open({
   
      templateUrl: 'NewTraffic.html',
      controller:'TrafficInstance',
        resolve: {
      trafficContent: function () {
        var object = {
               type:"new",
               value:""
         };
          return object;
        }
   
      }

    });
  
}
  $scope.editModal = function (trafficObject){

      var modalEditInstance = $modal.open({
           templateUrl: 'EditTraffic.html',
           controller:'TrafficInstance',
            resolve:{
                trafficContent: function(){

                  var object = {
                      type:"edit",
                      value:trafficObject
                  };
                  return object;
                }
            }
      });
  }



  $scope.removeTraffic = function (trafficID){


   var con = confirm("Are you sure?");

   if(con == true){
     var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Traffic/"+trafficID);
       ref.remove();

   }
      
    }
});


app.controller("AccountCtrl", function ($scope,$firebase,$modal){

    $scope.showNewAccountModal = function (){
          var modalInstance = $modal.open({

      templateUrl: 'NewAccount.html',
      controller:'AccountInstanceCtrl'
    });
    }
});

app.controller("AccountInstanceCtrl", function ($scope,$modalInstance,$firebaseAuth,$firebase,$http,$cookieStore){
    $scope.account = {};

   var currentDate = new Date()
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();
  var minString = "";
  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr =  hr % 12;
  hr =  hr ?  hr : 12;

  if(min<10){
          minString = "0"+min.toString();
  }
  else{
    minString = min.toString();
  }

  var registeredDate = month+"/"+day+"/"+year+"-"+hr+":"+min+" "+ampm;


    var firebaseObj = new Firebase("https://marilenewsdatabase.firebaseio.com");
var auth = $firebaseAuth(firebaseObj);

    $scope.registerNewStaff = function (){
var email = $scope.account.email;
            var password = $scope.account.password;
            var emailMessage = "Hello "+$scope.account.lastname+" "+$scope.account.firstname+" "+$scope.account.initial+"! Your password is "+password;
    var isTrue = registerUserAccount();
     if(isTrue){
         var mailJSON ={
        "key": "q1KXI6y55B24unO7JSMDAQ",
        "message": {
          "html": emailMessage,
          "text":"" ,
          "subject": "MarileNews Account Password",
          "from_email": "marilenewsdatabaseapplication@gmail.com",
          "from_name": "MarileNews",
          "to": [
            {
              "email": ""+email,
              "name": ""+$scope.account.lastname+" "+$scope.account.firstname+" "+$scope.account.initial,
              "type": "to"
            }
          ],
          "important": false,
          "track_opens": null,
          "track_clicks": null,
          "auto_text": null,
          "auto_html": null,
          "inline_css": null,
          "url_strip_qs": null,
          "preserve_recipients": null,
          "view_content_link": null,
          "tracking_domain": null,
          "signing_domain": null,
          "return_path_domain": null
        },
        "async": false,
        "ip_pool": "Main Pool"
    };
    var apiURL = "https://mandrillapp.com/api/1.0/messages/send.json";
    $http.post(apiURL, mailJSON).
      success(function(data, status, headers, config) {
        alert('successful email send.');
        $scope.form={};
        console.log('successful email send.');
        console.log('status: ' + status);
        console.log('data: ' + data);
        console.log('headers: ' + headers);
        console.log('config: ' + config);
      }).error(function(data, status, headers, config) {
        console.log('error sending email.');
        console.log('status: ' + status);
      });
        
     }

   
 
    }

    function registerUserAccount() {
            var email = $scope.account.email;
            var password = $scope.account.password;
            if (email && password) {
                auth.$createUser(email, password)
                    .then(function() {
                      if($scope.account.initial==null){
                          $scope.account.initial="";
                      }
                      registerPIOAccountInfo($scope.account.email,$scope.account.lastname,$scope.account.firstname,$scope.account.initial,registeredDate);
                       alert('User creation success');
                       $modalInstance.close();
                    }, function(error) {
                        alert(error);

                        return false;
                    });
            }
            return true;
    }
    $scope.closeNewStaffModal = function (){
          $modalInstance.close();
    }

    function registerPIOAccountInfo(email,lastname,firstname,initial,registeredDate){
        var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo");
        ref.push({"Email":email,"Lastname":lastname,"Firstname":firstname,"Initial":initial,"Type":"Staff","Status":"Active","DateRegistered":registeredDate});

        alert("registered user info has been added!");
    }


});

app.controller('TrafficInstance', function ($scope,$modalInstance,$firebase,trafficContent,$cookieStore){
    $scope.edit = {};
    if(trafficContent.type=="edit"){
 
          $scope.edit.loc = trafficContent.value.Location;
          $scope.edit.time = trafficContent.value.Time;
          $scope.edit.brgy = trafficContent.value.Barangay;
          $scope.edit.trafficID = trafficContent.value.$id;
          if(trafficContent.value.NorthAlternativeRoute == null) {
            $scope.edit.north = "";
          }
           if(trafficContent.value.SouthAlternativeRoute == null) {
            $scope.edit.south = "";
          }
          $scope.edit.north = trafficContent.value.NorthAlternativeRoute;
          $scope.edit.south = trafficContent.value.SouthAlternativeRoute;
    }
   
    $scope.itemList1=[];
    $scope.itemList2=[];
    $scope.itemList3=[];
    var NorthStatus,SouthStatus;
    $scope.currentID = 0;
    $scope.currentBrgy = "";
    $scope.TrafficStatusNB=[{id:1,name:"Light"},{id:2,name:"Moderate"},{id:3,name:"Heavy"}];
    $scope.TrafficStatusSB=[{id:1,name:"Light"},{id:2,name:"Moderate"},{id:3,name:"Heavy"}];

    $scope.brgyList = [{id:1,name:"Abangan Norte"},{id:2,name:"Abangan Sur"},{id:3,name:"Ibayo"},
    {id:4,name:"Lambakin"},{id:5,name:"Lias"},{id:6,name:"Loma de Gato"},{id:7,name:"Nagbalon"},
    {id:8,name:"Patubig"},{id:9,name:"Poblacion I"},{id:10,name:"Poblacion II"},{id:11,name:"Prenza I"},
    {id:12,name:"Prenza II"},{id:13,name:"Saog"},{id:14,name:"Sta. Rosa I"},{id:15,name:"Sta. Rosa II"}
    ,{id:16,name:"Tabing-Ilog"},{id:17,name:"If others, please specify"}];
        
    $scope.changedValue1=function(item){
      $scope.itemList1.push(item.name);
      NorthStatus = item.name;
    }   

    $scope.changedValue2=function(item){
      $scope.itemList2.push(item.name);
      SouthStatus = item.name;
    }   

    $scope.LoadBarangay = function (item){
      $scope.itemList3.push(item.name);
      $scope.currentID = item.id;
      if($scope.currentID<17){

          $scope.edit.brgy = item.name;

      }
      else
        $scope.edit.brgy = "";
    }

    var currentDate = new Date()
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

   


    $scope.saveTraffic = function (){
    var trafficHrs = $scope.traffic.time.getHours();
    var trafficMins = $scope.traffic.time.getMinutes();
    var milTime = "";
    var ampm = trafficHrs >= 12 ? 'PM' : 'AM';
    trafficHrs =  trafficHrs % 12;
    trafficHrs =  trafficHrs ?  trafficHrs : 12;
    var minString = "";

  if(trafficMins<10){
          minString = "0"+trafficMins.toString();
          milTime = $scope.traffic.time.getHours()+"0"+$scope.traffic.time.getMinutes();
    }
     else{
      milTime = $scope.traffic.time.getHours()+""+$scope.traffic.time.getMinutes();
    minString = trafficMins.toString();
  }
  if($scope.traffic.north == null) {
    $scope.traffic.north = "";
  }
  if($scope.traffic.south == null) {
    $scope.traffic.south = "";
  }
        
        var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Traffic");
        ref.push({
          "Location":$scope.traffic.location,
          "Barangay":$scope.edit.brgy,
          "Northbound":NorthStatus,
          "Southbound":SouthStatus,
          "Date":month+"/"+day+"/"+year,
          "Time":trafficHrs+":"+minString+" "+ampm,
          "MilitaryTime":milTime,
          "Email":$cookieStore.get('StaffInfo').currentLoggedIn.email,
          "NorthAlternativeRoute":$scope.traffic.north,
          "SouthAlternativeRoute":$scope.traffic.south

        });
      alert("Traffic Status has been Updated!");
       $modalInstance.close();
    }

     $scope.closeModal = function (){
      $modalInstance.close();
  }

    $scope.updateTraffic = function (trafficID,location,brgy,time,alternative){

      var currentDate = new Date()
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var milTime = "";

    var trafficHrs = time.getHours();
    var trafficMins = time.getMinutes();
    var ampm = trafficHrs >= 12 ? 'PM' : 'AM';
    trafficHrs =  trafficHrs % 12;
    trafficHrs =  trafficHrs ?  trafficHrs : 12;
    var minString = "";

  if(trafficMins<10){
          minString = "0"+trafficMins.toString();
          milTime = trafficHrs+"0"+time.getMinutes();
    }
     else{
    minString = trafficMins.toString();
       milTime = trafficHrs+""+time.getMinutes();
  }
        var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Traffic");
    ref.child(trafficID).set({Barangay:brgy,Date:month+"/"+day+"/"+year,Location:location,Northbound:NorthStatus,Southbound:SouthStatus,Time:trafficHrs+":"+minString+" "+ampm,Email:$cookieStore.get('StaffInfo').currentLoggedIn.email,NorthAlternativeRoute:$scope.edit.north,SouthAlternativeRoute:$scope.edit.south,MilitaryTime:milTime});
          
          alert("update successfully!");
            $modalInstance.close();
    }
});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance,$firebase,newsContent,$cookieStore) {

  $scope.newsObject = newsContent.news;
  $scope.primary = $scope.newsObject.image;
  $scope.news = {};
  $scope.dummy = {};


     var currentDate = new Date();
      var month = currentDate.getMonth() + 1;
     var year = currentDate.getFullYear();
    var monthW = ['January','February','March','April','May',
  'June','July','August','September','October','November',
  'December'];

    var monthIndex = month-1;

      if(monthIndex <0){
        monthIndex = 0;
      }


  var currentMonthAndYear =year+" - "+month+" ("+monthW[monthIndex]+")";



  $scope.def = {};


  var defaultImage = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");
       defaultImage.on("value", function (snapshot){
        
          $scope.def.image = snapshot.val();
       });


  $scope.save = function (id,ntitle,ndesc,image) {
    console.log(id);
    console.log(currentMonthAndYear);
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+currentMonthAndYear);
    ref.child(id).set({Title:ntitle,Description:ndesc,DatePosted:$scope.newsObject.DatePosted,Image:image,
      Status:$scope.newsObject.Status, Email:$cookieStore.get('StaffInfo').currentLoggedIn.email});
    alert("update successfully!");
    $modalInstance.close();
  };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller("EditData", ['$scope','UpdateNewsInfo',function ($scope,UpdateNewsInfo){

$scope.loadData = function (){
        $scope.editNewsData=UpdateNewsInfo.returnData();
}
}]);

app.factory('UpdateNewsInfo',function (){
    
    var currentData = {};

    return {
        setData:function (title,desc,id){
        currentData ={
            name:title,
            desc:desc,
            newsid:id
        };
    },
        returnData:function (){
            return currentData;
       }
    }

});

app.controller("OtherController",function ($scope){
     $scope.pageChangeHandler = function(num) {
          console.log('Page changed to ' + num);
  };
});

app.controller("OtherController2",function ($scope){
     $scope.pageChangeHandler = function(num) {
          console.log('Page changed to ' + num);
  };
});




app.directive('appFilereader', function($q) {

    var slice = Array.prototype.slice;

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return;

        ngModel.$render = function() {}

        element.bind('change', function(e) {
          var element = e.target;
          if(!element.value) return;

          element.disabled = true;
          $q.all(slice.call(element.files, 0).map(readFile))
            .then(function(values) {
              if (element.multiple) ngModel.$setViewValue(values);
              else ngModel.$setViewValue(values.length ? values[0] : null);
              element.value = null;
              element.disabled = false;
            });

          function readFile(file) {
            var deferred = $q.defer();

            var reader = new FileReader()
            reader.onload = function(e) {
              deferred.resolve(e.target.result);
            }
            reader.onerror = function(e) {
              deferred.reject(e);
            }
            reader.readAsDataURL(file);

            return deferred.promise;
          }
        }); 
      } 
    }; 
});


app.controller("AboutCtrl", function ($scope,$firebase,cfpLoadingBar){
cfpLoadingBar.start();
 $scope.aboutMarilao = {};
 $scope.def = {};
 $scope.dummy = {};

    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/AboutMarilao/History/");

    ref.on("value", function (snapshot){
      $scope.aboutMarilao  = snapshot.val();
  
    }); 

      var defaultImage = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");

       defaultImage.on("value", function (snapshot){
          def = snapshot.val();
          $scope.def.image = snapshot.val();
         $scope.dummy.images[0] = def;
            cfpLoadingBar.complete();
       });

  $scope.updateContent = function (){
cfpLoadingBar.start();
      var updateRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/AboutMarilao/History/");

        updateRef.set({title:$scope.aboutMarilao.title,description:$scope.aboutMarilao.description,image:$scope.dummy.images[0]});
  cfpLoadingBar.complete();
        alert("update successfully!");

  }
}); 

app.controller('FeedbackCtrl', function ($scope,$firebase,cfpLoadingBar,$modal){

  cfpLoadingBar.start();
  var ref = new Firebase('https://marilenewsdatabase.firebaseio.com/News/Feedback');
  
  var objData = $firebase(ref);

    $scope.feedback = objData.$asArray();


    $scope.showModalContent = function (name,email,desc){
      var feedbackObject = {
        name:name,
        email:email,
        desc:desc
      };

        var modalInstance = $modal.open({
            templateUrl:'FeedbackModal.html',
            controller:'FeedbackInstance',
            resolve:{
                feedbackContent: function () {
                  return feedbackObject;
                }
            }
        });
    }
}); 

app.controller('FeedbackInstance', function ($scope,$firebase,feedbackContent,$modalInstance){
  $scope.feedbackObject = {};

    $scope.feedbackObject = feedbackContent;


       $scope.closeModal = function () {
        $modalInstance.close();
    }
});

app.directive('repeatLoading', function (cfpLoadingBar) {
  return function(scope, element, attrs) {
 
    if (scope.$last){
      cfpLoadingBar.complete();
    }
  };
});

app.factory('AuthenticationService', function ($rootScope,$cookieStore,$timeout,$firebase){

    return {
        setCredentials: function (email,authData){
            $rootScope.globalData = {
                currentLoggedIn:{
                    email:email,
                    authData: authData
                }
            }
            $cookieStore.put('StaffInfo', $rootScope.globalData);
            console.log($cookieStore.get('StaffInfo').currentLoggedIn.email);
 
        },
        getCredentials: function (){
            return  $cookieStore.get('AccountInfo').val.Email;
        },
        clearCredentials: function (){
          $rootScope.globalData = null;
          $cookieStore.remove('StaffInfo');
            $cookieStore.remove('AccountInfo');
        },

        getAccountInformation: function (email){
       var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");
           
            var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");
            ref.orderByChild("Email").equalTo(email).on("child_added", function (snapshot){
              $rootScope.accountInfo = {
                key:snapshot.key(),
                val:snapshot.val()
              }
          
                $cookieStore.put('AccountInfo', $rootScope.accountInfo);
            });
  
        }
    }
    
});


app.controller('TourismCtrl',['$scope','$firebase','$modal','cfpLoadingBar', function ($scope,$firebase,$modal,cfpLoadingBar){
/*
  $scope.touristAlbum = [];
cfpLoadingBar.start();
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction");
 var objData = $firebase(ref);

    var obj = objData.$asArray();

  $scope.touristAlbum = obj;
      
      if($scope.touristAlbum.length==0){
        cfpLoadingBar.complete();
      }
  */

   cfpLoadingBar.start();

    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/FiestaEvents");
    var fiestaEvents = $firebase(ref);
    var fiestaArray = fiestaEvents.$asArray();
    $scope.fiestaList = fiestaArray;

    var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Restaurant");
    var restaurant = $firebase(ref2);
    var restaurantArray = restaurant.$asArray();
    $scope.restaurantList = restaurantArray;
    console.log($scope.restaurantList);


    var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Resorts");
    var touristDestination = $firebase(ref3);
    var touristDestinationArray = touristDestination.$asArray();
    $scope.touristDestinationList = touristDestinationArray;
    console.log($scope.touristDestinationList);

    var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Churches");
    var churchesRef = $firebase(ref3);
    var churchesArray = churchesRef.$asArray();
    $scope.churchesList = churchesArray;
    console.log($scope.churchesList);




     $scope.openModal = function (){
          var tourObject = {
         type:"new",
         info:{}
      }
        var modalInstance = $modal.open({
               templateUrl: 'NewTouristAttraction.html',
               controller:'TouristAttractionInstanceCtrl',
               resolve: {
                  tourObject:function (){
                      return tourObject;
                  }
               }
        }
      );


  }


  $scope.newFiesta = function () {
      var fiestaObject = {
        type:"newFiesta",
        info:{
            tourObject: function () {
              return tourObject;
            }
        }
      }

      var modalInstance = $modal.open({

          templateUrl:'Fiesta.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return fiestaObject;
              }
          }
      })
  }

  $scope.deleteDestination = function (destinationObjectID) {

    var delRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Resorts")
 

    delRef.child(destinationObjectID).remove();
    alert("Information has been deleted!");
 
  }

  $scope.editDestination = function (destinationObject) {
       var tourObject = {
        type:"editDestination",
        info:destinationObject
      }

      var modalInstance = $modal.open({

          templateUrl:'Resorts.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return tourObject;
              }
          }
      })


  }


  $scope.newChurches = function () {
         var churchesObject = {
        type:"newChurches",
        info:{
            tourObject: function () {
              return tourObject;
            }
        }
      }

      var modalInstance = $modal.open({

          templateUrl:'Churches.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return churchesObject;
              }
          }
      })
  }

  $scope.editChurches = function (churchesObject) {
          var tourObject = {
        type:"editChurch",
        info:churchesObject
      }


      
       
      var modalInstance = $modal.open({

          templateUrl:'Churches.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return tourObject;
              }
          }
      })
  }


  $scope.deleteChurches = function (churchesObject) {
    var delRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Churches");

       delRef.child(churchesObject.$id).remove();
   
     
  }



    $scope.deleteFiesta = function (object) {
        var editRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/FiestaEvents/");
      
            editRef.child(object.$id).remove();
          alert("Information has been deleted successfully!");
 
          

    }



  $scope.editFiesta = function (object) {
      var fiestaObject = {
        type:"editFiesta",
        info:object
      }

      var modalInstance = $modal.open({

          templateUrl:'Fiesta.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return fiestaObject;
              }
          }
      })
  }

  $scope.resortsModal = function () {
     var touristObject = {
        type:"newTouristDestination",
        info:{
            tourObject: function () {
              return touristObject;
            }
        }
      }

      var modalInstance = $modal.open({

          templateUrl:'Resorts.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return touristObject;
              }
          }
      })

  }
    
  $scope.touristModal = function (object) {
            var tourObject = {
              type:"edit",
              info:object
            }
            var modalInstance = $modal.open({
              templateUrl:'TouristAttractionModal.html',
              controller:'TouristAttractionInstanceCtrl',
              resolve:{
                tourObject:function () {
                    return tourObject;
                }
              }
            });

        }  


  $scope.updateImage1 = function (object) {
       var tourObject = {
              type:"change",
              info:object
            }
            var modalInstance = $modal.open({
              templateUrl:'UpdateCoverRoute.html',
              controller:'TouristAttractionInstanceCtrl',
              resolve:{
                tourObject:function () {
                    return tourObject;
                }
              }
            });
  }



  $scope.showImageGallery = function (object) {
       var tourObject = {
              type:"updateImage",
              info:object
            }
            var modalInstance = $modal.open({
              templateUrl:'ImageGallery.html',
              controller:'TouristAttractionInstanceCtrl',
              resolve:{
                tourObject:function () {
                    return tourObject;
                }
              }
            });
  }


  $scope.deleteTouristAttraction = function (tourist) {
       var con = confirm("Are you sure?");

       if(con == true){
            var delRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/"+tourist.$id);

            delRef.remove();
       }
    

  }


    $scope.newRestaurant = function () {
         var churchesObject = {
        type:"newRestaurant",
        info:{
            tourObject: function () {
              return tourObject;
            }
        }
      }

      var modalInstance = $modal.open({

          templateUrl:'Restaurant.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return churchesObject;
              }
          }
      })
  }   


  $scope.editRestaurant = function (object) {
      var restaurantObject = {
        type:"editRestaurant",
        info:object
      }

      var modalInstance = $modal.open({

          templateUrl:'Restaurant.html',

         controller:'TouristAttractionInstanceCtrl',

          resolve:{
              tourObject: function () {
                return restaurantObject;
              }
          }
      })
  }

  $scope.deleteRestaurant = function (restaurantID) {

      var delRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Restaurant");
      

           delRef.child(restaurantID).remove();
      alert("Content has been deleted!");
    
     
  }



}]);

app.controller('TouristAttractionInstanceCtrl', function ($scope,$firebase,$modalInstance,tourObject){
 
  $scope.def = {};
  $scope.coverImage = {};
  $scope.editTour = {};
  $scope.newImage = {};
  $scope.fiesta = {};
  $scope.edit = {};
  $scope.churches = {};
$scope.restaurant = {};
  $scope.destination = {};



   var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");

    ref.on("value", function (snapshot){
        $scope.def.image = snapshot.val();
        $scope.coverImage[0] =  $scope.def.image;

        console.log($scope.coverImage);
    });
  
  if(tourObject.type == "edit" || tourObject.type == "change" || tourObject.type == "updateImage"){
        $scope.editTour=tourObject.info;
         
  }


  if(tourObject.type == "editFiesta"){
    $scope.fiesta.id = tourObject.info.$id;
    $scope.fiesta.name = tourObject.info.Name;
    $scope.fiesta.location = tourObject.info.Location;
    $scope.fiesta.description = tourObject.info.Description;
      $scope.coverImage[0] = tourObject.info.Image;
  }

    if(tourObject.type == "editDestination"){
      $scope.destination.id = tourObject.info.$id;
      $scope.destination.name = tourObject.info.Name;
      $scope.destination.location  = tourObject.info.Location;
      $scope.destination.description = tourObject.info.Description;
      $scope.destination.url = tourObject.info.Url;
      $scope.coverImage[0] = tourObject.info.CoverImage;
       $scope.coverImage[1] = tourObject.info.RouteImage;
    } 

    if(tourObject.type == "editRestaurant"){
      $scope.restaurant.id = tourObject.info.$id;
      $scope.restaurant.name = tourObject.info.Name;
      $scope.restaurant.location = tourObject.info.Location;
      $scope.restaurant.description = tourObject.info.Description;
      $scope.restaurant.url = tourObject.info.Url;
      $scope.coverImage[0] = tourObject.info.Image;
    }

        if(tourObject.type == "editChurch"){

    $scope.churches.id = tourObject.info.$id;

    $scope.churches.name = tourObject.info.Name;

     $scope.churches.description = tourObject.info.Name;
      $scope.churches.location = tourObject.info.Location;
      $scope.churches.url = tourObject.info.Url;
     $scope.coverImage[0] = tourObject.info.Image;
     
    }

/*
  $scope.$watch("newImage", function (newVal,oldVal){
        
        var newImageRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction");
        newImageRef.child($scope.editTour.$id+"/ImageGallery").push({"Image":newVal[0]});
  });
*/
  $scope.saveChurches = function () {
  

      if(tourObject.type == "editChurch"){

          var updateChurches = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Churches");

          updateChurches.child($scope.churches.id).set({"Name":$scope.churches.name,"Location":$scope.churches.location,
          "Image":$scope.churches.coverImage[0],"Url":$scope.churches.url});

          alert("Information has been updated successfully!");
          $modalInstance.close();
      }
    else{


  
      var saveChurch = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Churches");
       saveChurch.push({"Name":$scope.churches.name,"Location":$scope.churches.location,
        "Image":$scope.churches.coverImage[0],"Url":$scope.churches.url});

        alert("Save Successfully!");
        $modalInstance.close();
    } 
  }


  $scope.saveTouristDestination = function () {
 var saveDestination = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Resorts");

    if(tourObject.type == "editDestination"){

          saveDestination.child($scope.destination.id).set({"Name":$scope.destination.name,"Location":$scope.destination.location,
      "Description":$scope.destination.description,"Url":$scope.destination.url,"CoverImage":$scope.destination.coverImage[0],
      "RouteImage":$scope.destination.routeImage[0]});
          alert("Information has been updated!");
          $modalInstance.close();

    }
    else{

    saveDestination.push({"Name":$scope.destination.name,"Location":$scope.destination.location,
      "Description":$scope.destination.description,"Url":$scope.destination.url,"CoverImage":$scope.destination.coverImage[0],
      "RouteImage":$scope.destination.routeImage[0]});

    alert("New Tourist Destination has been added!");

    $modalInstance.close();
    }
   
  
  }

  $scope.closeModal = function () {
    $modalInstance.close();
  }
  $scope.routeImage = {};
  $scope.gallery = {};
  $scope.imageArray = [];
  $scope.imageArray.length = 0;
  $scope.tour={};

  $scope.deleteImage = function (key,val) {
 
     var deleteRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/"+$scope.editTour.$id);
    deleteRef.child("ImageGallery/"+key).remove();
   alert("Deleted!");
    
  }


  /*
  $scope.$watch('imageString',function (newVal,oldVal){

       $scope.imageArray.push(newVal);

  });
*/

 

    $scope.updateImages = function (dataObject) {

    
        var updateRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction");

        updateRef.child(dataObject.$id+"/TouristInformation").set({
    
          "Name":dataObject.TouristInformation.Name,
          "Location":dataObject.TouristInformation.Location,
          "Description":dataObject.TouristInformation.Description,
          "CoverImage":$scope.newImage.CoverImage[0],
          "RouteImage":$scope.newImage.RouteImage[0]
       });
        alert("Saved!");
        $modalInstance.close();

    }


    $scope.saveFiesta = function (){


    if(tourObject.type == "editFiesta"){

        var fiestaMonth = $scope.fiesta.date.getMonth()+1;
    var fiestaDay = $scope.fiesta.date.getDate();
    var fiestaYear = $scope.fiesta.date.getFullYear();

        var editRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/FiestaEvents/");

          editRef.child($scope.fiesta.id).set({Name:$scope.fiesta.name,Location:$scope.fiesta.location,
            Description:$scope.fiesta.description,Date:fiestaYear+"-"+fiestaMonth+"-"+fiestaDay,Image:$scope.fiesta.coverImage[0]});
          alert("Information has been updated successfully!");

          $modalInstance.close();
    }
    else{



    var fiestaMonth = $scope.fiesta.date.getMonth()+1;
    var fiestaDay = $scope.fiesta.date.getDate();
    var fiestaYear = $scope.fiesta.date.getFullYear();



        var newFiesta = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/FiestaEvents");

          newFiesta.push({"Name":$scope.fiesta.name,"Location":$scope.fiesta.location,
          "Description":$scope.fiesta.description,"Date":fiestaYear+"-"+fiestaMonth+"-"+fiestaDay,
          "Image":$scope.fiesta.coverImage[0]});

          alert("Saved!");
          $modalInstance.close();

        }
    }


    $scope.saveRestaurant = function () {

      if(tourObject.type == "editRestaurant"){
           var resRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Restaurant");

          resRef.child($scope.restaurant.id).set({"Name":$scope.restaurant.name,"Location":$scope.restaurant.location,
        "Image":$scope.restaurant.coverImage[0],"Url":$scope.restaurant.url,"Description":$scope.restaurant.description});

          alert("Information has been updated successfully!");


      }
      else{
           var resRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction/Restaurant");

          resRef.push({"Name":$scope.restaurant.name,"Location":$scope.restaurant.location,
        "Image":$scope.coverImage[0],"Url":$scope.restaurant.url,"Description":$scope.restaurant.description});

          alert("Saved Successfully!");

      }

      $modalInstance.close();
       
    }

    $scope.updateInformation = function (dataObject) {
         var updateRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction");
        updateRef.child(dataObject.$id+"/TouristInformation").set({
  
          "Name":$scope.editTour.TouristInformation.Name,
          "Location":$scope.editTour.TouristInformation.Location,
          "Description":$scope.editTour.TouristInformation.Description,
          "CoverImage":dataObject.TouristInformation.CoverImage,
          "RouteImage":dataObject.TouristInformation.RouteImage
       });
        alert("Saved!");
         $modalInstance.close();
    }

    $scope.saveTouristAttraction = function () {
     var arr = {};
  
     for (var x = 1; x < $scope.imageArray.length; ++x){
            arr[x] = $scope.imageArray[x][0];
     }

     console.log(arr);
     var locationName = $scope.tour.locname;
      var touristRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/TouristAttraction");
      touristRef.child(locationName).set({
        "TouristInformation":{
          "Name":$scope.tour.locname,
          "Location":$scope.tour.location,
          "Description":$scope.tour.description,
          "CoverImage":$scope.coverImage[0],
          "RouteImage":$scope.routeImage[0]
        }});

        for(var i=1;i<$scope.imageArray.length;i++){
            touristRef.child(locationName+"/ImageGallery").push({
                "Image":arr[i]
            });
        }
      $modalInstance.close();
      alert("Save!");
  }
});
app.controller('OfficialsCtrl',['$scope', '$firebase','cfpLoadingBar','$modal', function ($scope,$firebase,cfpLoadingBar,$modal){
  $scope.officials1 = [];
  $scope.officials2 = [];
  $scope.officials3 = [];

  cfpLoadingBar.start();
      var ref1 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/Mayor");
      
      var objData1 = $firebase(ref1);
      $scope.officials1 = objData1.$asArray();


      var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/ViceMayor");
   
      var objData2 = $firebase(ref2);
      $scope.officials2 = objData2.$asArray();

      var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/Councilor");
      var objData3 = $firebase(ref3);
      $scope.officials3 = objData3.$asArray();


      $scope.openModal = function (officialsInfo){
          var officialsObj = {
         type:"new",
         info:""
      }
        var modalInstance = $modal.open({
               templateUrl: 'OfficialsModal.html',
               controller:'OfficialsInstance',
               resolve: {
                  officialsDetails:function (){
                      return officialsObj;
                  }
               }
        }
      );
  }

   $scope.openMayorModal = function (officialsInfo){
          var officialsObj = {
         type:"new",
         info:""
      }
        var modalInstance = $modal.open({
               templateUrl: 'MayorModal.html',
               controller:'OfficialsInstance',
               resolve: {
                  officialsDetails:function (){
                      return officialsObj;
                  }
               }
        }
      );
  }

  $scope.openViceMayorModal = function (officialsInfo){
          var officialsObj = {
         type:"new",
         info:""
      }
        var modalInstance = $modal.open({
               templateUrl: 'ViceMayorModal.html',
               controller:'OfficialsInstance',
               resolve: {
                  officialsDetails:function (){
                      return officialsObj;
                  }
               }
        }
      );
  }


    $scope.editModal = function (officialsInfo){  

      var officialsObj = {
         type:"edit",
         info:officialsInfo
      }

      var modalEditInstance = $modal.open({
             templateUrl: 'OfficialsModal.html',
               controller:'OfficialsInstance',
           resolve: {
              officialsDetails:function (){
                  return officialsObj;
              }
           }
      });
  }




    $scope.deleteOfficials = function (officialsPosition,officialsID){

        var con = confirm("Are you sure?");

        if(con == true){

                 if(officialsPosition == "Municipal Mayor"){
          officialsPosition = "Mayor"
      }
      else if(officialsPosition == "Municipal Vice Mayor"){
        officialsPosition = "ViceMayor"
      }
   
      var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/");
      var child1 = ref.child(officialsPosition);
      child1.child(officialsID).remove();
      alert("officials has been removed!");

        }
   

  }
}]);

app.controller('OfficialsInstance', function ($scope,$firebase,officialsDetails,$modalInstance){
      var currentDate = new Date();
      var currentMonth = currentDate.getMonth()+1;
      var currentDay = currentDate.getDate();
      var currentYear = currentDate.getFullYear();
      $scope.positionList = [];
      $scope.setDefault = "";
       var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage2");
            ref.on("value", function (snapshot){
         $scope.setDefault= snapshot.val();
      }
      );
      $scope.officialsDefault = {};

      $scope.officialsInfo = {};

        if(officialsDetails.type=="edit"){
            $scope.officialsInfo.lastname = officialsDetails.info.Lastname;
            $scope.officialsInfo.firstname = officialsDetails.info.Firstname;
            $scope.officialsInfo.initial = officialsDetails.info.Initial;
            $scope.officialsInfo.description = officialsDetails.info.Description;
            $scope.officialsInfo.position = officialsDetails.info.Position;

            $scope.officialsDefault.image = officialsDetails.info.Image;
        
        }
        else{
           var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage2");
            ref.on("value", function (snapshot){
          $scope.officialsDefault.image = snapshot.val();
      });
        }

      var Position = "";
      $scope.OfficialsPosition=[{id:1,name:"Municipal Mayor"},{id:2,name:"Municipal Vice Mayor"},{id:3,name:"Councilor"}];
  


     

  $scope.changedValue1=function(item){
      $scope.positionList.push(item.name);
     Position = item.name;
    }   

    $scope.saveMayor = function () {
          var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/Mayor");
           



      var sYear = $scope.officialsInfo.start.getFullYear();
      var sMonth = $scope.officialsInfo.start.getMonth()+1;
      var sDay = $scope.officialsInfo.start.getDate();

      var eYear = $scope.officialsInfo.end.getFullYear();
      var eMonth = $scope.officialsInfo.end.getMonth()+1;
      var eDay = $scope.officialsInfo.end.getDate();
        ref.child("Mayor").set({
          "Lastname":$scope.officialsInfo.lastname,
          "Firstname":$scope.officialsInfo.firstname,
          "Initial":$scope.officialsInfo.initial,
          "Position":"Municipal Mayor",
          "Term":sMonth+"/"+sDay+"/"+sYear+"--"+eMonth+"/"+eDay+"/"+eYear,
          "Description":$scope.officialsInfo.profile,
          "Image":$scope.officialsInfo.images[0],
          "DateAdded":currentDay+"/"+currentMonth+"/"+currentYear

        });

        alert("officials has been added!");
        $modalInstance.close();
    }


    $scope.saveViceMayor = function () {
           var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/ViceMayor");
          var sYear = $scope.officialsInfo.start.getFullYear();
      var sMonth = $scope.officialsInfo.start.getMonth()+1;
      var sDay = $scope.officialsInfo.start.getDate();
        var eYear = $scope.officialsInfo.end.getFullYear();
      var eMonth = $scope.officialsInfo.end.getMonth()+1;
      var eDay = $scope.officialsInfo.end.getDate();
        ref.child("ViceMayor").set({
          "Lastname":$scope.officialsInfo.lastname,
          "Firstname":$scope.officialsInfo.firstname,
          "Initial":$scope.officialsInfo.initial,
          "Position":"Municipal Vice Mayor",
             "Term":sMonth+"/"+sDay+"/"+sYear+"--"+eMonth+"/"+eDay+"/"+eYear,
          "Description":$scope.officialsInfo.profile,
          "Image":$scope.officialsInfo.images[0],
          "DateAdded":currentDay+"/"+currentMonth+"/"+currentYear

        });

        alert("officials has been added!");
        $modalInstance.close();
    }

     $scope.saveCouncilor = function () {
          var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/Mayor");
          var sYear = $scope.officialsInfo.start.getFullYear();
      var sMonth = $scope.officialsInfo.start.getMonth()+1;
      var sDay = $scope.officialsInfo.start.getDate();
        var eYear = $scope.officialsInfo.end.getFullYear();
      var eMonth = $scope.officialsInfo.end.getMonth()+1;
      var eDay = $scope.officialsInfo.end.getDate();
        ref.push({
          "Lastname":$scope.officialsInfo.lastname,
          "Firstname":$scope.officialsInfo.firstname,
          "Initial":$scope.officialsInfo.initial,
          "Position":"Councilor",
            "Term":sMonth+"/"+sDay+"/"+sYear+"--"+eMonth+"/"+eDay+"/"+eYear,
          "Image":$scope.officialsInfo.images[0],
          "DateAdded":currentDay+"/"+currentMonth+"/"+currentYear

        });

        alert("officials has been added!");
           $modalInstance.close();
    }


    $scope.saveOfficials = function (){
         var sYear = $scope.officialsInfo.start.getFullYear();
      var sMonth = $scope.officialsInfo.start.getMonth()+1;
      var sDay = $scope.officialsInfo.start.getDate();
        var eYear = $scope.officialsInfo.end.getFullYear();
      var eMonth = $scope.officialsInfo.end.getMonth()+1;
      var eDay = $scope.officialsInfo.end.getDate();

    if(officialsDetails.type=="new"){

     if($scope.officialsInfo.position == "Councilor"){

        var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/Councilor");
       
        ref.push({
          "Lastname":$scope.officialsInfo.lastname,
          "Firstname":$scope.officialsInfo.firstname,
          "Initial":$scope.officialsInfo.initial,
          "Position":"Councilor",
             "Term":sMonth+"/"+sDay+"/"+sYear+"--"+eMonth+"/"+eDay+"/"+eYear,
          "Description":$scope.officialsInfo.description,
          "Image":$scope.officialsInfo.images[0],
          "DateAdded":currentDay+"/"+currentMonth+"/"+currentYear

        });

        alert("officials has been added!");

        $modalInstance.close();

      }
    
      }
  
    else if(officialsDetails.type=="edit"){
    
     
        var pos = "";

          if($scope.officialsInfo.position == "Municipal Mayor"){
            pos = "Mayor";
          }
          else if($scope.officialsInfo.position == "Municipal Vice Mayor"){
             pos = "ViceMayor";
          }
          else if($scope.officialsInfo.position == "Councilor"){
             pos = "Councilor";
          }
          var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Officials/"+pos);
          ref.child(officialsDetails.info.$id).set({
        "Lastname":$scope.officialsInfo.lastname,
          "Firstname":$scope.officialsInfo.firstname,
          "Initial":$scope.officialsInfo.initial,
          "Position":$scope.officialsInfo.position,
              "Term":sMonth+"/"+sDay+"/"+sYear+"--"+eMonth+"/"+eDay+"/"+eYear,
          "Description":$scope.officialsInfo.description,
          "Image":$scope.officialsInfo.images[0],
          "DateAdded":currentDay+"/"+currentMonth+"/"+currentYear
        });
           alert("officials information has been updated!");
    
   

         

           $modalInstance.close();

    }
  }

  $scope.closeModal = function (){
    $modalInstance.close();
  }
}); 
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
app.controller("SettingsCtrl",['$firebase','$scope','$modal','$rootScope','AuthenticationService', function ($firebase,$scope,$modal,$rootScope,AuthenticationService){



    $scope.openChangePassModal = function (){

        var modalInstance = $modal.open({
           templateUrl:"ChangePasswordModal.html",
           controller:"SettingsInstanceCtrl"
        }); 
    }

    $scope.openChangeEmailModal = function () {
        var modalInstance = $modal.open({
          templateUrl:"ChangeEmailModal.html",
          controller:"SettingsInstanceCtrl"
        });
    }

    $scope.openAccountInfoModal = function () {
        var modalInstance = $modal.open({
          templateUrl:"StaffInfo.html",
          controller:"SettingsInstanceCtrl"
        })
    } 
}]);

app.controller("SettingsInstanceCtrl", function ($scope,$firebase,AuthenticationService,$modalInstance,$rootScope,$cookieStore){
 

 var currentEmail = $cookieStore.get('AccountInfo').val.Email;
 $scope.pioInfo =  $rootScope.accountInfo;



var ref = new Firebase("https://marilenewsdatabase.firebaseio.com");

  $scope.changePassword = function (oldpass,newpass,newpassconfirm){
      ref.changePassword({
          email:currentEmail,
          oldPassword:oldpass,
          newPassword:newpass
      }, function (error){
          if(error){
              switch(error.code){
                case "INVALID_PASSWORD":
                alert("The specified user account password is incorrect.");
                break;

                case "INVALID_USER":
                alert("The specified user account does not exist!");
                break;

                default:
                alert("Error changing password", error);
              }
          }
          else
              alert("User password change successfully");
              $modalInstance.close();
      });
  }

  $scope.changeEmailAddress = function (oldEmail,newEmail,password){

     var reference = new Firebase("https://marilenewsdatabase.firebaseio.com");
      reference.changeEmail({
          oldEmail : oldEmail,
          newEmail : newEmail,
          password : password
        }
        , function(error) {
          if (error === null) {

               var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");

       ref.child($scope.pioInfo.key).set({Email:newEmail,
        Lastname:$scope.pioInfo.val.Lastname,
        Firstname:$scope.pioInfo.val.Firstname,
        Initial:$scope.pioInfo.val.Initial,
        Type:$scope.pioInfo.val.Type,
        Status:$scope.pioInfo.val.Status});
     
            alert("Email changed successfully");
               $modalInstance.close();
          } else {
            alert("Error changing email:"+ error);
          }
        });
  }

  $scope.updateAccountInfo = function (lastname,firstname,initial){
      var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");

      ref.child($scope.pioInfo.key).set({Email:$scope.pioInfo.val.Email,
        Lastname:$scope.pioInfo.val.Lastname,
        Firstname:$scope.pioInfo.val.Firstname,
        Initial:$scope.pioInfo.val.Initial,
        Type:$scope.pioInfo.val.Type,
        Status:$scope.pioInfo.val.Status});
     

      alert("Updated Successfully");
      $modalInstance.close();
  }


  $scope.closeModal = function (){
    $modalInstance.close();
  }
});

app.controller("HotlineCtrl", function ($scope,$firebase,cfpLoadingBar,$modal){
     cfpLoadingBar.start();
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Hotline");
    var dirObject = $firebase(ref);
    var hotlineArray = dirObject.$asArray();
    $scope.directory = hotlineArray;

    $scope.newHotline = function () {
      var dirObj = {
        type:"new",
        val:{}
      }

      $modal.open({
        templateUrl:'HotlineModal.html',
        controller:'DirectoryInstanceCtrl',
        resolve:{
          directoryObject: function(){
            return dirObj;
          }
        }
      })
    }

    $scope.openEditHotlineModal = function (directoryObject){
    var dirObj = {
        type:"edit",
        val:directoryObject
    }
        $modal.open({
            templateUrl:'HotlineModal.html',
            controller:'DirectoryInstanceCtrl',
            resolve:{
                directoryObject: function (){
                    return dirObj;
                }
            }
        });
    }

    $scope.deleteHotline = function (hotlineID){
         var con = confirm("Are you sure?");

         if(con == true){
                 var ref= new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Hotline/");
        ref.child(hotlineID).remove();

        alert("Hotline Number has been deleted!");
         }
     
    }
});

app.controller("DirectoryInstanceCtrl", function ($scope,$firebase,$modalInstance,directoryObject){

  $scope.directoryInfo = directoryObject.val;

  var currentDate = new Date()
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();
  var minString = "";
  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr =  hr % 12;
  hr =  hr ?  hr : 12;

  if(min<10){
          minString = "0"+min.toString();
    }
     else{
    minString = min.toString();
  }


    $scope.saveDirectoryInfo = function () {

        if(directoryObject.type == "edit"){
            var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Hotline");
            ref.child($scope.directoryInfo.$id).set({Name:$scope.directoryInfo.Name,
              ContactNo:$scope.directoryInfo.ContactNo,
              DateAdded:$scope.directoryInfo.DateAdded,
              PIOAccountID:$scope.directoryInfo.PIOAccountID});
          alert("Hotline has been updated!");

          $modalInstance.close();
        }
        else if(directoryObject.type == "new"){
            var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Hotline/");
            ref.push({Name:$scope.directoryInfo.Name,
              ContactNo:$scope.directoryInfo.ContactNo,
              DateAdded:day+"/"+month+"/"+year+"-"+hr+":"+minString+" "+ampm,
              PIOAccountID:"Dennis"

            });

            alert("New Hotline has been added!");

            $modalInstance.close();
        }
    }

    $scope.closeModal = function () {
      $modalInstance.close();
    }
});

app.controller("BusinessCtrl", function ($scope,$firebase,$modal,cfpLoadingBar){

    cfpLoadingBar.start();
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Business");
    var busObj = $firebase(ref);
    $scope.business = busObj.$asArray();

    $scope.openNewBusinessModal = function (){

      var busObj = {
        type:'new',
        val:{}
      }
        $modal.open({
            templateUrl:'BusinessModal.html',
            controller:'BusinessInstanceCtrl',
            resolve:{
              getBusinessObject: function (){
                  return busObj;
              }
            }
        })
    }

    $scope.openEditBusinessModal = function (BusinessObject) {

      var busObj = {
        type:"edit",
        val:BusinessObject
      }

        $modal.open({
            templateUrl:'BusinessModal.html',
            controller:'BusinessInstanceCtrl',
            resolve:{

                getBusinessObject: function (){
                    return busObj;
                }
            }
        });
    }

    $scope.deleteBusiness = function (businessID){

       var con = confirm("Are you sure?");

       if(con == true){
          var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Business");
        ref.child(businessID).remove();

        alert("Business Directory has been deleted!");
       }
        

    }
});

app.controller("BusinessInstanceCtrl", function ($scope,$firebase,$modalInstance,getBusinessObject){

  var currentDate = new Date()
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();
  var minString = "";
  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr =  hr % 12;
  hr =  hr ?  hr : 12;

  if(min<10){
          minString = "0"+min.toString();
  }
  else{
    minString = min.toString();
  }

    $scope.businessInfo = {};

    if(getBusinessObject.type == "edit"){
        $scope.businessInfo = getBusinessObject.val;
    }


    $scope.saveInfo = function (){

        if(getBusinessObject.type == "edit"){
            var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Business/");
            ref.child($scope.businessInfo.$id).set({Name:$scope.businessInfo.Name,
              Address:$scope.businessInfo.Address,
              ContactNo:$scope.businessInfo.ContactNo,
              DateAdded:$scope.businessInfo.DateAdded,
              PIOAccountID:$scope.businessInfo.PIOAccountID});

            alert("Information has been updated successfully!");

            $modalInstance.close();
        }


        else if(getBusinessObject.type == "new"){


            var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Directory/Business/");
            ref.push({Name:$scope.businessInfo.Name,
              Address:$scope.businessInfo.Address,
              ContactNo:$scope.businessInfo.ContactNo,
              DateAdded:day+"/"+month+"/"+year+" - "+hr+":"+minString+" "+ampm,
              PIOAccountID:"dennis"});

            alert("New Business Directory has been added!");

            $modalInstance.close();
        }
    }

    $scope.closeModal = function (){
      $modalInstance.close();
    }

});

app.controller("AccountListCtrl", function ($scope,$firebase,$modal,$cookieStore){

  $scope.accList = [];
  $scope.deActList = [];
  $scope.currentEmail = $cookieStore.get('StaffInfo').currentLoggedIn.email;
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/").orderByChild("Status").equalTo("Active");
    $scope.current = {};
    $scope.current.email = $cookieStore.get('AccountInfo').val.Email;

    var accObject = $firebase(ref);

    $scope.accList = accObject.$asArray();

     var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/").orderByChild("Status").equalTo("Inactive");

    var accObject2 = $firebase(ref2);

    $scope.deActList = accObject2.$asArray();


    $scope.inactiveAccount = function (account){
      var accRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");
        accRef.child(account.$id).set({Email:account.Email,Lastname:account.Lastname,
          Firstname:account.Firstname,Initial:account.Initial,DateRegistered:account.DateRegistered,
          Status:"Inactive",Type:account.Type});
        alert("account has been deactivated!");
    }

    $scope.activateAccount = function (account) {
       var accRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");
         accRef.child(account.$id).set({Email:account.Email,Lastname:account.Lastname,
          Firstname:account.Firstname,Initial:account.Initial,DateRegistered:account.DateRegistered,
          Status:"Active",Type:account.Type});
        alert("account has been activated!");
    }

    $scope.setAsAdmin = function (account){
        var accRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");
         accRef.child(account.$id).set({Email:account.Email,Lastname:account.Lastname,
          Firstname:account.Firstname,Initial:account.Initial,DateRegistered:account.DateRegistered,
          Status:account.Status,Type:"Admin"});
        alert("Account is now set as admin!");
    }

      $scope.setAsStaff = function (account){
        var accRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/PIOAccountInfo/");
         accRef.child(account.$id).set({Email:account.Email,Lastname:account.Lastname,
          Firstname:account.Firstname,Initial:account.Initial,DateRegistered:account.DateRegistered,
          Status:account.Status,Type:"Staff"});
       alert("Account is now set as staff!");
    }

    $scope.setStatus = function (status) {

        if(status=="Inactive"){
            $scope.accountStatus = "Activate"
        }
        else if(status == "Active"){
          $scope.accountStatus = "Deactivate"
        }
    }

    $scope.showInfo = function (acc){


          var accInfo = {
            info:acc
      }
        $modal.open({
            templateUrl:'AccountInfo.html',
            controller:'AccountInfoCtrl',
            resolve:{
             returnAccountInfo: function (){
                  return accInfo;
              }
            }
        })

    }
});

app.controller('AccountInfoCtrl', function ($scope,$modalInstance,$firebase, returnAccountInfo){
$scope.accInfo = {};

    $scope.accInfo.Lastname = returnAccountInfo.info.Lastname;
      $scope.accInfo.Firstname = returnAccountInfo.info.Firstname;
        $scope.accInfo.Initial = returnAccountInfo.info.Initial;


        $scope.closeModal = function () {
          $modalInstance.close();
        }
});

app.controller('ArchiveCtrl', function ($scope,$firebase,cfpLoadingBar,passData,$state,$cookieStore){

    cfpLoadingBar.start();
    $scope.archiveList = [];
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed");



    var archiveObject = $firebase(ref);

    $scope.archiveList = archiveObject.$asArray();

    $scope.sendData = function (id){
        $cookieStore.put('currentArchiveID', id);
        passData.setData(id);
        $state.go('main.content');
    }

}); 

app.controller("ArchiveContentCtrl", function ($scope,passData,$rootScope,cfpLoadingBar,$firebase,$modal,$cookieStore){
    $scope.archiveObjectContent = passData.getData();
    cfpLoadingBar.start();
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+$scope.archiveObjectContent);

     var archiveObjectContent = $firebase(ref.orderByChild("Status").equalTo("Active"));

    $scope.archiveList = archiveObjectContent.$asArray();

    var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+$scope.archiveObjectContent);

    var archiveObjectContent = $firebase(ref.orderByChild("Status").equalTo("Inactive"));

    $scope.hiddenArchiveList = archiveObjectContent.$asArray();

    $scope.displayModal = function (news){
        var newsObject = {
          content:news
        };

        var modalInstance = $modal.open({

          templateUrl:"ArchiveModal.html",
          controller:"ArchiveInstanceCtrl",
          resolve:{
            newsObject: function (){
              return newsObject;
            }
          }

        });
    }

  $scope.deleteArchiveNews = function (newsID){
     var con = confirm("Are you sure?");

     if(con == true){
           var refNews = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+$cookieStore.get('currentArchiveID'));
      refNews.child(newsID).remove();
      alert("News has been deleted!");
     }
     
  }
});

app.controller("ArchiveInstanceCtrl", function ($scope,newsObject,$modalInstance,$firebase,$cookieStore){
   $scope.def = {};

 var defaultImage = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");
       defaultImage.on("value", function (snapshot){
        
          $scope.def.image = snapshot.val();
       });

      $scope.newsObject = newsObject.content;

      $scope.closeModal = function () {
        $modalInstance.close();
      }

      $scope.updateNews = function (news,image){
     

            var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+$cookieStore.get('currentArchiveID'));
    ref.child(news.$id).set({Title:news.Title,Description:news.Description,DatePosted:$scope.newsObject.DatePosted,Image:image,
      Status:$scope.newsObject.Status, Email:$cookieStore.get('StaffInfo').currentLoggedIn.email});
    alert("update successfully!");
    $modalInstance.close();
      }

  

});

app.factory("printData", function () {
   var printObject= "";
    return{
      setData: function (archiveID){
 
         printObject= archiveID;
      },
      getData: function (){
        return printObject;
      }
    }
})

app.factory("passData", function (){
  var archID = "";
    return{
      setData: function (archiveID){
          archID = archiveID;
      },
      getData: function (){
        return archID;
      }
    }
});
app.controller("ChatCtrl", function ($scope,$firebase,$modal,cfpLoadingBar,$state){
  $scope.messageFeed = {};
  cfpLoadingBar.start();
  var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/MessageFeed");
    var objData = $firebase(ref);

    var obj = objData.$asArray();

  var userRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/RegisteredUser");

  var objData2 = $firebase(userRef);

  var obj2 = objData2.$asArray();

  $scope.userRef = obj2;

    $scope.chatRef = obj;


    
   
  $scope.chatMessage = function (messageObject) {

    var dataValue = messageObject;

        var modalInstance = $modal.open({
               templateUrl: 'ChatBox.html',
               controller:'ChatInstanceCtrl',
          resolve:{
            chatContent: function (){
                  return dataValue;
            }
        }
      });




  }

     $scope.deleteConversation = function (messageObject) {
            
          var delRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/MessageFeed");

              var con = confirm("Are you sure?");

              if(con == true){
                  delRef.child(messageObject.$id).remove();
                  alert("Conversation has been deleted!");

              }
          

    }

  $scope.disableAccount = function (accountObject){
  var objectID = accountObject.$id;

    console.log(accountObject);

       var userReference = new Firebase("https://marilenewsdatabase.firebaseio.com/News/RegisteredUser");

       userReference.child(objectID).set({
          DateRegistered:accountObject.DateRegistered,
          Firstname:accountObject.Firstname,
          Initial:accountObject.Initial,
          Lastname:accountObject.Lastname,
          Status:"Inactive",
          Username:accountObject.Username
        });

        alert("user has been blocked!");
  }
  
  $scope.enableAccount = function (accountObject){
  var objectID = accountObject.$id;

    console.log(accountObject);

       var userReference = new Firebase("https://marilenewsdatabase.firebaseio.com/News/RegisteredUser");

       userReference.child(objectID).set({
          DateRegistered:accountObject.DateRegistered,
          Firstname:accountObject.Firstname,
          Initial:accountObject.Initial,
          Lastname:accountObject.Lastname,
          Status:"Active",
          Username:accountObject.Username
        });

        alert("user has been blocked!");
  }

});

app.controller("ChatInstanceCtrl", function ($modalInstance,$scope,$firebase,chatContent,$cookieStore,cfpLoadingBar){
  $scope.chatMessage = {};
    $scope.chatMessage = chatContent.Conversation;
    cfpLoadingBar.start();
    var refChat = new Firebase("https://marilenewsdatabase.firebaseio.com/News/MessageFeed/"+chatContent.$id+"/Conversation");

    $scope.currentPIOAccount = $cookieStore.get('StaffInfo').currentLoggedIn.email;
    console.log($scope.currentPIOAccount);
    var objData = $firebase(refChat);

    var obj = objData.$asArray();

    $scope.chatConversation = obj;
  

  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();
  var minString = "";
  var monthW = ['January','February','March','April','May',
  'June','July','August','September','October','November',
  'December'];
  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr =  hr % 12;
  hr =  hr ?  hr : 12;
 if(min<10){
          minString = "0"+min.toString();
      }
      else{
        minString = min.toString();
      }

    $scope.replyMessage = function () {

        var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/MessageFeed/"+chatContent.$id);

          ref.child("Conversation").push({"Message":$scope.chat.message,"Sender":$cookieStore.get('StaffInfo').currentLoggedIn.email,"Date":month+"/"+day+"/"+year+" - "+hr+":"+ minString+" "+ampm, "ServerTime":Firebase.ServerValue.TIMESTAMP});
         
          $scope.chat.message = null;

    }
  

});

app.controller("FloodCtrl", function ($scope,$firebase,$modal,cfpLoadingBar,$state){

  cfpLoadingBar.start();
    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/FloodReport").orderByChild("ReportStatus").equalTo("Active");
   

    var objData = $firebase(ref);

    var obj = objData.$asArray();

    $scope.floodList = obj;

     var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/FloodReport").orderByChild("ReportStatus").equalTo("Inactive");

    var objData1 = $firebase(ref2);

    var obj1 = objData1.$asArray();

    $scope.InactiveReport = obj1;


    $scope.newFlood = function () {

    var dataValue = {
        type:"new",
        obj:{}
    };

        var modalInstance = $modal.open({
               templateUrl: 'NewFlood.html',
               controller:'FloodInstanceCtrl',
          resolve:{
           floodContent: function (){
                  return dataValue;
            }
        }
      });
    }

    $scope.editFlood = function (floodObject) {
      var dataValue = {
        type:"edit",
        obj:floodObject
      };

      var modalInstance = $modal.open({
        templateUrl:'NewFlood.html',
        controller:'FloodInstanceCtrl',
        resolve:{
          floodContent: function () {
            return dataValue;
          }
        }
      });
    }


      $scope.hideReport = function (object){
      console.log(object);
        var updateRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/FloodReport");
        updateRef.child(object.$id).set({"Location":object.Location,"Description":object.Description,"Barangay":object.Barangay,"Status":object.Status,
          "RoadWay":object.RoadWay,"PostedBy":object.PostedBy, "DatePosted":object.DatePosted,"Image":object.Image,"ReportStatus":"Inactive"})
    
    }

       $scope.showReport = function (object){
      console.log(object);
        var updateRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/FloodReport");
        updateRef.child(object.$id).set({"Location":object.Location,"Description":object.Description,"Barangay":object.Barangay,"Status":object.Status,
          "RoadWay":object.RoadWay,"PostedBy":object.PostedBy, "DatePosted":object.DatePosted,"Image":object.Image,"ReportStatus":"Active"})
    
    }
}); 

app.controller("FloodInstanceCtrl", function ($modalInstance,$firebase,$scope,$cookieStore,floodContent){

        $scope.floodList = [];
        $scope.flood = {};
        var floodName = "";
        var wType = "";
         $scope.dummy = {};

         $scope.dummy.images = [];
       $scope.def = {};
         $scope.currentID = 0;
         $scope.itemList3 = [];
         $scope.itemList1 = [];
         $scope.wayType = [];
        $scope.edit = {};
        $scope.floodStatus=[{id:1,name:"Gutter - 8 Inches"},{id:2,name:"Half Knee - 10 Inches"},{id:3,name:"Half Tire - 13 Inches"},
        {id:4,name:"Knee - 19 Inches"},{id:5,name:"Tires - 26 Inches"},{id:6,name:"Waist - 37 Inches"},{id:7,name:"Chest - 45 Inches"}];
        $scope.roadWay=[{id:1,name:"PATV - Passable to all types of vehicles"},{id:2,name:"NPLV - Notpassable to light vehicles"},
        {id:3,name:"NPTATV - Not passable to all types of vehicles"}];


        if(floodContent.type == "edit") {
          $scope.flood.location = floodContent.obj.Location;
          $scope.flood.description = floodContent.obj.Description;
          $scope.dummy.images[0]= floodContent.obj.Image;

        }

        var defaultImage = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");

       defaultImage.on("value", function (snapshot){
          def = snapshot.val();
          $scope.def.image = snapshot.val();
         $scope.dummy.images[0] = def;
            cfpLoadingBar.complete();
       });

    $scope.brgyList = [{id:1,name:"Abangan Norte"},{id:2,name:"Abangan Sur"},{id:3,name:"Ibayo"},
    {id:4,name:"Lambakin"},{id:5,name:"Lias"},{id:6,name:"Loma de Gato"},{id:7,name:"Nagbalon"},
    {id:8,name:"Patubig"},{id:9,name:"Poblacion I"},{id:10,name:"Poblacion II"},{id:11,name:"Prenza I"},
    {id:12,name:"Prenza II"},{id:13,name:"Saog"},{id:14,name:"Sta. Rosa I"},{id:15,name:"Sta. Rosa II"}
    ,{id:16,name:"Tabing-Ilog"}];

        $scope.changedValue1=function(item){
           $scope.itemList1.push(item.name);
           floodName = item.name;
       }    


        $scope.changedWayValue=function(item){
           $scope.wayType.push(item.name);
           wType = item.name;
    
       }          


        $scope.LoadBarangay = function (item){
         $scope.itemList3.push(item.name);
           $scope.currentID = item.id;
            if($scope.currentID<17){

          $scope.edit.brgy = item.name;

      }
      else
        $scope.edit.brgy = "";
    }

    $scope.saveFloodUpdate = function () {
      var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();
  var minString = "";
  var monthW = ['January','February','March','April','May',
  'June','July','August','September','October','November',
  'December'];
  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr =  hr % 12;
  hr =  hr ?  hr : 12;

    if(min<10){
          minString = "0"+min.toString();
      }
      else{
        minString = min.toString();
      }

      if(floodContent.type == "new"){

            var saveRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/FloodReport");

        saveRef.push({"Location":$scope.flood.location,"Description":$scope.flood.description,"Barangay":$scope.edit.brgy,"Status":floodName,
          "RoadWay":wType,"PostedBy":$cookieStore.get('StaffInfo').currentLoggedIn.email, "DatePosted":month+"/"+day+"/"+year+" - "+hr+":"+minString+" "+ampm,"Image":$scope.dummy.images[0],"ReportStatus":"Active"});
        alert("success!");
       $modalInstance.close();

      }
      else if(floodContent.type == "edit"){

          var updateRef = new Firebase("https://marilenewsdatabase.firebaseio.com/News/FloodReport");
          updateRef.child(floodContent.obj.$id).set({"Location":$scope.flood.location,"Description":$scope.flood.description,"Barangay":$scope.edit.brgy,"Status":floodName,
          "RoadWay":wType,"PostedBy":$cookieStore.get('StaffInfo').currentLoggedIn.email, "DatePosted":month+"/"+day+"/"+year+" - "+hr+":"+minString+" "+ampm,"Image":$scope.dummy.images[0],"ReportStatus":"Active"});
          alert("update success");
          $modalInstance.close();
      }
        
    }

    $scope.closeFloodModal = function () {
         $modalInstance.close();
    }


  

});

app.controller("IncidentCtrl", function ($scope,$firebase,cfpLoadingBar,$modal,$state,passData,$cookieStore){

cfpLoadingBar.start();

 var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();
  var minString = "";
  var monthW = ['January','February','March','April','May',
  'June','July','August','September','October','November',
  'December'];
  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr =  hr % 12;
  hr =  hr ?  hr : 12;
  var def = null;


    var monthIndex = month-1;

      if(monthIndex <0){
        monthIndex = 0;
      }
    var defaultImage = new Firebase("https://marilenewsdatabase.firebaseio.com/DefaultSettings/DefaultImage");

       defaultImage.on("value", function (snapshot){
          def = snapshot.val();

   
       });
  if(min<10){
          minString = "0"+min.toString();
      }
      else{
        minString = min.toString();
  }


    var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/IncidentReport").orderByChild("Status").equalTo("Pending");

     var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/IncidentReport").orderByChild("Status").equalTo("Approved");

    
  
  var objData = $firebase(ref);

    $scope.incident = objData.$asArray();

  var objData2 = $firebase(ref2);
  $scope.approvedReport = objData2.$asArray();



  $scope.viewDetails = function (reportDetails) {


      var modalInstance = $modal.open({
        templateUrl:'IncidentDetails.html',
        controller:'IncidentInstanceCtrl',
        resolve:{
         incidentContent: function () {
            return reportDetails;
          }
        }
      });
  }

  $scope.redirectPrint = function (incident){

         $cookieStore.put('IncidentInfo', incident);

        console.log($cookieStore.get('IncidentInfo'));

        $state.go('main.print');
     
  }

  $scope.editDetails = function (reportDetails) {
       var modalInstance = $modal.open({
        templateUrl:'EditIncidentDetails.html',
        controller:'IncidentInstanceCtrl',
        resolve:{
         incidentContent: function () {
            return reportDetails;
          }
        }
      });
  }



  $scope.declineReport= function (reportID){
      var ref2 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/IncidentReport/"+reportID);
      ref2.remove();
      alert("Report has been declined!");
  }

  $scope.sentToReport = function (reportObject){

     var con = confirm("Are you sure?");
    if (con == true) {
        var ref4 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/Newsfeed/"+year+" - "+month+" ("+monthW[monthIndex]+")");


     ref4.push({
             "Title":reportObject.Title,
             "Description":reportObject.Description,
             "DatePosted":month+"/"+day+"/"+year+" - "+hr+":"+minString+" "+ampm,
             "Image": def,
             "Status":"Active",
             "ContactNo":reportObject.ContactNo,
             "Email":reportObject.Name
      });
     
      var removeToIncident = new Firebase("https://marilenewsdatabase.firebaseio.com/News/IncidentReport/"+reportObject.$id);
      removeToIncident.remove();
     alert("Report has been posted to news!");
    } else {
      
    }
   

  }


   $scope.acceptReport = function (reportObject){

      var ref3 = new Firebase("https://marilenewsdatabase.firebaseio.com/News/IncidentReport/"+reportObject.$id);
      console.log(reportObject);
      ref3.set({"Title":reportObject.Title,"Description":reportObject.Description,"ContactNo":reportObject.ContactNo,
            "Name":reportObject.Name,"Status":"Approved","DateReported":reportObject.DateReported});
      alert("Approved");
  }


});

app.controller("PrintCtrl", function ($scope,passData,$state,$cookieStore){
    
     var currentDate = new Date();
      var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();
  var minString = "";

  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr =  hr % 12;
  hr =  hr ?  hr : 12;




    $scope.printObj = $cookieStore.get('IncidentInfo');
    $scope.printName = $cookieStore.get('StaffInfo').currentLoggedIn.email;

    $scope.currentDate = month + "/" + day + "/"+ year;
    $scope.currentTime = hr+":"+min+" "+ampm;
    console.log($scope.printName);
});

app.controller("IncidentInstanceCtrl", function ($scope,incidentContent,$modalInstance){
    $scope.incidentObject = {};
      $scope.incidentObject.id = incidentContent.$id;
      $scope.incidentObject.title = incidentContent.Title;
       $scope.incidentObject.desc = incidentContent.Description;
        $scope.incidentObject.name = incidentContent.Name;
         $scope.incidentObject.contact = incidentContent.ContactNo;
          $scope.incidentObject.date = incidentContent.DateReported;
           $scope.incidentObject.status= incidentContent.Status;


        $scope.closeModal = function () {
          $modalInstance.close();
        }

        $scope.updateIncidentDetails = function (incidentObject) {
          var ref = new Firebase("https://marilenewsdatabase.firebaseio.com/News/IncidentReport");
          ref.child(incidentObject.id).set({"Title":incidentObject.title,"Description":incidentObject.desc,"ContactNo":incidentObject.contact,
            "Name":incidentObject.name,"Status":incidentObject.status,"DateReported":incidentObject.date});
          alert("Report details has been updated!");
          $modalInstance.close();
        }
    
});

app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

app.directive('autoscrollDown', function () {
  return {
    link: function postLink(scope, element, attrs) {
      scope.$watch(
        function () {
          return element.children().length;
        },
        function () {
          element.animate({ scrollTop: element.prop('scrollHeight')}, 1000);
        }
      );
    }
  };
});

app.directive('formatPhone', [
        function() {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function(scope, elem, attrs, ctrl, ngModel) {
                    elem.add(phonenumber).on('keyup', function() {
                       var origVal = elem.val().replace(/[^\w\s]/gi, '');
                       if(origVal.length === 10) {
                         var str = origVal.replace(/(.{3})/g,"$1-");
                         var phone = str.slice(0, -2) + str.slice(-1);
                         jQuery("#phonenumber").val(phone);
                       }

                    });
                }
            };
        }
    ]);

app.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,11);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});
app.filter('tel', function () {
    return function (tel) {
        console.log(tel);
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,9);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});

app.directive('image', function($q) {
        'use strict'

        var URL = window.URL || window.webkitURL;

        var getResizeArea = function () {
            var resizeAreaId = 'fileupload-resize-area';

            var resizeArea = document.getElementById(resizeAreaId);

            if (!resizeArea) {
                resizeArea = document.createElement('canvas');
                resizeArea.id = resizeAreaId;
                resizeArea.style.visibility = 'hidden';
                document.body.appendChild(resizeArea);
            }

            return resizeArea;
        }

        var resizeImage = function (origImage, options) {
            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;
            var quality = options.resizeQuality || 0.7;
            var type = options.resizeType || 'image/jpg';

            var canvas = getResizeArea();

            var height = origImage.height;
            var width = origImage.width;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            //draw image on canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(origImage, 0, 0, width, height);

            // get the data from canvas as 70% jpg (or specified type).
            return canvas.toDataURL(type, quality);
        };

        var createImage = function(url, callback) {
            var image = new Image();
            image.onload = function() {
                callback(image);
            };
            image.src = url;
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };


        return {
            restrict: 'A',
            scope: {
                image: '=',
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeQuality: '@?',
                resizeType: '@?',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var doResizing = function(imageResult, callback) {
                    createImage(imageResult.url, function(image) {
                        var dataURL = resizeImage(image, scope);
                        imageResult.resized = {
                            dataURL: dataURL,
                            type: dataURL.match(/:(.+\/.+);/)[1],
                        };
                        callback(imageResult);
                    });
                };

                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        //console.log(imageResult);
                        if(attrs.multiple)
                            scope.image.push(imageResult);
                        else
                            scope.image = imageResult; 
                    });
                };


                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;
                    for(var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            doResizing(imageResult, function(imageResult) {
                                applyScope(imageResult);
                            });
                        }
                        else { //no resizing
                            applyScope(imageResult);
                        }
                    }
                });
            }
        };
    });
