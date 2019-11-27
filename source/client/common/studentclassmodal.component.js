import { ModalSetStudentClassController } from './studentclassmodal.controller';
import template from './modalSetStudentClass.html';

//actually this is a directive
//export const studentclassmodalComponent = () => {
//  'ngInject';
//  return {
export const studentclassmodalComponent = {
//    restrict: 'E',
//    transclude: true,
    bindings: {
      studentclassparent: '<',
      onUpdate: '&',
 //   scope: {
//      vm: "=mode",
//      searchclass: '@',
//      searchtext: '@'
    },
      scope:{},
    controller: ModalSetStudentClassController,
    template: template,
//    link: function(scope) {
//      scope.searchclass = scope.vm.mode == "add" ? "fa fa-search" : "fas fa-pencil-alt";
//      scope.searchtext = scope.vm.mode == "add" ? "Search" : "";
//    }
//  };
};
