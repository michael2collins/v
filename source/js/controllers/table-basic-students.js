App.controller('StudentsTableBasicController', ['$scope','$http','$routeParams', function($scope, $http, $routeParams){
   $.fn.Data.Portlet();

var x = [
  {
    "id": "5340",
    "LastName": "Birch",
    "FirstName": "Spencer",
    "Email": "spencerbirch45@gmail.com",
    "Email2": "jenbirchis@gmail.com",
    "Parent": "Jennifer & Rychard",
    "Phone": "5086517734",
    "AltPhone": null,
    "Address": "9 Sawin Steet ",
    "City": "Natick",
    "State": "MA",
    "ZIP": "01760",
    "Notes": "",
    "Birthday": "1999-03-27 00:00:00",
    "StartDate": "2005-04-27 00:00:00",
    "NewRank": null,
    "BeltSize": "4",
    "CurrentRank": "2nd Degree Black Belt",
    "LastPromoted": "2012-12-01 00:00:00",
    "ReferredBy": null,
    "ConsentToPublicPictures": "0",
    "InstructorPaymentFree": "0",
    "ContactType": "Inactive",
    "include": "0",
    "InstructorFlag": "0",
    "quickbooklink": "Birch, Spencer",
    "instructorTitle": "Intern",
    "testDate": "",
    "testTime": "",
    "bdayinclude": "0",
    "signupDate": "2005-04-27 00:00:00",
    "sex": null,
    "medicalConcerns": null,
    "GuiSize": null,
    "ShirtSize": null,
    "phoneExt": null,
    "altPhoneExt": null,
    "CurrentReikiRank": null,
    "StudentSchool": null,
    "EmergencyContact": null,
    "sendWelcomeCard": "0",
    "dateEntered": null,
    "dateInactive": "2014-04-03 16:55:09",
    "CurrentIARank": null,
    "ReadyForNextRank": "0",
    "nextScheduledTest": null,
    "upgrade": "1369",
    "SSMA_TimeStamp": "\u0000\u0000\u0000\u0000\u0000\u0000Q\u0092"
  },
  {
    "id": "5341",
    "LastName": "Bombino",
    "FirstName": "Steven",
    "Email": "nancynavarro62@gmail.com",
    "Email2": "stbombino@students.natickps.org",
    "Parent": "Nancy & Joe",
    "Phone": "5086470336",
    "AltPhone": "5086476400",
    "Address": "8 Sheridan Street",
    "City": "Natick",
    "State": "MA",
    "ZIP": "01760",
    "Notes": "",
    "Birthday": "1996-05-27 00:00:00",
    "StartDate": "2004-02-23 00:00:00",
    "NewRank": null,
    "BeltSize": "5",
    "CurrentRank": "1st Degree Black Belt",
    "LastPromoted": "2011-12-10 00:00:00",
    "ReferredBy": null,
    "ConsentToPublicPictures": "0",
    "InstructorPaymentFree": "1",
    "ContactType": "Inactive",
    "include": "0",
    "InstructorFlag": "0",
    "quickbooklink": "Bambino, Steven",
    "instructorTitle": "Intern",
    "testDate": "12\/10\/2011",
    "testTime": "2:00 PM",
    "bdayinclude": "0",
    "signupDate": "2004-02-23 00:00:00",
    "sex": "Male",
    "medicalConcerns": null,
    "GuiSize": null,
    "ShirtSize": null,
    "phoneExt": null,
    "altPhoneExt": "1629",
    "CurrentReikiRank": null,
    "StudentSchool": null,
    "EmergencyContact": null,
    "sendWelcomeCard": "0",
    "dateEntered": null,
    "dateInactive": "2014-09-22 15:13:00",
    "CurrentIARank": null,
    "ReadyForNextRank": "0",
    "nextScheduledTest": null,
    "upgrade": "1370",
    "SSMA_TimeStamp": "\u0000\u0000\u0000\u0000\u0000\u0000Q\u0093"
  },
  {
    "id": "5342",
    "LastName": "Bravin",
    "FirstName": "Alyssa",
    "Email": "gbravin@aol.com",
    "Email2": null,
    "Parent": "Claudia & Giovanni",
    "Phone": "5086555090",
    "AltPhone": "6175294962",
    "Address": "2 Durant Road",
    "City": "Natick",
    "State": "MA",
    "ZIP": "01760",
    "Notes": "",
    "Birthday": "1997-09-14 00:00:00",
    "StartDate": "2007-08-22 00:00:00",
    "NewRank": null,
    "BeltSize": "4",
    "CurrentRank": "3rd Degree Black Belt",
    "LastPromoted": "2014-12-13 00:00:00",
    "ReferredBy": null,
    "ConsentToPublicPictures": "0",
    "InstructorPaymentFree": "0",
    "ContactType": "BlackBelt",
    "include": "0",
    "InstructorFlag": "0",
    "quickbooklink": "Bravin, Alyssa",
    "instructorTitle": "Intern",
    "testDate": "",
    "testTime": "",
    "bdayinclude": "0",
    "signupDate": "2007-08-22 00:00:00",
    "sex": null,
    "medicalConcerns": null,
    "GuiSize": "3",
    "ShirtSize": "Adult S",
    "phoneExt": null,
    "altPhoneExt": null,
    "CurrentReikiRank": null,
    "StudentSchool": null,
    "EmergencyContact": null,
    "sendWelcomeCard": "0",
    "dateEntered": null,
    "dateInactive": null,
    "CurrentIARank": "Intern",
    "ReadyForNextRank": "0",
    "nextScheduledTest": null,
    "upgrade": "1372",
    "SSMA_TimeStamp": "\u0000\u0000\u0000\u0000\u0000\u0000Q\u0094"
  },
  {
    "id": "5343",
    "LastName": "Carey",
    "FirstName": "Gabriela",
    "Email": "mariaocarey@msn.com ",
    "Email2": null,
    "Parent": "Micheal & Maria",
    "Phone": null,
    "AltPhone": null,
    "Address": "88 Bacon Street",
    "City": "Natick",
    "State": "MA",
    "ZIP": "01760",
    "Notes": "",
    "Birthday": "2010-03-01 00:00:00",
    "StartDate": "2010-03-01 18:42:21",
    "NewRank": null,
    "BeltSize": "3",
    "CurrentRank": "1st Degree Black Belt",
    "LastPromoted": "2009-11-07 00:00:00",
    "ReferredBy": null,
    "ConsentToPublicPictures": "0",
    "InstructorPaymentFree": "0",
    "ContactType": "Inactive",
    "include": "0",
    "InstructorFlag": "0",
    "quickbooklink": null,
    "instructorTitle": "STORM",
    "testDate": null,
    "testTime": null,
    "bdayinclude": "0",
    "signupDate": "2010-03-01 18:42:21",
    "sex": null,
    "medicalConcerns": null,
    "GuiSize": null,
    "ShirtSize": null,
    "phoneExt": null,
    "altPhoneExt": null,
    "CurrentReikiRank": null,
    "StudentSchool": null,
    "EmergencyContact": null,
    "sendWelcomeCard": "0",
    "dateEntered": null,
    "dateInactive": null,
    "CurrentIARank": null,
    "ReadyForNextRank": "0",
    "nextScheduledTest": null,
    "upgrade": "1373",
    "SSMA_TimeStamp": "\u0000\u0000\u0000\u0000\u0000\u0000Q\u0095"
  },
  {
    "id": "5344",
    "LastName": "Carey",
    "FirstName": "Maria",
    "Email": "mariaocarey@msn.com ",
    "Email2": null,
    "Parent": null,
    "Phone": "5086534135",
    "AltPhone": null,
    "Address": "88 Bacon Street",
    "City": "Natick",
    "State": "MA",
    "ZIP": "01760",
    "Notes": "",
    "Birthday": "1964-06-24 00:00:00",
    "StartDate": "2008-06-21 00:00:00",
    "NewRank": null,
    "BeltSize": "5",
    "CurrentRank": "Yellow Belt",
    "LastPromoted": "2008-07-26 00:00:00",
    "ReferredBy": null,
    "ConsentToPublicPictures": "0",
    "InstructorPaymentFree": "0",
    "ContactType": "Inactive",
    "include": "0",
    "InstructorFlag": "0",
    "quickbooklink": "Carey, Sophia & Gabriela",
    "instructorTitle": null,
    "testDate": "",
    "testTime": "",
    "bdayinclude": "0",
    "signupDate": "2008-06-21 00:00:00",
    "sex": null,
    "medicalConcerns": null,
    "guiSize": null,
    "ShirtSize": null,
    "phoneExt": null,
    "altPhoneExt": null,
    "CurrentReikiRank": null,
    "StudentSchool": null,
    "EmergencyContact": null,
    "sendWelcomeCard": "0",
    "dateEntered": null,
    "dateInactive": null,
    "CurrentIARank": null,
    "ReadyForNextRank": "0",
    "nextScheduledTest": null,
    "upgrade": "1374",
    "SSMA_TimeStamp": "\u0000\u0000\u0000\u0000\u0000\u0000Q\u0096"
  }
];
      $scope.students = []; 
      
 //   setTimeout(function(){

       $http.get('/testdata/students.json').
         success(function(data, status, headers, config) {
             console.log('got students');
             $scope.status = status;
             $scope.students = data;
             console.log(data);
         }).
         error(function (data, status, headers, config) {
                 //  Do some error handling here
            $scope.data = data || "Request Failed";
            $scope.status = status;
         });   
  //  },50);

	/*
    setTimeout(function(){
        // Init
        var spinner = $( ".spinner" ).spinner();
        var table = $('#table_id').dataTable( {
            "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
        } );

        var tableTools = new $.fn.dataTable.TableTools( table, {
            "sSwfPath": "../vendors/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
            "buttons": [
                "copy",
                "csv",
                "xls",
                "pdf",
                { "type": "print", "buttonText": "Print me!" }
            ]
        } );
        $(".DTTT_container").css("float","right");

    },50);
*/
}]);

App.controller('StudentsTableBasicnotyetController',['$http', '$scope', 'StudentServices',  function($http, $scope, StudentServices){

	var students = StudentServices.getStudents();
	students.then(function (val) {
		$scope.students = val;
	});

    
}]);
 