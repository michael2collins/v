import angular from 'angular';

export class ModalCameraController {

  constructor(
    $scope, $log, $uibModal, $document, $window, PhotoServices, Notification

  ) {
    'ngInject';
    this.$scope = $scope;
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.$document = $document;
    this.$window = $window;
    this.Notification = Notification;
    this.PhotoServices = PhotoServices;
    this.dataToPass = $scope.$parent.$resolve.dataToPass;
  }


  $onInit() {
    console.log('entering ModalCameraController oninit');

    var vmpicmodal = this;

    vmpicmodal.picfile = vmpicmodal.dataToPass.pictureurl;
    vmpicmodal.animationsEnabled = true;

    vmpicmodal.cameraIsOn = 'off';

    vmpicmodal.pic = ''; //or should we get this from the db

    vmpicmodal.shutter = new Audio();
    vmpicmodal.shutter.autoplay = false;
    vmpicmodal.shutter.src = vmpicmodal.$window.navigator.userAgent.match(/Firefox/) ? '../images/shutter.ogg' : '../images/shutter.mp3';
    vmpicmodal.pre_take_buttons = null;
    vmpicmodal.post_take_buttons = null;
    vmpicmodal.Webcam = vmpicmodal.$window.Webcam;
    vmpicmodal.data_uri = null;
    vmpicmodal.post_take_buttons = false;
    vmpicmodal.pre_take_buttons = true;
    vmpicmodal.activate();
  }

  activate() {
    var vmpicmodal=this;
    vmpicmodal.student = vmpicmodal.PhotoServices.setTheStudent(vmpicmodal.dataToPass);

  }
  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }
  

  openCamera() {
    var vmpicmodal=this;
    
    vmpicmodal.$log.debug("openCamera");
    angular.forEach(angular.element(document).find('div'), function(node) {
      //$log.debug('finddiv',node);
      //          if(node.id == 'photowrapper'){
      if (node.id == 'my_camera') {
        //do something   ]
        vmpicmodal.$log.debug('mycam', node);
        vmpicmodal.camera_on();
        vmpicmodal.Webcam.attach(node);
      }
    });

  }

  pretakon() {
    var vmpicmodal=this;
    // swap buttons back to first set
    vmpicmodal.pre_take_buttons = true;
    vmpicmodal.post_take_buttons = false;
  }
  posttakeon() {
    var vmpicmodal=this;
    // swap button sets
    vmpicmodal.pre_take_buttons = false;
    vmpicmodal.post_take_buttons = true;
  }

  preview_snapshot() {
    var vmpicmodal=this;
    // play sound effect
    //			try { vmpicmodal.shutter.currentTime = 0; } catch(e) {;} // fails in IE
    //			vmpicmodal.shutter.play();

    // freeze camera so user can preview current frame
    vmpicmodal.Webcam.freeze();
    vmpicmodal.posttakeon();
  }

  cancel_preview() {
    var vmpicmodal=this;
    // cancel preview freeze and return to live camera view
    vmpicmodal.Webcam.unfreeze();
    vmpicmodal.pretakon();
  }
  camera_off() {
    var vmpicmodal=this;
    vmpicmodal.cameraIsOn = 'off';
    vmpicmodal.Webcam.reset();

    vmpicmodal.$log.debug("Camera_off");

    vmpicmodal.pretakon();
  }
  checkCameraIsOn() {
    var vmpicmodal=this;
    return vmpicmodal.cameraIsOn === 'on';
  }
  camera_on() {
    var vmpicmodal=this;
    vmpicmodal.cameraIsOn = 'on';
    vmpicmodal.Webcam.set({
      width: 320,
      height: 240,
    });
    vmpicmodal.Webcam.attach('#my_camera');
    vmpicmodal.posttakeon();
  }
  saveStudentPic(student, picnm) {
    var vmpicmodal=this;
    vmpicmodal.PhotoServices.saveStudentPic(student, picnm).then(function(data) {
      vmpicmodal.$log.debug('saveStudentPic returned data:');
      vmpicmodal.$log.debug(data);
      vmpicmodal.dataToPass.pictureurldecache = picnm + '?decache=' + Math.random();

    }, function(error) {
      vmpicmodal.$log.debug('saveStudentPic', error);
      vmpicmodal.Notification.error({ message: error, delay: 5000 });
      return (error);
    });

  }
  save_photo(picnm, student) {
    var vmpicmodal=this;
    picnm = encodeURI(picnm);
    vmpicmodal.$log.debug('save_photo', picnm, student);
    // actually snap photo (from preview freeze) and display it
    vmpicmodal.Webcam.snap(function(data_uri) {

      vmpicmodal.data_uri = data_uri;

      var ur = '../v1/picupload?picnm=' + picnm;
      vmpicmodal.$log.debug("picnm", ur);

      // shut down camera, stop capturing
      vmpicmodal.Webcam.reset();
      vmpicmodal.cameraIsOn = 'off';
      vmpicmodal.Webcam.upload(data_uri, ur, function(code, text) {
        vmpicmodal.$log.debug("upload called", code, text);
      });
      vmpicmodal.Webcam.on('error', function(err) {
        // an error occurred (see 'err')
        vmpicmodal.$log.debug('webcam err', err);
      });
      vmpicmodal.Webcam.on('uploadComplete', function(code, text) {
        // Upload complete!
        // 'code' will be the HTTP response code from the server, e.g. 200
        // 'text' will be the raw response content
        vmpicmodal.$log.debug("uploaded", code, text);
        //call services to save pic
        vmpicmodal.saveStudentPic(student, picnm);

      });

      // show results, hide photo booth
      vmpicmodal.$window.document.getElementById('results').style.display = '';
      //			document.getElementById('my_photo_booth').style.display = 'none';

    });
  }


  openpick() {
    var vmpicmodal=this;

    vmpicmodal.modalInstance = vmpicmodal.$uibModal.open({
      animation: vmpicmodal.animationsEnabled,
//      templateUrl: 'myPickupload.html',
//      controller: 'ModalPicSearchController as vmpicselect',
      component: 'pickuploadComponent',
      size: 'lg',
      resolve: {
        picfile: function() {
          return vmpicmodal.picFile;
        }
      }
    });
    vmpicmodal.modalInstance.result.then(function(selectedpic) {
      vmpicmodal.$log.debug('pick upload modalInstance result picfile:', selectedpic);
      vmpicmodal.picfile = selectedpic;
      vmpicmodal.dataToPass.picfile = selectedpic;

    }, function() {
      vmpicmodal.$log.info('Modal dismissed at: ' + new Date());
    });
  }


  opensearch() {
    var vmpicmodal=this;
//    var modalScope = vmpicmodal.$scope.$new();

    vmpicmodal.modalInstance = vmpicmodal.$uibModal.open({
      animation: vmpicmodal.animationsEnabled,
//      templateUrl: 'myPicksearch.html',
//      controller: 'ModalPicListerController as vmpicsearch',
      component: 'piclisterComponent',
      size: 'lg',
      resolve: {
        picfile: function() {
          return vmpicmodal.picFile;
        }
      }
    });
    vmpicmodal.modalInstance.result.then(function(selectedpic) {
      vmpicmodal.$log.debug('picsearch modalInstance result picfile:', selectedpic);

      vmpicmodal.dataToPass.picfile = selectedpic;
    }, function(error) {
      vmpicmodal.$log.info('Modal dismissed at: ' + new Date(), error);
    });

  }
}
