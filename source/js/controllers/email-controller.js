(function(window, angular, $, tinymce) {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalEmailInstanceController', ModalEmailInstanceController);

  ModalEmailInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    'StudentServices',
    '$window',
    'Notification',
    'uiGridConstants',
    '$scope',
    '$q',
    'contactform',
    '_',
    'moment',
    'myinitial'
  ];

  function ModalEmailInstanceController($log, $uibModalInstance, StudentServices, $window, Notification, 
  uiGridConstants, $scope, $q, contactform, _, moment, myinitial) {
    /* jshint validthis: true */
    $scope.myinitial = myinitial;
    $scope.cancel = cancel;
 //   $scope.submit = submit;
    $scope.form ={};
    $scope.submitForm = submitForm;
    $scope.refreshemails = refreshemails;
    $scope.setEmailFromPick = setEmailFromPick;
    $scope.messageChange = messageChange;
    $scope.getName = getName;
    $scope.tagTransform = tagTransform;
    $scope.addTo = addTo;
    $scope.addCC = addCC;
    $scope.addBCC = addBCC;
    $scope.stuff = 'mike';
//    $scope.modal = $uibModalInstance;
    $scope.message='';
    $scope.result = 'hidden';
    $scope.resultMessage='';
    $scope.inputEmail=[];
    $scope.inputCC=[];
    $scope.inputBCC=[];
    $scope.input = {
      "Subject": "",
      "Message": ""
    };
    $scope.submitButtonDisabled = false;
    $scope.refreshemaillist = [];
    $scope.eventResult ='';
    $scope.emailpick =  [];
    
    if (Object.keys(myinitial).length !== 0 ) {
      var item = tagTransform(myinitial.from);
      $scope.emailpick.push(item);
      setEmailFromPick([item]);
      if (myinitial.emailtype === 'reply' ) {
        addTo();
        $scope.input.Subject = 'Re: ' + myinitial.subject;
      } else if (myinitial.emailtype === 'forward' ) {
        $scope.input.Subject = 'Fw: ' + myinitial.subject;
      } else {
        $scope.input.Subject =  myinitial.subject;
      }
      $scope.input.Message = "On " + myinitial.emaildate + " " + myinitial.from + " wrote: ";
      $scope.input.Message += '<p style="padding-left: 30px;">' + myinitial.body + "</p>";
    }

 $scope.tinymceOptions = {
        resize: true,
        width: '100%',  
        height: 200,
  selector: 'textarea',
  theme: 'modern',
  plugins: 'print preview fullpage  searchreplace autolink directionality  visualblocks visualchars fullscreen image code link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount   imagetools    contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link image | code | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
//  image_advtab: true,
  relative_urls: false,
  remove_script_host: false,
template_replace_values : {
    name : getName
},
  templates: "../v1/emailtemplates",
  content_css: [
    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
    '//www.tinymce.com/css/codepen.min.css'
  ],
  // enable title field in the Image dialog
  image_title: true, 
  // enable automatic uploads of images represented by blob or data URIs
  automatic_uploads: true,
  // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
   images_upload_url: '../v1/imageuploader.php',
  // here we add custom filepicker only to Image dialog
//  file_picker_types: 'image', 
// and here's our custom image picker
/*
  file_picker_callback: function(cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    // Note: In modern browsers input[type="file"] is functional without 
    // even adding it to the DOM, but that might not be the case in some older
    // or quirky browsers like IE, so you might want to add it to the DOM
    // just in case, and visually hide it. And do not forget do remove it
    // once you do not need it anymore.

    input.onchange = function() {
      var file = this.files[0];
      
      var reader = new FileReader();
      reader.onload = function () {
        // Note: Now we need to register the blob in TinyMCEs image blob
        // registry. In the next release this part hopefully won't be
        // necessary, as we are looking to handle it internally.
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        // call the callback and populate the Title field with the file name
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  }  
*/
    };    
    
    $scope.submitted = false; //used so that form errors are shown only after the form has been submitted

    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("ModalEmailInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("ModalEmailInstanceController dismissed");
      $log.debugEnabled(false);
    });

    $.fn.Data.Portlet('Email-controller.js');

  function tagTransform(newTag) {
    var item = {
        FirstName: newTag,
        LastName: 'unknown',
        FullName: newTag,
        email: newTag,
        ID: 'unknown'
    };

    return item;
    }
    function getName() {
      var name;
      if (typeof($scope.eventResult.item) != 'undefined') {
        name = $scope.eventResult.item[0].FullName;
      } else {
        name ='';
      }
      return name;
    }
    function messageChange(value){
      $log.debug("messageChange entered",value);
    }
    function addTo() {
      $scope.inputEmail = angular.copy( $scope.eventResult) ;
    }
    function addCC() {
      $scope.inputCC = angular.copy(  $scope.eventResult );
    }
    function addBCC() {
      $scope.inputBCC = angular.copy(  $scope.eventResult );
    }
    function setEmailFromPick(item){
        $scope.eventResult = {item: item};
    }

    function refreshemails(theinput) {
      $log.debug("refreshemails", theinput);
        return StudentServices.refreshEmails(theinput).then(function(data) {
            $log.debug('controller refreshemails returned data');
            $log.debug(data);
            $scope.refreshemaillist = data;
            return $scope.refreshemaillist;
        });

    }

    function submitForm() {
  //    $log.debug("email entered",theform, $scope.contactform);
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;

        if ($scope.form.contactform.$valid) {
          var emailto ='', emailcc='', emailbcc='', emailusers=[];
          if (typeof($scope.inputEmail.item) !== 'undefined') {
            for (var i=0;i<$scope.inputEmail.item.length;i++) {
              emailto += $scope.inputEmail.item[i].email + ';';
            } 
            for (var i=0;i<$scope.inputEmail.item.length;i++) {
              emailusers.push({"ID": $scope.inputEmail.item[i].ID});
            } 
          }
          if (typeof($scope.inputCC.item) !== 'undefined') {
            for (var i=0;i<$scope.inputCC.item.length;i++) {
              emailcc += $scope.inputCC.item[i].email + ';';
            }
            for (var i=0;i<$scope.inputCC.item.length;i++) {
              emailusers.push({"ID": $scope.inputCC.item[i].ID});
            } 
          }
          if (typeof($scope.inputBCC.item) !== 'undefined') {
            for (var i=0;i<$scope.inputBCC.item.length;i++) {
              emailbcc += $scope.inputBCC.item[i].email + ';';
            }
            for (var i=0;i<$scope.inputBCC.item.length;i++) {
              emailusers.push({"ID": $scope.inputBCC.item[i].ID});
            } 
          }
          var path = "../v1/email";
          var uniqcontacts = _.uniq(emailusers, false, function(p){return p.ID});
          
          var thedata = {
            "emailHead": {
            "_subject": $scope.input.Subject,
            "_to": emailto,
            "_cc": emailcc,
            "_bcc": emailbcc,
            "_date": moment(),
            "contacts": uniqcontacts,
            "inout": "out"
            },
            "emailBody": {
              "body": $scope.input.Message
            }
          };
    
          $log.debug('about sendEmail ', thedata, path);


          return StudentServices.sendEmail(path, thedata)
            .then(function(data) {
              $log.debug('sendEmail returned data');
              $log.debug(data);
              if (!data.error) { //success comes from the return json object
                  $scope.submitButtonDisabled = true;
                  $scope.resultMessage = data.message;
                  $scope.result='bg-success';
              } else {
                  $scope.submitButtonDisabled = false;
                  $scope.resultMessage = data.message;
                  $scope.result='bg-danger';
              }
    
            }).catch(function(e) {
              $log.debug('sendEmail failure:');
              $log.debug("error", e);
              $scope.message = e;
              $scope.resultMessage = 'Failed  Please fill out all the fields.';
              $scope.submitButtonDisabled = false;
              $scope.result='bg-danger';
              Notification.error({ message: e, delay: 5000 });
              throw e;
            });
        } else {
            $scope.resultMessage = 'Failed: Please fill out all the fields.';
            $scope.result='bg-danger';
            $scope.submitButtonDisabled = false;
        }
    }




    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }


})(window, window.angular, window.$, window.tinymce);
