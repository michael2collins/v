import angular from 'angular';
import {NgMenu } from './ngMenu.directive';
import {NgTab } from './ngTab.directive';
import {itemsDrag } from './itemsDrag.directive';
import {datepickerPopup} from './datepicker.directive';
import {img} from './img.directive';
import {imageloaded,backgroundloaded,disenableloaded,elementReady} from './imageloaded.directive';
import {ngPrint} from './printdir.directive';
import {scrollSpy} from './scrollSpy.directive';
import {spy} from './spy.directive';
import {uiGridEditDatepicker} from './ui-grid-edit-datepicker.directive';
import {myCustomDropdown} from './customdropdown.directive';
import {myCustomDropdownid} from './customdropdownid.directive';
import {zoom} from './zoom.directive';
import {sbLoad} from './sbLoad.directive';
import {fileChange} from './fileChange.directive';
import {validFile} from './validFile.directive';

import '../../client/includes/filtercoltemplate.html';
import '../../client/includes/filtercoltemplatevlu.html';
import '../../client/includes/filtercoltemplatevlu2id.html';

export const DirectiveModule =  angular
    .module('ngadmin.directives', [])
    .directive('ngMenu',NgMenu)
    .directive('ngTab',NgTab)
    .directive('itemsDrag',itemsDrag)
    .directive('datepickerPopup',datepickerPopup)
    .directive('img',img)
    .directive('imageloaded',imageloaded)
    .directive('backgroundloaded',backgroundloaded)
    .directive('disenableloaded',disenableloaded)
    .directive('elementReady',elementReady)
    .directive('ngPrint',ngPrint)
    .directive('scrollSpy',scrollSpy)
    .directive('spy',spy)
    .directive('myCustomDropdown',myCustomDropdown)
    .directive('myCustomDropdownid',myCustomDropdownid)
    .directive('zoom',zoom)
    .directive('sbLoad',sbLoad)
    .directive('fileChange',fileChange)
    .directive('validFile',validFile)
    .directive('uiGridEditDatepicker',uiGridEditDatepicker)
    .name;

