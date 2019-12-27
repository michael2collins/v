export class ChildController {
   constructor($element) {
      this.$element=$element;
   }
   
   $onInit() {
      var vm=this;
      
   }

   fireEvent() {
      var vm = this;
      var event = new window.CustomEvent('customtype', { detail: new Date() });
      vm.$element[0].dispatchEvent(event);
   }

}
