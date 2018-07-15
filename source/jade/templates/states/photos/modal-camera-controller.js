(function (window,angular) {
  'use strict';

  angular
    .module('ng-admin.all')
    .controller('ModalCameraController', ModalCameraController);

  ModalCameraController.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      '$uibModal',
      '$document',
      '$window',
      'PhotoServices',
      'Notification',
      'dataToPass'
    ];


  function ModalCameraController($scope,  $log, $uibModalInstance, $uibModal, $document, $window, PhotoServices, Notification,dataToPass) {
    /* jshint validthis: true */
    $log.debug('thisvm',dataToPass);
    var vmpicmodal = this;
    vmpicmodal.dataToPass = dataToPass;
   // $scope.dataToPass = dataToPass;
    
    vmpicmodal.picfile = vmpicmodal.dataToPass.pictureurl;
    vmpicmodal.animationsEnabled = true;

    vmpicmodal.openpick = openpick;
    vmpicmodal.opensearch = opensearch;
    vmpicmodal.openCamera = openCamera;
    vmpicmodal.cancel = cancel;
    vmpicmodal.preview_snapshot = preview_snapshot;
    vmpicmodal.cancel_preview = cancel_preview;
    vmpicmodal.cameraIsOn = 'off';
    vmpicmodal.checkCameraIsOn = checkCameraIsOn;
    vmpicmodal.camera_on = camera_on;
    vmpicmodal.camera_off = camera_off;
    vmpicmodal.save_photo = save_photo;
    vmpicmodal.saveStudentPic = saveStudentPic;
    
    vmpicmodal.pic = ''; //or should we get this from the db
    vmpicmodal.student = PhotoServices.setTheStudent(vmpicmodal.dataToPass);
    
  //  vmpicmodal.modalInstance = undefined;

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

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
        
    function openCamera() {
        $log.debug("openCamera");
        /*global angular*/
        angular.forEach(angular.element(document).find('div'), function(node) {
            //$log.debug('finddiv',node);
//          if(node.id == 'photowrapper'){
          if(node.id == 'my_camera'){
            //do something   ]
                $log.debug('mycam', node);
                vmpicmodal.camera_on();                
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
//			try { vmpicmodal.shutter.currentTime = 0; } catch(e) {;} // fails in IE
//			vmpicmodal.shutter.play();
			
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

        $log.debug("Camera_off");

			pretakon();
		}
		function checkCameraIsOn() {
		  return vmpicmodal.cameraIsOn === 'on';
		}
		function camera_on() {
		    vmpicmodal.cameraIsOn = 'on';
		    vmpicmodal.Webcam.set({
        width: 320,
        height: 240,
    });
            vmpicmodal.Webcam.attach( '#my_camera' );
			posttakeon();
		}
		function saveStudentPic(student,picnm) {
       PhotoServices.saveStudentPic(student,picnm).then(function (data) {
          $log.debug('saveStudentPic returned data:');
          $log.debug(data);
          vmpicmodal.dataToPass.pictureurldecache = picnm +  '?decache=' + Math.random();

      },function(error) {
              $log.debug('saveStudentPic',error);
              Notification.error({message: error, delay: 5000});
              return (error);
      });
		  
		}
		function save_photo(picnm,student) {
		  picnm = encodeURI(picnm);
      $log.debug('save_photo', picnm, student);
			// actually snap photo (from preview freeze) and display it
			vmpicmodal.Webcam.snap( function(data_uri) {

                vmpicmodal.data_uri = data_uri;            

                var ur = '../v1/picupload?picnm=' + picnm;
                $log.debug("picnm",ur);
                
			// shut down camera, stop capturing
			    vmpicmodal.Webcam.reset();
    		  vmpicmodal.cameraIsOn = 'off';
                vmpicmodal.Webcam.upload( data_uri, ur, function(code, text) {
                    $log.debug("upload called",code,text);
                });
                vmpicmodal.Webcam.on('error', function(err) {
                  // an error occurred (see 'err')
                  $log.debug('webcam err',err);
                } );                
                vmpicmodal.Webcam.on( 'uploadComplete', function(code, text) {
                    // Upload complete!
                    // 'code' will be the HTTP response code from the server, e.g. 200
                    // 'text' will be the raw response content
                    $log.debug("uploaded",code,text);
                    //call services to save pic
                    saveStudentPic(student,picnm);
                    
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
        controller: 'ModalPicSearchController as vmpicselect',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picFile;
          }
        }
      });
      vmpicmodal.modalInstance.result.then(function (selectedpic) {
          $log.debug('pick upload modalInstance result picfile:', selectedpic);
        vmpicmodal.picfile = selectedpic;
        vmpicmodal.dataToPass.picfile = selectedpic;

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }
    

    function opensearch() {

      vmpicmodal.modalInstance = $uibModal.open({
        animation: vmpicmodal.animationsEnabled,
        templateUrl: 'myPicksearch.html',
        controller: 'ModalPicListerController as vmpicsearch',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picFile;
          }
        }
      });
      vmpicmodal.modalInstance.result.then(function (selectedpic) {
          $log.debug('picsearch modalInstance result picfile:', selectedpic);
        
        vmpicmodal.dataToPass.picfile = selectedpic;
      }, function (error) {
        $log.info('Modal dismissed at: ' + new Date(), error);
      });

    }
  }

})(window,window.angular);
