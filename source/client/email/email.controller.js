//const { jQuery: $ } = window;
import angular from 'angular';

export class ModalEmailInstanceController {
  constructor(
    $log, studentServices, $window, Notification,
     $scope, $q, _, moment, UserServices
  ) {
    'ngInject';
    this.myinitial = $scope.$parent.$resolve.myinitial;
    this.$log = $log;
    this.StudentServices = studentServices;
    this.$window = $window;
    this.Notification = Notification;
    this.$scope = $scope;
    this.$q = $q;
    this.contactform = $scope.$parent.$resolve.contactform;
    this._ = _;
    this.moment = moment;
        this.UserServices = UserServices;

  }
  $onInit() {

    this.form = {};
    this.stuff = 'mike';
    this.message = '';
    this.result = 'hidden';
    this.resultMessage = '';
    this.inputEmail = [];
    this.inputCC = [];
    this.inputBCC = [];
    this.input = {
      "Subject": "",
      "Message": ""
    };
    this.submitButtonDisabled = false;
    this.refreshemaillist = [];
    this.eventResult = '';
    this.emailpick = [];
    
    this.init();

    if (Object.keys(this.myinitial).length !== 0) {
      var item = this.tagTransform(this.myinitial.from);
      this.emailpick.push(item);
      this.setEmailFromPick([item]);
      if (this.myinitial.emailtype === 'reply') {
        this.addTo();
        this.input.Subject = 'Re: ' + this.myinitial.subject;
      }
      else if (this.myinitial.emailtype === 'forward') {
        this.input.Subject = 'Fw: ' + this.myinitial.subject;
      }
      else {
        this.input.Subject = this.myinitial.subject;
      }
      this.input.Message = "On " + this.myinitial.emaildate + " " + this.myinitial.from + " wrote: ";
      this.input.Message += '<p style="padding-left: 30px;">' + this.myinitial.body + "</p>";
    }

    this.tinymceOptions = {
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
      template_replace_values: {
        name: this.getName
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
            var file = self.files[0];
            
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

    this.submitted = false; //used so that form errors are shown only after the form has been submitted


    //  $.fn.Data.Portlet('Email-controller.js');
  }
  init() {
    var self=this;
    var vm=this;
            if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ModalEmailInstanceController',vm.UserServices.isDebugEnabled());
        }

    self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
        var vm = event.currentScope.$ctrl;
      //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
      vm.$log.log("ModalEmailInstanceController started");

    });
    self.$scope.$on('$destroy', function iVeBeenDismissed() {
      self.$log.log("ModalEmailInstanceController dismissed");
      //self.$log.logEnabled(false);
    });
    
  }
  tagTransform(newTag) {
    var item = {
      FirstName: newTag,
      LastName: 'unknown',
      FullName: newTag,
      email: newTag,
      ID: 'unknown'
    };

    return item;
  }
  getName() {
    var name;
    if (typeof(this.eventResult.item) != 'undefined') {
      name = this.eventResult.item[0].FullName;
    }
    else {
      name = '';
    }
    return name;
  }
  messageChange(value) {
    this.$log.log("messageChange entered", value);
  }
  addTo() {
    this.inputEmail = angular.copy(this.eventResult);
  }
  addCC() {
    this.inputCC = angular.copy(this.eventResult);
  }
  addBCC() {
    this.inputBCC = angular.copy(this.eventResult);
  }
  setEmailFromPick(item) {
    this.eventResult = { item: item };
  }

  refreshemails(theinput) {
    var self = this;
    self.$log.log("refreshemails", theinput);
    return self.StudentServices.refreshEmails(theinput).then(function(data) {
      self.$log.log('controller refreshemails returned data');
      self.$log.log(data);
      self.refreshemaillist = data;
      return self.refreshemaillist;
    });

  }

  submitForm() {
    var self = this;
    self.submitted = true;
    self.submitButtonDisabled = true;

    if (self.contactform.$valid) {
      var emailto = '',
        emailcc = '',
        emailbcc = '',
        emailusers = [];
      if (typeof(self.inputEmail.item) !== 'undefined') {
        for (var i = 0; i < self.inputEmail.item.length; i++) {
          emailto += self.inputEmail.item[i].email + ';';
        }
        for (var i = 0; i < self.inputEmail.item.length; i++) {
          emailusers.push({ "ID": self.inputEmail.item[i].ID });
        }
      }
      if (typeof(self.inputCC.item) !== 'undefined') {
        for (var i = 0; i < self.inputCC.item.length; i++) {
          emailcc += self.inputCC.item[i].email + ';';
        }
        for (var i = 0; i < self.inputCC.item.length; i++) {
          emailusers.push({ "ID": self.inputCC.item[i].ID });
        }
      }
      if (typeof(self.inputBCC.item) !== 'undefined') {
        for (var i = 0; i < self.inputBCC.item.length; i++) {
          emailbcc += self.inputBCC.item[i].email + ';';
        }
        for (var i = 0; i < self.inputBCC.item.length; i++) {
          emailusers.push({ "ID": self.inputBCC.item[i].ID });
        }
      }
      var path = "../v1/email";
      var uniqcontacts = self._.uniq(emailusers, false, function(p) { return p.ID });

      var thedata = {
        "emailHead": {
          "_subject": self.input.Subject,
          "_to": emailto,
          "_cc": emailcc,
          "_bcc": emailbcc,
          "_date": self.moment(),
          "contacts": uniqcontacts,
          "inout": "out"
        },
        "emailBody": {
          "body": self.input.Message
        }
      };

      self.$log.log('about sendEmail ', thedata, path);


      return self.StudentServices.sendEmail(path, thedata)
        .then(function(data) {
          self.$log.log('sendEmail returned data');
          self.$log.log(data);
          if (!data.error) { //success comes from the return json object
            self.submitButtonDisabled = true;
            self.resultMessage = data.message;
            self.result = 'bg-success';
          }
          else {
            self.submitButtonDisabled = false;
            self.resultMessage = data.message;
            self.result = 'bg-danger';
          }

        }).catch(function(e) {
          self.$log.log('sendEmail failure:');
          self.$log.log("error", e);
          self.message = e;
          self.resultMessage = 'Failed  Please fill out all the fields.';
          self.submitButtonDisabled = false;
          self.result = 'bg-danger';
          self.Notification.error({ message: e, delay: 5000 });
          throw e;
        });
    }
    else {
      self.resultMessage = 'Failed: Please fill out all the fields.';
      self.result = 'bg-danger';
      self.submitButtonDisabled = false;
    }
  }




  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }

}
