(function () {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalPicUploadController', ModalPicUploadController)
    .controller('ModalPicInstanceController', ModalPicInstanceController)
    .controller('ModalPicInstance2Controller', ModalPicInstance2Controller);


  ModalPicUploadController.$inject = [
      '$scope',
      '$log',
      '$uibModal',
      '$document',
      '$window',
      'StudentServices',
      'Notification'
    ];
  ModalPicInstanceController.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      'picfile',
      'StudentServices',
      '$route'
    ];
  ModalPicInstance2Controller.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      'picfile',
      'StudentServices',
      'uiGridConstants',
      '$timeout',
      '$route'
    ];


  function ModalPicUploadController($scope,  $log, $uibModal, $document, $window, StudentServices, Notification) {
    /* jshint validthis: true */
    var vmpicmodal = this;

    vmpicmodal.animationsEnabled = true;

    vmpicmodal.openpick = openpick;
    vmpicmodal.opensearch = opensearch;
    vmpicmodal.openCamera = openCamera;
    vmpicmodal.preview_snapshot = preview_snapshot;
    vmpicmodal.cancel_preview = cancel_preview;
    vmpicmodal.cameraIsOn = 'off';
    vmpicmodal.checkCameraIsOn = checkCameraIsOn;
    vmpicmodal.camera_on = camera_on;
    vmpicmodal.camera_off = camera_off;
    vmpicmodal.save_photo = save_photo;
    
    vmpicmodal.pic = ''; //or should we get this from the db
    vmpicmodal.student = '';
    vmpicmodal.modalInstance = undefined;

	    vmpicmodal.shutter = new Audio();
		vmpicmodal.shutter.autoplay = false;
		/*global navigator*/
		vmpicmodal.shutter.src = navigator.userAgent.match(/Firefox/) ? '../images/shutter.ogg' : '../images/shutter.mp3';
		vmpicmodal.pre_take_buttons;
        vmpicmodal.post_take_buttons;
        vmpicmodal.Webcam = $window.Webcam;
        vmpicmodal.data_uri;
        vmpicmodal.post_take_buttons = false;
        vmpicmodal.pre_take_buttons = true;
        
    //    openCamera();
        
    function openCamera() {
        console.log("openCamera");
        /*global angular*/
        angular.forEach(angular.element(document).find('div'), function(node) {
            //console.log('finddiv',node);
//          if(node.id == 'photowrapper'){
          if(node.id == 'my_camera'){
            //do something   ]
                console.log('mycam', node);
                vmpicmodal.Webcam.attach( node );
            }
        });
        
    }

		function pretakon() {
			// swap buttons back to first set
			vmpicmodal.pre_take_buttons = true;
			vmpicmodal.post_take_buttons = false;
		}
		function posttakeon() {
			// swap button sets
			vmpicmodal.pre_take_buttons = false;
			vmpicmodal.post_take_buttons = true;
		}
		
		function preview_snapshot() {
			// play sound effect
			try { vmpicmodal.shutter.currentTime = 0; } catch(e) {;} // fails in IE
			vmpicmodal.shutter.play();
			
			// freeze camera so user can preview current frame
			vmpicmodal.Webcam.freeze();
			posttakeon();
		}
		
		function cancel_preview() {
			// cancel preview freeze and return to live camera view
			vmpicmodal.Webcam.unfreeze();
			pretakon();
		}
		function camera_off() {
		  vmpicmodal.cameraIsOn = 'off';
			vmpicmodal.Webcam.reset();
			
			pretakon();
		}
		function checkCameraIsOn() {
		  return vmpicmodal.cameraIsOn === 'on';
		}
		function camera_on() {
		    vmpicmodal.cameraIsOn = 'on';
            vmpicmodal.Webcam.attach( '#my_camera' );
			posttakeon();
		}
		
		function save_photo(picnm,student) {
			// actually snap photo (from preview freeze) and display it
			vmpicmodal.Webcam.snap( function(data_uri) {

                vmpicmodal.data_uri = data_uri;            

    			//var lname = document.getElementById('inputLastName').value;
    			//var fname = document.getElementById('inputFirstName').value;
    			//var stuid = document.getElementById('studentid').innerHTML;
                //var picnm = lname + "." + fname + "." + stuid + ".jpg";
                var ur = '../v1/picupload?picnm=' + picnm;
                console.log("picnm",ur);
                
    			// display results in page
    		//	document.getElementById('results').innerHTML = 
    		//		'<h2>Here is your large, cropped image:</h2>' + 
    		//		'<img src="'+data_uri+'"/><br/></br>' + 
    			//	'<a href="'+data_uri+'" target="_blank">Open image in new window...</a>';
			
			// shut down camera, stop capturing
			    vmpicmodal.Webcam.reset();
    		  vmpicmodal.cameraIsOn = 'off';
                vmpicmodal.Webcam.upload( data_uri, ur, function(code, text) {
                    console.log("upload called",code,text);
                });
                vmpicmodal.Webcam.on( 'uploadComplete', function(code, text) {
                    // Upload complete!
                    // 'code' will be the HTTP response code from the server, e.g. 200
                    // 'text' will be the raw response content
                    console.log("uploaded",code,text);
        //            var em = angular.element(document.getElementById('form-layouts-editstudent'));
                    //console.log("em", em);
          //          var emscope = em.scope();
        //            console.log("emscope", emscope);
         //           setTimeout(function() {
          //              emscope.vmstudent.setStudentPIC(picnm);
        //                console.log("finished setpic");
         //           }, 1000);    
                    //call services to save pic
                     StudentServices.saveStudentPic(student,picnm).then(function (data) {
                        $log.debug('saveStudentPic returned data:');
                        $log.debug(data);
                    },function(error) {
                            $log.debug('saveStudentPic',error);
                            Notification.error({message: error, delay: 5000});
                            return (error);
                    });
                    
                } );
                
				// show results, hide photo booth
				document.getElementById('results').style.display = '';
	//			document.getElementById('my_photo_booth').style.display = 'none';
				
			} );
		}


    function openpick() {

      vmpicmodal.modalInstance = $uibModal.open({
        animation: vmpicmodal.animationsEnabled,
        templateUrl: 'myPickupload.html',
        controller: 'ModalPicInstanceController as vmpicselect',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picFile;
          }
        }
      });
      vmpicmodal.modalInstance.result.then(function (selectedpic, student) {
          console.log('pick upload modalInstance result picfile:', selectedpic);
        vmpicmodal.picfile = selectedpic;
        vmpicmodal.student = student;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }
    

    function opensearch() {

      vmpicmodal.modalInstance = $uibModal.open({
        animation: vmpicmodal.animationsEnabled,
        templateUrl: 'myPicksearch.html',
        controller: 'ModalPicInstance2Controller as vmpicsearch',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picFile;
          }
        }
      });
      vmpicmodal.modalInstance.result.then(function (selectedpic, student) {
          console.log('picsearch modalInstance result picfile:', selectedpic);
        
        vmpicmodal.picfile = selectedpic;
        vmpicmodal.student = student;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    }
  }

  function ModalPicInstanceController($scope, $log, $uibModalInstance, picfile, StudentServices, $route) {
    /* jshint validthis: true */
    var vmpicselect = this;
    vmpicselect.ok = ok;
    vmpicselect.cancel = cancel;
    vmpicselect.picfile = picfile;
    vmpicselect.picfilelist = [];
    vmpicselect.renameFile = renameFile;
    vmpicselect.picpath = '../v1/studentfiles';
    vmpicselect.renamepath = '../v1/renamefile';
    vmpicselect.student = StudentServices.getTheStudent();
    vmpicselect.newpicfile = '';
    vmpicselect.okpicFile = '';


    activate();

    function activate() {
      console.log("picselect student");
      console.log(vmpicselect.student);
    }


    function renameFile(student, currentpicfile) {
      console.log('renameFile');
      console.log(' student:' );
      console.log(student);
      console.log('pic');
      console.log(currentpicfile);

      return StudentServices.renameStudentPicFile(vmpicselect.renamepath, student, currentpicfile).then(function (data) {
        $log.debug('renameFile returned data');
        $log.debug(data.data);
        vmpicselect.newpicfile = data.data.newpicfile;
        return vmpicselect.newpicfile;
      });
    }


    function ok() {
      console.log('hit ok');
      var thisstudent = StudentServices.getTheStudent();
      vmpicselect.okpicFile = StudentServices.getstudentPicFile();
      vmpicselect.okpicFile = renameFile(thisstudent, vmpicselect.okpicFile);
      console.log('got file for ok:', vmpicselect.okpicFile);
      console.log('for student:' ,thisstudent);

      $uibModalInstance.close(vmpicselect.okpicFile, thisstudent);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }


  function ModalPicInstance2Controller($scope, $log, $uibModalInstance, picfile, StudentServices, uiGridConstants, $timeout, $route) {
    /* jshint validthis: true */
    var vmpicsearch = this;
    vmpicsearch.ok = ok;
    vmpicsearch.cancel = cancel;
    vmpicsearch.picfile = picfile;
    vmpicsearch.picfilelist = [];
    vmpicsearch.getFiles = getFiles;
    vmpicsearch.renameFile = renameFile;
    vmpicsearch.picpath = '../v1/studentfiles';
    vmpicsearch.renamepath = '../v1/renamefile';
    vmpicsearch.student = StudentServices.getTheStudent();
    vmpicsearch.newpicfile = '';
    vmpicsearch.okpicFile = '';
    vmpicsearch.highlightFilteredHeader = highlightFilteredHeader;
    vmpicsearch.gridApi = undefined;

    activate();
    setGridOptions();

    function activate() {
        console.log("picselect student");
        console.log(vmpicsearch.student);
        getFiles();
    }


    function getFiles() {
      console.log('getfiles');
      return StudentServices.getstudentPicFiles(vmpicsearch.picpath).then(function (data) {
        $log.debug('getstudentPicFiles returned data');
        $log.debug(data.data);
        vmpicsearch.picfileList = data.data;
        vmpicsearch.gridOptions.data = data.data.files;
        $timeout(function() {
            $log.debug('getfiles timeout');
   //         $log.debug(vmpicsearch.gridApi);
            if(vmpicsearch.gridApi.selection.selectRow){
        //        vmpicsearch.gridApi.selection.getSelectedRows();
                $log.debug('selectRow');
              vmpicsearch.gridApi.selection.selectRow(vmpicsearch.gridOptions.data[0]);
            }
        });
        return vmpicsearch.picfileList;
      }); 
    }

    function renameFile(student, currentpicfile) {
      console.log('renameFile');
      console.log(' student:' );
      console.log(student);
      console.log('pic');
      console.log(currentpicfile);

      return StudentServices.renameStudentPicFile(vmpicsearch.renamepath, student, currentpicfile).then(function (data) {
        $log.debug('renameFile returned data');
        $log.debug(data.data);
        vmpicsearch.newpicfile = data.data.newpicfile;
        return vmpicsearch.newpicfile;
      });
    }

   function setGridOptions() {
            vmpicsearch.gridOptions = {
            enableFiltering: true,
            enableRowSelection: true,
            enableSelectAll: false,
            multiSelect: false,
            rowHeight: 128,
            showGridFooter: true,
            onRegisterApi: function( gridApi ) {
                  //set gridApi on scope
                vmpicsearch.gridApi = gridApi;
                    console.log('gridApi onRegisterApi',vmpicsearch.gridApi);
        //          console.log(gridApi);
        //          console.log(vmpicsearch);
                console.log($scope);
                    gridApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'row selected ' + row.entity.name;
                        console.log(msg);
                        StudentServices.setstudentPicFile(row.entity.name);

                  });
            },
            paginationPageSizes: [3, 50, 100],
            paginationPageSize: 3,
            columnDefs: [
                // default
                {
                    field: 'name',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'size',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'modtime',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {name: 'picture',
                    field: 'name', 
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <img width="80px" ng-src="./images/students/{{grid.getCellValue(row, col)}}"/></span></div>'
                }
                
            ]};

        }

    function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }


    function ok() {
      console.log('hit ok');
      var thisstudent = StudentServices.getTheStudent();
      vmpicsearch.okpicFile = StudentServices.getstudentPicFile();
      vmpicsearch.okpicFile = renameFile(thisstudent, vmpicsearch.okpicFile);
      console.log('got file for ok:', vmpicsearch.okpicFile);
      console.log('for student:' ,thisstudent);

      $uibModalInstance.close(vmpicsearch.okpicFile, thisstudent);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
 
})();
