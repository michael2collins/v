
export class PhotoUtil {
    constructor($log, $uibModal, PhotoServices ) {
        'ngInject';
        this.$log = $log;
        this.PhotoServices = PhotoServices;
        this.$uibModal = $uibModal;
    }

    getPath(type) {    
        return type == "student" ? "students" : 
               type == "classes" ? "classes" :
               type == "user" ? "avatar" : "";

    }
    openPhotoModal(vm, dataToPass) {
        var photoModal = vm;
        photoModal.animationsEnabled = true;
        photoModal.dataToPass = dataToPass;
        photoModal.modalInstance = undefined;
        photoModal.retvlu = '';

        photoModal.modalInstance = this.$uibModal.open({
            animation: photoModal.animationsEnabled,
            component: 'photoComponent',
            size: 'md',
            windowClass: 'my-modal-popup',
            resolve: {
                dataToPass: function() {
                    photoModal.$log.log('resolve datatopass', photoModal.dataToPass);
                    return photoModal.dataToPass;
                }

            }
        });

        photoModal.modalInstance.opened.then(
            function(success) {
                photoModal.$log.log('photoModal ui opened:', success);

            },
            function(error) {
                photoModal.$log.log('photoModal ui failed to open, reason : ', error);
            }
        );
        photoModal.modalInstance.rendered.then(
            function(success) {
                photoModal.$log.log('photomodal ui rendered:', success);
            },
            function(error) {
                photoModal.$log.log('photoModal ui failed to render, reason : ', error);
            }
        );

        photoModal.modalInstance.result.then(
            function(retvlu) {
                photoModal.$log.log('search modalInstance result :', retvlu);
                photoModal.pictureurldecache = photoModal.userdta.pictureurl + '?decache=' + Math.random();

            },
            function(error) {
                photoModal.$log.log('photomodal ui failed to result, reason : ', error);
                photoModal.$log.info('Modal dismissed at: ' + new Date());
            });

    }
}
