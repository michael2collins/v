import angular from 'angular';
import { ngThumbupload } from './ngThumbupload.directive';
import { ModalPicListerController } from './modal-piclister.controller';
import { ModalPicSearchController } from './modal-picupload.controller';
import { ModalCameraController } from './modal-camera.controller';
import { photoComponent, piclisterComponent, picsearchComponent } from './photo.component';
import { PhotoServices } from '../../js/services/photoServices';
import { Util } from '../../js/utility/utility';

export const PhotoModule = angular
   .module('ngadmin.photo', [])
   .directive('ngThumbupload', ngThumbupload)
   .controller('ModalCameraController', ModalCameraController)
   .controller('ModalPicSearchController', ModalPicSearchController)
   .controller('ModalPicListerController', ModalPicListerController)
   .component('photoComponent', photoComponent)
   .component('piclisterComponent', piclisterComponent)
   .component('picsearchComponent', picsearchComponent)
   .service('PhotoServices', PhotoServices)
   .service('Util', Util)
   .name;
