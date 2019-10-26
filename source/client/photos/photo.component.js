import { ModalPicListerController } from './modal-piclister.controller';
import { ModalPicSearchController } from './modal-picupload.controller';
import { PhotoUploadController } from './photo-upload.controller';
import { ModalCameraController } from './modal-camera.controller';
import picuploadtemplate from './picupload.html';
import piclistertemplate from './picsearch.html';
import phototemplate from './photo.html';

export let photoComponent  = {
bindings: {},  
  controller: ModalCameraController,
  controllerAs: 'vmpicmodal',
  template: phototemplate
};

export let piclisterComponent  = {
bindings: {},  
  controller: ModalPicListerController,
  controllerAs: 'vmpicsearch',
  template: piclistertemplate
};

export let picsearchComponent  = {
bindings: {},  
  controller: ModalPicSearchController,
  controllerAs: 'vmpicselect',
  template: picuploadtemplate
};

export let picuploadComponent  = {
bindings: {},  
  controller: PhotoUploadController,
  controllerAs: 'vmstupicupload',
  template: picuploadtemplate
};
